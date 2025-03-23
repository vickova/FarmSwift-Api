import express from 'express';
import { contact } from '../controller/Contact.js';

const router = express.Router();

/** 
* @swagger
 * /  /banks
 *  get:
 *     summary: send the message from the contect form to the organization
 *     responses:
 *       200:
 *         description: A successful message.
*/
router.post('/', contact);


export default router;
