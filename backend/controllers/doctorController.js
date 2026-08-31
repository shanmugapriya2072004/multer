const Doctor = require('../models/Doctor');

// @desc    Get all active doctors (For Users to choose when booking)
// @route   GET /api/doctors
// @access  Private (User & Admin)
exports.getDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let query = { status: 'Active' };

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const doctors = await Doctor.find(query).sort({ name: 1 });
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single doctor details
// @route   GET /api/doctors/:id
// @access  Private
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add a new doctor (Admin Only)
// @route   POST /api/doctors
// @access  Private/Admin
exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization, hospital, contact, availableDays } = req.body;

    if (!name || !specialization || !hospital) {
      return res.status(400).json({ success: false, error: 'Name, specialization, and hospital are required' });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      hospital,
      contact,
      availableDays: availableDays ? (Array.isArray(availableDays) ? availableDays : availableDays.split(',').map(d => d.trim())) : []
    });

    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update doctor details (Admin Only)
// @route   PUT /api/doctors/:id
// @access  Private/Admin
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }

    res.status(200).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete a doctor (Admin Only)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Doctor not found' });
    }

    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};