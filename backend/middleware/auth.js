import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
export const isauthenticatedUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

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
    const { token } = req.cookies
    if (!token) {
        res.status(401).json(
            {
                success: false,
                massage: "plase log in first"
            })
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decodeData.id)
    if (user.role !== 'admin') {
        res.status(401).json(
            {
                success: false,
                massage: "you are user not admin"
            }
        )
        console.log("you are not amin")
    }else{
        console.log("hello welcom ypu are admin")
        next()
    }
}
