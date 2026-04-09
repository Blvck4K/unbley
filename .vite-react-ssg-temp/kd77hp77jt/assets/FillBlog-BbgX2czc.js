import { n as supabase } from "./supabase-CTgwDjry.js";
import { t as useAuth } from "./useAuth-Ci0LZBhu.js";
import { t as PageTransition } from "./PageTransition-CqG4EOCz.js";
import { n as Navbar, t as Footer } from "./Footer-BwtjuRQ-.js";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlignCenter, AlignLeft, AlignRight, Bold, ChevronDown, Image, Italic, Link as Link$1, List, ListOrdered, Loader2, Redo, Search, Strikethrough, Table, Type, Undo, X } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image as Image$1 } from "@tiptap/extension-image";
import { Table as Table$1 } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Link as Link$2 } from "@tiptap/extension-link";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
//#region src/pages/FillBlog.jsx
var ToolbarButton = ({ onClick, children, title, active }) => /* @__PURE__ */ jsx("button", {
	onClick: (e) => {
		e.preventDefault();
		onClick();
	},
	title,
	style: {
		padding: "8px",
		borderRadius: "6px",
		border: "none",
		backgroundColor: active ? "#E5E7EB" : "transparent",
		color: active ? "#111" : "#4B5563",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		transition: "all 0.2s",
		fontSize: "12px",
		fontWeight: "bold",
		gap: "4px"
	},
	className: "editor-toolbar-btn",
	children
});
var ToolbarSelect = ({ value, onChange, options, title }) => /* @__PURE__ */ jsx("select", {
	value,
	onChange: (e) => onChange(e.target.value),
	title,
	style: {
		padding: "6px 10px",
		borderRadius: "6px",
		border: "1px solid #E5E7EB",
		backgroundColor: "#FFF",
		fontSize: "12px",
		color: "#4B5563",
		cursor: "pointer",
		outline: "none"
	},
	children: options.map((opt) => /* @__PURE__ */ jsx("option", {
		value: opt.value,
		children: opt.label
	}, opt.value))
});
var Divider = () => /* @__PURE__ */ jsx("div", { style: {
	width: "1px",
	height: "20px",
	backgroundColor: "#E5E7EB",
	margin: "0 4px"
} });
function FillBlog() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const editId = searchParams.get("id");
	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [content, setContent] = useState("");
	const [excerpt, setExcerpt] = useState("");
	const [metaDescription, setMetaDescription] = useState("");
	const [metaTitle, setMetaTitle] = useState("");
	const [category, setCategory] = useState("Editorial");
	const [tags, setTags] = useState(["History", "Curation"]);
	const [coverImageUrl, setCoverImageUrl] = useState("");
	const [authorName, setAuthorName] = useState("Julian Vane");
	const [publishedAt, setPublishedAt] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [isSearchOptOpen, setIsSearchOptOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [newTag, setNewTag] = useState("");
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({ placeholder: "Begin your narrative here..." }),
			Underline,
			Link$2.configure({ openOnClick: false }),
			Image$1.configure({ allowBase64: true }),
			Table$1.configure({ resizable: true }),
			TableRow,
			TableHeader,
			TableCell,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			TextStyle,
			Color,
			FontFamily
		],
		content: "",
		onUpdate: ({ editor }) => {
			setContent(editor.getHTML());
		}
	});
	useEffect(() => {
		if (editor && dataLoaded && content) editor.commands.setContent(content);
	}, [editor, dataLoaded]);
	useEffect(() => {
		if (title && !editId) setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
	}, [title, editId]);
	useEffect(() => {
		if (content && !metaDescription && !editId) {
			const plainText = content.replace(/<[^>]*>/g, "").trim();
			const autoDesc = plainText.substring(0, 152) + (plainText.length > 152 ? "..." : "");
			if (autoDesc.length > 10) setMetaDescription(autoDesc);
		}
		if (title && !metaTitle && !editId) setMetaTitle(title);
	}, [
		content,
		title,
		metaDescription,
		metaTitle,
		editId
	]);
	useEffect(() => {
		if (editId) {
			const fetchPost = async () => {
				const { data, error } = await supabase.from("blog_posts").select("*").eq("id", editId).single();
				if (data && !error) {
					setTitle(data.title);
					setSlug(data.slug || "");
					setContent(data.content || "");
					setExcerpt(data.excerpt || "");
					setMetaDescription(data.meta_description || "");
					setMetaTitle(data.meta_title || "");
					setCategory(data.category || "Editorial");
					setTags(data.tags || []);
					setCoverImageUrl(data.cover_image_url || "");
					setAuthorName(data.author_name || "Julian Vane");
					if (data.created_at) setPublishedAt(new Date(data.created_at).toISOString().split("T")[0]);
					setDataLoaded(true);
				}
			};
			fetchPost();
		}
	}, [editId]);
	const handleSave = async (isPublishing = false) => {
		if (!title) return alert("Title is required");
		setIsSaving(true);
		try {
			const postData = {
				title,
				slug,
				content,
				excerpt,
				category,
				author_id: user?.id,
				author_name: authorName,
				cover_image_url: coverImageUrl,
				status: isPublishing ? "published" : "draft",
				tags,
				meta_title: metaTitle || title,
				meta_description: metaDescription || excerpt || "",
				read_time: `${Math.ceil(content.split(" ").length / 200)} MIN READ`,
				created_at: new Date(publishedAt).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (editId) await supabase.from("blog_posts").update(postData).eq("id", editId);
			else await supabase.from("blog_posts").insert([postData]);
			alert(isPublishing ? "Post Published!" : "Draft Saved!");
			navigate("/admin-blog");
		} catch (err) {
			alert("Error: " + err.message);
		} finally {
			setIsSaving(false);
		}
	};
	const applyFormatting = (type, val) => {
		if (!editor) return;
		switch (type) {
			case "bold":
				editor.chain().focus().toggleBold().run();
				break;
			case "italic":
				editor.chain().focus().toggleItalic().run();
				break;
			case "underline":
				editor.chain().focus().toggleUnderline().run();
				break;
			case "strike":
				editor.chain().focus().toggleStrike().run();
				break;
			case "heading1":
				editor.chain().focus().toggleHeading({ level: 1 }).run();
				break;
			case "heading2":
				editor.chain().focus().toggleHeading({ level: 2 }).run();
				break;
			case "bulletList":
				editor.chain().focus().toggleBulletList().run();
				break;
			case "orderedList":
				editor.chain().focus().toggleOrderedList().run();
				break;
			case "alignLeft":
				editor.chain().focus().setTextAlign("left").run();
				break;
			case "alignCenter":
				editor.chain().focus().setTextAlign("center").run();
				break;
			case "alignRight":
				editor.chain().focus().setTextAlign("right").run();
				break;
			case "undo":
				editor.chain().focus().undo().run();
				break;
			case "redo":
				editor.chain().focus().redo().run();
				break;
			case "color":
				editor.chain().focus().setColor(val).run();
				break;
			case "fontFamily":
				editor.chain().focus().setFontFamily(val).run();
				break;
			case "table":
				editor.chain().focus().insertTable({
					rows: 3,
					cols: 3,
					withHeaderRow: true
				}).run();
				break;
			case "image":
				const url = prompt("Enter Image URL:");
				if (url) editor.chain().focus().setImage({ src: url }).run();
				break;
			case "link":
				const link = prompt("Enter Link URL:");
				if (link) editor.chain().focus().setLink({ href: link }).run();
				break;
			default: break;
		}
	};
	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const fileExt = file.name.split(".").pop();
			const filePath = `blog-covers/${`${Math.random()}.${fileExt}`}`;
			await supabase.storage.from("blog_images").upload(filePath, file);
			const { data: { publicUrl } } = supabase.storage.from("blog_images").getPublicUrl(filePath);
			setCoverImageUrl(publicUrl);
		} catch (err) {
			alert("Error uploading image: " + err.message);
		} finally {
			setUploading(false);
		}
	};
	return /* @__PURE__ */ jsx(PageTransition, { children: /* @__PURE__ */ jsxs("div", {
		style: {
			backgroundColor: "#FAFAFA",
			minHeight: "100vh",
			fontFamily: "'Inter', sans-serif",
			color: "#1a1a1a"
		},
		children: [
			/* @__PURE__ */ jsx(Navbar, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "editor-main-layout",
				style: {
					maxWidth: "1200px",
					margin: "0 auto",
					padding: "120px 20px",
					display: "grid",
					gridTemplateColumns: "1fr 340px",
					gap: "64px"
				},
				children: [/* @__PURE__ */ jsxs("div", {
					className: "content-area",
					children: [
						/* @__PURE__ */ jsx("h1", {
							style: {
								fontFamily: "'Playfair Display', serif",
								fontSize: "48px",
								marginBottom: "40px"
							},
							children: editId ? "Edit Post" : "Create New Post"
						}),
						/* @__PURE__ */ jsxs("div", {
							style: { marginBottom: "48px" },
							children: [/* @__PURE__ */ jsx("label", {
								style: {
									fontSize: "10px",
									fontWeight: 700,
									letterSpacing: "0.1em",
									color: "#888",
									display: "block",
									marginBottom: "8px"
								},
								children: "POST TITLE"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "Enter a descriptive headline...",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								style: {
									width: "100%",
									border: "none",
									background: "transparent",
									fontSize: "clamp(32px, 5vw, 48px)",
									fontFamily: "'Playfair Display', serif",
									outline: "none"
								},
								className: "editor-title-input"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								borderTop: "1px solid #E5E7EB",
								paddingTop: "32px"
							},
							children: [/* @__PURE__ */ jsxs("div", {
								style: {
									display: "flex",
									flexWrap: "wrap",
									gap: "8px",
									marginBottom: "24px",
									backgroundColor: "#F9FAFB",
									padding: "12px",
									borderRadius: "12px",
									border: "1px solid #F1F1F1",
									alignItems: "center"
								},
								children: [
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("undo"),
										title: "Undo",
										children: /* @__PURE__ */ jsx(Undo, { size: 16 })
									}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("redo"),
										title: "Redo",
										children: /* @__PURE__ */ jsx(Redo, { size: 16 })
									}),
									/* @__PURE__ */ jsx(Divider, {}),
									/* @__PURE__ */ jsx(ToolbarSelect, {
										title: "Font Family",
										value: editor?.getAttributes("textStyle").fontFamily || "Inter",
										onChange: (val) => applyFormatting("fontFamily", val),
										options: [
											{
												label: "Inter",
												value: "Inter"
											},
											{
												label: "Playfair Display",
												value: "Playfair Display"
											},
											{
												label: "Serif",
												value: "serif"
											},
											{
												label: "Monospace",
												value: "monospace"
											},
											{
												label: "Cursive",
												value: "cursive"
											}
										]
									}),
									/* @__PURE__ */ jsx(ToolbarSelect, {
										title: "Text Color",
										value: editor?.getAttributes("textStyle").color || "#111",
										onChange: (val) => applyFormatting("color", val),
										options: [
											{
												label: "Black",
												value: "#111111"
											},
											{
												label: "Gray",
												value: "#666666"
											},
											{
												label: "Red",
												value: "#E11D48"
											},
											{
												label: "Blue",
												value: "#2563EB"
											},
											{
												label: "Green",
												value: "#16A34A"
											},
											{
												label: "Gold",
												value: "#D97706"
											}
										]
									}),
									/* @__PURE__ */ jsx(Divider, {}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("bold"),
										active: editor?.isActive("bold"),
										title: "Bold",
										children: /* @__PURE__ */ jsx(Bold, { size: 16 })
									}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("italic"),
										active: editor?.isActive("italic"),
										title: "Italic",
										children: /* @__PURE__ */ jsx(Italic, { size: 16 })
									}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("underline"),
										active: editor?.isActive("underline"),
										title: "Underline",
										children: /* @__PURE__ */ jsx(Type, {
											size: 16,
											style: { textDecoration: "underline" }
										})
									}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("strike"),
										active: editor?.isActive("strike"),
										title: "Strikethrough",
										children: /* @__PURE__ */ jsx(Strikethrough, { size: 16 })
									}),
									/* @__PURE__ */ jsx(Divider, {}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("heading1"),
										active: editor?.isActive("heading", { level: 1 }),
										title: "H1",
										children: "H1"
									}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("heading2"),
										active: editor?.isActive("heading", { level: 2 }),
										title: "H2",
										children: "H2"
									}),
									/* @__PURE__ */ jsx(Divider, {}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("bulletList"),
										active: editor?.isActive("bulletList"),
										title: "Bullets",
										children: /* @__PURE__ */ jsx(List, { size: 16 })
									}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("orderedList"),
										active: editor?.isActive("orderedList"),
										title: "Numbers",
										children: /* @__PURE__ */ jsx(ListOrdered, { size: 16 })
									}),
									/* @__PURE__ */ jsx(Divider, {}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("alignLeft"),
										active: editor?.isActive({ textAlign: "left" }),
										title: "Left",
										children: /* @__PURE__ */ jsx(AlignLeft, { size: 16 })
									}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("alignCenter"),
										active: editor?.isActive({ textAlign: "center" }),
										title: "Center",
										children: /* @__PURE__ */ jsx(AlignCenter, { size: 16 })
									}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("alignRight"),
										active: editor?.isActive({ textAlign: "right" }),
										title: "Right",
										children: /* @__PURE__ */ jsx(AlignRight, { size: 16 })
									}),
									/* @__PURE__ */ jsx(Divider, {}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("table"),
										title: "Insert Table",
										children: /* @__PURE__ */ jsx(Table, { size: 16 })
									}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("image"),
										title: "Insert Image",
										children: /* @__PURE__ */ jsx(Image, { size: 16 })
									}),
									/* @__PURE__ */ jsx(ToolbarButton, {
										onClick: () => applyFormatting("link"),
										active: editor?.isActive("link"),
										title: "Insert Link",
										children: /* @__PURE__ */ jsx(Link$1, { size: 16 })
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								style: {
									minHeight: "600px",
									padding: "40px",
									backgroundColor: "#FFF",
									borderRadius: "8px",
									border: "1px solid #F3F4F6",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
								},
								className: "tiptap-editor-container",
								children: /* @__PURE__ */ jsx(EditorContent, { editor })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								marginTop: "40px",
								backgroundColor: "#FFF",
								borderRadius: "12px",
								padding: "32px",
								border: "1px solid #E5E7EB",
								boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
							},
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: () => setIsSearchOptOpen(!isSearchOptOpen),
								style: {
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									width: "100%",
									background: "none",
									border: "none",
									fontWeight: 800,
									fontSize: "14px",
									cursor: "pointer",
									color: "#111"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "12px"
									},
									children: [/* @__PURE__ */ jsx(Search, {
										size: 18,
										color: "var(--primary)"
									}), /* @__PURE__ */ jsx("span", { children: "GOOGLE SEARCH (SEO)" })]
								}), isSearchOptOpen ? /* @__PURE__ */ jsx(ChevronDown, {
									size: 18,
									style: { transform: "rotate(180deg)" }
								}) : /* @__PURE__ */ jsx(ChevronDown, { size: 18 })]
							}), isSearchOptOpen && /* @__PURE__ */ jsxs("div", {
								style: {
									marginTop: "32px",
									borderTop: "1px solid #F3F4F6",
									paddingTop: "24px"
								},
								children: [/* @__PURE__ */ jsxs("div", {
									style: { marginBottom: "24px" },
									children: [/* @__PURE__ */ jsx("label", {
										style: {
											fontSize: "11px",
											fontWeight: 700,
											color: "#888",
											display: "block",
											marginBottom: "8px",
											letterSpacing: "0.05em"
										},
										children: "PREVIEW IN GOOGLE"
									}), /* @__PURE__ */ jsxs("div", {
										style: {
											backgroundColor: "white",
											padding: "16px",
											borderRadius: "8px",
											border: "1px solid #EEE",
											maxWidth: "600px"
										},
										children: [
											/* @__PURE__ */ jsxs("div", {
												style: {
													color: "#1a0dab",
													fontSize: "18px",
													marginBottom: "4px",
													textDecoration: "none",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													fontFamily: "arial, sans-serif"
												},
												children: [metaTitle || title || "Post Title", " | ZizzyStores"]
											}),
											/* @__PURE__ */ jsxs("div", {
												style: {
													color: "#006621",
													fontSize: "14px",
													marginBottom: "4px",
													fontFamily: "arial, sans-serif"
												},
												children: ["https://zizzystores.com/blog/", slug || "post-url"]
											}),
											/* @__PURE__ */ jsx("div", {
												style: {
													color: "#545454",
													fontSize: "13px",
													lineHeight: "1.4",
													fontFamily: "arial, sans-serif"
												},
												children: metaDescription || (excerpt ? excerpt.substring(0, 160) : "Start writing your post content to automatically generate a search description here...")
											})
										]
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-6",
									children: [
										/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx("label", {
												style: {
													fontSize: "11px",
													fontWeight: 700,
													color: "#888",
													display: "block",
													marginBottom: "8px"
												},
												children: "SEO META TITLE (SEARCH ENGINE LISTING)"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												value: metaTitle,
												onChange: (e) => setMetaTitle(e.target.value),
												placeholder: "Leave blank to use post title...",
												style: {
													width: "100%",
													padding: "12px",
													border: "1px solid #E5E7EB",
													borderRadius: "6px",
													fontSize: "14px",
													outline: "none"
												}
											}),
											/* @__PURE__ */ jsx("p", {
												style: {
													fontSize: "10px",
													color: "#888",
													marginTop: "6px"
												},
												children: "Keep under 60 characters for best results."
											})
										] }),
										/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsx("label", {
												style: {
													fontSize: "11px",
													fontWeight: 700,
													color: "#888",
													display: "block",
													marginBottom: "8px"
												},
												children: "META DESCRIPTION (GOOGLE)"
											}),
											/* @__PURE__ */ jsx("textarea", {
												value: metaDescription,
												onChange: (e) => setMetaDescription(e.target.value),
												placeholder: "Brief summary for search engines (invisible to users)...",
												style: {
													width: "100%",
													height: "100px",
													padding: "12px",
													border: "1px solid #E5E7EB",
													borderRadius: "6px",
													fontSize: "14px",
													outline: "none"
												}
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex justify-between items-center mt-2",
												children: [/* @__PURE__ */ jsx("p", {
													style: {
														fontSize: "10px",
														color: "#888"
													},
													children: "Ideal: 150-160 characters."
												}), /* @__PURE__ */ jsx("button", {
													onClick: () => {
														const plainText = content.replace(/<[^>]*>/g, "").trim();
														setMetaDescription(plainText.substring(0, 155) + (plainText.length > 155 ? "..." : ""));
													},
													style: {
														fontSize: "11px",
														background: "none",
														border: "none",
														color: "var(--primary)",
														fontWeight: 600,
														cursor: "pointer",
														padding: 0
													},
													children: "AUTO-GENERATE"
												})]
											})
										] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											style: {
												fontSize: "11px",
												fontWeight: 700,
												color: "#888",
												display: "block",
												marginBottom: "8px"
											},
											children: "CARD EXCERPT (LISTING VIEW)"
										}), /* @__PURE__ */ jsx("textarea", {
											value: excerpt,
											onChange: (e) => setExcerpt(e.target.value),
											placeholder: "Snippet shown on the blog archive cards...",
											style: {
												width: "100%",
												height: "100px",
												padding: "12px",
												border: "1px solid #E5E7EB",
												borderRadius: "6px",
												fontSize: "14px",
												outline: "none"
											}
										})] })
									]
								})]
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("aside", {
					className: "content-area-aside",
					children: [
						/* @__PURE__ */ jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "16px",
								marginBottom: "40px"
							},
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => handleSave(false),
								disabled: isSaving,
								style: {
									padding: "12px",
									fontWeight: 700,
									background: "none",
									border: "none",
									cursor: "pointer"
								},
								children: "SAVE DRAFT"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => handleSave(true),
								disabled: isSaving,
								style: {
									padding: "12px",
									fontWeight: 700,
									backgroundColor: "#111",
									color: "#FFF",
									borderRadius: "4px",
									cursor: "pointer"
								},
								children: "PUBLISH POST"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								backgroundColor: "#F9FAFB",
								padding: "24px",
								borderRadius: "8px",
								border: "1px solid #F3F4F6",
								marginBottom: "32px"
							},
							children: [/* @__PURE__ */ jsx("label", {
								style: {
									fontSize: "10px",
									fontWeight: 700,
									color: "#888",
									display: "block",
									marginBottom: "12px"
								},
								children: "COVER IMAGE"
							}), coverImageUrl ? /* @__PURE__ */ jsxs("div", {
								style: {
									position: "relative",
									marginBottom: "16px"
								},
								children: [/* @__PURE__ */ jsx("img", {
									src: coverImageUrl,
									alt: "Cover",
									style: {
										width: "100%",
										height: "160px",
										objectFit: "cover",
										borderRadius: "4px"
									}
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setCoverImageUrl(""),
									style: {
										position: "absolute",
										top: "8px",
										right: "8px",
										backgroundColor: "rgba(0,0,0,0.5)",
										color: "#FFF",
										border: "none",
										borderRadius: "50%",
										width: "24px",
										height: "24px",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									},
									children: /* @__PURE__ */ jsx(X, { size: 14 })
								})]
							}) : /* @__PURE__ */ jsxs("div", {
								style: {
									border: "2px dashed #E5E7EB",
									borderRadius: "8px",
									padding: "32px",
									textAlign: "center",
									backgroundColor: "#FFF",
									position: "relative",
									transition: "all 0.2s"
								},
								children: [
									/* @__PURE__ */ jsx(Image, {
										size: 24,
										color: "#888",
										style: { marginBottom: "12px" }
									}),
									/* @__PURE__ */ jsx("p", {
										style: {
											fontSize: "11px",
											color: "#666",
											marginBottom: "0"
										},
										children: "Click to upload cover image"
									}),
									/* @__PURE__ */ jsx("label", {
										style: {
											position: "absolute",
											inset: 0,
											cursor: "pointer"
										},
										children: /* @__PURE__ */ jsx("input", {
											type: "file",
											accept: "image/*",
											onChange: handleImageUpload,
											style: { display: "none" },
											disabled: uploading
										})
									}),
									uploading && /* @__PURE__ */ jsx("div", {
										style: {
											position: "absolute",
											inset: 0,
											backgroundColor: "rgba(255,255,255,0.8)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											borderRadius: "8px"
										},
										children: /* @__PURE__ */ jsx(Loader2, {
											className: "animate-spin",
											size: 20,
											color: "#111"
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								backgroundColor: "#F9FAFB",
								padding: "24px",
								borderRadius: "8px",
								border: "1px solid #F3F4F6",
								marginBottom: "32px"
							},
							children: [/* @__PURE__ */ jsx("label", {
								style: {
									fontSize: "10px",
									fontWeight: 700,
									color: "#888",
									display: "block",
									marginBottom: "12px"
								},
								children: "CATEGORY"
							}), /* @__PURE__ */ jsxs("select", {
								value: category,
								onChange: (e) => setCategory(e.target.value),
								style: {
									width: "100%",
									padding: "10px",
									backgroundColor: "#FFF",
									border: "1px solid #E5E7EB",
									borderRadius: "4px",
									cursor: "pointer"
								},
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "E-commerce",
										children: "E-commerce"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "Fashion Business",
										children: "Fashion Business"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "Growth & Marketing",
										children: "Growth & Marketing"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "Branding",
										children: "Branding"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "Business Tips",
										children: "Business Tips"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							style: {
								backgroundColor: "#F9FAFB",
								padding: "24px",
								borderRadius: "8px",
								border: "1px solid #F3F4F6"
							},
							children: [
								/* @__PURE__ */ jsx("label", {
									style: {
										fontSize: "10px",
										fontWeight: 700,
										color: "#888",
										display: "block",
										marginBottom: "12px"
									},
									children: "AUTHOR"
								}),
								/* @__PURE__ */ jsx("input", {
									value: authorName,
									onChange: (e) => setAuthorName(e.target.value),
									style: {
										width: "100%",
										padding: "10px",
										backgroundColor: "#FFF",
										border: "1px solid #E5E7EB",
										borderRadius: "4px",
										marginBottom: "24px"
									}
								}),
								/* @__PURE__ */ jsx("label", {
									style: {
										fontSize: "10px",
										fontWeight: 700,
										color: "#888",
										display: "block",
										marginBottom: "12px"
									},
									children: "DATE"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "date",
									value: publishedAt,
									onChange: (e) => setPublishedAt(e.target.value),
									style: {
										width: "100%",
										padding: "10px",
										backgroundColor: "#FFF",
										border: "1px solid #E5E7EB",
										borderRadius: "4px"
									}
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {}),
			/* @__PURE__ */ jsx("style", { children: `
          .tiptap-editor-container .ProseMirror { outline: none; min-height: 500px; }
          .tiptap-editor-container p { margin-bottom: 1.5em; }
          .tiptap-editor-container h1 { font-family: 'Playfair Display', serif; font-size: 2.5em; margin-bottom: 0.5em; }
          .tiptap-editor-container h2 { font-family: 'Playfair Display', serif; font-size: 2em; margin-bottom: 0.5em; }
          .tiptap-editor-container ul { list-style-type: disc; padding-left: 1.5rem; }
          .tiptap-editor-container ol { list-style-type: decimal; padding-left: 1.5rem; }
          .tiptap-editor-container table { border-collapse: collapse; width: 100%; margin: 2rem 0; }
          .tiptap-editor-container table td, .tiptap-editor-container table th { border: 1px solid #E5E7EB; padding: 12px; }
          .editor-toolbar-btn:hover { background-color: #F3F4F6 !important; }
          
          @media (max-width: 992px) {
            .editor-main-layout { 
              grid-template-columns: 1fr !important; 
              gap: 40px !important; 
              padding-top: 80px !important;
            }
            .content-area-aside { order: -1; }
            .tiptap-editor-container { padding: 20px !important; }
            .editor-title-input { font-size: 32px !important; }
          }
        ` })
		]
	}) });
}
//#endregion
export { FillBlog as default };
