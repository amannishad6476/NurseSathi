const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');
const {
  getAllUsers,
  approveRecruiter,
  deleteUser,
  deleteJob,
  getDashboardStats,
} = require('../controllers/adminController');

const router = express.Router();

router.use(authMiddleware, permit('admin'));
router.get('/users', getAllUsers);
router.put('/recruiter/:userId/approve', approveRecruiter);
router.delete('/user/:userId', deleteUser);
router.delete('/job/:jobId', deleteJob);
router.get('/stats', getDashboardStats);

module.exports = router;
