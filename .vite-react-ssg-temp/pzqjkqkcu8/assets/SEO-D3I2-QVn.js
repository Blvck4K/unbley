import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/SEO.jsx
/**
* Reusable SEO component for managing document head metadata using native React 19 hoisting.
* React 19 automatically hoists <title>, <meta>, and <link> tags to the <head>.
*/
var SEO = ({ title, description = "Start your professional online store with ZizzyStores. The easiest way to sell products in Nigeria and beyond.", canonical, ogImage, ogType = "website", twitterHandle = "@zizzystores", keywords }) => {
	const siteName = "ZizzyStores";
	const fullTitle = title ? `${title} | ${siteName}` : siteName;
	const cleanDescription = React.useMemo(() => {
		if (!description) return "";
		const collapsed = description.replace(/<\/(h[1-6]|p|div|li|br)>/gi, " ").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
		return collapsed.length > 160 ? collapsed.substring(0, 157) + "..." : collapsed;
	}, [description]);
	const finalImage = ogImage || "https://zizzystores.com/og-default.jpg";
	const finalUrl = canonical || "https://zizzystores.com";
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("title", { children: fullTitle }),
		/* @__PURE__ */ jsx("meta", {
			name: "description",
			content: cleanDescription
		}),
		keywords && /* @__PURE__ */ jsx("meta", {
			name: "keywords",
			content: keywords
		}),
		/* @__PURE__ */ jsx("link", {
			rel: "canonical",
			href: finalUrl
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:type",
			content: ogType
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:title",
			content: fullTitle
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:description",
			content: cleanDescription
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:image",
			content: finalImage
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:url",
			content: finalUrl
		}),
		/* @__PURE__ */ jsx("meta", {
			property: "og:site_name",
			content: siteName
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:card",
			content: "summary_large_image"
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:title",
			content: fullTitle
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:description",
			content: cleanDescription
		}),
		/* @__PURE__ */ jsx("meta", {
			name: "twitter:image",
			content: finalImage
		}),
		twitterHandle && /* @__PURE__ */ jsx("meta", {
			name: "twitter:site",
			content: twitterHandle
		})
	] });
};
//#endregion
export { SEO as t };
