import express from 'express';
import { registeruser,loginuser, logoutuser,forgotpassword, resetpassword,getuser,updatepassword,userupdate, getAllUsers,getSingleUser,updateUserRole,deleteuser} from '../controllers/userController.js';
import {isauthenticatedUser,authorizeRolesadmin} from "../middleware/auth.js"
const userrouter=express.Router()

userrouter.post('/register/user',registeruser)
userrouter.post('/login/user',loginuser)
userrouter.get('/logout/user',logoutuser)
userrouter.post('/password/forgot',forgotpassword)
userrouter.put('/password/reset/:token',resetpassword)
userrouter.get('/me',getuser)
userrouter.post('/password/update',updatepassword)
userrouter.put('/user/update',userupdate)
userrouter.get('/admin/users',authorizeRolesadmin,getAllUsers)
userrouter.get('/admin/user/:id',authorizeRolesadmin,getSingleUser)
userrouter.post('/admin/updateUserRole',authorizeRolesadmin,updateUserRole)
userrouter.delete('/admin/deleteUser/:id',authorizeRolesadmin,deleteuser)
export default userrouter

