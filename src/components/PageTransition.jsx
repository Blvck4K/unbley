import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.1, 0.25, 1.0] // Custom cubic-bezier for a more premium feel
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
