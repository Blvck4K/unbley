import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Reviews from './components/Reviews';
import HowItWorks from './components/HowItWorks';
import Packages from './components/Packages';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import { MessageCircle } from 'lucide-react';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Reviews />
      <Packages />
      <FAQ />
      <CTASection />
      <Footer />
      <div 
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          backgroundColor: '#089cff',
          color: 'white',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          zIndex: 1000,
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={32} />
      </div>
    </>
  );
}

export default App;
