import React from 'react';
import { Store, CreditCard, Globe, Smartphone, LayoutDashboard, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    { icon: <Store size={24} />, title: 'Your Own Online Store', description: 'Create a professional storefront for your business where customers can discover your products, place orders, and shop online.' },
    { icon: <CreditCard size={24} />, title: 'Secure Online Payments', description: 'Accept customer payments through trusted payment providers like Paystack and Flutterwave, giving your customers a simple and secure checkout experience.' },
    { icon: <Smartphone size={24} />, title: 'Built for Nigerian Businesses', description: 'Start selling online without worrying about complicated website development. Unbley is designed to make online selling easier for businesses in Nigeria.' },
    { icon: <LayoutDashboard size={24} />, title: 'Easy Store Management', description: 'Add products, update prices, manage your inventory, view orders, and keep your online store organized from one place.' },
    { icon: <Landmark size={24} />, title: 'Automatic Merchant Payouts', description: 'Once an order is successfully completed, your earnings are processed and sent automatically to your registered bank account within 24 hours.' },
    { icon: <Globe size={24} />, title: 'Custom Domain', description: 'Give your business a more professional identity with the option to connect your own custom domain to your Unbley store.' }
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
    <section className="features-section" id="solutions">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="section-head"
        >
          <h2>Everything You Need to Sell Online</h2>
          <p className="text-secondary">From setting up your store to receiving payments and managing orders, Unbley brings the essential tools for running your online business into one simple platform.</p>
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

