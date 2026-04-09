import { n as supabase } from "./supabase-CTgwDjry.js";
import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, CheckCircle2, CreditCard, Lock, ShieldCheck, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import PaystackPop from "@paystack/inline-js";
//#region src/pages/Checkout.jsx
function Checkout() {
	const navigate = useNavigate();
	const [cartItems, setCartItems] = useState(() => {
		try {
			const stored = localStorage.getItem("cart");
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	});
	const [brand, setBrand] = useState(null);
	useEffect(() => {
		async function fetchBrand() {
			if (cartItems.length > 0 && cartItems[0].brand_id) {
				if (!brand || brand.id !== cartItems[0].brand_id) {
					const { data } = await supabase.from("brand_profiles").select("*").eq("id", cartItems[0].brand_id).single();
					if (data) setBrand(data);
				}
			}
		}
		fetchBrand();
	}, [cartItems]);
	const accentColor = brand?.accent_color || "#0F2C59";
	const bgMain = brand?.primary_color || "#FAFAFA";
	const secondaryBg = brand?.secondary_color || "#FFFFFF";
	const textColor = brand ? "#FDFDFD" : "#111";
	const mutedColor = brand ? "#999" : "#666";
	const borderColor = brand?.secondary_color ? "rgba(255,255,255,0.1)" : "#EAEAEA";
	const dangerColor = "#D83A3A";
	const inputBg = brand ? "rgba(255,255,255,0.05)" : "#F4F4F5";
	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
	const total = subtotal;
	const [formData, setFormData] = useState({
		firstName: "Julianne",
		lastName: "Moore",
		email: "",
		phone: "",
		address: "Studio 42, 5th Avenue",
		city: "New York",
		zip: "10001"
	});
	const [errors, setErrors] = useState({});
	const [isProcessing, setIsProcessing] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState("paystack");
	const formatCurrency = (amount) => `₦${amount.toLocaleString()}`;
	const onSuccess = async (transaction) => {
		setIsProcessing(true);
		const brandId = cartItems[0]?.brand_id;
		if (!brandId) {
			console.error("No brand_id found in cart items.");
			localStorage.removeItem("cart");
			navigate("/checkout-success", { state: {
				order: null,
				warning: "System Error: Missing brand context."
			} });
			return;
		}
		const orderData = {
			brand_id: brandId,
			order_number: `ORD-${(/* @__PURE__ */ new Date()).getTime().toString().slice(-6)}-${Math.floor(Math.random() * 1e3)}`,
			total_amount: Number(total) || 0,
			status: "paid",
			product_name_snapshot: cartItems.map((item) => `${item.qty}x ${item.name}${item.size ? ` (${item.size})` : ""}${item.color ? ` [${item.color}]` : ""}`).join(", "),
			customer_name: `${formData.firstName} ${formData.lastName}`.replace(/[^a-zA-Z0-9 ]/g, ""),
			customer_email: formData.email,
			customer_phone: formData.phone.replace(/[^0-9+]/g, ""),
			customer_address: `${formData.address}, ${formData.city}, ${formData.zip}`.replace(/[^a-zA-Z0-9, ]/g, ""),
			customer_city: formData.city.replace(/[^a-zA-Z0-9 ]/g, ""),
			customer_zip: formData.zip.replace(/[^a-zA-Z0-9 ]/g, ""),
			items: cartItems,
			transaction_id: transaction.reference,
			payment_method: paymentMethod
		};
		try {
			const { error: dbError } = await supabase.from("orders").insert([orderData]);
			if (dbError) throw dbError;
			await sendTelegramNotification(orderData);
			setIsProcessing(false);
			localStorage.removeItem("cart");
			navigate("/checkout-success", { state: { order: orderData } });
		} catch (err) {
			console.error("Critical Post-Checkout failure:", err);
			localStorage.removeItem("cart");
			const errorMsg = err.message || "Unknown error";
			navigate("/checkout-success", { state: {
				order: orderData,
				warning: `System Error: ${errorMsg}. (${errorMsg.includes("permission") ? "Database security blocked the save. Check RLS." : "Check network or credentials."})`
			} });
		}
	};
	const sendTelegramNotification = async (order) => {
		const token = "8742134511:AAEMCmlspEL5ZBk8ltwxHOgBBqM2AGSE4q8";
		const chatId = "8059395373";
		const message = `
NEW ORDER ALERT
------------------------
Order: ${order.order_number}
Brand: ${brand?.brand_name || "Store"}
Amount: NGN ${order.total_amount.toLocaleString()}
Method: ${order.payment_method.toUpperCase()}

Customer: ${order.customer_name}
Email: ${order.customer_email}
Phone: ${order.customer_phone}
Address: ${order.customer_address}

Items:
${order.items.map((item) => `- ${item.qty}x ${item.name}${item.size ? ` (${item.size})` : ""}${item.color ? ` [${item.color}]` : ""}`).join("\n")}

Transaction ID: ${order.transaction_id}
------------------------
View in Dashboard.
    `.trim();
		try {
			const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					chat_id: chatId,
					text: message
				})
			});
			if (!response.ok) {
				const errorData = await response.json();
				console.error("Telegram API Error:", errorData);
				throw new Error(`Telegram error: ${errorData.description}`);
			}
		} catch (e) {
			console.error("Telegram notify failed:", e);
			throw e;
		}
	};
	const onClose = () => {
		setIsProcessing(false);
	};
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
		if (errors[name]) setErrors((prev) => ({
			...prev,
			[name]: ""
		}));
	};
	const handlePaymentSubmit = () => {
		const newErrors = {};
		if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
		if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
		if (!formData.email.trim()) newErrors.email = "Email address is required";
		if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
		if (!formData.address.trim()) newErrors.address = "Street address is required";
		if (!formData.city.trim()) newErrors.city = "City is required";
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			const firstError = document.querySelector(".has-error");
			if (firstError) firstError.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
			return;
		}
		if (paymentMethod === "paystack" && !brand?.paystack_subaccount_code) {
			alert("This brand has not configured their local payout setup yet. Please use the international option or contact support.");
			return;
		}
		if (paymentMethod === "flutterwave" && !brand?.flutterwave_subaccount_code) {
			alert("This brand has not configured their international payout setup yet. Please use the local option or contact support.");
			return;
		}
		setIsProcessing(true);
		if (paymentMethod === "paystack") handlePaystack();
		else handleFlutterwave();
	};
	const handlePaystack = () => {
		try {
			new PaystackPop().newTransaction({
				key: "pk_live_736db2b6b181ebeb1b74fe63fae2e99610537656",
				email: formData.email,
				amount: total * 100,
				currency: "NGN",
				ref: (/* @__PURE__ */ new Date()).getTime().toString(),
				...brand?.paystack_subaccount_code ? { subaccount: brand.paystack_subaccount_code } : {},
				onSuccess: (transaction) => onSuccess(transaction),
				onCancel: () => onClose()
			});
		} catch (error) {
			console.error("Paystack initialization failed:", error);
			setIsProcessing(false);
		}
	};
	const handleFlutterwave = () => {
		try {
			window.FlutterwaveCheckout({
				public_key: "FLWPUBK-f41afe91bff2b507ada676d135dff8b6-X",
				tx_ref: (/* @__PURE__ */ new Date()).getTime().toString(),
				amount: total,
				currency: "NGN",
				payment_options: "card, account, ussd, qr",
				customer: {
					email: formData.email,
					phone_number: formData.phone,
					name: `${formData.firstName} ${formData.lastName}`
				},
				subaccounts: [{ id: brand.flutterwave_subaccount_code }],
				customizations: {
					title: brand?.brand_name || "Zizzystores Order",
					description: `Order from ${brand?.brand_name || "Store"}`,
					logo: brand?.logo_url || "https://zizzystores.com/logo.png"
				},
				callback: (data) => {
					console.log("Flutterwave Success:", data);
					onSuccess({ reference: data.transaction_id || data.tx_ref });
				},
				onclose: () => onClose()
			});
		} catch (error) {
			console.error("Flutterwave initialization failed:", error);
			setIsProcessing(false);
		}
	};
	const s = {
		page: {
			backgroundColor: bgMain,
			color: textColor,
			minHeight: "100vh",
			fontFamily: "\"Inter\", sans-serif",
			overflowX: "hidden",
			display: "flex",
			flexDirection: "column"
		},
		header: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "24px 48px",
			backgroundColor: secondaryBg,
			borderBottom: `1px solid ${borderColor}`
		},
		logo: {
			fontFamily: "\"Inter\", sans-serif",
			fontSize: "16px",
			fontWeight: "bold",
			letterSpacing: "0.05em",
			color: textColor
		},
		headerRight: {
			display: "flex",
			alignItems: "center",
			gap: "16px",
			color: mutedColor,
			fontSize: "11px",
			fontWeight: "600",
			letterSpacing: "0.05em"
		},
		contentWrap: {
			flex: 1,
			padding: "48px",
			display: "flex",
			flexDirection: "column",
			alignItems: "center"
		},
		stepper: {
			display: "flex",
			alignItems: "center",
			gap: "16px",
			marginBottom: "64px"
		},
		step: {
			display: "flex",
			alignItems: "center",
			gap: "8px"
		},
		stepNumActive: {
			width: "24px",
			height: "24px",
			borderRadius: "50%",
			backgroundColor: accentColor,
			color: "#000",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontSize: "11px",
			fontWeight: "700"
		},
		stepNumIdle: {
			width: "24px",
			height: "24px",
			borderRadius: "50%",
			backgroundColor: secondaryBg,
			border: `1px solid ${borderColor}`,
			color: mutedColor,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontSize: "11px",
			fontWeight: "700"
		},
		stepTextActive: {
			fontSize: "13px",
			fontWeight: "700",
			color: accentColor
		},
		stepTextIdle: {
			fontSize: "13px",
			fontWeight: "500",
			color: mutedColor
		},
		stepLine: {
			width: "48px",
			height: "1px",
			backgroundColor: borderColor
		},
		layout: {
			display: "grid",
			gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
			gap: "64px",
			maxWidth: "1200px",
			width: "100%"
		},
		leftCol: {
			display: "flex",
			flexDirection: "column"
		},
		sectionTitle: {
			fontSize: "28px",
			fontWeight: "700",
			color: textColor,
			marginBottom: "32px"
		},
		sectionSubtitle: {
			fontSize: "14px",
			color: mutedColor,
			marginBottom: "24px",
			fontWeight: "500"
		},
		formGrid: {
			display: "grid",
			gridTemplateColumns: "1fr 1fr",
			gap: "24px",
			marginBottom: "40px"
		},
		inputGroup: {
			display: "flex",
			flexDirection: "column",
			gap: "8px"
		},
		inputGroupFull: {
			display: "flex",
			flexDirection: "column",
			gap: "8px",
			gridColumn: "1 / -1"
		},
		label: {
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			color: textColor
		},
		input: {
			backgroundColor: inputBg,
			border: "1px solid transparent",
			padding: "16px",
			fontSize: "14px",
			color: textColor,
			borderRadius: "4px",
			outline: "none",
			transition: "border-color 0.2s, background-color 0.2s",
			width: "100%"
		},
		errorText: {
			color: dangerColor,
			fontSize: "11px",
			marginTop: "4px"
		},
		actionsCol: {
			display: "flex",
			flexDirection: "column",
			gap: "12px",
			marginTop: "32px"
		},
		continueBtn: {
			backgroundColor: accentColor,
			color: "#000",
			border: "none",
			padding: "18px 32px",
			fontSize: "14px",
			fontWeight: "700",
			borderRadius: "4px",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			gap: "12px",
			transition: "opacity 0.2s",
			width: "100%"
		},
		disclaimerText: {
			fontSize: "12px",
			color: mutedColor,
			textAlign: "center"
		},
		backBtn: {
			background: "none",
			border: "none",
			color: mutedColor,
			fontSize: "13px",
			fontWeight: "600",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			gap: "8px",
			marginTop: "16px",
			padding: "12px"
		},
		rightCol: {
			display: "flex",
			flexDirection: "column",
			gap: "24px"
		},
		summaryBox: {
			backgroundColor: secondaryBg,
			padding: "32px",
			borderRadius: "4px",
			border: `1px solid ${borderColor}`
		},
		summaryTitle: {
			fontSize: "20px",
			fontWeight: "600",
			color: textColor,
			marginBottom: "32px"
		},
		summaryItem: {
			display: "flex",
			gap: "16px",
			marginBottom: "24px"
		},
		summaryItemImg: {
			width: "64px",
			height: "64px",
			borderRadius: "4px",
			backgroundColor: "#111",
			overflow: "hidden"
		},
		summaryItemDetails: {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			justifyContent: "center"
		},
		summaryItemName: {
			fontSize: "14px",
			fontWeight: "600",
			color: textColor,
			marginBottom: "4px"
		},
		summaryItemVariant: {
			fontSize: "12px",
			color: mutedColor,
			marginBottom: "8px"
		},
		summaryItemPriceRow: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center"
		},
		summaryItemQty: {
			fontSize: "12px",
			color: mutedColor
		},
		summaryItemPrice: {
			fontSize: "14px",
			fontWeight: "700",
			color: accentColor
		},
		summaryRow: {
			display: "flex",
			justifyContent: "space-between",
			marginBottom: "16px",
			fontSize: "13px",
			color: mutedColor
		},
		summaryRowValue: {
			color: textColor,
			fontWeight: "500"
		},
		deliveryImportant: {
			fontSize: "11px",
			color: accentColor,
			fontWeight: "600",
			textAlign: "right",
			marginTop: "-12px",
			marginBottom: "16px"
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
			fontSize: "16px",
			fontWeight: "700",
			color: textColor
		},
		totalValue: {
			fontSize: "24px",
			fontWeight: "800",
			color: accentColor
		},
		guaranteeBox: {
			backgroundColor: inputBg,
			padding: "16px",
			borderRadius: "4px",
			border: `1px solid ${borderColor}`,
			display: "flex",
			alignItems: "flex-start",
			gap: "12px"
		},
		guaranteeText: {
			fontSize: "9px",
			fontWeight: "700",
			color: mutedColor,
			letterSpacing: "0.05em",
			lineHeight: "1.5"
		},
		encryptionBox: {
			backgroundColor: secondaryBg,
			border: `1px solid ${borderColor}`,
			padding: "16px",
			borderRadius: "4px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			gap: "24px"
		},
		encryptionIcons: {
			display: "flex",
			gap: "16px",
			color: mutedColor
		},
		encryptionText: {
			fontSize: "10px",
			fontWeight: "700",
			color: textColor,
			letterSpacing: "0.05em"
		},
		footer: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "32px 48px",
			marginTop: "auto",
			backgroundColor: bgMain,
			borderTop: `1px solid ${borderColor}`
		},
		footerLogo: {
			fontSize: "14px",
			fontWeight: "700",
			color: textColor
		},
		footerLinks: {
			display: "flex",
			gap: "32px",
			fontSize: "11px",
			color: mutedColor
		},
		footerLinkItem: {
			cursor: "pointer",
			textDecoration: "none"
		},
		copyright: {
			fontSize: "11px",
			color: mutedColor
		}
	};
	const getInputStyle = (fieldName) => {
		return {
			...s.input,
			borderColor: errors[fieldName] ? "#D83A3A" : "transparent",
			backgroundColor: errors[fieldName] ? "#FFF5F5" : inputBg
		};
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .checkout-header { padding: 16px 24px !important; }
          .checkout-content { padding: 32px 24px !important; }
          .checkout-layout { display: flex !important; flex-direction: column !important; gap: 40px !important; }
          .form-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .actions-col { position: sticky; bottom: 0; background: ${secondaryBg}; padding: 24px; margin: 32px -24px -32px -24px; box-shadow: 0 -10px 30px rgba(0,0,0,0.1); z-index: 100; border-top: 1px solid ${borderColor}; }
          .right-col { order: -1 !important; margin-bottom: 0 !important; }
          .footer-links { display: none !important; }
          .checkout-footer { padding: 24px !important; flex-direction: column; gap: 16px; align-items: center !important; text-align: center; }
          .stepper-wrap { display: none !important; }
          .section-title { font-size: 24px !important; margin-bottom: 24px !important; text-align: center; }
        }
      ` }),
			/* @__PURE__ */ jsxs("div", {
				style: s.header,
				className: "checkout-header",
				children: [/* @__PURE__ */ jsx("div", {
					style: s.logo,
					children: brand?.brand_name ? brand.brand_name.toUpperCase() : "DIGITAL ATELIER"
				}), /* @__PURE__ */ jsxs("div", {
					style: s.headerRight,
					children: [
						/* @__PURE__ */ jsx(Lock, { size: 14 }),
						"SECURE CHECKOUT",
						/* @__PURE__ */ jsx(ShoppingCart, {
							size: 18,
							style: {
								marginLeft: "16px",
								color: "#111"
							},
							cursor: "pointer",
							onClick: () => navigate("/cart")
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.contentWrap,
				className: "checkout-content",
				children: [/* @__PURE__ */ jsxs("div", {
					style: s.stepper,
					className: "stepper-wrap",
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: s.step,
							children: [/* @__PURE__ */ jsx("div", {
								style: s.stepNumActive,
								children: "1"
							}), /* @__PURE__ */ jsx("div", {
								style: s.stepTextActive,
								children: "Details"
							})]
						}),
						/* @__PURE__ */ jsx("div", { style: s.stepLine }),
						/* @__PURE__ */ jsxs("div", {
							style: s.step,
							children: [/* @__PURE__ */ jsx("div", {
								style: s.stepNumIdle,
								children: "2"
							}), /* @__PURE__ */ jsx("div", {
								style: s.stepTextIdle,
								children: "Payment"
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					style: s.layout,
					className: "checkout-layout",
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
							duration: .8,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						style: s.leftCol,
						children: [
							/* @__PURE__ */ jsx("h1", {
								style: s.sectionTitle,
								children: "Contact & Shipping"
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.formGrid,
								className: "form-grid",
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: s.inputGroupFull,
										className: errors.email ? "has-error" : "",
										children: [
											/* @__PURE__ */ jsx("label", {
												style: s.label,
												children: "Email Address *"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "email",
												name: "email",
												value: formData.email,
												onChange: handleInputChange,
												style: getInputStyle("email"),
												placeholder: "For order confirmation",
												autoComplete: "email"
											}),
											errors.email && /* @__PURE__ */ jsx("div", {
												style: s.errorText,
												children: errors.email
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.inputGroupFull,
										className: errors.phone ? "has-error" : "",
										children: [
											/* @__PURE__ */ jsx("label", {
												style: s.label,
												children: "Phone Number *"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "tel",
												name: "phone",
												value: formData.phone,
												onChange: handleInputChange,
												style: getInputStyle("phone"),
												placeholder: "For delivery updates",
												autoComplete: "tel"
											}),
											errors.phone && /* @__PURE__ */ jsx("div", {
												style: s.errorText,
												children: errors.phone
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.inputGroup,
										className: errors.firstName ? "has-error" : "",
										children: [
											/* @__PURE__ */ jsx("label", {
												style: s.label,
												children: "First Name *"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												name: "firstName",
												value: formData.firstName,
												onChange: handleInputChange,
												style: getInputStyle("firstName"),
												autoComplete: "given-name"
											}),
											errors.firstName && /* @__PURE__ */ jsx("div", {
												style: s.errorText,
												children: errors.firstName
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.inputGroup,
										className: errors.lastName ? "has-error" : "",
										children: [
											/* @__PURE__ */ jsx("label", {
												style: s.label,
												children: "Last Name *"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												name: "lastName",
												value: formData.lastName,
												onChange: handleInputChange,
												style: getInputStyle("lastName"),
												autoComplete: "family-name"
											}),
											errors.lastName && /* @__PURE__ */ jsx("div", {
												style: s.errorText,
												children: errors.lastName
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.inputGroupFull,
										className: errors.address ? "has-error" : "",
										children: [
											/* @__PURE__ */ jsx("label", {
												style: s.label,
												children: "Address *"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												name: "address",
												value: formData.address,
												onChange: handleInputChange,
												style: getInputStyle("address"),
												autoComplete: "street-address"
											}),
											errors.address && /* @__PURE__ */ jsx("div", {
												style: s.errorText,
												children: errors.address
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.inputGroup,
										className: errors.city ? "has-error" : "",
										children: [
											/* @__PURE__ */ jsx("label", {
												style: s.label,
												children: "City *"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												name: "city",
												value: formData.city,
												onChange: handleInputChange,
												style: getInputStyle("city"),
												autoComplete: "address-level2"
											}),
											errors.city && /* @__PURE__ */ jsx("div", {
												style: s.errorText,
												children: errors.city
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: s.inputGroup,
										children: [/* @__PURE__ */ jsx("label", {
											style: s.label,
											children: "Postal / Zip Code"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											name: "zip",
											value: formData.zip,
											onChange: handleInputChange,
											style: s.input,
											autoComplete: "postal-code"
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: { marginBottom: "48px" },
								children: [/* @__PURE__ */ jsx("h2", {
									style: {
										...s.sectionSubtitle,
										marginBottom: "16px",
										color: textColor
									},
									children: "Payment Method"
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "16px"
									},
									children: [/* @__PURE__ */ jsxs(motion.div, {
										whileHover: {
											scale: 1.02,
											backgroundColor: brand ? "rgba(255,255,255,0.08)" : "rgba(15, 44, 89, 0.08)"
										},
										whileTap: { scale: .98 },
										onClick: () => setPaymentMethod("paystack"),
										style: {
											padding: "20px",
											borderRadius: "8px",
											backgroundColor: paymentMethod === "paystack" ? brand ? "rgba(255,255,255,0.05)" : "rgba(15, 44, 89, 0.05)" : secondaryBg,
											border: `1px solid ${paymentMethod === "paystack" ? accentColor : borderColor}`,
											cursor: "pointer",
											transition: "border-color 0.3s ease"
										},
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "8px",
												marginBottom: "8px"
											},
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													width: "16px",
													height: "16px",
													borderRadius: "50%",
													border: `1px solid ${accentColor}`,
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: paymentMethod === "paystack" && /* @__PURE__ */ jsx("div", { style: {
													width: "8px",
													height: "8px",
													borderRadius: "50%",
													backgroundColor: accentColor
												} })
											}), /* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "14px",
													fontWeight: "700",
													color: paymentMethod === "paystack" ? accentColor : textColor
												},
												children: "Local (Paystack)"
											})]
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "11px",
												color: mutedColor
											},
											children: "Best for Nigeria Card, Transfer & USSD"
										})]
									}), /* @__PURE__ */ jsxs(motion.div, {
										whileHover: {
											scale: 1.02,
											backgroundColor: brand ? "rgba(255,255,255,0.08)" : "rgba(15, 44, 89, 0.08)"
										},
										whileTap: { scale: .98 },
										onClick: () => setPaymentMethod("flutterwave"),
										style: {
											padding: "20px",
											borderRadius: "8px",
											backgroundColor: paymentMethod === "flutterwave" ? brand ? "rgba(255,255,255,0.05)" : "rgba(15, 44, 89, 0.05)" : secondaryBg,
											border: `1px solid ${paymentMethod === "flutterwave" ? accentColor : borderColor}`,
											cursor: "pointer",
											transition: "border-color 0.3s ease"
										},
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "8px",
												marginBottom: "8px"
											},
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													width: "16px",
													height: "16px",
													borderRadius: "50%",
													border: `1px solid ${accentColor}`,
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: paymentMethod === "flutterwave" && /* @__PURE__ */ jsx("div", { style: {
													width: "8px",
													height: "8px",
													borderRadius: "50%",
													backgroundColor: accentColor
												} })
											}), /* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "14px",
													fontWeight: "700",
													color: paymentMethod === "flutterwave" ? accentColor : textColor
												},
												children: "International (Flutterwave)"
											})]
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "11px",
												color: mutedColor
											},
											children: "Best for International Cards & Mobile Money"
										})]
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.actionsCol,
								className: "actions-col",
								children: [
									/* @__PURE__ */ jsx(motion.button, {
										whileHover: { scale: 1.02 },
										whileTap: { scale: .98 },
										style: {
											...s.continueBtn,
											opacity: isProcessing ? .7 : 1
										},
										onClick: handlePaymentSubmit,
										disabled: isProcessing,
										children: isProcessing ? /* @__PURE__ */ jsx(Fragment, { children: "Processing..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 18 }), "Proceed to Secure Payment"] })
									}),
									/* @__PURE__ */ jsx("div", {
										style: s.disclaimerText,
										children: "You’ll review your order before final payment"
									}),
									/* @__PURE__ */ jsxs("button", {
										style: s.backBtn,
										onClick: () => navigate("/cart"),
										children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 14 }), "Return to Cart"]
									})
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						style: s.rightCol,
						className: "right-col",
						children: [/* @__PURE__ */ jsxs("div", {
							style: s.summaryBox,
							children: [
								/* @__PURE__ */ jsx("h2", {
									style: s.summaryTitle,
									children: "Order Summary"
								}),
								cartItems.map((item) => /* @__PURE__ */ jsxs("div", {
									style: s.summaryItem,
									children: [/* @__PURE__ */ jsx("div", {
										style: s.summaryItemImg,
										children: /* @__PURE__ */ jsx("img", {
											src: item.img?.split(",")[0],
											alt: item.name,
											style: {
												width: "100%",
												height: "100%",
												objectFit: "cover"
											},
											onError: (e) => {
												e.target.src = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80";
											}
										})
									}), /* @__PURE__ */ jsxs("div", {
										style: s.summaryItemDetails,
										children: [
											/* @__PURE__ */ jsx("div", {
												style: s.summaryItemName,
												children: item.name
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.summaryItemVariant,
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
												style: s.summaryItemPriceRow,
												children: [/* @__PURE__ */ jsxs("div", {
													style: s.summaryItemQty,
													children: ["Qty: ", item.qty]
												}), /* @__PURE__ */ jsx("div", {
													style: s.summaryItemPrice,
													children: formatCurrency(item.price * item.qty)
												})]
											})
										]
									})]
								}, item.id)),
								/* @__PURE__ */ jsx("div", { style: s.divider }),
								/* @__PURE__ */ jsxs("div", {
									style: s.summaryRow,
									children: [/* @__PURE__ */ jsx("span", { children: "Subtotal" }), /* @__PURE__ */ jsx("span", {
										style: s.summaryRowValue,
										children: formatCurrency(subtotal)
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: s.summaryRow,
									children: [/* @__PURE__ */ jsx("span", { children: "Shipping" }), /* @__PURE__ */ jsx("span", {
										style: {
											color: textColor,
											fontWeight: "600"
										},
										children: "Complimentary"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									style: s.deliveryImportant,
									children: "Delivery: 2–5 business days"
								}),
								/* @__PURE__ */ jsx("div", { style: s.divider }),
								/* @__PURE__ */ jsxs("div", {
									style: s.totalRow,
									children: [/* @__PURE__ */ jsx("span", {
										style: s.totalLabel,
										children: "Total"
									}), /* @__PURE__ */ jsx("span", {
										style: s.totalValue,
										children: formatCurrency(total)
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: s.guaranteeBox,
									children: [/* @__PURE__ */ jsx(CheckCircle2, {
										size: 16,
										color: "#10503D",
										style: {
											flexShrink: 0,
											marginTop: "2px"
										}
									}), /* @__PURE__ */ jsx("div", {
										style: s.guaranteeText,
										children: "ATELIER GUARANTEE: AUTHENTICITY & SECURE LOCAL SHIPPING INCLUDED."
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							style: s.encryptionBox,
							children: [/* @__PURE__ */ jsxs("div", {
								style: s.encryptionIcons,
								children: [
									/* @__PURE__ */ jsx(ShieldCheck, { size: 20 }),
									/* @__PURE__ */ jsx(CreditCard, { size: 20 }),
									/* @__PURE__ */ jsx(Lock, { size: 20 })
								]
							}), /* @__PURE__ */ jsxs("div", {
								style: s.encryptionText,
								children: [
									"SECURED BY ",
									paymentMethod === "paystack" ? "PAYSTACK" : "FLUTTERWAVE",
									" & SSL ENCRYPTION"
								]
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.footer,
				className: "checkout-footer",
				children: [
					/* @__PURE__ */ jsx("div", {
						style: s.footerLogo,
						children: brand ? brand.brand_name : "Digital Atelier"
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
						style: s.copyright,
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" ",
							brand ? brand.brand_name : "Digital Atelier",
							". All rights reserved."
						]
					})
				]
			})
		]
	}) });
}
//#endregion
export { Checkout as default };
