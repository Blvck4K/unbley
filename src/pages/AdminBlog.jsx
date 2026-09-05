import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, Edit, Trash2, Filter, Eye } from 'lucide-react';

import { useBlog } from '../hooks/useBlog';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminBlog() {
  const navigate = useNavigate();
  const { toast, confirmDialog } = useToast();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { posts, loading } = useBlog();

  const handleEdit = (id) => {
    navigate(`/fillblog?id=${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Delete Manuscript',
      message: 'Are you sure you want to delete this blog post? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Manuscript deleted successfully');
      // Realtime will trigger refresh via useBlog
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post: " + err.message);
    }
  };

  const stats = {
    total: posts.length,
    drafts: posts.filter(p => p.status === 'draft').length,
    published: posts.filter(p => p.status === 'published').length
  };

  const s = {
    page: { backgroundColor: '#FBF9F5', minHeight: '100vh', color: '#221510', fontFamily: '"Inter", sans-serif' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px 120px' },

    // Header
    topNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 0 80px', borderBottom: '1px solid #DFCFC2', marginBottom: '60px' },
    navLinks: { display: 'flex', gap: '32px', overflowX: 'auto', paddingBottom: '12px' },
    navLink: (active) => ({ fontSize: '13px', fontWeight: '600', color: active ? '#6A3E1F' : '#6B584C', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: active ? '2px solid #6A3E1F' : 'none', paddingBottom: '4px' }),

    headerArea: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '24px' },
    breadcrumb: { fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8D5B36', marginBottom: '12px', display: 'block' },
    title: { fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: '800', color: '#221510', letterSpacing: '-0.03em', margin: 0 },
    createBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#6A3E1F', color: '#FFF', padding: '14px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(106,62,31,0.2)' },

    // Analytics Row
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '80px' },
    statCard: { backgroundColor: '#FFF', border: '1px solid #EAE3D9', padding: '40px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(34,21,16,0.03)' },
    statLabel: { fontSize: '12px', color: '#6B584C', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' },
    statValue: { fontSize: '48px', fontWeight: '800', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)', color: '#221510' },
    readershipCard: { gridColumn: 'span 1', backgroundColor: '#261710', color: '#FDFBF7', padding: '40px', borderRadius: '12px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 30px rgba(38,23,16,0.15)' },
    graphOverlay: { position: 'absolute', bottom: '20px', right: '20px', opacity: 0.15 },

    // Table Section
    sectionTitle: { fontSize: '24px', fontFamily: 'var(--font-heading)', fontWeight: '800', letterSpacing: '-0.02em', color: '#221510', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', padding: '16px 24px', backgroundColor: '#F7F2EC', borderRadius: '8px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B584C', marginBottom: '8px', border: '1px solid #DFCFC2' },
    tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', padding: '24px', backgroundColor: '#FFF', borderRadius: '8px', border: '1px solid #EAE3D9', alignItems: 'center', cursor: 'default', marginBottom: '8px' },
    manuscriptTitle: { fontSize: '15px', fontWeight: '700', color: '#221510', marginBottom: '4px' },
    manuscriptMeta: { fontSize: '12px', color: '#6B584C' },
    statusChip: (published) => ({ padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', backgroundColor: published ? '#F7F2EC' : '#F1EFE9', color: published ? '#6A3E1F' : '#6B584C', border: `1px solid ${published ? '#DFCFC2' : '#EAE3D9'}`, textTransform: 'uppercase' }),

    // Editor Card
    editorCard: { backgroundColor: '#FFF', border: '1px solid #EAE3D9', borderRadius: '12px', padding: '0', overflow: 'hidden', marginTop: '120px', boxShadow: '0 40px 100px -20px rgba(34,21,16,0.05)' },
    editorHeader: { padding: '24px 40px', borderBottom: '1px solid #EAE3D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FCFBFA' },
    editorTitleInput: { width: '100%', border: 'none', background: 'none', outline: 'none', fontFamily: 'var(--font-heading)', fontSize: '56px', fontWeight: '800', color: '#221510', padding: '60px 0 40px', letterSpacing: '-0.03em' },
    heroPlaceholder: { width: '100%', height: '300px', backgroundColor: '#F7F2EC', display: 'flex', flexHorizontal: 'column', alignItems: 'center', justifyContent: 'center', color: '#6B584C', cursor: 'pointer', borderRadius: '8px', marginBottom: '40px', border: '1px dashed #DFCFC2' },
    formattingBar: { position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#261710', color: '#FFF', padding: '12px 24px', borderRadius: '12px', display: 'flex', gap: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', zIndex: 1000 }
  };

  return (
    <PageTransition>
      <div style={s.page}>
        <Navbar />

        <div style={s.container}>
          {/* Internal Nav */}
          <div style={s.topNav}>
            <div className="font-bold" style={{ fontSize: '20px', letterSpacing: '-0.03em', color: '#221510' }}>The Archivist</div>
            <div style={s.navLinks}>
              {['Essays', 'Categories', 'Authors', 'Dashboard'].map(tab => (
                <div key={tab} style={s.navLink(activeTab === tab)} onClick={() => setActiveTab(tab)}>{tab}</div>
              ))}
            </div>
            <div className="flex gap-4">
              <Filter size={18} color="#6B584C" />
              <Eye size={18} color="#6B584C" />
            </div>
          </div>

          <header style={s.headerArea}>
            <div>
              <span style={s.breadcrumb}>Administrative Control</span>
              <h1 style={s.title}>Content Repository</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={s.createBtn}
              onClick={() => navigate('/fillblog')}
            >
              <Plus size={18} /> Create New Post
            </motion.button>
          </header>

          <div style={s.statsRow} className="admin-stats-row">
            <div style={s.statCard}>
              <span style={s.statLabel}>Total Essays</span>
              <span style={s.statValue}>{loading ? '...' : stats.total}</span>
            </div>
            <div style={s.statCard}>
              <span style={s.statLabel}>Drafts</span>
              <span style={s.statValue}>{loading ? '...' : stats.drafts}</span>
            </div>
            <div style={s.readershipCard} className="admin-readership-card">
              <span style={{ ...s.statLabel, color: '#C9BFB5' }}>Monthly Readership</span>
              <div className="flex items-baseline gap-2" style={{ marginBottom: '8px' }}>
                <span style={{ ...s.statValue, fontSize: '48px', color: '#FDFBF7' }}>42.8k</span>
                <TrendingUp size={24} color="#DFCFC2" />
              </div>
              <div style={s.graphOverlay}>
                <TrendingUp size={120} />
              </div>
            </div>
          </div>

          <section>
            <div style={s.sectionTitle}>
              Active Manuscripts
              <span style={{ fontSize: '12px', color: '#888', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={14} /> Filter
              </span>
            </div>

            <div style={s.tableHeader} className="admin-table-header">
              <div>Manuscript Title</div>
              <div>Status</div>
              <div className="admin-hide-mobile">Author</div>
              <div className="admin-hide-mobile">Date</div>
              <div>Actions</div>
            </div>

            {posts.map(post => (
              <motion.div
                key={post.id}
                whileHover={{ backgroundColor: '#FCFBFA' }}
                style={s.tableRow}
                className="admin-table-row"
              >
                <div className="admin-title-col">
                  <div style={s.manuscriptTitle}>{post.title}</div>
                  <div style={s.manuscriptMeta}>{post.category || 'Editorial'} • {post.read_time}</div>
                  <div className="admin-show-mobile" style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                    {post.author_name || 'Anonymous'} • {new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="admin-status-col">
                  <span style={s.statusChip(post.status === 'published')}>{post.status}</span>
                </div>
                <div className="admin-hide-mobile" style={{ fontSize: '14px', color: '#444' }}>{post.author_name || 'Anonymous'}</div>
                <div className="admin-hide-mobile" style={{ fontSize: '14px', color: '#888' }}>{new Date(post.created_at).toLocaleDateString()}</div>
                <div className="flex gap-4 admin-actions-col">
                  <Edit
                    size={16}
                    color="#888"
                    className="cursor-pointer hover:text-black"
                    onClick={() => handleEdit(post.id)}
                  />
                  <Trash2
                    size={16}
                    color="#888"
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => handleDelete(post.id)}
                  />
                </div>
              </motion.div>
            ))}
            {posts.length === 0 && !loading && (
              <div style={{ padding: '80px', textAlign: 'center', color: '#888' }}>
                No manuscripts found. Start by creating a new post.
              </div>
            )}
          </section>
        </div>

        <Footer />

        <style>{`
          .flex { display: flex; }
          .items-center { align-items: center; }
          .items-baseline { align-items: baseline; }
          .justify-between { justify-content: space-between; }
          .flex-col { flex-direction: column; }
          .gap-2 { gap: 8px; }
          .gap-4 { gap: 16px; }
          .gap-12 { gap: 48px; }
          .gap-24 { gap: 96px; }
          .cursor-pointer { cursor: pointer; }
          
          @media (max-width: 992px) {
            .admin-stats-row { grid-template-columns: 1fr !important; }
            .admin-table-header { grid-template-columns: 1fr 80px 80px !important; }
            .admin-table-row { grid-template-columns: 1fr 80px 80px !important; padding: 16px !important; }
            .admin-hide-mobile { display: none !important; }
            .admin-show-mobile { display: block !important; }
            .admin-title-col { overflow: hidden; }
          }
          
          .admin-show-mobile { display: none; }
        `}</style>
      </div>
    </PageTransition>
  );
}
