import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import HowItWorks from '../components/HowItWorks';
import CTASection from '../components/CTASection';
import { Palette, Share2, Sparkles, Layout, Settings, Rocket, CreditCard, Hammer } from 'lucide-react';
import SEO from '../components/SEO';

export default function CreatorPlatform() {
  const features = [
    {
      icon: <Palette size={24} />,
      title: "Your Brand, Your Identity",
      description: "Your store should feel like your brand. Create a storefront that gives your products the presentation and identity they deserve."
    },
    {
      icon: <Share2 size={24} />,
      title: "Your Own Online Store",
      description: "Give your audience a dedicated place to discover your products, learn about your brand, and place orders directly online."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Simple, Secure Payments",
      description: "Accept payments from your customers through trusted payment providers and give them a smooth checkout experience."
    },
    {
      icon: <Layout size={24} />,
      title: "Powerful Brand Dashboard",
      description: "Manage your products, orders, store information, and other important parts of your online business from one centralized dashboard."
    },
    {
      icon: <Settings size={24} />,
      title: "Grow With Your Brand",
      description: "Start with the essentials and build your online presence as your business grows. Connect a custom domain when you're ready to give your brand an even more professional identity."
    },
    {
      icon: <Rocket size={24} />,
      title: "Launch Without the Technical Headache",
      description: "You shouldn't need to be a developer to start selling online. Unbley makes setting up your store simple so you can spend more time creating and growing your business."
    }
  ];

  return (
    <>
      <SEO 
        title="Ecommerce for Creators & Creative Brands"
        description="Build a professional online store for your creative brand. Unbley helps artisans, designers, and creative entrepreneurs sell online and grow their business."
        keywords="ecommerce for creators, creative brand platform, launch online store, artist shop platform, boutique ecommerce builder"
        canonical="https://unbley.com/creator-platform"
      />
      
      <Navbar />
      <PageTransition>
        <main style={{ paddingTop: '100px' }}>
          <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', marginBottom: '64px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '40px', backgroundColor: 'var(--accent-soft)', color: 'var(--primary)', fontWeight: '600', marginBottom: '24px' }}>
                  <Sparkles size={18} />
                  <span>The Future of Creative Commerce</span>
                </div>
                <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', lineHeight: '1.2' }}>
                  Turn Your Creativity Into a Business
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                  Unbley gives creators the tools to build a professional online store, showcase what they create, accept payments, manage orders, and sell directly to their customers — all from one platform.
                </p>
                <a href="/auth?mode=signup" className="btn btn-primary" style={{ padding: '12px 32px' }}>Build Your Brand Now</a>
              </div>
            </div>
          </section>

          <section id="creator-features" style={{ padding: '100px 0' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Designed for Creators Who Mean Business</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Powerful tools to help you turn your creative work into a professional brand.</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px 32px' }}>
                {features.map((feature, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '20px', 
                      backgroundColor: 'white', 
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '24px',
                      margin: '0 auto 24px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'
                    }}>
                      {feature.icon}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>{feature.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <HowItWorks
            title="Start Selling Without the Technical Headache"
            subtitle="Three simple steps to take your creative business online."
            steps={[
              { icon: <CreditCard size={28} color="white" />, title: 'Create Your Store', description: 'Sign up for Unbley, provide your business details, and add the products you want to sell.' },
              { icon: <Hammer size={28} color="white" />, title: 'Build Your Brand', description: 'Customize your storefront, add your products, configure your payment options, and make your store feel like your brand.' },
              { icon: <Rocket size={28} color="white" />, title: 'Start Selling', description: 'Share your store with your audience, accept orders, and start building your business online.' }
            ]}
          />

          <section style={{ padding: '100px 0', backgroundColor: 'var(--bg-dark)', color: 'white' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '32px', color: '#FDFBF7' }}>Your Creativity Deserves a Business Behind It</h2>
                <p style={{ fontSize: '18px', opacity: 0.8, marginBottom: '40px', color: '#D4C8BE' }}>
                  You already have something worth creating. Unbley gives you the tools to turn that creativity into a professional online business.
                </p>
                <a href="/auth?mode=signup" className="btn btn-primary" style={{ padding: '12px 32px' }}>Build Your Brand Now</a>
              </div>
            </div>
          </section>
          
          <CTASection />
        </main>
        
        <Footer />
      </PageTransition>
    </>
  );
}
