import React, { useState, useEffect } from 'react';
import { FileText, Download, Check, X, ShieldAlert, Eye, User, Calendar, ExternalLink } from 'lucide-react';
import axios from 'axios';
import Toast from '../../components/Toast';

const ApplicantManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal for Viewing Cover Letter
  const [activeCoverLetter, setActiveCoverLetter] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      
      const res = await axios.get(`http://localhost:5000/api/applications?${params.toString()}`);
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to retrieve applications.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/applications/${id}/status`, { status: newStatus });
      setToast({ message: res.data.message || 'Status updated successfully.', type: 'success' });
      fetchApplications();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update application status.', type: 'error' });
    }
  };

  const handleDownload = (id, filename) => {
    // Navigate or call window.open to trigger download stream
    window.open(`http://localhost:5000/api/applications/${id}/download-resume`, '_blank');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'SHORTLISTED':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'SELECTED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-dark">Job Applicants</h1>
          <p className="text-xs text-dark-muted font-medium uppercase tracking-widest mt-0.5">Review CV files and assign recruitment status</p>
        </div>
        
        {/* Status Filter Dropdown */}
        <div className="flex items-center space-x-2 text-xs font-sans">
          <span className="font-semibold text-dark-muted">Candidacy State:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-250 p-2 rounded focus:border-gold outline-none"
          >
            <option value="">All Applicants</option>
            <option value="PENDING">Pending (Under Review)</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="SELECTED">Selected (Hire)</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicants List */}
      <div className="bg-white rounded-lg border border-slate-150 p-6 shadow-sm">
        {loading ? (
          <p className="text-xs text-dark-muted py-10 text-center animate-pulse">Syncing candidate profiles...</p>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-dark-muted uppercase font-bold text-[10px]">
                  <th className="py-3 font-semibold">Candidate Name</th>
                  <th className="py-3 font-semibold">Position Target</th>
                  <th className="py-3 font-semibold">Contact Details</th>
                  <th className="py-3 font-semibold">Date Received</th>
                  <th className="py-3 font-semibold text-center">Status Assignment</th>
                  <th className="py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-dark-light">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pr-2 font-medium text-dark flex items-center space-x-2">
                      <User size={13} className="text-slate-400" />
                      <span>{app.fullName}</span>
                    </td>
                    <td className="py-3.5 pr-2 truncate max-w-[150px]">
                      <span className="font-medium text-slate-800">{app.job?.title}</span>
                      {app.job?.location && <span className="block text-[10px] text-slate-400">{app.job?.location}</span>}
                    </td>
                    <td className="py-3.5 pr-2">
                      <p>{app.email}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{app.phone}</p>
                    </td>
                    <td className="py-3.5 pr-2 font-mono text-[10px] text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 pr-2 text-center">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded border outline-none cursor-pointer font-sans uppercase tracking-wider ${getStatusBadge(app.status)}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="SELECTED">SELECTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td className="py-3.5 text-right font-sans space-x-2">
                      {app.coverLetter && (
                        <button
                          onClick={() => setActiveCoverLetter(app)}
                          className="p-1 text-slate-400 hover:text-accent transition-colors"
                          title="View Cover Letter"
                        >
                          <FileText size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDownload(app.id, app.resumePath)}
                        className="p-1 text-slate-400 hover:text-gold-dark transition-colors inline-block"
                        title="Download Resume"
                      >
                        <Download size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center font-serif text-slate-400 italic py-10">No applications represent this category.</p>
        )}
      </div>

      {/* Cover Letter Read Modal Popup */}
      {activeCoverLetter && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-150 p-6 sm:p-8 max-w-xl w-full shadow-premium space-y-4 font-sans text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-semibold text-dark">
                Cover Letter: {activeCoverLetter.fullName}
              </h3>
              <button
                onClick={() => setActiveCoverLetter(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-1 py-1">
              <p className="font-semibold text-dark-light">Applying for Position:</p>
              <p className="text-sm font-serif text-accent font-medium">{activeCoverLetter.job?.title}</p>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-lg min-h-[120px] text-slate-700 leading-relaxed font-sans overflow-y-auto max-h-[220px]">
              {activeCoverLetter.coverLetter}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveCoverLetter(null)}
                className="px-5 py-2 rounded bg-dark hover:bg-gold hover:text-slate-900 text-white font-semibold uppercase tracking-wider transition-colors shadow-soft"
              >
                Close Cover Letter
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ApplicantManagement;
