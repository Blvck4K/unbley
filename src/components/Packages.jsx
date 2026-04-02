import React from 'react';
import { ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function Packages() {
  const packages = [
    {
      name: 'Gate Keepers',
      tag: 'E-COMMERCE • FASHION',
      price: '₦30,000',
      oldPrice: '₦50,000',
      metrics: { rev: 'Custom Design', age: 'Domain + Hosting' }
    },
    {
      name: 'Smokywurld',
      tag: 'E-COMMERCE • WOMEN FASHION',
      price: '₦30,000',
      oldPrice: '₦50,000',
      metrics: { rev: 'Payment Gateway', age: 'Inventory System' }
    },
    {
      name: 'M3thod',
      tag: 'E-COMMERCE • FASHION',
      price: '₦30,000',
      oldPrice: '₦50,000',
      metrics: { rev: 'Instant Delivery', age: 'Secure Checkouts' }
    }
  ];

  return (
    <section className="packages-section" id="solutions">
      <div className="container">
        <div className="flex justify-between items-center" style={{ marginBottom: '48px', flexDirection: window.innerWidth <= 768 ? 'column' : 'row', textAlign: window.innerWidth <= 768 ? 'center' : 'left', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Brands Of the Month</h2>
            <p className="text-secondary" style={{ fontSize: '14px' }}>Premium Stores enjoying active growth via ZizzyStores.</p>
          </div>
          <a href="#all" className="font-bold flex items-center gap-2" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            View All Brands <ArrowRight size={16} />
          </a>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <div key={i} className="package-card">
              <div className="package-img">
                <ShoppingBag size={48} opacity={0.2} />
              </div>
              <div className="package-content">
                <div className="flex justify-between items-start" style={{ marginBottom: '16px' }}>
                  <div>
                    <h3>{pkg.name}</h3>
                    <p className="text-muted" style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.05em' }}>{pkg.tag}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                    <CheckCircle2 size={25} strokeWidth={3} />
                  </div>
                </div>

                <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                  <div className="package-price">{pkg.price}</div>
                  <div className="text-muted" style={{ textDecoration: 'line-through', fontSize: '14px' }}>{pkg.oldPrice}</div>
                </div>



                <button className="btn btn-outline" style={{ width: '100%', marginTop: '24px' }}>Shop Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
