const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: String,
  hospital: String,
  from: Date,
  to: Date,
  description: String,
});

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String,
});

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  summary: String,
  location: String,
  skills: [String],
  education: [educationSchema],
  experience: [experienceSchema],
  resumeUrl: String,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Profile', profileSchema);
