import { n as supabase } from "./supabase-DvwDzIWb.js";
import { useEffect, useState } from "react";
//#region src/hooks/useBlog.js
var useBlog = (options = {}) => {
	const { status = null, limit = 100 } = options;
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const fetchPosts = async () => {
		try {
			setLoading(true);
			let query = supabase.from("blog_posts").select("*").order("created_at", { ascending: false }).limit(limit);
			if (status) query = query.eq("status", status);
			const { data, error: fetchError } = await query;
			if (fetchError) throw fetchError;
			setPosts(data || []);
		} catch (err) {
			console.error("Error fetching blog posts:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchPosts();
		const channel = supabase.channel("blog_posts_changes").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "blog_posts"
		}, (payload) => {
			console.log("Realtime change received:", payload);
			fetchPosts();
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [status, limit]);
	return {
		posts,
		loading,
		error,
		refresh: fetchPosts
	};
};
//#endregion
export { useBlog as t };
