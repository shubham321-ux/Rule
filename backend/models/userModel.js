import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { useCallback } from "react";
import jwt from "jsonwebtoken";
import  crypto from "crypto";
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
        validate: [validator.isEmail, "please enter a valid email"],
        unique: true
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
            // required: true
        },
        url: {
            type: String,
            // required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

});

//hashing password
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//forgot password
userSchema.methods.getResetPasswordToken = function () {
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex")
   //hashing and adding resetpasswordtoken to userSchema
   this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000
   return resetToken
}

const User = mongoose.model("User", userSchema)
export default User
