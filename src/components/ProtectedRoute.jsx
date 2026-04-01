import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, session } = useAuth();
  const location = useLocation();

  // Redirect to auth if not logged in
  if (!user || !session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check state markers set via Supabase Auth metadata
  const profileCompleted = user.user_metadata?.profile_completed;
  const storeActive = user.user_metadata?.store_active;
  
  // Administrator bypass emails
  const isAdmin = user?.email === 'diorbaron2@gmail.com' || user?.email === 'isaacakpasu06@gmail.com';

  // Rule 1: Must Complete Profile Setup
  // Exclude the /edit route itself to prevent an infinite redirect loop
  if (!profileCompleted && location.pathname !== '/edit') {
    return <Navigate to="/edit" replace />;
  }

  // Rule 2: Must Activate Store (Paystack Check)
  // If the profile is done, but they haven't activated, trap them in the activation flow
  if (profileCompleted && !storeActive && !isAdmin) {
    const allowedUnpaidRoutes = ['/activation', '/finalize-activation', '/edit'];
    if (!allowedUnpaidRoutes.includes(location.pathname)) {
      return <Navigate to="/activation" replace />;
    }
  }

  // If completed and activated (or actively on allowed setup routes), render the page!
  return children;
}
