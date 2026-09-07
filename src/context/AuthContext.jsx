import React, { createContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch fields that exist before the optional subscription migration is applied.
  const refreshProfileStatus = useCallback(async (baseUser) => {
    if (!baseUser) return null;
    try {
      const { data: profile } = await supabase
        .from('brand_profiles')
        .select('is_admin, store_active')
        .eq('id', baseUser.id)
        .maybeSingle();
      
      const adminStatus = !!profile?.is_admin;
      setUser(prev => prev ? {
        ...prev,
        is_admin: adminStatus,
        store_active: profile?.store_active ?? Boolean(baseUser.user_metadata?.store_active),
        plan_id: baseUser.user_metadata?.plan_id || null,
        plan_ends_at: baseUser.user_metadata?.plan_ends_at || null,
        trial_ends_at: baseUser.user_metadata?.trial_ends_at || null,
        trial_used: Boolean(baseUser.user_metadata?.trial_used)
      } : null);
      return adminStatus;
    } catch (err) {
      console.warn("AuthContext: Profile fetch error:", err.message);
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
      if (session?.user) {
        // Start background fetch but also update session immediately
        setUser({ ...session.user, is_admin: false });
        refreshProfileStatus(session.user);
      } else {
        setUser(null);
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
