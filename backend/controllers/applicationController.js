const Application = require('../models/Application');
const Job = require('../models/Job');

const applyJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job || job.status !== 'open') {
    return res.status(404).json({ message: 'Job not available' });
  }

  const existingApplication = await Application.findOne({ job: job._id, nurse: req.user._id });
  if (existingApplication) {
    return res.status(400).json({ message: 'You already applied for this job' });
  }

  const application = await Application.create({
    job: job._id,
    nurse: req.user._id,
    coverLetter: req.body.coverLetter || '',
    resumeUrl: req.body.resumeUrl || '',
  });

  res.status(201).json(application);
};

const getMyApplications = async (req, res) => {
  const applications = await Application.find({ nurse: req.user._id })
    .populate('job', 'title hospital location salary')
    .sort({ appliedAt: -1 });
  res.json(applications);
};

const getApplicantsForRecruiter = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  if (!job.recruiter.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed to view applicants' });
  }

  const applications = await Application.find({ job: job._id })
    .populate('nurse', 'name email')
    .sort({ appliedAt: -1 });

  res.json(applications);
};

const updateApplicationStatus = async (req, res) => {
  const application = await Application.findById(req.params.applicationId).populate('job');
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (!application.job.recruiter.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not allowed to update this application' });
  }

  const { status } = req.body;
  if (!['accepted', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  application.status = status;
  await application.save();
  res.json(application);
};

module.exports = { applyJob, getMyApplications, getApplicantsForRecruiter, updateApplicationStatus };
