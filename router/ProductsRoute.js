import express from 'express';
import { createProduct, getAllProducts, getSingleProduct, deleteProduct,updateProduct, getProductBySearch } from '../controller/ProductsController.js';
import { verifySeller } from '../utils/verifyToken.js';

const router = express.Router();

// create new tour
router.route('/').post(verifySeller,createProduct).get(getAllProducts)
router.route('/:id').get(getSingleProduct).delete(verifySeller,deleteProduct).put(verifySeller,updateProduct)
// router.route('/search/getProductBySearch').get(getProductBySearch)

export default router