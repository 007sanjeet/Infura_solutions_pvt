import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import Toast from '../components/Toast';

const Contact = () => {
  const { settings } = useSettings();
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setToast({ message: 'Please complete all required fields.', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post('http://localhost:5000/api/contact/message', {
        name,
        email,
        phone,
        subject,
        message,
      });

      setToast({ message: res.data.message || 'Message submitted successfully!', type: 'success' });
      
      // Clear Form
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.error || 'Failed to submit enquiry.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-16 bg-secondary-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-gold uppercase block">Connect With Us</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-dark font-medium leading-tight">
            Partner With Our Search Desks
          </h1>
          <p className="text-sm text-dark-muted font-sans leading-relaxed">
            Whether you are looking to scale your engineering team, secure a VP of Operations, or discuss your next career move, we are here to advise you.
          </p>
        </div>

        {/* Narrative columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Left Column: Office Details */}
          <div className="lg:col-span-1 bg-white border border-slate-100 p-8 rounded-lg shadow-sm space-y-8">
            <h3 className="font-serif text-base font-semibold text-dark border-b border-slate-100 pb-3">Corporate Office</h3>
            
            <ul className="space-y-6 text-xs text-dark-muted font-sans">
              {settings.address && (
                <li className="flex items-start space-x-4">
                  <div className="h-9 w-9 rounded bg-gold-light/40 flex items-center justify-center text-gold-dark shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-dark-light">Address Coordinates</p>
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
                    <p className="font-bold text-dark-light">Telephone Lines</p>
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
                    <p className="font-bold text-dark-light">Email Dispatch</p>
                    <a href={`mailto:${settings.email}`} className="hover:text-accent transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </li>
              )}
            </ul>

            <div className="pt-4 border-t border-slate-100 flex items-center space-x-2 text-[10px] text-slate-400 font-sans font-medium">
              <HelpCircle size={14} className="text-gold" />
              <span>We usually respond within 1 business day.</span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-lg shadow-sm space-y-6">
            <h3 className="font-serif text-base font-semibold text-dark border-b border-slate-100 pb-3">Submit Sourcing Query</h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-dark-light font-sans">
              {/* Name */}
              <div className="space-y-1">
                <label className="font-semibold">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander Sterling"
                  className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-semibold">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="font-semibold">Telephone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="font-semibold">Query Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Sourcing / Executive Search"
                  className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                />
              </div>

              {/* Message */}
              <div className="col-span-1 sm:col-span-2 space-y-1">
                <label className="font-semibold">Message Detail *</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your search timeline, requirements, or profile details..."
                  className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none min-h-[140px] resize-none"
                />
              </div>

              {/* Submit */}
              <div className="col-span-1 sm:col-span-2 pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-white bg-dark hover:bg-gold hover:text-slate-900 transition-colors px-6 py-3.5 rounded shadow-soft disabled:opacity-50"
                >
                  <span>Submit Sourcing Scope</span>
                  <Send size={12} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Google Map Placeholders Frame */}
        <section className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm aspect-[21/9] min-h-[300px]">
          <iframe
            title="Infura Solutions London Office"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.540443900227!2d-0.027096684230232496!3d51.50332407963499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!2d0x487602b667bd4787%3A0xa59f71c4c81a28a3!2sCanary%20Wharf%2C%20London!5e0!3m2!1sen!2suk!4v1652391209384!5m2!1sen!2suk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Contact;
