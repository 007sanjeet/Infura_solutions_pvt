import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Calendar, SlidersHorizontal, ArrowRight, X } from 'lucide-react';
import axios from 'axios';
import { CardSkeleton } from '../components/LoadingSkeleton';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedJobType, setSelectedJobType] = useState(searchParams.get('jobType') || '');
  const [selectedExperience, setSelectedExperience] = useState(searchParams.get('experienceLevel') || '');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // Sync state with URL params
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('categoryId') || '');
    setSelectedLocation(searchParams.get('location') || '');
    setSelectedJobType(searchParams.get('jobType') || '');
    setSelectedExperience(searchParams.get('experienceLevel') || '');
    setCurrentPage(parseInt(searchParams.get('page') || '1'));
  }, [searchParams]);

  // Load Categories
  useEffect(() => {
    const fetchCats = async () => {
  try {
    const res = await axios.get(
      'http://localhost:5000/api/categories'
    );

    setCategories(
      Array.isArray(res?.data)
        ? res.data
        : res?.data?.categories || []
    );
  } catch (err) {
    console.error('Failed to load categories:', err);
    setCategories([]);
  }
};
    fetchCats();
  }, []);

  // Load Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Build query string
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory) params.append('categoryId', selectedCategory);
        if (selectedLocation) params.append('location', selectedLocation);
        if (selectedJobType) params.append('jobType', selectedJobType);
        if (selectedExperience) params.append('experienceLevel', selectedExperience);
        params.append('page', currentPage);
        params.append('limit', 6); // 6 jobs per page
        params.append('status', 'ACTIVE'); // only active

        const res = await axios.get(`http://localhost:5000/api/jobs?${params.toString()}`);
        setJobs(res?.data?.jobs || []);

setTotalPages(
  res?.data?.pagination?.totalPages ||
  res?.data?.totalPages ||
  1
);

setTotalJobs(
  res?.data?.pagination?.total ||
  res?.data?.total ||
  0
);
      } catch (err) {
        console.error('Failed to load jobs list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, selectedCategory, selectedLocation, selectedJobType, selectedExperience, currentPage]);

  useEffect(() => {
  const timer = setTimeout(() => {
    setPageLoading(false);
  }, 1500);

  return () => clearTimeout(timer);
}, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams({ search: searchTerm, page: 1 });
  };

  const updateUrlParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Always default to page 1 on filter edits
    newParams.set('page', '1');
    setCurrentPage(1);

    Object.entries(updates).forEach(([key, val]) => {
      if (val) {
        newParams.set(key, val);
      } else {
        newParams.delete(key);
      }
    });

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedJobType('');
    setSelectedExperience('');
    setSearchParams({});
    setCurrentPage(1);
  };

  const handlePageChange = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNum.toString());
    setSearchParams(newParams);
    setCurrentPage(pageNum);
    
    // Scroll to top of list
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const jobTypes = [
  'Full-Time',
  'Part-Time',
  'Contract',
  'Temporary',
  'Remote'
];

const expLevels = [
  'Entry Level',
  'Mid Level',
  'Senior / Principal',
  'Executive / C-Suite'
];


// ================= LOADER START =================
if (pageLoading) {
  return (
    <div className="fixed inset-0 bg-secondary-light flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-5">

        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-[3px] border-slate-200 rounded-full"></div>

          <div className="absolute inset-0 border-[3px] border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Brand Text */}
        <div className="text-center">
          <h2 className="font-serif text-2xl text-dark font-semibold">
            Infura Solutions
          </h2>

          <p className="text-xs uppercase tracking-[4px] text-dark-muted mt-2">
            Loading Jobs...
          </p>
        </div>
      </div>
    </div>
  );
}
// ================= LOADER END =================

  return (
    <div className="pt-28 pb-16 bg-secondary-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest text-gold uppercase block mb-2">Opportunities</span>
          <h1 className="text-3xl sm:text-4xl font-serif text-dark font-medium">Explore Open Vacancies</h1>
          <p className="text-xs text-dark-muted font-sans mt-1">
            Browse through current corporate positions represented by our consulting partners.
          </p>
        </div>

        {/* Filters and List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter Section */}
          <div className="lg:col-span-1 bg-white rounded-lg border border-slate-100 p-6 shadow-sm h-fit space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="font-serif text-sm font-semibold text-dark flex items-center space-x-2">
                <SlidersHorizontal size={16} className="text-gold" />
                <span>Filter Vacancies</span>
              </span>
              {(searchTerm || selectedCategory || selectedLocation || selectedJobType || selectedExperience) && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] text-accent hover:text-red-500 font-sans font-bold uppercase transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-dark-muted block">Hiring Sector</label>
              <select
                value={selectedCategory}
                onChange={(e) => updateUrlParams({ categoryId: e.target.value })}
                className="w-full text-xs bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              >
                <option value="">All Sectors</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-dark-muted block">Position Type</label>
              <select
                value={selectedJobType}
                onChange={(e) => updateUrlParams({ jobType: e.target.value })}
                className="w-full text-xs bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              >
                <option value="">All Types</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-dark-muted block">Experience Scope</label>
              <select
                value={selectedExperience}
                onChange={(e) => updateUrlParams({ experienceLevel: e.target.value })}
                className="w-full text-xs bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none"
              >
                <option value="">All Levels</option>
                {expLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-dark-muted block">Location / City</label>
              <input
                type="text"
                placeholder="e.g. London"
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  updateUrlParams({ location: e.target.value });
                }}
                className="w-full text-xs bg-secondary-light border border-slate-200 p-2.5 rounded focus:border-gold outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Main Content Listings */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search Box Form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative w-full">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by job title, requirements, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded pl-10 pr-4 py-3 text-sm focus:border-gold outline-none shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-dark hover:bg-gold-dark text-white px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            <div className="flex justify-between items-center text-xs text-dark-muted px-1 font-sans font-medium">
              <span>Found <strong className="text-dark">{totalJobs}</strong> matching positions</span>
              {currentPage > 1 && <span>Page {currentPage} of {totalPages}</span>}
            </div>

            {/* Jobs Card List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <CardSkeleton key={idx} />
                ))}
              </div>
            ) : Array.isArray(jobs) && jobs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-lg border border-slate-150 p-6 flex flex-col justify-between shadow-card card-hover-effect relative"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-accent bg-accent-light px-2.5 py-1 rounded">
                            {job.category?.name}
                          </span>
                          <span className="text-[10px] font-sans text-dark-muted flex items-center space-x-1">
                            <Calendar size={12} className="stroke-[1.5]" />
                            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                        
                        <h3 className="font-serif text-base font-semibold text-dark leading-snug pt-1">
                          {job.title}
                        </h3>

                        <div className="grid grid-cols-2 gap-2 text-xs text-dark-muted font-sans border-y border-slate-50 py-3 my-2">
                          <span className="flex items-center space-x-1">
                            <MapPin size={13} className="text-slate-400" />
                            <span className="truncate">{job.location}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Briefcase size={13} className="text-slate-400" />
                            <span className="truncate">{job.jobType}</span>
                          </span>
                          <span className="flex items-center space-x-1 col-span-2">
                            <DollarSign size={13} className="text-slate-400" />
                            <span className="text-gold-dark font-serif font-semibold">{job.salaryRange}</span>
                          </span>
                        </div>

                        {/* Excerpt */}
                        <div
                          className="text-xs text-dark-muted line-clamp-3 leading-relaxed font-sans"
                          dangerouslySetInnerHTML={{ __html: job.description }}
                        />
                      </div>

                      <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="text-xs font-sans font-bold uppercase tracking-wider text-white bg-dark hover:bg-gold hover:text-slate-900 transition-colors px-4 py-2.5 rounded shadow-soft"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2 pt-8 font-sans">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-xs font-semibold rounded border border-slate-200 bg-white hover:bg-secondary disabled:opacity-40 disabled:hover:bg-white text-dark-muted"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 text-xs font-semibold rounded border ${
                            currentPage === pageNum
                              ? 'bg-dark text-white border-dark'
                              : 'bg-white text-dark border-slate-200 hover:bg-secondary'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-xs font-semibold rounded border border-slate-200 bg-white hover:bg-secondary disabled:opacity-40 disabled:hover:bg-white text-dark-muted"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg border border-slate-100 p-12 text-center shadow-sm">
                <X size={40} className="text-gold mx-auto mb-4" />
                <p className="font-serif text-lg font-semibold text-dark mb-2">No Vacancies Located</p>
                <p className="text-xs text-dark-muted font-sans max-w-sm mx-auto leading-relaxed mb-6">
                  We currently do not represent active positions matching these filters. Refine search criteria or register a contact enquiry.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-secondary text-dark border border-slate-200 hover:bg-slate-200 px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Jobs;
