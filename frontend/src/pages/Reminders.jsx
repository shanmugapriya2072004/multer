import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Bell, Pill, Clock, Plus, Trash2, Check, Calendar, Power } from 'lucide-react';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timesInput, setTimesInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReminders = async () => {
    try {
      const res = await API.get('/reminders');
      setReminders(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleCreateReminder = async (e) => {
    e.preventDefault();
    try {
      const timesArray = timesInput.split(',').map((t) => t.trim()).filter(Boolean);
      await API.post('/reminders', {
        medicineName,
        dosage,
        timesOfDay: timesArray.length ? timesArray : ['08:00'],
        startDate: startDate || new Date(),
        endDate: endDate || undefined
      });
      setModalOpen(false);
      setMedicineName('');
      setDosage('');
      setTimesInput('');
      setStartDate('');
      setEndDate('');
      fetchReminders();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add reminder');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medication Schedules & Reminders</h1>
          <p className="text-sm text-slate-500">Track daily dosages and timed medicine alerts</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Medication
        </button>
      </div>

      {/* Medication Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading schedules...</div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No active medication reminders</h3>
          <p className="text-xs text-slate-400 mt-1">Add your daily prescriptions to receive timely dosing alerts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((rem) => (
            <div key={rem._id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Pill className="w-6 h-6" />
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    rem.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {rem.isActive ? 'Active Schedule' : 'Paused'}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-800">{rem.medicineName}</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Dosage: {rem.dosage}</p>

                {/* Timing Chips */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">Scheduled Times</span>
                  <div className="flex flex-wrap gap-1.5">
                    {rem.timesOfDay.map((time, idx) => (
                      <span key={idx} className="flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                        <Clock className="w-3 h-3 text-slate-400" /> {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Duration Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(rem.startDate).toLocaleDateString()} {rem.endDate ? `- ${new Date(rem.endDate).toLocaleDateString()}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Medication Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Add Medication Schedule</h2>
            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Medicine Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Metformin / Amoxicillin"
                  className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage / Instructions *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 500mg - 1 Tablet after meal"
                  className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alert Times (Comma-separated 24h format)</label>
                <input
                  type="text"
                  placeholder="08:00, 14:00, 20:00"
                  className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={timesInput}
                  onChange={(e) => setTimesInput(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
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
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}