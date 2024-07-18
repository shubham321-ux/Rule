import User from "../models/userModel.js"

//register user 

export const registeruser = async (req, res, next) => {
    const user = await User.create(req.body)
    res.status(200).json({
        success: true,
        user
    })
}