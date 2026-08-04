import express from 'express';
import { createOrder, getOrderById, updateOrderStatus, getMyOrders, getAllOrders } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.get('/myorders', protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, adminOnly, updateOrderStatus);

export default router;
