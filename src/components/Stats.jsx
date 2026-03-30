import React from 'react';

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="grid grid-cols-4 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="stat-item">
            <div className="stat-value">₦50M+</div>
            <div className="stat-label">Total Volume Sold</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">12,000+</div>
            <div className="stat-label">Verified Stores</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">98%</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">4.9/5</div>
            <div className="stat-label">Founder Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
