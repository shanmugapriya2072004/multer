import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { 
  Users, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  UserPlus, 
  Check, 
  X, 
  Trash2, 
  Stethoscope 
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [doctorModal, setDoctorModal] = useState(false);

  const [docName, setDocName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');
  const [contact, setContact] = useState('');
  const [days, setDays] = useState('');

  const fetchAdminData = async () => {
    try {
      const res = await API.get('/admin/stats');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await API.put(`/admin/appointments/${appointmentId}/status`, { status });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/doctors', {
        name: docName,
        specialization,
        hospital,
        contact,
        availableDays: days
      });
      setDoctorModal(false);
      setDocName('');
      setSpecialization('');
      setHospital('');
      setContact('');
      setDays('');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add doctor');
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Delete this doctor record?')) return;
    try {
      await API.delete(`/admin/doctors/${doctorId}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete doctor');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Admin Console...</div>;
  if (!data) return <div className="p-8 text-center text-rose-500 font-medium">Failed to load admin stats.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Control Center</h1>
            <p className="text-xs text-slate-500">Manage patient records, confirm appointments, and assign specialist doctors</p>
          </div>
        </div>
        <button
          onClick={() => setDoctorModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <UserPlus className="w-4 h-4" /> Add Specialist Doctor
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Registered Users</div>
              <div className="text-2xl font-bold text-slate-900">{data.totalUsers}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FileText className="w-6 h-6" /></div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Vaulted Documents</div>
              <div className="text-2xl font-bold text-slate-900">{data.totalDocuments}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Calendar className="w-6 h-6" /></div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Appointments</div>
              <div className="text-2xl font-bold text-slate-900">{data.totalAppointments}</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Stethoscope className="w-6 h-6" /></div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Active Doctors</div>
              <div className="text-2xl font-bold text-slate-900">{data.doctors?.length || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table 1: Appointments Queue */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" /> Patient Appointments Queue ({data.appointments?.length || 0})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/75 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Doctor & Clinic</th>
                <th className="px-6 py-3">Date & Time</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.appointments?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-slate-400 text-xs">No appointments booked yet.</td>
                </tr>
              ) : (
                data.appointments?.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{apt.userId?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-400">{apt.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">Dr. {apt.doctorName}</div>
                      <div className="text-xs text-blue-600 font-medium">{apt.specialization} • {apt.clinicOrHospital || 'Clinic'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {new Date(apt.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : apt.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {apt.status !== 'Confirmed' && (
                        <button
                          onClick={() => handleStatusChange(apt._id, 'Confirmed')}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition"
                        >
                          <Check className="w-3.5 h-3.5" /> Confirm
                        </button>
                      )}
                      {apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(apt._id, 'Cancelled')}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Doctors Directory */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-blue-600" /> Specialist Doctors Directory ({data.doctors?.length || 0})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100/75 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3">Doctor Name</th>
                <th className="px-6 py-3">Specialization</th>
                <th className="px-6 py-3">Hospital / Clinic</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Available Days</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.doctors?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-400 text-xs">No doctors added yet.</td>
                </tr>
              ) : (
                data.doctors?.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">Dr. {doc.name}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">{doc.specialization}</td>
                    <td className="px-6 py-4">{doc.hospital}</td>
                    <td className="px-6 py-4 text-xs">{doc.contact || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {doc.availableDays?.map((d, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteDoctor(doc._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Light Theme Doctor Modal */}
      {doctorModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" /> Add Specialist Doctor
              </h2>
              <button
                onClick={() => setDoctorModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Senior Cardiologist"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital / Clinic Center *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Apollo Super Specialty Clinic"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visiting Days</label>
                  <input
                    type="text"
                    placeholder="Mon, Wed, Fri"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDoctorModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}