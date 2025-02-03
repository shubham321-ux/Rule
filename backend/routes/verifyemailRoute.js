import express from 'express';
import { verifyEmail } from '../utils/mailConfig.js';

const VerifyEmailrouter = express.Router();

VerifyEmailrouter.post('/verify-email', verifyEmail);

export default VerifyEmailrouter;
