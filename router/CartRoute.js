import express from 'express';
import { createProduct, getAllProducts, getSingleProduct, deleteProduct,updateProduct } from '../controller/ProductsController.js';
import { verifySeller, verifyUser } from '../utils/verifyToken.js';
import { addToCart, deleteFromCart } from '../controller/CartController.js';

const router = express.Router();

// create new tour
router.route('/:id').delete(verifyUser,deleteFromCart).post(verifyUser,addToCart)
// router.route('/search/getProductBySearch').get(getProductBySearch)

export default router