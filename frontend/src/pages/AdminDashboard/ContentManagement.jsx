import React, { useState, useEffect } from 'react';
import { FileText, Save, Check, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Toast from '../../components/Toast';

const ContentManagement = () => {
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('homepage_hero'); // selected section key
  const [toast, setToast] = useState(null);

  // Field states mapping dynamically based on activeSection
  const [formData, setFormData] = useState({});

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/content');
      setContentMap(res.data || {});
      
      // Load active values into fields state
      if (res.data && res.data[activeSection]) {
        setFormData(res.data[activeSection]);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to retrieve website contents.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Update form fields when activeSection changes
  useEffect(() => {
    if (contentMap && contentMap[activeSection]) {
      setFormData(contentMap[activeSection]);
    } else {
      setFormData({});
    }
  }, [activeSection, contentMap]);

  const handleFieldChange = (key, val) => {
    setFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/content/${activeSection}`, { value: formData });
      setToast({ message: 'Section content saved successfully.', type: 'success' });
      // Update local mapping
      setContentMap(prev => ({
        ...prev,
        [activeSection]: formData
      }));
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to save section content.', type: 'error' });
    }
  };

  const sections = [
    { key: 'homepage_hero', label: 'Homepage Hero Banner' },
    { key: 'homepage_intro', label: 'Homepage About Intro' },
    { key: 'about_page', label: 'About Us Narrative' },
    { key: 'careers_page', label: 'Careers Culture & Perks' },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-dark">Website Content Management</h1>
        <p className="text-xs text-dark-muted font-medium uppercase tracking-widest mt-0.5">Customize layouts and adjust descriptive narrative copy online</p>
      </div>

      {/* Main Grid split: section selector, fields values */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left selector */}
        <div className="lg:col-span-1 bg-white border border-slate-150 p-4 rounded-lg shadow-sm h-fit space-y-1">
          <span className="text-[10px] uppercase font-bold text-dark-muted block px-3 pb-2 border-b border-slate-100 mb-2">Section Selector</span>
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              className={`w-full text-left px-3 py-2.5 rounded font-sans text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeSection === sec.key
                  ? 'bg-gold text-slate-950 font-bold'
                  : 'text-dark-light hover:bg-slate-50'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Right Form Fields */}
        <div className="lg:col-span-3 bg-white border border-slate-150 p-6 rounded-lg shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-serif text-base font-semibold text-dark flex items-center space-x-2">
              <FileText size={18} className="text-gold" />
              <span>Modify Section Data</span>
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">Key: {activeSection}</span>
          </div>

          {loading ? (
            <p className="text-xs text-dark-muted py-10 text-center animate-pulse">Syncing website layout copy...</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans text-dark-light">
              
              {/* Conditional renders based on activeSection */}
              {activeSection === 'homepage_hero' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold">Main Heading title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Sub-Heading subtitle description</label>
                    <textarea
                      value={formData.subtitle || ''}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none min-h-[80px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold">Primary Button Text</label>
                      <input
                        type="text"
                        value={formData.primaryButtonText || ''}
                        onChange={(e) => handleFieldChange('primaryButtonText', e.target.value)}
                        className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold">Secondary Button Text</label>
                      <input
                        type="text"
                        value={formData.secondaryButtonText || ''}
                        onChange={(e) => handleFieldChange('secondaryButtonText', e.target.value)}
                        className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'homepage_intro' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold">Heading Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Italic Sub-Heading Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Narrative Description Paragraph</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                    <div className="space-y-1">
                      <label className="font-semibold">Stat: Standing years</label>
                      <input
                        type="text"
                        value={formData.statExperience || ''}
                        onChange={(e) => handleFieldChange('statExperience', e.target.value)}
                        className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold">Stat: Retention rate</label>
                      <input
                        type="text"
                        value={formData.statRetention || ''}
                        onChange={(e) => handleFieldChange('statRetention', e.target.value)}
                        className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold">Stat: Candidate placements</label>
                      <input
                        type="text"
                        value={formData.statPositions || ''}
                        onChange={(e) => handleFieldChange('statPositions', e.target.value)}
                        className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'about_page' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold">Narrative Heading Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Introductory Overview Paragraph</label>
                    <textarea
                      value={formData.introText || ''}
                      onChange={(e) => handleFieldChange('introText', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Corporate Mission Statement</label>
                    <textarea
                      value={formData.mission || ''}
                      onChange={(e) => handleFieldChange('mission', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Corporate Vision Statement</label>
                    <textarea
                      value={formData.vision || ''}
                      onChange={(e) => handleFieldChange('vision', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Partners Section Heading subtitle</label>
                    <input
                      type="text"
                      value={formData.teamText || ''}
                      onChange={(e) => handleFieldChange('teamText', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'careers_page' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold">Careers Header Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Introduction Overview Paragraph</label>
                    <textarea
                      value={formData.introText || ''}
                      onChange={(e) => handleFieldChange('introText', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold">Culture Narrative Text</label>
                    <textarea
                      value={formData.cultureText || ''}
                      onChange={(e) => handleFieldChange('cultureText', e.target.value)}
                      className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none min-h-[80px]"
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-gold hover:bg-gold-dark px-6 py-3 rounded transition-colors shadow-soft"
                >
                  <Save size={14} />
                  <span>Save Page Content</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ContentManagement;
