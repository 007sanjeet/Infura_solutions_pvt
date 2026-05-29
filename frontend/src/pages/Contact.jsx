import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import Toast from '../components/Toast';

const Contact = () => {
  const { settings } = useSettings();

  // Loader State
  const [loading, setLoading] = useState(true);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  // Loader Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Loader duration

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setToast({
        message: 'Please complete all required fields.',
        type: 'error',
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await axios.post(
        'http://localhost:5000/api/contact/message',
        {
          name,
          email,
          phone,
          subject,
          message,
        }
      );

      setToast({
        message:
          res.data.message || 'Message submitted successfully!',
        type: 'success',
      });

      // Clear Form
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);

      setToast({
        message:
          err.response?.data?.error ||
          'Failed to submit enquiry.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loader Screen
  if (loading) {
    return (
      <div className="fixed inset-0 bg-secondary-light flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-5">

          {/* Premium Loader */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-[3px] border-slate-200 rounded-full"></div>

            <div className="absolute inset-0 border-[3px] border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>

          {/* Brand Name */}
          <div className="text-center">
            <h2 className="font-serif text-xl text-dark font-semibold">
              Infura Solutions
            </h2>

            <p className="text-xs uppercase tracking-[4px] text-dark-muted mt-2">
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 bg-secondary-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-gold uppercase block">
            Connect With Us
          </span>

          <h1 className="text-4xl sm:text-5xl font-serif text-dark font-medium leading-tight">
            Partner With Our Search Desks
          </h1>

          <p className="text-sm text-dark-muted font-sans leading-relaxed">
            Whether you are looking to scale your engineering team,
            secure a VP of Operations, or discuss your next career
            move, we are here to advise you.
          </p>
        </div>

        {/* Narrative columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          {/* Left Column */}
          <div className="lg:col-span-1 bg-white border border-slate-100 p-8 rounded-lg shadow-sm space-y-8">
            <h3 className="font-serif text-base font-semibold text-dark border-b border-slate-100 pb-3">
              Corporate Office
            </h3>

            <ul className="space-y-6 text-xs text-dark-muted font-sans">
              {settings.address && (
                <li className="flex items-start space-x-4">
                  <div className="h-9 w-9 rounded bg-gold-light/40 flex items-center justify-center text-gold-dark shrink-0">
                    <MapPin size={16} />
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-dark-light">
                      Address Coordinates
                    </p>
                    <p>{settings.address}</p>
                  </div>
                </li>
              )}

              {settings.phone && (
                <li className="flex items-start space-x-4">
                  <div className="h-9 w-9 rounded bg-accent-light flex items-center justify-center text-accent shrink-0">
                    <Phone size={16} />
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-dark-light">
                      Telephone Lines
                    </p>
                    <p>{settings.phone}</p>
                  </div>
                </li>
              )}

              {settings.email && (
                <li className="flex items-start space-x-4">
                  <div className="h-9 w-9 rounded bg-slate-100 flex items-center justify-center text-dark shrink-0">
                    <Mail size={16} />
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-dark-light">
                      Email Dispatch
                    </p>

                    <a
                      href={`mailto:${settings.email}`}
                      className="hover:text-accent transition-colors"
                    >
                      {settings.email}
                    </a>
                  </div>
                </li>
              )}
            </ul>

            <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-[10px] text-slate-400 font-sans font-medium">
              <HelpCircle size={14} className="text-gold" />
              <span>
                We usually respond within 1 business day.
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-lg shadow-sm space-y-6">
            <h3 className="font-serif text-base font-semibold text-dark border-b border-slate-100 pb-3">
              Submit Sourcing Query
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-dark-light font-sans"
            >
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded"
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded"
              />

              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded"
              />

              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
                className="col-span-1 sm:col-span-2 w-full bg-secondary-light border border-slate-200 p-2.5 rounded min-h-[140px] resize-none"
              />

              <div className="col-span-1 sm:col-span-2 pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-white bg-dark hover:bg-gold hover:text-slate-900 transition-colors px-6 py-3.5 rounded shadow-soft disabled:opacity-50"
                >
                  <span>
                    {submitting
                      ? 'Submitting...'
                      : 'Submit Sourcing Scope'}
                  </span>
                  <Send size={12} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Contact;