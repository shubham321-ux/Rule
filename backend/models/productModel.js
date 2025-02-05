import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "please enter product description"]
    },
    price: {
        type: Number,
        required: [true, "please enter price"],
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    productPDF: {
        public_id: {
            type: String
        },
        url: {
            type: String
        },
        filename: {
            type: String
        },
      
    },
    category: {
        type: String,
        required: [true, "please enter product category"]
    },
    author:{
        type: String,
        required: [true, "please enter product author"]
    },
    stock: {
        type: Number,
        default: 1,
        required: [false, "please enter stock"],
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }],
    purchases: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        },
        paymentId: {
            type: String
        },
        purchaseDate: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
