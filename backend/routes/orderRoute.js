import express from 'express';
import { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } from '../controllers/orderController.js';
import { isauthenticatedUser, authorizeRolesadmin } from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post('/order/new', isauthenticatedUser, newOrder);
orderRouter.get('/order/:id', isauthenticatedUser, getSingleOrder);
orderRouter.get('/orders/me', isauthenticatedUser, myOrders);
orderRouter.get('/admin/orders', isauthenticatedUser, authorizeRolesadmin, getAllOrders);
orderRouter.put('/admin/order/:id', isauthenticatedUser, authorizeRolesadmin, updateOrder);
orderRouter.delete('/admin/order/:id', isauthenticatedUser, authorizeRolesadmin, deleteOrder);

export default orderRouter;
