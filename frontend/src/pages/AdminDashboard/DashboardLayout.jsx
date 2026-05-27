import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Users,
  Image,
  FileText,
  FolderOpen,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Analytics', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Job Openings', path: '/admin/dashboard/jobs', icon: <Briefcase size={18} /> },
    { name: 'Sectors / Categories', path: '/admin/dashboard/categories', icon: <Layers size={18} /> },
    { name: 'Job Applicants', path: '/admin/dashboard/applicants', icon: <Users size={18} /> },
    { name: 'Homepage Banners', path: '/admin/dashboard/banners', icon: <Image size={18} /> },
    { name: 'Page Content Edit', path: '/admin/dashboard/content', icon: <FileText size={18} /> },
    { name: 'Media Storage', path: '/admin/dashboard/media', icon: <FolderOpen size={18} /> },
    { name: 'Contact Inbox', path: '/admin/dashboard/enquiries', icon: <MessageSquare size={18} /> },
    { name: 'Site Configuration', path: '/admin/dashboard/settings', icon: <Settings size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. Mobile Sidebar Hamburger Header */}
      <header className="lg:hidden fixed top-0 left-0 w-full bg-slate-900 text-white h-16 px-6 flex justify-between items-center z-30 shadow-md">
        <span className="font-serif text-lg font-semibold tracking-tight text-white flex items-center">
          Infura <span className="text-gold font-sans font-medium text-xs ml-1">SYSTEMS</span>
        </span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-800 rounded"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* 2. Left Navigation Sidebar (Desktop sticky & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 z-40 transform lg:transform-none transition-transform duration-300 ease-in-out flex flex-col justify-between border-r border-slate-800 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header Branding */}
        <div className="p-6 border-b border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-serif text-xl font-bold tracking-tight text-white flex items-center">
              Infura <span className="text-gold font-sans font-medium text-[10px] ml-1">PORTAL</span>
            </span>
            <Link
              to="/"
              className="h-7 w-7 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              title="Return to Site"
            >
              <Home size={14} />
            </Link>
          </div>

          {/* User badge */}
          {user && (
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-800 flex items-start space-x-2">
              <div className="h-8 w-8 rounded bg-gold/10 text-gold font-bold flex items-center justify-center shrink-0 uppercase text-sm border border-gold/25">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <span className="inline-block text-[9px] uppercase font-bold text-gold tracking-widest">{user.role}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive(item.path)
                  ? 'bg-gold text-slate-950 font-bold'
                  : 'hover:bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-md text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Overlay backdrop for mobile menu */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/40 z-30 lg:hidden"
        />
      )}

      {/* 3. Main Dashboard Workspace Content */}
      <main className="flex-1 p-6 lg:p-10 pt-20 lg:pt-10 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
