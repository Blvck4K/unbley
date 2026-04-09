import { t as createLucideIcon } from "./createLucideIcon-D9kzrCV5.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Rocket = createLucideIcon("rocket", [
	["path", {
		d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
		key: "qeys4"
	}],
	["path", {
		d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09",
		key: "u4xsad"
	}],
	["path", {
		d: "M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z",
		key: "676m9"
	}],
	["path", {
		d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05",
		key: "92ym6u"
	}]
]);
//#endregion
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
export { Rocket as n, CTASection as t };
