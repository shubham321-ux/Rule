import express from 'express';
import { registeruser,loginuser, logoutuser } from '../controllers/userController.js';
const userrouter=express.Router()

userrouter.post('/register/user',registeruser)
userrouter.post('/login/user',loginuser)
userrouter.get('/logout/user',logoutuser)

export default userrouter

