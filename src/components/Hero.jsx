import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, LayoutGrid, BarChart3, ShoppingBag, CircleDollarSign, Globe, Smartphone, Package, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const typedWords = ['Store', 'Brand', 'Studio'];
const partnerItems = [
  <img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png" alt="Paystack" />,
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flutterwave_Logo.png/1280px-Flutterwave_Logo.png" alt="Flutterwave" />,
  <span className="partner-text-logo"><ShieldCheck size={20} color="#10B981" /> SSL Secured</span>,
  <span className="partner-text-logo"><Globe size={20} color="#8D5B36" /> Custom Domain</span>,
  <span className="partner-text-logo"><Smartphone size={20} color="#8D5B36" /> Mobile Ready</span>,
  <span className="partner-text-logo"><Package size={20} color="#8D5B36" /> Product Management</span>,
  <span className="partner-text-logo"><ShoppingBag size={20} color="#8D5B36" /> Online Storefront</span>,
  <span className="partner-text-logo"><MessageCircle size={20} color="#25D366" /> WhatsApp-Friendly</span>,
  <span className="partner-text-logo"><CheckCircle2 size={20} color="#10B981" /> Easy to Manage</span>
];

export default function Hero() {
  const { user } = useAuth();
  const [wordIndex, setWordIndex] = useState(0);
  const [displayWord, setDisplayWord] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typedWords[wordIndex];
    let timeout;

    if (!isDeleting && displayWord === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 1400);
    } else if (!isDeleting && displayWord.length < currentWord.length) {
      timeout = setTimeout(() => setDisplayWord(currentWord.slice(0, displayWord.length + 1)), 105);
    } else if (isDeleting && displayWord.length > 0) {
      timeout = setTimeout(() => setDisplayWord(displayWord.slice(0, -1)), 65);
    } else {
      timeout = setTimeout(() => {
        setWordIndex((index) => (index + 1) % typedWords.length);
        setIsDeleting(false);
      }, 260);
    }

    return () => clearTimeout(timeout);
  }, [displayWord, isDeleting, wordIndex]);

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
            className="hero-badge"
          >
            <ShieldCheck size={14} /> PREMIUM ECOMMERCE PLATFORM
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="hero-title"
          >
            Build Your <span className="hero-typing-word">{displayWord}</span><span className="hero-typing-cursor" aria-hidden="true" />. Sell Online. Grow Your Business.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="hero-subtitle"
          >
            Unbley gives businesses everything they need to create a professional online store, accept payments, manage orders, and sell to customers online — without needing to build a website from scratch.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="hero-actions"
          >
            {user ? (
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary hero-btn"
                >
                  <LayoutGrid size={20} /> Go to Dashboard <ArrowRight size={18} />
                </motion.button>
              </Link>
            ) : (
              <Link to="/auth">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary hero-btn"
                >
                    Start Selling Now <ArrowRight size={18} />
                </motion.button>
              </Link>
            )}
            <a href="#solutions" className="btn btn-outline hero-btn">Explore Features</a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="hero-promo"
          >
            <div className="promo-item">
              <CheckCircle2 size={18} color="#10B981" />
                <span>Built for ambitious brands. Simple enough for anyone.</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="hero-partners"
          >
            <div className="partners-label">Trusted partners and store essentials</div>
            <div className="partners-marquee" aria-label="Trusted partners and store capabilities">
              <div className="partners-list">
                {[...partnerItems, ...partnerItems].map((item, index) => (
                  <div className="partner-logo" key={index}>{item}</div>
                ))}
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
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="dashboard-mockup">
              <div className="mockup-toolbar">
                <span className="mockup-live"><span /> Live store</span>
                <span className="mockup-period">Last 30 days</span>
              </div>
              <img
                src="https://raw.githubusercontent.com/Blvck4K/Jss-png/refs/heads/main/hero(2).png"
                alt="Unbley store dashboard preview"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="floating-badge"
            >
              <div className="badge-icon">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div className="badge-title">Store is ready</div>
                <div className="badge-subtitle">unbley.top is connected</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="hero-metric-card"
            >
              <div className="metric-card-icon"><BarChart3 size={17} /></div>
              <div><strong>+28.4%</strong><span>weekly store growth</span></div>
            </motion.div>

            <div className="hero-activity-card">
              <div className="activity-heading"><span>Recent activity</span><span className="activity-live">Live</span></div>
              <div className="activity-row"><span className="activity-icon orders"><ShoppingBag size={14} /></span><span><strong>New order</strong><small>2 minutes ago</small></span><b>+₦48,000</b></div>
              <div className="activity-row"><span className="activity-icon revenue"><CircleDollarSign size={14} /></span><span><strong>Revenue updated</strong><small>18 minutes ago</small></span><b>+₦19,500</b></div>
            </div>

          {/* Decorative elements */}
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)', zIndex: -1 }}
          />
        </motion.div>
      </div>
    </section>
  );
}

