import asyncHandler from 'express-async-handler';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private/Student
const applyJob = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student')
  {
    res.status(403);
    throw new Error('Only students can apply for jobs');
  }

  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Eligibility checks: branch and CGPA
  const student = req.user; // populated by protect middleware
  const reqBranch = job.criteria_branch || '';
  const reqCgpa = job.criteria_cgpa ? Number(job.criteria_cgpa) : 0;

  if (reqBranch && reqBranch !== 'Any') {
    const reqs = String(reqBranch).split(/[,|]/).map(s => s.trim().toLowerCase()).filter(Boolean);
    const studBranch = (student.branch || '').toLowerCase();
    if (reqs.length > 0 && !reqs.includes(studBranch)) {
      res.status(403);
      throw new Error('You do not meet the branch criteria for this job');
    }
  }

  if (reqCgpa) {
    const studCgpa = Number(student.cgpa || 0);
    if (studCgpa < reqCgpa) {
      res.status(403);
      throw new Error('You do not meet the minimum CGPA requirement for this job');
    }
  }

  const existingApplication = await Application.findOne({
    student: req.user.id,
    job: job._id,

    
  });

  if (existingApplication) {
    res.status(400);
    throw new Error('Already applied to this job');
  }

  const application = new Application({
    student: req.user.id,
    job: job._id,
    status: 'Applied',
  });

  const createdApplication = await application.save();
  res.status(201).json(createdApplication);
});

// @desc    Get my applications (student)
// @route   GET /api/applications/my
// @access  Private/Student
const getMyApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const count = await Application.countDocuments({ student: req.user.id });
  const applications = await Application.find({ student: req.user.id })
    .populate('job', 'title description company_name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    applications,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get applications for a recruiter’s jobs
// @route   GET /api/applications/recruiter
// @access  Private/Recruiter
const getRecruiterApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'recruiter') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const jobs = await Job.find({ company: req.user.id }).select('_id');
  const jobIds = jobs.map(job => job._id);

  const applications = await Application.find({ job: { $in: jobIds } })
    .populate('student', 'name email branch cgpa')
    .populate('job', 'title');

  res.json(applications);
});

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Recruiter
const updateApplicationStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'recruiter') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  const job = await Job.findById(application.job);

  if (job.company.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this application');
  }

  application.status = req.body.status || application.status;
  const updatedApplication = await application.save();

  res.json(updatedApplication);
});

// @desc    Get applications for a specific job by jobId (recruiter)
// @route   GET /api/applications/job/:jobId
// @access  Private/Recruiter
const getApplicationsByJob = asyncHandler(async (req, res) => {
  console.log('Fetching applications for job ID:', req.params.jobId);
  if (req.user.role !== 'recruiter') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check if the recruiter owns this job
  if (job.company.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to view applications for this job');
  }

  const applications = await Application.find({ job: req.params.jobId })
    .populate('student', 'name email branch cgpa resume_link')
    .populate('job', 'title company_name');

  console.log('Applications found:', applications);
  res.json({ applications }); // Ensure applications are always returned within an object
});

// @desc    Get all applications (admin)
// @route   GET /api/applications/all
// @access  Private/Admin
const getApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }

  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const status = req.query.status || null;

  const query = {};
  if (status) {
    query.status = status;
  }

  const count = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .populate('student', 'name email branch cgpa')
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

export { applyJob, getMyApplications, getRecruiterApplications, updateApplicationStatus, getApplicationsByJob, getApplications };
