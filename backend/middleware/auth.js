import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
export const isauthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        res.status(401).json(
            {
                success:false,
                massage: "plase log in first"
            }
        )
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodeData.id);
    next()
}