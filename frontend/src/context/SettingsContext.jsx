import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    companyName: 'Infura Solutions',
    phone: '',
    email: '',
    address: '',
    logoUrl: null,
    seoTitle: 'Infura Solutions | Elite Corporate Recruitment Agency',
    seoDescription: '',
    seoKeywords: '',
    socialLinks: { facebook: '', linkedin: '', twitter: '', instagram: '' },
    themeSettings: { primaryColor: '#ffffff', secondaryColor: '#f4f6f8', accentColor: '#0284c7', premiumAccent: '#c5a880' }
  });
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSettingsAndContent = async () => {
    try {
      setLoading(true);
      // Fetch settings
      const settingsRes = await axios.get('http://localhost:5000/api/settings');
      setSettings(settingsRes.data);

      // Fetch dynamic content mapping
      const contentRes = await axios.get('http://localhost:5000/api/content');
      setContent(contentRes.data);
    } catch (err) {
      console.error('Failed to load branding settings/content from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndContent();
  }, []);

  const updateLocalSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const updateLocalContent = (key, value) => {
    setContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const value = {
    settings,
    content,
    loading,
    refreshSettings: fetchSettingsAndContent,
    updateLocalSettings,
    updateLocalContent,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
