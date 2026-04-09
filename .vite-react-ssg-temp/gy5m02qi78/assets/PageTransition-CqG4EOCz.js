import "react";
import { jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
//#region src/components/PageTransition.jsx
var PageTransition = ({ children }) => {
	return /* @__PURE__ */ jsx(motion.div, {
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
		transition: {
			duration: .4,
			ease: [
				.25,
				.1,
				.25,
				1
			]
		},
		children
	});
};
//#endregion
export { PageTransition as t };
