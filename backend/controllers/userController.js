import User from "../models/userModel.js"

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
        const token=user.getJWTToken()
        res.status(201).json({
            success: true,
            user,
            message: "user created successfully",
            token
            
        })
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
        const token = user.getJWTToken()
        res.status(200).json({
            success: true,
            user,
            token
        })
    }
    catch (error) {
        console.log(error)
    }
}