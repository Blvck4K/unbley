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
          style={{ textAlign: window.innerWidth <= 768 ? 'center' : 'left' }}
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
            style={{ fontSize: window.innerWidth <= 768 ? '36px' : '56px' }}
          >
            Launch Your Brand Online <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.6em', marginTop: '8px' }}>in Less Than 24 Hours.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="hero-subtitle"
            style={{ margin: window.innerWidth <= 768 ? '0 auto 40px' : '0 0 40px' }}
          >
            Get a high-performance storefront and your own custom domain for just ₦30,000. No technical skills required.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex gap-4"
            style={{ justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start' }}
          >
            {user ? (
              <Link to="/dashboard" style={{ textDecoration: 'none', width: window.innerWidth <= 768 ? '100%' : 'auto' }}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary"
                  style={{ padding: '18px 36px', fontSize: '16px', fontWeight: '700', width: '100%', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                >
                  <LayoutGrid size={20} /> Go to Dashboard <ArrowRight size={18} />
                </motion.button>
              </Link>
            ) : (
              <Link to="/auth" style={{ textDecoration: 'none', width: window.innerWidth <= 768 ? '100%' : 'auto' }}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary"
                  style={{ padding: '18px 36px', fontSize: '16px', fontWeight: '700', width: '100%', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)' }}
                >
                  Start Your Journey <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </motion.button>
              </Link>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: window.innerWidth <= 768 ? 'center' : 'flex-start' }}
          >
            <div className="flex items-center gap-2" style={{ fontSize: '14px', fontWeight: '800', color: '#E11D48' }}>
              <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}>🔥 40% OFF ends soon!</motion.span>
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span><strong>₦30,000</strong> (First Year) — Full Setup Included</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border-color)' }}
          >
            <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Trusted Security Partners
            </div>
            <div className="flex items-center gap-10" style={{ flexWrap: 'wrap', justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', opacity: 1 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png" alt="Paystack" style={{ height: '55px', width: 'auto' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', opacity: 1 }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flutterwave_Logo.png/1280px-Flutterwave_Logo.png" alt="Flutterwave" style={{ height: '40px', width: 'auto' }} />
              </div>
              <div style={{ fontWeight: '800', fontSize: '18px', color: '#000', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8 }}>
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
          style={{ marginTop: window.innerWidth <= 768 ? '60px' : '0', position: 'relative' }}
        >
          <div className="dashboard-mockup" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'none', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15)' }}>
            <img src="https://raw.githubusercontent.com/Blvck4K/Jss-png/refs/heads/main/replace.png" alt="Dashboard Preview" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-lg)', display: 'block' }} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            style={{
              backgroundColor: 'var(--bg-white)',
              padding: '16px 24px',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '-30px',
              marginLeft: window.innerWidth <= 768 ? 'auto' : '-40px',
              marginRight: window.innerWidth <= 768 ? 'auto' : '0',
              position: 'relative',
              zIndex: 10,
              border: '1px solid var(--border-color)',
              transform: window.innerWidth <= 768 ? 'none' : 'none',
              maxWidth: 'fit-content'
            }}
          >
            <div style={{ width: '40px', height: '40px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={24} color="#10B981" />
            </div>
            <div>
              <div className="font-bold" style={{ fontSize: '14px' }}>Free Domain Name</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>Fully automated setup</div>
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

