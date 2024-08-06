import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        maxlength: [30, "name cannot exceed 30 characters"],
        minlength: [5, "name should have more than 5 characters"]
    },
    email: {
        type: String,
        required: [true, "please enter email"],
        validate: [validator.isEmail, "please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minlength: [8, "password should be at least 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

 const User = mongoose.model("User",userSchema)
 export default User
