import { n as supabase } from "./supabase-CTgwDjry.js";
import { t as useAuth } from "./useAuth-DY4X98To.js";
import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowUpRight, BarChart3, ChevronLeft, Edit, LayoutGrid, Menu, MessageCircle, MessageSquare, Package, Search, Send, ShoppingBag, Store, TrendingUp, User, X } from "lucide-react";
import { motion } from "framer-motion";
//#region src/components/AdminChat.jsx
var AdminChat = () => {
	const [conversations, setConversations] = useState([]);
	const [selectedEmail, setSelectedEmail] = useState(null);
	const [messages, setMessages] = useState([]);
	const [reply, setReply] = useState("");
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const [viewMode, setViewMode] = useState("list");
	const scrollRef = useRef(null);
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	useEffect(() => {
		fetchConversations();
		const channel = supabase.channel("admin_concierge_list").on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "concierge_messages"
		}, () => {
			fetchConversations();
		}).subscribe();
		return () => supabase.removeChannel(channel);
	}, []);
	useEffect(() => {
		if (selectedEmail) {
			fetchMessages(selectedEmail);
			const channel = supabase.channel(`admin_chat_${selectedEmail}`).on("postgres_changes", {
				event: "INSERT",
				schema: "public",
				table: "concierge_messages",
				filter: `user_email=eq.${selectedEmail}`
			}, (payload) => {
				setMessages((prev) => {
					if (prev.find((m) => m.id === payload.new.id)) return prev;
					return [...prev, payload.new];
				});
			}).subscribe();
			return () => supabase.removeChannel(channel);
		}
	}, [selectedEmail]);
	useEffect(() => {
		if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, [messages]);
	const fetchConversations = async () => {
		try {
			const { data, error } = await supabase.from("concierge_messages").select("user_email, message, created_at, sender").order("created_at", { ascending: false });
			if (data) {
				const unique = [];
				const seen = /* @__PURE__ */ new Set();
				for (const item of data) if (!seen.has(item.user_email)) {
					seen.add(item.user_email);
					unique.push(item);
				}
				setConversations(unique);
			}
		} catch (err) {
			console.error("Error fetching conversations:", err);
		}
	};
	const fetchMessages = async (email) => {
		try {
			const { data, error } = await supabase.from("concierge_messages").select("*").eq("user_email", email).order("created_at", { ascending: true });
			if (data) setMessages(data);
		} catch (err) {
			console.error("Error fetching messages:", err);
		}
	};
	const handleSendReply = async (e) => {
		e.preventDefault();
		if (!reply.trim() || !selectedEmail) return;
		setLoading(true);
		try {
			const { error } = await supabase.from("concierge_messages").insert([{
				user_email: selectedEmail,
				sender: "admin",
				message: reply.trim()
			}]);
			if (error) throw error;
			setReply("");
		} catch (err) {
			console.error("Error sending reply:", err);
			alert("Failed to send reply. Please check your Supabase connection.");
		} finally {
			setLoading(false);
		}
	};
	const brandColor = "#06acf8ff";
	const bgColor = "#0A0A0A";
	const borderColor = "#1F1F1F";
	const filteredConversations = conversations.filter((c) => c.user_email.toLowerCase().includes(searchTerm.toLowerCase()));
	return /* @__PURE__ */ jsxs("div", {
		style: {
			display: "flex",
			height: "100%",
			backgroundColor: bgColor,
			border: isMobile ? "none" : `1px solid ${borderColor}`,
			overflow: "hidden",
			position: "relative"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			style: {
				width: isMobile ? "100%" : "320px",
				borderRight: isMobile ? "none" : `1px solid ${borderColor}`,
				display: isMobile && viewMode === "chat" ? "none" : "flex",
				flexDirection: "column",
				height: "100%",
				backgroundColor: bgColor
			},
			children: [/* @__PURE__ */ jsxs("div", {
				style: {
					padding: "24px",
					borderBottom: `1px solid ${borderColor}`
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "\"Playfair Display\", serif",
						fontSize: "20px",
						fontStyle: "italic",
						color: "#FFF",
						marginBottom: "16px"
					},
					children: "Concierge Inbox"
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "8px",
						backgroundColor: "#111",
						padding: "8px 12px",
						border: `1px solid ${borderColor}`
					},
					children: [/* @__PURE__ */ jsx(Search, {
						size: 14,
						color: "#666"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Search email...",
						value: searchTerm,
						onChange: (e) => setSearchTerm(e.target.value),
						style: {
							background: "transparent",
							border: "none",
							color: "#FFF",
							fontSize: "11px",
							outline: "none",
							width: "100%"
						}
					})]
				})]
			}), /* @__PURE__ */ jsx("div", {
				style: {
					flex: 1,
					overflowY: "auto"
				},
				children: filteredConversations.length === 0 ? /* @__PURE__ */ jsx("div", {
					style: {
						padding: "40px 24px",
						textAlign: "center",
						color: "#444",
						fontSize: "12px"
					},
					children: "No conversations yet."
				}) : filteredConversations.map((conv) => /* @__PURE__ */ jsxs("div", {
					onClick: () => {
						setSelectedEmail(conv.user_email);
						if (isMobile) setViewMode("chat");
					},
					style: {
						padding: "20px 24px",
						borderBottom: `1px solid ${borderColor}`,
						cursor: "pointer",
						backgroundColor: selectedEmail === conv.user_email ? "#111" : "transparent",
						transition: "all 0.2s",
						borderLeft: selectedEmail === conv.user_email ? `3px solid ${brandColor}` : "3px solid transparent"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "4px"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "12px",
								fontWeight: "700",
								color: selectedEmail === conv.user_email ? "#FFF" : "#AAA",
								width: "160px",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap"
							},
							children: conv.user_email.split("@")[0]
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "10px",
								color: "#444"
							},
							children: new Date(conv.created_at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							})
						})]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							fontSize: "11px",
							color: "#666",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						},
						children: [conv.sender === "admin" ? "You: " : "", conv.message]
					})]
				}, conv.user_email))
			})]
		}), selectedEmail ? /* @__PURE__ */ jsxs("div", {
			style: {
				flex: 1,
				display: isMobile && viewMode === "list" ? "none" : "flex",
				flexDirection: "column",
				position: isMobile ? "absolute" : "relative",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundColor: bgColor,
				zIndex: 20
			},
			children: [
				/* @__PURE__ */ jsxs("div", {
					style: {
						padding: isMobile ? "16px" : "24px 32px",
						borderBottom: `1px solid ${borderColor}`,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: isMobile ? "12px" : "16px"
						},
						children: [
							isMobile && /* @__PURE__ */ jsx("button", {
								onClick: () => setViewMode("list"),
								style: {
									background: "none",
									border: "none",
									color: "#666",
									padding: "4px",
									cursor: "pointer"
								},
								children: /* @__PURE__ */ jsx(ChevronLeft, { size: 20 })
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									width: isMobile ? "32px" : "40px",
									height: isMobile ? "32px" : "40px",
									backgroundColor: "#222",
									borderRadius: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								},
								children: /* @__PURE__ */ jsx(User, {
									size: 20,
									color: brandColor
								})
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: "14px",
									fontWeight: "700",
									color: "#FFF"
								},
								children: selectedEmail
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									fontSize: "10px",
									color: "#10B981",
									display: "flex",
									alignItems: "center",
									gap: "4px"
								},
								children: [/* @__PURE__ */ jsx("div", { style: {
									width: "6px",
									height: "6px",
									backgroundColor: "#10B981",
									borderRadius: "50%"
								} }), " Active Consumer"]
							})] })
						]
					}), /* @__PURE__ */ jsx("div", {
						style: {
							color: "#444",
							fontSize: "10px",
							textTransform: "uppercase",
							letterSpacing: "0.1em",
							display: isMobile ? "none" : "block"
						},
						children: "Live Connection"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					ref: scrollRef,
					style: {
						flex: 1,
						padding: isMobile ? "20px" : "32px",
						overflowY: "auto",
						display: "flex",
						flexDirection: "column",
						gap: "16px"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							textAlign: "center",
							marginBottom: isMobile ? "20px" : "32px"
						},
						children: /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "9px",
								color: "#333",
								textTransform: "uppercase",
								letterSpacing: "0.2em"
							},
							children: "Beginning of Conversation"
						})
					}), messages.map((msg) => /* @__PURE__ */ jsxs("div", {
						style: {
							alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start",
							maxWidth: isMobile ? "85%" : "60%",
							display: "flex",
							flexDirection: "column",
							alignItems: msg.sender === "admin" ? "flex-end" : "flex-start"
						},
						children: [/* @__PURE__ */ jsx("div", {
							style: {
								backgroundColor: msg.sender === "admin" ? "#FFF" : "#111",
								color: msg.sender === "admin" ? "#000" : "#CCC",
								padding: "12px 20px",
								borderRadius: msg.sender === "admin" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
								fontSize: "13px",
								lineHeight: "1.6",
								border: msg.sender === "admin" ? "none" : `1px solid ${borderColor}`
							},
							children: msg.message
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "9px",
								color: "#333",
								marginTop: "6px",
								textTransform: "uppercase"
							},
							children: new Date(msg.created_at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							})
						})]
					}, msg.id))]
				}),
				/* @__PURE__ */ jsx("form", {
					onSubmit: handleSendReply,
					style: {
						padding: isMobile ? "16px" : "24px 32px",
						borderTop: `1px solid ${borderColor}`,
						backgroundColor: bgColor
					},
					children: /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							gap: "12px",
							alignItems: "center",
							backgroundColor: "#111",
							border: `1px solid ${borderColor}`,
							padding: isMobile ? "8px 16px" : "12px 20px",
							borderRadius: "4px"
						},
						children: [/* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: isMobile ? "Reply..." : `Reply to ${selectedEmail.split("@")[0]}...`,
							value: reply,
							onChange: (e) => setReply(e.target.value),
							style: {
								flex: 1,
								background: "transparent",
								border: "none",
								color: "#FFF",
								fontSize: isMobile ? "14px" : "13px",
								outline: "none"
							}
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: loading || !reply.trim(),
							style: {
								background: "none",
								border: "none",
								color: brandColor,
								cursor: "pointer",
								opacity: loading || !reply.trim() ? .4 : 1
							},
							children: /* @__PURE__ */ jsx(Send, { size: 18 })
						})]
					})
				})
			]
		}) : /* @__PURE__ */ jsxs("div", {
			style: {
				flex: 1,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: "80px"
			},
			children: [
				/* @__PURE__ */ jsx("div", {
					style: {
						width: "80px",
						height: "80px",
						backgroundColor: "#111",
						borderRadius: "50%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: "32px"
					},
					children: /* @__PURE__ */ jsx(MessageCircle, {
						size: 32,
						color: "#333"
					})
				}),
				/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "\"Playfair Display\", serif",
						fontSize: "32px",
						color: "#FFF",
						fontStyle: "italic",
						marginBottom: "16px"
					},
					children: "Client Interactions"
				}),
				/* @__PURE__ */ jsx("p", {
					style: {
						fontSize: "13px",
						color: "#666",
						textAlign: "center",
						maxWidth: "400px",
						lineHeight: "1.8"
					},
					children: "Select a conversation from the sidebar to begin interacting with your customers. All messages sent here appear instantly in their local store chat widget."
				})
			]
		})]
	});
};
//#endregion
//#region src/pages/Dashboard.jsx
function Dashboard() {
	const { user } = useAuth();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const [activeTab, setActiveTab] = useState("overview");
	const [profileData, setProfileData] = useState({
		brand_name: "Your Brand",
		owner_name: "Brand Owner",
		email_address: "business@example.com",
		phone_number: "N/A",
		website_url: "",
		logo_url: ""
	});
	const [metrics, setMetrics] = useState({
		totalSales: 0,
		activeStock: 0,
		totalTraffic: 0,
		recentOrders: []
	});
	const [loadingMetrics, setLoadingMetrics] = useState(true);
	useEffect(() => {
		async function fetchDashboardData() {
			if (!user) return;
			try {
				const { data: pData, error: pError } = await supabase.from("brand_profiles").select("*").eq("id", user.id).single();
				if (pError) console.warn("Dashboard: Initial profile fetch warning:", pError.message);
				if (pData) setProfileData((prev) => ({
					...prev,
					...Object.fromEntries(Object.entries(pData).filter(([_, v]) => v != null && v !== ""))
				}));
				const { data: salesData } = await supabase.from("orders").select("total_amount").eq("brand_id", user.id);
				const calcSales = salesData ? salesData.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) : 0;
				const { count: stockCount } = await supabase.from("products").select("*", {
					count: "exact",
					head: true
				}).eq("brand_id", user.id).eq("status", "active");
				const { count: trafficCount } = await supabase.from("store_traffic").select("*", {
					count: "exact",
					head: true
				}).eq("brand_id", user.id);
				const { data: lastOrders } = await supabase.from("orders").select("*").eq("brand_id", user.id).order("created_at", { ascending: false }).limit(3);
				setMetrics({
					totalSales: calcSales,
					activeStock: stockCount || 0,
					totalTraffic: trafficCount || 0,
					recentOrders: lastOrders || []
				});
			} catch (err) {
				console.error("Error loading live dashboard data:", err);
			} finally {
				setLoadingMetrics(false);
			}
		}
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		fetchDashboardData();
		return () => window.removeEventListener("resize", handleResize);
	}, [user]);
	const brandColor = "#06acf8ff";
	const s = {
		page: {
			backgroundColor: "#0A0A0A",
			color: "#E5E5E5",
			height: isMobile ? "auto" : "100vh",
			minHeight: "100vh",
			overflow: isMobile ? "visible" : "hidden",
			display: "flex",
			fontFamily: "\"Inter\", sans-serif"
		},
		sidebar: {
			width: "280px",
			borderRight: "1px solid #1F1F1F",
			padding: "0",
			display: "flex",
			flexDirection: "column"
		},
		logoContainer: {
			padding: "60px 40px",
			display: "flex",
			flexDirection: "column"
		},
		logo: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "18px",
			letterSpacing: "0.05em",
			color: brandColor,
			textTransform: "uppercase"
		},
		nav: {
			padding: "0",
			flex: 1
		},
		navItem: (active) => ({
			display: "flex",
			alignItems: "center",
			gap: "16px",
			padding: "16px 40px",
			color: active ? "#FFF" : "#888",
			backgroundColor: active ? "#111" : "transparent",
			borderLeft: active ? `3px solid ${brandColor}` : "3px solid transparent",
			cursor: "pointer",
			fontSize: "12px",
			fontWeight: active ? "600" : "400",
			letterSpacing: "0.05em",
			transition: "all 0.2s",
			textTransform: "uppercase",
			textDecoration: "none"
		}),
		userProfile: {
			padding: "24px 40px",
			borderTop: "1px solid #1F1F1F",
			display: "flex",
			alignItems: "center",
			gap: "16px",
			backgroundColor: "#111"
		},
		userAvatar: {
			width: "40px",
			height: "40px",
			backgroundColor: "#333",
			overflow: "hidden",
			borderRadius: "50%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		main: {
			flex: 1,
			display: "flex",
			flexDirection: "column"
		},
		header: {
			height: "80px",
			padding: "0 80px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			borderBottom: "1px solid #1F1F1F"
		},
		headerTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "24px",
			color: "#FFF"
		},
		searchBar: {
			display: "flex",
			alignItems: "center",
			gap: "8px",
			backgroundColor: "#111",
			padding: "10px 16px",
			width: "320px",
			border: "1px solid #1F1F1F"
		},
		searchInput: {
			background: "transparent",
			border: "none",
			color: "#FFF",
			fontSize: "12px",
			outline: "none",
			width: "100%",
			letterSpacing: "0.05em"
		},
		headerActions: {
			display: "flex",
			alignItems: "center",
			gap: "32px"
		},
		premiumBadge: {
			color: brandColor,
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			padding: "4px 8px",
			border: `1px solid ${brandColor}`
		},
		content: {
			padding: "80px",
			flex: 1,
			overflowY: "auto"
		},
		sectionLabel: {
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: "#666",
			marginBottom: "16px",
			textTransform: "uppercase",
			display: "flex",
			alignItems: "center",
			gap: "8px"
		},
		mainTitle: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "48px",
			fontWeight: "400",
			color: "#FFFFFF",
			marginBottom: "16px",
			letterSpacing: "-0.02em",
			lineHeight: "1.2"
		},
		statsGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: "32px",
			marginTop: "64px"
		},
		card: {
			backgroundColor: "#111",
			padding: "32px",
			border: "1px solid #1F1F1F",
			position: "relative",
			overflow: "hidden"
		},
		cardHeader: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: "32px"
		},
		cardTitle: {
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: "#666",
			textTransform: "uppercase"
		},
		cardValue: {
			fontFamily: "\"Playfair Display\", serif",
			fontSize: "36px",
			color: "#FFF"
		},
		cardSubtitle: {
			fontSize: "11px",
			color: "#888",
			marginTop: "12px",
			letterSpacing: "0.05em",
			textTransform: "uppercase"
		},
		bottomGrid: {
			display: "grid",
			gridTemplateColumns: "2fr 1fr",
			gap: "32px",
			marginTop: "64px"
		},
		listRow: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			padding: "24px 32px",
			borderBottom: "1px solid #1F1F1F",
			":last-child": { borderBottom: "none" }
		},
		statusBadge: (status) => ({
			fontSize: "10px",
			fontWeight: "700",
			padding: "6px 12px",
			border: `1px solid ${status === "green" ? brandColor : status === "gray" ? "#444" : "#333"}`,
			color: status === "green" ? "#000" : status === "gray" ? "#CCC" : "#888",
			backgroundColor: status === "green" ? brandColor : "transparent",
			textTransform: "uppercase",
			letterSpacing: "0.1em"
		})
	};
	const formatMoney = (amount) => {
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
			maximumFractionDigits: 0
		}).format(amount);
	};
	const formatCompact = (num) => {
		if (num < 1e3) return num;
		return (num / 1e3).toFixed(1) + "k";
	};
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: .1 }
		}
	};
	const itemVariants = {
		hidden: {
			opacity: 0,
			y: 20
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: .5,
				ease: "easeOut"
			}
		}
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		className: "dash-page",
		children: [
			/* @__PURE__ */ jsx("style", { children: `
          @media (max-width: 768px) {
            .dash-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow: visible !important; }
            .dash-sidebar { 
              position: fixed !important; 
              top: 0 !important; 
              left: ${isSidebarOpen ? "0" : "-100%"} !important; 
              width: 280px !important; 
              height: 100vh !important; 
              z-index: 1000 !important; 
              background-color: #0A0A0A !important;
              transition: left 0.3s ease !important;
              box-shadow: 10px 0 30px rgba(0,0,0,0.5) !important;
            }
            .dash-overlay {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background-color: rgba(0,0,0,0.7) !important;
              z-index: 999 !important;
              display: ${isSidebarOpen ? "block" : "none"} !important;
            }
            .dash-logo-container { padding: 24px !important; }
            .dash-nav { display: flex; flex-direction: column !important; overflow-y: auto !important; }
            .dash-nav a, .dash-nav div { border-left: 3px solid transparent !important; border-bottom: none !important; padding: 16px 40px !important; font-size: 14px !important; }
            .dash-user-profile { display: flex !important; margin-top: auto; } 
            
            .dash-header { height: auto !important; padding: 24px 20px !important; flex-wrap: wrap; gap: 16px; justify-content: space-between; position: sticky; top: 0; background: #0A0A0A; z-index: 100; border-bottom: 1px solid #1F1F1F; }
            .dash-search-bar { width: 100% !important; order: 3; margin-top: 8px; }
            .dash-header-actions { width: 100%; order: 4; justify-content: space-between; padding-top: 12px; border-top: 1px solid #1F1F1F; }
            
            .dash-content { padding: 24px 20px !important; overflow: visible !important; }
            .dash-brand-header { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
            .dash-brand-info { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
            .dash-brand-info h1 { font-size: 28px !important; }
            .dash-live-domain { width: 100%; align-items: flex-start !important; padding: 20px !important; }
            
            .dash-stats-grid { grid-template-columns: 1fr !important; gap: 16px !important; margin-top: 40px !important; }
            .dash-card { padding: 24px !important; }
            .dash-card-value { font-size: 28px !important; }
            
            .dash-bottom-grid { grid-template-columns: 1fr !important; gap: 24px !important; margin-top: 40px !important; }
            .dash-list-row { padding: 20px !important; flex-direction: column; align-items: flex-start !important; gap: 16px; }
            .dash-list-row > div:last-child { text-align: left !important; width: 100%; display: flex; justify-content: space-between; align-items: center; }
            .mobile-only { display: block !important; }
          }
          @media (min-width: 769px) {
            .mobile-only { display: none !important; }
          }
        ` }),
			/* @__PURE__ */ jsx("div", {
				className: "dash-overlay",
				onClick: () => setIsSidebarOpen(false)
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.sidebar,
				className: "dash-sidebar",
				children: [
					/* @__PURE__ */ jsxs("div", {
						style: {
							...s.logoContainer,
							position: "relative"
						},
						className: "dash-logo-container",
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: () => setIsSidebarOpen(false),
								style: {
									position: "absolute",
									top: "24px",
									right: "24px",
									background: "none",
									border: "none",
									color: "#666",
									cursor: "pointer"
								},
								className: "mobile-only",
								children: /* @__PURE__ */ jsx(X, { size: 24 })
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/",
								style: { textDecoration: "none" },
								children: /* @__PURE__ */ jsx("div", {
									style: s.logo,
									children: "Zizzystores."
								})
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontFamily: "Inter",
									fontSize: "9px",
									fontWeight: "700",
									letterSpacing: "0.1em",
									color: "#666",
									marginTop: "8px",
									textTransform: "uppercase"
								},
								children: "Digital Store"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.nav,
						className: "dash-nav",
						children: [
							/* @__PURE__ */ jsxs("div", {
								onClick: () => setActiveTab("overview"),
								style: s.navItem(activeTab === "overview"),
								children: [/* @__PURE__ */ jsx(LayoutGrid, { size: 16 }), " Overview"]
							}),
							/* @__PURE__ */ jsxs(Link, {
								to: "/profile",
								style: s.navItem(false),
								children: [/* @__PURE__ */ jsx(User, { size: 16 }), " Profile"]
							}),
							/* @__PURE__ */ jsxs(Link, {
								to: "/edit",
								style: s.navItem(false),
								children: [/* @__PURE__ */ jsx(Edit, { size: 16 }), " Edit"]
							}),
							profileData.is_admin && /* @__PURE__ */ jsxs("div", {
								onClick: () => setActiveTab("support"),
								style: s.navItem(activeTab === "support"),
								children: [/* @__PURE__ */ jsx(MessageSquare, { size: 16 }), " Support"]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						style: s.userProfile,
						className: "dash-user-profile",
						children: [/* @__PURE__ */ jsx("div", {
							style: s.userAvatar,
							children: profileData.logo_url ? /* @__PURE__ */ jsx("img", {
								src: profileData.logo_url,
								alt: profileData.owner_name,
								style: {
									width: "100%",
									height: "100%",
									objectFit: "cover"
								}
							}) : /* @__PURE__ */ jsx("span", {
								style: { color: "#FFF" },
								children: profileData.owner_name?.charAt(0)?.toUpperCase() || "U"
							})
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "12px",
								fontWeight: "700",
								color: "#FFF",
								letterSpacing: "0.05em",
								textTransform: "uppercase"
							},
							children: profileData.owner_name
						}), /* @__PURE__ */ jsx("div", {
							style: {
								fontSize: "10px",
								color: "#666",
								letterSpacing: "0.1em",
								textTransform: "uppercase",
								marginTop: "4px"
							},
							children: "Brand Director"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.main,
				children: [/* @__PURE__ */ jsxs("div", {
					style: s.header,
					className: "dash-header",
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: "16px"
							},
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => setIsSidebarOpen(true),
									style: {
										background: "none",
										border: "none",
										color: "#FFF",
										cursor: "pointer"
									},
									className: "mobile-only",
									children: /* @__PURE__ */ jsx(Menu, { size: 24 })
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/",
									style: {
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: "36px",
										height: "36px",
										borderRadius: "50%",
										border: "1px solid #1F1F1F",
										color: "#888",
										textDecoration: "none",
										transition: "all 0.2s"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.color = "#FFF";
										e.currentTarget.style.borderColor = "#333";
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.color = "#888";
										e.currentTarget.style.borderColor = "#1F1F1F";
									},
									children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18 })
								}),
								/* @__PURE__ */ jsx("div", {
									style: s.headerTitle,
									children: activeTab === "overview" ? "Dashboard" : "Customer Support"
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: s.searchBar,
							className: "dash-search-bar",
							children: [/* @__PURE__ */ jsx(Search, {
								size: 14,
								color: "#666"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "SEARCH ...",
								style: s.searchInput
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							style: s.headerActions,
							className: "dash-header-actions",
							children: /* @__PURE__ */ jsx(Link, {
								to: `/shop-brand/${user?.id}`,
								style: { textDecoration: "none" },
								children: /* @__PURE__ */ jsxs("div", {
									style: {
										...s.premiumBadge,
										backgroundColor: brandColor,
										color: "#000",
										padding: "10px 24px",
										display: "flex",
										alignItems: "center",
										gap: "8px",
										fontSize: "11px",
										fontWeight: "800",
										border: "none",
										borderRadius: "4px",
										boxShadow: `0 4px 12px ${brandColor}33`
									},
									children: [/* @__PURE__ */ jsx(Store, { size: 16 }), " MANAGE STORE"]
								})
							})
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					style: s.content,
					className: "dash-content",
					children: activeTab === "overview" ? /* @__PURE__ */ jsxs(motion.div, {
						initial: "hidden",
						animate: "visible",
						variants: containerVariants,
						children: [
							/* @__PURE__ */ jsxs(motion.div, {
								variants: itemVariants,
								style: {
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-end",
									borderBottom: "1px solid #1F1F1F",
									paddingBottom: "40px"
								},
								className: "dash-brand-header",
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										gap: "32px",
										alignItems: "center"
									},
									className: "dash-brand-info",
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											width: "100px",
											height: "100px",
											border: "1px solid #333",
											backgroundColor: "#111",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											overflow: "hidden"
										},
										children: profileData.logo_url ? /* @__PURE__ */ jsx("img", {
											src: profileData.logo_url,
											alt: "Brand Logo",
											style: {
												width: "100%",
												height: "100%",
												objectFit: "cover"
											}
										}) : /* @__PURE__ */ jsx("span", {
											style: {
												fontSize: "48px",
												color: "#FFF",
												fontFamily: "\"Playfair Display\", serif"
											},
											children: profileData.brand_name?.charAt(0)?.toUpperCase() || "Z"
										})
									}), /* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsxs("div", {
											style: s.sectionLabel,
											children: [/* @__PURE__ */ jsx("div", { style: {
												width: "2px",
												height: "12px",
												backgroundColor: "#FFF"
											} }), "Brand Profile"]
										}),
										/* @__PURE__ */ jsx("h1", {
											style: {
												...s.mainTitle,
												fontSize: "36px",
												marginBottom: "16px",
												lineHeight: "1"
											},
											children: profileData.brand_name
										}),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												gap: "24px",
												color: "#888",
												fontSize: "12px",
												letterSpacing: "0.05em",
												flexWrap: "wrap"
											},
											children: [/* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "8px"
												},
												children: [
													/* @__PURE__ */ jsx("span", {
														style: {
															color: "#FFF",
															fontWeight: "600"
														},
														children: "Email:"
													}),
													" ",
													profileData.email_address
												]
											}), /* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													alignItems: "center",
													gap: "8px"
												},
												children: [
													/* @__PURE__ */ jsx("span", {
														style: {
															color: "#FFF",
															fontWeight: "600"
														},
														children: "Phone:"
													}),
													" ",
													profileData.phone_number
												]
											})]
										})
									] })]
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										padding: "24px",
										border: "1px solid #1F1F1F",
										backgroundColor: "#111",
										display: "flex",
										flexDirection: "column",
										alignItems: "flex-end"
									},
									className: "dash-live-domain",
									children: [/* @__PURE__ */ jsx("div", {
										style: {
											fontSize: "10px",
											fontWeight: "700",
											letterSpacing: "0.1em",
											color: "#666",
											textTransform: "uppercase",
											marginBottom: "8px"
										},
										children: "Live Domain"
									}), profileData.website_url ? /* @__PURE__ */ jsxs("a", {
										href: profileData.website_url.startsWith("http") ? profileData.website_url : `https://${profileData.website_url}`,
										target: "_blank",
										rel: "noopener noreferrer",
										style: {
											fontSize: "14px",
											color: "#FFF",
											textDecoration: "none",
											borderBottom: "1px solid #FFF",
											paddingBottom: "2px",
											display: "flex",
											alignItems: "center"
										},
										children: [
											profileData.website_url.replace(/^https?:\/\//, ""),
											" ",
											/* @__PURE__ */ jsx(ArrowUpRight, {
												size: 14,
												style: { marginLeft: "6px" }
											})
										]
									}) : /* @__PURE__ */ jsx("span", {
										style: {
											fontSize: "12px",
											color: "#888"
										},
										children: "activation pending"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.statsGrid,
								className: "dash-stats-grid",
								children: [
									/* @__PURE__ */ jsxs(motion.div, {
										variants: itemVariants,
										style: s.card,
										children: [
											/* @__PURE__ */ jsxs("div", {
												style: s.cardHeader,
												children: [/* @__PURE__ */ jsx("div", {
													style: {
														border: "1px solid #333",
														padding: "8px"
													},
													children: /* @__PURE__ */ jsx(TrendingUp, {
														size: 14,
														color: "#FFF"
													})
												}), /* @__PURE__ */ jsx("div", {
													style: {
														fontSize: "10px",
														fontWeight: "700",
														color: "#666",
														letterSpacing: "0.1em",
														textTransform: "uppercase"
													},
													children: metrics.totalSales > 0 ? "+12.4% THIS MONTH" : "NO DATA YET"
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardTitle,
												children: "Total Sales"
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardValue,
												children: formatMoney(metrics.totalSales)
											}),
											/* @__PURE__ */ jsx("div", {
												style: {
													marginTop: "32px",
													width: "100%",
													height: "1px",
													backgroundColor: "#1F1F1F",
													position: "relative"
												},
												children: /* @__PURE__ */ jsx(motion.div, {
													initial: { width: 0 },
													animate: { width: metrics.totalSales > 0 ? "60%" : "0%" },
													transition: {
														duration: 1.5,
														ease: "circOut",
														delay: .5
													},
													style: {
														position: "absolute",
														top: 0,
														left: 0,
														height: "1px",
														backgroundColor: "#FFF"
													}
												})
											})
										]
									}),
									/* @__PURE__ */ jsxs(motion.div, {
										variants: itemVariants,
										style: s.card,
										children: [
											/* @__PURE__ */ jsxs("div", {
												style: s.cardHeader,
												children: [/* @__PURE__ */ jsx(Package, {
													size: 18,
													color: "#888"
												}), /* @__PURE__ */ jsx("div", {
													style: {
														fontSize: "10px",
														fontWeight: "700",
														color: "#666",
														letterSpacing: "0.1em",
														textTransform: "uppercase"
													},
													children: metrics.activeStock > 0 ? "ACTIVE" : "EMPTY"
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardTitle,
												children: "Stock Portfolio"
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardValue,
												children: metrics.activeStock
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardSubtitle,
												children: "Total Product Listings"
											})
										]
									}),
									/* @__PURE__ */ jsxs(motion.div, {
										variants: itemVariants,
										style: s.card,
										children: [
											/* @__PURE__ */ jsxs("div", {
												style: s.cardHeader,
												children: [/* @__PURE__ */ jsx(BarChart3, {
													size: 18,
													color: "#888"
												}), /* @__PURE__ */ jsx("div", {
													style: {
														fontSize: "10px",
														fontWeight: "700",
														color: "#666",
														letterSpacing: "0.1em",
														textTransform: "uppercase"
													},
													children: metrics.totalTraffic > 0 ? "LIVE NOW" : "AWAITING TRAFFIC"
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardTitle,
												children: "Your Traffic"
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardValue,
												children: formatCompact(metrics.totalTraffic)
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.cardSubtitle,
												children: "Unique Store Visitors"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								style: s.bottomGrid,
								className: "dash-bottom-grid",
								children: /* @__PURE__ */ jsxs(motion.div, {
									variants: itemVariants,
									style: {
										backgroundColor: "#111",
										border: "1px solid #1F1F1F"
									},
									children: [/* @__PURE__ */ jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											padding: "32px",
											borderBottom: "1px solid #1F1F1F"
										},
										children: [/* @__PURE__ */ jsx("div", {
											style: {
												fontFamily: "\"Playfair Display\", serif",
												fontSize: "24px",
												color: "#FFF"
											},
											children: "Recent Orders"
										}), metrics.recentOrders.length > 0 && /* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												color: "#FFF",
												letterSpacing: "0.1em",
												fontWeight: "700",
												textTransform: "uppercase",
												cursor: "pointer",
												borderBottom: "1px solid #FFF"
											},
											children: "View Full Ledger"
										})]
									}), metrics.recentOrders.length > 0 ? metrics.recentOrders.map((order, index) => /* @__PURE__ */ jsxs(motion.div, {
										variants: itemVariants,
										style: s.listRow,
										className: "dash-list-row",
										children: [/* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												alignItems: "center",
												gap: "24px"
											},
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													width: "48px",
													height: "48px",
													border: "1px solid #333",
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: /* @__PURE__ */ jsx(ShoppingBag, {
													size: 18,
													color: "#666"
												})
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "10px",
													fontWeight: "700",
													color: "#666",
													letterSpacing: "0.1em",
													marginBottom: "8px",
													textTransform: "uppercase"
												},
												children: order.order_number
											}), /* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "14px",
													color: "#FFF"
												},
												children: order.product_name_snapshot
											})] })]
										}), /* @__PURE__ */ jsxs("div", {
											style: { textAlign: "right" },
											children: [/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "14px",
													fontWeight: "600",
													color: "#FFF",
													marginBottom: "12px"
												},
												children: formatMoney(order.total_amount)
											}), /* @__PURE__ */ jsx("div", {
												style: s.statusBadge(order.status === "processing" ? "gray" : order.status === "completed" ? "green" : "gray"),
												children: order.status === "processing" ? "Processing" : order.status === "completed" ? "Paid & Ready" : order.status
											})]
										})]
									}, order.id)) : /* @__PURE__ */ jsxs("div", {
										style: {
											padding: "64px",
											textAlign: "center"
										},
										children: [
											/* @__PURE__ */ jsx("div", {
												style: {
													display: "inline-flex",
													padding: "16px",
													backgroundColor: "#1A1A1A",
													borderRadius: "50%",
													marginBottom: "24px"
												},
												children: /* @__PURE__ */ jsx(Package, {
													size: 24,
													color: "#666"
												})
											}),
											/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "14px",
													color: "#FFF",
													marginBottom: "8px"
												},
												children: "Your Ledger is Empty"
											}),
											/* @__PURE__ */ jsx("div", {
												style: {
													fontSize: "12px",
													color: "#666"
												},
												children: "Incoming orders will securely populate here."
											})
										]
									})]
								})
							})
						]
					}) : /* @__PURE__ */ jsx("div", {
						style: { height: "calc(100vh - 160px)" },
						children: /* @__PURE__ */ jsx(AdminChat, {})
					})
				})]
			})
		]
	}) });
}
//#endregion
export { Dashboard as default };
