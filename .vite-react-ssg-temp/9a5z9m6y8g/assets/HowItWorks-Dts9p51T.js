import { t as createLucideIcon } from "./createLucideIcon-D9kzrCV5.js";
import { t as CreditCard } from "./credit-card-CoPr4Y3u.js";
import { n as Rocket } from "./CTASection-C1Xz8rN2.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Hammer = createLucideIcon("hammer", [
	["path", {
		d: "m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9",
		key: "1hayfq"
	}],
	["path", {
		d: "m18 15 4-4",
		key: "16gjal"
	}],
	["path", {
		d: "m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5",
		key: "15ts47"
	}]
]);
//#endregion
//#region src/components/HowItWorks.jsx
function HowItWorks() {
	return /* @__PURE__ */ jsx("section", {
		className: "how-it-works-section",
		style: {
			padding: "80px 0",
			backgroundColor: "var(--bg-light)",
			borderBottom: "1px solid var(--border-color)"
		},
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
					children: "How ZizzyStores Works"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-secondary",
					children: "Three simple steps to launch your digital storefront."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-3 gap-8",
				style: {
					position: "relative",
					marginTop: "40px"
				},
				children: [
					{
						icon: /* @__PURE__ */ jsx(CreditCard, {
							size: 28,
							color: "white"
						}),
						title: "Pay & Submit Details",
						description: "Make your discounted first-year payment and fill out a quick form with your brand details and preferences."
					},
					{
						icon: /* @__PURE__ */ jsx(Hammer, {
							size: 28,
							color: "white"
						}),
						title: "We Build Your Store",
						description: "Our expert team registers your domain and perfectly builds your custom e-commerce platform within 24 hours."
					},
					{
						icon: /* @__PURE__ */ jsx(Rocket, {
							size: 28,
							color: "white"
						}),
						title: "You Start Selling",
						description: "You get full admin access. Add your products, set your prices, and launch your brand to the world immediately."
					}
				].map((step, i) => /* @__PURE__ */ jsxs("div", {
					style: {
						textAlign: "center",
						position: "relative",
						zIndex: 1,
						padding: "24px"
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							style: {
								width: "64px",
								height: "64px",
								backgroundColor: "var(--bg-dark)",
								borderRadius: "50%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								margin: "0 auto 24px",
								boxShadow: "0 10px 25px -3px rgba(0,0,0,0.1)"
							},
							children: step.icon
						}),
						/* @__PURE__ */ jsxs("h3", {
							style: {
								fontSize: "20px",
								fontWeight: "800",
								marginBottom: "16px"
							},
							children: [
								i + 1,
								". ",
								step.title
							]
						}),
						/* @__PURE__ */ jsx("p", {
							style: {
								lineHeight: "1.6",
								color: "var(--text-secondary)",
								fontSize: "14px"
							},
							children: step.description
						})
					]
				}, i))
			})]
		})
	});
}
//#endregion
export { HowItWorks as t };
