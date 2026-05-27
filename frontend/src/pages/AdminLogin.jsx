import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowLeft,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const AdminLogin = () => {
  const { login, token, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (token && user?.type === 'ADMIN') {
      navigate('/admin/dashboard');
    }
  }, [token, user, navigate]);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      const errorMessage = 'Please fill in all fields.';
      setError(errorMessage);
      setToast({
        message: errorMessage,
        type: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await login(email, password);

      if (res?.success) {
        setToast({
          message: 'Welcome back to the portal!',
          type: 'success',
        });

        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1200);
      } else {
        const errorMessage =
          res?.error || 'Invalid email or password';

        setError(errorMessage);

        setToast({
          message: errorMessage,
          type: 'error',
        });
      }
    } catch (err) {
      console.error('Login Error:', err);

      const errorMessage =
        'An unexpected error occurred during login.';

      setError(errorMessage);

      setToast({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-light px-4 py-16 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-slate-900 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-light to-transparent" />
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xl max-w-md w-full relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-xl bg-yellow-100 text-yellow-700 items-center justify-center mb-2 border border-yellow-200">
            <Key size={24} />
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">
            Portal Access
          </h2>

          <p className="text-xs text-slate-500 uppercase tracking-widest">
            Infura Solutions Administration
          </p>
        </div>

        {/* Error Box */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg p-3 flex items-start gap-2">
            <ShieldAlert
              size={18}
              className="text-rose-500 shrink-0 mt-0.5"
            />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleLoginSubmit}
          className="space-y-4"
        >
          {/* Email */}
          <div className="space-y-2">
            <label className="font-medium text-slate-700 text-sm">
              Corporate Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition"
              placeholder="admin@infurasolutions.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="font-medium text-slate-700 text-sm">
              Security Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full bg-slate-50 border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none pr-12 transition"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-yellow-500 hover:text-slate-900 text-white p-3 rounded-lg font-semibold uppercase tracking-wide transition disabled:opacity-50"
          >
            {loading
              ? 'Authenticating Security...'
              : 'Portal Access'}
          </button>
        </form>

        {/* Back Link */}
        <div className="border-t border-slate-200 pt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={14} />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminLogin;