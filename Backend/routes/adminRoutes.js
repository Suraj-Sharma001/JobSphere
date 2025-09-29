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



// Get all users (Admin only)
router.get('/users', protect, authorize('admin'), getAllUsers);

// Get, update, or delete a specific user by ID
router
  .route('/users/:id')
  .get(protect, authorize('admin'), getUserById)       // Get user details
  .put(protect, authorize('admin'), updateUser)       // Update user info
  .delete(protect, authorize('admin'), deleteUser);   // Delete user



// Get all jobs (Admin only)
router.get('/jobs', protect, authorize('admin'), getAllJobs);

// Delete a specific job by ID
router.delete('/jobs/:id', protect, authorize('admin'), deleteJob);



// Get all feedback entries
router.get('/feedback', protect, authorize('admin'), getAllFeedback);

// Delete a specific feedback by ID
router.delete('/feedback/:id', protect, authorize('admin'), deleteFeedback);



// Get all job applications
router.get('/applications', protect, authorize('admin'), getAllApplications);

export default router;



























// Previous code 
// import express from 'express';
// const router = express.Router();
// import {
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   getAllJobs,
//   deleteJob,
//   getAllFeedback,
//   deleteFeedback,
//   getAllApplications,
// } from '../controllers/adminController.js';


// import {
//   protect,
//   authorize
// } from '../middleware/authMiddleware.js';

// // User management routes
// router.route('/users').get(protect, authorize('admin'), getAllUsers);
// router
//   .route('/users/:id')
  
//   .get(protect, authorize('admin'), getUserById)
//   .put(protect, authorize('admin'), updateUser)
//   .delete(protect, authorize('admin'), deleteUser);

// // Job management routes
// router.route('/jobs').get(protect, authorize('admin'), getAllJobs);
// router.route('/jobs/:id').delete(protect, authorize('admin'), deleteJob);

// // Feedback management routes
// router
//   .route('/feedback')
//   .get(protect, authorize('admin'), getAllFeedback);
// router
//   .route('/feedback/:id')
//   .delete(protect, authorize('admin'), deleteFeedback);

// // Application management routes
// router
//   .route('/applications')
//   .get(protect, authorize('admin'), getAllApplications);

// export default router;
