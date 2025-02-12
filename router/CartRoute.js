import express from 'express';
import { verifySeller, verifyUser } from '../utils/verifyToken.js';
import { addToCart, deleteFromCart, getAllCartItems } from '../controller/CartController.js';

const router = express.Router();

// create new tour
router.route('/')
router.route('/:id').delete(verifyUser,deleteFromCart).post(verifyUser,addToCart).get(getAllCartItems)
// router.route('/search/getProductBySearch').get(getProductBySearch)

export default router