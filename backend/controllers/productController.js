import express from "express"
import Product from "../models/productModel.js"
import { Apifeatures } from "../utils/apifeature.js"
import User from "../models/userModel.js";
import cloudinary, { cloudinaryConfig }  from '../cloudinary/cloudinary.js';
import fs from 'fs';
import path from 'path';

// Create Product

export const createProduct = async (req, res) => {
    console.log("Creating product...");
    
    try {
        // Create uploads directory
        const uploadDir = path.join(process.cwd(), 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        
        // Parse incoming data
        const formData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
        const { name, description, price, category, author } = formData;

        let images = [];
        let productPDF = null;

        // Handle image uploads
        if (req.files && req.files.images) {
            for (const file of req.files.images) {
                const filePath = path.join(uploadDir, file.filename);
                
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: 'products/images',
                    width: 1000,
                    crop: "scale"
                });

                if (existsSync(filePath)) {
                    await fs.unlink(filePath);
                }
                
                images.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }
        }

        // Handle PDF upload
        if (req.files && req.files.productPDF && req.files.productPDF[0]) {
            const pdfFile = req.files.productPDF[0];
            const pdfPath = path.join(uploadDir, pdfFile.filename);
            
            const pdfResult = await cloudinary.uploader.upload(pdfPath, {
                resource_type: "raw",
                folder: "pdfs",
                use_filename: true,
                unique_filename: true,
                type: "private"
            });
            
            if (existsSync(pdfPath)) {
                await fs.unlink(pdfPath);
            }

            const downloadUrl = cloudinary.utils.private_download_url(
                pdfResult.public_id, 
                'pdf',
                { 
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    resource_type: "raw",
                    type: "private",
                    expires_at: Math.floor(Date.now()/1000) + 3600
                }
            );

            productPDF = {
                public_id: pdfResult.public_id,
                url: downloadUrl,
                filename: pdfFile.originalname
            };
        }

        // Create product
        const productData = {
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category: category.trim(),
            stock: 1,
            author: author.trim(),
            images,
            productPDF
        };

        const product = await Product.create(productData);
        console.log("Product created successfully:", product._id);

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Product creation error:", error);

        try {
            // Clean up temporary files
            if (req.files) {
                const uploadDir = path.join(process.cwd(), 'uploads');
                const files = Object.values(req.files).flat();
                
                for (const file of files) {
                    const filePath = path.join(uploadDir, file.filename);
                    if (existsSync(filePath)) {
                        await fs.unlink(filePath);
                    }
                }
            }
        } catch (cleanupError) {
            console.error("File cleanup error:", cleanupError);
        }

        res.status(500).json({
            success: false,
            message: "Failed to create product: " + error.message
        });
    }
};






// get products 
// Get All Products
// Get All Products
export const getAllProducts = async (req, res, next) => {
    const resultPerPage = 10;
    const currentPage = Number(req.query.page) || 1;

    try {
        const keywordFilter = req.query.keyword ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { description: { $regex: req.query.keyword, $options: "i" } }
            ]
        } : {};

        const categoryFilter = req.query.categories ? {
            category: { $in: req.query.categories.split(',') }
        } : {};

        const priceFilter = {};
        if (req.query.minPrice) {
            priceFilter.price = { $gte: Number(req.query.minPrice) };
        }
        if (req.query.maxPrice) {
            priceFilter.price = { ...priceFilter.price, $lte: Number(req.query.maxPrice) };
        }

        const filter = {
            ...keywordFilter,
            ...categoryFilter,
            ...priceFilter
        };

        const products = await Product.find(filter)
            .limit(resultPerPage)
            .skip(resultPerPage * (currentPage - 1));

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / resultPerPage);

        res.status(200).json({
            success: true,
            products,
            totalPages,
            currentPage,
            resultPerPage,
            filteredProductsCount: products.length,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};








//get product details
// Get Product Details
// Get Product Details
export const getProductDetails = async (req, res, next) => {
    try {
    
        
        // Find product by ID
        const product = await Product.findById(req.params.id);

        // If product does not exist, return 404 error
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }
        // Clone the product to avoid modifying the original Mongoose document
        const productData = product.toObject();

        // Check if the user has completed the payment for this product
        const userHasPaid = product.purchases.some(
            (purchase) => purchase.user.toString() === req.user._id.toString() && purchase.paymentStatus === 'completed'
        );

        console.log("User has paid:", userHasPaid);

        // Conditionally set the productPDF to null if payment is not completed
        if (!userHasPaid) {
            productData.productPDF = null; // Set the productPDF to null if the user hasn't paid
        }

        // Send back the full product details (with the modified productPDF if necessary)
        res.status(200).json({
            success: true,
            product: {...productData,paymentPaid:userHasPaid} // Return the product details (with or without the productPDF)
        });

    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching product details",
            error: error.message
        });
    }
};







// Update products-Admin
export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const formData = JSON.parse(req.body.data || '{}');
        const { name, description, price, category, author } = formData;

        // Handle image uploads
        if (req.files && req.files.images) {
            // Delete existing images from Cloudinary
            for (const image of product.images) {
                if (image.public_id) {
                    await cloudinary.uploader.destroy(image.public_id, {
                        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                        api_key: process.env.CLOUDINARY_API_KEY,
                        api_secret: process.env.CLOUDINARY_API_SECRET
                    });
                }
            }

            let images = [];
            for (const file of req.files.images) {
                const result = await cloudinary.uploader.upload(file.path, {
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                    folder: 'products/images',
                    width: 1000,
                    crop: "scale"
                });
                
                fs.unlinkSync(file.path);
                
                images.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }
            product.images = images;
        }

        // Handle PDF upload
        if (req.files && req.files.productPDF && req.files.productPDF[0]) {
            // Delete existing PDF from Cloudinary
            if (product.productPDF && product.productPDF.public_id) {
                await cloudinary.uploader.destroy(product.productPDF.public_id, {
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                    resource_type: "raw",
                    type: "private"
                });
            }

            const pdfFile = req.files.productPDF[0];
            const pdfResult = await cloudinary.uploader.upload(pdfFile.path, {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                resource_type: "raw",
                folder: "pdfs",
                use_filename: true,
                unique_filename: true,
                type: "private"
            });
            
            fs.unlinkSync(pdfFile.path);

            const downloadUrl = cloudinary.utils.private_download_url(
                pdfResult.public_id,
                'pdf',
                {
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    resource_type: "raw",
                    type: "private",
                    expires_at: Math.floor(Date.now()/1000) + 3600
                }
            );

            product.productPDF = {
                public_id: pdfResult.public_id,
                url: downloadUrl,
                filename: pdfFile.originalname
            };
        }

        // Update fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = parseFloat(price) || product.price;
        product.category = category || product.category;
        product.author = author || product.author;

        const updatedProduct = await product.save();

        res.status(200).json({
            success: true,
            product: updatedProduct,
            message: "Product updated successfully"
        });

    } catch (error) {
        if (req.files) {
            Object.values(req.files).flat().forEach(file => {
                if (file.path && fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

        console.error("Update Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
};













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
            avatar: req.user.avatar.url // Add user avatar URL to review
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
                    rev.avatar = req.user.avatar.url; // Update avatar on review edit
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
