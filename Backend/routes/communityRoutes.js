// community route
import express from 'express';
const router = express.Router();
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  createComment,
  getCommentsByPostId,
  deleteComment,
} from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

// Post routes
router.route('/posts').post(protect, createPost).get(protect, getPosts);
router
  .route('/posts/:id')
  .get(protect, getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Comment routes
router.route('/posts/:postId/comments').post(protect, createComment).get(protect, getCommentsByPostId);
router.route('/posts/:postId/comments/:commentId').delete(protect, deleteComment);

export default router;
