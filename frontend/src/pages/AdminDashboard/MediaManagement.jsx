import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FolderOpen, Clipboard, Check, X, Upload } from 'lucide-react';
import axios from 'axios';
import Toast from '../../components/Toast';

const MediaManagement = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Upload States
  const [mediaFile, setMediaFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/media');
      setMediaList(res.data || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load media files.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!mediaFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('media', mediaFile); // file payload

      await axios.post('http://localhost:5000/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setToast({ message: 'File uploaded successfully to media storage.', type: 'success' });
      setMediaFile(null);
      
      const fileInput = document.getElementById('media-upload-input');
      if (fileInput) fileInput.value = '';

      fetchMedia();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to upload media file.', type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete file from disk storage?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/media/${id}`);
      setToast({ message: 'File deleted from storage.', type: 'success' });
      fetchMedia();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete file.', type: 'error' });
    }
  };

  const copyToClipboard = (path) => {
    const fullUrl = `http://localhost:5000/${path}`;
    navigator.clipboard.writeText(fullUrl);
    setToast({ message: 'Full file path copied to clipboard!', type: 'info' });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-dark">Media Library Storage</h1>
          <p className="text-xs text-dark-muted font-medium uppercase tracking-widest mt-0.5">Upload image or document assets for copy usage</p>
        </div>
      </div>

      {/* File Upload node inline */}
      <div className="bg-white border border-slate-150 p-6 rounded-lg shadow-sm max-w-md">
        <h3 className="font-serif text-sm font-semibold text-dark mb-3">Upload Custom Asset</h3>
        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative border border-dashed border-slate-250 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs w-full sm:flex-1">
            <input
              type="file"
              id="media-upload-input"
              required
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center space-x-2 text-slate-500 justify-center">
              <Upload size={14} className="text-gold" />
              <span className="truncate">{mediaFile ? mediaFile.name : 'Select custom file'}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={!mediaFile || uploading}
            className="w-full sm:w-auto bg-dark hover:bg-gold hover:text-slate-900 text-white px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-40 shrink-0"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-lg border border-slate-150 p-6 shadow-sm">
        {loading ? (
          <p className="text-xs text-dark-muted py-10 text-center animate-pulse">Syncing storage inventory...</p>
        ) : mediaList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 text-xs text-dark-light">
            {mediaList.map((media) => {
              const isImage = media.mimeType.startsWith('image/');
              return (
                <div key={media.id} className="border border-slate-150 rounded-lg overflow-hidden flex flex-col justify-between shadow-sm hover:shadow transition-shadow">
                  
                  {/* File preview */}
                  <div className="h-28 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    {isImage ? (
                      <img
                        src={`http://localhost:5000/${media.path}`}
                        alt={media.originalName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FolderOpen size={32} className="text-slate-400" />
                    )}
                  </div>

                  <div className="p-3 space-y-2 border-t border-slate-50 bg-slate-50/50">
                    <p className="font-semibold truncate text-[10px] text-dark" title={media.originalName}>
                      {media.originalName}
                    </p>
                    <p className="text-[9px] text-slate-400 font-mono">
                      {(media.size / 1024).toFixed(1)} KB
                    </p>

                    {/* Action buttons */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                      <button
                        onClick={() => copyToClipboard(media.path)}
                        className="text-slate-400 hover:text-accent p-1"
                        title="Copy file url path"
                      >
                        <Clipboard size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(media.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove from storage"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center font-serif text-slate-400 italic py-10">No custom files located in library storage.</p>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default MediaManagement;
