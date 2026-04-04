import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: 'Do I own my website?',
      a: 'Yes, absolutely. You retain 100% ownership of your website and your custom domain name for this year. We simply handle the heavy lifting of building and launching it.'
    },
    {
      q: 'Can I connect payment gateways?',
      a: 'Yes! We have already seamlessly integrate local gateways like Paystack and Flutterwave, so you can receive payments securely and directly with no percentage taken from your sales.'
    },
    {
      q: 'How long does setup take?',
      a: 'We pride ourselves on lightning-fast delivery. Your entire e-commerce store and domain will be fully set up and ready to accept orders within 24 hours of payment.'
    },
    {
      q: 'Can I manage it myself?',
      a: 'Yes, your store comes with a beautifully customized, user-friendly admin dashboard. You will be able to easily add products, track inventory, process orders, and manage customers effortlessly.'
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-section" id="faq" style={{ padding: '80px 0', backgroundColor: 'var(--bg-white)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>Frequently Asked Questions</h2>
          <p className="text-secondary">Everything you need to know about getting your brand online.</p>
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
