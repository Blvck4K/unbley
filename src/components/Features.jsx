import React from 'react';
import { Store, CreditCard, Globe, Smartphone, LayoutDashboard, Headphones } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Store size={24} />,
      title: 'Custom store website',
      description: 'A beautifully designed, fully functional e-commerce platform tailored perfectly to your brand.'
    },
    {
      icon: <CreditCard size={24} />,
      title: 'Payment integration',
      description: 'Secure, seamless payment gateways configured to process your sales globally with zero friction. And would be fully managed by you.'
    },
    {
      icon: <Globe size={24} />,
      title: 'Free domain (.store)',
      description: 'Establish your brand identity online immediately with a complimentary .store domain name included.'
    },
    {
      icon: <Smartphone size={24} />,
      title: 'Mobile-friendly design',
      description: 'Optimized shopping experiences across all devices, capturing customers wherever they browse.'
    },
    {
      icon: <LayoutDashboard size={24} />,
      title: 'Admin dashboard',
      description: 'A powerful, intuitive backend panel to manage your orders, inventory, and customers effortlessly.'
    },
    {
      icon: <Headphones size={24} />,
      title: 'Expert Support',
      description: 'Dedicated account managers and technical team to guide you through setup, deployment, and post-sale operations.'
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <div className="section-head">
          <h2>Value Built Into Every Setup</h2>
          <p className="text-secondary">Architecting a faster way to launch digital retail.</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="icon-wrapper">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
