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

  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const studentId = req.user.id;

  const feedback = await Feedback.find({ student: studentId });

  res.json(feedback);
});

const getAllFeedback = asyncHandler(async (req, res) => {

  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }

  const pageSize = Number(req.query.limit) || 10;  //  limit = 10
  const page     = Number(req.query.page)  || 1;   //  page = 1

  const count = await Feedback.countDocuments();

  const feedbackList = await Feedback.find()
    .populate('student', 'name email')  
    .limit(pageSize)                    
    .skip(pageSize * (page - 1));        

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
