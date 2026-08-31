import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  UploadCloud,
  FileText,
  ArrowUpRight,
  Calendar,
  Stethoscope,
  Sparkles,
  X
} from 'lucide-react';

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [filter, setFilter] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Prescription');
  const [doctorName, setDoctorName] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ==============================
  // Fetch Documents
  // ==============================
  const fetchDocs = async () => {
    try {
      const res = await API.get(
        `/documents${filter ? `?category=${encodeURIComponent(filter)}` : ''}`
      );

      setDocs(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [filter]);

  // ==============================
  // Upload Document
  // ==============================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();

    formData.append('title', title);
    formData.append('category', category);
    formData.append('doctorName', doctorName);

    // IMPORTANT:
    // Backend uses upload.single('file')
    formData.append('file', file);

    setUploading(true);

    try {
      const res = await API.post('/documents', formData);

      console.log('Upload successful:', res.data);

      setUploadModal(false);

      // Reset form
      setTitle('');
      setCategory('Prescription');
      setDoctorName('');
      setFile(null);

      // Refresh documents
      fetchDocs();

      alert('Document uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);

      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Upload failed';

      alert('Upload failed: ' + message);
    } finally {
      setUploading(false);
    }
  };

  // ==============================
  // File Selection
  // ==============================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // 10 MB limit
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10 MB');
      e.target.value = '';
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* ========================================
          Hero Banner
      ======================================== */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 p-6 sm:p-8 text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">

        <div className="space-y-2">

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Patient Vault
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Medical Record Vault
          </h1>

          <p className="text-blue-100 text-xs sm:text-sm max-w-lg">
            Store, view, and organize your doctor prescriptions and pathology
            test reports securely in one place.
          </p>

        </div>

        <button
          onClick={() => setUploadModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs tracking-wide shadow-md transition transform hover:-translate-y-0.5 self-start md:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Document
        </button>

      </div>

      {/* ========================================
          Filter Tabs
      ======================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">

        {[
          '',
          'Prescription',
          'Lab Report',
          'Discharge Summary',
          'Scan/X-Ray'
        ].map((cat) => (

          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cat || 'All Documents'}
          </button>

        ))}

      </div>

      {/* ========================================
          Documents Grid
      ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {docs.length === 0 ? (

          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">

            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />

            <h3 className="text-sm font-bold text-slate-700">
              No medical records found
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Upload a prescription or lab report to populate your vault.
            </p>

          </div>

        ) : (

          docs.map((doc) => (

            <div
              key={doc._id}
              className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >

              <div>

                <div className="flex items-center justify-between mb-3">

                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                    {doc.category}
                  </span>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />

                    {new Date(
                      doc.issuedDate || doc.createdAt
                    ).toLocaleDateString()}
                  </span>

                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                  {doc.title}
                </h3>

                {doc.doctorName && (

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">

                    <Stethoscope className="w-3.5 h-3.5 text-blue-600" />

                    <span>
                      Dr. {doc.doctorName}
                    </span>

                  </div>

                )}

              </div>

              {/* Document Action */}

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">

                <span className="text-xs text-slate-400 font-medium">
                  Digital Cloud Record
                </span>

                {doc.fileUrl ? (

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Open File

                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                ) : (

                  <span className="text-xs text-red-500">
                    File unavailable
                  </span>

                )}

              </div>

            </div>

          ))

        )}

      </div>

      {/* ========================================
          Upload Modal
      ======================================== */}
      {uploadModal && (

        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">

              <h2 className="text-base font-bold text-slate-900">
                Upload to Medical Vault
              </h2>

              <button
                type="button"
                onClick={() => setUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Upload Form */}

            <form
              onSubmit={handleUpload}
              className="space-y-3.5 text-xs"
            >

              {/* Title */}

              <div>

                <label className="block font-semibold text-slate-700 mb-1">
                  Document Title *
                </label>

                <input
                  required
                  type="text"
                  placeholder="e.g. CBC Blood Report"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

              </div>

              {/* Category */}

              <div>

                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-blue-600"
                >

                  <option value="Prescription">
                    Prescription
                  </option>

                  <option value="Lab Report">
                    Lab Report
                  </option>

                  <option value="Discharge Summary">
                    Discharge Summary
                  </option>

                  <option value="Scan/X-Ray">
                    Scan/X-Ray
                  </option>

                </select>

              </div>

              {/* Doctor Name */}

              <div>

                <label className="block font-semibold text-slate-700 mb-1">
                  Doctor Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Rajesh"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />

              </div>

              {/* File */}

              <div>

                <label className="block font-semibold text-slate-700 mb-1">
                  Select File (PDF / Image) *
                </label>

                <input
                  required
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="w-full text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleFileChange}
                />

                {file && (

                  <p className="mt-2 text-xs text-slate-500">
                    Selected: <strong>{file.name}</strong>
                  </p>

                )}

              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() => {
                    setUploadModal(false);
                    setFile(null);
                  }}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Save File'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}