import React from 'react';
import { CreditCard, Hammer, Rocket } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <CreditCard size={28} color="white" />,
      title: 'Pay & Submit Details',
      description: 'Make your discounted first-year payment and fill out a quick form with your brand details and preferences.'
    },
    {
      icon: <Hammer size={28} color="white" />,
      title: 'We Build Your Store',
      description: 'Our expert team registers your domain and perfectly builds your custom e-commerce platform within 24 hours.'
    },
    {
      icon: <Rocket size={28} color="white" />,
      title: 'You Start Selling',
      description: 'You get full admin access. Add your products, set your prices, and launch your brand to the world immediately.'
    }
  ];

  return (
    <section className="how-it-works-section" style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>How It Works</h2>
          <p className="text-secondary">Three simple steps to launch your digital storefront.</p>
        </div>

        <div className="grid grid-cols-3 gap-8" style={{ position: 'relative', marginTop: '40px' }}>

          {steps.map((step, i) => (
            <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '24px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--bg-dark)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 10px 25px -3px rgba(0,0,0,0.1)'
              }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{i + 1}. {step.title}</h3>
              <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', fontSize: '14px' }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
