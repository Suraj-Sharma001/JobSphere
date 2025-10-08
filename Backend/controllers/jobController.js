import asyncHandler from 'express-async-handler';
import Job from '../models/Job.js';

/*

| Job Controller

| This file contains all the controller functions related to the
| Job feature. Recruiters can create, update, and delete jobs.
| Students can view available jobs, and admins have full access.

*/



// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Recruiter

const createJob = asyncHandler(async (req, res) => {

  
  // Step 1: Extract fields from request body

  const {
    title,
    description,
    criteria_branch,
    criteria_cgpa,
    salary,
    location,
  } = req.body;

  // Step 2: Authorization check (only recruiter can create job)
 
  
  if (req.user.role !== 'recruiter') {
    res.status(403);
    throw new Error('Not authorized as a recruiter');
  }


  // Step 3: Construct new job object
 
  const job = new Job({
    company        : req.user.id,
    title          : title,
    description    : description,
    criteria_branch: criteria_branch,
    criteria_cgpa  : criteria_cgpa,
    salary         : salary,
    location       : location,
  });

 
  // Step 4: Save job in the database
  
  const createdJob = await job.save();

  // ----------------------------------------------------------------
  // Step 5: Send created job as response
  // ----------------------------------------------------------------
  res.status(201).json(createdJob);
});



// @desc    Get all jobs (with filters and pagination)
// @route   GET /api/jobs
// @access  Private

const getJobs = asyncHandler(async (req, res) => {

  // ----------------------------------------------------------------
  // Step 1: Extract pagination parameters from query
  // ----------------------------------------------------------------
  const pageSize = Number(req.query.limit) || 10;  // default 10
  const page     = Number(req.query.page)  || 1;   // default 1

  // ----------------------------------------------------------------
  // Step 2: Extract filtering parameters
  // ----------------------------------------------------------------
  const {
    branch,
    cgpa,
    keyword,
  } = req.query;

  // ----------------------------------------------------------------
  // Step 3: Build query object dynamically
  // ----------------------------------------------------------------
  const query = {};

  if (branch) {
    query.criteria_branch = branch;
  }

  if (cgpa) {
    // Jobs requiring CGPA less than or equal to student's CGPA
    query.criteria_cgpa = { $lte: Number(cgpa) };
  }

  if (keyword) {
    query.title = { $regex: keyword, $options: 'i' };
  }

  // ----------------------------------------------------------------
  // Step 4: Count total jobs matching query
  // ----------------------------------------------------------------
  const count = await Job.countDocuments(query);

  // ----------------------------------------------------------------
  // Step 5: Fetch jobs from DB with pagination & population
  // ----------------------------------------------------------------
  const jobs = await Job.find(query)
    .populate('company', 'company_name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // ----------------------------------------------------------------
  // Step 6: Return jobs along with pagination metadata
  // ----------------------------------------------------------------
  res.json({
    jobs  : jobs,
    page  : page,
    pages : Math.ceil(count / pageSize),
    total : count,
  });
});



// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private

const getJobById = asyncHandler(async (req, res) => {

  // ----------------------------------------------------------------
  // Step 1: Fetch job by ID
  // ----------------------------------------------------------------
  const job = await Job.findById(req.params.id)
    .populate('company', 'company_name');

  // ----------------------------------------------------------------
  // Step 2: Send response or error if not found
  // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------
  // Step 1: Extract fields from request body
  // ----------------------------------------------------------------
  const {
    title,
    description,
    criteria_branch,
    criteria_cgpa,
    salary,
    location,
  } = req.body;

  // ----------------------------------------------------------------
  // Step 2: Fetch job from DB by ID
  // ----------------------------------------------------------------
  const job = await Job.findById(req.params.id);

  if (job) {
    // ----------------------------------------------------------------
    // Step 3: Authorization check
    // Recruiter who posted OR admin can update
    // ----------------------------------------------------------------
    if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this job');
    }

    // ----------------------------------------------------------------
    // Step 4: Update fields if provided
    // ----------------------------------------------------------------
    job.title           = title           || job.title;
    job.description     = description     || job.description;
    job.criteria_branch = criteria_branch || job.criteria_branch;
    job.criteria_cgpa   = criteria_cgpa   || job.criteria_cgpa;
    job.salary          = salary          || job.salary;
    job.location        = location        || job.location;

    // ----------------------------------------------------------------
    // Step 5: Save updated job
    // ----------------------------------------------------------------
    const updatedJob = await job.save();

    // ----------------------------------------------------------------
    // Step 6: Send updated job as response
    // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------
  // Step 1: Find job by ID
  // ----------------------------------------------------------------
  const job = await Job.findById(req.params.id);

  if (job) {
    // ----------------------------------------------------------------
    // Step 2: Authorization check
    // Recruiter who posted OR admin can delete
    // ----------------------------------------------------------------
    if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this job');
    }

    // ----------------------------------------------------------------
    // Step 3: Delete job
    // ----------------------------------------------------------------
    await job.deleteOne();

    // ----------------------------------------------------------------
    // Step 4: Send response
    // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------
  // Step 1: Ensure role is recruiter
  // ----------------------------------------------------------------
  if (req.user.role !== 'recruiter') {
    res.status(403);
    throw new Error('Not authorized');
  }

  // ----------------------------------------------------------------
  // Step 2: Pagination setup
  // ----------------------------------------------------------------
  const pageSize = Number(req.query.limit) || 10;
  const page     = Number(req.query.page)  || 1;

  // ----------------------------------------------------------------
  // Step 3: Count recruiter’s jobs
  // ----------------------------------------------------------------
  const count = await Job.countDocuments({
    company: req.user.id,
  });

  // ----------------------------------------------------------------
  // Step 4: Fetch recruiter’s jobs with pagination
  // ----------------------------------------------------------------
  const jobs = await Job.find({
    company: req.user.id,
  })
    .populate('company', 'company_name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));


  // Step 5: Send response with pagination info

  res.json({
    jobs  : jobs,
    page  : page,
    pages : Math.ceil(count / pageSize),
    total : count,
  });
});



// Exports

export {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
};
