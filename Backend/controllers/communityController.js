import CommunityPost from '../models/CommunityPost.js';
import CommunityComment from '../models/CommunityComment.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a community post
// @route   POST /api/community/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const post = new CommunityPost({
    user: req.user._id,
    title,
    content,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

// @desc    Get all community posts
// @route   GET /api/community/posts
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(posts);
});

// @desc    Get community post by ID
// @route   GET /api/community/posts/:id
// @access  Private
const getPostById = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id).populate(
    'user',
    'name'
  );

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Update a community post
// @route   PUT /api/community/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const post = await CommunityPost.findById(req.params.id);

  if (post) {
    if (post.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to update this post');
    }

    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete a community post
// @route   DELETE /api/community/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);

  if (post) {
    if (post.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to delete this post');
    }
    await post.deleteOne();
    // Also delete all comments associated with this post
    await CommunityComment.deleteMany({ post: req.params.id });
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Create a comment on a community post
// @route   POST /api/community/posts/:postId/comments
// @access  Private
const createComment = asyncHandler(async (req, res) => {
  const { commentContent } = req.body;
  const { postId } = req.params;

  const post = await CommunityPost.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = new CommunityComment({
    post: postId,
    user: req.user._id,
    commentContent,
  });

  const createdComment = await comment.save();
  res.status(201).json(createdComment);
});

// @desc    Get comments for a community post
// @route   GET /api/community/posts/:postId/comments
// @access  Private
const getCommentsByPostId = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await CommunityComment.find({ post: postId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  res.json(comments);
});

// @desc    Delete a comment from a community post
// @route   DELETE /api/community/posts/:postId/comments/:commentId
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;

  const comment = await CommunityComment.findById(commentId);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.post.toString() !== postId) {
    res.status(400);
    throw new Error('Comment does not belong to this post');
  }

  if (comment.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this comment');
  }

  await comment.deleteOne();
  res.json({ message: 'Comment removed' });
});

export {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  createComment,
  getCommentsByPostId,
  deleteComment,
};
