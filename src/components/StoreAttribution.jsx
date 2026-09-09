import React from 'react';

export default function StoreAttribution({ color = 'inherit', style = {} }) {
  return (
    <div style={{ color, fontSize: '11px', letterSpacing: '0.04em', textAlign: 'center', ...style }}>
      <span>POWERED BY UNBLEY | Get your store online at </span>
      <a
        href="https://unbley.com"
        target="_blank"
        rel="noreferrer"
        style={{ color: 'inherit', fontWeight: '700', textDecoration: 'underline' }}
      >
        unbley.com
      </a>
    </div>
  );
}
