import express from 'express';
import { verifySeller, verifyUser } from '../utils/verifyToken.js';
import { addToCart, deleteFromCart, getAllCartItems } from '../controller/CartController.js';

const router = express.Router();

/** 
 * @swagger
/carts/:id
 *  delete:
 *     summary: Delete cart Items
 *     description: Delete existing cart items.
 *     responses:
 *       200:
 *         description: A successful deletion of cart items.
 * /carts/:id
 *  get:
 *     summary: Get all CartItem
 *     description: Get all cart items regardless of the user.
 *     responses:
 *       200:
 *         description: A list of cart items.
 * /carts/:id
 * post:
 *     summary: Add cart Items
 *     description: Add new items to cart.
 *     responses:
 *       200:
 *         description: A successful addition of items to cart.
*/

// create new cart
router.route('/')
router.route('/:id').delete(verifyUser,deleteFromCart).post(verifyUser,addToCart).get(getAllCartItems)
// router.route('/search/getProductBySearch').get(getProductBySearch)

export default router