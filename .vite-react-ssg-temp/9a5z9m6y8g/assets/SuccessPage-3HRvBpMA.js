import { n as motion, t as PageTransition } from "./PageTransition-8IvNPEDC.js";
import { n as supabase } from "./supabase-DvwDzIWb.js";
import { t as useAuth } from "./useAuth-BrrkS1Z-.js";
import { t as Check } from "./check-D3iwqrrA.js";
import { t as Download } from "./download-CL5SL3SS.js";
import { t as LayoutDashboard } from "./layout-dashboard-zaRWgB4V.js";
import { t as ShieldCheck } from "./shield-check-ClSEqKJ8.js";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/pages/SuccessPage.jsx
function SuccessPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [realState, setRealState] = useState({
		reference: location.state?.reference || "...",
		amount: typeof location.state?.amount === "number" ? location.state.amount : 3e4,
		email: location.state?.email || user?.email || "admin@zizzystores.com",
		brandName: location.state?.brandName || user?.user_metadata?.brand_name || "Premium Zizzystores Vendor",
		method: location.state?.method || "paystack",
		currency: location.state?.currency || "NGN"
	});
	useEffect(() => {
		async function verifyRealtimeData() {
			if (!user) return;
			if (!location.state?.reference || realState.reference === "...") try {
				const { data, error } = await supabase.from("brand_profiles").select("last_transaction_id, brand_name, email_address").eq("id", user.id).single();
				if (data && data.last_transaction_id) setRealState((prev) => ({
					...prev,
					reference: data.last_transaction_id,
					brandName: data.brand_name || prev.brandName,
					email: data.email_address || prev.email
				}));
			} catch (err) {
				console.error("Failed to recover transaction context:", err);
			}
		}
		verifyRealtimeData();
	}, [user, location.state]);
	const { reference, amount, email, brandName } = realState;
	const brandColor = "#06acf8";
	const successColor = "#10B981";
	const s = {
		page: {
			backgroundColor: "#050505",
			color: "#FFF",
			minHeight: "100vh",
			fontFamily: "\"Inter\", sans-serif",
			display: "flex",
			flexDirection: "column",
			paddingBottom: "64px"
		},
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "24px 48px",
			borderBottom: "1px solid #1A1A1A"
		},
		logo: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "20px",
			fontWeight: "700",
			letterSpacing: "0.05em",
			color: brandColor,
			textTransform: "uppercase"
		},
		secureBadgeHeader: {
			display: "flex",
			alignItems: "center",
			gap: "8px",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.2em",
			color: "#666",
			textTransform: "uppercase"
		},
		container: {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			padding: "64px 24px 0",
			maxWidth: "800px",
			margin: "0 auto",
			width: "100%",
			boxSizing: "border-box"
		},
		iconBox: {
			width: "64px",
			height: "64px",
			backgroundColor: "rgba(16, 185, 129, 0.15)",
			borderRadius: "16px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			marginBottom: "32px"
		},
		title: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "36px",
			fontWeight: "600",
			marginBottom: "16px",
			textAlign: "center"
		},
		subtitle: {
			color: "#888",
			fontSize: "14px",
			lineHeight: "1.6",
			textAlign: "center",
			maxWidth: "400px",
			marginBottom: "48px"
		},
		card: {
			backgroundColor: "#111",
			border: "1px solid #222",
			borderRadius: "8px",
			width: "100%",
			padding: "32px",
			position: "relative",
			overflow: "hidden",
			marginBottom: "48px"
		},
		glowLine: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			height: "2px",
			background: `linear-gradient(90deg, transparent, ${successColor}, transparent)`
		},
		flexRow: {
			display: "flex",
			justifyContent: "space-between",
			flexWrap: "wrap",
			gap: "24px"
		},
		infoBlock: {
			display: "flex",
			flexDirection: "column",
			gap: "8px"
		},
		label: {
			fontSize: "10px",
			fontWeight: "700",
			color: "#666",
			letterSpacing: "0.1em",
			textTransform: "uppercase"
		},
		value: {
			fontSize: "16px",
			fontWeight: "600",
			color: "#FFF"
		},
		valueLarge: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "28px",
			fontWeight: "700",
			color: "#FFF"
		},
		badge: {
			backgroundColor: "rgba(16, 185, 129, 0.1)",
			color: successColor,
			padding: "6px 12px",
			borderRadius: "4px",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.05em",
			display: "inline-flex",
			alignItems: "center",
			gap: "6px"
		},
		divider: {
			height: "1px",
			backgroundColor: "#222",
			margin: "32px 0"
		},
		actionsLabel: {
			alignSelf: "flex-start",
			fontSize: "14px",
			fontWeight: "600",
			marginBottom: "24px"
		},
		stepsGrid: {
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
			gap: "24px",
			width: "100%",
			marginBottom: "48px"
		},
		stepCard: {
			backgroundColor: "#0A0A0A",
			border: "1px solid #1A1A1A",
			borderRadius: "8px",
			padding: "24px",
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			gap: "16px"
		},
		stepIconBox: {
			width: "32px",
			height: "32px",
			backgroundColor: "rgba(6, 172, 248, 0.1)",
			borderRadius: "8px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: brandColor
		},
		stepTitle: {
			fontSize: "14px",
			fontWeight: "600",
			color: "#FFF"
		},
		stepDesc: {
			fontSize: "12px",
			color: "#888",
			lineHeight: "1.5",
			marginBottom: "8px"
		},
		stepLink: {
			fontSize: "11px",
			fontWeight: "700",
			color: brandColor,
			letterSpacing: "0.05em",
			textTransform: "uppercase",
			textDecoration: "none",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			gap: "4px"
		},
		bottomActions: {
			display: "flex",
			gap: "16px",
			width: "100%",
			justifyContent: "center",
			marginTop: "16px",
			flexWrap: "wrap"
		},
		btnPrimary: {
			backgroundColor: brandColor,
			color: "#000",
			border: "none",
			borderRadius: "4px",
			padding: "16px 32px",
			fontSize: "13px",
			fontWeight: "700",
			letterSpacing: "0.05em",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			transition: "opacity 0.2s"
		},
		btnSecondary: {
			backgroundColor: "#111",
			color: "#FFF",
			border: "1px solid #333",
			borderRadius: "4px",
			padding: "16px 32px",
			fontSize: "13px",
			fontWeight: "600",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			transition: "background-color 0.2s"
		}
	};
	const handleDownloadReceipt = () => {
		const currencySign = realState.currency === "USD" ? "$" : "₦";
		const currencyCode = realState.currency === "USD" ? "USD" : "NGN";
		const receiptContent = `
========================================
         ZIZZYSTORES RECEIPT
========================================

STORE NAME:   ${brandName}
EMAIL:        ${email}
STATUS:       ACTIVATION SUCCESSFUL
AMOUNT PAID:  ${currencySign}${(amount || 0).toLocaleString(void 0, { minimumFractionDigits: realState.currency === "USD" ? 2 : 0 })} (${currencyCode})
PAYMENT GATEWAY: ${realState.method === "flutterwave" ? "Flutterwave" : "Paystack"}

TRANSACTION:  ${reference}
DATE:         ${(/* @__PURE__ */ new Date()).toLocaleString()}

----------------------------------------
Thank you for joining Zizzystores.
Your digital atelier is securely activated.
========================================
`;
		const blob = new Blob([receiptContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `Zizzystores-Receipt-${reference}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		className: "success-page",
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .success-page-header { padding: 20px 24px !important; }
          .success-page-container { padding: 48px 24px 0 !important; }
          .success-title { font-size: 28px !important; }
          .success-subtitle { font-size: 13px !important; margin-bottom: 32px !important; }
          .success-flex-row { flex-direction: column !important; gap: 24px !important; }
          .success-info-block { width: 100% !important; text-align: center; }
          .success-badge { justify-content: center !important; }
          .success-bottom-actions { flex-direction: column !important; width: 100% !important; gap: 12px !important; }
          .success-bottom-actions button { width: 100% !important; justify-content: center !important; padding: 18px !important; }
        }
        .btn-hover:hover { opacity: 0.9; }
        .btn-sec-hover:hover { background-color: #222 !important; }
      ` }),
			/* @__PURE__ */ jsxs("header", {
				style: s.header,
				className: "success-page-header",
				children: [/* @__PURE__ */ jsx("div", {
					style: s.logo,
					children: "Zizzystores."
				}), /* @__PURE__ */ jsxs("div", {
					style: s.secureBadgeHeader,
					children: ["PAYMENT SECURE ", /* @__PURE__ */ jsx(ShieldCheck, {
						size: 14,
						color: successColor
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("main", {
				style: s.container,
				className: "success-page-container",
				children: [
					/* @__PURE__ */ jsx(motion.div, {
						initial: {
							scale: 0,
							rotate: -180
						},
						animate: {
							scale: 1,
							rotate: 0
						},
						transition: {
							type: "spring",
							stiffness: 260,
							damping: 20,
							delay: .1
						},
						style: s.iconBox,
						children: /* @__PURE__ */ jsx(Check, {
							size: 32,
							color: successColor,
							strokeWidth: 3
						})
					}),
					/* @__PURE__ */ jsx(motion.h1, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: .3 },
						style: s.title,
						children: "Payment Successful"
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
						transition: { delay: .4 },
						style: s.subtitle,
						children: "Your store activation is complete. The digital capabilities have been securely unlocked and assigned to your account."
					}),
					/* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 40
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							delay: .5,
							duration: .8,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						style: s.card,
						children: [
							/* @__PURE__ */ jsx("div", { style: s.glowLine }),
							/* @__PURE__ */ jsxs("div", {
								style: s.flexRow,
								className: "success-flex-row",
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										...s.infoBlock,
										flex: "1 1 auto"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: s.label,
										children: "ACTIVATED STORE"
									}), /* @__PURE__ */ jsx("div", {
										style: s.value,
										children: brandName
									})]
								}), /* @__PURE__ */ jsx("div", {
									style: { alignSelf: "center" },
									children: /* @__PURE__ */ jsxs("div", {
										style: s.badge,
										children: [/* @__PURE__ */ jsx(Check, {
											size: 12,
											strokeWidth: 3
										}), " VERIFIED ASSET"]
									})
								})]
							}),
							/* @__PURE__ */ jsx("div", { style: s.divider }),
							/* @__PURE__ */ jsxs("div", {
								style: s.flexRow,
								className: "success-flex-row",
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										...s.infoBlock,
										minWidth: "150px"
									},
									children: [
										/* @__PURE__ */ jsx("div", {
											style: s.label,
											children: "AMOUNT PAID"
										}),
										/* @__PURE__ */ jsxs("div", {
											style: s.valueLarge,
											children: [realState.currency === "USD" ? "$" : "₦", (amount || 0).toLocaleString(void 0, { minimumFractionDigits: realState.currency === "USD" ? 2 : 0 })]
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												...s.label,
												marginTop: "12px"
											},
											children: "PAYMENT METHOD"
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												...s.value,
												fontSize: "13px",
												color: "#AAA",
												textTransform: "capitalize"
											},
											children: realState.method === "flutterwave" ? "Flutterwave International" : "Paystack Local"
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										...s.infoBlock,
										backgroundColor: "#0A0A0A",
										padding: "20px",
										borderRadius: "6px",
										border: "1px solid #1A1A1A",
										flex: "1 1 auto",
										minWidth: "200px"
									},
									children: [
										/* @__PURE__ */ jsx("div", {
											style: s.label,
											children: "TRANSACTION ID"
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												...s.value,
												fontFamily: "monospace",
												fontSize: "14px",
												letterSpacing: "0.05em",
												color: "#CCC",
												margin: "4px 0 12px"
											},
											children: reference
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "6px",
												fontSize: "11px",
												color: successColor,
												fontWeight: "600"
											},
											children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 14 }), " Immutable Ledger Confirmed"]
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.bottomActions,
						className: "success-bottom-actions",
						children: [/* @__PURE__ */ jsxs("button", {
							style: s.btnPrimary,
							className: "btn-hover",
							onClick: () => navigate("/dashboard"),
							children: [/* @__PURE__ */ jsx(LayoutDashboard, { size: 18 }), "Go to Dashboard"]
						}), /* @__PURE__ */ jsxs("button", {
							style: s.btnSecondary,
							className: "btn-sec-hover",
							onClick: handleDownloadReceipt,
							children: [/* @__PURE__ */ jsx(Download, { size: 18 }), "Download Receipt"]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: {
							margin: "64px 0",
							fontSize: "11px",
							color: "#555",
							textAlign: "center"
						},
						children: [
							"Having trouble? Contact our ",
							/* @__PURE__ */ jsx("span", {
								style: {
									color: successColor,
									cursor: "pointer"
								},
								children: "support team"
							}),
							" for priority assistance."
						]
					})
				]
			})
		]
	}) });
}
//#endregion
export { SuccessPage as default };
