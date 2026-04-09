import { n as supabase } from "./supabase-CTgwDjry.js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/context/AuthContext.jsx
var AuthContext = createContext({});
var AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);
	const refreshProfileStatus = useCallback(async (baseUser) => {
		if (!baseUser) return null;
		try {
			const { data: profile, error } = await supabase.from("brand_profiles").select("is_admin").eq("id", baseUser.id).single();
			if (error) console.warn("AuthContext: Profile fetch failed (this is expected if columns are missing):", error.message);
			const adminStatus = !!profile?.is_admin;
			setUser((prev) => prev ? {
				...prev,
				is_admin: adminStatus
			} : null);
			return adminStatus;
		} catch (err) {
			console.warn("AuthContext: Profile fetch error:", err.message);
			return false;
		}
	}, []);
	useEffect(() => {
		const fetchInitialSession = async () => {
			try {
				const { data: { session } } = await supabase.auth.getSession();
				setSession(session);
				if (session?.user) {
					setUser({
						...session.user,
						is_admin: false
					});
					await refreshProfileStatus(session.user);
				} else setUser(null);
			} catch (err) {
				console.error("AuthContext: Initial session fetch failed:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchInitialSession();
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
			setSession(session);
			if (session?.user) {
				setUser({
					...session.user,
					is_admin: false
				});
				refreshProfileStatus(session.user);
			} else setUser(null);
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
	return /* @__PURE__ */ jsx(AuthContext.Provider, {
		value,
		children: !loading && children
	});
};
//#endregion
//#region src/hooks/useAuth.js
var useAuth = () => {
	return useContext(AuthContext);
};
//#endregion
export { AuthProvider as n, useAuth as t };
