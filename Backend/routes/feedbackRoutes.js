// feedback route
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
} from '../controllers/feedbackController.js';

const router = express.Router();

router.route('/').post(protect, authorize('student'), createFeedback);
router.route('/my').get(protect, authorize('student'), getMyFeedback);
router.route('/all').get(protect, authorize('admin'), getAllFeedback);

export default router;
