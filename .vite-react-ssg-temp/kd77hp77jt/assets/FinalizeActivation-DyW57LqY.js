import { n as supabase } from "./supabase-CTgwDjry.js";
import { t as useAuth } from "./useAuth-Ci0LZBhu.js";
import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";
import PaystackPop from "@paystack/inline-js";
//#region src/pages/FinalizeActivation.jsx
function FinalizeActivation() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [processing, setProcessing] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("paystack");
	const onSuccess = async (transaction) => {
		setProcessing(true);
		setErrorMsg("");
		try {
			let updateResult = await supabase.from("brand_profiles").update({
				store_active: true,
				last_transaction_id: transaction.reference,
				updated_at: /* @__PURE__ */ new Date()
			}).eq("id", user?.id);
			if (updateResult.error) {
				console.warn("Primary activation update failed, attempting minimal fallback:", updateResult.error);
				updateResult = await supabase.from("brand_profiles").update({
					store_active: true,
					updated_at: /* @__PURE__ */ new Date()
				}).eq("id", user?.id);
			}
			if (updateResult.error) throw updateResult.error;
			const { error: authError } = await supabase.auth.updateUser({ data: { store_active: true } });
			if (authError) throw authError;
			const finalAmount = paymentMethod === "paystack" ? 3e4 : 30;
			const finalCurrency = paymentMethod === "paystack" ? "NGN" : "USD";
			navigate("/success", { state: {
				reference: transaction.reference,
				amount: finalAmount,
				currency: finalCurrency,
				email: user?.email,
				brandName: user?.user_metadata?.brand_name || "Your Premium Store",
				method: paymentMethod
			} });
		} catch (err) {
			console.error("Critical Post-Payment DB failure:", err);
			setErrorMsg("Payment processed but database error occurred. Reference: " + transaction.reference);
			setProcessing(false);
		}
	};
	const onClose = () => {
		console.log("Customer abandoned flow");
		setProcessing(false);
	};
	const handlePayClick = () => {
		if (paymentMethod === "paystack") handlePaystack();
		else handleFlutterwave();
	};
	const handlePaystack = () => {
		setProcessing(true);
		try {
			new PaystackPop().newTransaction({
				key: "pk_live_736db2b6b181ebeb1b74fe63fae2e99610537656",
				email: user?.email || "pending@zizzystores.com",
				amount: 3e4 * 100,
				currency: "NGN",
				ref: (/* @__PURE__ */ new Date()).getTime().toString(),
				onSuccess: (transaction) => onSuccess(transaction),
				onCancel: () => onClose()
			});
		} catch (error) {
			console.error("Paystack failed:", error);
			setProcessing(false);
		}
	};
	const handleFlutterwave = () => {
		setProcessing(true);
		try {
			if (!window.FlutterwaveCheckout) {
				alert("Payment gateway is loading, please try again in a moment.");
				setProcessing(false);
				return;
			}
			window.FlutterwaveCheckout({
				public_key: "FLWPUBK-f41afe91bff2b507ada676d135dff8b6-X",
				tx_ref: (/* @__PURE__ */ new Date()).getTime().toString(),
				amount: 30,
				currency: "USD",
				customer: {
					email: user?.email || "pending@zizzystores.com",
					name: user?.user_metadata?.brand_name || "New Store Owner"
				},
				customizations: {
					title: "Zizzystores Activation",
					description: "Premium Storefront Activation"
				},
				callback: (data) => {
					onSuccess({ reference: data.transaction_id || data.tx_ref });
				},
				onclose: () => onClose()
			});
		} catch (error) {
			console.error("Flutterwave failed:", error);
			setProcessing(false);
		}
	};
	const brandColor = "#06acf8";
	const s = {
		page: {
			display: "flex",
			height: "100vh",
			width: "100%",
			fontFamily: "\"Inter\", sans-serif",
			color: "#FFF",
			overflow: "hidden",
			backgroundColor: "#080808"
		},
		leftPane: {
			flex: 1,
			backgroundColor: "#121212",
			position: "relative",
			display: "flex",
			flexDirection: "column",
			padding: "48px 64px",
			overflow: "hidden",
			borderRight: "1px solid #1F1F1F"
		},
		rightPane: {
			flex: 1,
			backgroundColor: "#080808",
			display: "flex",
			flexDirection: "column",
			padding: "48px 64px",
			position: "relative",
			overflowY: "auto"
		},
		logo: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "18px",
			letterSpacing: "0.05em",
			color: "#FFF",
			textTransform: "uppercase",
			fontWeight: "bold"
		},
		mainTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "44px",
			fontWeight: "400",
			marginBottom: "24px",
			lineHeight: "1.1"
		},
		checkoutBox: {
			backgroundColor: "#111",
			borderLeft: `2px solid ${brandColor}`,
			padding: "32px",
			position: "relative",
			marginBottom: "40px"
		},
		price: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "36px",
			fontWeight: "700"
		},
		payBtn: {
			width: "100%",
			height: "56px",
			backgroundColor: brandColor,
			color: "#000",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "0 24px",
			fontSize: "14px",
			fontWeight: "bold",
			border: "none",
			borderRadius: "4px",
			cursor: processing ? "not-allowed" : "pointer",
			opacity: processing ? .7 : 1
		},
		errorBox: {
			backgroundColor: "#311",
			color: "#F85149",
			padding: "16px",
			borderRadius: "4px",
			fontSize: "12px",
			marginBottom: "24px",
			border: "1px solid #522"
		}
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		className: "fin-page",
		children: [
			/* @__PURE__ */ jsx("style", { children: `
          @media (max-width: 768px) {
            .fin-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow-y: auto !important; }
            .fin-left { padding: 80px 24px 48px !important; border-right: none !important; border-bottom: 1px solid #1F1F1F !important; }
            .fin-right { padding: 48px 24px !important; }
          }
        ` }),
			/* @__PURE__ */ jsxs("div", {
				style: s.leftPane,
				className: "fin-left",
				children: [/* @__PURE__ */ jsx("div", {
					style: s.logo,
					children: "Zizzystores."
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						marginTop: "auto",
						marginBottom: "10vh"
					},
					children: [/* @__PURE__ */ jsxs("h1", {
						style: {
							fontFamily: "\"Playfair Display\", serif",
							fontSize: "48px",
							lineHeight: "1.2",
							marginBottom: "48px"
						},
						children: [
							"Crafting ",
							/* @__PURE__ */ jsx("span", {
								style: { fontStyle: "italic" },
								children: "distinction"
							}),
							" in the digital marketplace."
						]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "24px",
							marginBottom: "32px"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: { color: brandColor },
							children: /* @__PURE__ */ jsx(Globe, { size: 20 })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "15px",
								fontWeight: "600",
								marginBottom: "8px"
							},
							children: "Custom Domain Inclusion"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "13px",
								color: "#888"
							},
							children: "Establish authority with a professional .store domain."
						})] })]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.rightPane,
				className: "fin-right",
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						alignSelf: "flex-end",
						fontSize: "11px",
						color: "#666"
					},
					children: "SUPPORT"
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						margin: "auto",
						maxWidth: "480px",
						width: "100%"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							style: {
								color: brandColor,
								fontSize: "11px",
								fontWeight: "700",
								textTransform: "uppercase",
								marginBottom: "16px"
							},
							children: "FINALIZE ACTIVATION"
						}),
						/* @__PURE__ */ jsx("h2", {
							style: s.mainTitle,
							children: "Unlock Your Brand's Potential"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								color: "#888",
								fontSize: "14px",
								lineHeight: "1.6",
								marginBottom: "48px"
							},
							children: "Activate your professional store and secure your complimentary domain for the first year."
						}),
						/* @__PURE__ */ jsxs("div", {
							style: { marginBottom: "32px" },
							children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "10px",
									color: "#666",
									marginBottom: "16px"
								},
								children: "SELECT REGION"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "12px"
								},
								children: [/* @__PURE__ */ jsxs(motion.div, {
									whileHover: {
										scale: 1.02,
										backgroundColor: "rgba(6, 172, 248, 0.1)"
									},
									whileTap: { scale: .98 },
									onClick: () => setPaymentMethod("paystack"),
									style: {
										flex: 1,
										padding: "16px",
										borderRadius: "8px",
										backgroundColor: paymentMethod === "paystack" ? "rgba(6, 172, 248, 0.05)" : "#111",
										border: `1px solid ${paymentMethod === "paystack" ? brandColor : "#222"}`,
										cursor: "pointer"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											color: paymentMethod === "paystack" ? brandColor : "#888",
											fontSize: "12px",
											fontWeight: "bold"
										},
										children: "Local (Paystack)"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											color: "#555",
											fontSize: "10px",
											marginTop: "4px"
										},
										children: "Nigeria Cards & Transfer"
									})]
								}), /* @__PURE__ */ jsxs(motion.div, {
									whileHover: {
										scale: 1.02,
										backgroundColor: "rgba(6, 172, 248, 0.1)"
									},
									whileTap: { scale: .98 },
									onClick: () => setPaymentMethod("flutterwave"),
									style: {
										flex: 1,
										padding: "16px",
										borderRadius: "8px",
										backgroundColor: paymentMethod === "flutterwave" ? "rgba(6, 172, 248, 0.05)" : "#111",
										border: `1px solid ${paymentMethod === "flutterwave" ? brandColor : "#222"}`,
										cursor: "pointer"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											color: paymentMethod === "flutterwave" ? brandColor : "#888",
											fontSize: "12px",
											fontWeight: "bold"
										},
										children: "International (FW)"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											color: "#555",
											fontSize: "10px",
											marginTop: "4px"
										},
										children: "Cards outside Nigeria"
									})]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: s.checkoutBox,
							children: [
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "10px",
										color: "#666",
										marginBottom: "8px"
									},
									children: "TOTAL DUE (FIRST YEAR)"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "baseline",
										gap: "12px"
									},
									children: [/* @__PURE__ */ jsx("div", {
										style: s.price,
										children: paymentMethod === "paystack" ? "₦30,000" : "$30.00"
									}), /* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "18px",
											color: "#666",
											textDecoration: "line-through"
										},
										children: paymentMethod === "paystack" ? "₦50,000" : "$60.00"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										fontSize: "12px",
										color: brandColor,
										marginTop: "8px",
										fontWeight: "bold"
									},
									children: "40% Discount Applied"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										fontSize: "11px",
										color: "#555",
										marginTop: "12px"
									},
									children: [
										"Renewal Cost: ",
										paymentMethod === "paystack" ? "₦50,000" : "$60.00",
										" yearly"
									]
								})
							]
						}),
						errorMsg && /* @__PURE__ */ jsx("div", {
							style: s.errorBox,
							children: errorMsg
						}),
						/* @__PURE__ */ jsxs("button", {
							style: s.payBtn,
							onClick: handlePayClick,
							disabled: processing,
							children: [processing ? "Processing..." : `Pay via ${paymentMethod === "paystack" ? "Paystack" : "Flutterwave"}`, /* @__PURE__ */ jsx(ArrowRight, { size: 20 })]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								textAlign: "center",
								color: "#666",
								fontSize: "11px",
								marginTop: "24px"
							},
							children: [/* @__PURE__ */ jsx(Shield, {
								size: 14,
								style: {
									marginRight: "8px",
									verticalAlign: "middle"
								}
							}), "Secure 256-bit encrypted transaction."]
						})
					]
				})]
			})
		]
	}) });
}
//#endregion
export { FinalizeActivation as default };
