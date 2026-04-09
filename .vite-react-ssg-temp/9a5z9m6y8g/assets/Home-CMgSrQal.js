import { n as motion, t as PageTransition } from "./PageTransition-8IvNPEDC.js";
import { n as supabase } from "./supabase-DvwDzIWb.js";
import { t as useAuth } from "./useAuth-BrrkS1Z-.js";
import { t as createLucideIcon } from "./createLucideIcon-D9kzrCV5.js";
import { t as ArrowRight } from "./arrow-right-DN0ZYJFf.js";
import { t as ChevronDown } from "./chevron-down-Dz5iImA4.js";
import { t as CircleCheck } from "./circle-check-DbL_-DIu.js";
import { t as CreditCard } from "./credit-card-CoPr4Y3u.js";
import { t as Globe } from "./globe-ByFpp4g5.js";
import { t as HowItWorks } from "./HowItWorks-Dts9p51T.js";
import { t as Headphones } from "./headphones-sPhKUZil.js";
import { t as LayoutDashboard } from "./layout-dashboard-zaRWgB4V.js";
import { t as LayoutGrid } from "./layout-grid-w93TTKVH.js";
import { n as Navbar, t as Footer } from "./Footer-CASFpsLC.js";
import { t as MessageCircle } from "./message-circle-mj3Lnc5B.js";
import { t as CTASection } from "./CTASection-C1Xz8rN2.js";
import { t as ShieldCheck } from "./shield-check-ClSEqKJ8.js";
import { t as ShoppingBag } from "./shopping-bag-CMby-eB0.js";
import { t as Smartphone } from "./smartphone-DkryQCv5.js";
import { t as Store } from "./store-B3WEKiK2.js";
import { t as SEO } from "./SEO-Ra22bWq2.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
var ChevronUp = createLucideIcon("chevron-up", [["path", {
	d: "m18 15-6-6-6 6",
	key: "153udz"
}]]);
var Star = createLucideIcon("star", [["path", {
	d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
	key: "r04s7s"
}]]);
//#endregion
//#region src/components/Hero.jsx
function Hero() {
	const { user } = useAuth();
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: .15,
				delayChildren: .2
			}
		}
	};
	const itemVariants = {
		hidden: {
			opacity: 0,
			y: 30
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: .8,
				ease: [
					.16,
					1,
					.3,
					1
				]
			}
		}
	};
	return /* @__PURE__ */ jsx("section", {
		className: "hero",
		children: /* @__PURE__ */ jsxs("div", {
			className: "container hero-content",
			children: [/* @__PURE__ */ jsxs(motion.div, {
				className: "hero-text",
				variants: containerVariants,
				initial: "hidden",
				animate: "visible",
				children: [
					/* @__PURE__ */ jsx(motion.div, {
						variants: itemVariants,
						style: {
							display: "inline-block",
							padding: "6px 16px",
							backgroundColor: "#F3F4F6",
							borderRadius: "20px",
							fontSize: "12px",
							fontWeight: "700",
							marginBottom: "24px",
							letterSpacing: "0.05em",
							color: "var(--primary)"
						},
						children: "PREMIUM E-COMMERCE PLATFORM"
					}),
					/* @__PURE__ */ jsxs(motion.h1, {
						variants: itemVariants,
						className: "hero-title",
						children: ["Launch Your Brand Online ", /* @__PURE__ */ jsx("span", {
							style: {
								display: "block",
								color: "var(--text-muted)",
								fontSize: "0.6em",
								marginTop: "8px"
							},
							children: "in Less Than 24 Hours."
						})]
					}),
					/* @__PURE__ */ jsx(motion.p, {
						variants: itemVariants,
						className: "hero-subtitle",
						children: "Get a high-performance storefront and your own custom domain for just ₦30,000. No technical skills required."
					}),
					/* @__PURE__ */ jsx(motion.div, {
						variants: itemVariants,
						className: "hero-actions",
						children: user ? /* @__PURE__ */ jsx(Link, {
							to: "/dashboard",
							className: "hero-btn-wrapper",
							children: /* @__PURE__ */ jsxs(motion.button, {
								whileHover: {
									scale: 1.02,
									y: -2
								},
								whileTap: { scale: .98 },
								className: "btn btn-primary hero-btn",
								children: [
									/* @__PURE__ */ jsx(LayoutGrid, { size: 20 }),
									" Go to Dashboard ",
									/* @__PURE__ */ jsx(ArrowRight, { size: 18 })
								]
							})
						}) : /* @__PURE__ */ jsx(Link, {
							to: "/auth",
							className: "hero-btn-wrapper",
							children: /* @__PURE__ */ jsxs(motion.button, {
								whileHover: {
									scale: 1.02,
									y: -2
								},
								whileTap: { scale: .98 },
								className: "btn btn-primary hero-btn",
								children: ["Start Your Journey ", /* @__PURE__ */ jsx(ArrowRight, {
									size: 18,
									style: { marginLeft: "8px" }
								})]
							})
						})
					}),
					/* @__PURE__ */ jsxs(motion.div, {
						variants: itemVariants,
						className: "hero-promo",
						children: [/* @__PURE__ */ jsx("div", {
							className: "promo-item urgent",
							children: /* @__PURE__ */ jsx(motion.span, {
								animate: { opacity: [
									1,
									.5,
									1
								] },
								transition: {
									duration: 2,
									repeat: Infinity
								},
								children: "🔥 40% OFF ends soon!"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "promo-item",
							children: [/* @__PURE__ */ jsx(CircleCheck, {
								size: 16,
								color: "#10B981"
							}), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", { children: "₦30,000" }), " (First Year) — Full Setup Included"] })]
						})]
					}),
					/* @__PURE__ */ jsxs(motion.div, {
						variants: itemVariants,
						className: "hero-partners",
						children: [/* @__PURE__ */ jsx("div", {
							className: "partners-label",
							children: "Trusted Security Partners"
						}), /* @__PURE__ */ jsxs("div", {
							className: "partners-list",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "partner-logo",
									children: /* @__PURE__ */ jsx("img", {
										src: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png",
										alt: "Paystack"
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "partner-logo",
									children: /* @__PURE__ */ jsx("img", {
										src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flutterwave_Logo.png/1280px-Flutterwave_Logo.png",
										alt: "Flutterwave"
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "partner-logo ssl",
									children: [/* @__PURE__ */ jsx(ShieldCheck, {
										size: 22,
										color: "#10B981"
									}), "SSL secured"]
								})
							]
						})]
					})
				]
			}), /* @__PURE__ */ jsxs(motion.div, {
				className: "hero-visual",
				variants: {
					hidden: {
						opacity: 0,
						scale: .95,
						x: 20
					},
					visible: {
						opacity: 1,
						scale: 1,
						x: 0,
						transition: {
							duration: 1,
							ease: [
								.16,
								1,
								.3,
								1
							],
							delay: .4
						}
					}
				},
				initial: "hidden",
				animate: "visible",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "dashboard-mockup",
						style: {
							padding: 0,
							overflow: "hidden",
							border: "none",
							background: "none",
							boxShadow: "0 50px 100px -20px rgba(0,0,0,0.15)"
						},
						children: /* @__PURE__ */ jsx("img", {
							src: "https://raw.githubusercontent.com/Blvck4K/Jss-png/refs/heads/main/replace.png",
							alt: "Dashboard Preview",
							style: {
								width: "100%",
								height: "auto",
								borderRadius: "var(--radius-lg)",
								display: "block"
							}
						})
					}),
					/* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							delay: 1,
							duration: .6
						},
						className: "floating-badge",
						children: [/* @__PURE__ */ jsx("div", {
							className: "badge-icon",
							children: /* @__PURE__ */ jsx(CircleCheck, {
								size: 24,
								color: "#10B981"
							})
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "badge-title",
							children: "Free Domain Name"
						}), /* @__PURE__ */ jsx("div", {
							className: "badge-subtitle",
							children: "Fully automated setup"
						})] })]
					}),
					/* @__PURE__ */ jsx(motion.div, {
						animate: { y: [
							0,
							-10,
							0
						] },
						transition: {
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut"
						},
						style: {
							position: "absolute",
							top: "-20px",
							right: "-20px",
							width: "40px",
							height: "40px",
							borderRadius: "50%",
							backgroundColor: "#09A5DB22",
							zIndex: -1
						}
					}),
					/* @__PURE__ */ jsx(motion.div, {
						animate: { y: [
							0,
							15,
							0
						] },
						transition: {
							duration: 5,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 1
						},
						style: {
							position: "absolute",
							bottom: "40px",
							left: "-30px",
							width: "60px",
							height: "60px",
							borderRadius: "50%",
							backgroundColor: "#10B98111",
							zIndex: -1
						}
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/Features.jsx
function Features() {
	const features = [
		{
			icon: /* @__PURE__ */ jsx(Store, { size: 24 }),
			title: "Custom store website",
			description: "A beautifully designed, fully functional e-commerce platform tailored perfectly to your brand."
		},
		{
			icon: /* @__PURE__ */ jsx(CreditCard, { size: 24 }),
			title: "Payment integration",
			description: "Secure, seamless payment gateways configured to process your sales globally with zero friction."
		},
		{
			icon: /* @__PURE__ */ jsx(Globe, { size: 24 }),
			title: "Free domain (.top)",
			description: "Establish your brand identity online immediately with a complimentary .top domain name included."
		},
		{
			icon: /* @__PURE__ */ jsx(Smartphone, { size: 24 }),
			title: "Mobile-friendly design",
			description: "Optimized shopping experiences across all devices, capturing customers wherever they browse."
		},
		{
			icon: /* @__PURE__ */ jsx(LayoutDashboard, { size: 24 }),
			title: "Admin dashboard",
			description: "A powerful, intuitive backend panel to manage your orders, inventory, and customers effortlessly."
		},
		{
			icon: /* @__PURE__ */ jsx(Headphones, { size: 24 }),
			title: "Expert Support",
			description: "Dedicated account managers and technical team to guide you through setup, deployment, and post-sale operations."
		}
	];
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: .1 }
		}
	};
	const cardVariants = {
		hidden: {
			opacity: 0,
			y: 30
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: .6,
				ease: "easeOut"
			}
		}
	};
	return /* @__PURE__ */ jsx("section", {
		className: "features-section",
		children: /* @__PURE__ */ jsxs("div", {
			className: "container",
			children: [/* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					margin: "-100px"
				},
				transition: { duration: .6 },
				className: "section-head",
				children: [/* @__PURE__ */ jsx("h2", { children: "Value Built Into Every Setup" }), /* @__PURE__ */ jsx("p", {
					className: "text-secondary",
					children: "Architecting a faster way to launch digital retail."
				})]
			}), /* @__PURE__ */ jsx(motion.div, {
				variants: containerVariants,
				initial: "hidden",
				whileInView: "visible",
				viewport: {
					once: true,
					margin: "-100px"
				},
				className: "grid grid-cols-3 gap-6",
				children: features.map((feature, i) => /* @__PURE__ */ jsxs(motion.div, {
					variants: cardVariants,
					whileHover: {
						y: -8,
						boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)"
					},
					className: "feature-card",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "icon-wrapper",
							children: feature.icon
						}),
						/* @__PURE__ */ jsx("h3", { children: feature.title }),
						/* @__PURE__ */ jsx("p", { children: feature.description })
					]
				}, i))
			})]
		})
	});
}
//#endregion
//#region src/components/Reviews.jsx
function Reviews() {
	return /* @__PURE__ */ jsxs("section", {
		className: "reviews-section",
		style: {
			padding: "80px 0",
			backgroundColor: "var(--bg-light)",
			overflow: "hidden"
		},
		children: [/* @__PURE__ */ jsx("div", {
			className: "container",
			children: /* @__PURE__ */ jsxs("div", {
				style: {
					textAlign: "center",
					marginBottom: "48px"
				},
				children: [/* @__PURE__ */ jsx("h2", {
					style: {
						fontSize: "32px",
						fontWeight: "700",
						marginBottom: "16px"
					},
					children: "What Our Clients Say"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-secondary",
					children: "Join hundreds of successful brand owners who trust ZizzyStores."
				})]
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "reviews-scroll-container",
			children: /* @__PURE__ */ jsx("div", {
				className: "reviews-track",
				children: [
					{
						name: "Spots Blvck",
						brand: "Brand Owner",
						text: "ZizzyStores made getting our boutique online incredibly easy. The 40% discount was a lifesaver and the site looks premium."
					},
					{
						name: "Raggs.",
						brand: "Brand Owner",
						text: "I was amazed by how fast my electronics store was launched. Full stack and domain included perfectly as promised."
					},
					{
						name: "M3thods.",
						brand: "Brand Owner",
						text: "The expert support really walked me through the process. My sales have doubled since moving to the new custom platform."
					},
					{
						name: "Astraclothes.",
						brand: "Brand Owner",
						text: "Highly recommended. Secure, fast, and exactly what my business needed. They took care of the domain hassle completely."
					},
					{
						name: "Pop Steeze",
						brand: "Brand Owner",
						text: "I paid ₦50,000 and the value I received is honestly worth ten times that. Best decision for my fashion business."
					}
				].map((review, i) => /* @__PURE__ */ jsxs("div", {
					className: "review-card",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "flex gap-1",
							style: {
								color: "#F59E0B",
								marginBottom: "16px"
							},
							children: [...Array(5)].map((_, j) => /* @__PURE__ */ jsx(Star, {
								size: 16,
								fill: "currentColor"
							}, j))
						}),
						/* @__PURE__ */ jsxs("p", {
							style: {
								fontSize: "14px",
								lineHeight: "1.6",
								marginBottom: "24px",
								flex: 1,
								color: "var(--text-secondary)"
							},
							children: [
								"\"",
								review.text,
								"\""
							]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-bold",
							children: review.name
						}), /* @__PURE__ */ jsx("div", {
							className: "text-muted",
							style: {
								fontSize: "12px",
								fontWeight: "bold"
							},
							children: review.brand
						})] })
					]
				}, i))
			})
		})]
	});
}
//#endregion
//#region src/components/Packages.jsx
function Packages() {
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
		async function fetchBrands() {
			try {
				const { data, error } = await supabase.from("brand_profiles").select("*").limit(3).order("created_at", { ascending: false });
				if (error) throw error;
				setBrands(data || []);
			} catch (err) {
				console.error("Error fetching brands:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchBrands();
	}, []);
	if (loading) return null;
	return /* @__PURE__ */ jsx("section", {
		className: "packages-section",
		id: "solutions",
		children: /* @__PURE__ */ jsxs("div", {
			className: "container",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-center",
				style: {
					marginBottom: "48px",
					flexDirection: window.innerWidth <= 768 ? "column" : "row",
					textAlign: window.innerWidth <= 768 ? "center" : "left",
					gap: "20px"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					style: {
						fontSize: "32px",
						fontWeight: "800",
						marginBottom: "12px"
					},
					children: "Brands Of the Month"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-secondary",
					style: { fontSize: "14px" },
					children: "Premium Stores enjoying active growth via ZizzyStores."
				})] }), /* @__PURE__ */ jsxs("a", {
					href: "#all",
					className: "font-bold flex items-center gap-2",
					style: {
						fontSize: "14px",
						color: "var(--text-muted)"
					},
					children: ["View All Brands ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-3 gap-6",
				children: brands.map((brand, i) => /* @__PURE__ */ jsxs("div", {
					className: "package-card",
					onClick: () => navigate(`/shop-brand/${brand.id}`),
					style: { cursor: "pointer" },
					children: [/* @__PURE__ */ jsx("div", {
						className: "package-img",
						style: {
							overflow: "hidden",
							display: "flex",
							alignItems: "center",
							justifyContent: "center"
						},
						children: brand.logo_url ? /* @__PURE__ */ jsx("img", {
							src: brand.logo_url,
							alt: brand.brand_name,
							style: {
								width: "100%",
								height: "100%",
								objectFit: "cover"
							}
						}) : /* @__PURE__ */ jsx(ShoppingBag, {
							size: 48,
							opacity: .2
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "package-content",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-start",
								style: { marginBottom: "16px" },
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
									style: {
										fontSize: "18px",
										fontWeight: "700"
									},
									children: brand.brand_name || "New Brand"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-muted",
									style: {
										fontSize: "10px",
										fontWeight: "600",
										letterSpacing: "0.05em",
										textTransform: "uppercase"
									},
									children: brand.category || "RETAIL • COMMERCE"
								})] }), /* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "4px",
										color: "black",
										padding: "4px 8px",
										borderRadius: "4px",
										fontSize: "10px",
										fontWeight: "700"
									},
									children: /* @__PURE__ */ jsx(CircleCheck, {
										size: 25,
										strokeWidth: 3
									})
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between items-center",
								style: { marginBottom: "24px" },
								children: [/* @__PURE__ */ jsx("div", {
									className: "package-price",
									children: "Live Site"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-muted",
									style: { fontSize: "12px" },
									children: "Active Setup"
								})]
							}),
							/* @__PURE__ */ jsx("button", {
								className: "btn btn-outline",
								style: {
									width: "100%",
									marginTop: "24px"
								},
								onClick: (e) => {
									e.stopPropagation();
									navigate(`/shop-brand/${brand.id}`);
								},
								children: "Shop Now"
							})
						]
					})]
				}, brand.id || i))
			})]
		})
	});
}
//#endregion
//#region src/components/FAQ.jsx
function FAQ() {
	const faqs = [
		{
			q: "Do I own my website?",
			a: "Yes, absolutely. You retain 100% ownership of your website and your custom domain name for this year. We simply handle the heavy lifting of building and launching it."
		},
		{
			q: "Can I connect payment gateways?",
			a: "Yes! We have already seamlessly integrate local gateways like Paystack and Flutterwave, so you can receive payments securely and directly with no percentage taken from your sales."
		},
		{
			q: "How long does setup take?",
			a: "We pride ourselves on lightning-fast delivery. Your entire e-commerce store and domain will be fully set up and ready to accept orders within 24 hours of payment."
		},
		{
			q: "Can I manage it myself?",
			a: "Yes, your store comes with a beautifully customized, user-friendly admin dashboard. You will be able to easily add products, track inventory, process orders, and manage customers effortlessly."
		}
	];
	const [openIndex, setOpenIndex] = useState(0);
	return /* @__PURE__ */ jsx("section", {
		className: "faq-section",
		id: "faq",
		style: {
			padding: "80px 0",
			backgroundColor: "var(--bg-white)"
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "container",
			style: { maxWidth: "800px" },
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					textAlign: "center",
					marginBottom: "48px"
				},
				children: [/* @__PURE__ */ jsx("h2", {
					style: {
						fontSize: "32px",
						fontWeight: "700",
						marginBottom: "16px"
					},
					children: "Frequently Asked Questions"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-secondary",
					children: "Everything you need to know about getting your brand online."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "faq-list",
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "16px"
				},
				children: faqs.map((faq, i) => /* @__PURE__ */ jsxs("div", {
					className: "faq-item",
					style: {
						border: "1px solid var(--border-color)",
						borderRadius: "8px",
						overflow: "hidden"
					},
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => setOpenIndex(openIndex === i ? -1 : i),
						style: {
							width: "100%",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							padding: window.innerWidth <= 768 ? "16px 20px" : "24px",
							backgroundColor: "transparent",
							border: "none",
							cursor: "pointer",
							textAlign: "left",
							fontWeight: "800",
							fontSize: window.innerWidth <= 768 ? "14px" : "16px",
							color: "var(--bg-dark)"
						},
						children: [faq.q, openIndex === i ? /* @__PURE__ */ jsx(ChevronUp, {
							size: 18,
							className: "text-muted"
						}) : /* @__PURE__ */ jsx(ChevronDown, {
							size: 18,
							className: "text-muted"
						})]
					}), openIndex === i && /* @__PURE__ */ jsx("div", {
						style: {
							padding: "0 24px 24px",
							color: "var(--text-secondary)",
							lineHeight: "1.6"
						},
						children: faq.a
					})]
				}, i))
			})]
		})
	});
}
//#endregion
//#region src/pages/Home.jsx
function Home() {
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(SEO, {
		title: "ZizzyStores | Launch Your Professional Online Store in 5 Minutes",
		description: "The easiest way to create an online store in Nigeria and beyond. Launch your boutique brand with a professional storefront for only ₦30,000 / $30 for the first year."
	}), /* @__PURE__ */ jsxs(PageTransition, { children: [
		/* @__PURE__ */ jsx(Navbar, {}),
		/* @__PURE__ */ jsx(Hero, {}),
		/* @__PURE__ */ jsx(Features, {}),
		/* @__PURE__ */ jsx(HowItWorks, {}),
		/* @__PURE__ */ jsx(Reviews, {}),
		/* @__PURE__ */ jsx(Packages, {}),
		/* @__PURE__ */ jsx(FAQ, {}),
		/* @__PURE__ */ jsx(CTASection, {}),
		/* @__PURE__ */ jsx(Footer, {}),
		/* @__PURE__ */ jsx("div", {
			style: {
				position: "fixed",
				bottom: "32px",
				right: "32px",
				backgroundColor: "#089cff",
				color: "white",
				width: "64px",
				height: "64px",
				borderRadius: "50%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				cursor: "pointer",
				boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
				zIndex: 1e3,
				transition: "transform 0.2s ease"
			},
			onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)",
			onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)",
			children: /* @__PURE__ */ jsx(MessageCircle, { size: 32 })
		})
	] })] });
}
//#endregion
export { Home as default };
