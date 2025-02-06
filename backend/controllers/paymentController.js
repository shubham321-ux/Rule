import Product from '../models/productModel.js';
import Razorpay from 'razorpay';
import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from "dotenv"
import User from '../models/userModel.js';
import { sendEmail } from '../utils/sendEmail.js';
dotenv.config({path:"./config/.env"});
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const processPayment = async (req, res) => {
    console.log("Processing payment...");
    try {
        const { productId } = req.body;
        // console.log(productId);

        // Validate productId as a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Create an order with Razorpay
        const amount = product.price * 100;  // Razorpay accepts the amount in paise (1 INR = 100 paise)
        const currency = 'INR';  // Set the currency as INR for India

        const options = {
            amount: amount,  // amount in paise
            currency: currency,
            receipt: `receipt-${Date.now()}`,
            payment_capture: 1  // Automatically capture the payment
        };

        // Create the order
        const razorpayOrder = await razorpay.orders.create(options);

        if (!razorpayOrder) {
            return res.status(500).json({
                success: false,
                message: "Error creating Razorpay order"
            });
        }

        // Return the payment details to the client
        res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: product.price,
            product: product,
            message: "Ready for payment",
        });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const confirmPayment = async (req, res) => {
    try {
        // Log the request body for debugging
        console.log("Request body:", req.body);

        // Get the user ID from the request object
        const userId = req.user._id;
        
        // Fetch the user details from the User model
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Destructure payment information from the request body
        const { 
            productId: { 
                productId, 
                razorpayPaymentId, 
                razorpayOrderId, 
                razorpaySignature, 
                paymentStatus 
            } 
        } = req.body;

        // Validate the productId
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Valid Product ID is required"
            });
        }

        // Validate the payment status
        if (paymentStatus !== 'success') {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Verify the Razorpay signature
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');
        
        console.log('Received Signature:', razorpaySignature);
        console.log('Expected Signature:', expectedSignature);

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: "Payment signature mismatch"
            });
        }

        // Fetch the product details from the Product model
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Ensure that the product PDF is available
        if (!product.productPDF || !product.productPDF.url) {
            return res.status(400).json({
                success: false,
                message: "Product PDF not available"
            });
        }

        // Check if the user has already purchased the product
        const existingPurchase = product.purchases.find(
            (p) => p.user.toString() === userId.toString()
        );

        if (existingPurchase) {
            console.log("User has already purchased this product, returning PDF URL.");
            return res.status(200).json({
                success: true,
                pdfUrl: product.productPDF.url,
                message: "PDF already purchased"
            });
        }
        
        // Record the purchase after successful payment
        product.purchases.push({
            user: userId,
            paymentStatus: 'completed',
            paymentId: razorpayPaymentId
        });

        // Save the updated product
        const savedProduct = await product.save();
        console.log("Purchase recorded successfully.");

        // Prepare the confirmation message and send email
        const message = `You have successfully purchased the product. Access the PDF here: ${savedProduct.productPDF.url}`;

        // Send the email confirmation
        const userEmail = user.email;
        await sendEmail({
            email: userEmail,
            subject: "Book Purchase Confirmation",
            message
        });
        console.log("Email sent successfully.");

        // Return the PDF URL if the purchase was successful
        res.status(200).json({
            success: true,
            pdfUrl: savedProduct.productPDF.url,
            message: "Payment successful! You can now download the PDF."
        });

    } catch (error) {
        console.error("Payment confirmation error:", error);
        res.status(500).json({
            success: false,
            message: "Payment confirmation failed: " + error.message
        });
    }
};





export const getPdfAccess = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }

        // Fetch the product
        const product = await Product.findById(productId);

        // Check if product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Fetch the user from the database using the req.user._id
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        const userEmail = user.email;

        // Check if the user has completed the purchase for the product
        const purchase = product.purchases.find(
            p => p.user.toString() === req.user._id.toString() && p.paymentStatus === 'completed'
        );

        if (!purchase) {
            return res.status(403).json({
                success: false,
                message: "Purchase required to access PDF"
            });
        }

        // Send confirmation email
        const message = `You have successfully purchased the product. Access the PDF here: ${product.productPDF.url}`;
        
        // Send the email using sendEmail function
        try {
            await sendEmail({
                email: userEmail,
                subject: "Book Purchase Confirmation",
                message
            });
            console.log('Email sent successfully to:', userEmail);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(500).json({
                success: false,
                message: "Error sending confirmation email"
            });
        }

        // Return the PDF URL if purchase is successful
        res.status(200).json({
            success: true,
            pdfUrl: product.productPDF.url
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

