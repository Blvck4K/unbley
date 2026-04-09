import { n as motion, t as PageTransition } from "./PageTransition-8IvNPEDC.js";
import { n as supabase } from "./supabase-DvwDzIWb.js";
import { t as useAuth } from "./useAuth-BrrkS1Z-.js";
import { t as ArrowRight } from "./arrow-right-DN0ZYJFf.js";
import { t as Globe } from "./globe-ByFpp4g5.js";
import { t as LayoutGrid } from "./layout-grid-w93TTKVH.js";
import { t as Mail } from "./mail-CKL5T_AG.js";
import { t as Menu } from "./menu-D_2kJXIR.js";
import { t as Search } from "./search-Cb7vyolf.js";
import { t as SquarePen } from "./square-pen-DdC4Jpm2.js";
import { t as User } from "./user-DXWgR_GV.js";
import { t as X } from "./x-C906TXTk.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/pages/Profile.jsx
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
function Profile() {
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const [feedbackMsg, setFeedbackMsg] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState(null);
	const [profileData, setProfileData] = useState({
		brand_name: "Your Brand",
		owner_name: "Brand Owner",
		email_address: "email@example.com",
		phone_number: "N/A",
		brand_narrative: "No narrative provided.",
		manifesto: "No manifesto provided.",
		primary_color: "#0A0A0A",
		secondary_color: "#111111",
		accent_color: "#06acf8",
		logo_url: "",
		banner_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
		product_1_url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
		product_2_url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80",
		product_3_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
		product_4_url: "https://images.unsplash.com/photo-1516280440502-617513511eb4?w=300&q=80",
		instagram_url: "",
		twitter_url: "",
		facebook_url: "",
		tiktok_url: "",
		website_url: ""
	});
	useEffect(() => {
		async function fetchProfile() {
			if (!user) return;
			try {
				const { data, error } = await supabase.from("brand_profiles").select("*").eq("id", user.id).single();
				if (data) setProfileData((prev) => ({
					...prev,
					...Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null && v !== ""))
				}));
			} catch (err) {
				console.error("Error loading profile data:", err);
			} finally {
				setLoading(false);
			}
		}
		if (user?.email) setUserEmail(user.email);
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		fetchProfile();
		return () => window.removeEventListener("resize", handleResize);
	}, [user]);
	const brandColor = "#06acf8ff";
	const primaryColor = "#0A0A0A";
	const secondaryColor = "#111";
	const s = {
		page: {
			backgroundColor: primaryColor,
			color: "#E5E5E5",
			height: isMobile ? "auto" : "100vh",
			minHeight: "100vh",
			overflow: isMobile ? "visible" : "hidden",
			display: "flex",
			fontFamily: "\"Inter\", sans-serif"
		},
		sidebar: {
			width: "280px",
			borderRight: "1px solid #1F1F1F",
			padding: "0",
			display: "flex",
			flexDirection: "column"
		},
		logoContainer: {
			padding: "60px 40px",
			display: "flex",
			flexDirection: "column"
		},
		logo: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "18px",
			letterSpacing: "0.05em",
			color: brandColor,
			textTransform: "uppercase"
		},
		nav: {
			padding: "0",
			flex: 1
		},
		navItem: (active) => ({
			display: "flex",
			alignItems: "center",
			gap: "16px",
			padding: "16px 40px",
			color: active ? "#FFF" : "#888",
			backgroundColor: active ? secondaryColor : "transparent",
			borderLeft: active ? `3px solid ${brandColor}` : "3px solid transparent",
			cursor: "pointer",
			fontSize: "12px",
			fontWeight: active ? "600" : "400",
			letterSpacing: "0.05em",
			transition: "all 0.2s",
			textTransform: "uppercase",
			textDecoration: "none"
		}),
		userProfile: {
			padding: "24px 40px",
			borderTop: "1px solid #1F1F1F",
			display: "flex",
			alignItems: "center",
			gap: "16px",
			backgroundColor: secondaryColor
		},
		userAvatar: {
			width: "40px",
			height: "40px",
			backgroundColor: "#333",
			overflow: "hidden",
			borderRadius: "50%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
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
			borderBottom: "1px solid #1F1F1F"
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
			backgroundColor: secondaryColor,
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
		content: {
			padding: "80px",
			flex: 1,
			overflowY: "auto"
		},
		banner: {
			position: "relative",
			height: "400px",
			backgroundColor: secondaryColor,
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
			backgroundImage: `url("${profileData.banner_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80"}")`,
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
			backgroundColor: secondaryColor,
			overflow: "hidden"
		},
		brandBadgeText: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "24px",
			color: brandColor
		},
		brandBadgeImg: {
			width: "100%",
			height: "100%",
			objectFit: "cover"
		},
		sectionTitleBase: {
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			marginBottom: "16px"
		},
		gridContainer: {
			display: "grid",
			gridTemplateColumns: "minmax(300px, 1fr) 2fr",
			gap: "32px",
			marginBottom: "64px"
		},
		infoBox: {
			backgroundColor: secondaryColor,
			border: "1px solid #1F1F1F",
			padding: "32px",
			marginBottom: "24px"
		},
		infoItem: { marginBottom: "24px" },
		infoLabel: {
			fontSize: "9px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: "#666",
			textTransform: "uppercase",
			marginBottom: "8px"
		},
		infoValue: {
			fontSize: "14px",
			color: "#FFF",
			fontFamily: "\"Playfair Display\", serif"
		},
		narrativeBox: {
			backgroundColor: secondaryColor,
			border: "1px solid #1F1F1F",
			padding: "48px",
			position: "relative"
		},
		narrativeTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "32px",
			color: "#FFF",
			lineHeight: "1.2",
			marginBottom: "24px",
			maxWidth: "80%"
		},
		narrativeText: {
			color: "#888",
			fontSize: "14px",
			lineHeight: "1.6",
			marginBottom: "48px",
			maxWidth: "90%"
		},
		subGrid: {
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
			gap: "32px"
		},
		subTitle: {
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: "#FFF",
			textTransform: "uppercase",
			marginBottom: "12px"
		},
		subText: {
			color: "#888",
			fontSize: "12px",
			lineHeight: "1.6"
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
			color: "#FFF"
		},
		exploreLink: {
			fontSize: "12px",
			color: "#FFF",
			textDecoration: "none",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			letterSpacing: "0.05em"
		},
		productGrid: {
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
			gap: "16px"
		},
		productMain: {
			backgroundColor: secondaryColor,
			height: "500px",
			backgroundImage: `url("${profileData.product_1_url}")`,
			backgroundSize: "cover",
			backgroundPosition: "center",
			borderRadius: "4px"
		},
		productSubGrid: {
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
			gridTemplateRows: "1fr 1fr",
			gap: "16px",
			height: "500px"
		},
		productItemCard: {
			backgroundColor: secondaryColor,
			backgroundSize: "cover",
			backgroundPosition: "center",
			borderRadius: "4px"
		},
		newsletterBox: {
			border: `2px solid ${brandColor}`,
			padding: "64px",
			textAlign: "center",
			backgroundColor: primaryColor,
			marginBottom: "64px"
		},
		newsletterTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "32px",
			color: "#FFF",
			marginBottom: "16px",
			marginTop: "24px"
		},
		newsletterDesc: {
			color: "#888",
			fontSize: "14px",
			marginBottom: "40px",
			maxWidth: "500px",
			margin: "0 auto 40px"
		},
		feedbackForm: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			gap: "24px",
			maxWidth: "600px",
			margin: "0 auto"
		},
		feedbackTextarea: {
			width: "100%",
			backgroundColor: secondaryColor,
			border: "1px solid #333",
			color: "#FFF",
			fontSize: "14px",
			padding: "16px",
			outline: "none",
			borderRadius: "4px",
			minHeight: "120px",
			resize: "vertical",
			fontFamily: "inherit"
		},
		feedbackInput: {
			width: "100%",
			backgroundColor: "transparent",
			border: "none",
			borderBottom: "1px solid #333",
			color: "#FFF",
			fontSize: "12px",
			outline: "none",
			padding: "8px 0",
			letterSpacing: "0.05em"
		},
		feedbackBtn: {
			backgroundColor: brandColor,
			color: "#000",
			padding: "12px 32px",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			cursor: "pointer",
			borderRadius: "4px",
			border: "none",
			transition: "opacity 0.2s"
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
	const ConnectivityIconWrapper = ({ url, children }) => {
		if (!url) return null;
		return /* @__PURE__ */ jsx("a", {
			href: url.startsWith("http") ? url : `https://${url}`,
			target: "_blank",
			rel: "noopener noreferrer",
			style: { textDecoration: "none" },
			children: /* @__PURE__ */ jsx("div", {
				style: {
					width: "40px",
					height: "40px",
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
				children
			})
		});
	};
	const handleFeedbackSubmit = async (e) => {
		e.preventDefault();
		if (!feedbackMsg.trim()) return;
		setIsSubmitting(true);
		setSubmitStatus(null);
		const botToken = "8742134511:AAEMCmlspEL5ZBk8ltwxHOgBBqM2AGSE4q8";
		const chatId = "8059395373";
		const message = `
🌟 *New Feedback Received* 🌟

*Brand:* ${profileData.brand_name}
*Customer Email:* ${userEmail || "Anonymous"}

*Message:*
${feedbackMsg}

---
_Sent via Zizzystores Digital Atelier_
    `;
		try {
			if ((await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					chat_id: chatId,
					text: message,
					parse_mode: "Markdown"
				})
			})).ok) {
				setSubmitStatus("success");
				setFeedbackMsg("");
			} else throw new Error("Failed to send message");
		} catch (err) {
			console.error("Telegram Error:", err);
			setSubmitStatus("error");
		} finally {
			setIsSubmitting(false);
			setTimeout(() => setSubmitStatus(null), 5e3);
		}
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			...s.page,
			alignItems: "center",
			justifyContent: "center"
		},
		children: "Loading Profile..."
	});
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		className: "prof-page",
		children: [
			/* @__PURE__ */ jsx("style", { children: `
          @media (max-width: 768px) {
            .prof-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
            .prof-sidebar { 
              position: fixed !important; 
              top: 0 !important; 
              left: ${isSidebarOpen ? "0" : "-100%"} !important; 
              width: 280px !important; 
              height: 100vh !important; 
              z-index: 1000 !important; 
              background-color: #0A0A0A !important;
              transition: left 0.3s ease !important;
              box-shadow: 10px 0 30px rgba(0,0,0,0.5) !important;
            }
            .prof-overlay {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background-color: rgba(0,0,0,0.7) !important;
              z-index: 999 !important;
              display: ${isSidebarOpen ? "block" : "none"} !important;
            }
            .prof-logo-container { padding: 24px !important; }
            .prof-nav { display: flex; flex-direction: column !important; overflow-y: auto !important; }
            .prof-nav a, .prof-nav div { border-left: 3px solid transparent !important; border-bottom: none !important; padding: 16px 40px !important; font-size: 14px !important; }
            .prof-user-profile { display: flex !important; margin-top: auto; }
            
            .prof-header { height: auto !important; padding: 20px 24px !important; flex-wrap: wrap; gap: 16px; justify-content: space-between; position: sticky; top: 0; background: #0A0A0A; z-index: 100; border-bottom: 1px solid #1F1F1F; }
            .prof-search { width: 100% !important; order: 3; margin-top: 8px; }
            
            .prof-content { padding: 24px 20px !important; overflow: visible !important; }
            .prof-banner { padding: 48px 24px !important; height: auto !important; min-height: 280px; margin-bottom: 24px !important; }
            .prof-banner-content { flex-direction: column; align-items: flex-start !important; text-align: left; gap: 20px !important; }
            .prof-banner h1 { font-size: 32px !important; }
            
            .prof-grid-container { grid-template-columns: 1fr !important; gap: 24px !important; margin-bottom: 40px !important; }
            .prof-narrative-box { padding: 32px 24px !important; }
            .prof-narrative-title { font-size: 24px !important; margin-bottom: 20px !important; }
            .prof-sub-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
            
            .prof-products-header { flex-direction: column; align-items: flex-start !important; gap: 12px; margin-bottom: 24px !important; }
            .prof-products-header h2 { font-size: 28px !important; }
            .prof-product-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
            .prof-product-main { height: 350px !important; }
            .prof-product-sub-grid { height: auto !important; grid-template-rows: repeat(3, 200px) !important; }
            .prof-product-item-card { grid-column: auto !important; }
            
            .prof-newsletter { padding: 48px 24px !important; margin-bottom: 40px !important; }
            .prof-newsletter h2 { font-size: 24px !important; }
            
            .prof-footer { flex-direction: column; gap: 32px; text-align: center; padding-top: 24px !important; }
            .prof-footer-links { flex-wrap: wrap; justify-content: center; gap: 20px !important; }
            .mobile-only { display: block !important; }
          }
          @media (min-width: 769px) {
            .mobile-only { display: none !important; }
          }
        ` }),
			/* @__PURE__ */ jsx("div", {
				className: "prof-overlay",
				onClick: () => setIsSidebarOpen(false)
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.sidebar,
				className: "prof-sidebar",
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							...s.logoContainer,
							position: "relative"
						},
						className: "prof-logo-container",
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: () => setIsSidebarOpen(false),
								style: {
									position: "absolute",
									top: "24px",
									right: "24px",
									background: "none",
									border: "none",
									color: "#666",
									cursor: "pointer"
								},
								className: "mobile-only",
								children: /* @__PURE__ */ jsx(X, { size: 24 })
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: { textDecoration: "none" },
								children: /* @__PURE__ */ jsx("div", {
									style: s.logo,
									children: "Zizzystores."
								})
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Inter",
									fontSize: "9px",
									fontWeight: "700",
									letterSpacing: "0.1em",
									color: "#666",
									marginTop: "8px",
									textTransform: "uppercase"
								},
								children: "Digital Store"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.nav,
						className: "prof-nav",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								to: "/dashboard",
								style: s.navItem(false),
								children: [/* @__PURE__ */ jsx(LayoutGrid, { size: 16 }), " Overview"]
							}),
							/* @__PURE__ */ jsxs(Link, {
								to: "/profile",
								style: s.navItem(true),
								children: [/* @__PURE__ */ jsx(User, { size: 16 }), " Profile"]
							}),
							/* @__PURE__ */ jsxs(Link, {
								to: "/edit",
								style: s.navItem(false),
								children: [/* @__PURE__ */ jsx(SquarePen, { size: 16 }), " Edit"]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.userProfile,
						className: "prof-user-profile",
						children: [/* @__PURE__ */ jsx("div", {
							style: s.userAvatar,
							children: profileData.logo_url ? /* @__PURE__ */ jsx("img", {
								src: profileData.logo_url,
								alt: profileData.owner_name,
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							}) : /* @__PURE__ */ jsx("span", {
								style: { color: "#FFF" },
								children: profileData.owner_name?.charAt(0)?.toUpperCase() || "U"
							})
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "12px",
								fontWeight: "700",
								color: "#FFF",
								letterSpacing: "0.05em",
								textTransform: "uppercase"
							},
							children: profileData.owner_name
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "10px",
								color: "#666",
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								marginTop: "4px"
							},
							children: "Principal Curator"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.main,
				children: [/* @__PURE__ */ jsxs("div", {
					style: s.header,
					className: "prof-header",
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "16px"
						},
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setIsSidebarOpen(true),
							style: {
								background: "none",
								border: "none",
								color: "#FFF",
								cursor: "pointer"
							},
							className: "mobile-only",
							children: /* @__PURE__ */ jsx(Menu, { size: 24 })
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
						className: "prof-search",
						children: [/* @__PURE__ */ jsxs("div", {
							style: s.searchBar,
							className: "prof-search",
							children: [/* @__PURE__ */ jsx(Search, {
								size: 14,
								color: "#666"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "Search ...",
								style: s.searchInput
							})]
						}), /* @__PURE__ */ jsx("div", { style: s.headerActions })]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: s.content,
					className: "prof-content",
					children: [
						/* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								y: 30
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
							className: "prof-banner",
							children: [/* @__PURE__ */ jsx("div", { style: s.bannerBg }), /* @__PURE__ */ jsxs("div", {
								style: s.bannerContent,
								className: "prof-banner-content",
								children: [/* @__PURE__ */ jsx("div", {
									style: s.brandBadge,
									children: profileData.logo_url ? /* @__PURE__ */ jsx("img", {
										src: profileData.logo_url,
										alt: "Brand Logo",
										style: s.brandBadgeImg
									}) : /* @__PURE__ */ jsxs("span", {
										style: s.brandBadgeText,
										children: [profileData.brand_name?.charAt(0)?.toUpperCase() || "Z", "s"]
									})
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									style: {
										...s.sectionTitleBase,
										color: brandColor
									},
									children: "Brand Identity"
								}), /* @__PURE__ */ jsx("h1", {
									style: {
										fontFamily: "\"Playfair Display\", serif",
										fontSize: "48px",
										color: "#FFF",
										margin: 0
									},
									children: profileData.brand_name
								})] })]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: s.gridContainer,
							className: "prof-grid-container",
							children: [/* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									x: -20
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: {
									duration: .6,
									delay: .2
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: s.infoBox,
									children: [
										/* @__PURE__ */ jsx("div", {
											style: {
												...s.sectionTitleBase,
												color: brandColor
											},
											children: "Detailed Brand Info"
										}),
										/* @__PURE__ */ jsxs("div", {
											style: s.infoItem,
											children: [/* @__PURE__ */ jsx("div", {
												style: s.infoLabel,
												children: "Brand Name"
											}), /* @__PURE__ */ jsx("div", {
												style: s.infoValue,
												children: profileData.brand_name
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: s.infoItem,
											children: [/* @__PURE__ */ jsx("div", {
												style: s.infoLabel,
												children: "Brand Owner"
											}), /* @__PURE__ */ jsx("div", {
												style: {
													...s.infoValue,
													color: "#CCC"
												},
												children: profileData.owner_name
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: s.infoItem,
											children: [/* @__PURE__ */ jsx("div", {
												style: s.infoLabel,
												children: "Email Inquiry"
											}), /* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "12px",
													color: brandColor,
													fontWeight: "600",
													letterSpacing: "0.05em",
													textTransform: "uppercase"
												},
												children: profileData.email_address
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												...s.infoItem,
												marginBottom: 0
											},
											children: [/* @__PURE__ */ jsx("div", {
												style: s.infoLabel,
												children: "Concierge Line"
											}), /* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "12px",
													color: "#FFF",
													fontWeight: "500",
													letterSpacing: "0.05em"
												},
												children: profileData.phone_number
											})]
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									style: s.infoBox,
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											...s.sectionTitleBase,
											color: brandColor
										},
										children: "Quick Connectivity"
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "16px",
											flexWrap: "wrap"
										},
										children: [
											/* @__PURE__ */ jsx(ConnectivityIconWrapper, {
												url: profileData.website_url,
												children: /* @__PURE__ */ jsx(Globe, {
													size: 16,
													color: "currentColor"
												})
											}),
											/* @__PURE__ */ jsx(ConnectivityIconWrapper, {
												url: profileData.instagram_url,
												children: /* @__PURE__ */ jsx(InstagramIcon, {
													size: 16,
													color: "currentColor"
												})
											}),
											/* @__PURE__ */ jsx(ConnectivityIconWrapper, {
												url: profileData.twitter_url,
												children: /* @__PURE__ */ jsx(TwitterIcon, {
													size: 16,
													color: "currentColor"
												})
											}),
											/* @__PURE__ */ jsx(ConnectivityIconWrapper, {
												url: profileData.facebook_url,
												children: /* @__PURE__ */ jsx(FacebookIcon, {
													size: 16,
													color: "currentColor"
												})
											}),
											/* @__PURE__ */ jsx(ConnectivityIconWrapper, {
												url: profileData.tiktok_url,
												children: /* @__PURE__ */ jsx(TikTokIcon, {
													size: 16,
													color: "currentColor"
												})
											}),
											!profileData.website_url && !profileData.instagram_url && !profileData.twitter_url && !profileData.facebook_url && !profileData.tiktok_url && /* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "10px",
													color: "#666"
												},
												children: "No social links configured."
											})
										]
									})]
								})]
							}), /* @__PURE__ */ jsx(motion.div, {
								initial: {
									opacity: 0,
									x: 20
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: {
									duration: .6,
									delay: .3
								},
								style: s.narrativeBox,
								className: "prof-narrative-box",
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
											className: "prof-narrative-title",
											children: "Transcending the ordinary through the Digital Atelier experience."
										}),
										/* @__PURE__ */ jsx("p", {
											style: s.narrativeText,
											className: "prof-narrative-text",
											children: profileData.brand_narrative
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.subGrid,
											className: "prof-sub-grid",
											children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												style: s.subTitle,
												children: "Our Manifesto"
											}), /* @__PURE__ */ jsx("p", {
												style: s.subText,
												children: profileData.manifesto
											})] })
										})
									]
								})
							})]
						}),
						/* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								y: 30
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: { once: true },
							transition: { duration: .6 },
							style: s.productsSection,
							children: [
								/* @__PURE__ */ jsx("div", {
									style: {
										...s.sectionTitleBase,
										color: brandColor
									},
									children: "The Selection"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: s.productsHeader,
									className: "prof-products-header",
									children: [/* @__PURE__ */ jsx("h2", {
										style: s.productsTitle,
										children: "List of Items"
									}), /* @__PURE__ */ jsxs("a", {
										href: "/shop-brand",
										style: s.exploreLink,
										children: ["Explore Full Inventory ", /* @__PURE__ */ jsx(ArrowRight, { size: 14 })]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: s.productGrid,
									className: "prof-product-grid",
									children: [/* @__PURE__ */ jsx("div", {
										style: s.productMain,
										className: "prof-product-main"
									}), /* @__PURE__ */ jsxs("div", {
										style: s.productSubGrid,
										className: "prof-product-sub-grid",
										children: [
											/* @__PURE__ */ jsx("div", {
												style: {
													...s.productItemCard,
													gridColumn: "1 / span 2",
													backgroundImage: `url("${profileData.product_2_url}")`
												},
												className: "prof-product-item-card"
											}),
											/* @__PURE__ */ jsx("div", {
												style: {
													...s.productItemCard,
													backgroundImage: `url("${profileData.product_3_url}")`
												},
												className: "prof-product-item-card"
											}),
											/* @__PURE__ */ jsx("div", {
												style: {
													...s.productItemCard,
													backgroundImage: `url("${profileData.product_4_url}")`
												},
												className: "prof-product-item-card"
											})
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								scale: .98
							},
							whileInView: {
								opacity: 1,
								scale: 1
							},
							viewport: { once: true },
							transition: { duration: .6 },
							style: s.newsletterBox,
							className: "prof-newsletter",
							children: [
								/* @__PURE__ */ jsx("div", {
									style: {
										display: "inline-block",
										backgroundColor: secondaryColor,
										padding: "16px",
										borderRadius: "50%",
										marginBottom: "16px"
									},
									children: /* @__PURE__ */ jsx(Mail, {
										size: 24,
										color: brandColor
									})
								}),
								/* @__PURE__ */ jsx("h2", {
									style: s.newsletterTitle,
									children: "Feedback & Support"
								}),
								/* @__PURE__ */ jsx("p", {
									style: s.newsletterDesc,
									children: "We value your feedback. Let us know what you're enjoying or any issues you've encountered so we can improve our curation."
								}),
								/* @__PURE__ */ jsxs("form", {
									style: s.feedbackForm,
									className: "prof-newsletter-form",
									onSubmit: handleFeedbackSubmit,
									children: [
										/* @__PURE__ */ jsx("textarea", {
											placeholder: "What are you having issues with? Tell us about your experience...",
											style: s.feedbackTextarea,
											value: feedbackMsg,
											onChange: (e) => setFeedbackMsg(e.target.value),
											required: true
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												width: "100%",
												maxWidth: "400px"
											},
											children: /* @__PURE__ */ jsx("input", {
												type: "email",
												placeholder: "Your Email Address (Optional)",
												style: s.feedbackInput,
												value: userEmail,
												onChange: (e) => setUserEmail(e.target.value)
											})
										}),
										/* @__PURE__ */ jsx(motion.button, {
											whileHover: { scale: 1.02 },
											whileTap: { scale: .98 },
											type: "submit",
											disabled: isSubmitting,
											style: {
												...s.feedbackBtn,
												opacity: isSubmitting ? .7 : 1,
												backgroundColor: submitStatus === "success" ? "#10B981" : submitStatus === "error" ? "#EF4444" : brandColor,
												color: submitStatus ? "#FFF" : "#000"
											},
											className: "prof-newsletter-btn",
											children: isSubmitting ? "SENDING..." : submitStatus === "success" ? "SENT SUCCESSFULLY!" : submitStatus === "error" ? "FAILED TO SEND" : "Send Feedback"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: s.footer,
							className: "prof-footer",
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
										fontWeight: "bold",
										color: brandColor
									},
									children: profileData.brand_name
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
								className: "prof-footer-links",
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
			})
		]
	}) });
}
//#endregion
export { Profile as default };
