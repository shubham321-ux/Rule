import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isauthenticatedUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || 
                     req.headers.authorization?.replace('Bearer ', '') ||
                     req.body.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please log in first",
            });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData.id);

        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export const authorizeRolesadmin = async (req, res, next) => {
    try {
        const token = req.cookies.token || 
                     req.headers.authorization?.replace('Bearer ', '') ||
                     req.body.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please log in first"
            });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedData.id);

        if (user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "Access denied: Admin only"
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};
