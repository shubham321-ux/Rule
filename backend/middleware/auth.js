import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const isauthenticatedUser = async (req, res, next) => {
    try {
        // Check for token in both cookie and Authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
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

export const authorizeRolesadmin = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

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
