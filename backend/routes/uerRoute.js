import express from 'express';
import { registeruser,loginuser } from '../controllers/userController.js';
const userrouter=express.Router()

userrouter.post('/register/user',registeruser)
userrouter.post('/login/user',loginuser)

export default userrouter

