import asyncHandler from 'express-async-handler';
import Job from '../models/Job.js';

const createJob = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    criteria_branch,
    criteria_cgpa,
    salary,
    location,
  } = req.body;

 
  
  if (req.user.role !== 'recruiter') {
    res.status(403);
    throw new Error('Not authorized as a recruiter');
  }


 
  const job = new Job({
    company        : req.user.id,
    title          : title,
    description    : description,
    criteria_branch: criteria_branch,
    criteria_cgpa  : criteria_cgpa,
    salary         : salary,
    location       : location,
  });

  
  const createdJob = await job.save();


  res.status(201).json(createdJob);
});

const getJobs = asyncHandler(async (req, res) => {

  const pageSize = Number(req.query.limit) || 10;  // default 10
  const page = Number(req.query.page) || 1;

  const {
    branch,
    cgpa,
    keyword,
  } = req.query;

  const query = {};

  if (branch) {
    query.criteria_branch = branch;
  }

  if (cgpa) {
    query.criteria_cgpa = { $lte: Number(cgpa) };
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
    jobs  : jobs,
    page  : page,
    pages : Math.ceil(count / pageSize),
    total : count,
  });
});

const getJobById = asyncHandler(async (req, res) => {

  const job = await Job.findById(req.params.id)
    .populate('company', 'company_name');

  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});



const updateJob = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    criteria_branch,
    criteria_cgpa,
    salary,
    location,
  } = req.body;

  const job = await Job.findById(req.params.id);

  if (job) {
    if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this job');
    }

    job.title           = title           || job.title;
    job.description     = description     || job.description;
    job.criteria_branch = criteria_branch || job.criteria_branch;
    job.criteria_cgpa   = criteria_cgpa   || job.criteria_cgpa;
    job.salary          = salary          || job.salary;
    job.location        = location        || job.location;

    const updatedJob = await job.save();

    res.json(updatedJob);

  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});



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


const getMyJobs = asyncHandler(async (req, res) => {

  if (req.user.role !== 'recruiter') {
    res.status(403);
    throw new Error('Not authorized');
  }

  const pageSize = Number(req.query.limit) || 10;
  const page     = Number(req.query.page)  || 1;

  const count = await Job.countDocuments({
    company: req.user.id,
  });


  const jobs = await Job.find({
    company: req.user.id,
  })
    .populate('company', 'company_name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));


  res.json({
    jobs  : jobs,
    page  : page,
    pages : Math.ceil(count / pageSize),
    total : count,
  });
});





export {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
};
