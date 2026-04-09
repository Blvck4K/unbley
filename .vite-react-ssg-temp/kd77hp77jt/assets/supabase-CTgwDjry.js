import { createClient } from "@supabase/supabase-js";
//#region src/lib/supabase.js
var supabaseUrl = "https://dhfasqxjyruahishfceq.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZmFzcXhqeXJ1YWhpc2hmY2VxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NzMzODQsImV4cCI6MjA5MDU0OTM4NH0.ykdpBObde-YT-ODP9Y4uCYwDByOHqKu9MPHhmdkEKTs";
var isValidUrl = (url) => {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
};
var client;
if (!isValidUrl(supabaseUrl)) {
	console.error("Please provide a valid Supabase URL and Anon Key in the .env file. Using a mock client for now.");
	const mockResult = {
		data: null,
		error: null,
		count: 0
	};
	const mockQueryBuilder = {
		select: () => mockQueryBuilder,
		insert: () => mockQueryBuilder,
		update: () => mockQueryBuilder,
		delete: () => mockQueryBuilder,
		upsert: () => mockQueryBuilder,
		eq: () => mockQueryBuilder,
		neq: () => mockQueryBuilder,
		gt: () => mockQueryBuilder,
		lt: () => mockQueryBuilder,
		gte: () => mockQueryBuilder,
		lte: () => mockQueryBuilder,
		like: () => mockQueryBuilder,
		ilike: () => mockQueryBuilder,
		is: () => mockQueryBuilder,
		in: () => mockQueryBuilder,
		contains: () => mockQueryBuilder,
		containedBy: () => mockQueryBuilder,
		range: () => mockQueryBuilder,
		single: async () => mockResult,
		maybeSingle: async () => mockResult,
		limit: () => mockQueryBuilder,
		order: () => mockQueryBuilder,
		then: (onfulfilled) => Promise.resolve(mockResult).then(onfulfilled),
		catch: (onrejected) => Promise.resolve(mockResult).catch(onrejected)
	};
	client = {
		auth: {
			getSession: async () => ({
				data: { session: null },
				error: null
			}),
			onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
			signUp: async () => ({
				data: {
					user: null,
					session: null
				},
				error: /* @__PURE__ */ new Error("Supabase not configured")
			}),
			signInWithPassword: async () => ({
				data: {
					user: null,
					session: null
				},
				error: /* @__PURE__ */ new Error("Supabase not configured")
			}),
			signInWithOAuth: async () => ({
				data: {
					provider: "",
					url: ""
				},
				error: /* @__PURE__ */ new Error("Supabase not configured")
			}),
			signOut: async () => ({ error: null }),
			getUser: async () => ({
				data: { user: null },
				error: null
			})
		},
		from: () => mockQueryBuilder,
		channel: () => ({
			on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
			subscribe: () => ({ unsubscribe: () => {} })
		}),
		removeChannel: () => {},
		removeAllChannels: () => {},
		rpc: async () => mockResult,
		storage: { from: () => ({
			upload: async () => ({
				data: null,
				error: /* @__PURE__ */ new Error("Supabase not configured")
			}),
			getPublicUrl: () => ({ data: { publicUrl: "" } }),
			remove: async () => ({
				data: null,
				error: /* @__PURE__ */ new Error("Supabase not configured")
			})
		}) }
	};
} else client = createClient(supabaseUrl, supabaseAnonKey);
async function signInWithGoogle() {
	const { data, error } = await client.auth.signInWithOAuth({
		provider: "google",
		options: {
			queryParams: {
				access_type: "offline",
				prompt: "consent"
			},
			redirectTo: `${window.location.origin}/dashboard`
		}
	});
	return {
		data,
		error
	};
}
var supabase = client;
//#endregion
export { supabase as n, signInWithGoogle as t };
