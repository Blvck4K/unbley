import { n as motion, t as PageTransition } from "./PageTransition-8IvNPEDC.js";
import { n as supabase, t as signInWithGoogle } from "./supabase-DvwDzIWb.js";
import { t as createLucideIcon } from "./createLucideIcon-D9kzrCV5.js";
import { t as ArrowLeft } from "./arrow-left-C_NRIx5x.js";
import { t as CircleCheck } from "./circle-check-DbL_-DIu.js";
import { t as Eye } from "./eye-DOTePb0t.js";
import { t as Search } from "./search-Cb7vyolf.js";
import { t as ShoppingBag } from "./shopping-bag-CMby-eB0.js";
import { t as AnimatePresence } from "./AnimatePresence-C4rO5Lx3.js";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
var EyeOff = createLucideIcon("eye-off", [
	["path", {
		d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
		key: "ct8e1f"
	}],
	["path", {
		d: "M14.084 14.158a3 3 0 0 1-4.242-4.242",
		key: "151rxh"
	}],
	["path", {
		d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
		key: "13bj9a"
	}],
	["path", {
		d: "m2 2 20 20",
		key: "1ooewy"
	}]
]);
//#endregion
//#region src/pages/Auth.jsx
function Auth() {
	const [authMode, setAuthMode] = useState("signup");
	const [userType, setUserType] = useState("brand");
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [category, setCategory] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const navigate = useNavigate();
	const location = useLocation();
	React.useEffect(() => {
		const mode = new URLSearchParams(location.search).get("mode");
		if (mode === "signin") setAuthMode("signin");
		else if (mode === "signup") setAuthMode("signup");
	}, [location]);
	const handleGoogleLogin = async () => {
		try {
			setLoading(true);
			const { error } = await signInWithGoogle();
			if (error) throw error;
		} catch (err) {
			setErrorMsg(err.message);
		} finally {
			setLoading(false);
		}
	};
	const handleAuth = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrorMsg("");
		try {
			if (authMode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: { data: {
						full_name: name,
						role: userType,
						phone: userType === "brand" ? phone : null,
						category: userType === "brand" ? category : null
					} }
				});
				if (error) throw error;
				navigate(userType === "customer" ? "/store" : "/dashboard");
			} else {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				const role = data?.user?.user_metadata?.role;
				navigate(role === "customer" ? "/store" : "/dashboard");
			}
		} catch (err) {
			setErrorMsg(err.message);
		} finally {
			setLoading(false);
		}
	};
	const brandColor = "#06acf8ff";
	const s = {
		page: {
			backgroundColor: "#0A0A0A",
			color: "#E5E5E5",
			minHeight: "100vh",
			display: "flex",
			fontFamily: "\"Inter\", sans-serif"
		},
		sidebar: {
			width: "280px",
			borderRight: "1px solid #1F1F1F",
			padding: "60px 40px",
			display: "flex",
			flexDirection: "column"
		},
		main: {
			flex: 1,
			padding: "80px",
			display: "flex",
			justifyContent: "center"
		},
		content: {
			maxWidth: "580px",
			width: "100%"
		},
		title: {
			fontFamily: "\"Playfair Display\", \"Times New Roman\", serif",
			fontSize: "48px",
			fontWeight: "400",
			color: "#FFFFFF",
			marginBottom: "16px",
			letterSpacing: "-0.02em"
		},
		subtitle: {
			color: "#888888",
			fontSize: "14px",
			lineHeight: "1.6",
			marginBottom: "64px"
		},
		sectionLabel: {
			fontSize: "11px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			color: brandColor,
			marginTop: "48px",
			marginBottom: "32px",
			textTransform: "uppercase",
			display: "flex",
			alignItems: "center",
			gap: "8px"
		},
		inputGroup: { marginBottom: "32px" },
		label: {
			display: "block",
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.08em",
			color: "#666666",
			textTransform: "uppercase",
			marginBottom: "12px"
		},
		input: {
			width: "100%",
			backgroundColor: "transparent",
			border: "none",
			borderBottom: "1px solid #333333",
			padding: "4px 0 16px",
			color: "#CCCCCC",
			fontSize: "14px",
			outline: "none",
			transition: "border-color 0.2s",
			"&:focus": { borderBottom: `1px solid ${brandColor}` }
		},
		button: {
			width: "100%",
			padding: "16px",
			backgroundColor: brandColor,
			color: "#000000",
			fontSize: "12px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			border: "none",
			cursor: "pointer",
			marginTop: "48px",
			transition: "background-color 0.2s"
		},
		toggleGroup: {
			display: "flex",
			gap: "32px",
			marginBottom: "64px",
			borderBottom: "1px solid #1F1F1F"
		},
		toggleButton: (isActive) => ({
			padding: "12px 0",
			border: "none",
			background: "transparent",
			color: isActive ? "#FFFFFF" : "#666666",
			fontSize: "12px",
			fontWeight: "600",
			letterSpacing: "0.05em",
			textTransform: "uppercase",
			borderBottom: isActive ? `2px solid ${brandColor}` : "2px solid transparent",
			cursor: "pointer",
			marginBottom: "-1px",
			transition: "all 0.2s"
		})
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		children: [
			/* @__PURE__ */ jsx("style", { children: `
          @media (max-width: 768px) {
            .auth-main { padding: 48px 24px !important; }
            .auth-title { font-size: 32px !important; text-align: center; }
            .auth-subtitle { text-align: center; margin-bottom: 32px !important; }
            .auth-type-row { flex-direction: column !important; gap: 12px !important; }
            .auth-form-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
            .auth-toggle-group { gap: 16px !important; justify-content: center; }
            .auth-google-apple { flex-direction: column !important; gap: 12px !important; }
            .auth-sidebar { display: none !important; }
            .auth-quote-box { display: none !important; }
            .auth-mobile-logo { display: block !important; }
          }
        ` }),
			/* @__PURE__ */ jsxs("div", {
				style: s.sidebar,
				className: "auth-sidebar text-left",
				children: [
					/* @__PURE__ */ jsx("div", {
						style: {
							fontFamily: "\"Playfair Display\", serif",
							fontSize: "18px",
							letterSpacing: "0.05em",
							color: brandColor,
							marginBottom: "80px",
							textTransform: "uppercase"
						},
						children: "Zizzystores."
					}),
					/* @__PURE__ */ jsx("div", {
						style: { flex: 1 },
						children: /* @__PURE__ */ jsxs("div", {
							style: { marginBottom: "40px" },
							children: [/* @__PURE__ */ jsx("h3", {
								style: {
									fontSize: "15px",
									fontWeight: "500",
									color: "#E5E5E5",
									marginBottom: "16px",
									lineHeight: "1.4"
								},
								children: "Accelerate your digital retail."
							}), /* @__PURE__ */ jsxs("ul", {
								style: {
									listStyle: "none",
									padding: 0,
									margin: 0,
									display: "flex",
									flexDirection: "column",
									gap: "12px"
								},
								children: [
									/* @__PURE__ */ jsxs("li", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "8px",
											fontSize: "12px",
											color: "#888"
										},
										children: [/* @__PURE__ */ jsx(CircleCheck, {
											size: 12,
											color: brandColor
										}), " Launch in 24 hours"]
									}),
									/* @__PURE__ */ jsxs("li", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "8px",
											fontSize: "12px",
											color: "#888"
										},
										children: [/* @__PURE__ */ jsx(CircleCheck, {
											size: 12,
											color: brandColor
										}), " Trusted by 100+ brands"]
									}),
									/* @__PURE__ */ jsxs("li", {
										style: {
											display: "flex",
											alignItems: "center",
											gap: "8px",
											fontSize: "12px",
											color: "#888"
										},
										children: [/* @__PURE__ */ jsx(CircleCheck, {
											size: 12,
											color: brandColor
										}), " Zero hidden fees"]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							fontSize: "10px",
							fontWeight: "700",
							letterSpacing: "0.1em",
							color: "#666",
							textTransform: "uppercase",
							marginBottom: "32px"
						},
						children: "Navigation"
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "24px"
						},
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/",
							style: {
								color: "#888",
								fontSize: "13px",
								textDecoration: "none",
								display: "flex",
								alignItems: "center",
								gap: "12px",
								transition: "color 0.2s"
							},
							children: [/* @__PURE__ */ jsx(ArrowLeft, { size: 16 }), " Return Homepage"]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				style: s.main,
				className: "auth-main",
				children: /* @__PURE__ */ jsxs(motion.div, {
					initial: {
						opacity: 0,
						x: 20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: {
						duration: .6,
						ease: "easeOut"
					},
					style: s.content,
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "auth-mobile-logo",
							style: {
								display: "none",
								textAlign: "center",
								marginBottom: "48px"
							},
							children: /* @__PURE__ */ jsx(Link, {
								to: "/",
								style: {
									fontFamily: "\"Playfair Display\", serif",
									fontSize: "24px",
									letterSpacing: "0.05em",
									color: brandColor,
									textDecoration: "none",
									textTransform: "uppercase"
								},
								children: "Zizzystores."
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							style: s.toggleGroup,
							className: "auth-toggle-group",
							children: [/* @__PURE__ */ jsx("button", {
								style: s.toggleButton(authMode === "signin"),
								onClick: () => setAuthMode("signin"),
								children: "MEMBER ACCESS"
							}), /* @__PURE__ */ jsx("button", {
								style: s.toggleButton(authMode === "signup"),
								onClick: () => setAuthMode("signup"),
								children: "GAIN ACCESS"
							})]
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: handleAuth,
							children: [
								/* @__PURE__ */ jsx(AnimatePresence, {
									mode: "wait",
									children: /* @__PURE__ */ jsxs(motion.div, {
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
											y: -10
										},
										transition: { duration: .3 },
										children: [errorMsg && /* @__PURE__ */ jsx("div", {
											style: {
												padding: "12px",
												backgroundColor: "rgba(255, 0, 0, 0.1)",
												color: "#ff4444",
												fontSize: "12px",
												marginBottom: "24px",
												border: "1px solid #ff4444",
												borderRadius: "4px"
											},
											children: errorMsg
										}), authMode === "signup" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
											/* @__PURE__ */ jsx("h1", {
												style: s.title,
												children: "Create Account"
											}),
											/* @__PURE__ */ jsx("p", {
												style: {
													...s.subtitle,
													marginBottom: "24px"
												},
												children: "Create your account to launch and manage your online store."
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													gap: "16px",
													marginBottom: "40px"
												},
												children: [/* @__PURE__ */ jsxs("div", {
													style: {
														display: "flex",
														alignItems: "center",
														gap: "8px",
														fontSize: "12px",
														color: brandColor,
														fontWeight: "600"
													},
													children: [/* @__PURE__ */ jsx(CircleCheck, { size: 14 }), " Set up your store in 24 hours"]
												}), /* @__PURE__ */ jsxs("div", {
													style: {
														display: "flex",
														alignItems: "center",
														gap: "8px",
														fontSize: "12px",
														color: brandColor,
														fontWeight: "600"
													},
													children: [/* @__PURE__ */ jsx(CircleCheck, { size: 14 }), " Free domain included"]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.sectionLabel,
												children: [/* @__PURE__ */ jsx("div", { style: {
													width: "2px",
													height: "14px",
													backgroundColor: brandColor
												} }), "ACCOUNT TYPE"]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													display: "flex",
													gap: "24px",
													marginBottom: "32px"
												},
												className: "auth-type-row",
												children: [/* @__PURE__ */ jsxs("button", {
													type: "button",
													style: {
														flex: 1,
														padding: "20px",
														backgroundColor: userType === "brand" ? "#111" : "transparent",
														border: "1px solid",
														borderColor: userType === "brand" ? "#333" : "#1F1F1F",
														color: userType === "brand" ? "#FFF" : "#666",
														cursor: "pointer",
														display: "flex",
														flexDirection: "column",
														alignItems: "center",
														justifyContent: "center",
														gap: "10px",
														transition: "all 0.2s"
													},
													onClick: () => setUserType("brand"),
													children: [/* @__PURE__ */ jsxs("div", {
														style: {
															display: "flex",
															alignItems: "center",
															gap: "8px",
															fontSize: "13px",
															fontWeight: "600",
															letterSpacing: "0.02em"
														},
														children: [/* @__PURE__ */ jsx(Search, {
															size: 16,
															color: userType === "brand" ? "#FFF" : "#666"
														}), " Brand Owner"]
													}), /* @__PURE__ */ jsx("div", {
														style: {
															fontSize: "11px",
															color: "#888",
															fontWeight: "400"
														},
														children: "Create and manage your store"
													})]
												}), /* @__PURE__ */ jsxs("button", {
													type: "button",
													style: {
														flex: 1,
														padding: "20px",
														backgroundColor: userType === "customer" ? "#111" : "transparent",
														border: "1px solid",
														borderColor: userType === "customer" ? "#333" : "#1F1F1F",
														color: userType === "customer" ? "#FFF" : "#666",
														cursor: "pointer",
														display: "flex",
														flexDirection: "column",
														alignItems: "center",
														justifyContent: "center",
														gap: "10px",
														transition: "all 0.2s"
													},
													onClick: () => setUserType("customer"),
													children: [/* @__PURE__ */ jsxs("div", {
														style: {
															display: "flex",
															alignItems: "center",
															gap: "8px",
															fontSize: "13px",
															fontWeight: "600",
															letterSpacing: "0.02em"
														},
														children: [/* @__PURE__ */ jsx(ShoppingBag, {
															size: 16,
															color: userType === "customer" ? "#FFF" : "#666"
														}), " Customer Account"]
													}), /* @__PURE__ */ jsx("div", {
														style: {
															fontSize: "11px",
															color: "#888",
															fontWeight: "400"
														},
														children: "Shop and interact with brands"
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.sectionLabel,
												children: [/* @__PURE__ */ jsx("div", { style: {
													width: "2px",
													height: "14px",
													backgroundColor: brandColor
												} }), "CREDENTIALS & DETAILS"]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													display: "grid",
													gridTemplateColumns: "1fr 1fr",
													gap: "0 48px"
												},
												className: "auth-form-grid",
												children: [
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: userType === "brand" ? "BUSINESS NAME" : "FULL NAME"
														}), /* @__PURE__ */ jsx("input", {
															type: "text",
															placeholder: userType === "brand" ? "e.g. Zizzy W3ars" : "e.g. John Doe",
															style: s.input,
															value: name,
															onChange: (e) => setName(e.target.value),
															required: authMode === "signup"
														})]
													}),
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "EMAIL ADDRESS"
														}), /* @__PURE__ */ jsx("input", {
															type: "email",
															placeholder: "johndoe@gmail.com",
															style: s.input,
															value: email,
															onChange: (e) => setEmail(e.target.value),
															required: true
														})]
													}),
													userType === "brand" && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "PHONE NUMBER"
														}), /* @__PURE__ */ jsx("input", {
															type: "tel",
															placeholder: "+1 (000) 000-0000",
															style: s.input,
															value: phone,
															onChange: (e) => setPhone(e.target.value),
															required: true
														})]
													}), /* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "BRAND CATEGORY"
														}), /* @__PURE__ */ jsx("input", {
															type: "text",
															placeholder: "Fashion, Digital, Home",
															style: s.input,
															value: category,
															onChange: (e) => setCategory(e.target.value),
															required: true
														})]
													})] }),
													/* @__PURE__ */ jsxs("div", {
														style: s.inputGroup,
														children: [/* @__PURE__ */ jsx("label", {
															style: s.label,
															children: "CREATE PASSWORD"
														}), /* @__PURE__ */ jsxs("div", {
															style: { position: "relative" },
															children: [/* @__PURE__ */ jsx("input", {
																type: showPassword ? "text" : "password",
																placeholder: "••••••••",
																style: s.input,
																value: password,
																onChange: (e) => setPassword(e.target.value),
																required: true,
																minLength: 6
															}), /* @__PURE__ */ jsx("button", {
																type: "button",
																onClick: () => setShowPassword(!showPassword),
																style: {
																	position: "absolute",
																	right: 0,
																	top: "6px",
																	background: "none",
																	border: "none",
																	color: "#888",
																	cursor: "pointer"
																},
																children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
															})]
														})]
													})
												]
											})
										] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
											/* @__PURE__ */ jsx("h1", {
												style: s.title,
												children: "Sign In"
											}),
											/* @__PURE__ */ jsx("p", {
												style: s.subtitle,
												children: "Access your personalized dashboard. Enter your credentials to proceed to your management interface."
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.inputGroup,
												children: [/* @__PURE__ */ jsx("label", {
													style: s.label,
													children: "EMAIL ADDRESS"
												}), /* @__PURE__ */ jsx("input", {
													type: "email",
													placeholder: "johndoe@gmail.com",
													style: s.input,
													value: email,
													onChange: (e) => setEmail(e.target.value),
													required: true
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: s.inputGroup,
												children: [/* @__PURE__ */ jsx("label", {
													style: s.label,
													children: "PASSWORD"
												}), /* @__PURE__ */ jsxs("div", {
													style: { position: "relative" },
													children: [/* @__PURE__ */ jsx("input", {
														type: showPassword ? "text" : "password",
														placeholder: "••••••••",
														style: s.input,
														value: password,
														onChange: (e) => setPassword(e.target.value),
														required: true
													}), /* @__PURE__ */ jsx("button", {
														type: "button",
														onClick: () => setShowPassword(!showPassword),
														style: {
															position: "absolute",
															right: 0,
															top: "6px",
															background: "none",
															border: "none",
															color: "#888",
															cursor: "pointer"
														},
														children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
													})]
												})]
											})
										] })]
									}, authMode)
								}),
								/* @__PURE__ */ jsx(motion.button, {
									whileHover: { scale: 1.01 },
									whileTap: { scale: .99 },
									type: "submit",
									disabled: loading,
									style: {
										...s.button,
										opacity: loading ? .7 : 1
									},
									children: loading ? "PROCESSING..." : authMode === "signup" ? userType === "brand" ? "JOIN AS BRAND OWNER" : "CREATE ACCOUNT" : "Welcome Back"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "16px",
										margin: "32px 0 24px"
									},
									children: [
										/* @__PURE__ */ jsx("div", { style: {
											flex: 1,
											height: "1px",
											backgroundColor: "#1F1F1F"
										} }),
										/* @__PURE__ */ jsx("div", {
											style: {
												fontSize: "10px",
												fontWeight: "700",
												letterSpacing: "0.1em",
												color: "#666"
											},
											children: "OR CONTINUE WITH"
										}),
										/* @__PURE__ */ jsx("div", { style: {
											flex: 1,
											height: "1px",
											backgroundColor: "#1F1F1F"
										} })
									]
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										gap: "16px"
									},
									className: "auth-google-apple",
									children: /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: handleGoogleLogin,
										style: {
											flex: 1,
											padding: "12px",
											backgroundColor: "transparent",
											border: "1px solid #333",
											color: "#FFF",
											fontSize: "12px",
											fontWeight: "600",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											gap: "8px",
											cursor: "pointer",
											transition: "all 0.2s"
										},
										children: [/* @__PURE__ */ jsxs("svg", {
											width: "16",
											height: "16",
											viewBox: "0 0 24 24",
											fill: "none",
											xmlns: "http://www.w3.org/2000/svg",
											children: [
												/* @__PURE__ */ jsx("path", {
													d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
													fill: "#4285F4"
												}),
												/* @__PURE__ */ jsx("path", {
													d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
													fill: "#34A853"
												}),
												/* @__PURE__ */ jsx("path", {
													d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
													fill: "#FBBC05"
												}),
												/* @__PURE__ */ jsx("path", {
													d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
													fill: "#EA4335"
												})
											]
										}), "Google"]
									})
								}),
								/* @__PURE__ */ jsx("div", {
									style: {
										marginTop: "32px",
										textAlign: "center",
										fontSize: "13px",
										color: "#888"
									},
									children: authMode === "signup" ? /* @__PURE__ */ jsxs(Fragment$1, { children: ["Already have an account? ", /* @__PURE__ */ jsx("span", {
										style: {
											color: brandColor,
											fontWeight: "600",
											cursor: "pointer",
											borderBottom: `1px solid ${brandColor}`
										},
										onClick: (e) => {
											e.preventDefault();
											setAuthMode("signin");
										},
										children: "Sign in"
									})] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: ["Don't have an account? ", /* @__PURE__ */ jsx("span", {
										style: {
											color: brandColor,
											fontWeight: "600",
											cursor: "pointer",
											borderBottom: `1px solid ${brandColor}`
										},
										onClick: (e) => {
											e.preventDefault();
											setAuthMode("signup");
										},
										children: "Create one"
									})] })
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "auth-quote-box",
				style: {
					width: "400px",
					backgroundColor: "#070707",
					borderLeft: "1px solid #1F1F1F",
					padding: "80px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				},
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						padding: "60px 40px",
						border: "1px solid #1F1F1F",
						backgroundColor: "#0C0C0C"
					},
					children: [/* @__PURE__ */ jsx("p", {
						style: {
							fontFamily: "\"Playfair Display\", serif",
							fontSize: "24px",
							lineHeight: "1.5",
							color: "#E5E5E5",
							marginBottom: "32px"
						},
						children: "\"Your brand is what people say about you when you're not in the room.\""
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "12px",
							fontSize: "10px",
							color: "#666",
							textTransform: "uppercase",
							letterSpacing: "0.1em"
						},
						children: [/* @__PURE__ */ jsx("div", { style: {
							width: "12px",
							height: "1px",
							backgroundColor: "#666"
						} }), "JEFF BEZOS"]
					})]
				})
			})
		]
	}) });
}
//#endregion
export { Auth as default };
