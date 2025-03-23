import express from 'express';
import { contact } from '../controller/Contact.js';

const router = express.Router();

/** 
* @swagger
 * /  /banks
 *  get:
 *     summary: Get all bank list
 *     description: Retrieve a list of all banks wth their codes.
 *     responses:
 *       200:
 *         description: A list of banks.
*/
router.get('/', contact);


export default router;
