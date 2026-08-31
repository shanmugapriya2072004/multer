import React from 'react';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  UserCheck, 
  Calendar, 
  Activity, 
  FileCheck 
} from 'lucide-react';

export default function DocumentCard({ document }) {
  const getCategoryTheme = (category) => {
    switch (category) {
      case 'Prescription':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'Lab Report':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'Discharge Summary':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'Scan/X-Ray':
        return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
    }
  };

  const theme = getCategoryTheme(document.category);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className={`p-2.5 rounded-lg ${theme.bg} ${theme.text}`}>
            <FileText className="w-5 h-5" />
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${theme.bg} ${theme.text} ${theme.border}`}>
            {document.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 text-base mt-3 line-clamp-1" title={document.title}>
          {document.title}
        </h3>

        {/* Details */}
        <div className="mt-3 space-y-1 text-xs text-slate-500">
          {document.doctorName && (
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Dr. {document.doctorName}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(document.issuedDate || document.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {document.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end">
        <a
          href={document.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-md transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Record
        </a>
      </div>
    </div>
  );
}