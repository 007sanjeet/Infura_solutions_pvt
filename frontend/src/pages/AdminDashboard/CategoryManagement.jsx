import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, Check, X, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import Toast from '../../components/Toast';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('Briefcase');
  const [description, setDescription] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to retrieve job sectors.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await axios.post('http://localhost:5000/api/categories', { name, iconName, description });
      setToast({ message: 'Recruitment sector created successfully.', type: 'success' });
      setFormOpen(false);
      setName('');
      setIconName('Briefcase');
      setDescription('');
      fetchCategories();
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.error || 'Failed to create sector.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete sector? All matching jobs will have their category relations cascade or fail.')) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setToast({ message: 'Sector deleted.', type: 'success' });
      fetchCategories();
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.error || 'Failed to delete sector.', type: 'error' });
    }
  };

  const availableIcons = ['Cpu', 'DollarSign', 'Activity', 'Palette', 'Award', 'Briefcase'];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-dark">Sectors & Categories</h1>
          <p className="text-xs text-dark-muted font-medium uppercase tracking-widest mt-0.5">Define recruitment divisions and icon representations</p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-gold hover:bg-gold-dark px-5 py-3 rounded shadow transition-colors"
          >
            <Plus size={16} />
            <span>Create Sector</span>
          </button>
        )}
      </div>

      {formOpen && (
        <form onSubmit={handleCreate} className="bg-white rounded-lg border border-slate-150 p-6 shadow-premium max-w-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-serif text-base font-semibold text-dark">Create Hiring Sector</h3>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-dark-light">
            <div className="space-y-1">
              <label className="font-semibold">Sector Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                placeholder="e.g. Technology & Software"
              />
            </div>
            
            <div className="space-y-1">
              <label className="font-semibold">Select Vector Icon</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              >
                {availableIcons.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold">Sector Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none min-h-[80px]"
                placeholder="Provide a brief summary of what roles this division recruits..."
              />
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
              Create Sector
            </button>
          </div>
        </form>
      )}

      {/* Categories table list */}
      <div className="bg-white rounded-lg border border-slate-150 p-6 shadow-sm">
        {loading ? (
          <p className="text-xs text-dark-muted py-10 text-center animate-pulse">Syncing sector metadata...</p>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-dark-muted uppercase font-bold text-[10px]">
                  <th className="py-3 font-semibold">Sector Name</th>
                  <th className="py-3 font-semibold">Representing Icon</th>
                  <th className="py-3 font-semibold">Description</th>
                  <th className="py-3 font-semibold">Job Postings</th>
                  <th className="py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-dark-light">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pr-2 font-medium text-dark flex items-center space-x-2">
                      <Tag size={13} className="text-gold-dark" />
                      <span>{cat.name}</span>
                    </td>
                    <td className="py-3.5 pr-2 font-mono text-[10px] text-slate-500">{cat.iconName}</td>
                    <td className="py-3.5 pr-2 max-w-sm truncate text-dark-muted">{cat.description || 'N/A'}</td>
                    <td className="py-3.5 pr-2 text-dark font-semibold font-sans">{cat._count?.jobs || 0} Positions</td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete Sector"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center font-serif text-slate-400 italic py-10">No sectors defined in database.</p>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default CategoryManagement;
