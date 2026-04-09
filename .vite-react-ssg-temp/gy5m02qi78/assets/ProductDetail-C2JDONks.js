import { n as supabase } from "./supabase-CTgwDjry.js";
import { t as useAuth } from "./useAuth-DY4X98To.js";
import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Edit2, Image, Minus, Plus, ShieldCheck, ShoppingCart, Trash2, Truck, User, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
//#region src/pages/ProductDetail.jsx
function ProductDetail() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [product, setProduct] = useState(null);
	const [brand, setBrand] = useState(null);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [qty, setQty] = useState(1);
	const { user } = useAuth();
	const isOwner = user?.id === brand?.id;
	const isCustomer = user?.user_metadata?.role === "customer" || user?.user_metadata?.userType === "customer";
	const [cartCount, setCartCount] = useState(0);
	const [activeImg, setActiveImg] = useState(0);
	const [selectedSize, setSelectedSize] = useState("");
	const [selectedColor, setSelectedColor] = useState("");
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef(null);
	const [editForm, setEditForm] = useState({
		title: "",
		price: "",
		description: "",
		tag: "",
		sizes: "",
		colors: "",
		imageFile: null,
		imagePreview: null,
		additionalImages: []
	});
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [id]);
	useEffect(() => {
		const updateCartCount = () => {
			try {
				setCartCount(JSON.parse(localStorage.getItem("cart") || "[]").reduce((total, item) => total + item.qty, 0));
			} catch (e) {
				setCartCount(0);
			}
		};
		updateCartCount();
		window.addEventListener("storage", updateCartCount);
		window.addEventListener("cartUpdated", updateCartCount);
		return () => {
			window.removeEventListener("storage", updateCartCount);
			window.removeEventListener("cartUpdated", updateCartCount);
		};
	}, []);
	useEffect(() => {
		async function fetchProductData() {
			if (!id) {
				setLoading(false);
				setError("Invalid URL context. Specific asset tag missing.");
				return;
			}
			try {
				setLoading(true);
				const { data: pData, error: pError } = await supabase.from("products").select("*").eq("id", id).single();
				if (pError || !pData) throw pError || /* @__PURE__ */ new Error("Asset not found");
				setProduct(pData);
				const { data: bData, error: bError } = await supabase.from("brand_profiles").select("*").eq("id", pData.brand_id).single();
				if (bError) throw bError;
				setBrand(bData);
				const { data: rData, error: rError } = await supabase.from("products").select("*").eq("brand_id", pData.brand_id).neq("id", id).limit(4);
				if (!rError) setRelatedProducts(rData || []);
			} catch (err) {
				console.error("Failed fetching digital asset details:", err);
				setError("This digital asset is not currently active.");
			} finally {
				setLoading(false);
			}
		}
		fetchProductData();
	}, [id]);
	const handleAddToCart = () => {
		if (!product) return;
		try {
			let existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
			if (existingCart.length > 0 && existingCart[0].brand_id !== brand.id) {
				if (!window.confirm("Your cart holds assets from another creator. Adding this will replace your current cart. Proceed?")) return;
				existingCart = [];
			}
			if (product.sizes && !selectedSize) {
				alert("Please select a size first.");
				return;
			}
			if (product.colors && !selectedColor) {
				alert("Please select a color first.");
				return;
			}
			const existingItemIndex = existingCart.findIndex((i) => i.id === product.id && i.size === selectedSize && i.color === selectedColor);
			if (existingItemIndex > -1) existingCart[existingItemIndex].qty += qty;
			else {
				let variantString = product.tag || "Standard Edition";
				if (selectedSize) variantString += ` - ${selectedSize}`;
				if (selectedColor) variantString += ` (${selectedColor})`;
				existingCart.push({
					id: product.id,
					name: product.title,
					variant: variantString,
					size: selectedSize,
					color: selectedColor,
					price: product.price,
					qty,
					img: product.image_url?.split(",")[0] || "",
					brand_id: brand.id
				});
			}
			localStorage.setItem("cart", JSON.stringify(existingCart));
			window.dispatchEvent(new Event("cartUpdated"));
			if (window.confirm(`${qty}x ${product.title} deployed to your secure Cart. Do you wish to checkout immediately?`)) navigate("/cart");
		} catch (err) {
			console.error("Cart Failure:", err);
			alert("Failed to connect to cart matrix.");
		}
	};
	const handleBuyNow = () => {
		if (!product) return;
		try {
			let existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
			if (existingCart.length > 0 && existingCart[0].brand_id !== brand.id) {
				if (!window.confirm("Your cart holds assets from another creator. Checking out this asset will clear your pending items. Proceed?")) return;
				existingCart = [];
			}
			if (product.sizes && !selectedSize) {
				alert("Please select a size first.");
				return;
			}
			if (product.colors && !selectedColor) {
				alert("Please select a color first.");
				return;
			}
			const existingItemIndex = existingCart.findIndex((i) => i.id === product.id && i.size === selectedSize && i.color === selectedColor);
			if (existingItemIndex > -1) existingCart[existingItemIndex].qty += qty;
			else {
				let variantString = product.tag || "Standard Edition";
				if (selectedSize) variantString += ` - ${selectedSize}`;
				if (selectedColor) variantString += ` (${selectedColor})`;
				existingCart.push({
					id: product.id,
					name: product.title,
					variant: variantString,
					size: selectedSize,
					color: selectedColor,
					price: product.price,
					qty,
					img: product.image_url?.split(",")[0] || "",
					brand_id: brand.id
				});
			}
			localStorage.setItem("cart", JSON.stringify(existingCart));
			window.dispatchEvent(new Event("cartUpdated"));
			navigate("/cart");
		} catch (err) {
			console.error(err);
		}
	};
	const handleEditClick = () => {
		setEditForm({
			title: product.title,
			price: product.price,
			description: product.description || "",
			tag: product.tag || "",
			sizes: product.sizes || "",
			colors: product.colors || "",
			imageFile: null,
			imagePreview: product.image_url,
			additionalImages: product.image_url && product.image_url.includes(",") ? product.image_url.split(",").slice(1).map((url) => ({
				file: null,
				preview: url
			})) : []
		});
		setIsEditModalOpen(true);
	};
	const handleEditSubmit = async (e) => {
		e.preventDefault();
		if (!isOwner) return;
		setUploading(true);
		try {
			let imageUrls = [editForm.imagePreview?.split(",")[0] || ""];
			if (editForm.imageFile) {
				const fileExt = editForm.imageFile.name.split(".").pop();
				const fileName = `${brand.id}-main-${Math.random()}.${fileExt}`;
				const filePath = `${brand.id}/${fileName}`;
				const { error: uploadError } = await supabase.storage.from("brand-assets").upload(filePath, editForm.imageFile);
				if (uploadError) throw uploadError;
				const { data: publicData } = supabase.storage.from("brand-assets").getPublicUrl(filePath);
				imageUrls[0] = publicData.publicUrl;
			}
			const newExtrasDraft = [...editForm.additionalImages.map((img) => img.preview).filter((p) => p && !p.startsWith("data:"))];
			for (let i = 0; i < editForm.additionalImages.length; i++) {
				const extra = editForm.additionalImages[i];
				if (extra.file) {
					const fileExt = extra.file.name.split(".").pop();
					const fileName = `${brand.id}-extra-${i}-${Math.random()}.${fileExt}`;
					const filePath = `${brand.id}/${fileName}`;
					const { error: uploadError } = await supabase.storage.from("brand-assets").upload(filePath, extra.file);
					if (!uploadError) {
						const { data: publicData } = supabase.storage.from("brand-assets").getPublicUrl(filePath);
						newExtrasDraft.push(publicData.publicUrl);
					}
				}
			}
			const finalImageUrl = [imageUrls[0], ...newExtrasDraft].filter(Boolean).join(",");
			const { error: updateError } = await supabase.from("products").update({
				title: editForm.title,
				price: parseFloat(editForm.price) || 0,
				description: editForm.description,
				tag: editForm.tag,
				sizes: editForm.sizes,
				colors: editForm.colors,
				image_url: finalImageUrl
			}).eq("id", product.id).eq("brand_id", brand.id);
			if (updateError) throw updateError;
			setProduct({
				...product,
				title: editForm.title,
				price: editForm.price,
				description: editForm.description,
				tag: editForm.tag,
				image_url: imageUrl
			});
			setIsEditModalOpen(false);
			alert("Asset Updated Successfully!");
		} catch (err) {
			console.error(err);
			alert("Error updating asset.");
		} finally {
			setUploading(false);
		}
	};
	const handleDeleteProduct = async () => {
		console.log("Delete attempt:", {
			productId: product.id,
			userId: user?.id,
			brandId: brand?.id,
			isOwner
		});
		if (!isOwner) {
			console.error("Deletion rejected: User is not authorized.");
			return;
		}
		if (!window.confirm("Are you sure you want to permanently delete this product? This act is irreversible.")) return;
		try {
			const { error } = await supabase.from("products").delete().eq("id", product.id).eq("brand_id", brand.id);
			if (error) throw error;
			console.log("Product deleted successfully from DB");
			alert("Asset neutralized.");
			navigate(`/shop-brand/${brand.id}`);
		} catch (err) {
			console.error("Deletion failed:", err);
			alert("Deletion failed: " + err.message);
		}
	};
	const handleImageSelect = (e) => {
		if (!e.target.files || e.target.files.length === 0) return;
		const file = e.target.files[0];
		setEditForm((prev) => ({
			...prev,
			imageFile: file,
			imagePreview: URL.createObjectURL(file)
		}));
	};
	if (loading) return /* @__PURE__ */ jsx("div", {
		style: {
			height: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#0A0A0A",
			color: "#FFF"
		},
		children: "Syncing Asset Data..."
	});
	if (error) return /* @__PURE__ */ jsxs("div", {
		style: {
			height: "100vh",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#0A0A0A",
			color: "#FFF"
		},
		children: [/* @__PURE__ */ jsx("h2", { children: error }), /* @__PURE__ */ jsx("button", {
			onClick: () => navigate(-1),
			style: {
				marginLeft: "16px",
				padding: "8px",
				cursor: "pointer"
			},
			children: "Go Back"
		})]
	});
	if (!product || !brand) return null;
	const primaryColor = brand.primary_color || "#0A0A0A";
	const secondaryColor = brand.secondary_color || "#1A1A1A";
	const accentColor = brand.accent_color || "#06acf8";
	const textColor = "#FDFDFD";
	const mutedColor = "#999";
	const borderColor = secondaryColor;
	const fontConfig = {
		heading: "\"Playfair Display\", serif",
		body: "\"Inter\", sans-serif"
	};
	const s = {
		page: {
			backgroundColor: primaryColor,
			color: textColor,
			minHeight: "100vh",
			fontFamily: fontConfig.body,
			overflowX: "hidden"
		},
		header: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "24px 48px",
			borderBottom: `1px solid ${borderColor}`,
			backgroundColor: "transparent",
			position: "sticky",
			top: 0,
			zIndex: 100,
			backdropFilter: "blur(12px)"
		},
		logo: {
			fontFamily: fontConfig.heading,
			fontSize: "20px",
			fontWeight: "bold",
			letterSpacing: "0.05em",
			color: accentColor,
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			gap: "12px",
			textTransform: "uppercase"
		},
		logoImage: {
			height: "32px",
			width: "32px",
			borderRadius: "50%",
			objectFit: "cover"
		},
		headerRight: {
			display: "flex",
			alignItems: "center",
			gap: "24px"
		},
		iconButton: {
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			color: textColor,
			transition: "color 0.2s",
			"&:hover": { color: accentColor }
		},
		contentWrap: {
			padding: "48px 80px",
			maxWidth: "1440px",
			margin: "0 auto",
			display: "flex",
			flexDirection: "column",
			gap: "80px"
		},
		heroLayout: {
			display: "grid",
			gridTemplateColumns: "1.2fr 1fr",
			gap: "64px"
		},
		imageGallery: {
			display: "flex",
			flexDirection: "column",
			gap: "16px"
		},
		mainImageWrap: {
			width: "100%",
			height: "600px",
			backgroundColor: secondaryColor,
			overflow: "hidden",
			borderRadius: "8px",
			border: `1px solid ${borderColor}`,
			position: "relative"
		},
		mainImage: {
			width: "100%",
			height: "100%",
			objectFit: "cover"
		},
		editBtn: {
			padding: "12px",
			backgroundColor: "rgba(0,0,0,0.6)",
			color: "#FFF",
			borderRadius: "4px",
			zIndex: 20,
			border: "1px solid #333",
			cursor: "pointer",
			transition: "all 0.2s",
			"&:hover": {
				backgroundColor: accentColor,
				color: "#000"
			}
		},
		deleteBtn: {
			padding: "12px",
			backgroundColor: "rgba(0,0,0,0.6)",
			color: "#FFF",
			borderRadius: "4px",
			zIndex: 20,
			border: "1px solid #333",
			cursor: "pointer",
			transition: "background 0.2s",
			"&:hover": { backgroundColor: "#D44040" }
		},
		productDetails: {
			display: "flex",
			flexDirection: "column",
			paddingTop: "24px"
		},
		tag: {
			fontSize: "10px",
			fontWeight: "800",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			color: accentColor,
			marginBottom: "12px"
		},
		title: {
			fontFamily: fontConfig.heading,
			fontSize: isMobile ? "28px" : "40px",
			fontWeight: "700",
			color: textColor,
			lineHeight: "1.2",
			marginBottom: "16px"
		},
		price: {
			fontSize: isMobile ? "20px" : "24px",
			fontWeight: "700",
			color: textColor,
			marginBottom: "24px"
		},
		description: {
			fontSize: "14px",
			color: mutedColor,
			lineHeight: "1.6",
			marginBottom: "32px",
			whiteSpace: "pre-wrap"
		},
		sectionLabel: {
			fontSize: "10px",
			fontWeight: "700",
			letterSpacing: "0.1em",
			textTransform: "uppercase",
			color: textColor,
			marginBottom: "16px"
		},
		qtyRow: {
			display: "flex",
			gap: "16px",
			marginBottom: "16px"
		},
		qtyControl: {
			display: "flex",
			alignItems: "center",
			backgroundColor: secondaryColor,
			borderRadius: "4px",
			border: `1px solid ${borderColor}`
		},
		qtyBtn: {
			width: "40px",
			height: "48px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			cursor: "pointer",
			border: "none",
			background: "transparent",
			color: textColor
		},
		qtyValue: {
			fontSize: "14px",
			fontWeight: "600",
			width: "32px",
			textAlign: "center",
			color: textColor
		},
		addBtn: {
			flex: 1,
			backgroundColor: "transparent",
			color: textColor,
			border: `1px solid ${borderColor}`,
			borderRadius: "4px",
			fontSize: "12px",
			fontWeight: "700",
			letterSpacing: "0.05em",
			textTransform: "uppercase",
			cursor: "pointer",
			transition: "background-color 0.2s",
			"&:hover": { backgroundColor: secondaryColor }
		},
		buyBtn: {
			width: "100%",
			backgroundColor: accentColor,
			color: "#000",
			border: "none",
			borderRadius: "4px",
			padding: "16px",
			fontSize: "12px",
			fontWeight: "700",
			letterSpacing: "0.05em",
			textTransform: "uppercase",
			cursor: "pointer",
			marginBottom: "32px",
			transition: "opacity 0.2s",
			"&:hover": { opacity: .9 }
		},
		trustRow: {
			display: "flex",
			gap: "24px",
			paddingTop: "24px",
			borderTop: `1px solid ${borderColor}`
		},
		trustItem: {
			display: "flex",
			alignItems: "center",
			gap: "8px",
			fontSize: "11px",
			color: mutedColor,
			textTransform: "uppercase",
			letterSpacing: "0.05em",
			fontWeight: "bold"
		},
		sectionTitleText: {
			fontFamily: fontConfig.heading,
			fontSize: "28px",
			fontWeight: "700",
			color: textColor,
			marginBottom: "32px"
		},
		recGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(4, 1fr)",
			gap: "24px"
		},
		recCard: {
			display: "flex",
			flexDirection: "column",
			cursor: "pointer",
			backgroundColor: secondaryColor,
			borderRadius: "8px",
			overflow: "hidden",
			paddingBottom: "16px"
		},
		recImgWrap: {
			width: "100%",
			aspectRatio: "1",
			backgroundColor: "#111",
			overflow: "hidden",
			marginBottom: "16px"
		},
		recImg: {
			width: "100%",
			height: "100%",
			objectFit: "cover"
		},
		recTitle: {
			fontSize: "13px",
			fontWeight: "600",
			color: textColor,
			marginBottom: "4px",
			padding: "0 16px"
		},
		recPrice: {
			fontSize: "12px",
			color: accentColor,
			fontWeight: "bold",
			padding: "0 16px"
		}
	};
	const imageUrls = product?.image_url ? product.image_url.split(",") : [];
	if (!product || !brand) return null;
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: s.page,
		className: "detail-page",
		children: [
			/* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 768px) {
          .detail-header { padding: 16px 24px !important; }
          .detail-content { padding: 32px 24px !important; gap: 48px !important; }
          .detail-hero { grid-template-columns: 1fr !important; gap: 32px !important; }
          .detail-main-img { height: 400px !important; }
          .detail-rec-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
        }
      ` }),
			/* @__PURE__ */ jsxs("div", {
				style: s.header,
				className: "detail-header",
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: "24px"
					},
					children: [/* @__PURE__ */ jsx("div", {
						style: {
							...s.iconButton,
							fontSize: "12px",
							fontWeight: "bold",
							textTransform: "uppercase",
							letterSpacing: "0.1em"
						},
						onClick: () => navigate(-1),
						children: /* @__PURE__ */ jsx(ArrowLeft, {
							size: 16,
							style: { marginRight: "8px" }
						})
					}), /* @__PURE__ */ jsxs("div", {
						style: s.logo,
						onClick: () => navigate(`/shop-brand/${brand.id}`),
						children: [brand.logo_url && /* @__PURE__ */ jsx("img", {
							src: brand.logo_url,
							style: s.logoImage,
							alt: "Brand Logo"
						}), brand.brand_name || "Digital Atelier"]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					style: s.headerRight,
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							...s.iconButton,
							position: "relative",
							display: "flex"
						},
						onClick: () => navigate("/cart"),
						title: "Cart",
						children: [/* @__PURE__ */ jsx(ShoppingCart, { size: isMobile ? 22 : 20 }), cartCount > 0 && /* @__PURE__ */ jsx("span", {
							style: {
								position: "absolute",
								top: "-8px",
								right: "-8px",
								backgroundColor: accentColor,
								color: "#000",
								fontSize: "10px",
								fontWeight: "bold",
								width: "18px",
								height: "18px",
								borderRadius: "50%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								border: `2px solid ${primaryColor}`
							},
							children: cartCount
						})]
					}), !isCustomer && /* @__PURE__ */ jsx("div", {
						style: s.iconButton,
						onClick: () => navigate("/profile"),
						title: "Account",
						children: /* @__PURE__ */ jsx(User, { size: 20 })
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: s.contentWrap,
				className: "detail-content",
				children: [/* @__PURE__ */ jsxs("div", {
					style: s.heroLayout,
					className: "detail-hero",
					children: [/* @__PURE__ */ jsx(motion.div, {
						initial: {
							opacity: 0,
							x: -20
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: {
							duration: .8,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						style: s.imageGallery,
						className: "detail-gallery",
						children: /* @__PURE__ */ jsxs("div", {
							style: {
								display: "flex",
								flexDirection: isMobile ? "column-reverse" : "row",
								gap: "24px",
								width: "100%"
							},
							children: [imageUrls.length > 1 && /* @__PURE__ */ jsx("div", {
								style: {
									display: "flex",
									flexDirection: isMobile ? "row" : "column",
									gap: "12px",
									overflowX: isMobile ? "auto" : "visible",
									paddingBottom: isMobile ? "8px" : "0"
								},
								children: imageUrls.map((url, index) => /* @__PURE__ */ jsx(motion.div, {
									whileHover: { scale: 1.05 },
									whileTap: { scale: .95 },
									onClick: () => setActiveImg(index),
									style: {
										width: isMobile ? "60px" : "80px",
										height: isMobile ? "60px" : "80px",
										border: `1px solid ${activeImg === index ? accentColor : borderColor}`,
										cursor: "pointer",
										borderRadius: "4px",
										overflow: "hidden",
										opacity: activeImg === index ? 1 : .6,
										flexShrink: 0
									},
									children: /* @__PURE__ */ jsx("img", {
										src: url,
										style: {
											width: "100%",
											height: "100%",
											objectFit: "cover"
										},
										alt: `Thumb ${index}`
									})
								}, index))
							}), /* @__PURE__ */ jsxs("div", {
								style: {
									...s.mainImageWrap,
									flex: 1
								},
								className: "detail-main-img",
								children: [/* @__PURE__ */ jsx(AnimatePresence, {
									mode: "wait",
									children: /* @__PURE__ */ jsx(motion.img, {
										initial: { opacity: 0 },
										animate: { opacity: 1 },
										exit: { opacity: 0 },
										transition: { duration: .4 },
										src: imageUrls[activeImg] || imageUrls[0],
										alt: product.title,
										style: s.mainImage
									}, activeImg)
								}), isOwner && /* @__PURE__ */ jsxs("div", {
									style: {
										position: "absolute",
										top: "16px",
										right: "16px",
										display: "flex",
										gap: "8px",
										zIndex: 20
									},
									children: [/* @__PURE__ */ jsx(motion.div, {
										whileHover: { scale: 1.1 },
										whileTap: { scale: .9 },
										style: s.editBtn,
										onClick: handleEditClick,
										title: "Edit Asset Configuration",
										children: /* @__PURE__ */ jsx(Edit2, { size: 20 })
									}), /* @__PURE__ */ jsx(motion.div, {
										whileHover: { scale: 1.1 },
										whileTap: { scale: .9 },
										style: s.deleteBtn,
										onClick: handleDeleteProduct,
										title: "Delete Asset",
										children: /* @__PURE__ */ jsx(Trash2, { size: 20 })
									})]
								})]
							})]
						})
					}), /* @__PURE__ */ jsxs(motion.div, {
						initial: {
							opacity: 0,
							x: 20
						},
						animate: {
							opacity: 1,
							x: 0
						},
						transition: {
							duration: .8,
							delay: .2,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						style: s.productDetails,
						children: [
							product.tag && /* @__PURE__ */ jsx("div", {
								style: s.tag,
								children: product.tag
							}),
							/* @__PURE__ */ jsx("h1", {
								style: s.title,
								children: product.title
							}),
							/* @__PURE__ */ jsxs("div", {
								style: s.price,
								children: ["₦", parseFloat(product.price).toLocaleString()]
							}),
							/* @__PURE__ */ jsx("p", {
								style: s.description,
								children: product.description || "The designer of this asset chose to let the geometry speak for itself. No accompanying narrative was provided."
							}),
							product.sizes && /* @__PURE__ */ jsxs("div", {
								style: { marginBottom: "32px" },
								children: [/* @__PURE__ */ jsx("div", {
									style: s.sectionLabel,
									children: "Select Size"
								}), /* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										gap: "12px",
										flexWrap: "wrap"
									},
									children: product.sizes.split(",").map((s) => s.trim()).filter(Boolean).map((size) => /* @__PURE__ */ jsx(motion.div, {
										whileHover: { scale: 1.05 },
										whileTap: { scale: .95 },
										onClick: () => setSelectedSize(size),
										style: {
											padding: "12px 24px",
											border: `1px solid ${selectedSize === size ? accentColor : borderColor}`,
											backgroundColor: selectedSize === size ? `${accentColor}1A` : "transparent",
											color: selectedSize === size ? accentColor : textColor,
											fontSize: "13px",
											fontWeight: "600",
											cursor: "pointer",
											borderRadius: "4px",
											transition: "all 0.2s"
										},
										children: size
									}, size))
								})]
							}),
							product.colors && /* @__PURE__ */ jsxs("div", {
								style: { marginBottom: "32px" },
								children: [/* @__PURE__ */ jsx("div", {
									style: s.sectionLabel,
									children: "Select Colour"
								}), /* @__PURE__ */ jsx("div", {
									style: {
										display: "flex",
										gap: "12px",
										flexWrap: "wrap"
									},
									children: product.colors.split(",").map((c) => c.trim()).filter(Boolean).map((color) => /* @__PURE__ */ jsx(motion.div, {
										whileHover: { scale: 1.05 },
										whileTap: { scale: .95 },
										onClick: () => setSelectedColor(color),
										style: {
											padding: "12px 24px",
											border: `1px solid ${selectedColor === color ? accentColor : borderColor}`,
											backgroundColor: selectedColor === color ? `${accentColor}1A` : "transparent",
											color: selectedColor === color ? accentColor : textColor,
											fontSize: "13px",
											fontWeight: "600",
											cursor: "pointer",
											borderRadius: "4px",
											transition: "all 0.2s"
										},
										children: color
									}, color))
								})]
							}),
							!isOwner && /* @__PURE__ */ jsxs(Fragment, { children: [
								/* @__PURE__ */ jsx("div", {
									style: s.sectionLabel,
									children: "Quantity Required"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: s.qtyRow,
									children: [/* @__PURE__ */ jsxs("div", {
										style: s.qtyControl,
										children: [
											/* @__PURE__ */ jsx("button", {
												style: s.qtyBtn,
												onClick: () => setQty(Math.max(1, qty - 1)),
												children: /* @__PURE__ */ jsx(Minus, { size: 14 })
											}),
											/* @__PURE__ */ jsx("div", {
												style: s.qtyValue,
												children: qty
											}),
											/* @__PURE__ */ jsx("button", {
												style: s.qtyBtn,
												onClick: () => setQty(qty + 1),
												children: /* @__PURE__ */ jsx(Plus, { size: 14 })
											})
										]
									}), /* @__PURE__ */ jsx(motion.button, {
										whileHover: { scale: 1.02 },
										whileTap: { scale: .98 },
										style: s.addBtn,
										onClick: handleAddToCart,
										children: "Bag Asset"
									})]
								}),
								/* @__PURE__ */ jsx(motion.button, {
									whileHover: { scale: 1.02 },
									whileTap: { scale: .98 },
									style: s.buyBtn,
									onClick: handleBuyNow,
									children: "Acquire Immediately"
								}),
								/* @__PURE__ */ jsxs("div", {
									style: s.trustRow,
									children: [/* @__PURE__ */ jsxs("div", {
										style: s.trustItem,
										children: [/* @__PURE__ */ jsx(Truck, { size: 14 }), " Global Priority Transit"]
									}), /* @__PURE__ */ jsxs("div", {
										style: s.trustItem,
										children: [/* @__PURE__ */ jsx(ShieldCheck, { size: 14 }), " Immutable Verifications"]
									})]
								})
							] })
						]
					})]
				}), relatedProducts.length > 0 && /* @__PURE__ */ jsxs("div", {
					style: {
						borderTop: `1px solid ${borderColor}`,
						paddingTop: "80px",
						marginTop: "40px"
					},
					children: [/* @__PURE__ */ jsx("h2", {
						style: s.sectionTitleText,
						children: "Explore More The Collection..."
					}), /* @__PURE__ */ jsx("div", {
						style: s.recGrid,
						className: "detail-rec-grid",
						children: relatedProducts.map((rel) => /* @__PURE__ */ jsxs("div", {
							style: s.recCard,
							onClick: () => navigate(`/product?id=${rel.id}`),
							children: [
								/* @__PURE__ */ jsx("div", {
									style: s.recImgWrap,
									children: rel.image_url ? /* @__PURE__ */ jsx("img", {
										src: rel.image_url.split(",")[0],
										alt: rel.title,
										style: s.recImg
									}) : /* @__PURE__ */ jsx("div", { style: {
										width: "100%",
										height: "100%",
										backgroundColor: "#111"
									} })
								}),
								/* @__PURE__ */ jsx("div", {
									style: s.recTitle,
									children: rel.title
								}),
								/* @__PURE__ */ jsxs("div", {
									style: s.recPrice,
									children: ["₦", parseFloat(rel.price).toLocaleString()]
								})
							]
						}, rel.id))
					})]
				})]
			}),
			isOwner && isEditModalOpen && /* @__PURE__ */ jsx("div", {
				style: {
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0,0,0,0.85)",
					zIndex: 9999,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: isMobile ? "16px" : "24px",
					backdropFilter: "blur(8px)"
				},
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						backgroundColor: secondaryColor,
						width: "100%",
						maxWidth: isMobile ? "100%" : "850px",
						borderRadius: "8px",
						border: `1px solid ${borderColor}`,
						overflow: "hidden",
						display: "flex",
						flexDirection: "column",
						maxHeight: "95vh"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							padding: "24px",
							borderBottom: `1px solid ${borderColor}`
						},
						children: [/* @__PURE__ */ jsx("h3", {
							style: {
								fontFamily: fontConfig.heading,
								fontSize: "20px",
								margin: 0,
								color: textColor
							},
							children: "Edit Asset Configuration"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setIsEditModalOpen(false),
							style: {
								background: "none",
								border: "none",
								color: mutedColor,
								cursor: "pointer"
							},
							children: /* @__PURE__ */ jsx(X, { size: 24 })
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleEditSubmit,
						style: {
							padding: "24px",
							overflowY: "auto"
						},
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "24px",
									flexDirection: isMobile ? "column" : "row",
									marginBottom: "24px"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										flexDirection: "column",
										gap: "12px"
									},
									children: [/* @__PURE__ */ jsxs("div", {
										onClick: () => fileInputRef.current?.click(),
										style: {
											width: isMobile ? "100%" : "200px",
											height: "200px",
											backgroundColor: "#111",
											border: `1px dashed ${borderColor}`,
											borderRadius: "4px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											position: "relative",
											cursor: "pointer",
											flexShrink: 0
										},
										children: [/* @__PURE__ */ jsx("input", {
											type: "file",
											ref: fileInputRef,
											style: { display: "none" },
											accept: "image/*",
											onChange: handleImageSelect
										}), editForm.imagePreview ? /* @__PURE__ */ jsx("img", {
											src: editForm.imagePreview.split(",")[0],
											style: {
												width: "100%",
												height: "100%",
												objectFit: "cover",
												borderRadius: "4px"
											},
											alt: "Preview"
										}) : /* @__PURE__ */ jsxs("div", {
											style: {
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												gap: "12px",
												color: mutedColor
											},
											children: [/* @__PURE__ */ jsx(Image, { size: 32 }), /* @__PURE__ */ jsx("span", {
												style: {
													fontSize: "10px",
													fontWeight: "bold",
													letterSpacing: "0.05em"
												},
												children: "MAIN IMAGE"
											})]
										})]
									}), /* @__PURE__ */ jsx("div", {
										style: {
											display: "grid",
											gridTemplateColumns: "repeat(3, 1fr)",
											gap: "8px"
										},
										children: [
											0,
											1,
											2
										].map((i) => /* @__PURE__ */ jsx("div", {
											onClick: () => {
												const input = document.createElement("input");
												input.type = "file";
												input.accept = "image/*";
												input.onchange = (e) => {
													const file = e.target.files[0];
													if (file) {
														const reader = new FileReader();
														reader.onload = (loadEv) => {
															const newExtras = [...editForm.additionalImages];
															newExtras[i] = {
																file,
																preview: loadEv.target.result
															};
															setEditForm({
																...editForm,
																additionalImages: newExtras
															});
														};
														reader.readAsDataURL(file);
													}
												};
												input.click();
											},
											style: {
												aspectRatio: "1",
												backgroundColor: "#0A0A0A",
												border: `1px dashed ${borderColor}`,
												borderRadius: "2px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												cursor: "pointer",
												overflow: "hidden"
											},
											children: editForm.additionalImages[i]?.preview ? /* @__PURE__ */ jsx("img", {
												src: editForm.additionalImages[i].preview,
												style: {
													width: "100%",
													height: "100%",
													objectFit: "cover"
												}
											}) : /* @__PURE__ */ jsx(Plus, {
												size: 16,
												color: mutedColor
											})
										}, i))
									})]
								}), /* @__PURE__ */ jsxs("div", {
									style: {
										flex: 1,
										display: "flex",
										flexDirection: "column",
										gap: "16px"
									},
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											style: {
												display: "block",
												fontSize: "10px",
												color: mutedColor,
												marginBottom: "8px",
												fontWeight: "bold",
												letterSpacing: "0.1em"
											},
											children: "ASSET TITLE *"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											required: true,
											value: editForm.title,
											onChange: (e) => setEditForm({
												...editForm,
												title: e.target.value
											}),
											style: {
												width: "100%",
												padding: "12px",
												backgroundColor: "#111",
												border: `1px solid ${borderColor}`,
												borderRadius: "4px",
												color: "#FFF",
												fontSize: "14px",
												outline: "none"
											}
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											style: {
												display: "block",
												fontSize: "10px",
												color: mutedColor,
												marginBottom: "8px",
												fontWeight: "bold",
												letterSpacing: "0.1em"
											},
											children: "PRICE (NGN) *"
										}), /* @__PURE__ */ jsx("input", {
											type: "number",
											required: true,
											value: editForm.price,
											onChange: (e) => setEditForm({
												...editForm,
												price: e.target.value
											}),
											style: {
												width: "100%",
												padding: "12px",
												backgroundColor: "#111",
												border: `1px solid ${borderColor}`,
												borderRadius: "4px",
												color: "#FFF",
												fontSize: "14px",
												outline: "none"
											}
										})] }),
										/* @__PURE__ */ jsxs("div", {
											style: {
												display: "grid",
												gridTemplateColumns: "1fr 1fr",
												gap: "16px"
											},
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
												style: {
													display: "block",
													fontSize: "10px",
													color: mutedColor,
													marginBottom: "8px",
													fontWeight: "bold",
													letterSpacing: "0.1em"
												},
												children: "HIGHLIGHT TAG"
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												value: editForm.tag,
												onChange: (e) => setEditForm({
													...editForm,
													tag: e.target.value
												}),
												style: {
													width: "100%",
													padding: "12px",
													backgroundColor: "#111",
													border: `1px solid ${borderColor}`,
													borderRadius: "4px",
													color: "#FFF",
													fontSize: "14px",
													outline: "none"
												}
											})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
												style: {
													display: "block",
													fontSize: "10px",
													color: mutedColor,
													marginBottom: "8px",
													fontWeight: "bold",
													letterSpacing: "0.1em"
												},
												children: "SIZES"
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												value: editForm.sizes,
												onChange: (e) => setEditForm({
													...editForm,
													sizes: e.target.value
												}),
												style: {
													width: "100%",
													padding: "12px",
													backgroundColor: "#111",
													border: `1px solid ${borderColor}`,
													borderRadius: "4px",
													color: "#FFF",
													fontSize: "14px",
													outline: "none"
												},
												placeholder: "S, M, L"
											})] })]
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											style: {
												display: "block",
												fontSize: "10px",
												color: mutedColor,
												marginBottom: "8px",
												fontWeight: "bold",
												letterSpacing: "0.1em"
											},
											children: "COLOURS"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: editForm.colors,
											onChange: (e) => setEditForm({
												...editForm,
												colors: e.target.value
											}),
											style: {
												width: "100%",
												padding: "12px",
												backgroundColor: "#111",
												border: `1px solid ${borderColor}`,
												borderRadius: "4px",
												color: "#FFF",
												fontSize: "14px",
												outline: "none"
											},
											placeholder: "Red, Black, Blue"
										})] })
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								style: {
									display: "block",
									fontSize: "10px",
									color: mutedColor,
									marginBottom: "8px",
									fontWeight: "bold",
									letterSpacing: "0.1em"
								},
								children: "DESCRIPTION"
							}), /* @__PURE__ */ jsx("textarea", {
								value: editForm.description,
								onChange: (e) => setEditForm({
									...editForm,
									description: e.target.value
								}),
								style: {
									width: "100%",
									padding: "12px",
									backgroundColor: "#111",
									border: `1px solid ${borderColor}`,
									borderRadius: "4px",
									color: "#FFF",
									fontSize: "14px",
									minHeight: "100px",
									resize: "vertical",
									outline: "none"
								}
							})] }),
							/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									gap: "16px",
									marginTop: "32px"
								},
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setIsEditModalOpen(false),
									style: {
										flex: 1,
										padding: "16px",
										border: `1px solid ${borderColor}`,
										backgroundColor: "transparent",
										color: textColor,
										fontWeight: "bold",
										borderRadius: "4px",
										cursor: "pointer"
									},
									children: "CANCEL"
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: uploading,
									style: {
										flex: 1,
										padding: "16px",
										border: "none",
										backgroundColor: accentColor,
										color: "#000",
										fontWeight: "bold",
										borderRadius: "4px",
										cursor: uploading ? "not-allowed" : "pointer",
										opacity: uploading ? .7 : 1
									},
									children: uploading ? "UPDATING..." : "UPDATE ASSET"
								})]
							})
						]
					})]
				})
			})
		]
	}) });
}
//#endregion
export { ProductDetail as default };
