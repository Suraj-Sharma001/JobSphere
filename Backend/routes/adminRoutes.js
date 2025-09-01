import express from 'express';
const router = express.Router();
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllFeedback,
  deleteFeedback,
  getAllApplications,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// User management routes
router.route('/users').get(protect, authorize('admin'), getAllUsers);
router
  .route('/users/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

// Job management routes
router.route('/jobs').get(protect, authorize('admin'), getAllJobs);
router.route('/jobs/:id').delete(protect, authorize('admin'), deleteJob);

// Feedback management routes
router
  .route('/feedback')
  .get(protect, authorize('admin'), getAllFeedback);
router
  .route('/feedback/:id')
  .delete(protect, authorize('admin'), deleteFeedback);

// Application management routes
router
  .route('/applications')
  .get(protect, authorize('admin'), getAllApplications);

export default router;
