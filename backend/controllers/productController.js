import express from "express"
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
    const resultPerPage = 5;
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
