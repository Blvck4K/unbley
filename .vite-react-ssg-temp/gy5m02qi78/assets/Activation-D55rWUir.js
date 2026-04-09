import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import "react";
import { Link } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowUpRight, BarChart3, Bell, CheckCircle2, Edit, HeadphonesIcon, LayoutGrid, Lock, Moon, Package, Search, TrendingUp, User, Zap } from "lucide-react";
import { motion } from "framer-motion";
//#region src/pages/Activation.jsx
function Activation() {
	const brandColor = "#06acf8ff";
	const s = {
		page: {
			backgroundColor: "#0A0A0A",
			color: "#E5E5E5",
			height: "100vh",
			overflow: "hidden",
			display: "flex",
			fontFamily: "\"Inter\", sans-serif"
		},
		sidebar: {
			width: "280px",
			borderRight: "1px solid #1F1F1F",
			padding: "0",
			display: "flex",
			flexDirection: "column",
			opacity: .5,
			pointerEvents: "none"
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
			overflow: "hidden"
		},
		main: {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			position: "relative"
		},
		topBanner: {
			backgroundColor: "#111",
			borderBottom: "1px solid #1F1F1F",
			padding: "16px 80px",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			zIndex: 20
		},
		topBannerText: {
			color: "#FFF",
			fontSize: "13px",
			display: "flex",
			alignItems: "center",
			gap: "8px",
			fontWeight: "500"
		},
		topBannerBtn: {
			backgroundColor: brandColor,
			color: "#000",
			padding: "10px 20px",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			border: "none",
			cursor: "pointer",
			borderRadius: "4px"
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
			color: "#FFF",
			display: "flex",
			alignItems: "center",
			gap: "12px"
		},
		searchBar: {
			display: "flex",
			alignItems: "center",
			gap: "8px",
			backgroundColor: "#111",
			padding: "10px 16px",
			width: "320px",
			border: "1px solid #1F1F1F"
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
			gap: "32px"
		},
		premiumBadge: {
			color: brandColor,
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			padding: "4px 8px",
			border: `1px solid ${brandColor}`
		},
		contentWrap: {
			flex: 1,
			position: "relative",
			overflow: "hidden",
			display: "flex",
			flexDirection: "column"
		},
		blurredBg: {
			display: "flex",
			flexDirection: "column",
			filter: "blur(3px)",
			opacity: .6,
			pointerEvents: "none",
			height: "100%"
		},
		blurredContent: {
			padding: "80px",
			flex: 1,
			overflowY: "hidden"
		},
		overlay: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "rgba(5, 5, 5, 0.6)",
			zIndex: 10,
			overflowY: "auto",
			padding: "40px"
		},
		modal: {
			backgroundColor: "#0A0A0A",
			border: "1px solid #1F1F1F",
			width: "100%",
			maxWidth: "540px",
			borderRadius: "12px",
			boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
			padding: "48px",
			position: "relative"
		},
		stepLabel: {
			fontSize: "10px",
			fontWeight: "700",
			color: brandColor,
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			marginBottom: "16px"
		},
		modalTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "32px",
			color: "#FFF",
			marginBottom: "12px"
		},
		modalDesc: {
			color: "#888",
			fontSize: "14px",
			lineHeight: "1.6",
			marginBottom: "40px"
		},
		priceBox: {
			backgroundColor: "#111",
			border: "1px solid #1F1F1F",
			padding: "24px",
			borderRadius: "8px",
			marginBottom: "32px",
			textAlign: "center"
		},
		priceLabel: {
			fontSize: "10px",
			fontWeight: "700",
			color: "#666",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			marginBottom: "8px"
		},
		priceValue: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "36px",
			color: "#FFF",
			marginBottom: "4px"
		},
		priceOriginal: {
			fontSize: "14px",
			color: "#666",
			textDecoration: "line-through",
			marginRight: "8px"
		},
		priceSavings: {
			fontSize: "12px",
			color: "#10B981",
			fontWeight: "600"
		},
		unlocksTitle: {
			fontSize: "11px",
			fontWeight: "700",
			color: "#FFF",
			letterSpacing: "0.05em",
			textTransform: "uppercase",
			marginBottom: "20px"
		},
		unlockList: {
			listStyle: "none",
			padding: 0,
			margin: "0 0 40px 0",
			display: "flex",
			flexDirection: "column",
			gap: "16px"
		},
		unlockItem: {
			display: "flex",
			alignItems: "flex-start",
			gap: "12px",
			fontSize: "13px",
			color: "#CCC",
			lineHeight: "1.4"
		},
		activateBtn: {
			width: "100%",
			backgroundColor: brandColor,
			color: "#000",
			padding: "18px",
			fontSize: "13px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			border: "none",
			cursor: "pointer",
			borderRadius: "6px",
			transition: "background-color 0.2s",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			gap: "8px"
		},
		sectionLabel: {
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: "#666",
			marginBottom: "16px",
			textTransform: "uppercase",
			display: "flex",
			alignItems: "center",
			gap: "8px"
		},
		mainTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "48px",
			fontWeight: "400",
			color: "#FFFFFF",
			marginBottom: "16px",
			letterSpacing: "-0.02em",
			lineHeight: "1.2"
		},
		statsGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: "32px",
			marginTop: "64px"
		},
		card: {
			backgroundColor: "#111",
			padding: "32px",
			border: "1px solid #1F1F1F"
		},
		cardHeader: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "32px"
		},
		cardTitle: {
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: "#666",
			textTransform: "uppercase"
		},
		cardValue: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "36px",
			color: "#FFF"
		},
		cardSubtitle: {
			fontSize: "11px",
			color: "#888",
			marginTop: "12px"
		}
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		className: "act-page",
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .act-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
          .act-sidebar { display: none !important; }
          
          .act-top-banner { padding: 24px 20px !important; flex-direction: column !important; gap: 16px !important; text-align: center; }
          .act-top-banner button { width: 100%; padding: 14px !important; }
          
          .act-header { height: auto !important; padding: 24px 20px !important; flex-wrap: wrap; gap: 16px; justify-content: center; }
          .act-search { display: none !important; }
          
          .act-blurred-content { padding: 24px 20px !important; }
          
          .act-overlay { padding: 24px 16px !important; align-items: flex-start !important; overflow-y: auto !important; position: absolute !important; display: block !important; }
          .act-modal { padding: 48px 24px !important; margin: 40px auto; max-width: 100%; box-sizing: border-box; }
          .act-modal-badge { top: -20px !important; padding: 12px 16px !important; width: 90%; box-sizing: border-box; text-align: center; font-size: 10px !important; transform: translateX(-50%) !important; left: 50% !important; }
          .act-modal-title { font-size: 28px !important; text-align: center; }
          .act-modal-desc { text-align: center; font-size: 13px !important; }
          
          .act-price-box { padding: 20px !important; }
          .act-price-value { font-size: 32px !important; }
          
          .act-unlock-item { font-size: 12px !important; }
          .act-activate-btn { padding: 16px !important; }
        }
      ` }),
			/* @__PURE__ */ jsxs("div", {
				style: s.sidebar,
				className: "act-sidebar",
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: s.logoContainer,
						children: [/* @__PURE__ */ jsx("div", {
							style: s.logo,
							children: "Zizzystores."
						}), /* @__PURE__ */ jsx("div", {
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
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.nav,
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: s.navItem(true),
								title: "Activate your store to unlock this feature",
								children: [
									/* @__PURE__ */ jsx(LayoutGrid, { size: 16 }),
									" Overview ",
									/* @__PURE__ */ jsx(Lock, {
										size: 12,
										style: { marginLeft: "auto" }
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.navItem(false),
								title: "Activate your store to unlock this feature",
								children: [
									/* @__PURE__ */ jsx(User, { size: 16 }),
									" Profile ",
									/* @__PURE__ */ jsx(Lock, {
										size: 12,
										style: { marginLeft: "auto" }
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.navItem(false),
								title: "Activate your store to unlock this feature",
								children: [
									/* @__PURE__ */ jsx(Edit, { size: 16 }),
									" Edit ",
									/* @__PURE__ */ jsx(Lock, {
										size: 12,
										style: { marginLeft: "auto" }
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: {
									...s.navItem(false),
									marginTop: "48px"
								},
								children: [/* @__PURE__ */ jsx(HeadphonesIcon, { size: 16 }), " Customer Service"]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.userProfile,
						children: [/* @__PURE__ */ jsx("div", {
							style: s.userAvatar,
							children: /* @__PURE__ */ jsx("img", {
								src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
								alt: "Julian Vane",
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							})
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "12px",
								fontWeight: "700",
								color: "#FFF",
								letterSpacing: "0.05em",
								textTransform: "uppercase"
							},
							children: "Julian Vane"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "10px",
								color: "#666",
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								marginTop: "4px"
							},
							children: "Brand Director"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.main,
				children: [/* @__PURE__ */ jsxs("div", {
					style: s.topBanner,
					className: "act-top-banner",
					children: [/* @__PURE__ */ jsxs("div", {
						style: s.topBannerText,
						children: [/* @__PURE__ */ jsx(Lock, {
							size: 16,
							color: brandColor
						}), "Your store is not active yet. Complete your setup to start selling."]
					}), /* @__PURE__ */ jsx(Link, {
						to: "/finalize-activation",
						style: { textDecoration: "none" },
						children: /* @__PURE__ */ jsx("button", {
							style: s.topBannerBtn,
							children: "Activate My Store (₦30k / $30)"
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: s.contentWrap,
					children: [/* @__PURE__ */ jsxs("div", {
						style: s.blurredBg,
						children: [/* @__PURE__ */ jsxs("div", {
							style: s.header,
							className: "act-header",
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: s.headerTitle,
									children: ["Dashboard ", /* @__PURE__ */ jsx(Lock, {
										size: 16,
										color: "#666"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: s.searchBar,
									className: "act-search",
									children: [/* @__PURE__ */ jsx(Search, {
										size: 14,
										color: "#666"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										placeholder: "SEARCH ...",
										style: s.searchInput,
										disabled: true
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: s.headerActions,
									children: [
										/* @__PURE__ */ jsx(Bell, {
											size: 16,
											color: "#888"
										}),
										/* @__PURE__ */ jsx(Moon, {
											size: 16,
											color: "#888"
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.premiumBadge,
											children: "LOCKED"
										})
									]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							style: s.blurredContent,
							className: "act-blurred-content",
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-end",
									borderBottom: "1px solid #1F1F1F",
									paddingBottom: "40px"
								},
								children: /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "32px",
										alignItems: "center"
									},
									children: [/* @__PURE__ */ jsx("div", { style: {
										width: "100px",
										height: "100px",
										border: "1px solid #333",
										backgroundColor: "#111"
									} }), /* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("div", {
											style: s.sectionLabel,
											children: "Brand Profile"
										}),
										/* @__PURE__ */ jsx("h1", {
											style: {
												...s.mainTitle,
												fontSize: "36px",
												marginBottom: "16px"
											},
											children: "Zizzy W3ars"
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												display: "flex",
												gap: "24px",
												color: "#888",
												fontSize: "12px"
											},
											children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
												style: { color: "#FFF" },
												children: "Email:"
											}), " contact@zizzywears.com"] })
										})
									] })]
								})
							}), /* @__PURE__ */ jsxs("div", {
								style: s.statsGrid,
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: s.card,
										children: [
											/* @__PURE__ */ jsxs("div", {
												style: s.cardHeader,
												children: [/* @__PURE__ */ jsx(TrendingUp, {
													size: 14,
													color: "#FFF"
												}), /* @__PURE__ */ jsx("div", {
													style: s.cardTitle,
													children: "+0.0% THIS MONTH"
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardTitle,
												children: "Total Sales"
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardValue,
												children: "₦0"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.card,
										children: [
											/* @__PURE__ */ jsx("div", {
												style: s.cardHeader,
												children: /* @__PURE__ */ jsx(Package, {
													size: 18,
													color: "#888"
												})
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardTitle,
												children: "Stock Portfolio"
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardValue,
												children: "0"
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.card,
										children: [
											/* @__PURE__ */ jsx("div", {
												style: s.cardHeader,
												children: /* @__PURE__ */ jsx(BarChart3, {
													size: 18,
													color: "#888"
												})
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardTitle,
												children: "Your Traffic"
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardValue,
												children: "0"
											})
										]
									})
								]
							})]
						})]
					}), /* @__PURE__ */ jsx("div", {
						style: s.overlay,
						className: "act-overlay",
						children: /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								scale: .9,
								y: 20
							},
							animate: {
								opacity: 1,
								scale: 1,
								y: 0
							},
							transition: {
								duration: .6,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							style: s.modal,
							className: "act-modal",
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: {
										position: "absolute",
										top: "-40px",
										left: "50%",
										transform: "translateX(-50%)",
										backgroundColor: "#000",
										padding: "12px 24px",
										borderRadius: "24px",
										fontSize: "11px",
										color: "#FFF",
										fontWeight: "600",
										letterSpacing: "0.05em",
										border: "1px solid #1F1F1F",
										display: "flex",
										alignItems: "center",
										gap: "8px"
									},
									className: "act-modal-badge",
									children: [/* @__PURE__ */ jsx(Lock, {
										size: 14,
										color: brandColor
									}), " Activate your store to start selling and unlock your dashboard"]
								}),
								/* @__PURE__ */ jsx("div", {
									style: s.stepLabel,
									children: "Step 2 of 2: Activate Your Store"
								}),
								/* @__PURE__ */ jsx("h2", {
									style: s.modalTitle,
									className: "act-modal-title",
									children: "Activate Your Store"
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "15px",
										color: brandColor,
										fontWeight: "500",
										marginBottom: "16px",
										letterSpacing: "-0.01em"
									},
									children: "You’re one step away from launching your business."
								}),
								/* @__PURE__ */ jsx("p", {
									style: s.modalDesc,
									children: "Your store is ready. Complete activation to go live, accept payments, and start selling."
								}),
								/* @__PURE__ */ jsxs("div", {
									style: s.priceBox,
									children: [
										/* @__PURE__ */ jsx("div", {
											style: s.priceLabel,
											children: "Store Activation (First Year)"
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.priceValue,
											children: "₦30,000 / $30"
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
											style: s.priceOriginal,
											children: "₦50,000 / $60"
										}), /* @__PURE__ */ jsx("span", {
											style: s.priceSavings,
											children: "40% OFF – Limited Launch Offer"
										})] }),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "11px",
												color: "#666",
												marginTop: "12px"
											},
											children: "Renewal: ₦50,000 / $60 per year"
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									style: s.unlocksTitle,
									children: "What You Unlock After Activation:"
								}),
								/* @__PURE__ */ jsxs("ul", {
									style: s.unlockList,
									className: "act-unlock-list",
									children: [
										/* @__PURE__ */ jsxs("li", {
											style: s.unlockItem,
											className: "act-unlock-item",
											children: [/* @__PURE__ */ jsx(CheckCircle2, {
												size: 16,
												color: brandColor,
												style: {
													flexShrink: 0,
													marginTop: "2px"
												}
											}), /* @__PURE__ */ jsx("span", { children: /* @__PURE__ */ jsx("strong", { children: "Start making sales within 24 hours" }) })]
										}),
										/* @__PURE__ */ jsxs("li", {
											style: s.unlockItem,
											className: "act-unlock-item",
											children: [/* @__PURE__ */ jsx(CheckCircle2, {
												size: 16,
												color: brandColor,
												style: {
													flexShrink: 0,
													marginTop: "2px"
												}
											}), /* @__PURE__ */ jsxs("span", { children: ["Your store goes ", /* @__PURE__ */ jsx("strong", { children: "live instantly" })] })]
										}),
										/* @__PURE__ */ jsxs("li", {
											style: s.unlockItem,
											className: "act-unlock-item",
											children: [/* @__PURE__ */ jsx(CheckCircle2, {
												size: 16,
												color: brandColor,
												style: {
													flexShrink: 0,
													marginTop: "2px"
												}
											}), /* @__PURE__ */ jsx("span", { children: "Receive payments directly to your account (Paystack / Flutterwave)" })]
										}),
										/* @__PURE__ */ jsxs("li", {
											style: s.unlockItem,
											className: "act-unlock-item",
											children: [/* @__PURE__ */ jsx(CheckCircle2, {
												size: 16,
												color: brandColor,
												style: {
													flexShrink: 0,
													marginTop: "2px"
												}
											}), /* @__PURE__ */ jsx("span", { children: "Custom domain setup and SSL" })]
										}),
										/* @__PURE__ */ jsxs("li", {
											style: s.unlockItem,
											className: "act-unlock-item",
											children: [/* @__PURE__ */ jsx(CheckCircle2, {
												size: 16,
												color: brandColor,
												style: {
													flexShrink: 0,
													marginTop: "2px"
												}
											}), /* @__PURE__ */ jsx("span", { children: "Full access to the Admin Dashboard & Analytics" })]
										}),
										/* @__PURE__ */ jsxs("li", {
											style: s.unlockItem,
											className: "act-unlock-item",
											children: [/* @__PURE__ */ jsx(CheckCircle2, {
												size: 16,
												color: brandColor,
												style: {
													flexShrink: 0,
													marginTop: "2px"
												}
											}), /* @__PURE__ */ jsx("span", { children: "Complete control of your store's inventory and layout" })]
										})
									]
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "11px",
										color: "#F59E0B",
										fontWeight: "bold",
										textTransform: "uppercase",
										marginBottom: "12px",
										textAlign: "center",
										letterSpacing: "0.05em"
									},
									children: "⚡ Limited spots remaining at this price"
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/finalize-activation",
									style: {
										textDecoration: "none",
										display: "block",
										width: "100%"
									},
									children: /* @__PURE__ */ jsxs(motion.button, {
										whileHover: { scale: 1.02 },
										whileTap: { scale: .98 },
										style: s.activateBtn,
										className: "act-activate-btn",
										children: ["Launch My Store Now ", /* @__PURE__ */ jsx(ArrowUpRight, { size: 16 })]
									})
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "11px",
										color: "#888",
										marginTop: "12px",
										textAlign: "center"
									},
									children: "One-time activation — no hidden fees"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: "8px",
										marginTop: "24px"
									},
									children: [/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "6px",
											fontSize: "11px",
											color: "#888"
										},
										children: [/* @__PURE__ */ jsx(Lock, { size: 12 }), " Secure payment via Paystack"]
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "6px",
											fontSize: "11px",
											color: "#888"
										},
										children: [/* @__PURE__ */ jsx(Zap, {
											size: 12,
											color: "#F59E0B"
										}), " Instant activation after payment"]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										textAlign: "center",
										marginTop: "32px",
										fontSize: "12px",
										color: "#666",
										borderTop: "1px solid #1F1F1F",
										paddingTop: "24px"
									},
									children: [
										"Join ",
										/* @__PURE__ */ jsx("span", {
											style: {
												color: "#FFF",
												fontWeight: "bold"
											},
											children: "100+ brands"
										}),
										" already selling on Zizzystores"
									]
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										textAlign: "center",
										marginTop: "24px",
										fontSize: "11px",
										color: brandColor,
										cursor: "pointer",
										textDecoration: "underline"
									},
									children: "Already paid? Refresh to unlock dashboard"
								})
							]
						})
					})]
				})]
			})
		]
	}) });
}
//#endregion
export { Activation as default };
