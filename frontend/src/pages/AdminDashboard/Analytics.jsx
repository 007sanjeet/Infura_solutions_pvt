import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, FileText, CheckCircle2, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { DashboardStatsSkeleton } from '../../components/LoadingSkeleton';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    resolvedEnquiries: 0,
    totalEnquiries: 0,
  });
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Load jobs
        const jobsRes = await axios.get('http://localhost:5000/api/jobs?limit=100');
        const jobsList = jobsRes.data.jobs || [];
        const totalJobs = jobsRes.data.pagination.total;
        const activeJobs = jobsList.filter(j => j.status === 'ACTIVE').length;

        // Load applications
        const appsRes = await axios.get('http://localhost:5000/api/applications?limit=5');
        const totalApps = appsRes.data.pagination.total;
        const recentApps = appsRes.data.applications || [];
        const pendingApps = recentApps.filter(a => a.status === 'PENDING').length; // simple approximation

        // Load enquiries
        const enquiriesRes = await axios.get('http://localhost:5000/api/contact/messages?limit=100');
        const enquiriesList = enquiriesRes.data.messages || [];
        const totalEnquiries = enquiriesRes.data.pagination.total;
        const resolvedEnquiries = enquiriesList.filter(m => m.isResolved).length;

        setStats({
          totalJobs,
          activeJobs,
          totalApplications: totalApps,
          pendingApplications: pendingApps,
          totalEnquiries,
          resolvedEnquiries,
        });
        setRecentApplicants(recentApps);
      } catch (err) {
        console.error('Failed to load analytics dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-50 text-amber-800 text-[9px] font-bold px-2.5 py-0.5 rounded border border-amber-200">Pending</span>;
      case 'SHORTLISTED':
        return <span className="bg-sky-50 text-sky-800 text-[9px] font-bold px-2.5 py-0.5 rounded border border-sky-200">Shortlisted</span>;
      case 'REJECTED':
        return <span className="bg-rose-50 text-rose-800 text-[9px] font-bold px-2.5 py-0.5 rounded border border-rose-200">Rejected</span>;
      case 'SELECTED':
        return <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold px-2.5 py-0.5 rounded border border-emerald-200">Selected</span>;
      default:
        return <span className="bg-slate-50 text-slate-800 text-[9px] font-bold px-2.5 py-0.5 rounded border border-slate-200">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl font-semibold text-dark">Analytics Dashboard</h1>
        <DashboardStatsSkeleton />
        <div className="h-64 bg-white animate-pulse border border-slate-100 rounded-lg" />
      </div>
    );
  }

  // Calculate status breakdown for simple chart representation
  const activeRate = stats.totalJobs > 0 ? Math.round((stats.activeJobs / stats.totalJobs) * 100) : 0;
  const resolveRate = stats.totalEnquiries > 0 ? Math.round((stats.resolvedEnquiries / stats.totalEnquiries) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-semibold text-dark">Analytics Dashboard</h1>
        <p className="text-xs text-dark-muted font-sans font-medium uppercase tracking-widest mt-0.5">Real-time system health & recruitment metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
        
        {/* Total Jobs */}
        <div className="bg-white border border-slate-150 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-dark-muted block">Represented Jobs</span>
            <p className="text-3xl font-serif font-semibold text-dark">{stats.totalJobs}</p>
            <span className="text-[10px] text-emerald-600 font-semibold">{stats.activeJobs} Active Listings</span>
          </div>
          <div className="h-12 w-12 rounded bg-gold-light/40 flex items-center justify-center text-gold-dark shrink-0">
            <Briefcase size={20} />
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white border border-slate-150 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-dark-muted block">Applications Recd</span>
            <p className="text-3xl font-serif font-semibold text-dark">{stats.totalApplications}</p>
            <span className="text-[10px] text-amber-600 font-semibold">Candidacy Inbox</span>
          </div>
          <div className="h-12 w-12 rounded bg-accent-light flex items-center justify-center text-accent shrink-0">
            <Users size={20} />
          </div>
        </div>

        {/* Active Ratio */}
        <div className="bg-white border border-slate-150 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-dark-muted block">Active Ratio</span>
            <p className="text-3xl font-serif font-semibold text-dark">{activeRate}%</p>
            <span className="text-[10px] text-slate-400 font-semibold">Of listings are online</span>
          </div>
          <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
            <ShieldCheck size={20} />
          </div>
        </div>

        {/* Resolved Enquiries */}
        <div className="bg-white border border-slate-150 p-6 rounded-lg shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-dark-muted block">Resolved Enquiries</span>
            <p className="text-3xl font-serif font-semibold text-dark">{stats.resolvedEnquiries}</p>
            <span className="text-[10px] text-sky-600 font-semibold">{resolveRate}% Resolution Rate</span>
          </div>
          <div className="h-12 w-12 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid: Simple Charts & Recent applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Simple System Health Check Chart */}
        <div className="lg:col-span-1 bg-white border border-slate-150 p-6 rounded-lg shadow-sm space-y-6 font-sans">
          <h3 className="font-serif text-base font-semibold text-dark border-b border-slate-100 pb-3">Recruitment Conversion</h3>
          
          <div className="space-y-4 text-xs">
            {/* Active Jobs Bar */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Active Listings Rate</span>
                <span>{activeRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-gold h-full rounded-full transition-all" style={{ width: `${activeRate}%` }}></div>
              </div>
              <p className="text-[10px] text-dark-muted">{stats.activeJobs} of {stats.totalJobs} jobs online</p>
            </div>

            {/* Resolved Messages Bar */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>Enquiries Inbox Cleared</span>
                <span>{resolveRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-accent h-full rounded-full transition-all" style={{ width: `${resolveRate}%` }}></div>
              </div>
              <p className="text-[10px] text-dark-muted">{stats.resolvedEnquiries} of {stats.totalEnquiries} messages resolved</p>
            </div>
          </div>
        </div>

        {/* Recent Applicants list */}
        <div className="lg:col-span-2 bg-white border border-slate-150 p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-serif text-base font-semibold text-dark">Recent Candidacy Submissions</h3>
            <Link
              to="/admin/dashboard/applicants"
              className="text-xs text-accent hover:text-gold transition-colors font-sans font-bold uppercase tracking-wider inline-flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {recentApplicants.length > 0 ? (
            <div className="overflow-x-auto font-sans text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-dark-muted uppercase font-bold text-[10px]">
                    <th className="py-3 font-semibold">Candidate</th>
                    <th className="py-3 font-semibold">Position</th>
                    <th className="py-3 font-semibold">Submitted</th>
                    <th className="py-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-dark-light">
                  {recentApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 pr-2 font-medium text-dark">{app.fullName}</td>
                      <td className="py-3.5 pr-2 truncate max-w-[150px]">{app.job?.title}</td>
                      <td className="py-3.5 pr-2 text-[10px] text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 text-right">{getStatusBadge(app.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center font-serif text-slate-500 italic py-10">No recent applications submitted.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
