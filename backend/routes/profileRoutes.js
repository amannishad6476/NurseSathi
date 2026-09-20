const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createOrUpdateProfile, getMyProfile, getProfileById } = require('../controllers/profileController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getMyProfile);
router.post('/me', authMiddleware, upload.single('resume'), createOrUpdateProfile);
router.get('/:userId', authMiddleware, getProfileById);

module.exports = router;
