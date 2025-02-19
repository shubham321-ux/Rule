import express from 'express';
import { processPayment, confirmPayment, getPdfAccess } from '../controllers/paymentController.js';
import { isauthenticatedUser } from '../middleware/auth.js';

const paymentRouter = express.Router();

paymentRouter.post('/payment/process', isauthenticatedUser,  processPayment);
paymentRouter.post('/payment/confirm', isauthenticatedUser,  confirmPayment);
paymentRouter.get('/pdf/access/:productId', isauthenticatedUser,  getPdfAccess);

export default paymentRouter;
