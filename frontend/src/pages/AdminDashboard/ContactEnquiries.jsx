import React, { useState, useEffect } from 'react';
import { Mail, Check, X, ShieldAlert, FileText, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Toast from '../../components/Toast';

const ContactEnquiries = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filter Resolved State
  const [resolvedFilter, setResolvedFilter] = useState('');

  // Selected message to read in detailed modal
  const [activeMessage, setActiveMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (resolvedFilter) params.append('isResolved', resolvedFilter);
      
      const res = await axios.get(`http://localhost:5000/api/contact/messages?${params.toString()}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to retrieve enquiries inbox.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [resolvedFilter]);

  const handleToggleResolve = async (id, currentResolved) => {
    try {
      await axios.put(`http://localhost:5000/api/contact/messages/${id}/resolve`, { isResolved: !currentResolved });
      setToast({ message: 'Message inbox state updated.', type: 'success' });
      
      // Update activeMessage if open
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage(prev => ({
          ...prev,
          isResolved: !currentResolved
        }));
      }

      fetchMessages();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to modify message state.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-dark">Contact enquiries Inbox</h1>
          <p className="text-xs text-dark-muted font-medium uppercase tracking-widest mt-0.5">Read sourcing queries and mark unresolved logs</p>
        </div>

        {/* Resolved selector */}
        <div className="flex items-center space-x-2 text-xs font-sans">
          <span className="font-semibold text-dark-muted">Message Status:</span>
          <select
            value={resolvedFilter}
            onChange={(e) => setResolvedFilter(e.target.value)}
            className="bg-white border border-slate-250 p-2 rounded focus:border-gold outline-none"
          >
            <option value="">All Submissions</option>
            <option value="false">Unresolved (New)</option>
            <option value="true">Resolved</option>
          </select>
        </div>
      </div>

      {/* Messages table */}
      <div className="bg-white rounded-lg border border-slate-150 p-6 shadow-sm">
        {loading ? (
          <p className="text-xs text-dark-muted py-10 text-center animate-pulse">Checking enquiries queue...</p>
        ) : messages.length > 0 ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-dark-muted uppercase font-bold text-[10px]">
                  <th className="py-3 font-semibold">Sender Profile</th>
                  <th className="py-3 font-semibold">Subject Context</th>
                  <th className="py-3 font-semibold">Date Submitted</th>
                  <th className="py-3 font-semibold text-center">Status Badge</th>
                  <th className="py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-dark-light">
                {messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pr-2 font-medium text-dark flex items-center space-x-2">
                      <Mail size={13} className="text-slate-400" />
                      <div>
                        <span>{msg.name}</span>
                        <span className="block text-[10px] text-slate-400 font-sans font-normal">{msg.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-2 truncate max-w-[180px]">{msg.subject || 'General Sourcing Query'}</td>
                    <td className="py-3.5 pr-2 font-mono text-[10px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 pr-2 text-center">
                      <button
                        onClick={() => handleToggleResolve(msg.id, msg.isResolved)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border inline-flex items-center space-x-1 uppercase ${
                          msg.isResolved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {msg.isResolved ? 'Resolved' : 'Pending'}
                      </button>
                    </td>
                    <td className="py-3.5 text-right font-sans space-x-2">
                      <button
                        onClick={() => setActiveMessage(msg)}
                        className="p-1 text-slate-400 hover:text-accent transition-colors"
                        title="Read message content"
                      >
                        <FileText size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center font-serif text-slate-400 italic py-10">Inbox is empty.</p>
        )}
      </div>

      {/* Message Reader Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-150 p-6 sm:p-8 max-w-xl w-full shadow-premium space-y-4 font-sans text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-semibold text-dark flex items-center space-x-2">
                <MessageSquare size={16} className="text-gold" />
                <span>Query Content: {activeMessage.name}</span>
              </h3>
              <button
                onClick={() => setActiveMessage(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-3">
              <div>
                <p className="font-semibold text-dark-light">Email Address:</p>
                <p className="text-slate-500">{activeMessage.email}</p>
              </div>
              {activeMessage.phone && (
                <div>
                  <p className="font-semibold text-dark-light">Telephone Line:</p>
                  <p className="text-slate-500 font-mono">{activeMessage.phone}</p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-dark-light">Subject Header:</p>
              <p className="text-sm font-serif text-accent font-medium">{activeMessage.subject || 'General Sourcing Query'}</p>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-lg min-h-[120px] text-slate-700 leading-relaxed font-sans overflow-y-auto max-h-[220px]">
              {activeMessage.message}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => handleToggleResolve(activeMessage.id, activeMessage.isResolved)}
                className={`flex items-center space-x-1 text-[10px] font-semibold uppercase tracking-wider px-3.5 py-2 rounded border ${
                  activeMessage.isResolved
                    ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {activeMessage.isResolved ? (
                  <>
                    <AlertCircle size={14} />
                    <span>Re-open Enquiry</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Resolve Query</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => setActiveMessage(null)}
                className="px-5 py-2.5 rounded bg-dark hover:bg-gold hover:text-slate-900 text-white font-semibold uppercase tracking-wider transition-colors shadow-soft"
              >
                Close Message
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ContactEnquiries;
