import { n as motion, t as PageTransition } from "./PageTransition-8IvNPEDC.js";
import { n as supabase } from "./supabase-DvwDzIWb.js";
import { t as createLucideIcon } from "./createLucideIcon-D9kzrCV5.js";
import { n as Bookmark, t as Heart } from "./heart-BTZCL0G5.js";
import { t as Search } from "./search-Cb7vyolf.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
var LogOut = createLucideIcon("log-out", [
	["path", {
		d: "m16 17 5-5-5-5",
		key: "1bji2h"
	}],
	["path", {
		d: "M21 12H9",
		key: "dn1m92"
	}],
	["path", {
		d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
		key: "1uf3rs"
	}]
]);
//#endregion
//#region src/pages/Storefront.jsx
function Storefront() {
	const brandColor = "#06acf8";
	const bgColor = "#050505";
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		async function loadBrands() {
			try {
				setLoading(true);
				const { data, error } = await supabase.from("brand_profiles").select("*").not("brand_name", "is", null).order("created_at", { ascending: false });
				if (error) throw error;
				setBrands(data || []);
			} catch (err) {
				console.error("Error loading brands:", err);
			} finally {
				setLoading(false);
			}
		}
		loadBrands();
	}, []);
	const s = {
		page: {
			backgroundColor: bgColor,
			color: "#E5E5E5",
			minHeight: "100vh",
			fontFamily: "\"Inter\", sans-serif",
			position: "relative",
			overflowX: "hidden"
		},
		ambientGlow: {
			position: "absolute",
			top: 0,
			left: "50%",
			transform: "translateX(-50%)",
			width: "100%",
			height: "800px",
			background: `radial-gradient(ellipse at 50% 20%, rgba(6, 172, 248, 0.15) 0%, rgba(6, 172, 248, 0.05) 30%, transparent 60%)`,
			pointerEvents: "none",
			zIndex: 0
		},
		navbar: {
			position: "relative",
			zIndex: 10,
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "32px 64px",
			borderBottom: "1px solid rgba(255,255,255,0.05)"
		},
		navCenter: {
			position: "absolute",
			left: "50%",
			transform: "translateX(-50%)",
			display: "flex",
			gap: "40px",
			alignItems: "center"
		},
		navLink: (active) => ({
			color: active ? "#FFF" : "#888",
			fontSize: "11px",
			fontWeight: "600",
			letterSpacing: "0.05em",
			textTransform: "uppercase",
			textDecoration: "none",
			borderBottom: active ? `2px solid ${brandColor}` : "2px solid transparent",
			paddingBottom: "8px",
			cursor: "pointer",
			transition: "color 0.2s"
		}),
		navIcons: {
			display: "flex",
			gap: "24px",
			alignItems: "center"
		},
		hero: {
			position: "relative",
			zIndex: 10,
			padding: "120px 64px 80px 64px",
			maxWidth: "900px"
		},
		heroTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontStyle: "italic",
			fontSize: "72px",
			fontWeight: "400",
			color: "#FFF",
			lineHeight: "1.1",
			marginBottom: "24px",
			letterSpacing: "-0.02em"
		},
		heroHighlight: {
			color: brandColor,
			fontWeight: "600"
		},
		heroDesc: {
			fontSize: "14px",
			color: "#A0A0A0",
			lineHeight: "1.6",
			maxWidth: "460px"
		},
		filterBar: {
			position: "relative",
			zIndex: 10,
			padding: "0 64px",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "64px"
		},
		filterLinks: {
			display: "flex",
			gap: "32px"
		},
		filterLink: (active) => ({
			color: active ? "#FFF" : "#666",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			cursor: "pointer"
		}),
		searchBox: {
			display: "flex",
			alignItems: "center",
			gap: "12px",
			backgroundColor: "#0A0A0A",
			border: "1px solid #1A1A1A",
			padding: "12px 16px",
			width: "280px"
		},
		searchInput: {
			backgroundColor: "transparent",
			border: "none",
			color: "#FFF",
			fontSize: "10px",
			fontWeight: "600",
			letterSpacing: "0.1em",
			width: "100%",
			outline: "none"
		},
		grid: {
			position: "relative",
			zIndex: 10,
			padding: "0 64px",
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: "40px",
			marginBottom: "120px"
		},
		card: {
			display: "flex",
			flexDirection: "column",
			gap: "16px",
			cursor: "pointer",
			group: "card"
		},
		cardImageWrap: {
			width: "100%",
			aspectRatio: "1",
			backgroundColor: "#111",
			overflow: "hidden",
			position: "relative"
		},
		cardImage: {
			width: "100%",
			height: "100%",
			objectFit: "cover",
			transition: "transform 0.5s ease"
		},
		cardContent: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "flex-start"
		},
		cardLeft: {
			display: "flex",
			flexDirection: "column",
			gap: "6px"
		},
		cardCategory: {
			fontSize: "9px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			color: brandColor
		},
		cardTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "24px",
			color: "#FFF"
		},
		cardDesc: {
			fontSize: "12px",
			color: "#888",
			fontStyle: "italic",
			fontFamily: "\"Playfair Display\", serif",
			lineHeight: "1.4",
			marginTop: "4px",
			maxWidth: "90%"
		},
		cardBadge: {
			width: "28px",
			height: "28px",
			border: "1px solid #222",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "#888",
			fontSize: "11px",
			fontFamily: "\"Playfair Display\", serif",
			fontStyle: "italic"
		},
		newsletter: {
			position: "relative",
			zIndex: 10,
			borderTop: "1px solid #111",
			padding: "120px 0",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			textAlign: "center"
		},
		newsletterTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "32px",
			fontStyle: "italic",
			color: "#FFF",
			marginBottom: "16px"
		},
		newsletterDesc: {
			fontSize: "12px",
			color: "#888",
			marginBottom: "40px"
		},
		newsletterForm: {
			display: "flex",
			width: "100%",
			maxWidth: "480px",
			gap: "16px"
		},
		newsletterInput: {
			flex: 1,
			backgroundColor: "#111",
			border: "1px solid #222",
			padding: "16px 20px",
			color: "#FFF",
			fontSize: "11px",
			letterSpacing: "0.05em",
			outline: "none",
			fontFamily: "\"Inter\", sans-serif"
		},
		newsletterBtn: {
			backgroundColor: brandColor,
			color: "#000",
			border: "none",
			padding: "0 32px",
			fontSize: "11px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			cursor: "pointer",
			transition: "opacity 0.2s"
		},
		footer: {
			position: "relative",
			zIndex: 10,
			padding: "40px 64px",
			borderTop: "1px solid #111",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center"
		},
		footerBrand: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "20px",
			fontStyle: "italic",
			color: "#FFF",
			fontWeight: "600"
		},
		footerLinks: {
			display: "flex",
			gap: "32px",
			position: "absolute",
			left: "50%",
			transform: "translateX(-50%)"
		},
		footerLink: {
			fontSize: "9px",
			fontWeight: "600",
			letterSpacing: "0.1em",
			color: "#666",
			textTransform: "uppercase",
			cursor: "pointer"
		},
		footerCopyright: {
			fontSize: "9px",
			letterSpacing: "0.05em",
			color: "#444",
			textTransform: "uppercase"
		}
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		children: [
			/* @__PURE__ */ jsx("div", { style: s.ambientGlow }),
			/* @__PURE__ */ jsxs("nav", {
				style: s.navbar,
				className: "store-nav",
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "\"Playfair Display\", serif",
						fontSize: "28px",
						color: brandColor,
						fontWeight: "700",
						textTransform: "uppercase",
						letterSpacing: "0.05em",
						textShadow: `0 0 12px ${brandColor}40`
					},
					className: "store-logo",
					children: "ZIZZYSTORES."
				}), /* @__PURE__ */ jsx("div", {
					style: s.navIcons,
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						title: "Log Out",
						style: {
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							color: "#888",
							transition: "color 0.2s"
						},
						onMouseEnter: (e) => e.currentTarget.style.color = "#FFF",
						onMouseLeave: (e) => e.currentTarget.style.color = "#888",
						children: /* @__PURE__ */ jsx(LogOut, { size: 20 })
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				style: s.hero,
				className: "store-hero",
				children: [/* @__PURE__ */ jsxs(motion.h1, {
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
					style: s.heroTitle,
					className: "store-hero-title",
					children: [
						"Discover the",
						/* @__PURE__ */ jsx("br", {}),
						/* @__PURE__ */ jsx("span", {
							style: s.heroHighlight,
							children: "Digital Ateliers."
						})
					]
				}), /* @__PURE__ */ jsxs(motion.p, {
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
						delay: .1,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					style: s.heroDesc,
					children: [
						"Independent designers and master craftspeople.",
						/* @__PURE__ */ jsx("br", {}),
						"For the modern collector who values heritage over trends."
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					...s.filterBar,
					justifyContent: "center"
				},
				className: "store-filter-bar",
				children: /* @__PURE__ */ jsxs("div", {
					style: s.searchBox,
					children: [/* @__PURE__ */ jsx(Search, {
						size: 14,
						color: "#666"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "SEARCH BRANDS...",
						style: s.searchInput
					})]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				style: s.grid,
				className: "store-grid",
				children: loading ? /* @__PURE__ */ jsx("div", {
					style: {
						gridColumn: "1 / -1",
						textAlign: "center",
						padding: "64px",
						color: "#888"
					},
					children: "Syncing Brand Matrix..."
				}) : brands.length === 0 ? /* @__PURE__ */ jsx("div", {
					style: {
						gridColumn: "1 / -1",
						textAlign: "center",
						padding: "64px",
						color: "#888"
					},
					children: "No independent ateliers are currently broadcasting. Check back later."
				}) : brands.map((brand, idx) => /* @__PURE__ */ jsx(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					whileInView: {
						opacity: 1,
						y: 0
					},
					viewport: { once: true },
					transition: {
						delay: idx % 3 * .1,
						duration: .5
					},
					children: /* @__PURE__ */ jsxs(Link, {
						to: `/explore-brand/${brand.id}`,
						style: {
							...s.card,
							textDecoration: "none"
						},
						className: "product-card",
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: s.cardImageWrap,
								children: [/* @__PURE__ */ jsx("img", {
									src: brand.banner_url || brand.logo_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
									alt: brand.brand_name,
									style: s.cardImage
								}), /* @__PURE__ */ jsxs("div", {
									className: "card-hover-actions",
									children: [/* @__PURE__ */ jsx("div", {
										className: "icon-btn",
										title: "Follow Brand",
										onClick: (e) => {
											e.preventDefault();
											e.stopPropagation();
										},
										children: /* @__PURE__ */ jsx(Heart, { size: 16 })
									}), /* @__PURE__ */ jsx("div", {
										className: "icon-btn",
										title: "Save to Collections",
										onClick: (e) => {
											e.preventDefault();
											e.stopPropagation();
										},
										children: /* @__PURE__ */ jsx(Bookmark, { size: 16 })
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.cardContent,
								children: [/* @__PURE__ */ jsxs("div", {
									style: s.cardLeft,
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												...s.cardCategory,
												color: brand.accent_color || brandColor
											},
											children: brand.subcategory || "INDEPENDENT"
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.cardTitle,
											children: brand.brand_name
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.cardDesc,
											children: brand.tagline || brand.manifesto?.substring(0, 60) + "..." || "Mastering the architecture of modern commerce."
										})
									]
								}), /* @__PURE__ */ jsx("div", {
									style: s.cardBadge,
									children: brand.brand_name?.charAt(0)?.toUpperCase() || "O"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "show-more-btn",
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								},
								children: ["Explore ", brand.brand_name]
							})
						]
					})
				}, brand.id || idx))
			}),
			/* @__PURE__ */ jsxs("section", {
				style: s.newsletter,
				className: "store-newsletter",
				children: [
					/* @__PURE__ */ jsx("h2", {
						style: s.newsletterTitle,
						children: "Join the inner circle."
					}),
					/* @__PURE__ */ jsx("p", {
						style: s.newsletterDesc,
						children: "Early access to limited releases and designer narratives, delivered monthly to your inbox."
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.newsletterForm,
						className: "store-newsletter-form",
						children: [/* @__PURE__ */ jsx("input", {
							type: "email",
							placeholder: "EMAIL ADDRESS",
							style: s.newsletterInput
						}), /* @__PURE__ */ jsx("button", {
							style: s.newsletterBtn,
							children: "Subscribe"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("footer", {
				style: s.footer,
				className: "store-footer",
				children: [
					/* @__PURE__ */ jsx("div", {
						style: s.footerBrand,
						children: "Zizzystores"
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.footerLinks,
						className: "store-footer-links",
						children: [
							/* @__PURE__ */ jsx("div", {
								style: s.footerLink,
								children: "Terms"
							}),
							/* @__PURE__ */ jsx("div", {
								style: s.footerLink,
								children: "Privacy"
							}),
							/* @__PURE__ */ jsx("div", {
								style: s.footerLink,
								children: "Instagram"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: s.footerCopyright,
						children: "© 2026 THE GALLERY OF ATELIERS"
					})
				]
			}),
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .store-nav { padding: 24px !important; flex-wrap: wrap; gap: 16px; justify-content: space-between; }
          .store-logo { font-size: 20px !important; }
          .store-hero { padding: 80px 24px 40px 24px !important; text-align: center; }
          .store-hero-title { font-size: 36px !important; line-height: 1.2 !important; }
          .store-filter-bar { padding: 0 24px !important; flex-direction: column; gap: 24px; align-items: center !important; margin-bottom: 32px !important; }
          .store-grid { padding: 0 20px !important; grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; margin-bottom: 64px !important; }
          .store-newsletter { padding: 80px 24px !important; }
          .store-newsletter-form { flex-direction: column; padding: 0 24px; box-sizing: border-box; width: 100% !important; }
          .store-footer { flex-direction: column; padding: 48px 24px !important; gap: 32px; text-align: center; align-items: center !important; }
          .store-footer-links { position: static !important; transform: none !important; flex-wrap: wrap; justify-content: center; gap: 16px !important; }
          .card-hover-actions { opacity: 1 !important; visibility: visible !important; }
          .show-more-btn { opacity: 1 !important; transform: none !important; border-color: ${brandColor} !important; color: ${brandColor} !important; visibility: visible !important; }
        }
        .product-card:hover img {
          transform: scale(1.05);
        }
        .card-hover-actions {
          position: absolute;
          top: 16px;
          right: 16px;
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          gap: 12px;
        }
        .product-card:hover .card-hover-actions {
          opacity: 1;
        }
        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          color: #FFF;
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background-color: ${brandColor};
          color: #000;
          border-color: ${brandColor};
        }
        .show-more-btn {
          background-color: transparent;
          border: 1px solid #333;
          color: #FFF;
          padding: 12px 0;
          width: 100%;
          margin-top: 8px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(10px);
        }
        .product-card:hover .show-more-btn {
          opacity: 1;
          transform: translateY(0);
          border-color: ${brandColor};
          color: ${brandColor};
        }
        .show-more-btn:hover {
          background-color: ${brandColor} !important;
          color: #000 !important;
        }
      ` })
		]
	}) });
}
//#endregion
export { Storefront as default };
