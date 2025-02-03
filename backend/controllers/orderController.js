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
        const purchase = product.purchases.find(
            p => p.user.toString() === req.user._id.toString() &&
                p.paymentStatus === 'completed'
        );

        if (!purchase) {
            return res.status(403).json({
                success: false,
                message: "Payment required before creating order"
            });
        }

        // Ensure orderItems include image
        orderItems.forEach(item => {
            if (!item.image) {
                item.image = product.images[0]?.url || '/default-image.jpg'; // Default image if not provided
            }
        });

        const order = await Order.create({
            orderItems,
            itemsPrice,
            taxPrice,
            totalPrice,
            paidAt: Date.now(), // Set payment time
            user: req.user._id,
            orderStatus: "Processing",
            deliveredAt: Date.now(), // Since it's a digital product, set deliveredAt to now
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
            }
        });

        res.status(201).json({
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


export const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
        );
        
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

        order.orderStatus = req.body.status;
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
