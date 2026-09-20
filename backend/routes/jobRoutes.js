const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');
const {
  createJob,
  updateJob,
  getJobs,
  getJobById,
  deleteJob,
  getRecruiterJobs,
} = require('../controllers/jobController');

const router = express.Router();

router.get('/', getJobs);
router.get('/recruiter/list', authMiddleware, permit('recruiter'), getRecruiterJobs);
router.get('/:jobId', getJobById);
router.post('/', authMiddleware, permit('recruiter'), createJob);
router.put('/:jobId', authMiddleware, permit('recruiter'), updateJob);
router.delete('/:jobId', authMiddleware, deleteJob);

module.exports = router;
