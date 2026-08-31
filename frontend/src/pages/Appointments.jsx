import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar as CalendarIcon, Clock, MapPin, User, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [doctorName, setDoctorName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [clinicOrHospital, setClinicOrHospital] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [notes, setNotes] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await API.get('/appointments');
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      await API.post('/appointments', {
        doctorName,
        specialization,
        clinicOrHospital,
        appointmentDate,
        notes
      });
      setModalOpen(false);
      setDoctorName('');
      setSpecialization('');
      setClinicOrHospital('');
      setAppointmentDate('');
      setNotes('');
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to book appointment');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> Scheduled
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Appointments</h1>
          <p className="text-sm text-slate-500">Track checkups, consultations, and medical visits</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Book New Appointment
        </button>
      </div>

      {/* Appointment Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading appointment logs...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl">
          <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No appointments scheduled</h3>
          <p className="text-xs text-slate-400 mt-1">Book a doctor visit to start tracking your appointments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((apt) => {
            const dateObj = new Date(apt.appointmentDate);
            return (
              <div key={apt._id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">Dr. {apt.doctorName}</h3>
                      <p className="text-xs text-blue-600 font-medium">{apt.specialization || 'General Physician'}</p>
                    </div>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>

                <div className="space-y-2 mt-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <span>{dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {apt.clinicOrHospital && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{apt.clinicOrHospital}</span>
                    </div>
                  )}
                </div>

                {apt.notes && (
                  <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 p-2.5 rounded text-xs text-slate-600">
                    <span className="font-semibold text-slate-700 block mb-0.5">Notes:</span>
                    {apt.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-lg w-full rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Book Doctor Appointment</h2>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ananya Sharma"
                  className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiologist"
                    className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clinic / Hospital</label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Hospital"
                    className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={clinicOrHospital}
                    onChange={(e) => setClinicOrHospital(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date & Time *</label>
                <input
                  required
                  type="datetime-local"
                  className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Reason / Notes</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Routine blood pressure review & ECG follow-up"
                  className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}