import { t as PageTransition } from "./PageTransition-8IvNPEDC.js";
import { t as createLucideIcon } from "./createLucideIcon-D9kzrCV5.js";
import { t as Check } from "./check-D3iwqrrA.js";
import { n as Navbar, t as Footer } from "./Footer-CASFpsLC.js";
import { n as Rocket, t as CTASection } from "./CTASection-C1Xz8rN2.js";
import { t as Settings } from "./settings-W1cIZsib.js";
import { t as Zap } from "./zap-C3cmnYus.js";
import { t as SEO } from "./SEO-Ra22bWq2.js";
import "react";
import { Link } from "react-router-dom";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
var BadgeCheck = createLucideIcon("badge-check", [["path", {
	d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
	key: "3c2336"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
var Wallet = createLucideIcon("wallet", [["path", {
	d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
	key: "18etb6"
}], ["path", {
	d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
	key: "xoc0q4"
}]]);
//#endregion
//#region src/pages/AffordableEcommerce.jsx
function AffordableEcommerce() {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(SEO, {
		title: "Affordable Ecommerce Website Nigeria & Global | Only ₦30,000 / $30",
		description: "Looking for a cheap ecommerce website in Nigeria? ZizzyStores offers the most affordable way to launch a professional online store for ₦30,000 a year.",
		keywords: "cheap ecommerce website Nigeria, affordable online store builder, best value ecommerce platform, website for my business Nigeria",
		canonical: "https://zizzystores.com/affordable-ecommerce-platform"
	}), /* @__PURE__ */ jsxs(PageTransition, { children: [
		/* @__PURE__ */ jsx(Navbar, {}),
		/* @__PURE__ */ jsxs("main", {
			style: { paddingTop: "80px" },
			children: [
				/* @__PURE__ */ jsx("section", {
					style: {
						padding: "80px 20px",
						backgroundColor: "var(--bg-light)",
						textAlign: "center"
					},
					children: /* @__PURE__ */ jsxs("div", {
						className: "container",
						style: {
							maxWidth: "800px",
							margin: "0 auto"
						},
						children: [
							/* @__PURE__ */ jsxs("h1", {
								style: {
									fontSize: "clamp(32px, 5vw, 56px)",
									fontWeight: "800",
									lineHeight: "1.2",
									marginBottom: "24px"
								},
								children: [
									"The Most ",
									/* @__PURE__ */ jsx("span", {
										style: { color: "var(--primary)" },
										children: "Affordable way"
									}),
									" to Launch a Professional Store"
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								style: {
									fontSize: "18px",
									color: "var(--text-secondary)",
									marginBottom: "32px"
								},
								children: [
									"Why spend ₦100k+ on a custom developer when you can get a professional .store website for just ",
									/* @__PURE__ */ jsx("strong", { children: "₦30,000 / $30" }),
									" for your first year?"
								]
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/auth?mode=signup",
								className: "btn btn-primary",
								style: {
									padding: "14px 40px",
									fontSize: "16px"
								},
								children: "Start Your Shop for ₦30,000"
							})
						]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					style: { padding: "80px 20px" },
					children: /* @__PURE__ */ jsxs("div", {
						className: "container",
						children: [/* @__PURE__ */ jsx("h2", {
							style: {
								textAlign: "center",
								fontSize: "32px",
								fontWeight: "700",
								marginBottom: "48px"
							},
							children: "The Best Value for Your Business"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
								gap: "32px"
							},
							children: [
								{
									icon: /* @__PURE__ */ jsx(Wallet, { size: 24 }),
									title: "Lowest Entry Cost",
									description: "Start for just ₦30,000 / $30 for a whole year. That's less than ₦2,500 ($2.50) a month—the best value in Nigeria."
								},
								{
									icon: /* @__PURE__ */ jsx(BadgeCheck, { size: 24 }),
									title: "All-Inclusive Features",
									description: "No 'Lite' plans here. You get everything: custom domain, hosting, unlimited products, and localized payments."
								},
								{
									icon: /* @__PURE__ */ jsx(Zap, { size: 24 }),
									title: "No Hidden Fees",
									description: "Tired of transaction fees? ZizzyStores don't take a percentage of your sales. What you earn is yours."
								}
							].map((value, index) => /* @__PURE__ */ jsxs("div", {
								style: {
									padding: "32px",
									backgroundColor: "white",
									borderRadius: "24px",
									border: "1px solid var(--border-color)",
									textAlign: "center"
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											width: "56px",
											height: "56px",
											backgroundColor: "rgba(8, 156, 255, 0.1)",
											color: "var(--primary)",
											borderRadius: "16px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											margin: "0 auto 20px"
										},
										children: value.icon
									}),
									/* @__PURE__ */ jsx("h3", {
										style: {
											fontSize: "20px",
											fontWeight: "700",
											marginBottom: "12px"
										},
										children: value.title
									}),
									/* @__PURE__ */ jsx("p", {
										style: {
											color: "var(--text-secondary)",
											fontSize: "15px"
										},
										children: value.description
									})
								]
							}, index))
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					style: {
						padding: "100px 20px",
						backgroundColor: "var(--bg-dark)",
						color: "white"
					},
					children: /* @__PURE__ */ jsx("div", {
						className: "container",
						children: /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								flexWrap: "wrap",
								gap: "48px",
								alignItems: "center"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									flex: "1",
									minWidth: "300px"
								},
								children: [/* @__PURE__ */ jsxs("h2", {
									style: {
										fontSize: "36px",
										fontWeight: "800",
										marginBottom: "24px"
									},
									children: [
										"Everything Included. ",
										/* @__PURE__ */ jsx("br", {}),
										"No Hidden Costs."
									]
								}), /* @__PURE__ */ jsxs("ul", {
									style: {
										listStyle: "none",
										padding: 0,
										display: "flex",
										flexDirection: "column",
										gap: "16px"
									},
									children: [
										/* @__PURE__ */ jsxs("li", {
											style: {
												display: "flex",
												gap: "12px",
												alignItems: "center"
											},
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													width: "24px",
													height: "24px",
													borderRadius: "50%",
													backgroundColor: "var(--primary)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: /* @__PURE__ */ jsx(Check, {
													size: 14,
													color: "white"
												})
											}), /* @__PURE__ */ jsx("span", { children: "Professional .top Domain for 1 Year" })]
										}),
										/* @__PURE__ */ jsxs("li", {
											style: {
												display: "flex",
												gap: "12px",
												alignItems: "center"
											},
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													width: "24px",
													height: "24px",
													borderRadius: "50%",
													backgroundColor: "var(--primary)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: /* @__PURE__ */ jsx(Check, {
													size: 14,
													color: "white"
												})
											}), /* @__PURE__ */ jsx("span", { children: "Unlimited Product Listings & Images" })]
										}),
										/* @__PURE__ */ jsxs("li", {
											style: {
												display: "flex",
												gap: "12px",
												alignItems: "center"
											},
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													width: "24px",
													height: "24px",
													borderRadius: "50%",
													backgroundColor: "var(--primary)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: /* @__PURE__ */ jsx(Check, {
													size: 14,
													color: "white"
												})
											}), /* @__PURE__ */ jsx("span", { children: "Secure Local & Global Payments (Integrated)" })]
										}),
										/* @__PURE__ */ jsxs("li", {
											style: {
												display: "flex",
												gap: "12px",
												alignItems: "center"
											},
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													width: "24px",
													height: "24px",
													borderRadius: "50%",
													backgroundColor: "var(--primary)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: /* @__PURE__ */ jsx(Check, {
													size: 14,
													color: "white"
												})
											}), /* @__PURE__ */ jsx("span", { children: "Mobile Dashboard for Real-Time Management" })]
										})
									]
								})]
							}), /* @__PURE__ */ jsx("div", {
								style: {
									flex: "1",
									minWidth: "300px",
									backgroundColor: "rgba(255,255,255,0.05)",
									padding: "48px",
									borderRadius: "32px",
									border: "1px solid rgba(255,255,255,0.1)"
								},
								children: /* @__PURE__ */ jsxs("div", {
									style: { textAlign: "center" },
									children: [
										/* @__PURE__ */ jsx("h3", {
											style: {
												fontSize: "24px",
												fontWeight: "700",
												marginBottom: "8px"
											},
											children: "ZizzyStores Bundle"
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "64px",
												fontWeight: "800",
												color: "#ffffff50",
												marginBottom: "8px"
											},
											children: "₦30k"
										}),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "20px",
												opacity: .6,
												marginBottom: "24px"
											},
											children: "Entire Year ($30)"
										}),
										/* @__PURE__ */ jsx("p", {
											style: {
												fontSize: "15px",
												color: "#ccc",
												marginBottom: "32px"
											},
											children: "Launch your business without breaking the bank. Professional, modern, and high-converting."
										}),
										/* @__PURE__ */ jsx(Link, {
											to: "/auth?mode=signup",
											className: "btn btn-primary",
											style: {
												width: "100%",
												padding: "16px"
											},
											children: "Claim Your Promo Price"
										})
									]
								})
							})]
						})
					})
				}),
				/* @__PURE__ */ jsx("section", {
					style: { padding: "80px 20px" },
					children: /* @__PURE__ */ jsxs("div", {
						className: "container",
						style: {
							maxWidth: "800px",
							margin: "0 auto"
						},
						children: [/* @__PURE__ */ jsx("h2", {
							style: {
								textAlign: "center",
								fontSize: "32px",
								fontWeight: "700",
								marginBottom: "48px"
							},
							children: "Common Questions"
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								flexDirection: "column",
								gap: "24px"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									style: {
										padding: "24px",
										backgroundColor: "var(--bg-gray)",
										borderRadius: "16px"
									},
									children: [/* @__PURE__ */ jsx("h4", {
										style: {
											fontWeight: "700",
											marginBottom: "8px"
										},
										children: "How is it so cheap?"
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "15px",
											color: "var(--text-secondary)"
										},
										children: "We've optimized our infrastructure to offer the best price specifically for small brand owners. We focus on value, not inflated corporate margins."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										padding: "24px",
										backgroundColor: "var(--bg-gray)",
										borderRadius: "16px"
									},
									children: [/* @__PURE__ */ jsx("h4", {
										style: {
											fontWeight: "700",
											marginBottom: "8px"
										},
										children: "Can I use my own domain?"
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "15px",
											color: "var(--text-secondary)"
										},
										children: "Yes! Every plan includes a NEW .top domain, but you can also connect your existing domain seamlessly."
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										padding: "24px",
										backgroundColor: "var(--bg-gray)",
										borderRadius: "16px"
									},
									children: [/* @__PURE__ */ jsx("h4", {
										style: {
											fontWeight: "700",
											marginBottom: "8px"
										},
										children: "Do you support Paystack/Flutterwave?"
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "15px",
											color: "var(--text-secondary)"
										},
										children: "Native support for top-tier gateways means you can accept payments from anyone in Nigeria or globally with ease."
									})]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					style: {
						padding: "80px 20px",
						backgroundColor: "var(--bg-light)"
					},
					children: /* @__PURE__ */ jsxs("div", {
						className: "container",
						style: { textAlign: "center" },
						children: [/* @__PURE__ */ jsx("h2", {
							style: {
								fontSize: "28px",
								fontWeight: "700",
								marginBottom: "24px"
							},
							children: "Explore Other Solutions"
						}), /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								gap: "16px",
								justifyContent: "center",
								flexWrap: "wrap"
							},
							children: [/* @__PURE__ */ jsxs(Link, {
								to: "/create-online-store",
								style: {
									display: "flex",
									alignItems: "center",
									gap: "8px",
									padding: "12px 24px",
									backgroundColor: "white",
									borderRadius: "12px",
									border: "1px solid var(--border-color)",
									textDecoration: "none",
									color: "inherit"
								},
								children: [/* @__PURE__ */ jsx(Rocket, {
									size: 18,
									color: "var(--primary)"
								}), /* @__PURE__ */ jsx("span", { children: "How to Create a Store" })]
							}), /* @__PURE__ */ jsxs(Link, {
								to: "/shopify-alternative",
								style: {
									display: "flex",
									alignItems: "center",
									gap: "8px",
									padding: "12px 24px",
									backgroundColor: "white",
									borderRadius: "12px",
									border: "1px solid var(--border-color)",
									textDecoration: "none",
									color: "inherit"
								},
								children: [/* @__PURE__ */ jsx(Settings, {
									size: 18,
									color: "var(--primary)"
								}), /* @__PURE__ */ jsx("span", { children: "Zizzy vs Shopify" })]
							})]
						})]
					})
				}),
				/* @__PURE__ */ jsx(CTASection, {})
			]
		}),
		/* @__PURE__ */ jsx(Footer, {})
	] })] });
}
//#endregion
export { AffordableEcommerce as default };
