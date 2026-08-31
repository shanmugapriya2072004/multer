const express = require('express');
const router = express.Router();
const { getReminders, createReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getReminders)
  .post(protect, createReminder);

module.exports = router;