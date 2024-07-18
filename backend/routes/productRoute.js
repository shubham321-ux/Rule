import express from 'express';
import { getAllProducts } from '../controllers/productController.js';
import { createProduct,updateProduct,deleteProduct,getProductDetails } from '../controllers/productController.js';
const productrouter = express.Router();

 productrouter.get('/products', getAllProducts);
 productrouter.post('/product/new',createProduct)
 productrouter.put('/product/update/:id',updateProduct)
 productrouter.delete('/product/delete/:id',deleteProduct)
 productrouter.get('/product/detail/:id',getProductDetails)

export default  productrouter;
