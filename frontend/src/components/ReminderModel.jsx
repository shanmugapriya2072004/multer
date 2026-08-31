import React, { useState } from 'react';
import { X, Pill, Clock, Calendar } from 'lucide-react';

export default function ReminderModal({ isOpen, onClose, onSave }) {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timesInput, setTimesInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const timesArray = timesInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await onSave({
      medicineName,
      dosage,
      timesOfDay: timesArray.length > 0 ? timesArray : ['08:00'],
      startDate: startDate || new Date(),
      endDate: endDate || undefined,
    });

    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Pill className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Add Medicine Schedule</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Medicine Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Paracetamol / Metformin"
              className="w-full border rounded-lg px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage Details *</label>
            <input
              required
              type="text"
              placeholder="e.g. 500mg, 1 tablet after food"
              className="w-full border rounded-lg px-3.5 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dosing Times (24-Hour Format, Comma-Separated)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="08:00, 14:00, 20:00"
                className="w-full pl-9 pr-3.5 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={timesInput}
                onChange={(e) => setTimesInput(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              {submitting ? 'Saving...' : 'Set Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}