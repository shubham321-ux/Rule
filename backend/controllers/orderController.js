import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export const newOrder = async (req, res) => {
    try {
        const {
            orderItems,
            itemsPrice,
            taxPrice,
            totalPrice,
            productId
        } = req.body;

        // Verify product purchase
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if user has successfully paid for this product
        const purchase = product.purchases.find(
            (p) => p.user.toString() === req.user._id.toString() && p.paymentStatus === 'completed'
        );

        if (!purchase) {
            return res.status(403).json({
                success: false,
                message: "Payment required before creating order"
            });
        }

        // Ensure orderItems include image if not provided
        orderItems.forEach(item => {
            if (!item.image) {
                item.image = product.images[0]?.url || '/default-image.jpg'; // Default image if not provided
            }
        });

        // Check if the product has a PDF and payment is completed
        let pdf = null;
        if (purchase.paymentStatus === 'completed' && product.productPDF?.url) {
            pdf = {
                url: product.productPDF.url,
                fileName: product.productPDF.fileName || 'default-file.pdf',
                size: product.productPDF.size || 0,
                contentType: product.productPDF.contentType || 'application/pdf'
            };
           
        }

        // Create the order
        const order = await Order.create({      
            orderItems,
            pdf: pdf,  // Store the full PDF object
            itemsPrice,
            taxPrice,
            totalPrice,
            paidAt: Date.now(), // Set payment time
            user: req.user._id,
            orderStatus: "Delivered", // Default to Delivered
            deliveredAt: Date.now(), // Set delivered time
            paymentInfo: {
                id: purchase.paymentId,
                status: "completed",
                paidAt: Date.now() // Set paidAt time
            },
            shippingInfo: {
                phoneNo: '',    // You can skip shipping fields or set default values
                pinCode: '',
                country: '',
                state: '',
                city: '',
                address: ''
            },
        });

        // Log order data to confirm the pdf object is included
        console.log("Order created:", order);

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error in creating order:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};





// Get single order by ID
export const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with this Id",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all orders of the logged-in user
export const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all orders (for admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        let totalAmount = 0;
        orders.forEach((order) => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update order status
export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found with this Id",
            });
        }

        if (order.orderStatus === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Order already delivered",
            });
        }

        order.orderStatus = req.body.status;  // Update the order status
        order.deliveredAt = order.orderStatus === 'Delivered' ? Date.now() : null;
        await order.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Order status updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete order by ID
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};