import { n as motion, t as PageTransition } from "./PageTransition-8IvNPEDC.js";
import { t as useAuth } from "./useAuth-BrrkS1Z-.js";
import { t as ArrowRight } from "./arrow-right-DN0ZYJFf.js";
import { n as Navbar, t as Footer } from "./Footer-CASFpsLC.js";
import { t as useBlog } from "./useBlog-DUA4xC2Y.js";
import { t as SEO } from "./SEO-Ra22bWq2.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/pages/AllBlog.jsx
var categories = [
	"Latest",
	"E-commerce",
	"Fashion Business",
	"Growth & Marketing",
	"Branding",
	"Business Tips"
];
function AllBlog() {
	const [activeCategory, setActiveCategory] = useState("Latest");
	const navigate = useNavigate();
	const { isAdmin } = useAuth();
	const { posts, loading } = useBlog({ status: "published" });
	const now = /* @__PURE__ */ new Date();
	const filteredPosts = posts.filter((p) => {
		const isTargetCategory = activeCategory === "Latest" || p.category === activeCategory;
		const isPubliclyAvailable = new Date(p.created_at) <= now;
		return isTargetCategory && isPubliclyAvailable;
	});
	const s = {
		page: {
			backgroundColor: "#F9F7F2",
			minHeight: "100vh",
			color: "#1A1A1A",
			fontFamily: "\"Inter\", sans-serif"
		},
		header: {
			padding: "120px 0 80px",
			maxWidth: "1200px",
			margin: "0 auto",
			paddingLeft: "20px",
			paddingRight: "20px"
		},
		topLabel: {
			fontSize: "12px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: "#888",
			textTransform: "uppercase",
			marginBottom: "24px",
			display: "block"
		},
		title: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "clamp(48px, 8vw, 96px)",
			lineHeight: "1",
			fontWeight: "700",
			marginBottom: "40px",
			letterSpacing: "-0.02em"
		},
		subtitle: {
			fontSize: "18px",
			lineHeight: "1.6",
			color: "#444",
			maxWidth: "600px",
			marginBottom: "60px"
		},
		filterContainer: {
			display: "flex",
			gap: "32px",
			marginBottom: "80px",
			borderBottom: "1px solid #E5E1D8",
			paddingBottom: "20px",
			overflowX: "auto"
		},
		filterItem: (active) => ({
			fontSize: "14px",
			fontWeight: "600",
			color: active ? "#1A1A1A" : "#888",
			cursor: "pointer",
			padding: "8px 0",
			position: "relative",
			textTransform: "uppercase",
			letterSpacing: "0.05em",
			whiteSpace: "nowrap"
		}),
		grid: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
			gap: "80px 40px",
			maxWidth: "1200px",
			margin: "0 auto",
			padding: "0 20px 120px"
		},
		card: {
			cursor: "pointer",
			display: "flex",
			flexDirection: "column",
			backgroundColor: "#FFF",
			border: "1px solid #E5E1D8",
			borderRadius: "8px",
			transition: "all 0.3s ease",
			overflow: "hidden"
		},
		cardContent: {
			padding: "40px",
			paddingTop: "24px"
		},
		imageWrapper: {
			width: "100%",
			height: "240px",
			overflow: "hidden"
		},
		image: {
			width: "100%",
			height: "100%",
			objectFit: "cover",
			transition: "transform 0.5s ease"
		},
		meta: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "16px"
		},
		cardCategory: {
			fontSize: "12px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: "#089cff",
			textTransform: "uppercase"
		},
		cardReadTime: {
			fontSize: "11px",
			color: "#888",
			textTransform: "uppercase"
		},
		cardTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "28px",
			fontWeight: "700",
			lineHeight: "1.3",
			marginBottom: "16px",
			color: "#1A1A1A"
		},
		cardExcerpt: {
			fontSize: "15px",
			lineHeight: "1.6",
			color: "#666",
			marginBottom: "24px",
			display: "-webkit-box",
			WebkitLineClamp: "3",
			WebkitBoxOrient: "vertical",
			overflow: "hidden"
		},
		cardLink: {
			display: "flex",
			alignItems: "center",
			gap: "8px",
			fontSize: "13px",
			fontWeight: "700",
			textTransform: "uppercase",
			letterSpacing: "0.05em"
		},
		pagination: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			gap: "40px",
			paddingBottom: "120px",
			maxWidth: "1200px",
			margin: "0 auto"
		},
		pageNum: (active) => ({
			fontSize: "14px",
			fontWeight: "700",
			color: active ? "#1A1A1A" : "#CCC",
			cursor: "pointer",
			borderBottom: active ? "2px solid #1A1A1A" : "none",
			paddingBottom: "4px"
		}),
		pagBtn: {
			display: "flex",
			alignItems: "center",
			gap: "8px",
			fontSize: "12px",
			fontWeight: "700",
			textTransform: "uppercase",
			letterSpacing: "0.1em",
			cursor: "pointer",
			color: "#888"
		}
	};
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(SEO, {
		title: "ZizzyStores Blog – Ecommerce & Growth Tips for Nigerian Brands",
		description: "Learn how to build, grow, and scale your brand online in Nigeria with ZizzyStores. Expert insights on e-commerce, branding, and business growth.",
		canonical: "https://zizzystores.com/all-blogs"
	}), /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("header", {
				style: s.header,
				className: "blog-header",
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start"
						},
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(motion.span, {
							initial: {
								opacity: 0,
								y: 10
							},
							animate: {
								opacity: 1,
								y: 0
							},
							style: s.topLabel,
							children: "Curated Repository"
						}), /* @__PURE__ */ jsxs(motion.h1, {
							initial: {
								opacity: 0,
								y: 20
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { delay: .1 },
							style: s.title,
							className: "blog-title",
							children: [
								"The Complete",
								/* @__PURE__ */ jsx("br", {}),
								"Archive"
							]
						})] }), isAdmin && /* @__PURE__ */ jsxs(motion.button, {
							initial: {
								opacity: 0,
								x: 20
							},
							animate: {
								opacity: 1,
								x: 0
							},
							whileHover: { scale: 1.02 },
							whileTap: { scale: .98 },
							onClick: () => navigate("/admin-blog"),
							style: {
								backgroundColor: "#1A1A1A",
								color: "#FFF",
								padding: "12px 24px",
								borderRadius: "4px",
								fontSize: "11px",
								fontWeight: "700",
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								gap: "8px"
							},
							children: ["Admin Dashboard ", /* @__PURE__ */ jsx(ArrowRight, { size: 14 })]
						})]
					}),
					/* @__PURE__ */ jsx(motion.p, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: .2 },
						style: s.subtitle,
						children: "A chronological odyssey through our most profound inquiries. From classical philosophy to modern cultural shifts, explored with meticulous depth."
					}),
					/* @__PURE__ */ jsx("div", {
						style: s.filterContainer,
						className: "blog-filters",
						children: categories.map((cat) => /* @__PURE__ */ jsxs("div", {
							style: s.filterItem(activeCategory === cat),
							onClick: () => setActiveCategory(cat),
							children: [cat, activeCategory === cat && /* @__PURE__ */ jsx(motion.div, {
								layoutId: "underline",
								style: {
									position: "absolute",
									bottom: "-21px",
									left: 0,
									right: 0,
									height: "2px",
									backgroundColor: "#1A1A1A"
								}
							})]
						}, cat))
					})
				]
			}),
			/* @__PURE__ */ jsx("main", {
				style: s.grid,
				className: "blog-grid",
				children: loading ? /* @__PURE__ */ jsx("div", {
					style: {
						gridColumn: "1 / -1",
						textAlign: "center",
						padding: "100px",
						color: "#888"
					},
					children: "Syncing with the archive..."
				}) : filteredPosts.length === 0 ? /* @__PURE__ */ jsx("div", {
					style: {
						gridColumn: "1 / -1",
						textAlign: "center",
						padding: "100px",
						color: "#888"
					},
					children: "No articles found in this section."
				}) : filteredPosts.map((post, idx) => /* @__PURE__ */ jsxs(motion.article, {
					initial: {
						opacity: 0,
						y: 30
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					viewport: { once: true },
					transition: { delay: idx * .1 },
					whileHover: {
						y: -8,
						boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
					},
					style: s.card,
					onClick: () => navigate(`/blog/${post.slug || post.id}`),
					children: [post.cover_image_url && /* @__PURE__ */ jsx("div", {
						style: s.imageWrapper,
						children: /* @__PURE__ */ jsx("img", {
							src: post.cover_image_url,
							alt: post.title,
							style: s.image,
							className: "blog-card-img"
						})
					}), /* @__PURE__ */ jsxs("div", {
						style: s.cardContent,
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: s.meta,
								children: [/* @__PURE__ */ jsx("span", {
									style: s.cardCategory,
									children: post.category
								}), /* @__PURE__ */ jsx("span", {
									style: s.cardReadTime,
									children: post.read_time
								})]
							}),
							/* @__PURE__ */ jsx("h2", {
								style: s.cardTitle,
								children: post.title
							}),
							/* @__PURE__ */ jsx("p", {
								style: s.cardExcerpt,
								children: post.excerpt
							}),
							/* @__PURE__ */ jsx("div", {
								style: s.cardLink,
								children: /* @__PURE__ */ jsx(ArrowRight, { size: 16 })
							})
						]
					})]
				}, post.id))
			}),
			/* @__PURE__ */ jsx(Footer, {}),
			/* @__PURE__ */ jsx("style", { children: `
          .blog-filters::-webkit-scrollbar { display: none; }
          .blog-filters { -ms-overflow-style: none; scrollbar-width: none; }
          
          @media (max-width: 768px) {
            .blog-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
            .blog-title { font-size: 36px !important; }
            .blog-header { padding-top: 80px !important; padding-bottom: 40px !important; }
            .blog-filters { padding-bottom: 15px !important; margin-bottom: 40px !important; }
            .blog-card-img { height: 200px !important; }
          }
        ` })
		]
	}) })] });
}
//#endregion
export { AllBlog as default };
