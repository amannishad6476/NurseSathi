const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');
const {
  applyJob,
  getMyApplications,
  getApplicantsForRecruiter,
  updateApplicationStatus,
} = require('../controllers/applicationController');

const router = express.Router();

router.post('/apply/:jobId', authMiddleware, permit('nurse'), applyJob);
router.get('/me', authMiddleware, permit('nurse'), getMyApplications);
router.get('/job/:jobId', authMiddleware, permit('recruiter'), getApplicantsForRecruiter);
router.put('/:applicationId/status', authMiddleware, permit('recruiter'), updateApplicationStatus);

module.exports = router;
