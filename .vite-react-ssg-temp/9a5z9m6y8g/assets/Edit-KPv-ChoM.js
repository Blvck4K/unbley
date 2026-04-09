import { n as motion, t as PageTransition } from "./PageTransition-8IvNPEDC.js";
import { n as supabase } from "./supabase-DvwDzIWb.js";
import { t as useAuth } from "./useAuth-BrrkS1Z-.js";
import { t as LayoutGrid } from "./layout-grid-w93TTKVH.js";
import { t as Link$1 } from "./link-G3uwavKY.js";
import { t as Lock } from "./lock-CymuCRJ1.js";
import { t as Menu } from "./menu-D_2kJXIR.js";
import { t as Plus } from "./plus-D-WcTC_J.js";
import { t as Settings } from "./settings-W1cIZsib.js";
import { t as User } from "./user-DXWgR_GV.js";
import { t as X } from "./x-C906TXTk.js";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/pages/Edit.jsx
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
function Edit() {
	const brandColor = "#06acf8ff";
	const { user, refreshUser } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	window.innerWidth;
	const logoRef = useRef(null);
	const bannerRef = useRef(null);
	const p1Ref = useRef(null);
	const p2Ref = useRef(null);
	const p3Ref = useRef(null);
	const p4Ref = useRef(null);
	const [formData, setFormData] = useState({
		brand_name: "",
		owner_name: "",
		email_address: "",
		phone_number: "",
		brand_category: "",
		delivery_duration: "",
		brand_narrative: "",
		manifesto: "",
		country: "",
		state_province: "",
		city: "",
		postal_code: "",
		address_line_1: "",
		address_line_2: "",
		primary_color: "#0A0A0A",
		secondary_color: "#1A1A1A",
		accent_color: "#06acf8",
		logo_url: "",
		banner_url: "",
		product_1_url: "",
		product_2_url: "",
		product_3_url: "",
		product_4_url: "",
		instagram_url: "",
		twitter_url: "",
		facebook_url: "",
		tiktok_url: "",
		website_url: "",
		bank_name: "",
		account_number: "",
		account_name: "",
		paystack_subaccount_code: "",
		flutterwave_subaccount_code: ""
	});
	const [themeColors, setThemeColors] = useState({
		primary: "#0A0A0A",
		secondary: "#1A1A1A",
		accent: "#06acf8"
	});
	useEffect(() => {
		async function fetchProfile() {
			if (!user) return;
			try {
				const { data, error } = await supabase.from("brand_profiles").select("*").eq("id", user.id).single();
				let baseData = data;
				if (!baseData) {
					const md = user.user_metadata || {};
					baseData = {
						brand_name: md.full_name || "",
						owner_name: md.full_name || "",
						email_address: user.email || "",
						phone_number: md.phone || "",
						brand_category: md.category || ""
					};
				}
				const draftKey = `zizzystores_edit_draft_${user.id}`;
				const savedDraft = localStorage.getItem(draftKey);
				if (savedDraft) try {
					const draftData = JSON.parse(savedDraft);
					baseData = {
						...baseData,
						...draftData
					};
					console.log("Draft recovered from session memory.");
				} catch (e) {
					console.error("Draft corruption detected:", e);
				}
				setFormData((prev) => ({
					...prev,
					...baseData
				}));
				setThemeColors({
					primary: baseData.primary_color || "#0A0A0A",
					secondary: baseData.secondary_color || "#1A1A1A",
					accent: baseData.accent_color || "#06acf8"
				});
			} catch (err) {
				console.error("Error fetching profile:", err);
			}
		}
		const draftKey = `zizzystores_edit_draft_${user?.id}`;
		if (user && formData.brand_name) {
			const timeout = setTimeout(() => {
				localStorage.setItem(draftKey, JSON.stringify(formData));
			}, 1e3);
			return () => clearTimeout(timeout);
		}
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		fetchProfile();
		return () => window.removeEventListener("resize", handleResize);
	}, [user]);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};
	const handleColorChange = (colorName, value) => {
		setThemeColors((prev) => ({
			...prev,
			[colorName]: value
		}));
		setFormData((prev) => ({
			...prev,
			[`${colorName}_color`]: value
		}));
	};
	const handleFileUpload = async (e, fieldName) => {
		if (!e.target.files || e.target.files.length === 0) return;
		const file = e.target.files[0];
		setLoading(true);
		try {
			if (!user) throw new Error("Not authenticated");
			const fileExt = file.name.split(".").pop();
			const fileName = `${user.id}-${fieldName}-${Math.random()}.${fileExt}`;
			const filePath = `${user.id}/${fileName}`;
			const { error: uploadError } = await supabase.storage.from("brand-assets").upload(filePath, file);
			if (uploadError) throw uploadError;
			const { data } = supabase.storage.from("brand-assets").getPublicUrl(filePath);
			setFormData((prev) => ({
				...prev,
				[fieldName]: data.publicUrl
			}));
		} catch (error) {
			console.error("Error uploading image:", error.message);
			alert("Error uploading image: " + error.message);
		} finally {
			setLoading(false);
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (!user) throw new Error("Not authenticated");
			const { paystack_subaccount_code, flutterwave_subaccount_code, is_admin, ...updatableFormData } = formData;
			const payload = {
				...updatableFormData,
				id: user.id,
				profile_completed: true,
				updated_at: /* @__PURE__ */ new Date()
			};
			const { error: profileError } = await supabase.from("brand_profiles").upsert(payload, { onConflict: "id" });
			if (profileError) throw profileError;
			const { error: authError } = await supabase.auth.updateUser({ data: { profile_completed: true } });
			if (authError) throw authError;
			localStorage.removeItem(`zizzystores_edit_draft_${user.id}`);
			const latestIsAdmin = await refreshUser();
			alert("Profile updated successfully!");
			if (latestIsAdmin) {
				navigate("/dashboard");
				return;
			}
			if (formData.profile_completed) navigate("/dashboard");
			else navigate("/activation");
		} catch (err) {
			console.error(err);
			alert(err.message || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};
	const s = {
		page: {
			backgroundColor: "#0A0A0A",
			color: "#E5E5E5",
			height: isMobile ? "auto" : "100vh",
			minHeight: "100vh",
			display: "flex",
			fontFamily: "\"Inter\", sans-serif",
			overflow: isMobile ? "visible" : "hidden"
		},
		sidebar: {
			width: "280px",
			borderRight: "1px solid #1F1F1F",
			padding: "0",
			display: "flex",
			flexDirection: "column",
			flexShrink: 0
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
			backgroundColor: active ? "#111" : "transparent",
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
			backgroundColor: "#111"
		},
		userAvatar: {
			width: "40px",
			height: "40px",
			backgroundColor: "#333",
			overflow: "hidden",
			borderRadius: "50%"
		},
		main: {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			height: isMobile ? "auto" : "100vh",
			overflowY: isMobile ? "visible" : "auto"
		},
		editHeader: {
			padding: "60px 80px 40px",
			borderBottom: "1px solid #1F1F1F",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "flex-start"
		},
		headerTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "36px",
			color: "#FFF",
			fontWeight: "bold"
		},
		headerSubtitle: {
			fontSize: "14px",
			color: "#888",
			marginTop: "12px",
			maxWidth: "500px",
			lineHeight: "1.6"
		},
		saveBtn: {
			backgroundColor: brandColor,
			color: "#000",
			padding: "16px 32px",
			fontSize: "12px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			border: "none",
			cursor: "pointer",
			borderRadius: "4px",
			transition: "background-color 0.2s"
		},
		content: {
			padding: "60px 80px",
			display: "flex",
			flexDirection: "column",
			gap: "40px"
		},
		twoColLayout: {
			display: "grid",
			gridTemplateColumns: "minmax(0, 1.8fr) minmax(0, 1fr)",
			gap: "40px"
		},
		card: {
			backgroundColor: "#111",
			border: "1px solid #1F1F1F",
			padding: "40px",
			borderRadius: "8px"
		},
		cardTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "24px",
			color: "#FFF",
			marginBottom: "32px"
		},
		bannerBox: {
			position: "relative",
			height: "300px",
			backgroundColor: "#1A1A1A",
			borderRadius: "8px",
			overflow: "hidden",
			marginBottom: "40px",
			display: "flex",
			alignItems: "flex-end",
			padding: "24px",
			backgroundImage: formData.banner_url ? `url(${formData.banner_url})` : "linear-gradient(to right bottom, #112, #0A0A0A)",
			backgroundSize: "cover",
			backgroundPosition: "center"
		},
		bannerText: {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			fontSize: "72px",
			fontWeight: "bold",
			color: "rgba(255,255,255,0.05)",
			letterSpacing: "0.1em",
			pointerEvents: "none"
		},
		bannerBtn: {
			backgroundColor: "#000",
			border: "1px solid #333",
			color: "#FFF",
			padding: "10px 20px",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			cursor: "pointer",
			textTransform: "uppercase"
		},
		bannerInfo: {
			marginLeft: "auto",
			fontSize: "10px",
			color: "#666",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			textShadow: "0 1px 4px rgba(0,0,0,0.8)"
		},
		inputGroup: { marginBottom: "32px" },
		label: {
			display: "block",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: "#666",
			textTransform: "uppercase",
			marginBottom: "16px"
		},
		input: {
			width: "100%",
			backgroundColor: "transparent",
			border: "none",
			borderBottom: "1px solid #333",
			padding: "8px 0",
			color: "#FFF",
			fontSize: "16px",
			outline: "none",
			transition: "border-color 0.2s",
			"&:focus": { borderBottom: `1px solid ${brandColor}` }
		},
		textarea: {
			width: "100%",
			backgroundColor: "#0A0A0A",
			border: "1px solid #1F1F1F",
			padding: "20px",
			color: "#CCC",
			fontSize: "14px",
			outline: "none",
			minHeight: "120px",
			resize: "vertical",
			lineHeight: "1.6",
			borderRadius: "4px"
		},
		logoPreview: {
			width: "120px",
			height: "120px",
			backgroundColor: brandColor,
			margin: "0 auto 32px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			borderRadius: "16px",
			overflow: "hidden"
		},
		logoInitial: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "48px",
			color: "#000"
		},
		uploadBtn: {
			width: "100%",
			backgroundColor: "transparent",
			border: "1px solid #333",
			color: "#888",
			padding: "16px",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			cursor: "pointer",
			textTransform: "uppercase",
			transition: "all 0.2s",
			marginTop: "24px"
		},
		socialRow: {
			display: "flex",
			alignItems: "center",
			gap: "16px",
			borderBottom: "1px solid #1F1F1F",
			paddingBottom: "16px",
			marginBottom: "24px"
		},
		socialIcon: { color: "#666" },
		socialInputContainer: { flex: 1 },
		socialNetworkLabel: {
			fontSize: "10px",
			color: "#555",
			marginBottom: "4px",
			textTransform: "lowercase"
		},
		socialInput: {
			width: "100%",
			background: "transparent",
			border: "none",
			color: "#FFF",
			fontSize: "14px",
			outline: "none"
		},
		assistanceBox: {
			border: "1px solid #1F1F1F",
			backgroundColor: "#0D1110",
			padding: "32px",
			borderRadius: "8px"
		},
		assistanceTitle: {
			fontSize: "10px",
			fontWeight: "700",
			color: brandColor,
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			marginBottom: "16px"
		},
		assistanceText: {
			color: "#888",
			fontSize: "12px",
			lineHeight: "1.6",
			marginBottom: "24px"
		},
		assistanceLink: {
			color: "#FFF",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			textDecoration: "none",
			display: "flex",
			alignItems: "center",
			gap: "8px"
		},
		productGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(4, 1fr)",
			gap: "24px",
			marginTop: "32px"
		},
		productSquare: {
			aspectRatio: "1",
			backgroundColor: "#111",
			border: "1px solid #1F1F1F",
			borderRadius: "8px",
			overflow: "hidden",
			position: "relative",
			cursor: "pointer",
			transition: "border-color 0.2s",
			"&:hover": { borderColor: "#666" }
		},
		productImage: {
			width: "100%",
			height: "100%",
			objectFit: "cover",
			opacity: 1
		},
		productEmpty: {
			aspectRatio: "1",
			border: "1px dashed #333",
			borderRadius: "8px",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			gap: "16px",
			cursor: "pointer",
			transition: "border-color 0.2s",
			"&:hover": { borderColor: "#666" }
		}
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		className: "edit-page",
		children: [
			/* @__PURE__ */ jsx("style", { children: `
          @media (max-width: 768px) {
            .edit-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
            .edit-sidebar { 
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
            .edit-overlay {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background-color: rgba(0,0,0,0.7) !important;
              z-index: 999 !important;
              display: ${isSidebarOpen ? "block" : "none"} !important;
            }
            .edit-logo-container { padding: 24px !important; }
            .edit-nav { display: flex; flex-direction: column !important; overflow-y: auto !important; }
            .edit-nav a, .edit-nav div { border-left: 3px solid transparent !important; border-bottom: none !important; padding: 16px 40px !important; font-size: 14px !important; }
            .edit-user-profile { display: flex !important; margin-top: auto; }
            
            .edit-header { padding: 24px !important; flex-direction: column; gap: 20px; position: sticky; top: 0; background: #0A0A0A; z-index: 100; border-bottom: 1px solid #1F1F1F; align-items: flex-start !important; }
            .edit-header-title-box { order: 2; width: 100%; }
            .edit-header h1 { font-size: 28px !important; margin-bottom: 8px !important; }
            .edit-header p { font-size: 12px !important; margin-top: 4px !important; }
            .edit-save-btn { width: 100%; order: 3; padding: 14px !important; }
            .edit-menu-btn { order: 1; }
            
            .edit-content { padding: 20px !important; gap: 32px !important; }
            .edit-two-col { grid-template-columns: 1fr !important; gap: 32px !important; }
            
            .edit-banner-box { padding: 32px 20px !important; flex-direction: column; align-items: center; justify-content: center; gap: 20px; height: auto !important; min-height: 240px; }
            .edit-banner-text { font-size: 44px !important; opacity: 0.1 !important; transform: translate(-50%, -50%) !important; }
            .edit-banner-info { margin-left: 0 !important; text-align: center; }
            
            .edit-card { padding: 24px 20px !important; }
            .edit-card-title { font-size: 20px !important; margin-bottom: 24px !important; }
            .edit-input-grid { grid-template-columns: 1fr !important; gap: 24px !important; margin-bottom: 24px !important; }
            .edit-color-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
            
            .edit-product-grid { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
            .mobile-only { display: block !important; }
          }
          @media (min-width: 769px) {
            .mobile-only { display: none !important; }
          }
        ` }),
			/* @__PURE__ */ jsx("input", {
				type: "file",
				ref: logoRef,
				style: { display: "none" },
				accept: "image/*",
				onChange: (e) => handleFileUpload(e, "logo_url")
			}),
			/* @__PURE__ */ jsx("input", {
				type: "file",
				ref: bannerRef,
				style: { display: "none" },
				accept: "image/*",
				onChange: (e) => handleFileUpload(e, "banner_url")
			}),
			/* @__PURE__ */ jsx("input", {
				type: "file",
				ref: p1Ref,
				style: { display: "none" },
				accept: "image/*",
				onChange: (e) => handleFileUpload(e, "product_1_url")
			}),
			/* @__PURE__ */ jsx("input", {
				type: "file",
				ref: p2Ref,
				style: { display: "none" },
				accept: "image/*",
				onChange: (e) => handleFileUpload(e, "product_2_url")
			}),
			/* @__PURE__ */ jsx("input", {
				type: "file",
				ref: p3Ref,
				style: { display: "none" },
				accept: "image/*",
				onChange: (e) => handleFileUpload(e, "product_3_url")
			}),
			/* @__PURE__ */ jsx("input", {
				type: "file",
				ref: p4Ref,
				style: { display: "none" },
				accept: "image/*",
				onChange: (e) => handleFileUpload(e, "product_4_url")
			}),
			/* @__PURE__ */ jsx("div", {
				className: "edit-overlay",
				onClick: () => setIsSidebarOpen(false)
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.sidebar,
				className: "edit-sidebar",
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							...s.logoContainer,
							position: "relative"
						},
						className: "edit-logo-container",
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
						className: "edit-nav",
						children: [
							formData.profile_completed ? /* @__PURE__ */ jsxs(Link, {
								to: "/dashboard",
								style: s.navItem(false),
								children: [/* @__PURE__ */ jsx(LayoutGrid, { size: 16 }), " Overview"]
							}) : /* @__PURE__ */ jsxs("div", {
								style: {
									...s.navItem(false),
									opacity: .5,
									cursor: "not-allowed"
								},
								title: "Complete your profile first",
								children: [
									/* @__PURE__ */ jsx(LayoutGrid, { size: 16 }),
									" Overview ",
									/* @__PURE__ */ jsx(Lock, {
										size: 12,
										style: { marginLeft: "auto" }
									})
								]
							}),
							formData.profile_completed ? /* @__PURE__ */ jsxs(Link, {
								to: "/profile",
								style: s.navItem(false),
								children: [/* @__PURE__ */ jsx(User, { size: 16 }), " Profile"]
							}) : /* @__PURE__ */ jsxs("div", {
								style: {
									...s.navItem(false),
									opacity: .5,
									cursor: "not-allowed"
								},
								title: "Complete your profile first",
								children: [
									/* @__PURE__ */ jsx(User, { size: 16 }),
									" Profile ",
									/* @__PURE__ */ jsx(Lock, {
										size: 12,
										style: { marginLeft: "auto" }
									})
								]
							}),
							/* @__PURE__ */ jsxs(Link, {
								to: "/edit",
								style: s.navItem(true),
								children: [/* @__PURE__ */ jsx(Settings, { size: 16 }), " Edit"]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.userProfile,
						className: "edit-user-profile",
						children: [/* @__PURE__ */ jsx("div", {
							style: s.userAvatar,
							children: formData.logo_url ? /* @__PURE__ */ jsx("img", {
								src: formData.logo_url,
								alt: formData.owner_name,
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							}) : /* @__PURE__ */ jsx("span", {
								style: {
									color: "#FFF",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									height: "100%"
								},
								children: formData.owner_name?.charAt(0)?.toUpperCase() || "U"
							})
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "12px",
								fontWeight: "700",
								color: "#FFF",
								letterSpacing: "0.05em",
								textTransform: "uppercase"
							},
							children: formData.owner_name || "User"
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
			/* @__PURE__ */ jsx("div", {
				style: s.main,
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					children: [/* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .5 },
						style: s.editHeader,
						className: "edit-header",
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
								type: "button",
								children: /* @__PURE__ */ jsx(Menu, { size: 24 })
							}), /* @__PURE__ */ jsxs("div", {
								className: "edit-header-title-box",
								children: [/* @__PURE__ */ jsx("h1", {
									style: s.headerTitle,
									children: "Brand Profile"
								}), /* @__PURE__ */ jsx("p", {
									style: s.headerSubtitle,
									children: "Curate your digital atelier. The narrative you build here defines the prestige of your collections."
								})]
							})]
						}), /* @__PURE__ */ jsx(motion.button, {
							whileHover: { scale: 1.02 },
							whileTap: { scale: .98 },
							type: "submit",
							disabled: loading,
							style: {
								...s.saveBtn,
								opacity: loading ? .7 : 1
							},
							className: "edit-save-btn",
							children: loading ? "SAVING..." : "Save Changes"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: s.content,
						className: "edit-content",
						children: [/* @__PURE__ */ jsxs("div", {
							style: s.twoColLayout,
							className: "edit-two-col",
							children: [/* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									x: -20
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: { duration: .6 },
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: s.bannerBox,
										className: "edit-banner-box",
										children: [
											/* @__PURE__ */ jsx("div", {
												style: s.bannerText,
												className: "edit-banner-text",
												children: "BRAND"
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												style: s.bannerBtn,
												onClick: () => bannerRef.current?.click(),
												children: loading ? "UPLOADING..." : "Change Banner"
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.bannerInfo,
												className: "edit-banner-info",
												children: "Recommended: 2400x800px"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.card,
										className: "edit-card",
										children: [
											/* @__PURE__ */ jsx("h2", {
												style: s.cardTitle,
												children: "Core Identity"
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													display: "grid",
													gridTemplateColumns: "1fr 1fr",
													gap: "32px 48px",
													marginBottom: "40px"
												},
												className: "edit-input-grid",
												children: [
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Brand Name"
														}), /* @__PURE__ */ jsx("input", {
															type: "text",
															name: "brand_name",
															value: formData.brand_name,
															onChange: handleChange,
															style: s.input,
															required: true
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Owner Name"
														}), /* @__PURE__ */ jsx("input", {
															type: "text",
															name: "owner_name",
															value: formData.owner_name,
															onChange: handleChange,
															style: s.input,
															required: true
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Email Address"
														}), /* @__PURE__ */ jsx("input", {
															type: "email",
															name: "email_address",
															value: formData.email_address,
															onChange: handleChange,
															style: s.input,
															required: true
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Phone Number"
														}), /* @__PURE__ */ jsx("input", {
															type: "tel",
															name: "phone_number",
															value: formData.phone_number,
															onChange: handleChange,
															style: s.input,
															required: true
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Brand Category"
														}), /* @__PURE__ */ jsx("input", {
															type: "text",
															name: "brand_category",
															value: formData.brand_category,
															onChange: handleChange,
															style: s.input,
															required: true
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Delivery Duration"
														}), /* @__PURE__ */ jsx("input", {
															type: "text",
															name: "delivery_duration",
															value: formData.delivery_duration,
															onChange: handleChange,
															style: s.input,
															required: true
														})]
													})
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.inputGroup,
												children: [/* @__PURE__ */ jsx("label", {
													style: s.label,
													children: "Brand Narrative"
												}), /* @__PURE__ */ jsx("textarea", {
													name: "brand_narrative",
													value: formData.brand_narrative,
													onChange: handleChange,
													style: s.textarea,
													required: true
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.inputGroup,
												children: [/* @__PURE__ */ jsx("label", {
													style: s.label,
													children: "Manifesto"
												}), /* @__PURE__ */ jsx("textarea", {
													name: "manifesto",
													value: formData.manifesto,
													onChange: handleChange,
													style: s.textarea,
													required: true
												})]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											...s.card,
											marginTop: "40px"
										},
										className: "edit-card",
										children: [
											/* @__PURE__ */ jsx("h2", {
												style: s.cardTitle,
												children: "Geography & Location"
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													display: "grid",
													gridTemplateColumns: "1fr 1fr",
													gap: "32px 48px",
													marginBottom: "32px"
												},
												className: "edit-input-grid",
												children: [
													/* @__PURE__ */ jsxs("div", {
														style: {
															...s.inputGroup,
															marginBottom: 0
														},
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Country"
														}), /* @__PURE__ */ jsx("input", {
															type: "text",
															name: "country",
															value: formData.country,
															onChange: handleChange,
															style: s.input,
															required: true
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: {
															...s.inputGroup,
															marginBottom: 0
														},
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "State / Province"
														}), /* @__PURE__ */ jsx("input", {
															type: "text",
															name: "state_province",
															value: formData.state_province,
															onChange: handleChange,
															style: s.input,
															required: true
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: {
															...s.inputGroup,
															marginBottom: 0
														},
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "City"
														}), /* @__PURE__ */ jsx("input", {
															type: "text",
															name: "city",
															value: formData.city,
															onChange: handleChange,
															style: s.input,
															required: true
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: {
															...s.inputGroup,
															marginBottom: 0
														},
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Postal Code"
														}), /* @__PURE__ */ jsx("input", {
															type: "text",
															name: "postal_code",
															value: formData.postal_code,
															onChange: handleChange,
															style: s.input,
															required: true
														})]
													})
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.inputGroup,
												children: [/* @__PURE__ */ jsx("label", {
													style: s.label,
													children: "Address Line 1"
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													name: "address_line_1",
													value: formData.address_line_1,
													onChange: handleChange,
													style: s.input,
													required: true
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													...s.inputGroup,
													marginBottom: 0
												},
												children: [/* @__PURE__ */ jsx("label", {
													style: s.label,
													children: "Address Line 2 (Optional)"
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													name: "address_line_2",
													value: formData.address_line_2,
													onChange: handleChange,
													style: s.input
												})]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											...s.card,
											marginTop: "40px"
										},
										className: "edit-card",
										children: [
											/* @__PURE__ */ jsx("h2", {
												style: s.cardTitle,
												children: "Brand Theme"
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													display: "grid",
													gridTemplateColumns: "repeat(3, 1fr)",
													gap: "24px"
												},
												className: "edit-color-grid",
												children: [
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Primary"
														}), /* @__PURE__ */ jsxs("div", {
															style: {
																display: "flex",
																flexDirection: "column",
																gap: "12px"
															},
															children: [/* @__PURE__ */ jsx("input", {
																type: "color",
																value: themeColors.primary,
																onChange: (e) => handleColorChange("primary", e.target.value),
																style: {
																	width: "100%",
																	height: "80px",
																	padding: 0,
																	border: "1px solid #333",
																	backgroundColor: "transparent",
																	cursor: "pointer",
																	borderRadius: "4px"
																}
															}), /* @__PURE__ */ jsx("div", {
																style: {
																	fontSize: "12px",
																	color: "#FFF",
																	fontFamily: "monospace"
																},
																children: themeColors.primary
															})]
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Secondary"
														}), /* @__PURE__ */ jsxs("div", {
															style: {
																display: "flex",
																flexDirection: "column",
																gap: "12px"
															},
															children: [/* @__PURE__ */ jsx("input", {
																type: "color",
																value: themeColors.secondary,
																onChange: (e) => handleColorChange("secondary", e.target.value),
																style: {
																	width: "100%",
																	height: "80px",
																	padding: 0,
																	border: "1px solid #333",
																	backgroundColor: "transparent",
																	cursor: "pointer",
																	borderRadius: "4px"
																}
															}), /* @__PURE__ */ jsx("div", {
																style: {
																	fontSize: "12px",
																	color: "#FFF",
																	fontFamily: "monospace"
																},
																children: themeColors.secondary
															})]
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "Accent"
														}), /* @__PURE__ */ jsxs("div", {
															style: {
																display: "flex",
																flexDirection: "column",
																gap: "12px"
															},
															children: [/* @__PURE__ */ jsx("input", {
																type: "color",
																value: themeColors.accent,
																onChange: (e) => handleColorChange("accent", e.target.value),
																style: {
																	width: "100%",
																	height: "80px",
																	padding: 0,
																	border: "1px solid #333",
																	backgroundColor: "transparent",
																	cursor: "pointer",
																	borderRadius: "4px"
																}
															}), /* @__PURE__ */ jsx("div", {
																style: {
																	fontSize: "12px",
																	color: "#FFF",
																	fontFamily: "monospace"
																},
																children: themeColors.accent
															})]
														})]
													})
												]
											}),
											/* @__PURE__ */ jsx("p", {
												style: {
													fontSize: "10px",
													color: "#555",
													marginTop: "16px"
												},
												children: "These colors define your storefront's character. Use them sparingly but with intent."
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											...s.card,
											marginTop: "40px"
										},
										className: "edit-card",
										children: [
											/* @__PURE__ */ jsx("h2", {
												style: s.cardTitle,
												children: "Personal Settlement Account"
											}),
											/* @__PURE__ */ jsx("p", {
												style: {
													fontSize: "12px",
													color: "#888",
													marginBottom: "32px"
												},
												children: "Backup account for manual payouts and internal reference."
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													display: "grid",
													gridTemplateColumns: "1fr 1fr",
													gap: "32px 48px"
												},
												className: "edit-input-grid",
												children: [/* @__PURE__ */ jsxs("div", {
													style: s.inputGroup,
													children: [/* @__PURE__ */ jsx("label", {
														style: s.label,
														children: "Bank Name"
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														name: "bank_name",
														value: formData.bank_name,
														onChange: handleChange,
														style: s.input
													})]
												}), /* @__PURE__ */ jsxs("div", {
													style: s.inputGroup,
													children: [/* @__PURE__ */ jsx("label", {
														style: s.label,
														children: "Account Number"
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														name: "account_number",
														value: formData.account_number,
														onChange: handleChange,
														style: s.input
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													...s.inputGroup,
													marginTop: "32px"
												},
												children: [/* @__PURE__ */ jsx("label", {
													style: s.label,
													children: "Account Name"
												}), /* @__PURE__ */ jsx("input", {
													type: "text",
													name: "account_name",
													value: formData.account_name,
													onChange: handleChange,
													style: s.input
												})]
											})
										]
									})
								]
							}), /* @__PURE__ */ jsxs(motion.div, {
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
									delay: .2
								},
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "40px"
								},
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: s.card,
										className: "edit-card",
										children: [
											/* @__PURE__ */ jsx("label", {
												style: {
													...s.label,
													marginBottom: "40px"
												},
												children: "Brand Logo"
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.logoPreview,
												children: formData.logo_url ? /* @__PURE__ */ jsx("img", {
													src: formData.logo_url,
													alt: "Logo",
													style: {
														width: "100%",
														height: "100%",
														objectFit: "cover"
													}
												}) : /* @__PURE__ */ jsx("span", {
													style: s.logoInitial,
													children: formData.brand_name?.charAt(0)?.toUpperCase() || "Z"
												})
											}),
											/* @__PURE__ */ jsx("p", {
												style: {
													fontSize: "10px",
													color: "#888",
													textAlign: "center",
													lineHeight: "1.6",
													padding: "0 20px"
												},
												children: "Upload a high-resolution SVG or PNG. 1:1 ratio required."
											}),
											/* @__PURE__ */ jsx("button", {
												type: "button",
												style: s.uploadBtn,
												onClick: () => logoRef.current?.click(),
												children: loading ? "UPLOADING..." : "Upload New Logo"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.card,
										className: "edit-card",
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "8px",
												marginBottom: "32px"
											},
											children: [/* @__PURE__ */ jsx(Lock, {
												size: 14,
												color: "#666"
											}), /* @__PURE__ */ jsx("label", {
												style: {
													...s.label,
													marginBottom: 0
												},
												children: "Payout Configuration"
											})]
										}), /* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												gap: "20px"
											},
											children: [
												/* @__PURE__ */ jsxs("div", {
													style: s.inputGroup,
													children: [/* @__PURE__ */ jsx("div", {
														style: {
															fontSize: "10px",
															color: "#666",
															textTransform: "uppercase",
															letterSpacing: "0.05em",
															marginBottom: "8px"
														},
														children: "Paystack Subaccount (Local)"
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														value: formData.paystack_subaccount_code || "Not Configured",
														style: {
															...s.input,
															backgroundColor: "#161616",
															color: formData.paystack_subaccount_code ? "#FFF" : "#444",
															cursor: "not-allowed"
														},
														readOnly: true
													})]
												}),
												/* @__PURE__ */ jsxs("div", {
													style: s.inputGroup,
													children: [/* @__PURE__ */ jsx("div", {
														style: {
															fontSize: "10px",
															color: "#666",
															textTransform: "uppercase",
															letterSpacing: "0.05em",
															marginBottom: "8px"
														},
														children: "Flutterwave Subaccount (International)"
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														value: formData.flutterwave_subaccount_code || "Not Configured",
														style: {
															...s.input,
															backgroundColor: "#161616",
															color: formData.flutterwave_subaccount_code ? "#FFF" : "#444",
															cursor: "not-allowed"
														},
														readOnly: true
													})]
												}),
												/* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "10px",
														color: "#555",
														marginTop: "8px",
														lineHeight: "1.4"
													},
													children: "These identifiers are managed by the platform administrator to ensure secure revenue routing. Contact support to update your payout destination."
												})
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.card,
										className: "edit-card",
										children: [
											/* @__PURE__ */ jsx("label", {
												style: {
													...s.label,
													marginBottom: "32px"
												},
												children: "Social Handles"
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.socialRow,
												children: [/* @__PURE__ */ jsx("div", {
													style: s.socialIcon,
													children: /* @__PURE__ */ jsx(InstagramIcon, {})
												}), /* @__PURE__ */ jsxs("div", {
													style: s.socialInputContainer,
													children: [/* @__PURE__ */ jsx("div", {
														style: s.socialNetworkLabel,
														children: "instagram profile url"
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														name: "instagram_url",
														value: formData.instagram_url,
														onChange: handleChange,
														placeholder: "https://instagram.com/zizzystores",
														style: s.socialInput
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.socialRow,
												children: [/* @__PURE__ */ jsx("div", {
													style: s.socialIcon,
													children: /* @__PURE__ */ jsx(TwitterIcon, {})
												}), /* @__PURE__ */ jsxs("div", {
													style: s.socialInputContainer,
													children: [/* @__PURE__ */ jsx("div", {
														style: s.socialNetworkLabel,
														children: "x (twitter) profile url"
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														name: "twitter_url",
														value: formData.twitter_url,
														onChange: handleChange,
														placeholder: "https://x.com/zizzystores",
														style: s.socialInput
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.socialRow,
												children: [/* @__PURE__ */ jsx("div", {
													style: s.socialIcon,
													children: /* @__PURE__ */ jsx(FacebookIcon, {})
												}), /* @__PURE__ */ jsxs("div", {
													style: s.socialInputContainer,
													children: [/* @__PURE__ */ jsx("div", {
														style: s.socialNetworkLabel,
														children: "facebook page url"
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														name: "facebook_url",
														value: formData.facebook_url,
														onChange: handleChange,
														placeholder: "https://facebook.com/zizzystores",
														style: s.socialInput
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.socialRow,
												children: [/* @__PURE__ */ jsx("div", {
													style: s.socialIcon,
													children: /* @__PURE__ */ jsx(TikTokIcon, {})
												}), /* @__PURE__ */ jsxs("div", {
													style: s.socialInputContainer,
													children: [/* @__PURE__ */ jsx("div", {
														style: s.socialNetworkLabel,
														children: "tiktok profile url"
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														name: "tiktok_url",
														value: formData.tiktok_url,
														onChange: handleChange,
														placeholder: "https://tiktok.com/@zizzystores",
														style: s.socialInput
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													...s.socialRow,
													borderBottom: "none",
													paddingBottom: 0,
													marginBottom: 0
												},
												children: [/* @__PURE__ */ jsx("div", {
													style: s.socialIcon,
													children: /* @__PURE__ */ jsx(Link$1, { size: 14 })
												}), /* @__PURE__ */ jsxs("div", {
													style: s.socialInputContainer,
													children: [/* @__PURE__ */ jsx("div", {
														style: s.socialNetworkLabel,
														children: "website"
													}), /* @__PURE__ */ jsx("input", {
														type: "text",
														name: "website_url",
														value: formData.website_url,
														onChange: handleChange,
														placeholder: "www.zizzystores.com",
														style: s.socialInput
													})]
												})]
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ jsxs(motion.div, {
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
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									borderTop: "1px solid #1F1F1F",
									paddingTop: "40px",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-end"
								},
								children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
									style: {
										fontFamily: "\"Playfair Display\", serif",
										fontSize: "24px",
										color: "#FFF",
										marginBottom: "8px"
									},
									children: "Product Showcase"
								}), /* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "12px",
										color: "#888"
									},
									children: "Select 4 primary items for your landing gallery."
								})] })
							}), /* @__PURE__ */ jsx("div", {
								style: s.productGrid,
								className: "edit-product-grid",
								children: [
									1,
									2,
									3,
									4
								].map((idx) => {
									const field = `product_${idx}_url`;
									const ref = [
										null,
										p1Ref,
										p2Ref,
										p3Ref,
										p4Ref
									][idx];
									return /* @__PURE__ */ jsx(motion.div, {
										whileHover: { scale: 1.02 },
										whileTap: { scale: .98 },
										style: formData[field] ? s.productSquare : s.productEmpty,
										onClick: () => ref.current?.click(),
										children: formData[field] ? /* @__PURE__ */ jsx("img", {
											src: formData[field],
											alt: `Product ${idx}`,
											style: s.productImage
										}) : /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
											style: {
												width: "32px",
												height: "32px",
												borderRadius: "50%",
												backgroundColor: "#FFF",
												display: "flex",
												alignItems: "center",
												justifyContent: "center"
											},
											children: /* @__PURE__ */ jsx(Plus, {
												size: 16,
												color: "#000000"
											})
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: "700",
												letterSpacing: "0.1em",
												color: "#888888",
												textTransform: "uppercase"
											},
											children: "Select Item"
										})] })
									}, idx);
								})
							})]
						})]
					})]
				})
			})
		]
	}) });
}
//#endregion
export { Edit as default };
