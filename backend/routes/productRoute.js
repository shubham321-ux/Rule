import express from 'express';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } from '../controllers/productController.js';
import { isauthenticatedUser, authorizeRolesadmin } from "../middleware/auth.js";
import upload from '../multer/multer.js';

const productrouter = express.Router();

productrouter.get('/products', getAllProducts);

productrouter.post('/product/new', 
    isauthenticatedUser, 
    authorizeRolesadmin,
    upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'productPDF', maxCount: 1 }
    ]),
    createProduct
);

productrouter.put('/product/update/:id', 
    isauthenticatedUser,
    upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'productPDF', maxCount: 1 }
    ]),
    updateProduct
);

productrouter.delete('/product/delete/:id', isauthenticatedUser, deleteProduct);
productrouter.get('/product/detail/:id',isauthenticatedUser, getProductDetails);
productrouter.put('/product/review', isauthenticatedUser, createProductReview);
productrouter.get('/product/reviews', getProductReviews);
productrouter.delete('/product/review/delete', isauthenticatedUser, authorizeRolesadmin, deleteReview);

export default productrouter;
