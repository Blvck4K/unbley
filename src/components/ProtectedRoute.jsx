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

  const hasActiveSubscription = Boolean(
    user?.store_active &&
    user?.plan_ends_at &&
    new Date(user.plan_ends_at) > new Date()
  );
  const hasActiveTrial = Boolean(
    user?.store_active &&
    user?.trial_ends_at &&
    new Date(user.trial_ends_at) > new Date()
  );
  const isActivationRoute = location.pathname === '/activation' || location.pathname === '/finalize-activation';

  if (!isAdmin && !hasActiveSubscription && !hasActiveTrial && !isActivationRoute) {
    return <Navigate to="/activation" replace />;
  }

  return children;
}
