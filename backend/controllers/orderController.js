import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

//create new order
export const newOrder = async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });
    res.status(201).json({
        success: true,
        order,
    });

};

//get single order
export const getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found with this Id",
      });
    }
    res.status(200).json({
        success: true,
        order,
    });
};

//get logged in user orders
export const myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
        success: true,
        orders,
    });
};


//get all orders --admin
export const getAllOrders = async (req, res, next) => {
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
};

///update order status --admin
export const updateOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
       res.status(404).json({
            success: false,
            message: "Order not found with this Id",
        });
    }
    if (order.orderStatus === "Delivered") {
       res.status(400).json({
            success: false,
            message: "You have already delivered this order",
        });
    }
    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
};
const updateStock = async (id, quantity) => {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
};

//delete order --admin
export const deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }
    // await order.remove();
    res.status(200).json({
        order,
        success: true,
    });
};


