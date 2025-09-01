import asyncHandler from 'express-async-handler';
import Job from '../models/Job.js';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Recruiter
const createJob = asyncHandler(async (req, res) => {
  const { title, description, criteria_branch, criteria_cgpa, salary, location } = req.body;

  if (req.user.role !== 'recruiter') {
    res.status(403);
    throw new Error('Not authorized as a recruiter');
  }

  const job = new Job({
    company: req.user.id,
    title,
    description,
    criteria_branch,
    criteria_cgpa,
    salary,
    location,
  });

  const createdJob = await job.save();
  res.status(201).json(createdJob);
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const { branch, cgpa, keyword } = req.query;

  const query = {};

  if (branch) {
    query.criteria_branch = branch;
  }

  if (cgpa) {
    query.criteria_cgpa = { $lte: Number(cgpa) }; // Jobs requiring CGPA less than or equal to student's CGPA
  }

  if (keyword) {
    query.title = { $regex: keyword, $options: 'i' };
  }

  const count = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .populate('company', 'company_name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    jobs,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company', 'company_name');

  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Recruiter/Admin
const updateJob = asyncHandler(async (req, res) => {
  const { title, description, criteria_branch, criteria_cgpa, salary, location } = req.body;
  const job = await Job.findById(req.params.id);

  if (job) {
    if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this job');
    }

    job.title = title || job.title;
    job.description = description || job.description;
    job.criteria_branch = criteria_branch || job.criteria_branch;
    job.criteria_cgpa = criteria_cgpa || job.criteria_cgpa;
    job.salary = salary || job.salary;
    job.location = location || job.location;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter/Admin
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (job) {
    if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this job');
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

// @desc    Get jobs posted by recruiter
// @route   GET /api/jobs/myjobs
// @access  Private/Recruiter
const getMyJobs = asyncHandler(async (req, res) => {
  if (req.user.role !== 'recruiter') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const count = await Job.countDocuments({ company: req.user.id });
  const jobs = await Job.find({ company: req.user.id })
    .populate('company', 'company_name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    jobs,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

export { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs };
