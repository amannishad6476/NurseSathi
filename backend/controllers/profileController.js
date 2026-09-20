const Profile = require('../models/Profile');

const createOrUpdateProfile = async (req, res) => {
  const { summary, location, skills, education, experience } = req.body;
  const skillsArray = skills ? skills.split(',').map((skill) => skill.trim()) : [];

  const profileFields = {
    user: req.user._id,
    summary,
    location,
    skills: skillsArray,
    education: education ? JSON.parse(education) : [],
    experience: experience ? JSON.parse(experience) : [],
  };

  if (req.file) {
    profileFields.resumeUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  let profile = await Profile.findOne({ user: req.user._id });
  if (profile) {
    profile = await Profile.findOneAndUpdate({ user: req.user._id }, { $set: profileFields }, { new: true });
    return res.json(profile);
  }

  profile = await Profile.create(profileFields);
  res.status(201).json(profile);
};

const getMyProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email role');
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  res.json(profile);
};

const getProfileById = async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'name email role');
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  res.json(profile);
};

module.exports = { createOrUpdateProfile, getMyProfile, getProfileById };
