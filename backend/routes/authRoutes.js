const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Define clean sub-routes (do not prepend /api/auth here)
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;