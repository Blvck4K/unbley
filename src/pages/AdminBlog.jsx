import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';
import {
  TrendingUp, Plus, Edit, Trash2, Filter,
  ChevronLeft, ChevronRight, Eye, Image as ImageIcon,
  Bold, Italic, Link as LinkIcon, List, Type
} from 'lucide-react';

import { useBlog } from '../hooks/useBlog';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminBlog() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { posts, loading } = useBlog();
  const { isAdmin } = useAuth();

  const handleEdit = (id) => {
    navigate(`/fillblog?id=${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Realtime will trigger refresh via useBlog
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete");
    }
  };

  const stats = {
    total: posts.length,
    drafts: posts.filter(p => p.status === 'draft').length,
    published: posts.filter(p => p.status === 'published').length
  };

  const s = {
    page: { backgroundColor: '#F9F7F2', minHeight: '100vh', color: '#1A1A1A', fontFamily: '"Inter", sans-serif' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px 120px' },

    // Header
    topNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 0 80px', borderBottom: '1px solid #E5E1D8', marginBottom: '60px' },
    navLinks: { display: 'flex', gap: '32px' },
    navLink: (active) => ({ fontSize: '13px', fontWeight: '600', color: active ? '#1A1A1A' : '#888', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: active ? '2px solid #1A1A1A' : 'none', paddingBottom: '4px' }),

    headerArea: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' },
    breadcrumb: { fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#888', marginBottom: '12px', display: 'block' },
    title: { fontFamily: '"Playfair Display", serif', fontSize: '56px', fontWeight: '700', letterSpacing: '-0.02em', margin: 0 },
    createBtn: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#052A24', color: '#FFF', padding: '14px 24px', borderRadius: '4px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' },

    // Analytics Row
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '80px' },
    statCard: { backgroundColor: '#FFF', border: '1px solid #E5E1D8', padding: '40px', borderRadius: '4px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    statLabel: { fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' },
    statValue: { fontSize: '48px', fontWeight: '400', fontFamily: '"Playfair Display", serif' },
    readershipCard: { gridColumn: 'span 1', backgroundColor: '#052A24', color: '#F9F7F2', padding: '40px', borderRadius: '4px', position: 'relative', overflow: 'hidden' },
    graphOverlay: { position: 'absolute', bottom: '20px', right: '20px', opacity: 0.2 },

    // Table Section
    sectionTitle: { fontSize: '24px', fontFamily: '"Playfair Display", serif', fontWeight: '600', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', padding: '16px 24px', backgroundColor: '#F1EFE9', borderRadius: '4px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: '8px' },
    tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', padding: '24px', backgroundColor: '#FFF', borderRadius: '4px', borderBottom: '1px solid #F1EFE9', alignItems: 'center', cursor: 'default' },
    manuscriptTitle: { fontSize: '15px', fontWeight: '700', color: '#1A1A1A', marginBottom: '4px' },
    manuscriptMeta: { fontSize: '12px', color: '#888' },
    statusChip: (published) => ({ padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', backgroundColor: published ? '#E1F2EE' : '#F1EFE9', color: published ? '#0B4A40' : '#888', textTransform: 'uppercase' }),

    // Editor Card
    editorCard: { backgroundColor: '#FFF', border: '1px solid #E5E1D8', borderRadius: '8px', padding: '0', overflow: 'hidden', marginTop: '120px', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.05)' },
    editorHeader: { padding: '24px 40px', borderBottom: '1px solid #F1EFE9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FCFBFA' },
    editorTitleInput: { width: '100%', border: 'none', background: 'none', outline: 'none', fontFamily: '"Playfair Display", serif', fontSize: '64px', fontWeight: '700', color: '#1A1A1A', padding: '60px 0 40px', letterSpacing: '-0.02em' },
    heroPlaceholder: { width: '100%', height: '300px', backgroundColor: '#F1EFE9', display: 'flex', flexHorizontal: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', borderRadius: '4px', marginBottom: '40px' },
    formattingBar: { position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#052A24', color: '#FFF', padding: '12px 24px', borderRadius: '12px', display: 'flex', gap: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', zIndex: 1000 }
  };

  return (
    <PageTransition>
      <div style={s.page}>
        <Navbar />

        <div style={s.container}>
          {/* Internal Nav */}
          <div style={s.topNav}>
            <div className="font-bold" style={{ fontSize: '20px', letterSpacing: '-0.03em' }}>The Archivist</div>
            <div style={s.navLinks}>
              {['Essays', 'Categories', 'Authors', 'Dashboard'].map(tab => (
                <div key={tab} style={s.navLink(activeTab === tab)} onClick={() => setActiveTab(tab)}>{tab}</div>
              ))}
            </div>
            <div className="flex gap-4">
              <Filter size={18} color="#888" />
              <Eye size={18} color="#888" />
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

          <div style={s.statsRow}>
            <div style={s.statCard}>
              <span style={s.statLabel}>Total Essays</span>
              <span style={s.statValue}>{loading ? '...' : stats.total}</span>
            </div>
            <div style={s.statCard}>
              <span style={s.statLabel}>Drafts</span>
              <span style={s.statValue}>{loading ? '...' : stats.drafts}</span>
            </div>
            <div style={s.readershipCard}>
              <span style={s.statLabel}>Monthly Readership</span>
              <div className="flex items-baseline gap-2" style={{ marginBottom: '8px' }}>
                <span style={{ ...s.statValue, fontSize: '48px' }}>42.8k</span>
                <TrendingUp size={24} color="#00FFB2" />
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

            <div style={s.tableHeader}>
              <div>Manuscript Title</div>
              <div>Status</div>
              <div>Author</div>
              <div>Date</div>
              <div>Actions</div>
            </div>

            {posts.map(post => (
              <motion.div
                key={post.id}
                whileHover={{ backgroundColor: '#FCFBFA' }}
                style={s.tableRow}
              >
                <div>
                  <div style={s.manuscriptTitle}>{post.title}</div>
                  <div style={s.manuscriptMeta}>{post.category || 'Editorial'} • {post.read_time}</div>
                </div>
                <div>
                  <span style={s.statusChip(post.status === 'published')}>{post.status}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#444' }}>{post.author_name || 'Anonymous'}</div>
                <div style={{ fontSize: '14px', color: '#888' }}>{new Date(post.created_at).toLocaleDateString()}</div>
                <div className="flex gap-4">
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
            .stats-row { grid-template-columns: 1fr !important; }
            .table-header, .table-row { grid-template-columns: 1fr 1fr 100px !important; }
            .manuscript-author, .manuscript-date { display: none; }
          }
        `}</style>
      </div>
    </PageTransition>
  );
}
