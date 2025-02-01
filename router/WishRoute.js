import express from 'express';
import { verifySeller, verifyUser } from '../utils/verifyToken.js';
import { addToWish, deleteFromWish } from '../controller/WishController.js';

const router = express.Router();

// create new tour
router.route('/:id').delete(verifyUser,deleteFromWish).post(verifyUser,addToWish)
// router.route('/search/getProductBySearch').get(getProductBySearch)

export default router