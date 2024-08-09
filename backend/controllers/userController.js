import User from "../models/userModel.js"
import { sendToken } from "../utils/jwttocken.js"
import { sendEmail } from "../utils/sendEmail.js"
//register user 

export const registeruser = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: "this is a sample id",
                url: "profilepicUrl"
            }
        });
        sendToken(user, 201, res)
    }
    catch (error) {
        console.log(error)
    }
}

//login user

export const loginuser = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        const isPasswordMatched = await user.comparePassword(password)
        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "incorrect password"
            })
        }
        sendToken(user, 201, res)
    }
    catch (error) {
        console.log(error)
    }
}

//logout user
export const logoutuser = async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.status(200).json({
        success: true,
        message: "logout"
    })
}

///forgot password
export const forgotpassword = async (req, res, next) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if
            (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        const resetToken = user.getResetPasswordToken()
        await user.save()
        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
        const message = `your password reset token is as follow \n\n ${resetUrl} \n\n if you have not requested this email then please ignore it`
        try {
            await sendEmail({
                email: user.email,
                subject: "password reset token",
                message
            })
            res.status(200).json({
                success: true,
                message: `email sent to ${user.email} successfully`
            })
        }
        catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save()
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    }
    catch (error) {
        console.log(error)
    }
}
