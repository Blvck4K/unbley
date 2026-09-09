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
        title="Unbley | Build Your Professional Online Store"
        description="Unbley helps Nigerian businesses build professional online stores, manage products and orders, accept payments and sell online."
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

