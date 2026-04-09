import "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Rocket } from "lucide-react";
//#region src/components/CTASection.jsx
function CTASection() {
	return /* @__PURE__ */ jsx("section", {
		className: "cta-section",
		children: /* @__PURE__ */ jsxs("div", {
			className: "container cta-grid",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "cta-content",
				style: { textAlign: window.innerWidth <= 768 ? "center" : "left" },
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "cta-title",
						style: { fontSize: window.innerWidth <= 768 ? "32px" : "40px" },
						children: "Ready to Launch Your Venture?"
					}),
					/* @__PURE__ */ jsx("p", {
						style: {
							color: "#9CA3AF",
							marginBottom: "40px",
							fontSize: "16px",
							lineHeight: "1.6",
							margin: window.innerWidth <= 768 ? "0 auto 40px" : "0 0 40px",
							maxWidth: "500px"
						},
						children: "We help founders achieve life-changing sales. Launch your business with the market's most vetted e-commerce infrastructure."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "cta-features",
						style: { alignItems: window.innerWidth <= 768 ? "center" : "flex-start" },
						children: /* @__PURE__ */ jsxs("div", {
							className: "cta-feature",
							style: { textAlign: "left" },
							children: [/* @__PURE__ */ jsx("div", {
								className: "cta-icon-wrapper",
								children: /* @__PURE__ */ jsx(Rocket, { size: 20 })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
								style: { fontSize: "14px" },
								children: "Rapid Setup"
							}), /* @__PURE__ */ jsx("p", {
								style: { fontSize: "12px" },
								children: "Average launch time of 24 hours from payment."
							})] })]
						})
					}),
					/* @__PURE__ */ jsx("button", {
						className: "btn",
						style: {
							backgroundColor: "white",
							color: "black",
							marginTop: "40px",
							padding: "16px 32px"
						},
						children: /* @__PURE__ */ jsx("a", {
							href: "/auth",
							children: "Start Your Sandbox Let's Go"
						})
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "cta-visual",
				style: {
					height: window.innerWidth <= 768 ? "200px" : "400px",
					backgroundColor: "#111827",
					borderRadius: "var(--radius-lg)",
					border: "1px solid #374151",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					color: "#4B5563",
					padding: "24px",
					textAlign: "center",
					marginTop: window.innerWidth <= 768 ? "40px" : "0"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontSize: "40px",
						marginBottom: "16px"
					},
					children: "🚀"
				}), /* @__PURE__ */ jsx("div", {
					style: {
						fontSize: "12px",
						fontWeight: "600",
						letterSpacing: "0.1em",
						textTransform: "uppercase"
					},
					children: "High Speed Deployment"
				})]
			})]
		})
	});
}
//#endregion
export { CTASection as t };
