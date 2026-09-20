const express = require('express');
const { register, login, currentUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current', authMiddleware, currentUser);

module.exports = router;
