import asyncHandler from 'express-async-handler';
import Feedback from '../models/Feedback.js';

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private/Student
const createFeedback = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Only students can submit feedback');
  }

  const { company_name, feedback_text } = req.body;

  if (!company_name || !feedback_text) {
    res.status(400);
    throw new Error('Please provide both company name and feedback text');
  }

  const feedback = new Feedback({
    student: req.user.id,
    company_name,
    feedback_text,
  });

  const createdFeedback = await feedback.save();
  res.status(201).json(createdFeedback);
});

// @desc    Get my feedback
// @route   GET /api/feedback/my
// @access  Private/Student
const getMyFeedback = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const feedback = await Feedback.find({ user: req.user.id });
  res.json(feedback);
});

// @desc    Get all feedback (admin)
// @route   GET /api/feedback/all
// @access  Private/Admin
const getAllFeedback = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }

  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const count = await Feedback.countDocuments();
  const feedbackList = await Feedback.find()
    .populate('student', 'name email')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    feedbackList,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

export { createFeedback, getMyFeedback, getAllFeedback };
