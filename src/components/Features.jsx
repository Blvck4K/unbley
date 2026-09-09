import React from 'react';
import { Store, CreditCard, Globe, Smartphone, LayoutDashboard, Search, MessageCircle, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    {
      icon: <Store size={24} />,
      title: 'Professional Storefront',
      description: 'Create a beautiful online store that makes your brand look credible and gives customers a simple way to browse and buy.'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Secure Payment Integration',
      description: 'Accept online payments through trusted payment providers and give your customers a smooth checkout experience.'
    },
    {
      icon: <Globe size={24} />,
      title: 'Custom Domain',
      description: 'Give your business a professional identity with your own domain name instead of relying only on social media.'
    },
    {
      icon: <Smartphone size={24} />,
      title: 'Product & Inventory Management',
      description: 'Add products, manage stock, update prices and keep your store organized from one simple dashboard.'
    },
    {
      icon: <LayoutDashboard size={24} />,
      title: 'Mobile-First Shopping',
      description: 'Your store is optimized for customers shopping from phones, tablets and other devices.'
    },
    {
      icon: <Headphones size={24} />,
      title: 'Business Dashboard',
      description: 'Manage your products, orders, customers and store settings from one centralized dashboard.'
    },
    {
      icon: <Search size={24} />,
      title: 'Built-In SEO',
      description: "Help customers discover your products through search engines with tools designed to improve your store's visibility."
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'WhatsApp-Friendly Selling',
      description: 'Connect your online store with the way many customers already communicate and shop - WhatsApp.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="features-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-head"
        >
          <h2>Everything You Need to Sell Online</h2>
          <p className="text-secondary">From your first product to your next big sale, Unbley gives your business the infrastructure to grow online.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
              className="feature-card"
            >
              <div className="icon-wrapper">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

