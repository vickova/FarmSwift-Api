import express from 'express';
import { login, register, resendVerificationEmail, verifyEmail } from '../controller/authControllers.js';
import { addSellerDetails } from '../controller/SellerDetailsController.js';
import { verifySeller } from '../utils/verifyToken.js';

const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.get("/verify/:token", verifyEmail);  // Email verification route
router.post("/resend-verification-email", resendVerificationEmail);  // Resend verification route
router.route('/update-bank-details/:userId').put(verifySeller, addSellerDetails)


export default router