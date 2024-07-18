import express from 'express';
import { registeruser } from '../controllers/userController.js';
const userrouter=express.Router()
userrouter.post('/register/user',registeruser)

export default userrouter

