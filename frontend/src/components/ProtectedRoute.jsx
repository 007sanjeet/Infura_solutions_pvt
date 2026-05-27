import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = ['ADMIN', 'SUB_ADMIN'] }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-light">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="font-serif text-sm italic text-dark-muted">Authenticating administrative credentials...</p>
        </div>
      </div>
    );
  }

  // Check if token exists
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check roles
  if (user.type === 'ADMIN' && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
