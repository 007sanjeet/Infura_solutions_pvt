import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-emerald-500" size={18} />;
      case 'error':
        return <AlertCircle className="text-rose-500" size={18} />;
      case 'info':
      default:
        return <Info className="text-sky-500" size={18} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-100 text-emerald-800';
      case 'error':
        return 'bg-rose-50 border-rose-100 text-rose-800';
      case 'info':
      default:
        return 'bg-sky-50 border-sky-100 text-sky-800';
    }
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm transform transition-all duration-300 translate-y-0 scale-100 ${getColors()}`}>
      <div className="shrink-0">{getIcon()}</div>
      <p className="text-xs font-semibold font-sans">{message}</p>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
