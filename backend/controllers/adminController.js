const User = require('../models/User');
const Document = require('../models/Document');
const Appointment = require('../models/Appointment');
const Reminder = require('../models/Reminder');
const Doctor = require('../models/Doctor');

// 1. Get complete admin stats & lists
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDocuments = await Document.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const activeReminders = await Reminder.countDocuments({ isActive: true });

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const appointments = await Appointment.find()
      .populate('userId', 'name email phone')
      .sort({ appointmentDate: 1 });
    const doctors = await Doctor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDocuments,
        totalAppointments,
        activeReminders,
        users,
        appointments,
        doctors
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Update Appointment Status (Scheduled / Confirmed / Completed / Cancelled)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Add New Doctor
exports.addDoctor = async (req, res) => {
  try {
    const { name, specialization, hospital, contact, availableDays } = req.body;

    const doctor = await Doctor.create({
      name,
      specialization,
      hospital,
      contact,
      availableDays: availableDays ? availableDays.split(',').map(d => d.trim()) : []
    });

    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Delete Doctor
exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.doctorId);
    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};