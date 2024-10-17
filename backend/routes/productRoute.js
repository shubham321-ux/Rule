import express from 'express';
import { getAllProducts } from '../controllers/productController.js';
import { createProduct,updateProduct,deleteProduct,getProductDetails,createProductReview,getProductReviews,deleteReview} from '../controllers/productController.js';
import {isauthenticatedUser,authorizeRolesadmin} from "../middleware/auth.js"
const productrouter = express.Router();

 productrouter.get('/products',getAllProducts);
 productrouter.post('/product/new',authorizeRolesadmin,isauthenticatedUser,createProduct)
 productrouter.put('/product/update/:id',isauthenticatedUser,updateProduct)
 productrouter.delete('/product/delete/:id',isauthenticatedUser,deleteProduct)
 productrouter.get('/product/detail/:id',authorizeRolesadmin,getProductDetails)
productrouter.put('/product/review',isauthenticatedUser,createProductReview)
productrouter.get('/product/reviews',getProductReviews)
productrouter.delete('/product/review/delete',isauthenticatedUser,authorizeRolesadmin,deleteReview)
export default  productrouter;
