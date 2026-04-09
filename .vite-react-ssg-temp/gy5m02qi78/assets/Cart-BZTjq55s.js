import { n as supabase } from "./supabase-CTgwDjry.js";
import { t as useAuth } from "./useAuth-DY4X98To.js";
import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, CreditCard, Globe, RotateCcw, ShieldCheck, ShoppingCart, Trash2, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
//#region src/pages/Cart.jsx
function Cart() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [cartItems, setCartItems] = useState(() => {
		try {
			const stored = localStorage.getItem("cart");
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	});
	const [brand, setBrand] = useState(null);
	const [recommendedProducts, setRecommendedProducts] = useState([]);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cartItems));
		async function fetchData() {
			if (cartItems.length > 0 && cartItems[0].brand_id) {
				const id = cartItems[0].brand_id;
				if (!brand || brand.id !== id) {
					const { data: bData } = await supabase.from("brand_profiles").select("*").eq("id", id).single();
					if (bData) setBrand(bData);
				}
				const cartIds = cartItems.map((i) => i.id);
				const { data: pData } = await supabase.from("products").select("*").eq("brand_id", id).limit(6);
				if (pData) setRecommendedProducts(pData.filter((p) => !cartIds.includes(p.id)).slice(0, 3));
			} else if (cartItems.length === 0) {
				setBrand(null);
				setRecommendedProducts([]);
			}
		}
		fetchData();
	}, [cartItems]);
	const [removedItems, setRemovedItems] = useState([]);
	const accentColor = brand?.accent_color || "#0F2C59";
	const bgMain = brand?.primary_color || "#FAFAFA";
	const secondaryBg = brand?.secondary_color || "#FFFFFF";
	const textColor = brand ? "#FDFDFD" : "#111";
	const mutedColor = brand ? "#999" : "#666";
	const borderColor = brand?.secondary_color ? "rgba(255,255,255,0.1)" : "#EAEAEA";
	const dangerColor = "#D83A3A";
	const formatPrice = (price) => `₦${price.toLocaleString()}`;
	const handleRemove = (id) => {
		const item = cartItems.find((i) => i.id === id);
		setRemovedItems([...removedItems, item]);
		setCartItems(cartItems.filter((i) => i.id !== id));
	};
	const handleUndo = () => {
		if (removedItems.length > 0) {
			const itemToRestore = removedItems[removedItems.length - 1];
			setCartItems([...cartItems, itemToRestore]);
			setRemovedItems(removedItems.slice(0, -1));
		}
	};
	const updateQty = (id, delta) => {
		setCartItems(cartItems.map((item) => {
			if (item.id === id) {
				const newQty = Math.max(1, item.qty + delta);
				return {
					...item,
					qty: newQty
				};
			}
			return item;
		}));
	};
	const handleImageError = (e) => {
		e.target.src = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80";
	};
	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
	const total = subtotal;
	const s = {
		page: {
			backgroundColor: bgMain,
			color: textColor,
			minHeight: "100vh",
			fontFamily: "\"Inter\", sans-serif",
			overflowX: "hidden"
		},
		header: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			backgroundColor: bgMain
		},
		logo: {
			fontFamily: "\"Inter\", sans-serif",
			fontSize: "18px",
			fontWeight: "bold",
			letterSpacing: "0.05em",
			color: textColor
		},
		headerRight: {
			display: "flex",
			alignItems: "center",
			gap: "24px"
		},
		iconButton: {
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			color: textColor,
			position: "relative"
		},
		cartBadge: {
			position: "absolute",
			top: "-6px",
			right: "-8px",
			backgroundColor: accentColor,
			color: "#000",
			fontSize: "9px",
			fontWeight: "bold",
			width: "14px",
			height: "14px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			borderRadius: "50%"
		},
		content: {
			maxWidth: "1400px",
			margin: "0 auto"
		},
		pageTitle: {
			fontFamily: "\"Inter\", sans-serif",
			fontSize: isMobile ? "24px" : "44px",
			fontWeight: "700",
			letterSpacing: "-0.02em",
			margin: "0 0 12px 0",
			color: textColor
		},
		pageSubtitle: {
			fontSize: "13px",
			color: mutedColor,
			lineHeight: "1.6",
			maxWidth: "400px",
			marginBottom: isMobile ? "32px" : "48px"
		},
		layout: {
			display: "grid",
			gridTemplateColumns: "minmax(0, 1.8fr) minmax(0, 1fr)",
			gap: "64px"
		},
		itemsContainer: {
			display: "flex",
			flexDirection: "column",
			gap: "24px"
		},
		cartItem: {
			backgroundColor: secondaryBg,
			padding: "24px",
			display: "flex",
			gap: "32px",
			borderRadius: "4px",
			border: `1px solid ${borderColor}`,
			boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
		},
		itemImageWrap: {
			width: "160px",
			height: "160px",
			backgroundColor: "#111",
			borderRadius: "4px",
			overflow: "hidden",
			flexShrink: 0,
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		itemImage: {
			width: "100%",
			height: "100%",
			objectFit: "cover"
		},
		itemDetails: {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			justifyContent: "center"
		},
		itemNameRow: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "flex-start",
			marginBottom: "8px"
		},
		itemName: {
			fontSize: "18px",
			fontWeight: "700",
			color: accentColor
		},
		itemPrice: {
			fontSize: "15px",
			fontWeight: "700",
			color: textColor
		},
		itemVariant: {
			fontSize: "11px",
			color: mutedColor,
			marginBottom: "24px",
			textTransform: "uppercase",
			letterSpacing: "0.05em"
		},
		itemActions: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginTop: "auto",
			flexWrap: "wrap",
			gap: "16px"
		},
		qtyControl: {
			display: "flex",
			alignItems: "center",
			backgroundColor: bgMain,
			border: `1px solid ${borderColor}`,
			borderRadius: "4px"
		},
		qtyBtn: {
			width: "32px",
			height: "32px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			cursor: "pointer",
			border: "none",
			background: "transparent",
			color: textColor,
			fontSize: "16px"
		},
		qtyValue: {
			fontSize: "13px",
			fontWeight: "600",
			width: "24px",
			textAlign: "center",
			color: textColor
		},
		itemTotalCalc: {
			fontSize: "13px",
			color: mutedColor,
			fontWeight: "500",
			display: "flex",
			alignItems: "center",
			gap: "6px"
		},
		removeBtn: {
			display: "flex",
			alignItems: "center",
			gap: "6px",
			color: dangerColor,
			fontSize: "11px",
			fontWeight: "700",
			textTransform: "uppercase",
			cursor: "pointer",
			background: "transparent",
			border: "none",
			letterSpacing: "0.05em"
		},
		summaryBox: {
			backgroundColor: secondaryBg,
			padding: "40px",
			borderRadius: "4px",
			border: `1px solid ${borderColor}`
		},
		summaryTitle: {
			fontSize: "18px",
			fontWeight: "600",
			color: textColor,
			marginBottom: "32px"
		},
		summaryRow: {
			display: "flex",
			justifyContent: "space-between",
			marginBottom: "16px",
			fontSize: "13px",
			color: mutedColor
		},
		divider: {
			height: "1px",
			backgroundColor: borderColor,
			margin: "24px 0"
		},
		totalRow: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "32px"
		},
		totalLabel: {
			fontSize: "14px",
			fontWeight: "700",
			color: textColor
		},
		totalValue: {
			fontSize: "20px",
			fontWeight: "700",
			color: accentColor
		},
		checkoutBtn: {
			width: "100%",
			padding: "16px",
			backgroundColor: accentColor,
			color: "#000",
			fontSize: "13px",
			fontWeight: "700",
			border: "none",
			borderRadius: "4px",
			cursor: "pointer",
			textTransform: "uppercase",
			letterSpacing: "0.05em",
			marginBottom: "16px",
			transition: "background-color 0.2s",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			gap: "8px"
		},
		continueLink: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			gap: "8px",
			color: textColor,
			backgroundColor: "transparent",
			border: `1px solid ${borderColor}`,
			padding: "14px",
			borderRadius: "4px",
			fontSize: "11px",
			textDecoration: "none",
			textTransform: "uppercase",
			letterSpacing: "0.05em",
			cursor: "pointer",
			transition: "background-color 0.2s",
			fontWeight: "600"
		},
		trustBadges: {
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: "16px",
			marginTop: "24px"
		},
		trustBadge: {
			backgroundColor: secondaryBg,
			padding: "16px",
			border: `1px solid ${borderColor}`,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			gap: "8px",
			borderRadius: "4px"
		},
		trustBadgeLabel: {
			fontSize: "8px",
			fontWeight: "700",
			color: mutedColor,
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			textAlign: "center"
		},
		undoToast: {
			backgroundColor: accentColor,
			color: "#000",
			padding: "14px 24px",
			borderRadius: "4px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
		},
		undoBtn: {
			background: "transparent",
			border: "none",
			color: "#000",
			fontWeight: "700",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			gap: "6px",
			fontSize: "12px",
			textTransform: "uppercase",
			letterSpacing: "0.05em"
		},
		recommendations: { marginTop: "80px" },
		recTitle: {
			fontSize: "24px",
			fontWeight: "700",
			color: textColor,
			marginBottom: "32px"
		},
		recGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
			gap: "24px"
		},
		featureCard: {
			backgroundColor: secondaryBg,
			padding: "40px",
			border: `1px solid ${borderColor}`,
			borderRadius: "4px",
			display: "flex",
			flexDirection: "column",
			position: "relative",
			overflow: "hidden",
			minHeight: "300px",
			cursor: "pointer"
		},
		featureTag: {
			fontSize: "8px",
			fontWeight: "700",
			color: accentColor,
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			marginBottom: "16px"
		},
		featureTitle: {
			fontSize: "24px",
			fontWeight: "600",
			color: textColor,
			marginBottom: "8px"
		},
		featureDesc: {
			fontSize: "12px",
			color: mutedColor,
			maxWidth: "200px",
			lineHeight: "1.6"
		},
		featureLink: {
			marginTop: "auto",
			fontSize: "11px",
			fontWeight: "700",
			color: textColor,
			textDecoration: "underline",
			cursor: "pointer"
		},
		featureImageWrap: {
			position: "absolute",
			bottom: "24px",
			right: "24px",
			width: "120px",
			height: "120px",
			borderRadius: "12px",
			overflow: "hidden",
			boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
		},
		featureImg: {
			width: "100%",
			height: "100%",
			objectFit: "cover"
		},
		smallCard: {
			backgroundColor: secondaryBg,
			padding: "24px",
			border: `1px solid ${borderColor}`,
			borderRadius: "4px",
			display: "flex",
			flexDirection: "column",
			cursor: "pointer"
		},
		smallImgWrap: {
			width: "100%",
			height: "180px",
			backgroundColor: "#111",
			marginBottom: "16px",
			overflow: "hidden",
			borderRadius: "4px"
		},
		smallImg: {
			width: "100%",
			height: "100%",
			objectFit: "cover",
			transition: "transform 0.3s"
		},
		smallTitle: {
			fontSize: "12px",
			fontWeight: "600",
			color: textColor,
			marginBottom: "4px"
		},
		smallPrice: {
			fontSize: "11px",
			color: accentColor,
			fontWeight: "bold"
		},
		footer: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			height: "80px",
			borderTop: `1px solid ${borderColor}`,
			marginTop: "64px"
		},
		footerLeft: {
			display: "flex",
			flexDirection: "column",
			gap: "8px"
		},
		footerLogo: {
			fontSize: "12px",
			fontWeight: "700",
			color: textColor
		},
		copyright: {
			fontSize: "10px",
			color: mutedColor
		},
		footerLinks: {
			display: "flex",
			gap: "24px",
			fontSize: "10px",
			color: mutedColor,
			textTransform: "uppercase",
			letterSpacing: "0.05em"
		},
		footerLinkItem: {
			cursor: "pointer",
			textDecoration: "none",
			transition: "color 0.2s"
		},
		footerIcons: {
			display: "flex",
			gap: "12px",
			color: textColor
		}
	};
	if (user && brand && user.id === brand.id) return /* @__PURE__ */ jsxs("div", {
		style: {
			...s.page,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#0A0A0A",
			color: "#FFF"
		},
		children: [
			/* @__PURE__ */ jsx(ShieldCheck, {
				size: 48,
				color: dangerColor,
				style: { marginBottom: "24px" }
			}),
			/* @__PURE__ */ jsx("h2", {
				style: {
					fontFamily: "\"Playfair Display\", serif",
					fontSize: "28px",
					marginBottom: "16px"
				},
				children: "Owner Environment Active"
			}),
			/* @__PURE__ */ jsx("p", {
				style: {
					color: "#999",
					marginBottom: "32px",
					textAlign: "center",
					maxWidth: "400px",
					lineHeight: "1.6"
				},
				children: "You cannot construct a cart or checkout your own digital assets. Please switch to a buyer account to test the checkout matrix."
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: () => navigate(-1),
				style: {
					padding: "12px 32px",
					border: `1px solid ${accentColor}`,
					backgroundColor: "transparent",
					color: "#FFF",
					fontWeight: "bold",
					borderRadius: "4px",
					cursor: "pointer"
				},
				children: "RETURN TO DASHBOARD"
			})
		]
	});
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .cart-header, .cart-footer { padding: 16px 24px !important; }
          .cart-content { padding: 32px 24px !important; }
          .cart-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .cart-item { flex-direction: column !important; gap: 24px !important; padding: 20px !important; }
          .cart-item-image-wrap { width: 100% !important; height: 180px !important; }
          .cart-item-actions { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .cart-summary-col { position: sticky; bottom: 0; z-index: 100; margin-top: 40px; }
          .cart-summary-box { background-color: ${secondaryBg} !important; box-shadow: 0 -4px 30px rgba(0,0,0,0.1) !important; margin: 0 -24px !important; border-radius: 20px 20px 0 0 !important; padding: 32px 24px 24px 24px !important; border-top: 1px solid ${borderColor} !important; }
          .rec-grid { grid-template-columns: 1fr !important; }
          .footer-links { display: none !important; }
          .page-title { font-size: 28px !important; }
        }
      ` }),
			/* @__PURE__ */ jsxs("div", {
				style: {
					...s.header,
					padding: "24px 48px"
				},
				className: "cart-header",
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "16px"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							...s.iconButton,
							fontSize: "12px",
							fontWeight: "bold",
							textTransform: "uppercase",
							letterSpacing: "0.1em"
						},
						onClick: () => navigate(-1),
						children: /* @__PURE__ */ jsx(ArrowLeft, { size: 16 })
					}), /* @__PURE__ */ jsx("div", {
						style: s.logo,
						children: brand ? brand.brand_name.toUpperCase() : "DIGITAL ATELIER"
					})]
				}), /* @__PURE__ */ jsx("div", {
					style: s.headerRight,
					children: /* @__PURE__ */ jsxs("div", {
						style: s.iconButton,
						onClick: () => navigate("/cart"),
						children: [/* @__PURE__ */ jsx(ShoppingCart, { size: 18 }), /* @__PURE__ */ jsx("div", {
							style: s.cartBadge,
							children: cartItems.length
						})]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					...s.content,
					padding: "48px 80px"
				},
				className: "cart-content",
				children: [
					/* @__PURE__ */ jsx("h1", {
						style: s.pageTitle,
						className: "page-title",
						children: "Your Selection"
					}),
					/* @__PURE__ */ jsx("p", {
						style: s.pageSubtitle,
						children: "A curated collection of pieces refined for your digital lifestyle. Review your atelier items before finalizing your acquisition."
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.layout,
						className: "cart-layout",
						children: [/* @__PURE__ */ jsx("div", {
							style: s.itemsContainer,
							children: /* @__PURE__ */ jsxs(AnimatePresence, { children: [removedItems.length > 0 && /* @__PURE__ */ jsxs(motion.div, {
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
								style: s.undoToast,
								children: [/* @__PURE__ */ jsx("span", { children: "Item removed from cart." }), /* @__PURE__ */ jsxs("button", {
									style: s.undoBtn,
									onClick: handleUndo,
									children: [/* @__PURE__ */ jsx(RotateCcw, { size: 14 }), " Undo"]
								})]
							}), cartItems.length === 0 ? /* @__PURE__ */ jsxs(motion.div, {
								initial: {
									opacity: 0,
									scale: .95
								},
								animate: {
									opacity: 1,
									scale: 1
								},
								style: {
									padding: "80px 0",
									textAlign: "center",
									color: mutedColor,
									backgroundColor: secondaryBg,
									borderRadius: "4px",
									border: `1px solid ${borderColor}`
								},
								children: [
									/* @__PURE__ */ jsx(ShoppingCart, {
										size: 48,
										color: mutedColor,
										style: { marginBottom: "16px" }
									}),
									/* @__PURE__ */ jsx("h3", {
										style: {
											fontSize: "18px",
											color: textColor,
											marginBottom: "8px"
										},
										children: "Your Cart is Empty"
									}),
									/* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "14px",
											marginBottom: "32px"
										},
										children: "Discover unique items to add to your collection."
									}),
									/* @__PURE__ */ jsx("div", {
										style: {
											display: "flex",
											justifyContent: "center"
										},
										children: /* @__PURE__ */ jsx("div", {
											style: {
												...s.continueLink,
												width: "auto",
												padding: "16px 32px"
											},
											onClick: () => navigate(-1),
											children: "Explore Collection"
										})
									})
								]
							}) : cartItems.map((item, idx) => /* @__PURE__ */ jsxs(motion.div, {
								layout: true,
								initial: {
									opacity: 0,
									x: -20
								},
								animate: {
									opacity: 1,
									x: 0
								},
								exit: {
									opacity: 0,
									scale: .95
								},
								transition: { delay: idx * .05 },
								style: s.cartItem,
								className: "cart-item",
								children: [/* @__PURE__ */ jsx("div", {
									style: s.itemImageWrap,
									className: "cart-item-image-wrap",
									children: /* @__PURE__ */ jsx("img", {
										src: item.img?.split(",")[0],
										alt: item.name,
										style: s.itemImage,
										onError: handleImageError
									})
								}), /* @__PURE__ */ jsxs("div", {
									style: s.itemDetails,
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: s.itemNameRow,
											children: [/* @__PURE__ */ jsx("div", {
												style: s.itemName,
												children: item.name
											}), /* @__PURE__ */ jsx("div", {
												style: s.itemPrice,
												children: formatPrice(item.price)
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: s.itemVariant,
											children: [item.variant, (item.size || item.color) && /* @__PURE__ */ jsxs("span", {
												style: {
													marginLeft: "8px",
													color: accentColor,
													fontWeight: "700"
												},
												children: [
													"[",
													item.size && `SIZE: ${item.size}`,
													item.size && item.color && " | ",
													item.color && `COLOUR: ${item.color}`,
													"]"
												]
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: s.itemActions,
											className: "cart-item-actions",
											children: [/* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "24px",
													flexWrap: "wrap"
												},
												children: [/* @__PURE__ */ jsxs("div", {
													style: s.qtyControl,
													children: [
														/* @__PURE__ */ jsx("button", {
															style: s.qtyBtn,
															onClick: () => updateQty(item.id, -1),
															children: "-"
														}),
														/* @__PURE__ */ jsx("div", {
															style: s.qtyValue,
															children: item.qty
														}),
														/* @__PURE__ */ jsx("button", {
															style: s.qtyBtn,
															onClick: () => updateQty(item.id, 1),
															children: "+"
														})
													]
												}), item.qty >= 1 && /* @__PURE__ */ jsxs("div", {
													style: s.itemTotalCalc,
													children: [
														"Total: ",
														/* @__PURE__ */ jsx("span", {
															style: {
																color: textColor,
																fontWeight: "700"
															},
															children: formatPrice(item.price * item.qty)
														}),
														/* @__PURE__ */ jsxs("span", {
															style: {
																fontSize: "11px",
																color: mutedColor,
																marginLeft: "4px"
															},
															children: [
																"(",
																formatPrice(item.price),
																" × ",
																item.qty,
																")"
															]
														})
													]
												})]
											}), /* @__PURE__ */ jsxs("button", {
												style: s.removeBtn,
												onClick: () => handleRemove(item.id),
												children: [/* @__PURE__ */ jsx(Trash2, { size: 12 }), " Remove"]
											})]
										})
									]
								})]
							}, item.id))] })
						}), /* @__PURE__ */ jsxs("div", {
							className: "cart-summary-col",
							children: [/* @__PURE__ */ jsxs("div", {
								style: s.summaryBox,
								className: "cart-summary-box",
								children: [
									/* @__PURE__ */ jsx("div", {
										style: s.summaryTitle,
										children: "Order Summary"
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.summaryRow,
										children: [/* @__PURE__ */ jsx("span", { children: "Subtotal" }), /* @__PURE__ */ jsx("span", {
											style: {
												color: textColor,
												fontWeight: "500"
											},
											children: formatPrice(subtotal)
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.summaryRow,
										children: [/* @__PURE__ */ jsx("span", { children: "Delivery Info" }), /* @__PURE__ */ jsx("span", {
											style: {
												fontWeight: "600",
												color: textColor
											},
											children: "Free delivery nationwide"
										})]
									}),
									/* @__PURE__ */ jsx("div", { style: s.divider }),
									/* @__PURE__ */ jsxs("div", {
										style: s.totalRow,
										children: [/* @__PURE__ */ jsx("span", {
											style: s.totalLabel,
											children: "Estimated Total"
										}), /* @__PURE__ */ jsx("span", {
											style: s.totalValue,
											children: formatPrice(total)
										})]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => navigate("/checkout"),
										disabled: cartItems.length === 0,
										style: {
											...s.checkoutBtn,
											opacity: cartItems.length === 0 ? .5 : 1,
											cursor: cartItems.length === 0 ? "not-allowed" : "pointer"
										},
										children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 16 }), " Checkout Securely"]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.continueLink,
										onClick: () => brand ? navigate(`/shop-brand/${brand.id}`) : navigate(-1),
										children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 14 }), " Continue Shopping"]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								style: s.trustBadges,
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: s.trustBadge,
										children: [/* @__PURE__ */ jsx(ShieldCheck, {
											size: 18,
											color: "#555"
										}), /* @__PURE__ */ jsxs("div", {
											style: s.trustBadgeLabel,
											children: [
												"Secure",
												/* @__PURE__ */ jsx("br", {}),
												"Payment"
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.trustBadge,
										children: [/* @__PURE__ */ jsx(Truck, {
											size: 18,
											color: "#555"
										}), /* @__PURE__ */ jsxs("div", {
											style: s.trustBadgeLabel,
											children: [
												"Fast",
												/* @__PURE__ */ jsx("br", {}),
												"Delivery"
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.trustBadge,
										children: [/* @__PURE__ */ jsx(CreditCard, {
											size: 18,
											color: "#555"
										}), /* @__PURE__ */ jsxs("div", {
											style: s.trustBadgeLabel,
											children: [
												"Multiple",
												/* @__PURE__ */ jsx("br", {}),
												"Options"
											]
										})]
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.recommendations,
						children: [/* @__PURE__ */ jsx("h2", {
							style: s.recTitle,
							children: "You may also desire"
						}), /* @__PURE__ */ jsxs("div", {
							style: s.recGrid,
							className: "rec-grid",
							children: [recommendedProducts.map((prod, idx) => {
								if (idx === 0) return /* @__PURE__ */ jsxs("div", {
									style: s.featureCard,
									onClick: () => navigate(`/product?id=${prod.id}`),
									children: [
										/* @__PURE__ */ jsx("div", {
											style: s.featureTag,
											children: "Discover"
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.featureTitle,
											children: prod.title
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.featureDesc,
											children: prod.description || "A timeless addition to your collection."
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.featureLink,
											children: "Explore Asset"
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.featureImageWrap,
											children: /* @__PURE__ */ jsx("img", {
												src: prod.image_url?.split(",")[0],
												alt: prod.title,
												style: s.featureImg
											})
										})
									]
								}, prod.id);
								else return /* @__PURE__ */ jsxs("div", {
									style: s.smallCard,
									onClick: () => navigate(`/product?id=${prod.id}`),
									children: [
										/* @__PURE__ */ jsx("div", {
											style: s.smallImgWrap,
											children: prod.image_url ? /* @__PURE__ */ jsx("img", {
												src: prod.image_url.split(",")[0],
												alt: prod.title,
												style: s.smallImg
											}) : /* @__PURE__ */ jsx("div", { style: {
												width: "100%",
												height: "100%",
												backgroundColor: "#111"
											} })
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.smallTitle,
											children: prod.title
										}),
										/* @__PURE__ */ jsx("div", {
											style: s.smallPrice,
											children: formatPrice(prod.price)
										})
									]
								}, prod.id);
							}), recommendedProducts.length === 0 && /* @__PURE__ */ jsx("div", {
								style: { color: mutedColor },
								children: "No other assets available."
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					...s.footer,
					padding: "0 80px"
				},
				className: "cart-footer",
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: s.footerLeft,
						children: [/* @__PURE__ */ jsx("div", {
							style: s.footerLogo,
							children: brand ? brand.brand_name : "Digital Atelier"
						}), /* @__PURE__ */ jsxs("div", {
							style: s.copyright,
							children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" ",
								brand ? brand.brand_name : "Digital Atelier",
								". All rights reserved."
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.footerLinks,
						className: "footer-links",
						children: [
							/* @__PURE__ */ jsx("a", {
								style: s.footerLinkItem,
								children: "Privacy Policy"
							}),
							/* @__PURE__ */ jsx("a", {
								style: s.footerLinkItem,
								children: "Terms of Service"
							}),
							/* @__PURE__ */ jsx("a", {
								style: s.footerLinkItem,
								children: "Shipping & Returns"
							}),
							/* @__PURE__ */ jsx("a", {
								style: s.footerLinkItem,
								children: "Sustainability"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.footerIcons,
						children: [/* @__PURE__ */ jsx(Globe, { size: 16 }), /* @__PURE__ */ jsx("div", {
							style: {
								width: "16px",
								height: "16px",
								borderRadius: "50%",
								border: "1.5px solid #333",
								display: "flex",
								alignItems: "center",
								justifyContent: "center"
							},
							children: /* @__PURE__ */ jsx("div", { style: {
								borderBottom: "1.5px solid #333",
								width: "100%"
							} })
						})]
					})
				]
			})
		]
	}) });
}
//#endregion
export { Cart as default };
