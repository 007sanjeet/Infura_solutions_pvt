import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image, Check, X, ShieldAlert, Upload } from 'lucide-react';
import axios from 'axios';
import Toast from '../../components/Toast';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('/jobs');
  const [order, setOrder] = useState('0');
  const [bannerFile, setBannerFile] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/banners?all=true'); // admin requests all
      setBanners(res.data || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to retrieve slide banners.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !bannerFile) {
      setToast({ message: 'Title and image are required.', type: 'error' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('linkUrl', linkUrl);
      formData.append('order', order);
      formData.append('isActive', 'true');
      formData.append('banner', bannerFile); // file payload

      await axios.post('http://localhost:5000/api/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setToast({ message: 'Banner slide uploaded successfully.', type: 'success' });
      setFormOpen(false);
      setTitle('');
      setSubtitle('');
      setLinkUrl('/jobs');
      setOrder('0');
      setBannerFile(null);

      const fileInput = document.getElementById('banner-file-input');
      if (fileInput) fileInput.value = '';

      fetchBanners();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to upload banner slide.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this banner?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/banners/${id}`);
      setToast({ message: 'Banner slide deleted successfully.', type: 'success' });
      fetchBanners();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete banner.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-dark">Homepage Banners</h1>
          <p className="text-xs text-dark-muted font-medium uppercase tracking-widest mt-0.5">Upload hero banners for the sliders</p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-gold hover:bg-gold-dark px-5 py-3 rounded shadow transition-colors"
          >
            <Plus size={16} />
            <span>Upload Slide</span>
          </button>
        )}
      </div>

      {/* Upload Form */}
      {formOpen && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg border border-slate-150 p-6 shadow-premium max-w-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-serif text-base font-semibold text-dark">Upload Slider Banner</h3>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-dark-light">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold">Slide Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                placeholder="e.g. Connecting Elite Corporate Talent"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold">Subtitle Description</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                placeholder="e.g. Premium executive search services."
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Redirect Link Url</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                placeholder="e.g. /jobs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Sequence Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                placeholder="e.g. 1"
              />
            </div>

            {/* Banner file uploader */}
            <div className="sm:col-span-2 space-y-2">
              <label className="font-semibold">Banner Image *</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded p-4 bg-slate-50 text-center hover:bg-slate-100/50 transition-colors">
                <input
                  type="file"
                  id="banner-file-input"
                  required
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload size={18} className="mx-auto text-gold mb-1" />
                <p className="text-[10px]">
                  {bannerFile ? <strong className="text-dark font-semibold">{bannerFile.name}</strong> : 'Select banner file'}
                </p>
                <p className="text-[8px] text-slate-400">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 text-xs pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2.5 rounded border border-slate-200 hover:bg-slate-50 transition-colors text-dark-muted font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded bg-dark hover:bg-gold hover:text-slate-900 text-white font-semibold uppercase tracking-wider transition-colors shadow-soft"
            >
              Upload Slide
            </button>
          </div>
        </form>
      )}

      {/* Slide list display */}
      <div className="bg-white rounded-lg border border-slate-150 p-6 shadow-sm">
        {loading ? (
          <p className="text-xs text-dark-muted py-10 text-center animate-pulse">Syncing homepage sliders...</p>
        ) : banners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-dark-light font-sans">
            {banners.map((ban) => (
              <div key={ban.id} className="border border-slate-150 rounded-lg overflow-hidden flex flex-col justify-between shadow-card">
                <div className="h-40 bg-slate-100 relative">
                  <img
                    src={`http://localhost:5000/${ban.imageUrl}`}
                    alt={ban.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image failed:', ban.imageUrl);
                      e.target.src =
                        'https://via.placeholder.com/600x300?text=No+Image';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-slate-950/80 text-gold text-[9px] font-bold py-0.5 px-2 rounded-full">
                    Order: {ban.order}
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-serif text-sm font-semibold text-dark leading-tight">{ban.title}</h4>
                    <p className="text-[11px] text-dark-muted truncate">{ban.subtitle}</p>
                    {ban.linkUrl && <p className="text-[10px] text-slate-400">Link redirect: {ban.linkUrl}</p>}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleDelete(ban.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1 font-semibold uppercase tracking-wider"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center font-serif text-slate-400 italic py-10">No banner slides represent homepage backgrounds.</p>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BannerManagement;
