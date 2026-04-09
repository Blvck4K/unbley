import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export default function Hero() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, x: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }
    }
  };

  return (
    <section className="hero">
      <div className="container hero-content">
        <motion.div
          className="hero-text"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: '#F3F4F6', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '24px', letterSpacing: '0.05em', color: 'var(--primary)' }}
          >
            PREMIUM E-COMMERCE PLATFORM
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="hero-title"
          >
            Launch Your Brand Online <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.6em', marginTop: '8px' }}>in Less Than 24 Hours.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="hero-subtitle"
          >
            Get a high-performance storefront and your own custom domain for just ₦30,000. No technical skills required.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="hero-actions"
          >
            {user ? (
              <Link to="/dashboard" className="hero-btn-wrapper">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary hero-btn"
                >
                  <LayoutGrid size={20} /> Go to Dashboard <ArrowRight size={18} />
                </motion.button>
              </Link>
            ) : (
              <Link to="/auth" className="hero-btn-wrapper">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary hero-btn"
                >
                  Start Your Journey <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </motion.button>
              </Link>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="hero-promo"
          >
            <div className="promo-item urgent">
              <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}>🔥 40% OFF ends soon!</motion.span>
            </div>
            <div className="promo-item">
              <CheckCircle2 size={16} color="#10B981" />
              <span><strong>₦30,000</strong> (First Year) — Full Setup Included</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="hero-partners"
          >
            <div className="partners-label">
              Trusted Security Partners
            </div>
            <div className="partners-list">
              <div className="partner-logo">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png" alt="Paystack" />
              </div>
              <div className="partner-logo">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flutterwave_Logo.png/1280px-Flutterwave_Logo.png" alt="Flutterwave" />
              </div>
              <div className="partner-logo ssl">
                <ShieldCheck size={22} color="#10B981" />
                SSL secured
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="dashboard-mockup" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'none', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15)' }}>
            <img src="https://raw.githubusercontent.com/Blvck4K/Jss-png/refs/heads/main/replace.png" alt="Dashboard Preview" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', display: 'block' }} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="floating-badge"
          >
            <div className="badge-icon">
              <CheckCircle2 size={24} color="#10B981" />
            </div>
            <div>
              <div className="badge-title">Free Domain Name</div>
              <div className="badge-subtitle">Fully automated setup</div>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '-20px', right: '-20px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#09A5DB22', zIndex: -1 }}
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ position: 'absolute', bottom: '40px', left: '-30px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#10B98111', zIndex: -1 }}
          />
        </motion.div>
      </div>
    </section>
  );
}

