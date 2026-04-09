import { n as supabase } from "./assets/supabase-CTgwDjry.js";
import { n as AuthProvider, t as useAuth } from "./assets/useAuth-DY4X98To.js";
import { ViteReactSSG } from "vite-react-ssg";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { MessageCircle, Minus, Paperclip, Send, X } from "lucide-react";
//#region src/components/ProtectedRoute.jsx
function ProtectedRoute({ children }) {
	const { user, session, isAdmin } = useAuth();
	const location = useLocation();
	if (!user || !session) return /* @__PURE__ */ jsx(Navigate, {
		to: "/auth",
		state: { from: location },
		replace: true
	});
	const profileCompleted = user.user_metadata?.profile_completed;
	const storeActive = user.user_metadata?.store_active;
	if (!profileCompleted && location.pathname !== "/edit") return /* @__PURE__ */ jsx(Navigate, {
		to: "/edit",
		replace: true
	});
	if (profileCompleted && !storeActive && !isAdmin) {
		if (![
			"/activation",
			"/finalize-activation",
			"/edit",
			"/success"
		].includes(location.pathname)) return /* @__PURE__ */ jsx(Navigate, {
			to: "/activation",
			replace: true
		});
	}
	if (isAdmin && (location.pathname === "/activation" || location.pathname === "/finalize-activation")) return /* @__PURE__ */ jsx(Navigate, {
		to: "/dashboard",
		replace: true
	});
	return children;
}
//#endregion
//#region src/components/ErrorBoundary.jsx
var ErrorBoundary = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null
		};
	}
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			error
		};
	}
	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught an error", error, errorInfo);
	}
	render() {
		if (this.state.hasError) return /* @__PURE__ */ jsxs("div", {
			style: {
				padding: "20px",
				backgroundColor: "#fee2e2",
				border: "1px solid #ef4444",
				borderRadius: "8px",
				margin: "20px"
			},
			children: [
				/* @__PURE__ */ jsx("h2", {
					style: { color: "#b91c1c" },
					children: "Something went wrong."
				}),
				/* @__PURE__ */ jsx("pre", {
					style: {
						whiteSpace: "pre-wrap",
						color: "#7f1d1d"
					},
					children: this.state.error?.toString()
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: () => window.location.reload(),
					style: {
						marginTop: "10px",
						padding: "8px 16px",
						backgroundColor: "#ef4444",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer"
					},
					children: "Reload Page"
				})
			]
		});
		return this.props.children;
	}
};
//#endregion
//#region src/components/ChatWidget.jsx
var ChatWidget = () => {
	const { user } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [isIdentified, setIsIdentified] = useState(false);
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [chatHistory, setChatHistory] = useState([]);
	const [loading, setLoading] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const scrollRef = useRef(null);
	useEffect(() => {
		if (user?.email) {
			setEmail(user.email);
			setIsIdentified(true);
		}
		if (isIdentified && email) fetchChatHistory();
		const channel = supabase.channel("concierge_messages").on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "concierge_messages"
		}, (payload) => {
			if (payload.new.user_email === email) {
				setChatHistory((prev) => [...prev, payload.new]);
				if (!isOpen && payload.new.sender === "admin") setUnreadCount((prev) => prev + 1);
			}
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [
		user,
		isIdentified,
		email,
		isOpen
	]);
	useEffect(() => {
		if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, [chatHistory, isOpen]);
	const fetchChatHistory = async () => {
		try {
			const { data, error } = await supabase.from("concierge_messages").select("*").eq("user_email", email).order("created_at", { ascending: true });
			if (data) setChatHistory(data);
		} catch (err) {
			console.error("Error fetching chat history:", err);
		}
	};
	const handleIdentify = (e) => {
		e.preventDefault();
		if (email.trim() && email.includes("@")) {
			setIsIdentified(true);
			fetchChatHistory();
		}
	};
	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!message.trim() || !email) return;
		const botToken = "8742134511:AAEMCmlspEL5ZBk8ltwxHOgBBqM2AGSE4q8";
		const chatId = "8059395373";
		const newMessage = {
			user_email: email,
			sender: "user",
			message: message.trim(),
			user_id: user?.id || null
		};
		setLoading(true);
		try {
			const { error: dbError } = await supabase.from("concierge_messages").insert([newMessage]);
			if (dbError) throw dbError;
			{
				const tgMsg = `
📬 *New Concierge Message*
*From:* ${email}
*Type:* ${user ? "Logged User" : "Guest"}

*Content:* 
${message.trim()}

---
_Reply to this message with 'Reply: <your message>' to send back to the user._
                `;
				await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						chat_id: chatId,
						text: tgMsg,
						parse_mode: "Markdown",
						disable_notification: false
					})
				});
			}
			setMessage("");
		} catch (err) {
			console.error("Error sending message:", err);
			alert("Failed to send message. Please try again.");
		} finally {
			setLoading(false);
		}
	};
	const toggleOpen = () => {
		if (!isOpen) setUnreadCount(0);
		setIsOpen(!isOpen);
	};
	const brandColor = "#06acf8ff";
	const bgColor = "#0A0A0A";
	const cardColor = "#111111";
	return /* @__PURE__ */ jsxs("div", {
		style: {
			position: "fixed",
			bottom: "32px",
			right: "32px",
			zIndex: 1e4,
			fontFamily: "\"Inter\", sans-serif"
		},
		children: [
			isOpen && /* @__PURE__ */ jsxs("div", {
				style: {
					width: "380px",
					maxHeight: "600px",
					height: "80vh",
					backgroundColor: bgColor,
					borderRadius: "24px",
					boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
					border: "1px solid #1F1F1F",
					marginBottom: "24px",
					animation: "slideUp 0.3s ease-out"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						padding: "24px",
						backgroundColor: cardColor,
						borderBottom: "1px solid #1F1F1F",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "12px"
						},
						children: [/* @__PURE__ */ jsxs("div", {
							style: {
								width: "40px",
								height: "40px",
								borderRadius: "50%",
								backgroundColor: "#222",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								position: "relative"
							},
							children: [/* @__PURE__ */ jsx("img", {
								src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR13HUAnJxZA_NhkLvR_U0Ce2SuRjAXdfQ7RA&s",
								style: {
									width: "100%",
									height: "100%",
									borderRadius: "50%",
									objectFit: "cover"
								},
								alt: "Sarah"
							}), /* @__PURE__ */ jsx("div", { style: {
								position: "absolute",
								bottom: "0",
								right: "0",
								width: "10px",
								height: "10px",
								backgroundColor: "#10B981",
								borderRadius: "50%",
								border: "2px solid #111"
							} })]
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "14px",
								fontWeight: "700",
								color: "#FFF"
							},
							children: "Zizzy Concierge"
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "10px",
								color: "#888",
								textTransform: "uppercase",
								letterSpacing: "0.05em"
							},
							children: "Isaac from Support"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "12px"
						},
						children: [/* @__PURE__ */ jsx("button", {
							onClick: toggleOpen,
							style: {
								background: "none",
								border: "none",
								color: "#666",
								cursor: "pointer"
							},
							children: /* @__PURE__ */ jsx(Minus, { size: 18 })
						}), /* @__PURE__ */ jsx("button", {
							onClick: toggleOpen,
							style: {
								background: "none",
								border: "none",
								color: "#666",
								cursor: "pointer"
							},
							children: /* @__PURE__ */ jsx(X, { size: 18 })
						})]
					})]
				}), !isIdentified ? /* @__PURE__ */ jsxs("div", {
					style: {
						flex: 1,
						padding: "32px",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						textAlign: "center"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							style: {
								width: "64px",
								height: "64px",
								backgroundColor: "#111",
								borderRadius: "50%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								margin: "0 auto 24px"
							},
							children: /* @__PURE__ */ jsx(MessageCircle, {
								size: 32,
								color: brandColor
							})
						}),
						/* @__PURE__ */ jsx("h3", {
							style: {
								fontSize: "18px",
								fontWeight: "700",
								color: "#FFF",
								marginBottom: "8px"
							},
							children: "Start a Conversation"
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								fontSize: "12px",
								color: "#888",
								marginBottom: "32px",
								lineHeight: "1.6"
							},
							children: "Please provide your email address so we can reach back to you."
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleIdentify,
							children: [/* @__PURE__ */ jsx("input", {
								type: "email",
								placeholder: "Enter your email address",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								style: {
									width: "100%",
									backgroundColor: "#111",
									border: "1px solid #1F1F1F",
									borderRadius: "8px",
									padding: "12px 16px",
									color: "#FFF",
									fontSize: "14px",
									marginBottom: "16px",
									outline: "none"
								}
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								style: {
									width: "100%",
									backgroundColor: brandColor,
									color: "#000",
									border: "none",
									borderRadius: "8px",
									padding: "12px",
									fontSize: "12px",
									fontWeight: "700",
									letterSpacing: "0.05em",
									cursor: "pointer"
								},
								children: "CONTINUE"
							})]
						})
					]
				}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
					ref: scrollRef,
					style: {
						flex: 1,
						padding: "24px",
						overflowY: "auto",
						display: "flex",
						flexDirection: "column",
						gap: "16px"
					},
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								textAlign: "center",
								marginBottom: "16px"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "inline-flex",
									alignItems: "center",
									gap: "8px",
									backgroundColor: "rgba(255,255,255,0.05)",
									padding: "6px 12px",
									borderRadius: "20px",
									fontSize: "10px",
									color: "#666"
								},
								children: [/* @__PURE__ */ jsx("div", { style: {
									width: "6px",
									height: "6px",
									backgroundColor: "#666",
									borderRadius: "50%"
								} }), "Typically replies in minutes"]
							}), /* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "10px",
									color: "#333",
									marginTop: "16px",
									textTransform: "uppercase",
									letterSpacing: "0.1em"
								},
								children: "Today"
							})]
						}),
						chatHistory.length === 0 && /* @__PURE__ */ jsx("div", {
							style: {
								backgroundColor: "#111",
								padding: "16px",
								borderRadius: "12px 12px 12px 0",
								maxWidth: "85%",
								color: "#CCC",
								fontSize: "13px",
								lineHeight: "1.5"
							},
							children: "Hi there! Welcome to Zizzystores Concierge. How can I assist you today? ✨"
						}),
						chatHistory.map((msg, idx) => /* @__PURE__ */ jsx("div", {
							style: {
								alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
								backgroundColor: msg.sender === "user" ? brandColor : "#111",
								color: msg.sender === "user" ? "#000" : "#CCC",
								padding: "12px 16px",
								borderRadius: msg.sender === "user" ? "12px 12px 0 12px" : "12px 12px 12px 0",
								maxWidth: "85%",
								fontSize: "13px",
								lineHeight: "1.5",
								boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
							},
							children: msg.message
						}, idx))
					]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: handleSendMessage,
					style: {
						padding: "24px",
						backgroundColor: cardColor,
						borderTop: "1px solid #1F1F1F"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							backgroundColor: bgColor,
							border: "1px solid #1F1F1F",
							borderRadius: "30px",
							display: "flex",
							alignItems: "center",
							padding: "8px 12px 8px 20px",
							gap: "8px"
						},
						children: [
							/* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "Type your message...",
								value: message,
								onChange: (e) => setMessage(e.target.value),
								style: {
									flex: 1,
									backgroundColor: "transparent",
									border: "none",
									color: "#FFF",
									fontSize: "13px",
									outline: "none"
								}
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								style: {
									background: "none",
									border: "none",
									color: "#666",
									cursor: "pointer"
								},
								children: /* @__PURE__ */ jsx(Paperclip, { size: 18 })
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: loading || !message.trim(),
								style: {
									width: "36px",
									height: "36px",
									backgroundColor: brandColor,
									borderRadius: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									border: "none",
									cursor: "pointer",
									opacity: loading || !message.trim() ? .5 : 1
								},
								children: /* @__PURE__ */ jsx(Send, {
									size: 16,
									color: "#000"
								})
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: "9px",
							color: "#333",
							textAlign: "center",
							marginTop: "12px",
							letterSpacing: "0.05em"
						},
						children: ["Powered by ", /* @__PURE__ */ jsx("span", {
							style: { color: brandColor },
							children: "Zizzy Support Core"
						})]
					})]
				})] })]
			}),
			/* @__PURE__ */ jsxs("button", {
				onClick: toggleOpen,
				style: {
					width: "56px",
					height: "56px",
					backgroundColor: brandColor,
					borderRadius: "50%",
					boxShadow: "0 8px 24px rgba(6,172,248,0.4)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					border: "none",
					cursor: "pointer",
					position: "relative",
					transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
				},
				onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)",
				onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)",
				children: [isOpen ? /* @__PURE__ */ jsx(X, {
					color: "#000",
					size: 24
				}) : /* @__PURE__ */ jsx(MessageCircle, {
					color: "#000",
					size: 24
				}), unreadCount > 0 && !isOpen && /* @__PURE__ */ jsx("div", {
					style: {
						position: "absolute",
						top: "-4px",
						right: "-4px",
						backgroundColor: "#EF4444",
						color: "#FFF",
						fontSize: "10px",
						fontWeight: "700",
						width: "20px",
						height: "20px",
						borderRadius: "50%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						border: "2px solid #0A0A0A"
					},
					children: unreadCount
				})]
			}),
			/* @__PURE__ */ jsx("style", { children: `
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            ` })
		]
	});
};
//#endregion
//#region src/App.jsx
var Home = lazy(() => import("./assets/Home-DMnRObN8.js"));
var Auth = lazy(() => import("./assets/Auth-BgbQZNFs.js"));
var Dashboard = lazy(() => import("./assets/Dashboard-D-bIIvVM.js"));
var Profile = lazy(() => import("./assets/Profile-Bq4wHt0n.js"));
var Edit$1 = lazy(() => import("./assets/Edit-D9KRfovc.js"));
var Activation = lazy(() => import("./assets/Activation-D55rWUir.js"));
var Storefront = lazy(() => import("./assets/Storefront-BohrQRK4.js"));
var ExploreBrand = lazy(() => import("./assets/ExploreBrand-DsMQezPD.js"));
var FinalizeActivation = lazy(() => import("./assets/FinalizeActivation-CdEoe5fM.js"));
var SuccessPage = lazy(() => import("./assets/SuccessPage-9SZkMJG0.js"));
var CheckoutSuccess = lazy(() => import("./assets/CheckoutSuccess-D9zVOI2V.js"));
var ShopBrand = lazy(() => import("./assets/ShopBrand-ClyCS6CF.js"));
var Cart = lazy(() => import("./assets/Cart-BZTjq55s.js"));
var Checkout = lazy(() => import("./assets/Checkout-D2lIKob5.js"));
var ProductDetail = lazy(() => import("./assets/ProductDetail-C2JDONks.js"));
var SellDigitalGoods = lazy(() => import("./assets/SellDigitalGoods-DlzbSnIp.js"));
var CreatorPlatform = lazy(() => import("./assets/CreatorPlatform-m6YNQWIG.js"));
var CreateOnlineStore = lazy(() => import("./assets/CreateOnlineStore-BSt5vDeo.js"));
var ShopifyAlternative = lazy(() => import("./assets/ShopifyAlternative-DKOpbYo6.js"));
var AffordableEcommerce = lazy(() => import("./assets/AffordableEcommerce-DG2nIXZA.js"));
var AllBlog = lazy(() => import("./assets/AllBlog-DlGCSZmp.js"));
var Blog = lazy(() => import("./assets/Blog-D8Q7RxPl.js"));
var AdminBlog = lazy(() => import("./assets/AdminBlog-BPa6PB35.js"));
var FillBlog = lazy(() => import("./assets/FillBlog-BwB0W1zF.js"));
var PageLoader = () => /* @__PURE__ */ jsxs("div", {
	style: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100vh",
		width: "100vw",
		backgroundColor: "var(--bg-light)",
		position: "fixed",
		top: 0,
		left: 0,
		zIndex: 9999
	},
	children: [/* @__PURE__ */ jsxs("div", {
		className: "loader-dots",
		children: [
			/* @__PURE__ */ jsx("div", { className: "dot" }),
			/* @__PURE__ */ jsx("div", { className: "dot" }),
			/* @__PURE__ */ jsx("div", { className: "dot" })
		]
	}), /* @__PURE__ */ jsx("style", { children: `
      .loader-dots {
        display: flex;
        gap: 8px;
      }
      .dot {
        width: 12px;
        height: 12px;
        background-color: var(--primary);
        border-radius: 50%;
        animation: pulse 1.5s infinite ease-in-out;
      }
      .dot:nth-child(2) { animation-delay: 0.2s; }
      .dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes pulse {
        0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
        40% { transform: scale(1); opacity: 1; }
      }
    ` })]
});
function App() {
	const [customBrandId, setCustomBrandId] = useState(null);
	const [isCustomDomain, setIsCustomDomain] = useState(false);
	return /* @__PURE__ */ jsxs(AuthProvider, { children: [/* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx(PageLoader, {}),
		children: /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxs(Routes, { children: [
			isCustomDomain && customBrandId && /* @__PURE__ */ jsx(Route, {
				path: "/",
				element: /* @__PURE__ */ jsx(ShopBrand, { customId: customBrandId })
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/",
				element: /* @__PURE__ */ jsx(Home, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/auth",
				element: /* @__PURE__ */ jsx(Auth, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/store",
				element: /* @__PURE__ */ jsx(Storefront, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/explore-brand",
				element: /* @__PURE__ */ jsx(ExploreBrand, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/explore-brand/:id",
				element: /* @__PURE__ */ jsx(ExploreBrand, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/shop-brand",
				element: /* @__PURE__ */ jsx(ShopBrand, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/shop-brand/:id",
				element: /* @__PURE__ */ jsx(ShopBrand, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/@:slug",
				element: /* @__PURE__ */ jsx(ShopBrand, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/cart",
				element: /* @__PURE__ */ jsx(Cart, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/all-blogs",
				element: /* @__PURE__ */ jsx(AllBlog, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/blog/:slug",
				element: /* @__PURE__ */ jsx(Blog, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/admin-blog",
				element: /* @__PURE__ */ jsx(AdminBlog, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/checkout",
				element: /* @__PURE__ */ jsx(Checkout, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/product",
				element: /* @__PURE__ */ jsx(ProductDetail, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/sell-digital-products",
				element: /* @__PURE__ */ jsx(SellDigitalGoods, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/creator-platform",
				element: /* @__PURE__ */ jsx(CreatorPlatform, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/create-online-store",
				element: /* @__PURE__ */ jsx(CreateOnlineStore, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/shopify-alternative",
				element: /* @__PURE__ */ jsx(ShopifyAlternative, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/affordable-ecommerce-platform",
				element: /* @__PURE__ */ jsx(AffordableEcommerce, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/dashboard",
				element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Dashboard, {}) })
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/profile",
				element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Profile, {}) })
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/edit",
				element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Edit$1, {}) })
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/activation",
				element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Activation, {}) })
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/finalize-activation",
				element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(FinalizeActivation, {}) })
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/success",
				element: /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(SuccessPage, {}) })
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/checkout-success",
				element: /* @__PURE__ */ jsx(CheckoutSuccess, {})
			}),
			/* @__PURE__ */ jsx(Route, {
				path: "/fillblog",
				element: /* @__PURE__ */ jsx(FillBlog, {})
			})
		] }) })
	}), /* @__PURE__ */ jsx(ChatWidget, {})] });
}
//#endregion
//#region src/main.jsx
var createRoot = ViteReactSSG(/* @__PURE__ */ jsx(App, {}));
//#endregion
export { createRoot };
