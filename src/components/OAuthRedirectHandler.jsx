import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OAuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const hasAuthParams = hash.includes('access_token=') || search.includes('code=') || search.includes('oauth_signup=');
    const oauthMode = localStorage.getItem('unbley_oauth_mode');

    // Only intervene if this was an OAuth return, or if on /auth while already authenticated
    if (hasAuthParams || oauthMode || location.pathname === '/auth') {
      const isSignup = oauthMode === 'signup' || search.includes('oauth_signup=true') || (search.includes('type=signup') && location.pathname === '/success');
      
      // Clean up flag from storage
      localStorage.removeItem('unbley_oauth_mode');

      if (isSignup) {
        if (location.pathname !== '/success') {
          navigate('/success?type=signup', { replace: true });
        }
      } else {
        if (location.pathname === '/' || location.pathname === '/auth') {
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [user, location.pathname, navigate]);

  return null;
}
