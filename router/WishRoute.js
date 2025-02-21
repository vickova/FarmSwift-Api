import express from 'express';
import { verifySeller, verifyUser } from '../utils/verifyToken.js';
import { addToWish, deleteFromWish, getAllWishItems } from '../controller/WishController.js';

const router = express.Router();
/** 
 * @swagger
 *  /wishes/:id
 *  delete:
 *     summary: Delete wish Items
 *     description: Delete existing wish items.
 *     responses:
 *       200:
 *         description: A successful deletion of wish items.
 * /wishes/:id
 *  get:
 *     summary: Get all CartItem
 *     description: Get all wish items regardless of the user.
 *     responses:
 *       200:
 *         description: A list of wish items.
 * /wishes/:id
 * post:
 *     summary: Add wish Items
 *     description: Add new items to wish.
 *     responses:
 *       200:
 *         description: A successful addition of items to wish.
*/


// create new wish
router.route('/:id').delete(verifyUser,deleteFromWish).post(verifyUser,addToWish).get(getAllWishItems)
// router.route('/search/getProductBySearch').get(getProductBySearch)

export default router