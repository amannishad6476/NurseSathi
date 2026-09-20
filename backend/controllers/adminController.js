const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

const approveRecruiter = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user || user.role !== 'recruiter') {
    return res.status(404).json({ message: 'Recruiter not found' });
  }

  user.isApproved = true;
  await user.save();
  res.json({ message: 'Recruiter approved.', user });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await Job.deleteMany({ recruiter: user._id });
  await Application.deleteMany({ nurse: user._id });
  await user.deleteOne();
  res.json({ message: 'User deleted' });
};

const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  await Application.deleteMany({ job: job._id });
  await job.deleteOne();
  res.json({ message: 'Job deleted' });
};

const getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  const pendingRecruiters = await User.countDocuments({ role: 'recruiter', isApproved: false });

  res.json({ totalUsers, totalJobs, totalApplications, pendingRecruiters });
};

module.exports = { getAllUsers, approveRecruiter, deleteUser, deleteJob, getDashboardStats };
