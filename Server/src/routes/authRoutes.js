import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers, deleteUser } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/')
  .get(protect, adminOnly, getAllUsers);

router.route('/:id')
  .delete(protect, adminOnly, deleteUser);

export default router;
