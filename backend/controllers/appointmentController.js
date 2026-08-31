const Appointment = require('../models/Appointment');

// Get user appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }).sort({ appointmentDate: 1 });
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorName, specialization, clinicOrHospital, appointmentDate, notes } = req.body;
    const appointment = await Appointment.create({
      userId: req.user._id,
      doctorName,
      specialization,
      clinicOrHospital,
      appointmentDate,
      notes
    });
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};