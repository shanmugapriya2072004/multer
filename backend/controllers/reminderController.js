const Reminder = require('../models/Reminder');

// Get user reminders
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reminders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new reminder
exports.createReminder = async (req, res) => {
  try {
    const { medicineName, dosage, timesOfDay, startDate, endDate } = req.body;
    const reminder = await Reminder.create({
      userId: req.user._id,
      medicineName,
      dosage,
      timesOfDay,
      startDate: startDate || new Date(),
      endDate: endDate || null
    });
    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};