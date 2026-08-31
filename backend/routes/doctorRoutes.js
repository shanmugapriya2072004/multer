const express = require('express');
const router = express.Router();
const { 
  getDoctors, 
  getDoctorById, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public to all logged-in users (Doctors-ஐ பார்த்து Appointment book பண்ண)
router.get('/', protect, getDoctors);
router.get('/:id', protect, getDoctorById);

// Admin Only routes (Doctor-ஐ Add / Edit / Delete பண்ண)
router.post('/', protect, authorize('admin'), createDoctor);
router.put('/:id', protect, authorize('admin'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;