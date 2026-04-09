import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBlog } from '../hooks/useBlog';
import { useAuth } from '../hooks/useAuth';
import SEO from '../components/SEO';

const categories = ['Latest', 'E-commerce', 'Fashion Business', 'Growth & Marketing', 'Branding', 'Business Tips'];

export default function AllBlog() {
  const [activeCategory, setActiveCategory] = useState('Latest');
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { posts, loading } = useBlog({ status: 'published' });

  // Identified latest post (already sorted by latest in useBlog)
  const latestPost = posts.length > 0 ? posts[0] : null;

  // Filter posts by category and publication date
  const now = new Date();
  const filteredPosts = posts.filter(p => {
    const isTargetCategory = activeCategory === 'Latest' || p.category === activeCategory;
    const isPubliclyAvailable = new Date(p.created_at) <= now;
    return isTargetCategory && isPubliclyAvailable;
  });

  const s = {
    page: { backgroundColor: '#F9F7F2', minHeight: '100vh', color: '#1A1A1A', fontFamily: '"Inter", sans-serif' },
    header: { padding: '120px 0 80px', maxWidth: '1200px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' },
    topLabel: { fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', color: '#888', textTransform: 'uppercase', marginBottom: '24px', display: 'block' },
    title: { fontFamily: '"Playfair Display", serif', fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: '1', fontWeight: '700', marginBottom: '40px', letterSpacing: '-0.02em' },
    subtitle: { fontSize: '18px', lineHeight: '1.6', color: '#444', maxWidth: '600px', marginBottom: '60px' },

    filterContainer: { display: 'flex', gap: '32px', marginBottom: '80px', borderBottom: '1px solid #E5E1D8', paddingBottom: '20px', overflowX: 'auto' },
    filterItem: (active) => ({
      fontSize: '14px',
      fontWeight: '600',
      color: active ? '#1A1A1A' : '#888',
      cursor: 'pointer',
      padding: '8px 0',
      position: 'relative',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      whiteSpace: 'nowrap'
    }),

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '80px 40px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px 120px' },
    card: { cursor: 'pointer', display: 'flex', flexDirection: 'column', backgroundColor: '#FFF', border: '1px solid #E5E1D8', borderRadius: '8px', transition: 'all 0.3s ease', overflow: 'hidden' },
    cardContent: { padding: '40px', paddingTop: '24px' },
    imageWrapper: { width: '100%', height: '240px', overflow: 'hidden' },
    image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },
    meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
    cardCategory: { fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', color: '#089cff', textTransform: 'uppercase' },
    cardReadTime: { fontSize: '11px', color: '#888', textTransform: 'uppercase' },
    cardTitle: { fontFamily: '"Playfair Display", serif', fontSize: '28px', fontWeight: '700', lineHeight: '1.3', marginBottom: '16px', color: '#1A1A1A' },
    cardExcerpt: {
      fontSize: '15px',
      lineHeight: '1.6',
      color: '#666',
      marginBottom: '24px',
      display: '-webkit-box',
      WebkitLineClamp: '3',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    cardLink: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' },

    pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', paddingBottom: '120px', maxWidth: '1200px', margin: '0 auto' },
    pageNum: (active) => ({ fontSize: '14px', fontWeight: '700', color: active ? '#1A1A1A' : '#CCC', cursor: 'pointer', borderBottom: active ? '2px solid #1A1A1A' : 'none', paddingBottom: '4px' }),
    pagBtn: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', color: '#888' }
  };

  return (
    <>
      <SEO 
        title="ZizzyStores Blog – Ecommerce & Growth Tips for Nigerian Brands"
        description="Learn how to build, grow, and scale your brand online in Nigeria with ZizzyStores. Expert insights on e-commerce, branding, and business growth."
        canonical="https://zizzystores.com/all-blogs"
      />
      <PageTransition>
        <div style={s.page}>
        <Navbar />

        <header style={s.header} className="blog-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px' }}>
              <div 
                style={{ cursor: latestPost ? 'pointer' : 'default', flex: '1 1 600px' }} 
                onClick={() => latestPost && navigate(`/blog/${latestPost.slug || latestPost.id}`)}
              >
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={s.topLabel}
                >
                  {latestPost ? 'Latest Insight' : 'Curated Repository'}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={s.title}
                  className="blog-title"
                >
                  {latestPost ? latestPost.title : (
                    <>The Complete<br />Archive</>
                  )}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    ...s.subtitle,
                    marginBottom: '10px'
                  }}
                >
                  {latestPost ? latestPost.excerpt : "A chronological odyssey through our most profound inquiries. From classical philosophy to modern cultural shifts, explored with meticulous depth."}
                </motion.p>

                {latestPost && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px', 
                      marginBottom: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#888',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    <span style={{ color: '#089cff' }}>{latestPost.category}</span>
                    <span>•</span>
                    <span>{latestPost.read_time}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1A1A1A' }}>
                      Read Entry <ArrowRight size={14} />
                    </span>
                  </motion.div>
                )}
              </div>

              {latestPost && latestPost.cover_image_url && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ 
                    flex: '1 1 400px', 
                    height: '400px', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/blog/${latestPost.slug || latestPost.id}`)}
                >
                  <img 
                    src={latestPost.cover_image_url} 
                    alt={latestPost.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </motion.div>
              )}

              {isAdmin && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/admin-blog')}
                  style={{
                    backgroundColor: '#1A1A1A',
                    color: '#FFF',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginLeft: 'auto',
                    alignSelf: 'flex-start'
                  }}
                >
                  Admin Dashboard <ArrowRight size={14} />
                </motion.button>
              )}
            </div>
          </div>

          <div style={s.filterContainer} className="blog-filters">
            {categories.map((cat) => (
              <div
                key={cat}
                style={s.filterItem(activeCategory === cat)}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="underline"
                    style={{ position: 'absolute', bottom: '-21px', left: 0, right: 0, height: '2px', backgroundColor: '#1A1A1A' }}
                  />
                )}
              </div>
            ))}
          </div>
        </header>

        <main style={s.grid} className="blog-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', color: '#888' }}>
              Syncing with the archive...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', color: '#888' }}>
              No articles found in this section.
            </div>
          ) : (
            filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                style={s.card}
                onClick={() => navigate(`/blog/${post.slug || post.id}`)}
              >
                {post.cover_image_url && (
                  <div style={s.imageWrapper}>
                    <img src={post.cover_image_url} alt={post.title} style={s.image} className="blog-card-img" />
                  </div>
                )}
                <div style={s.cardContent}>
                  <div style={s.meta}>
                    <span style={s.cardCategory}>{post.category}</span>
                    <span style={s.cardReadTime}>{post.read_time}</span>
                  </div>
                  <h2 style={s.cardTitle}>{post.title}</h2>
                  <p style={s.cardExcerpt}>{post.excerpt}</p>
                  <div style={s.cardLink}>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </main>

        <Footer />

        <style>{`
          .blog-filters::-webkit-scrollbar { display: none; }
          .blog-filters { -ms-overflow-style: none; scrollbar-width: none; }
          
          @media (max-width: 768px) {
            .blog-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
            .blog-title { font-size: 36px !important; }
            .blog-header { padding-top: 80px !important; padding-bottom: 40px !important; }
            .blog-filters { padding-bottom: 15px !important; margin-bottom: 40px !important; }
            .blog-card-img { height: 200px !important; }
          }
        `}</style>
        </div>
      </PageTransition>
    </>
  );
}
