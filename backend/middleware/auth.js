import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
export const isauthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;  // Getting the token from cookies

    // If there is no token, return a 401 error with a message
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please log in first",
        });
    }

    try {
        // Verify the token and decode it to get the user ID
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database using the decoded token's user ID
        req.user = await User.findById(decodedData.id);

        // If no user is found with the decoded ID, return a 404 error
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Proceed to the next middleware or route handler if the user is authenticated
        next();
    } catch (error) {
        // In case of any error (token verification failure, invalid token, etc.), return a 401 error
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
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
