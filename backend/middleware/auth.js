import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
export const isauthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        res.status(401).json(
            {
                success: false,
                massage: "plase log in first"
            }
        )
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decodeData)
    req.user = await User.findById(decodeData.id);
    next()
}

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
