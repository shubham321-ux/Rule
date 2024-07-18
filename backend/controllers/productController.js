import Product from "../models/productModel.js"
import { Apifeatures } from "../utils/apifeature.js"



//create product
export const createProduct = async (req, res, next) => {
    const product = await Product.create(req.body)
    res.status(200).json({
        success: true,
        product
    })
}


// get products 
export const getAllProducts = async (req, res, next) => {
    const resultPerPage=5;
    const apifeature = new Apifeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)
    const products = await apifeature.query
    res.status(200).json(
        {
            meassage: "route is working",
            products
        })

}



//get product details
export const getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        res.status(500).json({
            message: "product not found",
            success: false
        })
    }
    res.status(200).json({
        success: true,
        product
    })
}



// Update products-Admin
export const updateProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(500).json({
            success: false,
            meassage: 'product not found'
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
}



//delete product
export const deleteProduct = async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(500).json({
            meassage: "product not found",
            success: false,
        })
    }
    await product.deleteOne()
    res.status(200).json({
        success: true,
        message: "producte delete",
    })
}
