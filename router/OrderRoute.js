import express from 'express';
import { createOrder, getSellerOrders, getUserOrders, verifyPayment } from '../controller/OrderController.js';
import { initializePayment } from '../controller/OrderController.js';

const router = express.Router();

/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: create new order
 *     description: Create new order for the user.
 *     responses:
 *       200:
 *         description: A successful creation of customer's order.
 * /orders/pay:
 *   post:
 *     summary: Make payment for a prticular order.
 *     description: Make payment for the particular order.
 *     responses:
 *       200:
 *         description: Payment is successful.
 */
router.post('/create', createOrder);
router.get('/:id', getUserOrders);
router.get('/seller/:sellerId', getSellerOrders);
router.post('/pay', initializePayment); // Route to initialize payment
router.post('/pay/verify/:id', verifyPayment); // Route to initialize payment



export default router;
