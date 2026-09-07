import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, session, isAdmin, profileReady } = useAuth();
  const location = useLocation();

  // Redirect to auth if not logged in
  if (!user || !session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!profileReady) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#FAF9F6' }} />;
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

  if (!isAdmin && hasActiveSubscription && isActivationRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isAdmin && !hasActiveSubscription && !hasActiveTrial && !isActivationRoute) {
    return <Navigate to="/activation" replace />;
  }

  return children;
}
