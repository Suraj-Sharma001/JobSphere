// FILE: server/routes/userRoutes.js
import express from 'express';
const router = express.Router();
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;