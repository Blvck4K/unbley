/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileReady, setProfileReady] = useState(false);
  const profileRequestRef = useRef(0);
  const profileUserIdRef = useRef(null);

  // Load the profile without assuming optional migrations have been applied.
  const refreshProfileStatus = useCallback(async (baseUser) => {
    if (!baseUser) return null;
    const requestId = ++profileRequestRef.current;
    if (profileUserIdRef.current !== baseUser.id) {
      profileUserIdRef.current = baseUser.id;
      setProfileReady(false);
    }
    try {
      const { data: profile, error: profileError } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('id', baseUser.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      const adminStatus = !!profile?.is_admin;
      if (requestId !== profileRequestRef.current) return null;
      setUser(prev => {
        if (!prev) return null;
        const nextUser = {
          ...prev,
          is_admin: adminStatus,
          store_active: profile?.store_active ?? Boolean(baseUser.user_metadata?.store_active),
          plan_id: profile?.plan_id ?? baseUser.user_metadata?.plan_id ?? null,
          plan_ends_at: profile?.plan_ends_at ?? baseUser.user_metadata?.plan_ends_at ?? null,
          trial_ends_at: profile?.trial_ends_at ?? baseUser.user_metadata?.trial_ends_at ?? null,
          trial_used: profile?.trial_used ?? Boolean(baseUser.user_metadata?.trial_used),
          plan_interval: profile?.plan_interval ?? baseUser.user_metadata?.plan_interval ?? null
        };
        const unchanged = ['is_admin', 'store_active', 'plan_id', 'plan_ends_at', 'trial_ends_at', 'trial_used', 'plan_interval']
          .every((key) => prev[key] === nextUser[key]);
        return unchanged ? prev : nextUser;
      });
      setProfileReady(true);
      return adminStatus;
    } catch (err) {
      console.warn("AuthContext: Profile fetch error:", err.message);
      if (requestId === profileRequestRef.current) setProfileReady(true);
      return false;
    }
  }, []);

  useEffect(() => {
    // 1. Initial Session Check
    const fetchInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
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
        if (/invalid refresh token|refresh token not found/i.test(err.message || '')) {
          await supabase.auth.signOut().catch(() => {});
          setSession(null);
          setUser(null);
          setProfileReady(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'TOKEN_REFRESHED') return;

      if (session?.user) {
        // Keep the current user object stable during normal auth notifications.
        setUser((previousUser) => {
          if (
            previousUser?.id === session.user.id &&
            previousUser.email === session.user.email &&
            JSON.stringify(previousUser.user_metadata || {}) === JSON.stringify(session.user.user_metadata || {})
          ) return previousUser;
          return { ...session.user, is_admin: false };
        });
        queueMicrotask(() => refreshProfileStatus(session.user));
      } else {
        profileUserIdRef.current = null;
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
