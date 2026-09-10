import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import HomeContentSections from '../components/HomeContentSections';
import Reviews from '../components/Reviews';
import HowItWorks from '../components/HowItWorks';
import Packages from '../components/Packages';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO 
        title="Unbley | Online Store Builder for Nigerian Businesses"
        description="Launch a professional online store in Nigeria with Unbley. Sell products online, manage orders, accept payments, and grow your ecommerce brand with an easy storefront platform."
        keywords="online store in Nigeria, ecommerce platform for small businesses, Shopify alternative in Nigeria, ecommerce website builder, sell products online Nigeria"
        canonical="https://unbley.com/"
      />
      <Navbar />
      <PageTransition>
      <Hero />
      <Stats />
      <Features />
      <HomeContentSections />
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

