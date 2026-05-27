import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Briefcase, User, LogOut, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Listen scroll to add shadows/glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-panel shadow-soft py-3'
          : 'bg-white/90 md:bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            {settings.logoUrl ? (
              <img
                src={`http://localhost:5000/${settings.logoUrl}`}
                alt={settings.companyName}
                className="h-10 object-contain"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105">
                  <Briefcase size={20} className="stroke-[2]" />
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-dark flex items-center">
                  Infura
                  <span className="text-gold font-sans font-medium text-sm ml-1 select-none">SOLUTIONS</span>
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-sans text-sm font-medium transition-colors hover:text-accent py-2 ${
                  isActive(link.path) ? 'text-accent' : 'text-dark-light'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-1 text-xs font-semibold px-3 py-2 bg-secondary text-dark rounded-md hover:bg-gold-light hover:text-gold-dark transition-colors border border-gold/25"
                >
                  <Shield size={14} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-xs font-medium text-dark-muted hover:text-red-600 transition-colors"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center space-x-1 text-xs font-medium text-dark-muted hover:text-accent transition-colors"
              >
                <User size={14} />
                <span>Admin Login</span>
              </Link>
            )}
            <Link
              to="/jobs"
              className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-white bg-dark hover:bg-gold-dark transition-all duration-300 px-5 py-3 rounded shadow-soft hover:shadow-premium"
            >
              <span>Find a Job</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center space-x-2">
            {user && (
              <Link
                to="/admin/dashboard"
                className="p-2 text-dark hover:text-accent"
                title="Dashboard"
              >
                <Shield size={20} />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-dark hover:text-accent focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '64px' }}
      >
        <div className="px-6 py-8 flex flex-col space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium font-serif pb-2 border-b border-secondary ${
                isActive(link.path) ? 'text-accent border-accent/20' : 'text-dark-light'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-6 flex flex-col space-y-4">
            {user ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-secondary text-dark rounded border border-gold/25 font-semibold text-sm"
                >
                  <Shield size={16} />
                  <span>Admin Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center space-x-2 w-full py-3 text-dark-muted hover:text-red-600 transition-colors font-medium text-sm"
                >
                  <LogOut size={16} />
                  <span>Logout Account</span>
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-3 bg-secondary text-dark rounded font-medium text-sm"
              >
                <User size={16} />
                <span>Portal Access (Admin)</span>
              </Link>
            )}

            <Link
              to="/jobs"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 w-full py-4 text-white bg-dark hover:bg-gold-dark rounded font-semibold text-sm uppercase tracking-wider transition-all shadow-soft"
            >
              <span>Explore Vacancies</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
