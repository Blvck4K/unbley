import React from 'react';
import { CreditCard, Hammer, Rocket } from 'lucide-react';

export default function HowItWorks({ title = 'Start Selling Without the Technical Headache', subtitle = 'Three simple steps to take your business online.', steps: customSteps }) {
  const steps = [
    {
      icon: <CreditCard size={28} color="white" />,
      title: 'Create Your Store',
      description: 'Provide your business details, choose your store setup and add your products.'
    },
    {
      icon: <Hammer size={28} color="white" />,
      title: 'Customize Your Brand',
      description: 'Set up your storefront, domain, products, payments and other business details.'
    },
    {
      icon: <Rocket size={28} color="white" />,
      title: 'Start Selling',
      description: 'Share your store with customers and start accepting orders online.'
    }
  ];

  return (
    <section className="how-it-works-section" style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>{title}</h2>
          <p className="text-secondary">{subtitle}</p>
        </div>

        <div className="grid grid-cols-3 gap-8" style={{ position: 'relative', marginTop: '40px' }}>

          {(customSteps || steps).map((step, i) => (
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
