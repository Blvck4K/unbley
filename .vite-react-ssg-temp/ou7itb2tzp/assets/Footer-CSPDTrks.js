import { n as supabase } from "./supabase-CTgwDjry.js";
import { t as useAuth } from "./useAuth-DY4X98To.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { LayoutGrid, LogIn, Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
//#region src/components/Navbar.jsx
function Navbar() {
	const [search, setSearch] = useState("");
	const [scrolled, setScrolled] = useState(false);
	const navigate = useNavigate();
	const { user, signOut } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	const handleLogout = async () => {
		await signOut();
		navigate("/");
		setIsMenuOpen(false);
	};
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 768);
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("resize", handleResize);
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	const handleSearch = async (e) => {
		if (e.key === "Enter" && search.trim()) try {
			const { data, error } = await supabase.from("brand_profiles").select("id").ilike("brand_name", `%${search}%`).limit(1).single();
			if (data) {
				navigate(`/shop-brand/${data.id}`);
				setIsMenuOpen(false);
			} else alert("Brand not found. Try searching by their exact name or domain!");
		} catch (err) {
			console.error("Search failed:", err);
			alert("Brand not found.");
		}
	};
	return /* @__PURE__ */ jsxs(motion.nav, {
		initial: { y: -100 },
		animate: { y: 0 },
		className: "navbar",
		style: {
			height: "72px",
			backgroundColor: scrolled ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.95)",
			boxShadow: scrolled ? "0 10px 30px -10px rgba(0,0,0,0.1)" : "none",
			transition: "all 0.3s ease"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			className: "container flex justify-between items-center",
			style: {
				width: "100%",
				height: "100%"
			},
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				style: {
					width: isMobile ? "100%" : "auto",
					gap: isMobile ? "0" : "32px"
				},
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "font-bold flex items-center gap-2",
					onClick: () => setIsMenuOpen(false),
					style: {
						fontSize: "20px",
						letterSpacing: "-0.03em",
						color: "inherit",
						textDecoration: "none"
					},
					children: /* @__PURE__ */ jsx(motion.span, {
						whileHover: { scale: 1.05 },
						transition: {
							type: "spring",
							stiffness: 400,
							damping: 10
						},
						children: "ZizzyStores."
					})
				}), isMobile && /* @__PURE__ */ jsx("button", {
					onClick: () => setIsMenuOpen(!isMenuOpen),
					style: {
						background: "none",
						color: "inherit",
						cursor: "pointer",
						padding: "8px"
					},
					children: /* @__PURE__ */ jsx(AnimatePresence, {
						mode: "wait",
						children: isMenuOpen ? /* @__PURE__ */ jsx(motion.div, {
							initial: {
								rotate: -90,
								opacity: 0
							},
							animate: {
								rotate: 0,
								opacity: 1
							},
							exit: {
								rotate: 90,
								opacity: 0
							},
							children: /* @__PURE__ */ jsx(X, { size: 24 })
						}, "close") : /* @__PURE__ */ jsx(motion.div, {
							initial: {
								rotate: 90,
								opacity: 0
							},
							animate: {
								rotate: 0,
								opacity: 1
							},
							exit: {
								rotate: -90,
								opacity: 0
							},
							children: /* @__PURE__ */ jsx(Menu, { size: 24 })
						}, "menu")
					})
				})]
			}), !isMobile && /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: { position: "relative" },
						onMouseEnter: () => setIsSolutionsOpen(true),
						onMouseLeave: () => setIsSolutionsOpen(false),
						children: [/* @__PURE__ */ jsxs("button", {
							className: "flex items-center gap-1 font-semibold",
							style: {
								background: "none",
								border: "none",
								cursor: "pointer",
								padding: "12px 0"
							},
							children: ["Solutions", /* @__PURE__ */ jsx(motion.span, {
								animate: { rotate: isSolutionsOpen ? 180 : 0 },
								children: /* @__PURE__ */ jsx("svg", {
									width: "10",
									height: "6",
									viewBox: "0 0 10 6",
									fill: "none",
									children: /* @__PURE__ */ jsx("path", {
										d: "M1 1L5 5L9 1",
										stroke: "currentColor",
										strokeWidth: "1.5",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})
								})
							})]
						}), /* @__PURE__ */ jsx(AnimatePresence, { children: isSolutionsOpen && /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								y: 10
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: {
								opacity: 0,
								y: 10
							},
							style: {
								position: "absolute",
								top: "100%",
								left: "-20px",
								width: "260px",
								backgroundColor: "white",
								borderRadius: "var(--radius-lg)",
								boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
								padding: "16px",
								border: "1px solid var(--border-color)",
								zIndex: 1e3
							},
							children: [
								/* @__PURE__ */ jsxs(Link, {
									to: "/sell-digital-products",
									className: "solutions-item",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold",
										children: "Digital Products"
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "11px",
											color: "var(--text-secondary)",
											margin: 0
										},
										children: "Ebooks, software, and courses."
									})]
								}),
								/* @__PURE__ */ jsxs(Link, {
									to: "/creator-platform",
									className: "solutions-item",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold",
										children: "Creative Brands"
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "11px",
											color: "var(--text-secondary)",
											margin: 0
										},
										children: "Artisans and boutique shops."
									})]
								}),
								/* @__PURE__ */ jsx("div", { style: {
									borderTop: "1px solid var(--border-color)",
									margin: "8px 0"
								} }),
								/* @__PURE__ */ jsxs(Link, {
									to: "/create-online-store",
									className: "solutions-item",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold",
										children: "Create Store"
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "11px",
											color: "var(--text-secondary)",
											margin: 0
										},
										children: "Launch in under 5 minutes."
									})]
								}),
								/* @__PURE__ */ jsxs(Link, {
									to: "/shopify-alternative",
									className: "solutions-item",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold",
										children: "Shopify Alternative"
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "11px",
											color: "var(--text-secondary)",
											margin: 0
										},
										children: "Save thousands in yearly fees."
									})]
								}),
								/* @__PURE__ */ jsxs(Link, {
									to: "/affordable-ecommerce-platform",
									className: "solutions-item",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold",
										children: "Price & Value"
									}), /* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "11px",
											color: "var(--text-secondary)",
											margin: 0
										},
										children: "High value for any budget."
									})]
								}),
								/* @__PURE__ */ jsx("style", { children: `
                      .solutions-item {
                        display: block;
                        padding: 12px;
                        border-radius: var(--radius-md);
                        transition: background 0.2s ease;
                        text-decoration: none;
                        color: inherit;
                      }
                      .solutions-item:hover {
                        background-color: var(--bg-gray);
                      }
                    ` })
							]
						}) })]
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/all-blogs",
						className: "font-semibold transition-colors duration-200 hover:text-primary",
						style: {
							fontSize: "14px",
							textDecoration: "none",
							color: "inherit",
							padding: "12px 0"
						},
						children: "Blog"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						style: {
							background: "var(--bg-gray)",
							padding: "8px 16px",
							borderRadius: "var(--radius-md)"
						},
						children: [/* @__PURE__ */ jsx(Search, {
							size: 16,
							className: "text-muted"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Search stores...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							onKeyDown: handleSearch,
							style: {
								background: "transparent",
								border: "none",
								outline: "none",
								fontSize: "14px",
								width: "160px"
							}
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-4",
						children: user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
							to: "/dashboard",
							className: "font-semibold",
							style: {
								fontSize: "14px",
								textDecoration: "none",
								color: "inherit"
							},
							children: "Dashboard"
						}), /* @__PURE__ */ jsx(motion.button, {
							whileHover: { scale: 1.02 },
							whileTap: { scale: .98 },
							onClick: handleLogout,
							className: "btn btn-outline",
							style: {
								fontSize: "14px",
								padding: "8px 16px"
							},
							children: "Logout"
						})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
							to: "/auth?mode=signin",
							className: "font-semibold",
							style: {
								fontSize: "14px",
								textDecoration: "none",
								color: "inherit"
							},
							children: "Sign In"
						}), /* @__PURE__ */ jsx(motion.div, {
							whileHover: { y: -2 },
							whileTap: { y: 0 },
							children: /* @__PURE__ */ jsx(Link, {
								to: "/auth?mode=signup",
								className: "btn btn-primary",
								style: { textDecoration: "none" },
								children: "Get Started"
							})
						})] })
					})
				]
			})]
		}), /* @__PURE__ */ jsx(AnimatePresence, { children: isMobile && isMenuOpen && /* @__PURE__ */ jsx(motion.div, {
			initial: {
				opacity: 0,
				height: 0
			},
			animate: {
				opacity: 1,
				height: "auto"
			},
			exit: {
				opacity: 0,
				height: 0
			},
			style: {
				position: "absolute",
				top: "72px",
				left: 0,
				right: 0,
				backgroundColor: "#FFF",
				borderBottom: "1px solid var(--border-color)",
				overflow: "hidden",
				zIndex: 99
			},
			children: /* @__PURE__ */ jsxs("div", {
				className: "container flex flex-col gap-6",
				style: { padding: "24px 20px" },
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "font-bold",
								style: {
									fontSize: "14px",
									color: "var(--text-secondary)",
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									marginBottom: "8px"
								},
								children: "Solutions"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/sell-digital-products",
								onClick: () => setIsMenuOpen(false),
								className: "font-semibold",
								style: { fontSize: "15px" },
								children: "Sell Digital Products"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/creator-platform",
								onClick: () => setIsMenuOpen(false),
								className: "font-semibold",
								style: { fontSize: "15px" },
								children: "Creative Brands"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/create-online-store",
								onClick: () => setIsMenuOpen(false),
								className: "font-semibold",
								style: { fontSize: "15px" },
								children: "Create Online Store"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/shopify-alternative",
								onClick: () => setIsMenuOpen(false),
								className: "font-semibold",
								style: { fontSize: "15px" },
								children: "Shopify Alternative"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/affordable-ecommerce-platform",
								onClick: () => setIsMenuOpen(false),
								className: "font-semibold",
								style: { fontSize: "15px" },
								children: "Affordable Ecommerce"
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/all-blogs",
								onClick: () => setIsMenuOpen(false),
								className: "font-semibold",
								style: {
									fontSize: "15px",
									color: "var(--primary)"
								},
								children: "Blog"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						style: {
							background: "var(--bg-gray)",
							padding: "12px 16px",
							borderRadius: "var(--radius-md)"
						},
						children: [/* @__PURE__ */ jsx(Search, {
							size: 18,
							className: "text-muted"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Search stores...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							onKeyDown: handleSearch,
							style: {
								background: "transparent",
								border: "none",
								outline: "none",
								fontSize: "16px",
								width: "100%"
							}
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex flex-col gap-4",
						children: user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Link, {
							to: "/dashboard",
							onClick: () => setIsMenuOpen(false),
							className: "font-semibold flex items-center gap-3",
							style: {
								fontSize: "16px",
								padding: "12px 0"
							},
							children: [/* @__PURE__ */ jsx(LayoutGrid, { size: 20 }), "Dashboard"]
						}), /* @__PURE__ */ jsx("button", {
							onClick: handleLogout,
							className: "btn btn-outline",
							style: {
								width: "100%",
								padding: "12px"
							},
							children: "Logout"
						})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Link, {
							to: "/auth?mode=signin",
							onClick: () => setIsMenuOpen(false),
							className: "font-semibold flex items-center gap-3",
							style: {
								fontSize: "16px",
								padding: "12px 0"
							},
							children: [/* @__PURE__ */ jsx(LogIn, { size: 20 }), "Sign In"]
						}), /* @__PURE__ */ jsx(Link, {
							to: "/auth?mode=signup",
							onClick: () => setIsMenuOpen(false),
							className: "btn btn-primary",
							style: {
								width: "100%",
								padding: "12px"
							},
							children: "Get Started"
						})] })
					})
				]
			})
		}) })]
	});
}
//#endregion
//#region src/components/Footer.jsx
function Footer() {
	return /* @__PURE__ */ jsx("footer", {
		className: "footer",
		style: { padding: "60px 0 30px" },
		children: /* @__PURE__ */ jsxs("div", {
			className: "container",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "footer-grid",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "footer-brand",
						style: {
							textAlign: "center",
							display: "flex",
							flexDirection: "column",
							alignItems: "center"
						},
						children: [/* @__PURE__ */ jsx("div", {
							className: "font-bold",
							style: {
								fontSize: "24px",
								letterSpacing: "-0.03em"
							},
							children: "ZizzyStores."
						}), /* @__PURE__ */ jsx("p", {
							style: {
								maxWidth: "400px",
								margin: "16px auto 0"
							},
							children: "The world's most trusted marketplace for launching high-value digital storefronts."
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "footer-col",
						style: { textAlign: "center" },
						children: [/* @__PURE__ */ jsx("h4", { children: "Solutions" }), /* @__PURE__ */ jsxs("ul", {
							style: {
								listStyle: "none",
								padding: 0
							},
							children: [
								/* @__PURE__ */ jsx("li", {
									style: { marginBottom: "8px" },
									children: /* @__PURE__ */ jsx(Link, {
										to: "/sell-digital-products",
										style: {
											textDecoration: "none",
											color: "inherit",
											fontSize: "14px"
										},
										children: "Sell Digital Products"
									})
								}),
								/* @__PURE__ */ jsx("li", {
									style: { marginBottom: "8px" },
									children: /* @__PURE__ */ jsx(Link, {
										to: "/creator-platform",
										style: {
											textDecoration: "none",
											color: "inherit",
											fontSize: "14px"
										},
										children: "Creative Brands"
									})
								}),
								/* @__PURE__ */ jsx("li", {
									style: { marginBottom: "8px" },
									children: /* @__PURE__ */ jsx(Link, {
										to: "/create-online-store",
										style: {
											textDecoration: "none",
											color: "inherit",
											fontSize: "14px"
										},
										children: "Create Online Store"
									})
								}),
								/* @__PURE__ */ jsx("li", {
									style: { marginBottom: "8px" },
									children: /* @__PURE__ */ jsx(Link, {
										to: "/shopify-alternative",
										style: {
											textDecoration: "none",
											color: "inherit",
											fontSize: "14px"
										},
										children: "Shopify Alternative"
									})
								}),
								/* @__PURE__ */ jsx("li", {
									style: { marginBottom: "8px" },
									children: /* @__PURE__ */ jsx(Link, {
										to: "/affordable-ecommerce-platform",
										style: {
											textDecoration: "none",
											color: "inherit",
											fontSize: "14px"
										},
										children: "Affordable Ecommerce"
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "footer-col",
						style: { textAlign: "center" },
						children: [/* @__PURE__ */ jsx("h4", { children: "Company" }), /* @__PURE__ */ jsxs("ul", { children: [
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "#",
								children: "About Us"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "#",
								children: "Success Stories"
							}) }),
							/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
								href: "#",
								children: "Support"
							}) })
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "footer-col",
						style: { textAlign: "center" },
						children: [/* @__PURE__ */ jsx("h4", { children: "Social" }), /* @__PURE__ */ jsxs("div", {
							className: "flex gap-6 justify-center",
							style: { marginTop: "16px" },
							children: [/* @__PURE__ */ jsx("a", {
								href: "#",
								className: "text-secondary",
								children: /* @__PURE__ */ jsx("svg", {
									fill: "currentColor",
									width: "20",
									height: "20",
									viewBox: "0 0 24 24",
									children: /* @__PURE__ */ jsx("path", { d: "M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z" })
								})
							}), /* @__PURE__ */ jsx("a", {
								href: "#",
								className: "text-secondary",
								children: /* @__PURE__ */ jsx("svg", {
									fill: "currentColor",
									width: "20",
									height: "20",
									viewBox: "0 0 24 24",
									children: /* @__PURE__ */ jsx("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" })
								})
							})]
						})]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "footer-bottom",
				style: {
					flexDirection: "column",
					gap: "16px",
					textAlign: "center"
				},
				children: [/* @__PURE__ */ jsxs("div", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ZIZZYSTORES. ALL RIGHTS RESERVED."
				] }), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-6",
					style: { fontSize: "12px" },
					children: [
						/* @__PURE__ */ jsx("a", {
							href: "#",
							children: "Privacy"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#",
							children: "Terms"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#",
							children: "Cookies"
						})
					]
				})]
			})]
		})
	});
}
//#endregion
export { Navbar as n, Footer as t };
