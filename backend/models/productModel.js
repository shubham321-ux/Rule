import mongoose from "mongoose";
const productSchema=mongoose.Schema({
    name:{
        type:String,
        require:[true,"please enter product name"],
        trim:true
    },
    description:{
        type:String,
        require:[true,"please enter product description"]
    },
    price:{
        type:Number,
        require:[true,"please enter price"],
        maxLength:[8,"price cannot exceed 8 characters"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[{
        public_id:{
            type:String,
            require:true
        },
        url:{
            type:String,
            require:true
        }
    }],
    category:{
        type:String,
        require:[true," please enter product category "]
    },
    stock:{
        type:Number,
        require:[true,"please enter stock"],
        maxLength:[4,"stock cannot exceed 4 characters"]
    },
    numOfReviews:{
        type:Number,
        default:0,

    },
    reviews:[
        {
            name:{
                type:String,
                require:true
            },
            rating:{
                type:Number,
                require:true
            },
            comment:{
              type:String,
              require:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
}
})

const Product = mongoose.model('Product', productSchema);
 export default Product