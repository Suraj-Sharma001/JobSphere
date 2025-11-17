// Job Route
import express from 'express';
const router = express.Router();
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.route('/').post(protect, authorize('recruiter'), createJob).get(protect, getJobs);
router.route('/myjobs').get(protect, authorize('recruiter'), getMyJobs);
router
  .route('/:id')
  .get(protect, getJobById)
  .put(protect, authorize('recruiter', 'admin'), updateJob)
  .delete(protect, authorize('recruiter', 'admin'), deleteJob);

export default router;
