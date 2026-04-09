import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { n as Navbar, t as Footer } from "./Footer-CSPDTrks.js";
import { t as CTASection } from "./CTASection-BhNGPTfR.js";
import { t as SEO } from "./SEO-D3I2-QVn.js";
import "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BarChart3, CreditCard, Download, Globe, ShieldCheck, Zap } from "lucide-react";
//#region src/pages/SellDigitalGoods.jsx
function SellDigitalGoods() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SEO, {
		title: "Sell Digital Products Online | Best Platform for Digital Downloads",
		description: "Launch your digital storefront in minutes. Sell ebooks, software, templates, and courses with secure payments and instant delivery. Join ZizzyStores today.",
		keywords: "sell digital products, sell ebooks online, digital downloads platform, ecommerce for digital creators, sell software online",
		canonical: "https://zizzystores.com/sell-digital-goods"
	}), /* @__PURE__ */ jsxs(PageTransition, { children: [
		/* @__PURE__ */ jsx(Navbar, {}),
		/* @__PURE__ */ jsxs("main", {
			style: { paddingTop: "100px" },
			children: [
				/* @__PURE__ */ jsx("section", {
					style: {
						padding: "80px 0",
						backgroundColor: "var(--bg-light)"
					},
					children: /* @__PURE__ */ jsx("div", {
						className: "container",
						children: /* @__PURE__ */ jsxs("div", {
							style: {
								textAlign: "center",
								maxWidth: "800px",
								margin: "0 auto",
								marginBottom: "64px"
							},
							children: [
								/* @__PURE__ */ jsxs("h1", {
									style: {
										fontSize: "48px",
										fontWeight: "800",
										marginBottom: "24px",
										lineHeight: "1.1"
									},
									children: [
										"The Ultimate Platform to ",
										/* @__PURE__ */ jsx("span", {
											style: { color: "var(--primary)" },
											children: "Sell Digital Products"
										}),
										" Online"
									]
								}),
								/* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "18px",
										color: "var(--text-secondary)",
										marginBottom: "32px"
									},
									children: "Whether you're selling professional software, creative templates, or educational ebooks, ZizzyStores provides the tools you need to launch, manage, and scale your digital empire."
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "16px",
										justifyContent: "center"
									},
									children: [/* @__PURE__ */ jsx("a", {
										href: "/auth?mode=signup",
										className: "btn btn-primary",
										style: { padding: "12px 32px" },
										children: "Start Selling Now"
									}), /* @__PURE__ */ jsx("a", {
										href: "#benefits",
										className: "btn btn-outline",
										style: { padding: "12px 32px" },
										children: "Explore Features"
									})]
								})
							]
						})
					})
				}),
				/* @__PURE__ */ jsx("section", {
					id: "benefits",
					style: { padding: "100px 0" },
					children: /* @__PURE__ */ jsxs("div", {
						className: "container",
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								textAlign: "center",
								marginBottom: "64px"
							},
							children: [/* @__PURE__ */ jsx("h2", {
								style: {
									fontSize: "32px",
									fontWeight: "700",
									marginBottom: "16px"
								},
								children: "Built for Digital Success"
							}), /* @__PURE__ */ jsx("p", {
								style: { color: "var(--text-secondary)" },
								children: "Everything you need to turn your digital assets into a thriving business."
							})]
						}), /* @__PURE__ */ jsx("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
								gap: "32px"
							},
							children: [
								{
									icon: /* @__PURE__ */ jsx(Zap, { size: 24 }),
									title: "Instant Digital Delivery",
									description: "Automate your sales. Customers receive their downloads immediately after a successful payment, 24/7."
								},
								{
									icon: /* @__PURE__ */ jsx(ShieldCheck, { size: 24 }),
									title: "Secure Payment Processing",
									description: "Accept payments globally with industry-standard security. We support major credit cards and digital wallets."
								},
								{
									icon: /* @__PURE__ */ jsx(Globe, { size: 24 }),
									title: "Global Reach",
									description: "Sell to customers in any country. Your digital storefront is optimized for a worldwide audience."
								},
								{
									icon: /* @__PURE__ */ jsx(Download, { size: 24 }),
									title: "Unlimited Storage",
									description: "Host your digital assets on our secure servers. No limits on file size or the number of products you can list."
								},
								{
									icon: /* @__PURE__ */ jsx(BarChart3, { size: 24 }),
									title: "Advanced Analytics",
									description: "Track your sales, customer behavior, and traffic sources with our intuitive dashboard."
								},
								{
									icon: /* @__PURE__ */ jsx(CreditCard, { size: 24 }),
									title: "Low Transaction Fees",
									description: "Keep more of what you earn. Our transparent pricing model is designed to help your business scale."
								}
							].map((benefit, index) => /* @__PURE__ */ jsxs("div", {
								style: {
									padding: "32px",
									borderRadius: "var(--radius-lg)",
									border: "1px solid var(--border-color)",
									backgroundColor: "white",
									transition: "transform 0.3s ease, box-shadow 0.3s ease"
								},
								className: "hover-card",
								children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											width: "48px",
											height: "48px",
											borderRadius: "12px",
											backgroundColor: "rgba(8, 156, 255, 0.1)",
											color: "var(--primary)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											marginBottom: "24px"
										},
										children: benefit.icon
									}),
									/* @__PURE__ */ jsx("h3", {
										style: {
											fontSize: "20px",
											fontWeight: "600",
											marginBottom: "12px"
										},
										children: benefit.title
									}),
									/* @__PURE__ */ jsx("p", {
										style: {
											color: "var(--text-secondary)",
											lineHeight: "1.6"
										},
										children: benefit.description
									})
								]
							}, index))
						})]
					})
				}),
				/* @__PURE__ */ jsx("section", {
					style: {
						padding: "100px 0",
						backgroundColor: "var(--bg-dark)",
						color: "white"
					},
					children: /* @__PURE__ */ jsx("div", {
						className: "container",
						children: /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								flexWrap: "wrap",
								alignItems: "center",
								gap: "64px"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									flex: "1",
									minWidth: "300px"
								},
								children: [
									/* @__PURE__ */ jsx("h2", {
										style: {
											fontSize: "36px",
											fontWeight: "700",
											marginBottom: "24px"
										},
										children: "What Can You Sell on ZizzyStores?"
									}),
									/* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "18px",
											opacity: .8,
											marginBottom: "32px"
										},
										children: "Our platform is versatile enough to handle any digital file type. Creators around the world use us to sell:"
									}),
									/* @__PURE__ */ jsxs("ul", {
										style: {
											listStyle: "none",
											padding: 0,
											display: "grid",
											gridTemplateColumns: "1fr 1fr",
											gap: "16px"
										},
										children: [
											/* @__PURE__ */ jsxs("li", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "12px"
												},
												children: [/* @__PURE__ */ jsx("div", { style: {
													width: "8px",
													height: "8px",
													borderRadius: "50%",
													backgroundColor: "var(--primary)"
												} }), "Ebooks & PDFs"]
											}),
											/* @__PURE__ */ jsxs("li", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "12px"
												},
												children: [/* @__PURE__ */ jsx("div", { style: {
													width: "8px",
													height: "8px",
													borderRadius: "50%",
													backgroundColor: "var(--primary)"
												} }), "Software & Scripts"]
											}),
											/* @__PURE__ */ jsxs("li", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "12px"
												},
												children: [/* @__PURE__ */ jsx("div", { style: {
													width: "8px",
													height: "8px",
													borderRadius: "50%",
													backgroundColor: "var(--primary)"
												} }), "Design Assets"]
											}),
											/* @__PURE__ */ jsxs("li", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "12px"
												},
												children: [/* @__PURE__ */ jsx("div", { style: {
													width: "8px",
													height: "8px",
													borderRadius: "50%",
													backgroundColor: "var(--primary)"
												} }), "Online Courses"]
											}),
											/* @__PURE__ */ jsxs("li", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "12px"
												},
												children: [/* @__PURE__ */ jsx("div", { style: {
													width: "8px",
													height: "8px",
													borderRadius: "50%",
													backgroundColor: "var(--primary)"
												} }), "Stock Photography"]
											}),
											/* @__PURE__ */ jsxs("li", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "12px"
												},
												children: [/* @__PURE__ */ jsx("div", { style: {
													width: "8px",
													height: "8px",
													borderRadius: "50%",
													backgroundColor: "var(--primary)"
												} }), "Audio & Music"]
											})
										]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									flex: "1",
									minWidth: "300px",
									backgroundColor: "rgba(255,255,255,0.05)",
									padding: "40px",
									borderRadius: "24px",
									border: "1px solid rgba(255,255,255,0.1)"
								},
								children: [/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "24px",
										marginBottom: "16px"
									},
									children: "\"ZizzyStores has completely automated my ebook sales. I've sold to customers in over 30 countries without lifting a finger.\""
								}), /* @__PURE__ */ jsx("p", {
									style: {
										fontWeight: "600",
										color: "var(--primary)"
									},
									children: "— Marcus Chen, Digital Author"
								})]
							})]
						})
					})
				}),
				/* @__PURE__ */ jsx(CTASection, {})
			]
		}),
		/* @__PURE__ */ jsx(Footer, {})
	] })] });
}
//#endregion
export { SellDigitalGoods as default };
