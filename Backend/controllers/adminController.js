import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Feedback from '../models/Feedback.js';

const getAllUsers = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const role = req.query.role || null;

  const query = {};
  if (role) {
    query.role = role;
  }

  const count = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password') // Exclude password
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});


const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.branch = req.body.branch || user.branch;
    user.cgpa = req.body.cgpa || user.cgpa;
    user.resume_link = req.body.resume_link || user.resume_link;
    user.company_name = req.body.company_name || user.company_name;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      branch: updatedUser.branch,
      cgpa: updatedUser.cgpa,
      resume_link: updatedUser.resume_link,
      company_name: updatedUser.company_name,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


const getAllJobs = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Job.countDocuments({ ...keyword });
  const jobs = await Job.find({ ...keyword })
    .populate('company', 'name company_name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    jobs,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});


const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (job) {
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});


const getAllFeedback = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const count = await Feedback.countDocuments();
  const feedback = await Feedback.find({})
    .populate('student', 'name email')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    feedback,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (feedback) {
    await feedback.deleteOne();
    res.json({ message: 'Feedback removed' });
  } else {
    res.status(404);
    throw new Error('Feedback not found');
  }
});

const getAllApplications = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const status = req.query.status || null;

  const query = {};
  if (status) {
    query.status = status;
  }

  const count = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .populate('student', 'name email')
    .populate('job', 'title company_name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    applications,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

export {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllJobs,
  deleteJob,
  getAllFeedback,
  deleteFeedback,
  getAllApplications,
};
