import express from 'express';
import { deleteUser, getAllUser, getSingleUser, updateUser } from '../controller/userControllers.js';
import { verifyUser, verifySeller } from '../utils/verifyToken.js';
import { addSellerDetails } from '../controller/SellerDetailsController.js';

const router = express.Router()


/**
 * @swagger
 * /users/:id:
 *   put:
 *     summary: Update existing user info
 *     description: Users can update their information.
 *     responses:
 *       200:
 *         description: A successful update of user information.
 *  /users/:id:
 *   delete:
 *     summary: Delete existing user info
 *     description: Users can delete their information.
 *     responses:
 *       200:
 *         description: A successful delete of user information.
 *  /users:
 *    get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *  /users/bank-details:
 *    post:
 *     summary: upload users bank details
 *     description: Upload specific users bank details.
 *     responses:
 *       200:
 *         description: A success message.
 */
router.route('/:id').put(verifyUser,updateUser).delete(verifyUser,deleteUser).get(verifyUser,getSingleUser)
router.route('/').get(verifyUser,getAllUser)
router.route('/bank-details').post(verifySeller,addSellerDetails)

export default router