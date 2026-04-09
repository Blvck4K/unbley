import { n as supabase } from "./supabase-CTgwDjry.js";
import { t as useAuth } from "./useAuth-Ci0LZBhu.js";
import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { n as Navbar, t as Footer } from "./Footer-BwtjuRQ-.js";
import { t as useBlog } from "./useBlog-DXkr4e9q.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
import { Edit, Eye, Filter, Plus, Trash2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
//#region src/pages/AdminBlog.jsx
function AdminBlog() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("Dashboard");
	const { posts, loading } = useBlog();
	const { isAdmin } = useAuth();
	const handleEdit = (id) => {
		navigate(`/fillblog?id=${id}`);
	};
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		try {
			const { error } = await supabase.from("blog_posts").delete().eq("id", id);
			if (error) throw error;
		} catch (err) {
			console.error("Error deleting post:", err);
			alert("Failed to delete");
		}
	};
	const stats = {
		total: posts.length,
		drafts: posts.filter((p) => p.status === "draft").length,
		published: posts.filter((p) => p.status === "published").length
	};
	const s = {
		page: {
			backgroundColor: "#F9F7F2",
			minHeight: "100vh",
			color: "#1A1A1A",
			fontFamily: "\"Inter\", sans-serif"
		},
		container: {
			maxWidth: "1200px",
			margin: "0 auto",
			padding: "0 24px 120px"
		},
		topNav: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "40px 0 80px",
			borderBottom: "1px solid #E5E1D8",
			marginBottom: "60px"
		},
		navLinks: {
			display: "flex",
			gap: "32px",
			overflowX: "auto",
			paddingBottom: "12px"
		},
		navLink: (active) => ({
			fontSize: "13px",
			fontWeight: "600",
			color: active ? "#1A1A1A" : "#888",
			cursor: "pointer",
			textTransform: "uppercase",
			letterSpacing: "0.05em",
			borderBottom: active ? "2px solid #1A1A1A" : "none",
			paddingBottom: "4px"
		}),
		headerArea: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "flex-end",
			marginBottom: "60px",
			flexWrap: "wrap",
			gap: "24px"
		},
		breadcrumb: {
			fontSize: "11px",
			fontWeight: "700",
			textTransform: "uppercase",
			letterSpacing: "0.15em",
			color: "#888",
			marginBottom: "12px",
			display: "block"
		},
		title: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "clamp(32px, 8vw, 56px)",
			fontWeight: "700",
			letterSpacing: "-0.02em",
			margin: 0
		},
		createBtn: {
			display: "flex",
			alignItems: "center",
			gap: "8px",
			backgroundColor: "#052A24",
			color: "#FFF",
			padding: "14px 24px",
			borderRadius: "4px",
			fontSize: "14px",
			fontWeight: "600",
			border: "none",
			cursor: "pointer",
			whiteSpace: "nowrap"
		},
		statsRow: {
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: "24px",
			marginBottom: "80px"
		},
		statCard: {
			backgroundColor: "#FFF",
			border: "1px solid #E5E1D8",
			padding: "40px",
			borderRadius: "4px",
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between"
		},
		statLabel: {
			fontSize: "12px",
			color: "#888",
			fontWeight: "600",
			textTransform: "uppercase",
			letterSpacing: "0.1em",
			marginBottom: "16px"
		},
		statValue: {
			fontSize: "48px",
			fontWeight: "400",
			fontFamily: "\"Playfair Display\", serif"
		},
		readershipCard: {
			gridColumn: "span 1",
			backgroundColor: "#052A24",
			color: "#F9F7F2",
			padding: "40px",
			borderRadius: "4px",
			position: "relative",
			overflow: "hidden"
		},
		graphOverlay: {
			position: "absolute",
			bottom: "20px",
			right: "20px",
			opacity: .2
		},
		sectionTitle: {
			fontSize: "24px",
			fontFamily: "\"Playfair Display\", serif",
			fontWeight: "600",
			marginBottom: "32px",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center"
		},
		tableHeader: {
			display: "grid",
			gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
			padding: "16px 24px",
			backgroundColor: "#F1EFE9",
			borderRadius: "4px",
			fontSize: "11px",
			fontWeight: "700",
			textTransform: "uppercase",
			letterSpacing: "0.05em",
			color: "#888",
			marginBottom: "8px"
		},
		tableRow: {
			display: "grid",
			gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
			padding: "24px",
			backgroundColor: "#FFF",
			borderRadius: "4px",
			borderBottom: "1px solid #F1EFE9",
			alignItems: "center",
			cursor: "default"
		},
		manuscriptTitle: {
			fontSize: "15px",
			fontWeight: "700",
			color: "#1A1A1A",
			marginBottom: "4px"
		},
		manuscriptMeta: {
			fontSize: "12px",
			color: "#888"
		},
		statusChip: (published) => ({
			padding: "4px 12px",
			borderRadius: "20px",
			fontSize: "10px",
			fontWeight: "700",
			backgroundColor: published ? "#E1F2EE" : "#F1EFE9",
			color: published ? "#0B4A40" : "#888",
			textTransform: "uppercase"
		}),
		editorCard: {
			backgroundColor: "#FFF",
			border: "1px solid #E5E1D8",
			borderRadius: "8px",
			padding: "0",
			overflow: "hidden",
			marginTop: "120px",
			boxShadow: "0 40px 100px -20px rgba(0,0,0,0.05)"
		},
		editorHeader: {
			padding: "24px 40px",
			borderBottom: "1px solid #F1EFE9",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			backgroundColor: "#FCFBFA"
		},
		editorTitleInput: {
			width: "100%",
			border: "none",
			background: "none",
			outline: "none",
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "64px",
			fontWeight: "700",
			color: "#1A1A1A",
			padding: "60px 0 40px",
			letterSpacing: "-0.02em"
		},
		heroPlaceholder: {
			width: "100%",
			height: "300px",
			backgroundColor: "#F1EFE9",
			display: "flex",
			flexHorizontal: "column",
			alignItems: "center",
			justifyContent: "center",
			color: "#888",
			cursor: "pointer",
			borderRadius: "4px",
			marginBottom: "40px"
		},
		formattingBar: {
			position: "fixed",
			bottom: "40px",
			left: "50%",
			transform: "translateX(-50%)",
			backgroundColor: "#052A24",
			color: "#FFF",
			padding: "12px 24px",
			borderRadius: "12px",
			display: "flex",
			gap: "24px",
			boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
			zIndex: 1e3
		}
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("div", {
				style: s.container,
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: s.topNav,
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "font-bold",
								style: {
									fontSize: "20px",
									letterSpacing: "-0.03em"
								},
								children: "The Archivist"
							}),
							/* @__PURE__ */ jsx("div", {
								style: s.navLinks,
								children: [
									"Essays",
									"Categories",
									"Authors",
									"Dashboard"
								].map((tab) => /* @__PURE__ */ jsx("div", {
									style: s.navLink(activeTab === tab),
									onClick: () => setActiveTab(tab),
									children: tab
								}, tab))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-4",
								children: [/* @__PURE__ */ jsx(Filter, {
									size: 18,
									color: "#888"
								}), /* @__PURE__ */ jsx(Eye, {
									size: 18,
									color: "#888"
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("header", {
						style: s.headerArea,
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							style: s.breadcrumb,
							children: "Administrative Control"
						}), /* @__PURE__ */ jsx("h1", {
							style: s.title,
							children: "Content Repository"
						})] }), /* @__PURE__ */ jsxs(motion.button, {
							whileHover: { scale: 1.05 },
							whileTap: { scale: .95 },
							style: s.createBtn,
							onClick: () => navigate("/fillblog"),
							children: [/* @__PURE__ */ jsx(Plus, { size: 18 }), " Create New Post"]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.statsRow,
						className: "admin-stats-row",
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: s.statCard,
								children: [/* @__PURE__ */ jsx("span", {
									style: s.statLabel,
									children: "Total Essays"
								}), /* @__PURE__ */ jsx("span", {
									style: s.statValue,
									children: loading ? "..." : stats.total
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.statCard,
								children: [/* @__PURE__ */ jsx("span", {
									style: s.statLabel,
									children: "Drafts"
								}), /* @__PURE__ */ jsx("span", {
									style: s.statValue,
									children: loading ? "..." : stats.drafts
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.readershipCard,
								className: "admin-readership-card",
								children: [
									/* @__PURE__ */ jsx("span", {
										style: s.statLabel,
										children: "Monthly Readership"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-baseline gap-2",
										style: { marginBottom: "8px" },
										children: [/* @__PURE__ */ jsx("span", {
											style: {
												...s.statValue,
												fontSize: "48px"
											},
											children: "42.8k"
										}), /* @__PURE__ */ jsx(TrendingUp, {
											size: 24,
											color: "#00FFB2"
										})]
									}),
									/* @__PURE__ */ jsx("div", {
										style: s.graphOverlay,
										children: /* @__PURE__ */ jsx(TrendingUp, { size: 120 })
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", { children: [
						/* @__PURE__ */ jsxs("div", {
							style: s.sectionTitle,
							children: ["Active Manuscripts", /* @__PURE__ */ jsxs("span", {
								style: {
									fontSize: "12px",
									color: "#888",
									fontWeight: "700",
									textTransform: "uppercase",
									display: "flex",
									alignItems: "center",
									gap: "8px"
								},
								children: [/* @__PURE__ */ jsx(Filter, { size: 14 }), " Filter"]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: s.tableHeader,
							className: "admin-table-header",
							children: [
								/* @__PURE__ */ jsx("div", { children: "Manuscript Title" }),
								/* @__PURE__ */ jsx("div", { children: "Status" }),
								/* @__PURE__ */ jsx("div", {
									className: "admin-hide-mobile",
									children: "Author"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "admin-hide-mobile",
									children: "Date"
								}),
								/* @__PURE__ */ jsx("div", { children: "Actions" })
							]
						}),
						posts.map((post) => /* @__PURE__ */ jsxs(motion.div, {
							whileHover: { backgroundColor: "#FCFBFA" },
							style: s.tableRow,
							className: "admin-table-row",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "admin-title-col",
									children: [
										/* @__PURE__ */ jsx("div", {
											style: s.manuscriptTitle,
											children: post.title
										}),
										/* @__PURE__ */ jsxs("div", {
											style: s.manuscriptMeta,
											children: [
												post.category || "Editorial",
												" • ",
												post.read_time
											]
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "admin-show-mobile",
											style: {
												fontSize: "12px",
												color: "#888",
												marginTop: "4px"
											},
											children: [
												post.author_name || "Anonymous",
												" • ",
												new Date(post.created_at).toLocaleDateString()
											]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "admin-status-col",
									children: /* @__PURE__ */ jsx("span", {
										style: s.statusChip(post.status === "published"),
										children: post.status
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "admin-hide-mobile",
									style: {
										fontSize: "14px",
										color: "#444"
									},
									children: post.author_name || "Anonymous"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "admin-hide-mobile",
									style: {
										fontSize: "14px",
										color: "#888"
									},
									children: new Date(post.created_at).toLocaleDateString()
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-4 admin-actions-col",
									children: [/* @__PURE__ */ jsx(Edit, {
										size: 16,
										color: "#888",
										className: "cursor-pointer hover:text-black",
										onClick: () => handleEdit(post.id)
									}), /* @__PURE__ */ jsx(Trash2, {
										size: 16,
										color: "#888",
										className: "cursor-pointer hover:text-red-500",
										onClick: () => handleDelete(post.id)
									})]
								})
							]
						}, post.id)),
						posts.length === 0 && !loading && /* @__PURE__ */ jsx("div", {
							style: {
								padding: "80px",
								textAlign: "center",
								color: "#888"
							},
							children: "No manuscripts found. Start by creating a new post."
						})
					] })
				]
			}),
			/* @__PURE__ */ jsx(Footer, {}),
			/* @__PURE__ */ jsx("style", { children: `
          .flex { display: flex; }
          .items-center { align-items: center; }
          .items-baseline { align-items: baseline; }
          .justify-between { justify-content: space-between; }
          .flex-col { flex-direction: column; }
          .gap-2 { gap: 8px; }
          .gap-4 { gap: 16px; }
          .gap-12 { gap: 48px; }
          .gap-24 { gap: 96px; }
          .cursor-pointer { cursor: pointer; }
          
          @media (max-width: 992px) {
            .admin-stats-row { grid-template-columns: 1fr !important; }
            .admin-table-header { grid-template-columns: 1fr 80px 80px !important; }
            .admin-table-row { grid-template-columns: 1fr 80px 80px !important; padding: 16px !important; }
            .admin-hide-mobile { display: none !important; }
            .admin-show-mobile { display: block !important; }
            .admin-title-col { overflow: hidden; }
          }
          
          .admin-show-mobile { display: none; }
        ` })
		]
	}) });
}
//#endregion
export { AdminBlog as default };
