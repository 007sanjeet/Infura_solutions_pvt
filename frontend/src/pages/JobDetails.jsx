import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, FileText, Upload, ChevronRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import Toast from '../components/Toast';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Application Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        // Load Job
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);

        // Load Similar
        const similarRes = await axios.get(`http://localhost:5000/api/jobs/${id}/similar`);
        setSimilarJobs(similarRes.data);
      } catch (err) {
        console.error('Failed to load job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !resume) {
      setToast({ message: 'Please complete all required fields and upload a resume.', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resume); // file

      const res = await axios.post('http://localhost:5000/api/applications/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setToast({ message: res.data.message || 'Application submitted successfully!', type: 'success' });
      
      // Clear Form
      setFullName('');
      setEmail('');
      setPhone('');
      setCoverLetter('');
      setResume(null);
      
      // Reset input element
      const fileInput = document.getElementById('resume-file-input');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      console.error(err);
      setToast({ message: err.response?.data?.error || 'Failed to submit application.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const parseSkills = (skillsString) => {
    if (!skillsString) return [];
    try {
      return JSON.parse(skillsString);
    } catch {
      return skillsString.split(',').map(s => s.trim());
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-light">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="font-serif text-sm italic text-dark-muted">Retrieving position specifications...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-28 pb-16 bg-secondary-light text-center">
        <p className="font-serif text-lg font-bold text-dark">Position Not Located</p>
        <Link to="/jobs" className="text-accent hover:underline mt-4 inline-block">Return to Vacancies</Link>
      </div>
    );
  }

  const skillsList = parseSkills(job.skills);

  return (
    <div className="pt-28 pb-16 bg-secondary-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/jobs" className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-dark hover:text-accent transition-colors mb-8 font-sans">
          <ArrowLeft size={14} />
          <span>Back to Open Positions</span>
        </Link>

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Block */}
            <div className="bg-white rounded-lg border border-slate-100 p-8 shadow-sm space-y-6">
              <span className="text-[10px] uppercase font-bold tracking-wider text-accent bg-accent-light px-3 py-1.5 rounded-md inline-block">
                {job.category?.name}
              </span>
              <h1 className="text-3xl font-serif text-dark font-medium leading-tight">{job.title}</h1>
              
              {/* Info Widgets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-slate-100 py-6 my-2 text-xs text-dark-muted font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-dark-muted block">Location</span>
                  <span className="font-semibold text-dark flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{job.location}</span>
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-dark-muted block">Job Type</span>
                  <span className="font-semibold text-dark flex items-center gap-1">
                    <Briefcase size={12} className="text-slate-400" />
                    <span>{job.jobType}</span>
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-dark-muted block">Offered Package</span>
                  <span className="font-semibold text-gold-dark font-serif flex items-center gap-1">
                    <DollarSign size={12} className="text-slate-400" />
                    <span>{job.salaryRange}</span>
                  </span>
                </div>
              </div>

              {/* Skills Tags */}
              {skillsList.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-dark-muted block">Required Competencies</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {skillsList.map((skill, index) => (
                      <span key={index} className="text-xs bg-secondary px-3 py-1 rounded text-dark font-sans font-medium border border-slate-200/50">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description & Requirements Block */}
            <div className="bg-white rounded-lg border border-slate-100 p-8 shadow-sm space-y-6">
              <div className="space-y-4">
                <h2 className="font-serif text-lg font-semibold text-dark border-b border-slate-100 pb-2">Description</h2>
                <div
                  className="prose prose-sm max-w-none text-xs text-dark-light leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              <div className="space-y-4 pt-4">
                <h2 className="font-serif text-lg font-semibold text-dark border-b border-slate-100 pb-2">Requirements & Qualifications</h2>
                <div
                  className="prose prose-sm max-w-none text-xs text-dark-light leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Apply Form & Similar Jobs */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Apply Form */}
            <div className="bg-white rounded-lg border border-slate-100 p-6 shadow-sm space-y-6">
              <h2 className="font-serif text-base font-semibold text-dark border-b border-slate-100 pb-3 flex items-center space-x-2">
                <FileText size={18} className="text-gold" />
                <span>Apply For This Position</span>
              </h2>
              
              <form onSubmit={handleApply} className="space-y-4 font-sans text-xs">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-dark-light">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="font-semibold text-dark-light">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                    placeholder="name@domain.com"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="font-semibold text-dark-light">Telephone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>

                {/* Cover Letter */}
                <div className="space-y-1">
                  <label className="font-semibold text-dark-light">Cover Letter (Optional)</label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none min-h-[100px] resize-none"
                    placeholder="Brief introductory note to the recruiting partners..."
                  />
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <label className="font-semibold text-dark-light">Resume CV (PDF or Word) *</label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 text-center hover:bg-slate-100/50 transition-colors">
                    <input
                      type="file"
                      id="resume-file-input"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2 text-dark-muted">
                      <Upload size={20} className="mx-auto text-gold" />
                      <p className="text-[11px]">
                        {resume ? <strong className="text-dark font-semibold">{resume.name}</strong> : 'Drag file here or click to upload'}
                      </p>
                      <p className="text-[9px] text-slate-400">PDF, DOC, DOCX up to 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-dark hover:bg-gold hover:text-slate-900 text-white p-3.5 rounded font-semibold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Submitting Application...' : 'Send Application'}
                </button>
              </form>
            </div>

            {/* Similar recommendations */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-100 p-6 shadow-sm space-y-6">
                <h2 className="font-serif text-base font-semibold text-dark border-b border-slate-100 pb-3">Similar Positions</h2>
                <div className="space-y-4">
                  {similarJobs.map((simJob) => (
                    <Link
                      key={simJob.id}
                      to={`/jobs/${simJob.id}`}
                      className="group block space-y-2 border-b border-slate-50 pb-4 last:border-b-0 last:pb-0"
                    >
                      <h4 className="font-serif text-sm font-semibold text-dark group-hover:text-accent transition-colors leading-tight">
                        {simJob.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-dark-muted font-sans">
                        <span>{simJob.location}</span>
                        <span className="text-gold-dark font-serif font-semibold">{simJob.salaryRange}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default JobDetails;
