import express from 'express';
import { addReview } from '../controller/reviewsController.js';
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router()

router.route('/').post(verifyUser, addReview)

export default router