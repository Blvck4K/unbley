import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch is_admin status
  const refreshProfileStatus = useCallback(async (baseUser) => {
    if (!baseUser) return null;
    try {
      const { data: profile, error } = await supabase
        .from('brand_profiles')
        .select('is_admin')
        .eq('id', baseUser.id)
        .single();
      
      if (error) {
        console.warn("AuthContext: Profile fetch failed (this is expected if columns are missing):", error.message);
      }
      
      const adminStatus = !!profile?.is_admin;
      setUser(prev => prev ? { ...prev, is_admin: adminStatus } : null);
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
      {!loading && children}
    </AuthContext.Provider>
  );
};
