import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { n as Navbar, t as Footer } from "./Footer-CSPDTrks.js";
import { t as CTASection } from "./CTASection-BhNGPTfR.js";
import { t as SEO } from "./SEO-D3I2-QVn.js";
import { t as HowItWorks } from "./HowItWorks-BbQ2qeRb.js";
import "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Layout, Palette, Rocket, Settings, Share2, Sparkles } from "lucide-react";
//#region src/pages/CreatorPlatform.jsx
function CreatorPlatform() {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SEO, {
		title: "Ecommerce for Creators & Creative Brands",
		description: "Build a professional storefront for your creative brand. The most trusted platform for artisans, designers, and creative entrepreneurs to grow their business.",
		keywords: "ecommerce for creators, creative brand platform, launch online store, artist shop platform, boutique ecommerce builder",
		canonical: "https://zizzystores.com/creator-platform"
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
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "inline-flex",
										alignItems: "center",
										gap: "8px",
										padding: "8px 20px",
										borderRadius: "40px",
										backgroundColor: "rgba(8, 156, 255, 0.1)",
										color: "var(--primary)",
										fontWeight: "600",
										marginBottom: "24px"
									},
									children: [/* @__PURE__ */ jsx(Sparkles, { size: 18 }), /* @__PURE__ */ jsx("span", { children: "The Future of Creative Commerce" })]
								}),
								/* @__PURE__ */ jsxs("h1", {
									style: {
										fontSize: "48px",
										fontWeight: "800",
										marginBottom: "24px",
										lineHeight: "1.2"
									},
									children: [
										"Where ",
										/* @__PURE__ */ jsx("span", {
											style: { color: "var(--primary)" },
											children: "Creative Passion"
										}),
										" Meets Business Growth"
									]
								}),
								/* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "18px",
										color: "var(--text-secondary)",
										marginBottom: "32px"
									},
									children: "ZizzyStores is designed for the modern artisan. We provide the professional tools you need to build your boutique brand and sell directly to your audience without the middleman."
								}),
								/* @__PURE__ */ jsx("a", {
									href: "/auth?mode=signup",
									className: "btn btn-primary",
									style: { padding: "12px 32px" },
									children: "Build Your Brand Now"
								})
							]
						})
					})
				}),
				/* @__PURE__ */ jsx("section", {
					id: "creator-features",
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
								children: "Designed Specifically for Creative Brands"
							}), /* @__PURE__ */ jsx("p", {
								style: { color: "var(--text-secondary)" },
								children: "Powerful tools that respect your brand's unique identity."
							})]
						}), /* @__PURE__ */ jsx("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
								gap: "48px 32px"
							},
							children: [
								{
									icon: /* @__PURE__ */ jsx(Palette, { size: 24 }),
									title: "Your Brand, Your Identity",
									description: "Don't settle for a cookie-cutter store. Customize your layout, colors, and fonts to match your creative vision perfectly."
								},
								{
									icon: /* @__PURE__ */ jsx(Share2, { size: 24 }),
									title: "Built-In Social Growth",
									description: "Seamlessly integrate your Instagram, TikTok, and Pinterest feeds to build trust and show off your creative process."
								},
								{
									icon: /* @__PURE__ */ jsx(Sparkles, { size: 24 }),
									title: "Premium User Experience",
									description: "We provide an ultra-clean, high-end shopping experience that elevates your brand and delights your customers."
								},
								{
									icon: /* @__PURE__ */ jsx(Layout, { size: 24 }),
									title: "Powerful Brand Dashboard",
									description: "Manage your inventory, track your orders, and communicate with your customers from one centralized, easy-to-use hub."
								},
								{
									icon: /* @__PURE__ */ jsx(Settings, { size: 24 }),
									title: "Advanced Creator Tools",
									description: "From custom domains to automated email marketing, we give you the professional tools you need to grow."
								},
								{
									icon: /* @__PURE__ */ jsx(Rocket, { size: 24 }),
									title: "Launch in Minutes",
									description: "Forget complex setups. Our intuitive onboarding process means you can have your brand live in under 5 minutes."
								}
							].map((feature, index) => /* @__PURE__ */ jsxs("div", {
								style: { textAlign: "center" },
								children: [
									/* @__PURE__ */ jsx("div", {
										style: {
											width: "64px",
											height: "64px",
											borderRadius: "20px",
											backgroundColor: "white",
											color: "var(--primary)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											marginBottom: "24px",
											margin: "0 auto 24px",
											boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)"
										},
										children: feature.icon
									}),
									/* @__PURE__ */ jsx("h3", {
										style: {
											fontSize: "20px",
											fontWeight: "600",
											marginBottom: "12px"
										},
										children: feature.title
									}),
									/* @__PURE__ */ jsx("p", {
										style: {
											color: "var(--text-secondary)",
											lineHeight: "1.6"
										},
										children: feature.description
									})
								]
							}, index))
						})]
					})
				}),
				/* @__PURE__ */ jsx(HowItWorks, {}),
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
								textAlign: "center",
								maxWidth: "800px",
								margin: "0 auto"
							},
							children: [
								/* @__PURE__ */ jsx("h2", {
									style: {
										fontSize: "36px",
										fontWeight: "700",
										marginBottom: "32px"
									},
									children: "Join a Growing Community of 1,000+ Creators"
								}),
								/* @__PURE__ */ jsx("p", {
									style: {
										fontSize: "18px",
										opacity: .8,
										marginBottom: "40px"
									},
									children: "Join the artists, designers, and creative entrepreneurs who have launched their high-value brands on ZizzyStores. We've helped creators generate over $5M in revenue since our launch."
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "grid",
										gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
										gap: "32px"
									},
									children: [
										/* @__PURE__ */ jsxs("div", {
											style: { textAlign: "center" },
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "32px",
													fontWeight: "800",
													color: "var(--primary)"
												},
												children: "$5M+"
											}), /* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "14px",
													opacity: .6
												},
												children: "Sales Generated"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: { textAlign: "center" },
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "32px",
													fontWeight: "800",
													color: "var(--primary)"
												},
												children: "1,200+"
											}), /* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "14px",
													opacity: .6
												},
												children: "Active Creative Shops"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: { textAlign: "center" },
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "32px",
													fontWeight: "800",
													color: "var(--primary)"
												},
												children: "250k+"
											}), /* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "14px",
													opacity: .6
												},
												children: "Happy Customers"
											})]
										}),
										/* @__PURE__ */ jsxs("div", {
											style: { textAlign: "center" },
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "32px",
													fontWeight: "800",
													color: "var(--primary)"
												},
												children: "99.9%"
											}), /* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "14px",
													opacity: .6
												},
												children: "Platform Uptime"
											})]
										})
									]
								})
							]
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
export { CreatorPlatform as default };
