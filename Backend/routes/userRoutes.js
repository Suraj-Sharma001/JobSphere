// FILE: server/routes/userRoutes.js
import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import {
	getUserProfile,
	updateUserProfile,
	getUserById,
	updateUserById,
} from '../controllers/userController.js';

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// Admin or owner routes
router.route('/:id').get(protect, getUserById).put(protect, updateUserById);

export default router;