import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, session, isAdmin } = useAuth();
  const location = useLocation();

  // Redirect to auth if not logged in
  if (!user || !session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Rule: Admin Escape (If an admin is ON the activation page, move them to dashboard)
  if (isAdmin && (location.pathname === '/activation' || location.pathname === '/finalize-activation')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
