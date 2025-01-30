import express from 'express';
import { 
    registeruser, 
    loginuser, 
    logoutuser, 
    forgotpassword, 
    resetpassword, 
    getuser, 
    updatepassword, 
    userupdate, 
    getAllUsers, 
    getSingleUser, 
    updateUserRole, 
    deleteuser ,
    getUserFromToken
    
} from '../controllers/userController.js';
import { isauthenticatedUser, authorizeRolesadmin } from "../middleware/auth.js";
import upload from "../multer/multer.js"; // Import the Multer configuration

const userrouter = express.Router();

// Register user - Public (with avatar upload)
userrouter.post('/register/user', registeruser);

// Login user - Public
userrouter.post('/login/user', loginuser);

// Logout user - Protected (authentication required)
userrouter.get('/logout/user', isauthenticatedUser, logoutuser);

// Forgot password - Public
userrouter.post('/password/forgot', forgotpassword);

// Reset password - Public (via token)
userrouter.put('/password/reset/:token', resetpassword);

// Get the currently logged-in user - Protected (authentication required)
userrouter.get('/me', isauthenticatedUser, getuser);

//get user from cookie
userrouter.get('userfromToken',isauthenticatedUser,getUserFromToken)

// Update password - Protected (authentication required)
userrouter.put('/password/update', isauthenticatedUser, updatepassword);

// Update user details - Protected (authentication required)
userrouter.put('/user/update', isauthenticatedUser, userupdate);

// Admin routes
userrouter.get('/admin/users', isauthenticatedUser, authorizeRolesadmin, getAllUsers);
userrouter.get('/admin/user/:id', isauthenticatedUser, authorizeRolesadmin, getSingleUser);
userrouter.post('/admin/updateUserRole', isauthenticatedUser, authorizeRolesadmin, updateUserRole);
userrouter.delete('/admin/deleteUser/:id', isauthenticatedUser, authorizeRolesadmin, deleteuser);

export default userrouter;
