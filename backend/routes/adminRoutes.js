const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  getAdminStats, 
  updateAppointmentStatus, 
  addDoctor, 
  deleteDoctor 
} = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.put('/appointments/:appointmentId/status', updateAppointmentStatus);
router.post('/doctors', addDoctor);
router.delete('/doctors/:doctorId', deleteDoctor);

module.exports = router;