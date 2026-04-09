import "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { CreditCard, Hammer, Rocket } from "lucide-react";
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
