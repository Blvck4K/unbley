import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, session, isAdmin } = useAuth();
  const location = useLocation();

  // Redirect to auth if not logged in
  if (!user || !session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check state markers set via Supabase Auth metadata
  const profileCompleted = user.user_metadata?.profile_completed;
  const storeActive = user.user_metadata?.store_active;
  
  // Rule 1: Must Complete Profile Setup (Always required for everyone)
  if (!profileCompleted && location.pathname !== '/edit') {
    return <Navigate to="/edit" replace />;
  }

  // Rule 2: Store Activation Check (SKIPPED BY ADMINS)
  if (profileCompleted && !storeActive && !isAdmin) {
    const allowedUnpaidRoutes = ['/activation', '/finalize-activation', '/edit'];
    if (!allowedUnpaidRoutes.includes(location.pathname)) {
      return <Navigate to="/activation" replace />;
    }
  }

  // Rule 3: Admin Escape (If an admin is ON the activation page, move them to dashboard)
  if (isAdmin && (location.pathname === '/activation' || location.pathname === '/finalize-activation')) {
    return <Navigate to="/dashboard" replace />;
  }

  // If completed and activated (or actively on allowed setup routes), render the page!
  return children;
}
