import { n as supabase } from "./supabase-CTgwDjry.js";
import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight, Bell, Bookmark, ExternalLink, Globe, Heart, Search, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
//#region src/pages/ExploreBrand.jsx
var FacebookIcon = ({ size = 14, color = "currentColor" }) => /* @__PURE__ */ jsx("svg", {
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: color,
	stroke: "none",
	children: /* @__PURE__ */ jsx("path", { d: "M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.309h3.59l-.467 3.622h-3.123V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.408 0 22.675 0z" })
});
var TikTokIcon = ({ size = 14, color = "currentColor" }) => /* @__PURE__ */ jsx("svg", {
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: color,
	stroke: "none",
	children: /* @__PURE__ */ jsx("path", { d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" })
});
var InstagramIcon = ({ size = 14, color = "currentColor" }) => /* @__PURE__ */ jsxs("svg", {
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: color,
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	children: [
		/* @__PURE__ */ jsx("rect", {
			x: "2",
			y: "2",
			width: "20",
			height: "20",
			rx: "5",
			ry: "5"
		}),
		/* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
		/* @__PURE__ */ jsx("line", {
			x1: "17.5",
			y1: "6.5",
			x2: "17.51",
			y2: "6.5"
		})
	]
});
var TwitterIcon = ({ size = 14, color = "currentColor" }) => /* @__PURE__ */ jsx("svg", {
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: color,
	stroke: "none",
	children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
});
function ExploreBrand() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [brand, setBrand] = useState(null);
	const [products, setProducts] = useState([]);
	const [similarBrands, setSimilarBrands] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function loadBrand() {
			if (!id) {
				setLoading(false);
				return;
			}
			try {
				setLoading(true);
				const { data: bData, error: bErr } = await supabase.from("brand_profiles").select("*").eq("id", id).single();
				if (bErr || !bData) throw bErr || /* @__PURE__ */ new Error("Brand not found");
				setBrand(bData);
				const { data: pData } = await supabase.from("products").select("*").eq("brand_id", id).limit(3);
				if (pData) setProducts(pData);
				const { data: sData } = await supabase.from("brand_profiles").select("*").neq("id", id).eq("profile_completed", true).limit(4);
				if (sData) setSimilarBrands(sData);
			} catch (err) {
				console.error("Error loading brand details:", err);
			} finally {
				setLoading(false);
			}
		}
		loadBrand();
	}, [id]);
	const brandColor = brand?.accent_color || "#06acf8ff";
	const s = {
		page: {
			backgroundColor: "#0A0A0A",
			color: "#E5E5E5",
			height: "100vh",
			overflow: "hidden",
			display: "flex",
			fontFamily: "\"Inter\", sans-serif"
		},
		main: {
			flex: 1,
			display: "flex",
			flexDirection: "column"
		},
		header: {
			height: "80px",
			padding: "0 80px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			borderBottom: "1px solid #1F1F1F",
			flexShrink: 0
		},
		headerTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "24px",
			color: "#FFF"
		},
		searchBar: {
			display: "flex",
			alignItems: "center",
			gap: "8px",
			backgroundColor: "#111",
			padding: "10px 16px",
			width: "320px",
			border: "1px solid #1F1F1F",
			borderRadius: "4px"
		},
		searchInput: {
			background: "transparent",
			border: "none",
			color: "#FFF",
			fontSize: "12px",
			outline: "none",
			width: "100%",
			letterSpacing: "0.05em"
		},
		headerActions: {
			display: "flex",
			alignItems: "center",
			gap: "24px"
		},
		shopBtn: {
			backgroundColor: brandColor,
			color: "#000",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			padding: "10px 20px",
			textTransform: "uppercase",
			border: "none",
			cursor: "pointer",
			borderRadius: "4px",
			textDecoration: "none"
		},
		content: {
			padding: "80px",
			flex: 1,
			overflowY: "auto"
		},
		banner: {
			position: "relative",
			height: "400px",
			backgroundColor: "#111",
			border: "1px solid #1F1F1F",
			display: "flex",
			flexDirection: "column",
			padding: "64px",
			overflow: "hidden",
			marginBottom: "32px"
		},
		bannerBg: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundImage: `url("${brand?.banner_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80"}")`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			opacity: .2
		},
		bannerContent: {
			position: "relative",
			zIndex: 1,
			display: "flex",
			alignItems: "center",
			gap: "32px",
			marginTop: "auto"
		},
		brandBadge: {
			width: "80px",
			height: "80px",
			border: `2px solid ${brandColor}`,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#111",
			overflow: "hidden"
		},
		brandBadgeText: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "24px",
			fontStyle: "italic",
			color: brandColor
		},
		sectionTitleBase: {
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			marginBottom: "16px"
		},
		narrativeBox: {
			backgroundColor: "#111",
			border: "1px solid #1F1F1F",
			padding: "48px",
			position: "relative",
			marginBottom: "64px"
		},
		narrativeTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "32px",
			fontStyle: "italic",
			color: "#FFF",
			lineHeight: "1.2",
			marginBottom: "24px",
			maxWidth: "80%"
		},
		narrativeText: {
			color: "#888",
			fontSize: "14px",
			lineHeight: "1.6",
			maxWidth: "90%"
		},
		ctaContainer: {
			backgroundColor: "#111",
			border: `1px solid ${brandColor}`,
			padding: "64px",
			marginBottom: "64px",
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			position: "relative",
			overflow: "hidden"
		},
		ctaTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "36px",
			color: "#FFF",
			fontStyle: "italic",
			marginBottom: "32px"
		},
		ctaButton: {
			display: "flex",
			alignItems: "center",
			gap: "16px",
			backgroundColor: brandColor,
			color: "#000",
			padding: "24px 48px",
			fontSize: "20px",
			fontWeight: "bold",
			textDecoration: "none",
			cursor: "pointer",
			border: "none",
			borderRadius: "4px",
			textTransform: "uppercase",
			letterSpacing: "0.05em"
		},
		ctaBridgeMessage: {
			marginTop: "16px",
			color: "#888",
			fontSize: "14px",
			fontStyle: "italic"
		},
		triggersTitle: {
			fontWeight: "700",
			fontSize: "14px",
			color: "#FFF",
			marginTop: "48px",
			marginBottom: "24px"
		},
		triggersGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: "24px",
			width: "100%"
		},
		triggerItem: {
			display: "flex",
			alignItems: "center",
			gap: "12px",
			fontSize: "14px",
			color: "#CCC"
		},
		productsSection: { marginBottom: "64px" },
		productsHeader: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "flex-end",
			marginBottom: "32px"
		},
		productsTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "36px",
			fontStyle: "italic",
			color: "#FFF"
		},
		exploreLink: {
			fontSize: "12px",
			color: "#FFF",
			textDecoration: "none",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			letterSpacing: "0.05em",
			cursor: "pointer"
		},
		productGrid: {
			display: "grid",
			gridTemplateColumns: "minmax(300px, 1.2fr) minmax(200px, 0.8fr)",
			gap: "16px"
		},
		productMain: {
			backgroundColor: "#111",
			minHeight: "500px",
			backgroundImage: `url("${brand?.product_1_url || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80"}")`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			borderRadius: "4px",
			cursor: "pointer"
		},
		productSubGrid: {
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
			gridTemplateRows: "1fr 1fr",
			gap: "16px",
			minHeight: "500px"
		},
		productItemCard: {
			backgroundColor: "#111",
			backgroundSize: "cover",
			backgroundPosition: "center",
			borderRadius: "4px",
			cursor: "pointer"
		},
		similarSection: { marginBottom: "64px" },
		similarGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(4, 1fr)",
			gap: "24px"
		},
		similarCard: {
			backgroundColor: "#111",
			border: "1px solid #1F1F1F",
			padding: "32px",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			cursor: "pointer",
			transition: "border-color 0.2s"
		},
		similarLogo: {
			width: "80px",
			height: "80px",
			backgroundColor: "#222",
			borderRadius: "50%",
			marginBottom: "24px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		similarName: {
			color: "#FFF",
			fontWeight: "bold",
			fontSize: "16px",
			marginBottom: "8px"
		},
		similarCategory: {
			color: "#888",
			fontSize: "12px",
			textTransform: "uppercase",
			letterSpacing: "0.1em"
		},
		footer: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			borderTop: "1px solid #1F1F1F",
			paddingTop: "32px",
			paddingBottom: "32px"
		},
		footerLinks: {
			display: "flex",
			gap: "32px",
			fontSize: "9px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: "#666",
			textTransform: "uppercase"
		}
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		className: "explore-page",
		children: [/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .explore-page { 
            height: auto !important; 
            min-height: 100vh !important;
            overflow: visible !important; 
            display: block !important;
          }
          .explore-header { 
            padding: 16px 20px !important; 
            flex-wrap: wrap; 
            height: auto !important; 
            gap: 16px; 
            justify-content: center !important; 
            position: sticky;
            top: 0;
            z-index: 100;
            background-color: #0A0A0A;
          }
          .header-right { flex-direction: column; width: 100%; gap: 16px !important; }
          .search-bar { display: none !important; }
          .shop-btn { width: 100%; text-align: center; order: 2; }
          .explore-content { 
            padding: 32px 20px !important; 
            overflow: visible !important; 
            flex: none !important; 
            height: auto !important; 
          }
          .hero-banner { padding: 48px 24px !important; height: auto !important; min-height: 280px; }
          .brand-badge { width: 64px !important; height: 64px !important; }
          .hero-title { font-size: 32px !important; text-align: center; }
          .banner-content { flex-direction: column !important; text-align: center; gap: 24px !important; }
          .split-layout { display: flex !important; flex-direction: column !important; gap: 32px !important; }
          .narrative-box { padding: 32px 24px !important; text-align: center; }
          .narrative-title { font-size: 24px !important; max-width: 100% !important; margin-bottom: 24px !important; }
          .cta-container { padding: 48px 24px !important; align-items: center !important; text-align: center; }
          .cta-title { font-size: 28px !important; }
          .cta-btn { width: 100%; justify-content: center; font-size: 16px !important; padding: 18px !important; }
          .triggers-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .products-header { flex-direction: column; align-items: center !important; text-align: center; gap: 16px; }
          .product-grid { grid-template-columns: 1fr !important; }
          .product-main { height: 300px !important; }
          .product-sub-grid { height: auto !important; grid-template-columns: 1fr !important; grid-template-rows: repeat(3, 220px) !important; }
          .similar-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
          .footer { flex-direction: column; gap: 24px; text-align: center; padding: 32px 0 !important; }
          .footer-links { flex-wrap: wrap; justify-content: center; gap: 16px !important; }
        }
      ` }), loading ? /* @__PURE__ */ jsx("div", {
			style: {
				flex: 1,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#888"
			},
			children: "Syncing Brand Data..."
		}) : !brand ? /* @__PURE__ */ jsxs("div", {
			style: {
				flex: 1,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				color: "#888"
			},
			children: [/* @__PURE__ */ jsx("h2", { children: "Brand Not Found" }), /* @__PURE__ */ jsx("button", {
				style: s.shopBtn,
				onClick: () => navigate("/store"),
				children: "Return to Storefront"
			})]
		}) : /* @__PURE__ */ jsxs("div", {
			style: s.main,
			children: [/* @__PURE__ */ jsxs("div", {
				style: s.header,
				className: "explore-header",
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "24px"
					},
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => navigate(-1),
						style: {
							background: "transparent",
							border: "none",
							color: "#888",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							padding: "8px",
							transition: "color 0.2s"
						},
						title: "Go Back",
						onMouseEnter: (e) => e.currentTarget.style.color = "#FFF",
						onMouseLeave: (e) => e.currentTarget.style.color = "#888",
						children: /* @__PURE__ */ jsx(ArrowLeft, { size: 20 })
					}), /* @__PURE__ */ jsx("div", {
						style: s.headerTitle,
						children: "Brand Profile"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "32px"
					},
					className: "header-right",
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: s.searchBar,
							className: "search-bar",
							children: [/* @__PURE__ */ jsx(Search, {
								size: 14,
								color: "#666"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "Search ...",
								style: s.searchInput
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: () => navigate(`/shop-brand/${id}`),
							style: s.shopBtn,
							className: "shop-btn",
							children: [
								"Shop ",
								brand.brand_name,
								" Now"
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: s.headerActions,
							children: [/* @__PURE__ */ jsx("div", {
								title: "Like Brand",
								style: {
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									color: "#888",
									transition: "color 0.2s"
								},
								onMouseEnter: (e) => e.currentTarget.style.color = "#FFF",
								onMouseLeave: (e) => e.currentTarget.style.color = "#888",
								children: /* @__PURE__ */ jsx(Heart, { size: 18 })
							}), /* @__PURE__ */ jsx("div", {
								title: "Save Brand",
								style: {
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									color: "#888",
									transition: "color 0.2s"
								},
								onMouseEnter: (e) => e.currentTarget.style.color = "#FFF",
								onMouseLeave: (e) => e.currentTarget.style.color = "#888",
								children: /* @__PURE__ */ jsx(Bookmark, { size: 18 })
							})]
						})
					]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				style: s.content,
				className: "explore-content",
				children: [
					/* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .8,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						style: s.banner,
						className: "hero-banner",
						children: [/* @__PURE__ */ jsx(motion.div, {
							initial: { scale: 1.1 },
							animate: { scale: 1 },
							transition: {
								duration: 2,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							style: s.bannerBg
						}), /* @__PURE__ */ jsxs("div", {
							style: s.bannerContent,
							children: [/* @__PURE__ */ jsx(motion.div, {
								initial: {
									scale: .8,
									opacity: 0
								},
								animate: {
									scale: 1,
									opacity: 1
								},
								transition: {
									delay: .3,
									duration: .6
								},
								style: s.brandBadge,
								className: "brand-badge",
								children: brand.logo_url ? /* @__PURE__ */ jsx("img", {
									src: brand.logo_url,
									alt: "Brand Logo",
									style: {
										width: "100%",
										height: "100%",
										objectFit: "cover"
									}
								}) : /* @__PURE__ */ jsxs("span", {
									style: s.brandBadgeText,
									children: [brand.brand_name?.charAt(0)?.toUpperCase(), "s"]
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(motion.div, {
								initial: {
									opacity: 0,
									x: -20
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: {
									delay: .4,
									duration: .6
								},
								style: {
									...s.sectionTitleBase,
									color: brandColor
								},
								children: "Curated by ZizzyStores — premium digital ateliers only."
							}), /* @__PURE__ */ jsx(motion.h1, {
								initial: {
									opacity: 0,
									x: -20
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: {
									delay: .5,
									duration: .6
								},
								style: {
									fontFamily: "\"Playfair Display\", serif",
									fontStyle: "italic",
									fontSize: "48px",
									color: "#FFF",
									margin: 0
								},
								className: "hero-title",
								children: brand.brand_name
							})] })]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "minmax(0, 1.8fr) minmax(0, 1fr)",
							gap: "24px",
							marginBottom: "64px"
						},
						className: "split-layout",
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								...s.narrativeBox,
								marginBottom: 0
							},
							className: "narrative-box",
							children: /* @__PURE__ */ jsxs("div", {
								style: {
									position: "relative",
									zIndex: 1
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											...s.sectionTitleBase,
											color: brandColor
										},
										children: "The Brand Narrative"
									}),
									/* @__PURE__ */ jsx("h2", {
										style: s.narrativeTitle,
										className: "narrative-title",
										children: "Transcending the ordinary through the Digital Atelier experience."
									}),
									/* @__PURE__ */ jsx("p", {
										style: s.narrativeText,
										children: brand.brand_narrative || "Zizzystores isn't just a marketplace. It's a curated ecosystem where digital craftsmanship meets commercial viability. We believe that every product carries a soul, and every store should be an architectural masterpiece. Our mission is to redefine luxury in the digital age by prioritizing breathing room and editorial excellence over sheer volume."
									})
								]
							})
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "24px"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									backgroundColor: "#111",
									border: "1px solid #1F1F1F",
									padding: "32px"
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "11px",
											fontWeight: "800",
											letterSpacing: "0.1em",
											color: brandColor,
											textTransform: "uppercase",
											marginBottom: "32px"
										},
										children: "Detailed Brand Info"
									}),
									/* @__PURE__ */ jsxs("div", {
										style: { marginBottom: "24px" },
										children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: "700",
												letterSpacing: "0.1em",
												color: "#666",
												textTransform: "uppercase",
												marginBottom: "8px"
											},
											children: "Brand Name"
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontFamily: "\"Playfair Display\", serif",
												fontSize: "20px",
												fontStyle: "italic",
												color: "#FFF"
											},
											children: brand.brand_name
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: { marginBottom: "24px" },
										children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: "700",
												letterSpacing: "0.1em",
												color: "#666",
												textTransform: "uppercase",
												marginBottom: "8px"
											},
											children: "Brand Owner"
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontFamily: "\"Playfair Display\", serif",
												fontSize: "20px",
												fontStyle: "italic",
												color: "#FFF"
											},
											children: brand.owner_name || "Anonymous Artisan"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: { marginBottom: "24px" },
										children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: "700",
												letterSpacing: "0.1em",
												color: "#666",
												textTransform: "uppercase",
												marginBottom: "8px"
											},
											children: "Email Inquiry"
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "14px",
												fontWeight: "700",
												letterSpacing: "0.05em",
												color: brandColor,
												textTransform: "uppercase"
											},
											children: brand.email_address || "INFO@BRAND.COM"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: { marginBottom: "24px" },
										children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: "700",
												letterSpacing: "0.1em",
												color: "#666",
												textTransform: "uppercase",
												marginBottom: "8px"
											},
											children: "Phone Number"
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "14px",
												fontWeight: "700",
												letterSpacing: "0.05em",
												color: brandColor,
												textTransform: "uppercase"
											},
											children: brand.phone_number || "1 (555) 012-3456"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: { marginBottom: "24px" },
										children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: "700",
												letterSpacing: "0.1em",
												color: "#666",
												textTransform: "uppercase",
												marginBottom: "8px"
											},
											children: "Location"
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "14px",
												fontWeight: "700",
												letterSpacing: "0.05em",
												color: "#FFF"
											},
											children: brand.location || "Undisclosed Studio"
										})]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "10px",
											fontWeight: "700",
											letterSpacing: "0.1em",
											color: "#666",
											textTransform: "uppercase",
											marginBottom: "8px"
										},
										children: "Delivery Duration"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "14px",
											fontWeight: "700",
											letterSpacing: "0.05em",
											color: "#FFF"
										},
										children: brand.delivery_info || "2-3 days standard"
									})] })
								]
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									backgroundColor: "#111",
									border: "1px solid #1F1F1F",
									padding: "32px"
								},
								children: [/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "11px",
										fontWeight: "800",
										letterSpacing: "0.1em",
										color: brandColor,
										textTransform: "uppercase",
										marginBottom: "32px"
									},
									children: "Quick Connectivity"
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "16px"
									},
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												width: "48px",
												height: "48px",
												borderRadius: "50%",
												border: "1px solid #333",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "#888",
												cursor: "pointer",
												transition: "all 0.2s"
											},
											onMouseEnter: (e) => {
												e.currentTarget.style.color = "#FFF";
												e.currentTarget.style.borderColor = "#FFF";
											},
											onMouseLeave: (e) => {
												e.currentTarget.style.color = "#888";
												e.currentTarget.style.borderColor = "#333";
											},
											children: /* @__PURE__ */ jsx(Globe, {
												size: 18,
												color: "currentColor"
											})
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												width: "48px",
												height: "48px",
												borderRadius: "50%",
												border: "1px solid #333",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "#888",
												cursor: "pointer",
												transition: "all 0.2s"
											},
											onMouseEnter: (e) => {
												e.currentTarget.style.color = "#FFF";
												e.currentTarget.style.borderColor = "#FFF";
											},
											onMouseLeave: (e) => {
												e.currentTarget.style.color = "#888";
												e.currentTarget.style.borderColor = "#333";
											},
											children: /* @__PURE__ */ jsx(InstagramIcon, {
												size: 18,
												color: "currentColor"
											})
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												width: "48px",
												height: "48px",
												borderRadius: "50%",
												border: "1px solid #333",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "#888",
												cursor: "pointer",
												transition: "all 0.2s"
											},
											onMouseEnter: (e) => {
												e.currentTarget.style.color = "#FFF";
												e.currentTarget.style.borderColor = "#FFF";
											},
											onMouseLeave: (e) => {
												e.currentTarget.style.color = "#888";
												e.currentTarget.style.borderColor = "#333";
											},
											children: /* @__PURE__ */ jsx(TwitterIcon, {
												size: 18,
												color: "currentColor"
											})
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												width: "48px",
												height: "48px",
												borderRadius: "50%",
												border: "1px solid #333",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "#888",
												cursor: "pointer",
												transition: "all 0.2s"
											},
											onMouseEnter: (e) => {
												e.currentTarget.style.color = "#FFF";
												e.currentTarget.style.borderColor = "#FFF";
											},
											onMouseLeave: (e) => {
												e.currentTarget.style.color = "#888";
												e.currentTarget.style.borderColor = "#333";
											},
											children: /* @__PURE__ */ jsx(FacebookIcon, {
												size: 18,
												color: "currentColor"
											})
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												width: "48px",
												height: "48px",
												borderRadius: "50%",
												border: "1px solid #333",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: "#888",
												cursor: "pointer",
												transition: "all 0.2s"
											},
											onMouseEnter: (e) => {
												e.currentTarget.style.color = "#FFF";
												e.currentTarget.style.borderColor = "#FFF";
											},
											onMouseLeave: (e) => {
												e.currentTarget.style.color = "#888";
												e.currentTarget.style.borderColor = "#333";
											},
											children: /* @__PURE__ */ jsx(TikTokIcon, {
												size: 18,
												color: "currentColor"
											})
										})
									]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.ctaContainer,
						className: "cta-container",
						children: [
							/* @__PURE__ */ jsx("div", {
								style: {
									...s.sectionTitleBase,
									color: brandColor
								},
								children: "Official Partner"
							}),
							/* @__PURE__ */ jsx("h2", {
								style: s.ctaTitle,
								className: "cta-title",
								children: "Experience the Full Collection"
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => navigate(`/shop-brand/${id}`),
								style: s.ctaButton,
								className: "cta-btn",
								children: ["Visit Official Store", /* @__PURE__ */ jsx(ExternalLink, { size: 24 })]
							}),
							/* @__PURE__ */ jsx("div", {
								style: s.ctaBridgeMessage,
								children: "You'll be redirected to the brand's official store to complete your purchase."
							}),
							/* @__PURE__ */ jsx("div", {
								style: s.triggersTitle,
								className: "triggers-title",
								children: "Why Explore Zizzystores:"
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.triggersGrid,
								className: "triggers-grid",
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: s.triggerItem,
										children: [/* @__PURE__ */ jsx(ShieldCheck, {
											size: 20,
											color: brandColor
										}), /* @__PURE__ */ jsx("span", { children: "Unique handcrafted designs" })]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.triggerItem,
										children: [/* @__PURE__ */ jsx(Bell, {
											size: 20,
											color: brandColor
										}), /* @__PURE__ */ jsx("span", { children: "Limited collections" })]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.triggerItem,
										children: [/* @__PURE__ */ jsx(Globe, {
											size: 20,
											color: brandColor
										}), /* @__PURE__ */ jsx("span", { children: "Direct from the brand" })]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.productsSection,
						children: [
							/* @__PURE__ */ jsx("div", {
								style: {
									...s.sectionTitleBase,
									color: brandColor
								},
								children: "Featured Pieces"
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.productsHeader,
								className: "products-header",
								children: [/* @__PURE__ */ jsx("h2", {
									style: s.productsTitle,
									children: "A Glimpse into the Collection"
								}), /* @__PURE__ */ jsxs("div", {
									onClick: () => navigate(`/shop-brand/${id}`),
									style: s.exploreLink,
									children: ["View full collection on store ", /* @__PURE__ */ jsx(ArrowRight, { size: 14 })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.productGrid,
								className: "product-grid",
								children: [/* @__PURE__ */ jsx("div", {
									style: s.productMain,
									className: "product-main",
									onClick: () => navigate(`/shop-brand/${id}`)
								}), /* @__PURE__ */ jsxs("div", {
									style: s.productSubGrid,
									className: "product-sub-grid",
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												...s.productItemCard,
												gridColumn: "1 / span 2",
												backgroundImage: `url("${brand?.product_2_url || "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80"}")`
											},
											className: "product-item-card",
											onClick: () => navigate(`/shop-brand/${id}`)
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												...s.productItemCard,
												backgroundImage: `url("${brand?.product_3_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}")`
											},
											className: "product-item-card",
											onClick: () => navigate(`/shop-brand/${id}`)
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												...s.productItemCard,
												backgroundImage: `url("${brand?.product_4_url || "https://images.unsplash.com/photo-1516280440502-617513511eb4?w=300&q=80"}")`
											},
											className: "product-item-card",
											onClick: () => navigate(`/shop-brand/${id}`)
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.similarSection,
						children: [
							/* @__PURE__ */ jsx("div", {
								style: {
									...s.sectionTitleBase,
									color: "#888"
								},
								children: "Keep Exploring"
							}),
							/* @__PURE__ */ jsx("h2", {
								style: {
									...s.productsTitle,
									marginBottom: "40px"
								},
								children: "You may also like"
							}),
							/* @__PURE__ */ jsx("div", {
								style: s.similarGrid,
								className: "similar-grid",
								children: similarBrands.length > 0 ? similarBrands.map((b) => /* @__PURE__ */ jsxs("div", {
									style: s.similarCard,
									onClick: () => navigate(`/explore-brand/${b.id}`),
									onMouseEnter: (e) => e.currentTarget.style.borderColor = brandColor,
									onMouseLeave: (e) => e.currentTarget.style.borderColor = "#1F1F1F",
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												...s.similarLogo,
												backgroundImage: b.logo_url ? `url(${b.logo_url})` : "none",
												backgroundSize: "cover",
												backgroundPosition: "center"
											},
											children: !b.logo_url && /* @__PURE__ */ jsx("span", {
												style: {
													fontFamily: "\"Playfair Display\", serif",
													fontSize: "24px",
													fontStyle: "italic",
													color: "#555"
												},
												children: b.brand_name?.charAt(0)?.toUpperCase() || "B"
											})
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.similarName,
											children: b.brand_name || "Curated Selection"
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.similarCategory,
											children: b.brand_category || "View Directory"
										})
									]
								}, b.id)) : /* @__PURE__ */ jsx("div", {
									style: {
										color: "#888",
										gridColumn: "1 / -1",
										textAlign: "center",
										padding: "40px 0"
									},
									children: "More brands joining soon..."
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.footer,
						className: "footer",
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "8px"
							},
							children: [/* @__PURE__ */ jsx("span", {
								style: {
									fontFamily: "\"Playfair Display\", serif",
									fontSize: "14px",
									fontStyle: "italic",
									fontWeight: "bold",
									color: brandColor
								},
								children: brand.brand_name
							}), /* @__PURE__ */ jsxs("span", {
								style: {
									fontSize: "9px",
									color: "#555",
									letterSpacing: "0.05em"
								},
								children: [
									"© ",
									(/* @__PURE__ */ new Date()).getFullYear(),
									" DIGITAL ATELIER"
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							style: s.footerLinks,
							className: "footer-links",
							children: [
								/* @__PURE__ */ jsx("span", {
									style: { cursor: "pointer" },
									children: "Privacy Policy"
								}),
								/* @__PURE__ */ jsx("span", {
									style: { cursor: "pointer" },
									children: "Terms of Curation"
								}),
								/* @__PURE__ */ jsx("span", {
									style: { cursor: "pointer" },
									children: "Legal Information"
								})
							]
						})]
					})
				]
			})]
		})]
	}) });
}
//#endregion
export { ExploreBrand as default };
