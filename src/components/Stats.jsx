import React from 'react';

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="grid grid-cols-4 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="stat-item"><div className="stat-value">Professional</div><div className="stat-label">Online Store</div></div>
          <div className="stat-item"><div className="stat-value">Secure</div><div className="stat-label">Payments</div></div>
          <div className="stat-item"><div className="stat-value">Custom</div><div className="stat-label">Domain</div></div>
          <div className="stat-item"><div className="stat-value">Built for</div><div className="stat-label">Mobile</div></div>
        </div>
        <p className="text-secondary text-center" style={{ marginTop: '24px' }}>Everything your brand needs to start selling online.</p>
      </div>
    </section>
  );
}
