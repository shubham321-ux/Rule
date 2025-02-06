import express from "express"
import Product from "../models/productModel.js"
import { Apifeatures } from "../utils/apifeature.js"



// Create Product
export const createProduct = async (req, res) => {

    try {
        const { name, description, price, category, stock,  author } = req.body;
 
        // Handle images
        let images = [];
        if (req.files && req.files.images) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            images = req.files.images.map(file => ({
                public_id: file.filename,
                url: `${baseUrl}/uploads/${file.filename}`
            }));
        }

        // Handle PDF - Modified this part
        let productPDF = null;
        if (req.files && req.files.productPDF && req.files.productPDF[0]) {
            const pdfFile = req.files.productPDF[0];
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            productPDF = {
                public_id: pdfFile.filename,
                url: `${baseUrl}/uploads/${pdfFile.filename}`,
                filename: pdfFile.originalname
            };
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            author,
            images,
            productPDF // Include this in creation
        });

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
// Get All Products
// Get All Products
export const getAllProducts = async (req, res, next) => {
    const resultPerPage = 1;
    const currentPage = Number(req.query.page) || 1;
   console.log("page count",currentPage)
    try {
        // Keyword filter for name and description
        const keywordFilter = req.query.keyword ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: "i" } },
                { description: { $regex: req.query.keyword, $options: "i" } }
            ]
        } : {};

        // Category filter
        const categoryFilter = req.query.category ? {
            category: { $regex: req.query.category, $options: "i" }
        } : {};

        // Price range filter
        const priceFilter = {};
        if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
        const priceRangeFilter = Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {};

        // Combine all filters
        const filter = {
            ...keywordFilter,
            ...categoryFilter,
            ...priceRangeFilter
        };

        // Sort options
        const sort = {};
        if (req.query.sort) {
            const [field, order] = req.query.sort.split(':');
            sort[field] = order === 'desc' ? -1 : 1;
        }

        // Fetch products with filters and pagination
        const products = await Product.find(filter)
            .sort(sort)
            .limit(resultPerPage)
            .skip(resultPerPage * (currentPage - 1));

        // Handle PDF access based on purchase status
        for (const product of products) {
            const userHasPaid = product.purchases.some(
                (purchase) => purchase.paymentStatus === 'completed'
            );
            if (!userHasPaid) {
                product.productPDF = null;
            }
        }

        // Get total number of products matching the filter
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / resultPerPage);
         console.log("total pages ",totalPages)
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

        // Handle new images if uploaded
        if (req.files && req.files['images']) {
            // Ensure that `req.files.images` is always an array (in case only one image is uploaded)
            const files = Array.isArray(req.files['images']) ? req.files['images'] : [req.files['images']];
            
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const newImages = files.map(file => ({
                public_id: file.filename,
                url: `${baseUrl}/uploads/${file.filename}`
            }));

            // If there are no images uploaded, set an empty array
            req.body.images = newImages.length > 0 ? newImages : [];
        } else {
            // If no images are uploaded, ensure images is an empty array
            req.body.images = [];
        }

        // Handle new PDF if uploaded
        if (req.files && req.files['productPDF']) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const pdfFile = req.files['productPDF'][0];
            req.body.productPDF = {
                public_id: pdfFile.filename,
                url: `${baseUrl}/uploads/${pdfFile.filename}`,
                filename: pdfFile.originalname
            };
        }

        // Update the product with the new data
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).json({
            success: false,
            message: "Server Error: Unable to update product",
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
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);  // Add this to see if Content-Type is correct

    try {
        const { rating, comment, productId } = req.body;
        console.log("Rating:", rating, "Comment:", comment, "ProductId:", productId);  // Log each piece of data

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
