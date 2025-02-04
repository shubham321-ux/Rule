import Product from '../models/productModel.js';
import Razorpay from 'razorpay';
import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from "dotenv"
dotenv.config({path:"./config/.env"});
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const processPayment = async (req, res) => {
    console.log("Processing payment...");
    try {
        const { productId } = req.body;
        console.log(productId);

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

        const { 
            productId: { 
                productId, 
                razorpayPaymentId, 
                razorpayOrderId, 
                razorpaySignature, 
                paymentStatus 
            } 
        } = req.body;

        // Validate productId
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Valid Product ID is required"
            });
        }

        // Validate payment status
        if (paymentStatus !== 'success') {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Verify Razorpay signature
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

        // Retrieve the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Ensure the PDF is available only after payment confirmation
        if (!product.productPDF || !product.productPDF.url) {
            return res.status(400).json({
                success: false,
                message: "Product PDF not available"
            });
        }

        // Check if the user has already purchased the product
        const existingPurchase = product.purchases.find(
            (p) => p.user.toString() === req.user._id.toString()
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
            user: req.user._id,
            paymentStatus: 'completed',
            paymentId: razorpayPaymentId
        });

        const savedProduct = await product.save();
        console.log("Purchase recorded successfully.");

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

        const product = await Product.findById(productId);

        // Check if product exists
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

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

        // Return the PDF URL if purchase is successful
        res.status(200).json({
            success: true,
            pdfUrl: product.productPDF.url
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
