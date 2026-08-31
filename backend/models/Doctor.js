const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  hospital: { type: String, required: true },
  contact: { type: String },
  availableDays: [{ type: String }], // e.g. ["Mon", "Wed", "Fri"]
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);