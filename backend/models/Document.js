const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Prescription', 'Lab Report', 'Discharge Summary', 'Scan/X-Ray', 'Other'], 
    default: 'Prescription' 
  },
  doctorName: { type: String },
  fileUrl: { type: String, required: true },
  fileType: { type: String },
  tags: [{ type: String }],
  issuedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);