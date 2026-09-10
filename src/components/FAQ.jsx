import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    { q: 'Do I need coding knowledge?', a: 'No. Unbley is built to make setting up and managing your online store simple, even if you have no technical background.' },
    { q: 'Do I get my own website?', a: 'Yes. Your business gets its own online storefront where customers can browse your products and place orders.' },
    { q: 'Can I use my own domain?', a: 'Yes. Unbley supports custom domains so your store can have a professional web address that matches your brand.' },
    { q: 'Can I manage my products and orders?', a: 'Yes. Your dashboard lets you manage products, inventory, orders, customers and other important store settings.' },
    { q: 'Can customers pay online?', a: 'Yes. Unbley supports payment integrations that allow customers to complete purchases online.' },
    { q: 'When will my earnings reach my bank?', a: <>Payments from your completed orders are securely processed by Unbley and automatically sent to your <strong>registered bank account within 24 hours</strong>. No manual withdrawal is required.</> },
    { q: 'Can I sell from Nigeria?', a: 'Yes. Unbley is designed with Nigerian businesses and the local ecommerce environment in mind.' },
    { q: 'Can I manage my store from my phone?', a: 'Yes. Your store and management experience are designed to work across modern mobile devices.' },
    { q: 'What happens after I create my store?', a: 'You can add your products, configure your store, connect the necessary services and start sharing your store with customers.' }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section" id="faq" style={{ padding: '80px 0', backgroundColor: 'var(--bg-white)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Frequently Asked Questions</h2>
          <p className="text-secondary">Everything you need to know about building and managing your online store.</p>
        </div>

        <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item" style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: window.innerWidth <= 768 ? '16px 20px' : '24px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: '800', fontSize: window.innerWidth <= 768 ? '14px' : '16px', color: 'var(--bg-dark)' }}
              >
                {faq.q}
                {openIndex === i ? <ChevronUp size={18} className="text-muted" /> : <ChevronDown size={18} className="text-muted" />}
              </button>
              {openIndex === i && (
                <div style={{ padding: '0 24px 24px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
