import mongoose from "mongoose";
import validator from "validator";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,"please enter your name"],
        maxLength:[30,"name cannot exceed 30 character"],
        miniLength:[5,"name shoud have more than 5 character"]

    },
    email:{
        type:String,
        require:[true,"plase enter email"],
        validate:[validator,"plase enter valid email"],

    },
    password:{
        type:String,
        require:[true,"plase enyer your password"],
        minLength:[8,"pasword should be 8 character"],
        select:false,
    },
    avatar:
        {
            public_id:{
                type:String,
                require:true
            },
            url:{
                type:String,
                require:true
            }
        },
    role:{
        type:String,
        default:"user"
    },
    resetpasswordToken:String,
    resetPasswordExpire:Date,
    
    
})

 const User = mongoose.model("User",userSchema)
 export default User
