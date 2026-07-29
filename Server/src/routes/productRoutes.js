import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, upload.array('images', 5), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, upload.array('images', 5), updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;
