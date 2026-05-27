import React, { useState, useEffect } from 'react';
import { Save, Upload, Check, ShieldAlert, Globe, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useSettings } from '../../context/SettingsContext';
import Toast from '../../components/Toast';

const SettingsPanel = () => {
  const { settings, refreshSettings, updateLocalSettings } = useSettings();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  
  // Social links (facebook, linkedin, twitter, instagram)
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');

  // SEO metadata
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Logo file
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName || 'Infura Solutions');
      setPhone(settings.phone || '');
      setEmail(settings.email || '');
      setAddress(settings.address || '');
      
      const socials = settings.socialLinks || {};
      setLinkedin(socials.linkedin || '');
      setFacebook(socials.facebook || '');
      setTwitter(socials.twitter || '');
      setInstagram(socials.instagram || '');

      setSeoTitle(settings.seoTitle || '');
      setSeoDescription(settings.seoDescription || '');
      setSeoKeywords(settings.seoKeywords || '');
    }
  }, [settings]);

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('companyName', companyName);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('address', address);
      
      const socials = { facebook, linkedin, twitter, instagram };
      formData.append('socialLinks', JSON.stringify(socials));

      formData.append('seoTitle', seoTitle);
      formData.append('seoDescription', seoDescription);
      formData.append('seoKeywords', seoKeywords);

      if (logoFile) {
        formData.append('logo', logoFile); // Multer logo upload
      }

      const res = await axios.put('http://localhost:5000/api/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setToast({ message: res.data.message || 'Configurations saved successfully.', type: 'success' });
      
      // Clear logo selection
      setLogoFile(null);
      const logoInput = document.getElementById('logo-file-input');
      if (logoInput) logoInput.value = '';

      // Refresh global settings context
      refreshSettings();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to update website configuration settings.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-dark">Website Configuration</h1>
        <p className="text-xs text-dark-muted font-medium uppercase tracking-widest mt-0.5">Customize company contact details, brand logos, and search optimization parameters</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl text-xs text-dark-light">
        
        {/* Core & Logo Card */}
        <div className="bg-white border border-slate-150 p-6 rounded-lg shadow-sm space-y-6">
          <h3 className="font-serif text-base font-semibold text-dark border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Globe size={18} className="text-gold" />
            <span>General Business Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-1">
              <label className="font-semibold">Company Name Branding *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-1">
              <label className="font-semibold">Corporate Logo Image</label>
              <div className="flex items-center space-x-4">
                {settings.logoUrl && (
                  <div className="h-10 px-3 py-1.5 border border-slate-200 bg-slate-50 flex items-center justify-center rounded">
                    <img
                      src={`http://localhost:5000/${settings.logoUrl}`}
                      alt="Brand Logo"
                      className="h-full object-contain"
                    />
                  </div>
                )}
                
                <div className="relative border border-dashed border-slate-250 p-2 bg-slate-50 hover:bg-slate-100 rounded text-center cursor-pointer flex-1">
                  <input
                    type="file"
                    id="logo-file-input"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center space-x-2 text-slate-500 justify-center">
                    <Upload size={14} className="text-gold" />
                    <span className="truncate">{logoFile ? logoFile.name : 'Upload New Logo'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="font-semibold">General Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="font-semibold">Telephone Line</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold">Office Coordinates Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className="bg-white border border-slate-150 p-6 rounded-lg shadow-sm space-y-6">
          <h3 className="font-serif text-base font-semibold text-dark border-b border-slate-100 pb-3 flex items-center space-x-2">
            <MessageSquare size={18} className="text-gold" />
            <span>Social Networking Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold">LinkedIn Profile URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none font-mono text-[10px]"
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">Facebook Page URL</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none font-mono text-[10px]"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">Twitter Account URL</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none font-mono text-[10px]"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">Instagram URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none font-mono text-[10px]"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* SEO Parameters Card */}
        <div className="bg-white border border-slate-150 p-6 rounded-lg shadow-sm space-y-6">
          <h3 className="font-serif text-base font-semibold text-dark border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Globe size={18} className="text-gold" />
            <span>SEO Meta Tags Parameters</span>
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="font-semibold">SEO Title Header</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none font-sans"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">SEO Keywords (comma separated)</label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none font-sans"
                placeholder="recruitment, hiring agency, jobs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">SEO Meta Description</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none font-sans min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-gold hover:bg-gold-dark px-6 py-3.5 rounded transition-colors shadow-soft disabled:opacity-50"
          >
            <Save size={14} />
            <span>{loading ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SettingsPanel;
