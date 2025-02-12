import express from 'express';
import { deleteUser, getAllUser, getSingleUser, updateUser } from '../controller/userControllers.js';
import { verifyUser, verifySeller } from '../utils/verifyToken.js';
import { addSellerDetails } from '../controller/SellerDetailsController.js';

const router = express.Router()

router.route('/:id').put(verifyUser,updateUser).delete(verifyUser,deleteUser).get(verifyUser,getSingleUser)
router.route('/').get(verifyUser,getAllUser)
router.route('/bank-details').post(verifySeller,addSellerDetails)

export default router