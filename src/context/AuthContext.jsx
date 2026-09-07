import React, { createContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileReady, setProfileReady] = useState(false);

  // Load the profile without assuming optional migrations have been applied.
  const refreshProfileStatus = useCallback(async (baseUser) => {
    if (!baseUser) return null;
    setProfileReady(false);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', baseUser.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      const adminStatus = !!profile?.is_admin;
      setUser(prev => prev ? {
        ...prev,
        is_admin: adminStatus,
        store_active: profile?.store_active ?? Boolean(baseUser.user_metadata?.store_active),
        plan_id: profile?.plan_id ?? baseUser.user_metadata?.plan_id ?? null,
        plan_ends_at: profile?.plan_ends_at ?? baseUser.user_metadata?.plan_ends_at ?? null,
        trial_ends_at: profile?.trial_ends_at ?? baseUser.user_metadata?.trial_ends_at ?? null,
        trial_used: profile?.trial_used ?? Boolean(baseUser.user_metadata?.trial_used),
        plan_interval: profile?.plan_interval ?? baseUser.user_metadata?.plan_interval ?? null
      } : null);
      setProfileReady(true);
      return adminStatus;
    } catch (err) {
      console.warn("AuthContext: Profile fetch error:", err.message);
      setProfileReady(true);
      return false;
    }
  }, []);

  useEffect(() => {
    // 1. Initial Session Check
    const fetchInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
          // Set initial user base and WAIT for the admin check
          setUser({ ...session.user, is_admin: false });
          await refreshProfileStatus(session.user);
        } else {
          setUser(null);
          setProfileReady(true);
        }
      } catch (err) {
        console.error("AuthContext: Initial session fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (_event === 'TOKEN_REFRESHED') return;

      if (session?.user) {
        // Keep the current user object stable during normal auth notifications.
        setUser({ ...session.user, is_admin: false });
        refreshProfileStatus(session.user);
      } else {
        setUser(null);
        setProfileReady(true);
      }
      // Note: We don't block auth changes as much since the user is already interacting, 
      // but initial load MUST be correct.
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshProfileStatus]);

  const value = {
    session,
    user,
    profileReady,
    isAdmin: !!user?.is_admin,
    signOut: () => supabase.auth.signOut(),
    refreshUser: () => session?.user && refreshProfileStatus(session.user)
  };

  return (
    <AuthContext.Provider value={value}>
      {(typeof window === 'undefined' || !loading) ? children : (
        <div style={{ height: '100vh', width: '100vw', backgroundColor: 'var(--bg-light)' }} />
      )}
    </AuthContext.Provider>
  );
};
