import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, User, Calendar, Tag, LayoutGrid, Loader2, Copy, Check } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
// Rendering HTML instead of Markdown for the new rich-text editor

export default function Blog() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(window.innerWidth > 992);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) setIsTocOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

      // Try fetching by slug first
      let { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      // If slug fetch fails or returns nothing, try fetching by ID (if slug looks like a UUID)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
      if ((error || !data) && isUuid) {
        const { data: idData, error: idError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', slug)
          .single();
        data = idData;
        error = idError;
      }

      if (error) throw error;
      setPost(data);
    } catch (err) {
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post?.id) {
      // Subscribe to real-time changes for THIS post
      const channel = supabase
        .channel(`post_updates_${post.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'blog_posts',
            filter: `id=eq.${post.id}`
          },
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
  }, [post?.id]);

  const headings = React.useMemo(() => {
    if (!post?.content) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const hTags = doc.querySelectorAll('h1, h2, h3');
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
    container: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '120px', maxWidth: '1300px', margin: '0 auto', padding: '0 40px 200px', width: '100%', boxSizing: 'border-box' },
    sidebar: { position: 'sticky', top: '140px', height: 'fit-content' },
    sidebarItem: { marginBottom: '48px' },
    sidebarLabel: { fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    sidebarValue: { fontSize: '15px', fontWeight: '600', color: '#121212' },

    // ToC Styles
    tocLink: { display: 'block', fontSize: '14px', color: '#777', textDecoration: 'none', marginBottom: '16px', transition: 'all 0.3s', cursor: 'pointer', lineHeight: '1.6', fontWeight: '500' },
    tocLinkActive: { color: '#121212', fontWeight: '700' },

    // Content Styles
    article: { maxWidth: '780px', fontSize: '20px', lineHeight: '1.85', color: '#222', letterSpacing: '-0.01em' },
    h2: { fontFamily: '"Playfair Display", serif', fontSize: '42px', fontWeight: '700', marginTop: '80px', marginBottom: '32px', color: '#121212', letterSpacing: '-0.02em' },
    p: { marginBottom: '32px' },
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
        canonical={post ? `https://zizzystores.com/blog/${post.slug}` : `https://zizzystores.com/blog`}
        ogImage={post?.cover_image_url || 'https://zizzystores.com/og-default.jpg'}
        ogType="article"
      />
      <PageTransition>
        <div style={s.page}>
          <Navbar />

          {/* Editorial Hero */}
          <header style={s.hero} className="blog-header-padding">
            <div className="blog-hero-grid" style={s.heroGrid}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="blog-hero-text"
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
                  className="blog-hero-image"
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
                  <button
                    onClick={() => setIsTocOpen(!isTocOpen)}
                    style={{ ...s.sidebarLabel, background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                    className="toc-toggle"
                  >
                    Navigation
                    <ChevronRight size={16} style={{ transform: isTocOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} className="toc-chevron" />
                  </button>
                  <AnimatePresence>
                    {(isTocOpen || window.innerWidth > 992) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                        className="toc-content"
                      >
                        <div className="flex flex-col pt-4">
                          {headings.map((heading) => (
                            <a
                              key={heading.id}
                              href={`#${heading.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                if (window.innerWidth <= 992) setIsTocOpen(false);
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                      {window.location.protocol}//{window.location.host}/blog/{post.slug}
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
            .article-layout { grid-template-columns: 1fr !important; gap: 40px !important; padding: 0 20px 80px !important; }
            .article-sidebar { 
              position: static !important; 
              display: grid; 
              grid-template-columns: 1fr; 
              gap: 24px; 
              border-bottom: 1px solid rgba(0,0,0,0.05); 
              padding-bottom: 40px; 
              margin-bottom: 60px;
            }
            .blog-hero-grid {
              display: flex !important;
              flex-direction: column !important;
              gap: 32px !important;
            }
            .blog-hero-image {
              order: -1 !important;
              display: block !important;
            }
            .blog-hero-text {
              order: 0 !important;
            }
            .blog-hero-image img {
              width: 100% !important;
              height: auto !important;
              display: block !important;
            }
            .toc-chevron { display: block !important; }
            .blog-header-padding { padding-top: 100px !important; padding-bottom: 60px !important; }
          }
          
          .toc-chevron { display: none; }
          
          .rich-content {
            font-size: 20px;
            line-height: 1.85;
            color: #222;
          }

          .rich-content strong {
            font-weight: 800;
            color: #000;
          }
          
          .rich-content em {
            font-style: italic;
          }
          
          .rich-content a {
            color: #121212;
            text-decoration: underline;
            text-underline-offset: 6px;
            font-weight: 600;
          }
          
          .rich-content blockquote {
            border-left: 2px solid #121212;
            padding-left: 40px;
            margin: 60px 0;
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            line-height: 1.4;
            color: #121212;
          }

          .rich-content img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 60px 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          }

          .rich-content h1, .rich-content h2, .rich-content h3 {
            font-family: 'Playfair Display', serif;
            color: #121212;
            margin-top: 2.5em;
            margin-bottom: 0.8em;
            scroll-margin-top: 140px;
            line-height: 1.2;
          }

          .rich-content h1 { font-size: 48px; }
          .rich-content h2 { font-size: 38px; }
          .rich-content h3 { font-size: 28px; }

          .rich-content ul, .rich-content ol {
            margin-bottom: 2em;
            padding-left: 20px;
          }

          .rich-content li {
            margin-bottom: 12px;
          }

          .rich-content table {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
            margin: 4rem 0;
            background-color: #FFF;
            border: 1px solid #EEE;
          }

          .rich-content td, .rich-content th {
            border: 1px solid #EEE;
            padding: 20px;
            vertical-align: top;
          }

          .rich-content th {
            background-color: #FBFBFB;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.1em;
          }

          .blog-hero-text h1 {
            font-family: 'Playfair Display', serif;
          }
        `}</style>
        </div>
      </PageTransition>
    </>
  );
}
