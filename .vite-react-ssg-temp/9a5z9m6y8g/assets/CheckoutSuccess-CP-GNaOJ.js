import { n as motion, t as PageTransition } from "./PageTransition-8IvNPEDC.js";
import { t as createLucideIcon } from "./createLucideIcon-D9kzrCV5.js";
import { t as ArrowLeft } from "./arrow-left-C_NRIx5x.js";
import { t as CircleCheck } from "./circle-check-DbL_-DIu.js";
import { t as Download } from "./download-CL5SL3SS.js";
import { t as Mail } from "./mail-CKL5T_AG.js";
import { t as Package } from "./package-bP8FlYkH.js";
import { t as ShieldCheck } from "./shield-check-ClSEqKJ8.js";
import "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
var MapPin = createLucideIcon("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]);
var Phone = createLucideIcon("phone", [["path", {
	d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
	key: "9njp5v"
}]]);
//#endregion
//#region src/pages/CheckoutSuccess.jsx
function CheckoutSuccess() {
	const location = useLocation();
	const navigate = useNavigate();
	const { order, warning } = location.state || {};
	if (!order) return /* @__PURE__ */ jsxs("div", {
		style: {
			height: "100vh",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#FAFAFA"
		},
		children: [/* @__PURE__ */ jsx("h2", {
			style: { color: "#111" },
			children: "No Order Found"
		}), /* @__PURE__ */ jsx("button", {
			className: "btn btn-primary",
			onClick: () => navigate("/"),
			children: "Return Home"
		})]
	});
	const handleDownloadReceipt = () => {
		const receiptContent = `
========================================
         ZIZZYSTORES RECEIPT
========================================

ORDER NUMBER: ${order.order_number}
BRAND:        ${order.brand_name || "ZizzyStores Vendor"}
DATE:         ${(/* @__PURE__ */ new Date()).toLocaleString()}
STATUS:       PAID / SUCCESSFUL

----------------------------------------
CUSTOMER DETAILS:
----------------------------------------
NAME:         ${order.customer_name}
EMAIL:        ${order.customer_email}
PHONE:        ${order.customer_phone}
ADDRESS:      ${order.customer_address}

----------------------------------------
ORDER SUMMARY:
----------------------------------------
${order.items.map((item) => `${item.qty}x ${item.name} - ₦${(item.price * item.qty).toLocaleString()}`).join("\n")}

TOTAL AMOUNT: ₦${order.total_amount.toLocaleString()}
PAYMENT:      ${order.payment_method.toUpperCase()}

----------------------------------------
TRANSACTION ID:
${order.transaction_id}

----------------------------------------
Thank you for your purchase.
Your order is being processed.
========================================
    `;
		const blob = new Blob([receiptContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `Receipt-${order.order_number}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
	const brandColor = "#06acf8";
	return /* @__PURE__ */ jsxs(PageTransition, { children: [/* @__PURE__ */ jsx("div", {
		style: {
			backgroundColor: "#FAFAFA",
			minHeight: "100vh",
			padding: "60px 20px",
			fontFamily: "\"Inter\", sans-serif"
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "container",
			style: {
				maxWidth: "800px",
				margin: "0 auto"
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						textAlign: "center",
						marginBottom: "48px"
					},
					children: [
						/* @__PURE__ */ jsx(motion.div, {
							initial: { scale: 0 },
							animate: { scale: 1 },
							transition: {
								type: "spring",
								stiffness: 260,
								damping: 20
							},
							style: {
								width: "80px",
								height: "80px",
								backgroundColor: "#10B981",
								borderRadius: "50%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								margin: "0 auto 24px",
								color: "#FFF"
							},
							children: /* @__PURE__ */ jsx(CircleCheck, { size: 48 })
						}),
						/* @__PURE__ */ jsx("h1", {
							style: {
								fontSize: "36px",
								fontWeight: "800",
								color: "#111",
								marginBottom: "16px"
							},
							children: "Order Placed Successfully!"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								color: "#666",
								fontSize: "16px"
							},
							children: "Thank you for your purchase. We've received your order and it's being processed."
						}),
						warning && /* @__PURE__ */ jsxs("div", {
							style: {
								marginTop: "16px",
								color: "#F59E0B",
								fontSize: "13px",
								fontWeight: "600"
							},
							children: ["⚠️ ", warning]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: {
						backgroundColor: "#FFFBEB",
						border: "1px solid #F59E0B",
						borderRadius: "12px",
						padding: "20px",
						marginBottom: "32px",
						display: "flex",
						alignItems: "center",
						gap: "16px"
					},
					children: [/* @__PURE__ */ jsx(ShieldCheck, {
						size: 24,
						color: "#F59E0B"
					}), /* @__PURE__ */ jsx("p", {
						style: {
							color: "#92400E",
							fontWeight: "700",
							fontSize: "14px",
							margin: 0
						},
						children: "I recommend you download your receipt and keep it safe for your records."
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: "32px"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "24px"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								backgroundColor: "#FFF",
								padding: "32px",
								borderRadius: "16px",
								boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
							},
							children: [
								/* @__PURE__ */ jsxs("h3", {
									style: {
										fontSize: "18px",
										fontWeight: "700",
										marginBottom: "24px",
										display: "flex",
										alignItems: "center",
										gap: "8px"
									},
									children: [/* @__PURE__ */ jsx(Package, {
										size: 18,
										color: brandColor
									}), " Order Summary"]
								}),
								order.items.map((item, idx) => /* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										marginBottom: "12px",
										fontSize: "14px"
									},
									children: [/* @__PURE__ */ jsxs("span", {
										style: { color: "#666" },
										children: [
											item.qty,
											"x ",
											item.name
										]
									}), /* @__PURE__ */ jsxs("span", {
										style: { fontWeight: "600" },
										children: ["₦", (item.price * item.qty).toLocaleString()]
									})]
								}, idx)),
								/* @__PURE__ */ jsxs("div", {
									style: {
										borderTop: "1px solid #EEE",
										marginTop: "16px",
										paddingTop: "16px",
										display: "flex",
										justifyContent: "space-between"
									},
									children: [/* @__PURE__ */ jsx("span", {
										style: { fontWeight: "700" },
										children: "Total Paid"
									}), /* @__PURE__ */ jsxs("span", {
										style: {
											fontWeight: "800",
											color: brandColor,
											fontSize: "18px"
										},
										children: ["₦", order.total_amount.toLocaleString()]
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								backgroundColor: "#FFF",
								padding: "32px",
								borderRadius: "16px",
								boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
							},
							children: [/* @__PURE__ */ jsx("h3", {
								style: {
									fontSize: "18px",
									fontWeight: "700",
									marginBottom: "24px"
								},
								children: "Transaction Info"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "13px",
									color: "#666",
									lineHeight: "2"
								},
								children: [
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("span", {
											style: { color: "#999" },
											children: "Order ID:"
										}),
										" ",
										order.order_number
									] }),
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("span", {
											style: { color: "#999" },
											children: "Transaction ID:"
										}),
										" ",
										/* @__PURE__ */ jsx("code", {
											style: {
												backgroundColor: "#F4F4F5",
												padding: "2px 4px",
												borderRadius: "4px"
											},
											children: order.transaction_id
										})
									] }),
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("span", {
											style: { color: "#999" },
											children: "Payment Method:"
										}),
										" ",
										order.payment_method.toUpperCase()
									] })
								]
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "24px"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								backgroundColor: "#FFF",
								padding: "32px",
								borderRadius: "16px",
								boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
							},
							children: [/* @__PURE__ */ jsx("h3", {
								style: {
									fontSize: "18px",
									fontWeight: "700",
									marginBottom: "24px"
								},
								children: "Customer Details"
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "16px"
								},
								children: [
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "12px"
										},
										children: [/* @__PURE__ */ jsx(Mail, {
											size: 16,
											color: "#999"
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												color: "#999",
												fontWeight: "700",
												textTransform: "uppercase"
											},
											children: "Email"
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "14px",
												color: "#111"
											},
											children: order.customer_email
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "12px"
										},
										children: [/* @__PURE__ */ jsx(Phone, {
											size: 16,
											color: "#999"
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												color: "#999",
												fontWeight: "700",
												textTransform: "uppercase"
											},
											children: "Phone"
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "14px",
												color: "#111"
											},
											children: order.customer_phone
										})] })]
									}),
									/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											gap: "12px"
										},
										children: [/* @__PURE__ */ jsx(MapPin, {
											size: 16,
											color: "#999"
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												color: "#999",
												fontWeight: "700",
												textTransform: "uppercase"
											},
											children: "Shipping Address"
										}), /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "14px",
												color: "#111",
												lineHeight: "1.4"
											},
											children: order.customer_address
										})] })]
									})
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							style: { marginTop: "auto" },
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: handleDownloadReceipt,
								style: {
									width: "100%",
									backgroundColor: "#111",
									color: "#FFF",
									border: "none",
									borderRadius: "12px",
									padding: "20px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "12px",
									fontSize: "14px",
									fontWeight: "700",
									cursor: "pointer"
								},
								children: [/* @__PURE__ */ jsx(Download, { size: 20 }), " Download Your Receipt"]
							}), /* @__PURE__ */ jsxs("button", {
								onClick: () => navigate("/"),
								style: {
									width: "100%",
									backgroundColor: "transparent",
									color: "#666",
									border: "none",
									marginTop: "16px",
									fontSize: "13px",
									fontWeight: "600",
									cursor: "pointer",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "8px"
								},
								children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 14 }), " Back to Shopping"]
							})]
						})]
					})]
				})
			]
		})
	}), /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .container { padding: 0 16px; }
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      ` })] });
}
//#endregion
export { CheckoutSuccess as default };
