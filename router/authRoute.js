import express from 'express';
import { login, register, resendVerificationEmail, verifyEmail } from '../controller/authControllers.js';
import { addSellerDetails } from '../controller/SellerDetailsController.js';
import { verifySeller } from '../utils/verifyToken.js';

const router = express.Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user
 *     description: Register new user
 *     responses:
 *       200:
 *         description: A successful registration of users.
 *  /auth/login:
 *   post:
 *     summary: Login user
 *     description: Login registered user
 *     responses:
 *       200:
 *         description: A successful login of user.
 *  /auth/verify/:token:
 *   post:
 *     summary: Verify registered user
 *     description: Verify registered users via email
 *     responses:
 *       200:
 *         description: A successful verification of user.
 * /auth/resend-verification-email:
 *   post:
 *     summary: Resend verification to email
 *     description: Resend verification in case of failed email verification
 *     responses:
 *       200:
 *         description: A successful resend of verification to user email.
 *  /auth//update-bank-details/:userId:
 *    put:
 *     summary: Update Bank Details
 *     description: Upload new or update existing bank details of sellers.
 *     responses:
 *       200:
 *         description: A successful upload or update.
 *
 */
router.post('/register', register)
router.post('/login', login)
router.get("/verify/:token", verifyEmail);  // Email verification route
router.post("/resend-verification-email", resendVerificationEmail);  // Resend verification route
router.route('/update-bank-details/:userId').put(verifySeller, addSellerDetails)


export default router