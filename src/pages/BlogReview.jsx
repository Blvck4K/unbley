import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, User, Calendar, Tag, LayoutGrid, Loader2, Copy, Check } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
// Rendering HTML instead of Markdown for the new rich-text editor

export default function BlogReview() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      // Check if slug is a valid UUID to avoid Postgres error

      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      const { data: fetchResult, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setPost(fetchResult);
    } catch (err) {
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPost();

      // Subscribe to real-time changes for THIS post
      const channel = supabase
        .channel(`post_${slug}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'blog_posts', filter: `slug=eq.${slug}` },
          (payload) => {
            console.log("Post updated live:", payload);
            setPost(payload.new);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [slug]);

  const headings = React.useMemo(() => {
    if (!post?.content) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const hTags = doc.querySelectorAll('h2, h3');
    return Array.from(hTags).map((tag, idx) => ({
      id: `heading-${idx}`,
      text: tag.innerText,
      level: tag.tagName.toLowerCase()
    }));
  }, [post?.content]);

  const processedContent = React.useMemo(() => {
    if (!post?.content) return '';
    let content = post.content;
    let idx = 0;
    // Robust regex to match h2/h3 even if they have attributes
    return content.replace(/<(h[23])(\s+[^>]*?)?>(.*?)<\/h\1>/g, (match, tag, attrs, text) => {
      const id = `heading-${idx++}`;
      return `<${tag}${attrs || ''} id="${id}">${text}</${tag}>`;
    });
  }, [post?.content]);

  const s = {
    page: { backgroundColor: 'var(--bg-light)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: '"Inter", sans-serif' },
    hero: { padding: '160px 0 100px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' },
    heroGrid: { display: 'grid', gridTemplateColumns: post?.cover_image_url ? '1.2fr 1fr' : '1fr', gap: '64px', alignItems: 'center' },
    title: { fontFamily: '"Playfair Display", serif', fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: '700', marginBottom: '24px', letterSpacing: '-0.02em', lineHeight: '1.1' },
    byline: { fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' },
    heroImage: { width: '100%', height: 'clamp(250px, 40vw, 450px)', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },

    // Article Layout
    container: { display: 'grid', gridTemplateColumns: 'minmax(200px, 300px) 1fr', gap: '80px', maxWidth: '1200px', margin: '0 auto', padding: '0 24px 160px' },
    sidebar: { position: 'sticky', top: '120px', height: 'fit-content' },
    sidebarItem: { marginBottom: '32px' },
    sidebarLabel: { fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px', display: 'block' },
    sidebarValue: { fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' },

    // ToC Styles
    tocLink: { display: 'block', fontSize: '13px', color: '#666', textDecoration: 'none', marginBottom: '12px', transition: 'all 0.2s', cursor: 'pointer', lineHeight: '1.4' },
    tocLinkActive: { color: '#111', fontWeight: '700' },

    // Content Styles
    article: { maxWidth: '720px', fontSize: '18px', lineHeight: '1.7', color: '#374151' },
    h2: { fontSize: '32px', fontWeight: '700', marginTop: '64px', marginBottom: '24px', color: 'var(--text-primary)', letterSpacing: '-0.01em' },
    p: { marginBottom: '24px' },
    list: { paddingLeft: '24px', marginBottom: '32px', listStyleType: 'disc' },
    listItem: { marginBottom: '12px' },

    // CTA Section
    cta: { backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', padding: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '120px', position: 'relative', overflow: 'hidden' },
    ctaText: { maxWidth: '500px' },
    ctaTitle: { fontSize: '32px', fontWeight: '800', marginBottom: '16px' }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F7F2' }}>
        <Loader2 className="animate-spin" size={48} color="#888" />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F7F2', gap: '20px' }}>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '32px' }}>The archive is silent.</h1>
        <p style={{ color: '#888' }}>The manuscript you seek could not be found.</p>
        <button className="btn btn-outline" onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={post?.meta_title || post?.title || "ZizzyStores Blog"}
        description={post?.meta_description || post?.excerpt || "Read this story on ZizzyStores Blog – Nigerian Ecommerce & Growth."}
        canonical={post ? `https://zizzystores.com/blog-review/${post.slug}` : `https://zizzystores.com/blog-review`}
        ogImage={post?.cover_image_url || 'https://zizzystores.com/og-default.jpg'}
        ogType="article"
      />
      <PageTransition>
        <div style={s.page}>
        <Navbar />

        {/* Editorial Hero */}
        <header style={s.hero}>
          <div style={s.heroGrid}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 style={s.title}>{post.title}</h1>
              <div style={s.byline}>
                <User size={16} /> <span>By <strong>{post.author_name || 'Anonymous'}</strong> Editorial Suite</span>
              </div>
            </motion.div>

            {post.cover_image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  style={s.heroImage}
                />
              </motion.div>
            )}
          </div>
        </header>

        {/* Main Article Section */}
        <div className="article-layout" style={s.container}>
          {/* Sidebar Metadata */}
          <aside className="article-sidebar" style={s.sidebar}>
            <div style={s.sidebarItem}>
              <span style={s.sidebarLabel}>Category</span>
              <div style={s.sidebarValue} className="flex items-center gap-2">
                <Tag size={14} color="var(--text-muted)" /> {post.category || 'Editorial'}
              </div>
            </div>
            <div style={s.sidebarItem}>
              <span style={s.sidebarLabel}>Published</span>
              <div style={s.sidebarValue} className="flex items-center gap-2">
                <Calendar size={14} color="var(--text-muted)" /> {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
            {post.read_time && (
              <div style={s.sidebarItem}>
                <span style={s.sidebarLabel}>Reading Time</span>
                <div style={s.sidebarValue}>{post.read_time}</div>
              </div>
            )}

            {/* Table of Contents */}
            {headings.length > 0 && (
              <div style={s.sidebarItem} className="mt-12 pt-8 border-t border-gray-100">
                <span style={s.sidebarLabel}>Navigation</span>
                <div className="flex flex-col">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      style={{
                        ...s.tocLink,
                        paddingLeft: heading.level === 'h3' ? '16px' : '0',
                        borderLeft: heading.level === 'h2' ? '2px solid transparent' : 'none'
                      }}
                      className="hover:text-black hover:translate-x-1"
                    >
                      {heading.text}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <motion.main
            variants={containerVariants}
            initial="visible"
            animate="visible"
            style={s.article}
          >
            {/* Metadata Overview for Reviewers */}
            <div style={{ padding: '32px', backgroundColor: '#F3F4F6', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '60px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
                <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 900, color: '#4B5563', letterSpacing: '0.1em' }}>LIVE LINK / PERMALINK</label>
                    <button
                      onClick={handleCopyLink}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700,
                        color: showCopied ? '#059669' : '#111', background: 'none', border: 'none', cursor: 'pointer',
                        padding: '4px 8px', borderRadius: '4px', backgroundColor: showCopied ? '#D1FAE5' : '#E5E7EB',
                        transition: 'all 0.2s'
                      }}
                    >
                      {showCopied ? <Check size={12} /> : <Copy size={12} />}
                      {showCopied ? 'COPIED!' : 'COPY LINK'}
                    </button>
                  </div>
                  <code style={{ fontSize: '14px', color: '#111', fontWeight: 500, wordBreak: 'break-all', backgroundColor: '#FFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', display: 'block' }}>
                    {window.location.protocol}//{window.location.host}/blog-review/{post.slug}
                  </code>
                </div>

                {post.meta_description && (
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 900, color: '#4B5563', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>SEO META DESCRIPTION</label>
                    <p style={{ fontSize: '15px', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>{post.meta_description}</p>
                  </div>
                )}
              </div>
            </div>

            <div
              className="rich-content"
              style={{ fontSize: '18px', lineHeight: '1.8', color: '#374151' }}
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* CTA Section */}
            <motion.div
              style={s.cta}
              whileInView={{ y: 0, opacity: 1 }}
              initial={{ y: 40, opacity: 0 }}
              viewport={{ once: true }}
            >
              <div style={s.ctaText}>
                <h3 style={s.ctaTitle}>Ready to deploy?</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Claim Your Space Online. Get a free domain and own a full E-commerce website for your Brand <strong>Click the Get Started Button Below To Begin</strong></p>
                <div className="flex gap-4">
                  <button className="btn btn-primary">Get Started</button>
                  <button className="btn btn-outline">Contact Us</button>
                </div>
              </div>
              <div className="cta-dots" style={{ opacity: 0.1 }}>
                <LayoutGrid size={120} />
              </div>
            </motion.div>
          </motion.main>
        </div>

        <Footer />

        <style>{`
          @media (max-width: 992px) {
            .article-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
            .article-sidebar { 
              position: static !important; 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
              gap: 24px; 
              border-bottom: 1px solid var(--border-color); 
              padding-bottom: 40px; 
              margin-bottom: 40px;
            }
          }
          
          .rich-content strong {
            font-weight: 700;
            color: #111;
          }
          
          .rich-content em {
            font-style: italic;
          }
          
          .rich-content a {
            color: #089cff;
            text-decoration: underline;
            text-underline-offset: 4px;
          }
          
          .rich-content blockquote {
            border-left: 4px solid #E5E7EB;
            padding-left: 24px;
            margin: 32px 0;
            font-style: italic;
            color: #6B7280;
          }

          .rich-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 32px 0;
          }

          .rich-content h1, .rich-content h2, .rich-content h3 {
            font-family: 'Playfair Display', serif;
            color: #111;
            margin-top: 2em;
            margin-bottom: 0.5em;
            scroll-margin-top: 120px;
          }

          .rich-content h1 { font-size: 2.5em; }
          .rich-content h2 { font-size: 2em; }
          .rich-content h3 { font-size: 1.75em; }

          .rich-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 1.5em;
          }

          .rich-content ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin-bottom: 1.5em;
          }

          .rich-content table {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
            margin: 2rem 0;
            overflow: hidden;
          }

          .rich-content td, .rich-content th {
            border: 1px solid #E5E7EB;
            box-sizing: border-box;
            min-width: 1em;
            padding: 12px;
            position: relative;
            vertical-align: top;
          }

          .rich-content th {
            background-color: #F9FAFB;
            font-weight: bold;
            text-align: left;
          }
        `}</style>
        </div>
      </PageTransition>
    </>
  );
}
