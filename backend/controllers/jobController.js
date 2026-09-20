const Job = require('../models/Job');

const createJob = async (req, res) => {
  const { title, hospital, location, salary, description, requirements } = req.body;
  const requirementsArray = requirements ? requirements.split(',').map((item) => item.trim()) : [];

  const job = await Job.create({
    recruiter: req.user._id,
    title,
    hospital,
    location,
    salary,
    description,
    requirements: requirementsArray,
  });

  res.status(201).json(job);
};

const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  if (!job.recruiter.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed to update this job' });
  }

  const { title, hospital, location, salary, description, requirements, status } = req.body;
  job.title = title || job.title;
  job.hospital = hospital || job.hospital;
  job.location = location || job.location;
  job.salary = salary || job.salary;
  job.description = description || job.description;
  job.status = status || job.status;
  if (requirements) {
    job.requirements = requirements.split(',').map((item) => item.trim());
  }

  await job.save();
  res.json(job);
};

const getJobs = async (req, res) => {
  const { keyword, location, hospital, page = 1, limit = 8 } = req.query;
  const filters = { status: 'open' };

  if (keyword) {
    filters.$or = [
      { title: new RegExp(keyword, 'i') },
      { description: new RegExp(keyword, 'i') },
      { hospital: new RegExp(keyword, 'i') },
    ];
  }
  if (location) {
    filters.location = new RegExp(location, 'i');
  }
  if (hospital) {
    filters.hospital = new RegExp(hospital, 'i');
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Job.countDocuments(filters);
  const jobs = await Job.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate('recruiter', 'name email');

  res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.jobId).populate('recruiter', 'name email');
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  res.json(job);
};

const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  if (!job.recruiter.equals(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not allowed to delete this job' });
  }
  await job.deleteOne();
  res.json({ message: 'Job removed' });
};

const getRecruiterJobs = async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
  res.json(jobs);
};

module.exports = { createJob, updateJob, getJobs, getJobById, deleteJob, getRecruiterJobs };
