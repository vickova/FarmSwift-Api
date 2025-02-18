import express from 'express';
import { createProduct, getAllProducts, getSingleProduct, deleteProduct,updateProduct } from '../controller/ProductsController.js';
import { verifySeller, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

/**
 * @swagger
/products/delete:
 *  delete:
 *     summary: Delete Product add by Seller
 *     description: Delete Product added by seller.
 *     responses:
 *       200:
 *         description: A successful deletion of product.
 * /products/
 *  get:
 *     summary: Get all products
 *     description: Get all products.
 *     responses:
 *       200:
 *         description: A list of products available.
 * /products
 * post:
 *     summary: Create Product
 *     description: Create new Product.
 *     responses:
 *       200:
 *         description: A successful creation of product.
 * /products/:id
 * get:
 *     summary: Get single product
 *     description: Get single products.
 *     responses:
 *       200:
 *         description: Display of the single product.
 * /products/:id
 * put:
 *     summary: Update single product
 *     description: Update single product.
 *     responses:
 *       200:
 *         description:Update single product.
*/

// create new tour
router.route('/').post(verifySeller,createProduct).get(verifyUser,getAllProducts)
router.route('/:id').get(getSingleProduct).delete(verifySeller,deleteProduct).put(verifySeller,updateProduct)
// router.route('/search/getProductBySearch').get(getProductBySearch)

export default router