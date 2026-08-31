import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  UploadCloud, 
  FileText, 
  ArrowUpRight, 
  Calendar, 
  Stethoscope, 
  Sparkles, 
  Trash2, 
  Search, 
  Filter, 
  X, 
  FileCheck 
} from 'lucide-react';

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Prescription');
  const [doctorName, setDoctorName] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch Documents
  const fetchDocs = async () => {
    try {
      setLoading(true);
      let url = '/documents';
      const params = new URLSearchParams();
      if (filter) params.append('category', filter);
      if (searchQuery) params.append('search', searchQuery);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await API.get(url);
      setDocs(res.data.data || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [filter, searchQuery]);

  // Upload Document Handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('doctorName', doctorName);
    formData.append('document', file);

    setUploading(true);
    try {
      await API.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadModal(false);
      setTitle('');
      setCategory('Prescription');
      setDoctorName('');
      setFile(null);
      fetchDocs();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  // Delete Document Handler
  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document from your vault?')) return;
    try {
      await API.delete(`/documents/${docId}`);
      fetchDocs();
    } catch (err) {
      alert('Failed to delete document: ' + (err.response?.data?.error || err.message));
    }
  };

  const categories = ['', 'Prescription', 'Lab Report', 'Discharge Summary', 'Scan/X-Ray'];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-8 shadow-lg shadow-blue-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" /> HIPAA Encrypted Cloud Vault
            </span>
            <h1 className="text-3xl font-black tracking-tight">Your Medical Records Vault</h1>
            <p className="text-blue-100 text-xs max-w-xl leading-relaxed">
              Store, view, and organize digital prescriptions, pathology reports, scan documents, and discharge summaries in one secure portal.
            </p>
          </div>

          <button
            onClick={() => setUploadModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs tracking-wide shadow-md transition-all self-start md:self-auto"
          >
            <UploadCloud className="w-4 h-4" /> Upload New Record
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat || 'All Documents'}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition shadow-sm"
          />
        </div>
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm font-medium">
          Loading your vaulted documents...
        </div>
      ) : docs.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-300 rounded-3xl bg-white">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No medical documents found</h3>
          <p className="text-xs text-slate-500 mt-1">Upload a prescription or lab report to start organizing your records.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <div
              key={doc._id}
              className="rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    {doc.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(doc.issuedDate || doc.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-800 line-clamp-1">
                  {doc.title}
                </h3>

                {doc.doctorName && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                    <span>Prescribed by Dr. {doc.doctorName}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Cloud Encrypted
                </span>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                >
                  Inspect File <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" /> Upload Document
              </h2>
              <button
                onClick={() => setUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. CBC Blood Test Report"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                >
                  <option value="Prescription">Prescription</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Scan/X-Ray">Scan/X-Ray</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Consulting Doctor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select File (PDF / Image) *</label>
                <input
                  required
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-50"
                >
                  {uploading ? 'Encrypting & Uploading...' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}