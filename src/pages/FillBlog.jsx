import React, { useState, useEffect } from 'react';
import {
  ChevronRight, Search, Settings, Bold, Italic, Quote,
  Link as LinkIcon, Image as ImageIcon, ChevronDown,
  Upload, Calendar, Plus, X, ArrowRight, Loader2,
  List as ListIcon, ListOrdered, Table as TableIcon, AlignLeft,
  AlignCenter, AlignRight, Code, Strikethrough, Undo, Redo,
  Highlighter, Palette, Type, Maximize2, Minimize2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { supabase } from '../lib/supabase';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Tiptap Imports
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';

const ToolbarButton = ({ onClick, children, title, active }) => (
  <button
    onClick={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    style={{
      padding: '8px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: active ? '#E5E7EB' : 'transparent',
      color: active ? '#111' : '#4B5563',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      fontSize: '12px',
      fontWeight: 'bold',
      gap: '4px'
    }}
    className="editor-toolbar-btn"
  >
    {children}
  </button>
);

const ToolbarSelect = ({ value, onChange, options, title }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    title={title}
    style={{
      padding: '6px 10px',
      borderRadius: '6px',
      border: '1px solid #E5E7EB',
      backgroundColor: '#FFF',
      fontSize: '12px',
      color: '#4B5563',
      cursor: 'pointer',
      outline: 'none'
    }}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

const Divider = () => <div style={{ width: '1px', height: '20px', backgroundColor: '#E5E7EB', margin: '0 4px' }} />;

export default function FillBlog() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  // Post State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [category, setCategory] = useState('Editorial');
  const [tags, setTags] = useState(['History', 'Curation']);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('Julian Vane');
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);

  // UI State
  const [isSearchOptOpen, setIsSearchOptOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Full Tiptap setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Begin your narrative here...' }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle, Color, FontFamily,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Sync content when loaded
  useEffect(() => {
    if (editor && dataLoaded && content) {
      editor.commands.setContent(content);
    }
  }, [editor, dataLoaded]);

  // Auto-slug and SEO generation
  useEffect(() => {
    if (title && !editId) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [title, editId]);

  // Automated Meta Description & Title Fallbacks
  useEffect(() => {
    if (content && !metaDescription && !editId) {
      // Strip HTML tags and get first 155 chars for a high-quality snippet
      const plainText = content.replace(/<[^>]*>/g, '').trim();
      const autoDesc = plainText.substring(0, 152) + (plainText.length > 152 ? '...' : '');
      if (autoDesc.length > 10) setMetaDescription(autoDesc);
    }
    
    if (title && !metaTitle && !editId) {
      setMetaTitle(title);
    }
  }, [content, title, metaDescription, metaTitle, editId]);

  // Load post for editing
  useEffect(() => {
    if (editId) {
      const fetchPost = async () => {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', editId)
          .single();

        if (data && !error) {
          setTitle(data.title);
          setSlug(data.slug || '');
          setContent(data.content || '');
          setExcerpt(data.excerpt || '');
          setMetaDescription(data.meta_description || '');
          setMetaTitle(data.meta_title || '');
          setCategory(data.category || 'Editorial');
          setTags(data.tags || []);
          setCoverImageUrl(data.cover_image_url || '');
          setAuthorName(data.author_name || 'Julian Vane');
          if (data.created_at) {
            setPublishedAt(new Date(data.created_at).toISOString().split('T')[0]);
          }
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
        title, slug, content, excerpt, category,
        author_id: user?.id, author_name: authorName,
        cover_image_url: coverImageUrl,
        status: isPublishing ? 'published' : 'draft',
        tags, 
        meta_title: metaTitle || title, // Fallback if still blank
        meta_description: metaDescription || excerpt || '', // Fallback to excerpt
        read_time: `${Math.ceil(content.split(' ').length / 200)} MIN READ`,
        created_at: new Date(publishedAt).toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editId) {
        await supabase.from('blog_posts').update(postData).eq('id', editId);
      } else {
        await supabase.from('blog_posts').insert([postData]);
      }
      alert(isPublishing ? "Post Published!" : "Draft Saved!");
      navigate('/admin-blog');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const applyFormatting = (type, val) => {
    if (!editor) return;
    switch (type) {
      case 'bold': editor.chain().focus().toggleBold().run(); break;
      case 'italic': editor.chain().focus().toggleItalic().run(); break;
      case 'underline': editor.chain().focus().toggleUnderline().run(); break;
      case 'strike': editor.chain().focus().toggleStrike().run(); break;
      case 'heading1': editor.chain().focus().toggleHeading({ level: 1 }).run(); break;
      case 'heading2': editor.chain().focus().toggleHeading({ level: 2 }).run(); break;
      case 'bulletList': editor.chain().focus().toggleBulletList().run(); break;
      case 'orderedList': editor.chain().focus().toggleOrderedList().run(); break;
      case 'alignLeft': editor.chain().focus().setTextAlign('left').run(); break;
      case 'alignCenter': editor.chain().focus().setTextAlign('center').run(); break;
      case 'alignRight': editor.chain().focus().setTextAlign('right').run(); break;
      case 'undo': editor.chain().focus().undo().run(); break;
      case 'redo': editor.chain().focus().redo().run(); break;
      case 'color': editor.chain().focus().setColor(val).run(); break;
      case 'fontFamily': editor.chain().focus().setFontFamily(val).run(); break;
      case 'table': editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); break;
      case 'image':
        const url = prompt("Enter Image URL:");
        if (url) editor.chain().focus().setImage({ src: url }).run();
        break;
      case 'link':
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blog-covers/${fileName}`;
      await supabase.storage.from('blog_images').upload(filePath, file);
      const { data: { publicUrl } } = supabase.storage.from('blog_images').getPublicUrl(filePath);
      setCoverImageUrl(publicUrl);
    } catch (err) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageTransition>
      <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#1a1a1a' }}>
        <Navbar />

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '64px' }}>
          <div className="content-area">
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', marginBottom: '40px' }}>
              {editId ? 'Edit Post' : 'Create New Post'}
            </h1>

            <div style={{ marginBottom: '48px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#888', display: 'block', marginBottom: '8px' }}>POST TITLE</label>
              <input
                type="text"
                placeholder="Enter a descriptive headline..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '48px', fontFamily: "'Playfair Display', serif", outline: 'none' }}
              />
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '32px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '12px', border: '1px solid #F1F1F1', alignItems: 'center' }}>
                <ToolbarButton onClick={() => applyFormatting('undo')} title="Undo"><Undo size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => applyFormatting('redo')} title="Redo"><Redo size={16} /></ToolbarButton>

                <Divider />

                <ToolbarSelect
                  title="Font Family"
                  value={editor?.getAttributes('textStyle').fontFamily || 'Inter'}
                  onChange={(val) => applyFormatting('fontFamily', val)}
                  options={[
                    { label: 'Inter', value: 'Inter' },
                    { label: 'Playfair Display', value: 'Playfair Display' },
                    { label: 'Serif', value: 'serif' },
                    { label: 'Monospace', value: 'monospace' },
                    { label: 'Cursive', value: 'cursive' }
                  ]}
                />

                <ToolbarSelect
                  title="Text Color"
                  value={editor?.getAttributes('textStyle').color || '#111'}
                  onChange={(val) => applyFormatting('color', val)}
                  options={[
                    { label: 'Black', value: '#111111' },
                    { label: 'Gray', value: '#666666' },
                    { label: 'Red', value: '#E11D48' },
                    { label: 'Blue', value: '#2563EB' },
                    { label: 'Green', value: '#16A34A' },
                    { label: 'Gold', value: '#D97706' }
                  ]}
                />

                <Divider />

                <ToolbarButton onClick={() => applyFormatting('bold')} active={editor?.isActive('bold')} title="Bold"><Bold size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => applyFormatting('italic')} active={editor?.isActive('italic')} title="Italic"><Italic size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => applyFormatting('underline')} active={editor?.isActive('underline')} title="Underline"><Type size={16} style={{ textDecoration: 'underline' }} /></ToolbarButton>
                <ToolbarButton onClick={() => applyFormatting('strike')} active={editor?.isActive('strike')} title="Strikethrough"><Strikethrough size={16} /></ToolbarButton>

                <Divider />

                <ToolbarButton onClick={() => applyFormatting('heading1')} active={editor?.isActive('heading', { level: 1 })} title="H1">H1</ToolbarButton>
                <ToolbarButton onClick={() => applyFormatting('heading2')} active={editor?.isActive('heading', { level: 2 })} title="H2">H2</ToolbarButton>

                <Divider />

                <ToolbarButton onClick={() => applyFormatting('bulletList')} active={editor?.isActive('bulletList')} title="Bullets"><ListIcon size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => applyFormatting('orderedList')} active={editor?.isActive('orderedList')} title="Numbers"><ListOrdered size={16} /></ToolbarButton>

                <Divider />

                <ToolbarButton onClick={() => applyFormatting('alignLeft')} active={editor?.isActive({ textAlign: 'left' })} title="Left"><AlignLeft size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => applyFormatting('alignCenter')} active={editor?.isActive({ textAlign: 'center' })} title="Center"><AlignCenter size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => applyFormatting('alignRight')} active={editor?.isActive({ textAlign: 'right' })} title="Right"><AlignRight size={16} /></ToolbarButton>

                <Divider />

                <ToolbarButton onClick={() => applyFormatting('table')} title="Insert Table"><TableIcon size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => applyFormatting('image')} title="Insert Image"><ImageIcon size={16} /></ToolbarButton>
                <ToolbarButton onClick={() => applyFormatting('link')} active={editor?.isActive('link')} title="Insert Link"><LinkIcon size={16} /></ToolbarButton>
              </div>

              <div style={{ minHeight: '600px', padding: '40px', backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} className="tiptap-editor">
                <EditorContent editor={editor} />
              </div>
            </div>

            <div style={{ marginTop: '40px', backgroundColor: '#FFF', borderRadius: '12px', padding: '32px', border: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <button 
                onClick={() => setIsSearchOptOpen(!isSearchOptOpen)} 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', fontWeight: 800, fontSize: '14px', cursor: 'pointer', color: '#111' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Search size={18} color="var(--primary)" /> 
                  <span>GOOGLE SEARCH (SEO)</span>
                </div>
                {isSearchOptOpen ? <ChevronDown size={18} style={{ transform: 'rotate(180deg)' }} /> : <ChevronDown size={18} />}
              </button>
              
              {isSearchOptOpen && (
                <div style={{ marginTop: '32px', borderTop: '1px solid #F3F4F6', paddingTop: '24px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#888', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>PREVIEW IN GOOGLE</label>
                    <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #EEE', maxWidth: '600px' }}>
                      <div style={{ color: '#1a0dab', fontSize: '18px', marginBottom: '4px', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'arial, sans-serif' }}>
                        {metaTitle || title || 'Post Title'} | ZizzyStores
                      </div>
                      <div style={{ color: '#006621', fontSize: '14px', marginBottom: '4px', fontFamily: 'arial, sans-serif' }}>
                        https://zizzystores.com/blog/{slug || 'post-url'}
                      </div>
                      <div style={{ color: '#545454', fontSize: '13px', lineHeight: '1.4', fontFamily: 'arial, sans-serif' }}>
                        {metaDescription || (excerpt ? excerpt.substring(0, 160) : 'Start writing your post content to automatically generate a search description here...')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#888', display: 'block', marginBottom: '8px' }}>SEO META TITLE (SEARCH ENGINE LISTING)</label>
                      <input 
                        type="text"
                        value={metaTitle} 
                        onChange={(e) => setMetaTitle(e.target.value)} 
                        placeholder="Leave blank to use post title..."
                        style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '14px', outline: 'none' }} 
                      />
                      <p style={{ fontSize: '10px', color: '#888', marginTop: '6px' }}>Keep under 60 characters for best results.</p>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#888', display: 'block', marginBottom: '8px' }}>META DESCRIPTION (GOOGLE)</label>
                      <textarea 
                        value={metaDescription} 
                        onChange={(e) => setMetaDescription(e.target.value)} 
                        placeholder="Brief summary for search engines (invisible to users)..."
                        style={{ width: '100%', height: '100px', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '14px', outline: 'none' }} 
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p style={{ fontSize: '10px', color: '#888' }}>Ideal: 150-160 characters.</p>
                        <button 
                          onClick={() => {
                            const plainText = content.replace(/<[^>]*>/g, '').trim();
                            setMetaDescription(plainText.substring(0, 155) + (plainText.length > 155 ? '...' : ''));
                          }}
                          style={{ fontSize: '11px', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                        >
                          AUTO-GENERATE
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#888', display: 'block', marginBottom: '8px' }}>CARD EXCERPT (LISTING VIEW)</label>
                      <textarea 
                        value={excerpt} 
                        onChange={(e) => setExcerpt(e.target.value)} 
                        placeholder="Snippet shown on the blog archive cards..."
                        style={{ width: '100%', height: '100px', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '14px', outline: 'none' }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
              <button onClick={() => handleSave(false)} disabled={isSaving} style={{ padding: '12px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>SAVE DRAFT</button>
              <button onClick={() => handleSave(true)} disabled={isSaving} style={{ padding: '12px', fontWeight: 700, backgroundColor: '#111', color: '#FFF', borderRadius: '4px', cursor: 'pointer' }}>PUBLISH POST</button>
            </div>

            <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px', border: '1px solid #F3F4F6', marginBottom: '32px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#888', display: 'block', marginBottom: '12px' }}>COVER IMAGE</label>
              {coverImageUrl ? (
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <img src={coverImageUrl} alt="Cover" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px' }} />
                  <button
                    onClick={() => setCoverImageUrl('')}
                    style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFF', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div style={{ border: '2px dashed #E5E7EB', borderRadius: '8px', padding: '32px', textAlign: 'center', backgroundColor: '#FFF', position: 'relative', transition: 'all 0.2s' }}>
                  <ImageIcon size={24} color="#888" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '11px', color: '#666', marginBottom: '0' }}>Click to upload cover image</p>
                  <label style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                  {uploading && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}><Loader2 className="animate-spin" size={20} color="#111" /></div>}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px', border: '1px solid #F3F4F6', marginBottom: '32px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#888', display: 'block', marginBottom: '12px' }}>CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '4px', cursor: 'pointer' }}
              >
                <option value="E-commerce">E-commerce</option>
                <option value="Fashion Business">Fashion Business</option>
                <option value="Growth & Marketing">Growth & Marketing</option>
                <option value="Branding">Branding</option>
                <option value="Business Tips">Business Tips</option>
              </select>
            </div>

            <div style={{ backgroundColor: '#F9FAFB', padding: '24px', borderRadius: '8px', border: '1px solid #F3F4F6' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#888', display: 'block', marginBottom: '12px' }}>AUTHOR</label>
              <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '4px', marginBottom: '24px' }} />

              <label style={{ fontSize: '10px', fontWeight: 700, color: '#888', display: 'block', marginBottom: '12px' }}>DATE</label>
              <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '4px' }} />
            </div>
          </aside>
        </main>

        <Footer />
        <style>{`
          .tiptap-editor .ProseMirror { outline: none; min-height: 500px; }
          .tiptap-editor p { margin-bottom: 1.5em; }
          .tiptap-editor h1 { font-family: 'Playfair Display', serif; font-size: 2.5em; margin-bottom: 0.5em; }
          .tiptap-editor h2 { font-family: 'Playfair Display', serif; font-size: 2em; margin-bottom: 0.5em; }
          .tiptap-editor ul { list-style-type: disc; padding-left: 1.5rem; }
          .tiptap-editor ol { list-style-type: decimal; padding-left: 1.5rem; }
          .tiptap-editor table { border-collapse: collapse; width: 100%; margin: 2rem 0; }
          .tiptap-editor table td, .tiptap-editor table th { border: 1px solid #E5E7EB; padding: 12px; }
          .editor-toolbar-btn:hover { background-color: #F3F4F6 !important; }
        `}</style>
      </div>
    </PageTransition>
  );
}
