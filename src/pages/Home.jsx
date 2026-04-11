import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import HowItWorks from '../components/HowItWorks';
import Packages from '../components/Packages';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { MessageCircle } from 'lucide-react';

export default function Home() {
  return (
    <>
      <SEO 
        title="ZizzyStores | Launch Your Professional Online Store in 5 Minutes"
        description="The easiest way to create an online store in Nigeria and beyond. Launch your boutique brand with a professional storefront for only ₦30,000 / $30 for the first year."
      />
      <PageTransition>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Reviews />
      <Packages />
      <FAQ />
      <CTASection />
      <Footer />

    </PageTransition>
    </>
  );
}

