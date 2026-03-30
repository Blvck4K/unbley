import React from 'react';
import { Star } from 'lucide-react';

export default function Reviews() {
  const reviews = [
    { name: 'Sarah L.', brand: 'Fashion Forward', text: 'ZizzyStores made getting our boutique online incredibly easy. The 40% discount was a lifesaver and the site looks premium.' },
    { name: 'Michael T.', brand: 'Tech Haven', text: 'I was amazed by how fast my electronics store was launched. Full stack and domain included perfectly as promised.' },
    { name: 'Jessica O.', brand: 'Beauty Bliss', text: 'The expert support really walked me through the process. My sales have doubled since moving to the new custom platform.' },
    { name: 'David W.', brand: 'Auto Parts Pro', text: 'Highly recommended. Secure, fast, and exactly what my business needed. They took care of the domain hassle completely.' },
    { name: 'Amaka C.', brand: 'Amaka Threads', text: 'I paid ₦50,000 and the value I received is honestly worth ten times that. Best decision for my fashion business.' },
  ];

  return (
    <section className="reviews-section" style={{ padding: '80px 0', backgroundColor: 'var(--bg-light)', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>What Our Clients Say</h2>
          <p className="text-secondary">Join hundreds of successful brand owners who trust ZizzyStores.</p>
        </div>
      </div>
      
      <div className="reviews-scroll-container">
        <div className="reviews-track">
          {reviews.map((review, i) => (
             <div key={i} className="review-card">
               <div className="flex gap-1" style={{ color: '#F59E0B', marginBottom: '16px' }}>
                 {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
               </div>
               <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '24px', flex: 1, color: 'var(--text-secondary)' }}>"{review.text}"</p>
               <div>
                 <div className="font-bold">{review.name}</div>
                 <div className="text-muted" style={{ fontSize: '12px', fontWeight: 'bold' }}>{review.brand}</div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
