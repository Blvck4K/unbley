import React, { useState } from 'react';
import { ChevronDown, Music2 } from 'lucide-react';
import { FaInstagram, FaXTwitter } from 'react-icons/fa6';
import StoreAttribution from './StoreAttribution';
import { getContrastColor, getReadableMutedColor } from '../lib/colors';

export default function StoreFooter({ brand = {}, theme }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const pageBackground = theme?.primaryColor || '#FAFAFA';
  const surfaceBackground = theme?.secondaryColor || '#FFFFFF';
  const accentColor = theme?.accentColor || '#6A3E1F';
  const borderColor = theme?.borderColor || 'rgba(34, 21, 16, 0.1)';
  const pageText = getContrastColor(pageBackground);
  const surfaceText = getContrastColor(surfaceBackground);
  const surfaceMuted = getReadableMutedColor(surfaceBackground);
  const footerText = surfaceText;
  const footerMuted = surfaceMuted;
  const brandName = brand.brand_name || 'Digital Atelier';
  const toggleCard = (card) => setExpandedCard((current) => current === card ? null : card);

  const infoCards = [
    {
      id: 'refund',
      badge: 'Refund Policy',
      title: 'Returns and refunds',
      content: brand.refund_policy || 'The store owner has not added a refund policy yet. Please contact the store for assistance.'
    },
    {
      id: 'shipping',
      badge: 'Shipping Policy',
      title: 'Delivery information',
      content: brand.shipping_policy || 'The store owner has not added a shipping policy yet. Delivery details will be confirmed at checkout.'
    }
  ];

  const contactDetails = [
    brand.phone_number && { href: `tel:${brand.phone_number}`, label: brand.phone_number },
    brand.email_address && { href: `mailto:${brand.email_address}`, label: brand.email_address },
    brand.website_url && {
      href: brand.website_url.startsWith('http') ? brand.website_url : `https://${brand.website_url}`,
      label: brand.website_url
    }
  ].filter(Boolean);

  return (
    <>
      <section
        className="store-shared-info-section"
        style={{ backgroundColor: pageBackground, color: pageText, borderTop: `1px solid ${borderColor}` }}
      >
        <div className="store-shared-info-grid">
          {infoCards.map((card) => (
            <div
              className="store-shared-info-card"
              key={card.id}
              style={{ backgroundColor: surfaceBackground, borderColor }}
            >
              <button
                type="button"
                aria-expanded={expandedCard === card.id}
                onClick={() => toggleCard(card.id)}
                className="store-shared-info-toggle"
                style={{ color: surfaceText }}
              >
                <span>
                  <span className="store-shared-info-badge" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>{card.badge}</span>
                  <strong>{card.title}</strong>
                </span>
                <ChevronDown size={18} style={{ transform: expandedCard === card.id ? 'rotate(180deg)' : 'none' }} />
              </button>
              {expandedCard === card.id && <p style={{ color: surfaceMuted }}>{card.content}</p>}
            </div>
          ))}

          <div className="store-shared-info-card" style={{ backgroundColor: surfaceBackground, borderColor }}>
            <button
              type="button"
              aria-expanded={expandedCard === 'contact'}
              onClick={() => toggleCard('contact')}
              className="store-shared-info-toggle"
              style={{ color: surfaceText }}
            >
              <span>
                <span className="store-shared-info-badge" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>Contact</span>
                <strong>We&apos;re here to help</strong>
              </span>
              <ChevronDown size={18} style={{ transform: expandedCard === 'contact' ? 'rotate(180deg)' : 'none' }} />
            </button>
            {expandedCard === 'contact' && (
              <div className="store-shared-contact-list">
                {contactDetails.length > 0 ? contactDetails.map((item) => (
                  <a key={item.href} href={item.href} style={{ color: surfaceText }}>{item.label}</a>
                )) : <span style={{ color: surfaceMuted }}>Customer support details will appear here.</span>}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="store-shared-footer" style={{ backgroundColor: surfaceBackground, color: footerText, borderTopColor: borderColor }}>
        <div className="store-shared-footer-top">
          <div className="store-shared-footer-brand">
            {brand.logo_url && (
              <img
                className="store-shared-footer-brand-image"
                src={brand.logo_url}
                alt={`${brandName} logo`}
              />
            )}
            <div className="store-shared-footer-logo" style={{ color: accentColor }}>{brandName}</div>
            <p style={{ color: footerMuted }}>{brand.manifesto || 'A considered collection, presented with care.'}</p>
          </div>
          <div className="store-shared-footer-menus">
            <div className="store-shared-footer-column">
              <strong style={{ color: footerText }}>Social Footprint</strong>
              <div className="store-shared-socials">
                {brand.instagram_url && <a href={brand.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" style={{ color: footerMuted }}><FaInstagram size={18} /></a>}
                {brand.twitter_url && <a href={brand.twitter_url} target="_blank" rel="noreferrer" aria-label="X / Twitter" title="X / Twitter" style={{ color: footerMuted }}><FaXTwitter size={18} /></a>}
                {brand.tiktok_url && <a href={brand.tiktok_url} target="_blank" rel="noreferrer" aria-label="TikTok" title="TikTok" style={{ color: footerMuted }}><Music2 size={18} /></a>}
                {!brand.instagram_url && !brand.twitter_url && !brand.tiktok_url && <span style={{ color: footerMuted }}>Follow updates from {brandName}.</span>}
              </div>
            </div>
            <div className="store-shared-footer-newsletter">
              <strong style={{ color: footerText }}>The Insider Newsletter</strong>
              <div className="store-shared-footer-newsletter-row" style={{ borderBottomColor: borderColor }}>
                <input type="email" placeholder="EMAIL ADDRESS" aria-label="Email address" style={{ color: footerText }} />
                <button type="button" style={{ color: accentColor }}>JOIN THE CIRCLE</button>
              </div>
            </div>
          </div>
        </div>
        <div className="store-shared-footer-bottom" style={{ borderTopColor: borderColor }}>
          <span style={{ color: footerMuted }}>© {new Date().getFullYear()} {brandName}.</span>
          <StoreAttribution color={footerMuted} />
        </div>
      </footer>
    </>
  );
}
