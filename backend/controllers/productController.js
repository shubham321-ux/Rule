import express from "express"
import Product from "../models/productModel.js"
import { Apifeatures } from "../utils/apifeature.js"



// Create Product
export const createProduct = async (req, res) => {
    try {
        // Destructure the product data from the request body
        const { name, description, price, category, stock, images } = req.body;

        // Validation: Check if required fields are missing
        if (!name || !description || !price || !category || !stock ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields: name, description, price, category, stock, and images."
            });
        }

        // Create a new product
        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            images
        });

        // Send the success response with product details
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error in createProduct:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Unable to create product",
            error: error.message
        });
    }
};


// get products 
export const getAllProducts = async (req, res, next) => {
    const resultPerPage = 4; 
    const currentPage = Number(req.query.page) || 1; // Current page from query or default to 1

    try {
        // Building the query based on filters
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: "i"
            }
        } : {};

        // Fetching the products with filtering, pagination, and sorting
        const products = await Product.find({ ...keyword })
            .limit(resultPerPage) // Limit to the number of products per page
            .skip(resultPerPage * (currentPage - 1)); // Skip products for previous pages

        const totalProducts = await Product.countDocuments(); // Get total products count
        const totalPages = Math.ceil(totalProducts / resultPerPage); // Calculate total pages

        res.status(200).json({
            message: "Route is working",
            products,
            totalPages,
            currentPage // Optional: return the current page for client use
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




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


//create review and update review
export const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        if (!rating || !productId) {
            return res.status(400).json({
                success: false,
                message: "Rating and productId are required"
            });
        }

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString()) {
                    rev.rating = rating;
                    rev.comment = comment;
                }
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let avg = 0;
        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });

        product.rating = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Review added successfully",
        });
    } catch (error) {
        console.error("Error in createProductReview:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding the review",
            error: error.message
        });
    }
};

//get all reviews of a product
export const getProductReviews = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            reviews: product.reviews,
        });
    }
    catch (error) {
        console.error("Error in getProductReviews:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching product reviews",
            error: error.message
        });
    }

}

//delete review
export const deleteReview = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const reviews = product.reviews.filter(
            (rev) => rev._id.toString() !== req.query.id.toString()
        );

        let avg = 0;
        reviews.forEach((rev) => {
            avg += rev.rating;
        });

        const numOfReviews = reviews.length;
        const rating = numOfReviews === 0 ? 0 : avg / numOfReviews;

        await Product.findByIdAndUpdate(
            req.query.productId,
            {
                reviews,
                rating,
                numOfReviews,
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleteReview:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the review",
            error: error.message
        });
    }
};
