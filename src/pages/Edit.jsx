import React, { useState } from 'react';
import { Search, Bell, Moon, LayoutGrid, Store, User, Settings, HeadphonesIcon, Camera, Globe, Link as LinkIcon, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FacebookIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.309h3.59l-.467 3.622h-3.123V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.408 0 22.675 0z" />
  </svg>
);
const TikTokIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);
const InstagramIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
const TwitterIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Edit() {
  const brandColor = '#06acf8ff';

  const [themeColors, setThemeColors] = useState({
    primary: '#0A0A0A',
    secondary: '#1A1A1A',
    accent: '#06acf8'
  });

  const s = {
    page: { backgroundColor: '#0A0A0A', color: '#E5E5E5', minHeight: '100vh', display: 'flex', fontFamily: '"Inter", sans-serif' },
    sidebar: { width: '280px', borderRight: '1px solid #1F1F1F', padding: '0', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    logoContainer: { padding: '60px 40px', display: 'flex', flexDirection: 'column' },
    logo: { fontFamily: '"Playfair Display", serif', fontSize: '18px', letterSpacing: '0.05em', color: brandColor, textTransform: 'uppercase' },
    nav: { padding: '0', flex: 1 },
    navItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 40px',
      color: active ? '#FFF' : '#888',
      backgroundColor: active ? '#111' : 'transparent',
      borderLeft: active ? `3px solid ${brandColor}` : '3px solid transparent',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: active ? '600' : '400',
      letterSpacing: '0.05em',
      transition: 'all 0.2s',
      textTransform: 'uppercase',
      textDecoration: 'none'
    }),
    userProfile: { padding: '24px 40px', borderTop: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#111' },
    userAvatar: { width: '40px', height: '40px', backgroundColor: '#333', overflow: 'hidden', borderRadius: '50%' },

    // Main Area
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' },

    // Custom Header for Edit Page
    editHeader: { padding: '60px 80px 40px', borderBottom: '1px solid #1F1F1F', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerTitle: { fontFamily: '"Playfair Display", serif', fontSize: '36px', color: '#FFF', fontWeight: 'bold' },
    headerSubtitle: { fontSize: '14px', color: '#888', marginTop: '12px', maxWidth: '500px', lineHeight: '1.6' },
    saveBtn: { backgroundColor: brandColor, color: '#000', padding: '16px 32px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', borderRadius: '4px', transition: 'background-color 0.2s' },

    content: { padding: '60px 80px', display: 'flex', flexDirection: 'column', gap: '40px' },

    // Layout Grid
    twoColLayout: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '40px' },

    // Components
    card: { backgroundColor: '#111', border: '1px solid #1F1F1F', padding: '40px', borderRadius: '8px' },
    cardTitle: { fontFamily: '"Playfair Display", serif', fontSize: '24px', color: '#FFF', marginBottom: '32px' },

    bannerBox: { position: 'relative', height: '300px', backgroundColor: '#1A1A1A', borderRadius: '8px', overflow: 'hidden', marginBottom: '40px', display: 'flex', alignItems: 'flex-end', padding: '24px', backgroundImage: 'linear-gradient(to right bottom, #112, #0A0A0A)' },
    bannerText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '72px', fontWeight: 'bold', color: 'rgba(255,255,255,0.05)', letterSpacing: '0.1em', pointerEvents: 'none' },
    bannerBtn: { backgroundColor: '#000', border: '1px solid #333', color: '#FFF', padding: '10px 20px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase' },
    bannerInfo: { marginLeft: 'auto', fontSize: '10px', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' },

    inputGroup: { marginBottom: '32px' },
    label: { display: 'block', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '16px' },
    input: { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #333', padding: '8px 0', color: '#FFF', fontSize: '16px', outline: 'none', transition: 'border-color 0.2s', '&:focus': { borderBottom: `1px solid ${brandColor}` } },
    textarea: { width: '100%', backgroundColor: '#0A0A0A', border: '1px solid #1F1F1F', padding: '20px', color: '#CCC', fontSize: '14px', outline: 'none', minHeight: '120px', resize: 'vertical', lineHeight: '1.6', borderRadius: '4px' },

    logoPreview: { width: '120px', height: '120px', backgroundColor: brandColor, margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px' },
    logoInitial: { fontFamily: '"Playfair Display", serif', fontSize: '48px', color: '#000', fontStyle: 'italic' },
    uploadBtn: { width: '100%', backgroundColor: 'transparent', border: '1px solid #333', color: '#888', padding: '16px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s', marginTop: '24px' },

    socialRow: { display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #1F1F1F', paddingBottom: '16px', marginBottom: '24px' },
    socialIcon: { color: '#666' },
    socialInputContainer: { flex: 1 },
    socialNetworkLabel: { fontSize: '10px', color: '#555', marginBottom: '4px', textTransform: 'lowercase' },
    socialInput: { width: '100%', background: 'transparent', border: 'none', color: '#FFF', fontSize: '14px', outline: 'none' },

    assistanceBox: { border: '1px solid #1F1F1F', backgroundColor: '#0D1110', padding: '32px', borderRadius: '8px' },
    assistanceTitle: { fontSize: '10px', fontWeight: '700', color: brandColor, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' },
    assistanceText: { color: '#888', fontSize: '12px', lineHeight: '1.6', marginBottom: '24px' },
    assistanceLink: { color: '#FFF', fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' },

    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginTop: '32px' },
    productSquare: { aspectRatio: '1', backgroundColor: '#111', border: '1px solid #1F1F1F', borderRadius: '8px', overflow: 'hidden', position: 'relative' },
    productImage: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 },
    productEmpty: { aspectRatio: '1', border: '1px dashed #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', cursor: 'pointer', transition: 'border-color 0.2s', '&:hover': { borderColor: '#666' } }
  };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.logoContainer}>
          <div style={s.logo}>Zizzystores.</div>
          <div style={{ fontFamily: 'Inter', fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', marginTop: '8px', textTransform: 'uppercase' }}>Digital Store</div>
        </div>

        <div style={s.nav}>
          <Link to="/dashboard" style={s.navItem(false)}><LayoutGrid size={16} /> Overview</Link>
          <Link to="/profile" style={s.navItem(false)}><User size={16} /> Profile</Link>
          <Link to="/edit" style={s.navItem(true)}><Settings size={16} /> Edit</Link>
          <div style={{ ...s.navItem(false), marginTop: '48px' }}><HeadphonesIcon size={16} /> Customer Service</div>
        </div>

        <div style={s.userProfile}>
          <div style={s.userAvatar}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Alex Zizzy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Alex Zizzy</div>
            <div style={{ fontSize: '10px', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>Principal Curator</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={s.main}>
        {/* Header Special for Edit Page */}
        <div style={s.editHeader}>
          <div>
            <h1 style={s.headerTitle}>Brand Profile</h1>
            <p style={s.headerSubtitle}>Curate your digital atelier. The narrative you build here defines the prestige of your collections.</p>
          </div>
          <button style={s.saveBtn}>Save Changes</button>
        </div>

        {/* Form Content Area */}
        <div style={s.content}>
          <div style={s.twoColLayout}>

            {/* Left Column: Core Identity */}
            <div>
              {/* Banner Upload */}
              <div style={s.bannerBox}>
                <div style={s.bannerText}>BRAND</div>
                <button style={s.bannerBtn}>Change Banner</button>
                <div style={s.bannerInfo}>Recommended: 2400x800px</div>
              </div>

              {/* Core Identity Form */}
              <div style={s.card}>
                <h2 style={s.cardTitle}>Core Identity</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 48px', marginBottom: '40px' }}>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Brand Name</label>
                    <input type="text" defaultValue="Zizzystores" style={s.input} />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Owner Name</label>
                    <input type="text" defaultValue="Alexander Zizzy" style={s.input} />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Email Address</label>
                    <input type="email" defaultValue="studio@zizzystores.com" style={s.input} />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Phone Number</label>
                    <input type="tel" defaultValue="+1 (555) 012-3456" style={s.input} />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>Delivery Duration</label>
                    <input type="tel" defaultValue="2-3 days" style={s.input} />
                  </div>
                </div>

                <div style={s.inputGroup}>
                  <label style={s.label}>Brand Narrative</label>
                  <textarea style={s.textarea} defaultValue="Zizzystores was founded on the principle of accessible luxury. We curate objects that tell a story of craftsmanship and enduring design, blending historical techniques with modern silhouettes." />
                </div>

                <div style={s.inputGroup}>
                  <label style={s.label}>Manifesto</label>
                  <textarea style={s.textarea} defaultValue='"To build is to breathe; to curate is to live. We reject the ephemeral for the eternal."' />
                </div>
              </div>

              {/* Geography Section */}
              <div style={{ ...s.card, marginTop: '40px' }}>
                <h2 style={s.cardTitle}>Geography & Location</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px 48px', marginBottom: '32px' }}>
                  <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                    <label style={s.label}>Country</label>
                    <input type="text" defaultValue="Nigeria" style={s.input} />
                  </div>
                  <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                    <label style={s.label}>State / Province</label>
                    <input type="text" defaultValue="Lagos" style={s.input} />
                  </div>
                  <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                    <label style={s.label}>City</label>
                    <input type="text" defaultValue="Ikeja" style={s.input} />
                  </div>
                  <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                    <label style={s.label}>Postal Code</label>
                    <input type="text" defaultValue="10021" style={s.input} />
                  </div>
                </div>

                <div style={s.inputGroup}>
                  <label style={s.label}>Address Line 1</label>
                  <input type="text" defaultValue="15 Zizzy Workspace" style={s.input} />
                </div>
                <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                  <label style={s.label}>Address Line 2 (Optional)</label>
                  <input type="text" placeholder="Suite, unit, etc." style={s.input} />
                </div>
              </div>

              {/* Store Theme Colors */}
              <div style={{ ...s.card, marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                  <h2 style={{ ...s.cardTitle, marginBottom: 0 }}>Brand Aesthetics</h2>
                  <div style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 'bold', border: '1px solid #F59E0B', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                    🔒 Can only be changed three times a year
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#888', marginBottom: '32px', lineHeight: '1.6' }}>
                  Define the chromatic signature of your storefront. Pick your 3 core brand colors using the gradient sliders below. Click the blocks to open the picker.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>

                  {/* Primary Background */}
                  <div>
                    <label style={s.label}>Primary Base</label>
                    <div style={{ position: 'relative', width: '100%', height: '80px', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', backgroundColor: themeColors.primary }}>
                      <input
                        type="color"
                        value={themeColors.primary}
                        onChange={(e) => setThemeColors({ ...themeColors, primary: e.target.value })}
                        style={{ position: 'absolute', opacity: 0, width: '200%', height: '200%', top: '-50%', left: '-50%', cursor: 'pointer' }}
                      />
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#FFF', pointerEvents: 'none' }}>{themeColors.primary.toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Secondary Card Color */}
                  <div>
                    <label style={s.label}>Surface / Cards</label>
                    <div style={{ position: 'relative', width: '100%', height: '80px', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', backgroundColor: themeColors.secondary }}>
                      <input
                        type="color"
                        value={themeColors.secondary}
                        onChange={(e) => setThemeColors({ ...themeColors, secondary: e.target.value })}
                        style={{ position: 'absolute', opacity: 0, width: '200%', height: '200%', top: '-50%', left: '-50%', cursor: 'pointer' }}
                      />
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#FFF', pointerEvents: 'none' }}>{themeColors.secondary.toUpperCase()}</div>
                    </div>
                  </div>

                  {/* Brand Accent */}
                  <div>
                    <label style={s.label}>Brand Accent</label>
                    <div style={{ position: 'relative', width: '100%', height: '80px', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', backgroundColor: themeColors.accent }}>
                      <input
                        type="color"
                        value={themeColors.accent}
                        onChange={(e) => setThemeColors({ ...themeColors, accent: e.target.value })}
                        style={{ position: 'absolute', opacity: 0, width: '200%', height: '200%', top: '-50%', left: '-50%', cursor: 'pointer' }}
                      />
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', color: '#FFF', pointerEvents: 'none' }}>{themeColors.accent.toUpperCase()}</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column: Assets & Social */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

              {/* Logo Upload Box */}
              <div style={s.card}>
                <label style={{ ...s.label, marginBottom: '40px' }}>Brand Logo</label>
                <div style={s.logoPreview}>
                  <span style={s.logoInitial}>Z</span>
                </div>
                <p style={{ fontSize: '10px', color: '#888', textAlign: 'center', lineHeight: '1.6', padding: '0 20px' }}>
                  Upload a high-resolution SVG or PNG. 1:1 ratio required.
                </p>
                <button style={s.uploadBtn}>Upload New Logo</button>
              </div>

              {/* Social Handles Box */}
              <div style={s.card}>
                <label style={{ ...s.label, marginBottom: '32px' }}>Social Handles</label>

                <div style={s.socialRow}>
                  <div style={s.socialIcon}><InstagramIcon /></div>
                  <div style={s.socialInputContainer}>
                    <div style={s.socialNetworkLabel}>instagram profile url</div>
                    <input type="text" defaultValue="https://instagram.com/zizzystores" style={s.socialInput} />
                  </div>
                </div>

                <div style={s.socialRow}>
                  <div style={s.socialIcon}><TwitterIcon /></div>
                  <div style={s.socialInputContainer}>
                    <div style={s.socialNetworkLabel}>x (twitter) profile url</div>
                    <input type="text" defaultValue="https://x.com/zizzystores" style={s.socialInput} />
                  </div>
                </div>

                <div style={s.socialRow}>
                  <div style={s.socialIcon}><FacebookIcon /></div>
                  <div style={s.socialInputContainer}>
                    <div style={s.socialNetworkLabel}>facebook page url</div>
                    <input type="text" defaultValue="https://facebook.com/zizzystores" style={s.socialInput} />
                  </div>
                </div>

                <div style={s.socialRow}>
                  <div style={s.socialIcon}><TikTokIcon /></div>
                  <div style={s.socialInputContainer}>
                    <div style={s.socialNetworkLabel}>tiktok profile url</div>
                    <input type="text" defaultValue="https://tiktok.com/@zizzystores" style={s.socialInput} />
                  </div>
                </div>

                <div style={{ ...s.socialRow, borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                  <div style={s.socialIcon}><LinkIcon size={14} /></div>
                  <div style={s.socialInputContainer}>
                    <div style={s.socialNetworkLabel}>website</div>
                    <input type="text" defaultValue="www.zizzystores.com" style={s.socialInput} />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div style={s.card}>
                <h2 style={{ ...s.cardTitle, marginBottom: '24px' }}>Payout Details</h2>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '32px', lineHeight: '1.6' }}>Select the bank account where your sales revenue will be deposited automatically.</div>

                <div style={s.inputGroup}>
                  <label style={s.label}>Bank Name</label>
                  <input type="text" defaultValue="Guaranty Trust Bank" style={s.input} />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.label}>Account Number</label>
                  <input type="text" defaultValue="0123456789" style={s.input} />
                </div>
                <div style={{ ...s.inputGroup, marginBottom: 0 }}>
                  <label style={s.label}>Account Name</label>
                  <input type="text" defaultValue="Zizzy Wears" style={s.input} />
                </div>
              </div>

              {/* Assistance Box */}
              <div style={s.assistanceBox}>
                <div style={s.assistanceTitle}>Need Assistance?</div>
                <p style={s.assistanceText}>
                  Our concierge team can help you personalize your brand narrative or assist with high-fidelity asset uploads.
                </p>
                <a href="#" style={s.assistanceLink}>Speak with a Curator <ArrowRight size={14} color={brandColor} /></a>
              </div>

            </div>
          </div>

          {/* Bottom Area: Product Showcase */}
          <div>
            <div style={{ borderTop: '1px solid #1F1F1F', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', color: '#FFF', marginBottom: '8px' }}>Product Showcase</h2>
                <p style={{ fontSize: '12px', color: '#888' }}>Select 4 primary items for your landing gallery.</p>
              </div>

            </div>

            <div style={s.productGrid}>
              <div style={s.productSquare}>
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" alt="Product 1" style={{ ...s.productImage, mixBlendMode: 'luminosity' }} />
              </div>
              <div style={s.productSquare}>
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" alt="Product 2" style={{ ...s.productImage, mixBlendMode: 'luminosity' }} />
              </div>
              <div style={s.productSquare}>
                <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80" alt="Product 3" style={{ ...s.productImage, mixBlendMode: 'luminosity' }} />
              </div>
              <div style={s.productEmpty}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={16} color="#000000" />
                </div>
                <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#888888', textTransform: 'uppercase' }}>Select Item</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
