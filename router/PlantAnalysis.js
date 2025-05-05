import express from 'express';
import { createOrder } from '../controller/OrderController.js';
import { initializePayment } from '../controller/OrderController.js';
import { deletePlantAnalysis, getPlantAnalysis, savePlantAnalysis } from '../controller/PlantAnalysiscontroller.js';
import { verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

/**
 * @swagger
 * /plants:
 *   post:
 *     summary: to add a new plant to the database
 *     description: Add a new plant to the database.
 *     responses:
 *       200:
 *         description: A successful addition of new plant to the database.
 * /plants:
 *   get:
 *     summary: Make payment for a prticular order.
 *     description: Make payment for the particular order.
 *     responses:
 *       200:
 *         description: Payment is successful.
 */
router.route('/save').post(verifyUser,savePlantAnalysis); // Route to add a new plant to the database
router.route('/delete').delete(verifyUser,deletePlantAnalysis);

router.route('/all-plants').get(verifyUser, getPlantAnalysis); // Route to initialize payment


export default router;
