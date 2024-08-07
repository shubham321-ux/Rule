import express from 'express';
import { getAllProducts } from '../controllers/productController.js';
import { createProduct,updateProduct,deleteProduct,getProductDetails } from '../controllers/productController.js';
import {isauthenticatedUser} from "../middleware/auth.js"
const productrouter = express.Router();

 productrouter.get('/products',  getAllProducts);
 productrouter.post('/product/new',isauthenticatedUser,createProduct)
 productrouter.put('/product/update/:id',isauthenticatedUser,updateProduct)
 productrouter.delete('/product/delete/:id',isauthenticatedUser,deleteProduct)
 productrouter.get('/product/detail/:id',getProductDetails)

export default  productrouter;
