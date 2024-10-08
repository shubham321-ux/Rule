import express from 'express';
import { newOrder, myOrders, getSingleOrder, getAllOrders, updateOrder,deleteOrder } from '../controllers/orderController.js';
import { isauthenticatedUser, authorizeRolesadmin } from "../middleware/auth.js"
const orderrouter = express.Router()

orderrouter.post('/order/new', isauthenticatedUser, newOrder)
orderrouter.get('/order/me', isauthenticatedUser, myOrders)
orderrouter.get('/order/:id', isauthenticatedUser, authorizeRolesadmin, getSingleOrder)
orderrouter.get('/orders/all', isauthenticatedUser, authorizeRolesadmin, getAllOrders)
orderrouter.put('/order/:id', isauthenticatedUser, authorizeRolesadmin, updateOrder)
orderrouter.delete('/orderone/:id', isauthenticatedUser, authorizeRolesadmin, deleteOrder)
export default orderrouter;

