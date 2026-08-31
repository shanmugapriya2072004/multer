const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  specialization: { type: String },
  clinicOrHospital: { type: String },
  appointmentDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled'], 
    default: 'Scheduled' 
  },
  notes: { type: String },
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);