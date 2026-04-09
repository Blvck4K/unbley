import { n as supabase } from "./supabase-CTgwDjry.js";
import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { n as Navbar, t as Footer } from "./Footer-CSPDTrks.js";
import { t as SEO } from "./SEO-D3I2-QVn.js";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Calendar, Check, ChevronRight, Copy, LayoutGrid, Loader2, Tag, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
//#region src/pages/Blog.jsx
function Blog() {
	const { slug } = useParams();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showCopied, setShowCopied] = useState(false);
	const [isTocOpen, setIsTocOpen] = useState(window.innerWidth > 992);
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 992) setIsTocOpen(true);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const handleCopyLink = () => {
		navigator.clipboard.writeText(window.location.href);
		setShowCopied(true);
		setTimeout(() => setShowCopied(false), 2e3);
	};
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: .2 }
		}
	};
	const fetchPost = async () => {
		try {
			setLoading(true);
			let { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
			const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
			if ((error || !data) && isUuid) {
				const { data: idData, error: idError } = await supabase.from("blog_posts").select("*").eq("id", slug).single();
				data = idData;
				error = idError;
			}
			if (error) throw error;
			setPost(data);
		} catch (err) {
			console.error("Error fetching post:", err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (slug) fetchPost();
	}, [slug]);
	useEffect(() => {
		if (post?.id) {
			const channel = supabase.channel(`post_updates_${post.id}`).on("postgres_changes", {
				event: "UPDATE",
				schema: "public",
				table: "blog_posts",
				filter: `id=eq.${post.id}`
			}, (payload) => {
				console.log("Post updated live:", payload);
				setPost(payload.new);
			}).subscribe();
			return () => {
				supabase.removeChannel(channel);
			};
		}
	}, [post?.id]);
	const headings = React.useMemo(() => {
		if (!post?.content) return [];
		const hTags = new DOMParser().parseFromString(post.content, "text/html").querySelectorAll("h1, h2, h3");
		return Array.from(hTags).map((tag, idx) => ({
			id: `heading-${idx}`,
			text: tag.innerText,
			level: tag.tagName.toLowerCase()
		}));
	}, [post?.content]);
	const processedContent = React.useMemo(() => {
		if (!post?.content) return "";
		let content = post.content;
		let idx = 0;
		return content.replace(/<(h[23])(\s+[^>]*?)?>(.*?)<\/h\1>/g, (match, tag, attrs, text) => {
			const id = `heading-${idx++}`;
			return `<${tag}${attrs || ""} id="${id}">${text}</${tag}>`;
		});
	}, [post?.content]);
	const s = {
		page: {
			backgroundColor: "var(--bg-light)",
			minHeight: "100vh",
			color: "var(--text-primary)",
			fontFamily: "\"Inter\", sans-serif"
		},
		hero: {
			padding: "160px 0 100px",
			maxWidth: "1200px",
			margin: "0 auto",
			paddingLeft: "24px",
			paddingRight: "24px"
		},
		heroGrid: {
			display: "grid",
			gridTemplateColumns: post?.cover_image_url ? "1.2fr 1fr" : "1fr",
			gap: "64px",
			alignItems: "center"
		},
		title: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "clamp(32px, 5vw, 64px)",
			fontWeight: "700",
			marginBottom: "24px",
			letterSpacing: "-0.02em",
			lineHeight: "1.1"
		},
		byline: {
			fontSize: "14px",
			color: "var(--text-secondary)",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			fontWeight: "500"
		},
		heroImage: {
			width: "150%",
			height: "clamp(250px, 40vw, 450px)",
			objectFit: "cover",
			borderRadius: "12px",
			boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
		},
		container: {
			display: "grid",
			gridTemplateColumns: "280px 1fr",
			gap: "120px",
			maxWidth: "1300px",
			margin: "0 auto",
			padding: "0 40px 200px",
			width: "100%",
			boxSizing: "border-box"
		},
		sidebar: {
			position: "sticky",
			top: "140px",
			height: "fit-content"
		},
		sidebarItem: { marginBottom: "48px" },
		sidebarLabel: {
			fontSize: "10px",
			fontWeight: "900",
			textTransform: "uppercase",
			letterSpacing: "0.15em",
			color: "#888",
			marginBottom: "16px",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center"
		},
		sidebarValue: {
			fontSize: "15px",
			fontWeight: "600",
			color: "#121212"
		},
		tocLink: {
			display: "block",
			fontSize: "14px",
			color: "#777",
			textDecoration: "none",
			marginBottom: "16px",
			transition: "all 0.3s",
			cursor: "pointer",
			lineHeight: "1.6",
			fontWeight: "500"
		},
		tocLinkActive: {
			color: "#121212",
			fontWeight: "700"
		},
		article: {
			maxWidth: "780px",
			fontSize: "20px",
			lineHeight: "1.85",
			color: "#222",
			letterSpacing: "-0.01em"
		},
		h2: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "42px",
			fontWeight: "700",
			marginTop: "80px",
			marginBottom: "32px",
			color: "#121212",
			letterSpacing: "-0.02em"
		},
		p: { marginBottom: "32px" },
		list: {
			paddingLeft: "24px",
			marginBottom: "32px",
			listStyleType: "disc"
		},
		listItem: { marginBottom: "12px" },
		cta: {
			backgroundColor: "#FFFFFF",
			border: "1px solid var(--border-color)",
			borderRadius: "var(--radius-xl)",
			padding: "64px",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginTop: "120px",
			position: "relative",
			overflow: "hidden"
		},
		ctaText: { maxWidth: "500px" },
		ctaTitle: {
			fontSize: "32px",
			fontWeight: "800",
			marginBottom: "16px"
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			height: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#F9F7F2"
		},
		children: /* @__PURE__ */ jsx(Loader2, {
			className: "animate-spin",
			size: 48,
			color: "#888"
		})
	});
	if (!post) return /* @__PURE__ */ jsxs("div", {
		style: {
			height: "100vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#F9F7F2",
			gap: "20px"
		},
		children: [
			/* @__PURE__ */ jsx("h1", {
				style: {
					fontFamily: "\"Playfair Display\", serif",
					fontSize: "32px"
				},
				children: "The archive is silent."
			}),
			/* @__PURE__ */ jsx("p", {
				style: { color: "#888" },
				children: "The manuscript you seek could not be found."
			}),
			/* @__PURE__ */ jsx("button", {
				className: "btn btn-outline",
				onClick: () => window.history.back(),
				children: "Go Back"
			})
		]
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SEO, {
		title: post?.meta_title || post?.title || "ZizzyStores Blog",
		description: post?.meta_description || post?.excerpt || "Read this story on ZizzyStores Blog – Nigerian Ecommerce & Growth.",
		canonical: post ? `https://zizzystores.com/blog/${post.slug}` : `https://zizzystores.com/blog`,
		ogImage: post?.cover_image_url || "https://zizzystores.com/og-default.jpg",
		ogType: "article"
	}), /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsx("header", {
				style: s.hero,
				className: "blog-header-padding",
				children: /* @__PURE__ */ jsxs("div", {
					className: "blog-hero-grid",
					style: s.heroGrid,
					children: [/* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							x: -20
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: { duration: .8 },
						className: "blog-hero-text",
						children: [/* @__PURE__ */ jsx("h1", {
							style: s.title,
							children: post.title
						}), /* @__PURE__ */ jsxs("div", {
							style: s.byline,
							children: [
								/* @__PURE__ */ jsx(User, { size: 16 }),
								" ",
								/* @__PURE__ */ jsxs("span", { children: [
									"By ",
									/* @__PURE__ */ jsx("strong", { children: post.author_name || "Anonymous" }),
									" Editorial Suite"
								] })
							]
						})]
					}), post.cover_image_url && /* @__PURE__ */ jsx(motion.div, {
						initial: {
							opacity: 0,
							scale: .95
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						transition: {
							duration: .8,
							delay: .2
						},
						className: "blog-hero-image",
						children: /* @__PURE__ */ jsx("img", {
							src: post.cover_image_url,
							alt: post.title,
							style: s.heroImage
						})
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "article-layout",
				style: s.container,
				children: [/* @__PURE__ */ jsxs("aside", {
					className: "article-sidebar",
					style: s.sidebar,
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: s.sidebarItem,
							children: [/* @__PURE__ */ jsx("span", {
								style: s.sidebarLabel,
								children: "Category"
							}), /* @__PURE__ */ jsxs("div", {
								style: s.sidebarValue,
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(Tag, {
										size: 14,
										color: "var(--text-muted)"
									}),
									" ",
									post.category || "Editorial"
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: s.sidebarItem,
							children: [/* @__PURE__ */ jsx("span", {
								style: s.sidebarLabel,
								children: "Published"
							}), /* @__PURE__ */ jsxs("div", {
								style: s.sidebarValue,
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(Calendar, {
										size: 14,
										color: "var(--text-muted)"
									}),
									" ",
									new Date(post.created_at).toLocaleDateString()
								]
							})]
						}),
						post.read_time && /* @__PURE__ */ jsxs("div", {
							style: s.sidebarItem,
							children: [/* @__PURE__ */ jsx("span", {
								style: s.sidebarLabel,
								children: "Reading Time"
							}), /* @__PURE__ */ jsx("div", {
								style: s.sidebarValue,
								children: post.read_time
							})]
						}),
						headings.length > 0 && /* @__PURE__ */ jsxs("div", {
							style: s.sidebarItem,
							className: "mt-12 pt-8 border-t border-gray-100",
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: () => setIsTocOpen(!isTocOpen),
								style: {
									...s.sidebarLabel,
									background: "none",
									border: "none",
									width: "100%",
									textAlign: "left",
									cursor: "pointer"
								},
								className: "toc-toggle",
								children: ["Navigation", /* @__PURE__ */ jsx(ChevronRight, {
									size: 16,
									style: {
										transform: isTocOpen ? "rotate(90deg)" : "none",
										transition: "transform 0.3s"
									},
									className: "toc-chevron"
								})]
							}), /* @__PURE__ */ jsx(AnimatePresence, { children: (isTocOpen || window.innerWidth > 992) && /* @__PURE__ */ jsx(motion.div, {
								initial: {
									height: 0,
									opacity: 0
								},
								animate: {
									height: "auto",
									opacity: 1
								},
								exit: {
									height: 0,
									opacity: 0
								},
								style: { overflow: "hidden" },
								className: "toc-content",
								children: /* @__PURE__ */ jsx("div", {
									className: "flex flex-col pt-4",
									children: headings.map((heading) => /* @__PURE__ */ jsx("a", {
										href: `#${heading.id}`,
										onClick: (e) => {
											e.preventDefault();
											document.getElementById(heading.id)?.scrollIntoView({
												behavior: "smooth",
												block: "start"
											});
											if (window.innerWidth <= 992) setIsTocOpen(false);
										},
										style: {
											...s.tocLink,
											paddingLeft: heading.level === "h3" ? "16px" : "0",
											borderLeft: heading.level === "h2" ? "2px solid transparent" : "none"
										},
										className: "hover:text-black hover:translate-x-1",
										children: heading.text
									}, heading.id))
								})
							}) })]
						})
					]
				}), /* @__PURE__ */ jsxs(motion.main, {
					variants: containerVariants,
					initial: "visible",
					animate: "visible",
					style: s.article,
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "reviewer-box",
							style: {
								padding: "32px",
								backgroundColor: "#F3F4F6",
								borderRadius: "12px",
								border: "1px solid #E5E7EB",
								marginBottom: "60px"
							},
							children: /* @__PURE__ */ jsxs("div", {
								style: {
									display: "grid",
									gridTemplateColumns: "1fr",
									gap: "32px"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										borderBottom: "1px solid #E5E7EB",
										paddingBottom: "16px"
									},
									children: [/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-end",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ jsx("label", {
											style: {
												fontSize: "11px",
												fontWeight: 900,
												color: "#4B5563",
												letterSpacing: "0.1em"
											},
											children: "LIVE LINK / PERMALINK"
										}), /* @__PURE__ */ jsxs("button", {
											onClick: handleCopyLink,
											style: {
												display: "flex",
												alignItems: "center",
												gap: "6px",
												fontSize: "11px",
												fontWeight: 700,
												color: showCopied ? "#059669" : "#111",
												background: "none",
												border: "none",
												cursor: "pointer",
												padding: "4px 8px",
												borderRadius: "4px",
												backgroundColor: showCopied ? "#D1FAE5" : "#E5E7EB",
												transition: "all 0.2s"
											},
											children: [showCopied ? /* @__PURE__ */ jsx(Check, { size: 12 }) : /* @__PURE__ */ jsx(Copy, { size: 12 }), showCopied ? "COPIED!" : "COPY LINK"]
										})]
									}), /* @__PURE__ */ jsx("code", {
										style: {
											fontSize: "14px",
											color: "#111",
											fontWeight: 500,
											wordBreak: "break-all",
											backgroundColor: "#FFF",
											padding: "8px 12px",
											borderRadius: "6px",
											border: "1px solid #E5E7EB",
											display: "block"
										},
										children: post.slug ? `${window.location.protocol}//${window.location.host}/blog/${post.slug}` : "Generating..."
									})]
								}), post.meta_description && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									style: {
										fontSize: "11px",
										fontWeight: 900,
										color: "#4B5563",
										letterSpacing: "0.1em",
										display: "block",
										marginBottom: "8px"
									},
									children: "SEO META DESCRIPTION"
								}), /* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "15px",
										color: "#6B7280",
										margin: 0,
										lineHeight: "1.6"
									},
									children: post.meta_description
								})] })]
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "rich-content",
							style: {
								fontSize: "18px",
								lineHeight: "1.8",
								color: "#374151"
							},
							dangerouslySetInnerHTML: { __html: processedContent }
						}),
						/* @__PURE__ */ jsxs(motion.div, {
							style: s.cta,
							className: "blog-cta",
							whileInView: {
								y: 0,
								opacity: 1
							},
							initial: {
								y: 40,
								opacity: 0
							},
							viewport: { once: true },
							children: [/* @__PURE__ */ jsxs("div", {
								style: s.ctaText,
								children: [
									/* @__PURE__ */ jsx("h3", {
										style: s.ctaTitle,
										children: "Ready to deploy?"
									}),
									/* @__PURE__ */ jsxs("p", {
										style: {
											color: "var(--text-secondary)",
											marginBottom: "32px"
										},
										children: ["Claim Your Space Online. Get a free domain and own a full E-commerce website for your Brand ", /* @__PURE__ */ jsx("strong", { children: "Click the Get Started Button Below To Begin" })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex gap-4 cta-buttons",
										children: [/* @__PURE__ */ jsx("button", {
											className: "btn btn-primary",
											children: "Get Started"
										}), /* @__PURE__ */ jsx("button", {
											className: "btn btn-outline",
											children: "Contact Us"
										})]
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "cta-dots",
								style: { opacity: .1 },
								children: /* @__PURE__ */ jsx(LayoutGrid, { size: 120 })
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {}),
			/* @__PURE__ */ jsx("style", { children: `
          @media (max-width: 992px) {
            .article-layout { grid-template-columns: 1fr !important; gap: 40px !important; padding: 0 20px 80px !important; }
            .article-sidebar { 
              position: static !important; 
              display: flex !important;
              flex-direction: row !important;
              flex-wrap: wrap !important;
              gap: 32px !important; 
              border-bottom: 1px solid rgba(0,0,0,0.05); 
              padding-bottom: 32px !important; 
              margin-bottom: 40px !important;
            }
            .article-sidebar > div { margin-bottom: 0 !important; }
            .reviewer-box { padding: 20px !important; margin-bottom: 40px !important; }
            .blog-cta { padding: 40px 24px !important; flex-direction: column !important; gap: 32px !important; }
            .cta-dots { display: none !important; }
            .cta-buttons { flex-direction: column !important; width: 100% !important; }
            .cta-buttons button { width: 100% !important; }
            
            .blog-hero-grid {
              display: flex !important;
              flex-direction: column !important;
              gap: 32px !important;
            }
            .blog-hero-image {
              order: -1 !important;
              display: block !important;
            }
            .blog-hero-text {
              order: 0 !important;
            }
            .blog-hero-image img {
              width: 100% !important;
              height: auto !important;
              display: block !important;
            }
            .toc-chevron { display: block !important; }
            .blog-header-padding { padding-top: 100px !important; padding-bottom: 60px !important; }
          }
          
          .toc-chevron { display: none; }
          
          .rich-content {
            font-size: 20px;
            line-height: 1.85;
            color: #222;
          }

          .rich-content strong {
            font-weight: 800;
            color: #000;
          }
          
          .rich-content em {
            font-style: italic;
          }
          
          .rich-content a {
            color: #121212;
            text-decoration: underline;
            text-underline-offset: 6px;
            font-weight: 600;
          }
          
          .rich-content blockquote {
            border-left: 2px solid #121212;
            padding-left: 40px;
            margin: 60px 0;
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            line-height: 1.4;
            color: #121212;
          }

          .rich-content img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 60px 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          }

          .rich-content h1, .rich-content h2, .rich-content h3 {
            font-family: 'Playfair Display', serif;
            color: #121212;
            margin-top: 2.5em;
            margin-bottom: 0.8em;
            scroll-margin-top: 140px;
            line-height: 1.2;
          }

          .rich-content h1 { font-size: 48px; }
          .rich-content h2 { font-size: 38px; }
          .rich-content h3 { font-size: 28px; }

          .rich-content ul, .rich-content ol {
            margin-bottom: 2em;
            padding-left: 20px;
          }

          .rich-content li {
            margin-bottom: 12px;
          }

          .rich-content table {
            border-collapse: collapse;
            table-layout: auto;
            width: 100%;
            margin: 4rem 0;
            background-color: #FFF;
            border: 1px solid #EEE;
          }

          @media (max-width: 768px) {
            .rich-content table {
              display: block;
              overflow-x: auto;
              white-space: nowrap;
            }
            .rich-content blockquote {
              padding-left: 20px !important;
              font-size: 24px !important;
              margin: 40px 0 !important;
            }
            .rich-content h1 { font-size: 32px; }
            .rich-content h2 { font-size: 28px; }
            .rich-content h3 { font-size: 24px; }
          }

          .rich-content td, .rich-content th {
            border: 1px solid #EEE;
            padding: 20px;
            vertical-align: top;
          }

          .rich-content th {
            background-color: #FBFBFB;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.1em;
          }

          .blog-hero-text h1 {
            font-family: 'Playfair Display', serif;
          }
        ` })
		]
	}) })] });
}
//#endregion
export { Blog as default };
