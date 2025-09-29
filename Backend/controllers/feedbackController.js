import asyncHandler from 'express-async-handler';
import Feedback from '../models/Feedback.js';

/*
|--------------------------------------------------------------------------
| Feedback Controller
|--------------------------------------------------------------------------
| This file contains all the controller functions related to the
| Feedback feature. Students can submit feedback, retrieve their
| own feedback, and admins can view all feedback entries.
|--------------------------------------------------------------------------
*/


// ======================================================
// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private/Student
// ======================================================
const createFeedback = asyncHandler(async (req, res) => {

  // ----------------------------------------------------------------
  // Step 1: Ensure only students can submit feedback
  // ----------------------------------------------------------------
  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Only students can submit feedback');
  }

  // ----------------------------------------------------------------
  // Step 2: Extract required fields from request body
  // ----------------------------------------------------------------
  const {
    company_name,
    feedback_text
  } = req.body;

  // ----------------------------------------------------------------
  // Step 3: Validate that all required fields are present
  // ----------------------------------------------------------------
  if (!company_name || !feedback_text) {
    res.status(400);
    throw new Error('Please provide both company name and feedback text');
  }

  // ----------------------------------------------------------------
  // Step 4: Create new feedback object
  // ----------------------------------------------------------------
  const feedback = new Feedback({
    student      : req.user.id,
    company_name : company_name,
    feedback_text: feedback_text,
  });

  // ----------------------------------------------------------------
  // Step 5: Save feedback to database
  // ----------------------------------------------------------------
  const createdFeedback = await feedback.save();

  // ----------------------------------------------------------------
  // Step 6: Return response with created feedback
  // ----------------------------------------------------------------
  res.status(201).json(createdFeedback);
});


// ======================================================
// @desc    Get my feedback (for students)
// @route   GET /api/feedback/my
// @access  Private/Student
// ======================================================
const getMyFeedback = asyncHandler(async (req, res) => {

  // ----------------------------------------------------------------
  // Step 1: Check if user role is student
  // ----------------------------------------------------------------
  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Not authorized');
  }

  // ----------------------------------------------------------------
  // Step 2: Query the Feedback collection for this student's entries
  // ----------------------------------------------------------------
  const studentId = req.user.id;

  const feedback = await Feedback.find({
    user: studentId
  });

  // ----------------------------------------------------------------
  // Step 3: Return the feedback list
  // ----------------------------------------------------------------
  res.json(feedback);
});


// ======================================================
// @desc    Get all feedback (for admins)
// @route   GET /api/feedback/all
// @access  Private/Admin
// ======================================================
const getAllFeedback = asyncHandler(async (req, res) => {

  // ----------------------------------------------------------------
  // Step 1: Check if user role is admin
  // ----------------------------------------------------------------
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }

  // ----------------------------------------------------------------
  // Step 2: Extract pagination parameters
  // ----------------------------------------------------------------
  const pageSize = Number(req.query.limit) || 10;  // default limit = 10
  const page     = Number(req.query.page)  || 1;   // default page = 1

  // ----------------------------------------------------------------
  // Step 3: Count total feedback entries
  // ----------------------------------------------------------------
  const count = await Feedback.countDocuments();

  // ----------------------------------------------------------------
  // Step 4: Fetch feedback list with pagination
  // ----------------------------------------------------------------
  const feedbackList = await Feedback.find()
    .populate('student', 'name email')   // populate student details
    .limit(pageSize)                     // apply limit
    .skip(pageSize * (page - 1));        // skip based on page

  // ----------------------------------------------------------------
  // Step 5: Send response with pagination metadata
  // ----------------------------------------------------------------
  res.json({
    feedbackList : feedbackList,
    page         : page,
    pages        : Math.ceil(count / pageSize),
    total        : count,
  });
});


// ======================================================
// Exports
// ======================================================
export {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
};
