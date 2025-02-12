import express from 'express';
import { createOrder } from '../controller/OrderController.js';
import { initializePayment } from '../controller/OrderController.js';

const router = express.Router();

router.post('/create', createOrder);
router.post('/pay', initializePayment); // Route to initialize payment


export default router;
