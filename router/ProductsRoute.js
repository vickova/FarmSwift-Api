import express from 'express';
import { createProduct, getAllProducts, getSingleProduct, deleteProduct,updateProduct, getProductBySearch } from '../controller/ProductsController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// create new tour
router.route('/').post(verifyAdmin,createProduct).get(getAllProducts)
router.route('/:id').get(getSingleProduct).delete(verifyAdmin,deleteProduct).put(verifyAdmin,updateProduct)
router.route('/search/getProductBySearch').get(getProductBySearch)

export default router