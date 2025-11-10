import asyncHandler from 'express-async-handler';
import Feedback from '../models/Feedback.js';

const createFeedback = asyncHandler(async (req, res) => {

  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Only students can submit feedback');
  }


  const { company_name, feedback_text } = req.body;

  // feedback_text is required; company_name is optional
  if (!feedback_text || feedback_text.trim().length === 0) {
    res.status(400);
    throw new Error('Please provide feedback text');
  }

  const feedback = new Feedback({
    student: req.user.id,
    company_name: company_name || '',
    feedback_text: feedback_text,
  });


  const createdFeedback = await feedback.save();

  res.status(201).json(createdFeedback);
});

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

  const feedback = await Feedback.find({ student: studentId });

  // ----------------------------------------------------------------
  // Step 3: Return the feedback list
  // ----------------------------------------------------------------
  res.json(feedback);
});

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

export {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
};
