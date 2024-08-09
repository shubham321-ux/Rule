import express from 'express';
import { registeruser,loginuser, logoutuser,forgotpassword } from '../controllers/userController.js';
const userrouter=express.Router()

userrouter.post('/register/user',registeruser)
userrouter.post('/login/user',loginuser)
userrouter.get('/logout/user',logoutuser)
userrouter.post('/password/forgot',forgotpassword)

export default userrouter

