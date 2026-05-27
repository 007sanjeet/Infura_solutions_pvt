import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Calendar, Briefcase, Eye } from 'lucide-react';
import axios from 'axios';
import RichTextEditor from '../../components/RichTextEditor';
import Toast from '../../components/Toast';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form Toggles
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [jobType, setJobType] = useState('Full-Time');
  const [status, setStatus] = useState('ACTIVE');
  const [isFeatured, setIsFeatured] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [skillsString, setSkillsString] = useState(''); // comma-separated

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  const fetchJobsAndCats = async () => {
    try {
      setLoading(true);
      const jobsRes = await axios.get('http://localhost:5000/api/jobs?all=true&limit=100'); // admin requests all
      setJobs(jobsRes.data.jobs || []);

      const catsRes = await axios.get('http://localhost:5000/api/categories');
      setCategories(catsRes.data || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to retrieve list data from database.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndCats();
  }, []);

  const openAddForm = () => {
    setEditingJob(null);
    setTitle('');
    setCategoryId(categories[0]?.id || '');
    setLocation('London (Hybrid)');
    setExperienceLevel('Senior (5+ Years)');
    setSalaryRange('£80,000 - £100,000');
    setJobType('Full-Time');
    setStatus('ACTIVE');
    setIsFeatured(false);
    setDeadline('');
    setDescription('');
    setRequirements('');
    setSkillsString('');
    setFormOpen(true);
  };

  const openEditForm = (job) => {
    setEditingJob(job);
    setTitle(job.title);
    setCategoryId(job.categoryId);
    setLocation(job.location);
    setExperienceLevel(job.experienceLevel);
    setSalaryRange(job.salaryRange);
    setJobType(job.jobType);
    setStatus(job.status);
    setIsFeatured(job.isFeatured);
    setDeadline(job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '');
    setDescription(job.description);
    setRequirements(job.requirements);

    // Parse skills
    let skArray = [];
    try {
      skArray = JSON.parse(job.skills);
    } catch {
      skArray = job.skills ? job.skills.split(',') : [];
    }
    setSkillsString(skArray.join(', '));
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !description || !requirements || !categoryId) {
      setToast({ message: 'Please complete all required fields.', type: 'error' });
      return;
    }

    const skills = skillsString.split(',').map(s => s.trim()).filter(s => s);

    const payload = {
      title,
      categoryId,
      location,
      experienceLevel,
      salaryRange,
      jobType,
      status,
      isFeatured,
      deadline: deadline || null,
      description,
      requirements,
      skills,
    };

    try {
      if (editingJob) {
        // Update
        await axios.put(`http://localhost:5000/api/jobs/${editingJob.id}`, payload);
        setToast({ message: 'Job opening updated successfully.', type: 'success' });
      } else {
        // Create
        await axios.post('http://localhost:5000/api/jobs', payload);
        setToast({ message: 'Job opening created successfully.', type: 'success' });
      }
      setFormOpen(false);
      fetchJobsAndCats();
    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.error || 'Failed to save job.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this job position?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`);
      setToast({ message: 'Job position deleted.', type: 'success' });
      fetchJobsAndCats();
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to delete job.', type: 'error' });
    }
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-dark">Job Openings</h1>
          <p className="text-xs text-dark-muted font-medium uppercase tracking-widest mt-0.5">Manage positions and represent vacancies</p>
        </div>
        {!formOpen && (
          <button
            onClick={openAddForm}
            className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-gold hover:bg-gold-dark px-5 py-3 rounded shadow transition-colors"
          >
            <Plus size={16} />
            <span>Create Opening</span>
          </button>
        )}
      </div>

      {/* Form Drawer (Render when toggled open) */}
      {formOpen ? (
        <form onSubmit={handleSave} className="bg-white rounded-lg border border-slate-150 p-6 sm:p-8 shadow-premium space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-serif text-lg font-semibold text-dark">
              {editingJob ? `Modify Position: ${editingJob.title}` : 'Represent New Position'}
            </h2>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-dark-light">

            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold">Position Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                placeholder="e.g. Principal Software Architect"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Hiring Division *
              </label>

              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
                className="w-full bg-white text-black border border-slate-300 p-3 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
              >
                <option value="">
                  Select Hiring Division
                </option>

                {categories &&
                  categories.length > 0 ? (
                  categories.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                    >
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>
                    No categories found
                  </option>
                )}
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="font-semibold">Location / Office</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                placeholder="e.g. London (Hybrid)"
              />
            </div>

            {/* Experience Level */}
            <div className="space-y-1">
              <label className="font-semibold">Experience Scope</label>
              <input
                type="text"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                placeholder="e.g. Senior (5+ Years)"
              />
            </div>

            {/* Salary Range */}
            <div className="space-y-1">
              <label className="font-semibold">Offered Package</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                placeholder="e.g. £90,000 - £110,000"
              />
            </div>

            {/* Job Type */}
            <div className="space-y-1">
              <label className="font-semibold">Position Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-1">
              <label className="font-semibold">Application Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="font-semibold">Listing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              >
                <option value="ACTIVE">ACTIVE (Visible online)</option>
                <option value="INACTIVE">INACTIVE (Hidden Draft)</option>
              </select>
            </div>

            {/* Skills */}
            <div className="sm:col-span-3 space-y-1">
              <label className="font-semibold">Core Competencies / Tags (comma separated)</label>
              <input
                type="text"
                value={skillsString}
                onChange={(e) => setSkillsString(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                placeholder="e.g. React, Node.js, System Design, PostgreSQL"
              />
            </div>

            {/* Description RichText */}
            <div className="sm:col-span-3 space-y-2">
              <label className="font-semibold block">Job Description Detail *</label>
              <RichTextEditor value={description} onChange={setDescription} placeholder="Enter job summary and role detail..." />
            </div>

            {/* Requirements RichText */}
            <div className="sm:col-span-3 space-y-2">
              <label className="font-semibold block">Position Requirements *</label>
              <RichTextEditor value={requirements} onChange={setRequirements} placeholder="Enter qualifications, certifications, and required years..." />
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-slate-100 pt-6">
            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-slate-300 text-gold focus:ring-gold"
              />
              <span>Mark as Featured position (Homepage summary)</span>
            </label>

            <div className="flex space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-5 py-3 rounded border border-slate-200 hover:bg-slate-50 transition-colors font-medium text-dark-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-3 rounded bg-dark hover:bg-gold hover:text-slate-900 text-white font-semibold uppercase tracking-wider transition-colors shadow-soft"
              >
                {editingJob ? 'Update Position' : 'Save Position'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Jobs List Panel */
        <div className="bg-white rounded-lg border border-slate-150 shadow-sm overflow-hidden space-y-4 p-6">

          {/* List Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search openings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary-light border border-slate-200 rounded pl-9 pr-4 py-2.5 text-xs focus:border-gold outline-none"
              />
            </div>
            <span className="text-xs text-dark-muted font-medium shrink-0">Showing {filteredJobs.length} listings</span>
          </div>

          {loading ? (
            <div className="space-y-4 py-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-16 bg-slate-100 animate-pulse rounded" />
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-dark-muted uppercase font-bold text-[10px]">
                    <th className="py-3 font-semibold">Job Title</th>
                    <th className="py-3 font-semibold">Division</th>
                    <th className="py-3 font-semibold">Location</th>
                    <th className="py-3 font-semibold">Status</th>
                    <th className="py-3 font-semibold">Featured</th>
                    <th className="py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-dark-light">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-2 font-medium text-dark flex items-center space-x-2">
                        <span>{job.title}</span>
                        {job.jobType && <span className="bg-slate-100 text-dark-muted px-1.5 py-0.5 rounded text-[9px] font-medium">{job.jobType}</span>}
                      </td>
                      <td className="py-3.5 pr-2 truncate max-w-[120px]">{job.category?.name || 'Recruitment'}</td>
                      <td className="py-3.5 pr-2">{job.location}</td>
                      <td className="py-3.5 pr-2">
                        {job.status === 'ACTIVE' ? (
                          <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100 inline-flex items-center space-x-1">
                            <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping"></span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="bg-slate-50 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200">Hidden</span>
                        )}
                      </td>
                      <td className="py-3.5 pr-2">
                        {job.isFeatured ? (
                          <span className="text-gold-dark font-semibold">Yes</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right font-sans space-x-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          target="_blank"
                          className="p-1 text-slate-400 hover:text-accent transition-colors inline-block"
                          title="Preview online"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => openEditForm(job)}
                          className="p-1 text-slate-400 hover:text-gold-dark transition-colors"
                          title="Edit Job"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete Job"
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
            <p className="text-center font-serif text-slate-400 italic py-10">No positions represent this search query.</p>
          )}

        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default JobManagement;
