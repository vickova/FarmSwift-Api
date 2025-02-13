import express from 'express';
import { addReview } from '../controller/reviewsController.js';
import { verifyUser, verifySeller } from '../utils/verifyToken.js';

const router = express.Router()

/**
 * @swagger
 *   reviews
 *  post:
 *     summary: Add new review
 *     description: Add review to seller.
 *     responses:
 *       200:
 *         description: A successful rating and review of customer.
*/

router.route('/').post(verifyUser, addReview)

export default router