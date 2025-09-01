import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  applyJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  getApplicationsByJob,
  getApplications,
} from '../controllers/applicationController.js';

const router = express.Router();

// Student routes
router.route('/:jobId').post(protect, authorize('student'), applyJob);
router.route('/my').get(protect, authorize('student'), getMyApplications);

// Recruiter routes
router
  .route('/recruiter')
  .get(protect, authorize('recruiter'), getRecruiterApplications);
router
  .route('/job/:jobId')
  .get(protect, authorize('recruiter'), getApplicationsByJob);
router
  .route('/:id')
  .put(protect, authorize('recruiter'), updateApplicationStatus);

// Admin routes
router.route('/admin').get(protect, authorize('admin'), getApplications);

export default router;
