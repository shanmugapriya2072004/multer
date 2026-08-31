const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g., "500mg", "1 tablet"
  timesOfDay: [{ type: String }], // e.g., ["08:00", "14:00", "20:00"]
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);