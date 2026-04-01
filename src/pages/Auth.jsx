import React, { useState } from 'react';
import { ArrowLeft, Search, ShoppingBag, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [authMode, setAuthMode] = useState('signup'); // 'signin' | 'signup'
  const [userType, setUserType] = useState('brand'); // 'customer' | 'brand'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: userType,
              phone: userType === 'brand' ? phone : null,
              category: userType === 'brand' ? category : null
            }
          }
        });
        if (error) throw error;
        navigate(userType === 'customer' ? '/store' : '/dashboard');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        const role = data?.user?.user_metadata?.role;
        navigate(role === 'customer' ? '/store' : '/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };
  const brandColor = '#06acf8ff';

  // Styles replicating the minimalist dark aesthetic from "Noir Registry"
  const s = {
    page: { backgroundColor: '#0A0A0A', color: '#E5E5E5', minHeight: '100vh', display: 'flex', fontFamily: '"Inter", sans-serif' },
    sidebar: { width: '280px', borderRight: '1px solid #1F1F1F', padding: '60px 40px', display: 'flex', flexDirection: 'column' },
    main: { flex: 1, padding: '80px', display: 'flex', justifyContent: 'center' },
    content: { maxWidth: '580px', width: '100%' },
    title: { fontFamily: '"Playfair Display", "Times New Roman", serif', fontStyle: 'italic', fontSize: '48px', fontWeight: '400', color: '#FFFFFF', marginBottom: '16px', letterSpacing: '-0.02em' },
    subtitle: { color: '#888888', fontSize: '14px', lineHeight: '1.6', marginBottom: '64px' },
    sectionLabel: { fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', color: brandColor, marginTop: '48px', marginBottom: '32px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' },
    inputGroup: { marginBottom: '32px' },
    label: { display: 'block', fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: '#666666', textTransform: 'uppercase', marginBottom: '12px' },
    input: { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #333333', padding: '4px 0 16px', color: '#CCCCCC', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', '&:focus': { borderBottom: `1px solid ${brandColor}` } },
    button: { width: '100%', padding: '16px', backgroundColor: brandColor, color: '#000000', fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', marginTop: '48px', transition: 'background-color 0.2s' },
    toggleGroup: { display: 'flex', gap: '32px', marginBottom: '64px', borderBottom: '1px solid #1F1F1F' },
    toggleButton: (isActive) => ({ padding: '12px 0', border: 'none', background: 'transparent', color: isActive ? '#FFFFFF' : '#666666', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: isActive ? `2px solid ${brandColor}` : '2px solid transparent', cursor: 'pointer', marginBottom: '-1px', transition: 'all 0.2s' })
  };

  return (
    <div style={s.page}>
      <style>{`
        @media (max-width: 768px) {
          .auth-main { padding: 32px 24px !important; }
          .auth-title { font-size: 36px !important; }
          .auth-type-row { flex-direction: column !important; gap: 16px !important; }
          .auth-form-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .auth-toggle-group { gap: 16px !important; overflow-x: auto; }
          .auth-google-apple { flex-direction: column !important; }
          .auth-sidebar { display: none !important; }
          .auth-quote-box { display: none !important; }
        }
      `}</style>
      {/* Left Sidebar Layout */}
      <div style={s.sidebar} className="auth-sidebar text-left">
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', letterSpacing: '0.05em', color: brandColor, marginBottom: '80px', textTransform: 'uppercase' }}>
          Zizzystores.
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '500', color: '#E5E5E5', marginBottom: '16px', lineHeight: '1.4' }}>Accelerate your digital retail.</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888' }}><CheckCircle2 size={12} color={brandColor} /> Launch in 24 hours</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888' }}><CheckCircle2 size={12} color={brandColor} /> Trusted by 100+ brands</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888' }}><CheckCircle2 size={12} color={brandColor} /> Zero hidden fees</li>
            </ul>
          </div>
        </div>

        <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666', textTransform: 'uppercase', marginBottom: '32px' }}>
          Navigation
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Link to="/" style={{ color: '#888', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'color 0.2s' }}>
            <ArrowLeft size={16} /> Return Homepage
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={s.main} className="auth-main">
        <div style={s.content}>
          <div style={s.toggleGroup} className="auth-toggle-group">
            <button style={s.toggleButton(authMode === 'signin')} onClick={() => setAuthMode('signin')}>MEMBER ACCESS</button>
            <button style={s.toggleButton(authMode === 'signup')} onClick={() => setAuthMode('signup')}>GAIN ACCESS</button>
          </div>

          <form onSubmit={handleAuth}>
            {errorMsg && (
              <div style={{ padding: '12px', backgroundColor: 'rgba(255, 0, 0, 0.1)', color: '#ff4444', fontSize: '12px', marginBottom: '24px', border: '1px solid #ff4444', borderRadius: '4px' }}>
                {errorMsg}
              </div>
            )}
            {authMode === 'signup' ? (
              <>
                <h1 style={s.title}>Create Account</h1>
                <p style={{ ...s.subtitle, marginBottom: '24px' }}>
                  Create your account to launch and manage your online store.
                </p>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: brandColor, fontWeight: '600' }}>
                    <CheckCircle2 size={14} /> Set up your store in 24 hours
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: brandColor, fontWeight: '600' }}>
                    <CheckCircle2 size={14} /> Free domain included
                  </div>
                </div>

                <div style={s.sectionLabel}>
                  <div style={{ width: '2px', height: '14px', backgroundColor: brandColor }}></div>
                  ACCOUNT TYPE
                </div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }} className="auth-type-row">
                  <button
                    type="button"
                    style={{ flex: 1, padding: '20px', backgroundColor: userType === 'brand' ? '#111' : 'transparent', border: '1px solid', borderColor: userType === 'brand' ? '#333' : '#1F1F1F', color: userType === 'brand' ? '#FFF' : '#666', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}
                    onClick={() => setUserType('brand')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', letterSpacing: '0.02em' }}>
                      <Search size={16} color={userType === 'brand' ? '#FFF' : '#666'} /> Brand Owner
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', fontWeight: '400' }}>Create and manage your store</div>
                  </button>
                  <button
                    type="button"
                    style={{ flex: 1, padding: '20px', backgroundColor: userType === 'customer' ? '#111' : 'transparent', border: '1px solid', borderColor: userType === 'customer' ? '#333' : '#1F1F1F', color: userType === 'customer' ? '#FFF' : '#666', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s' }}
                    onClick={() => setUserType('customer')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', letterSpacing: '0.02em' }}>
                      <ShoppingBag size={16} color={userType === 'customer' ? '#FFF' : '#666'} /> Customer Account
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', fontWeight: '400' }}>Shop and interact with brands</div>
                  </button>
                </div>

                <div style={s.sectionLabel}>
                  <div style={{ width: '2px', height: '14px', backgroundColor: brandColor }}></div>
                  CREDENTIALS & DETAILS
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px' }} className="auth-form-grid">
                  <div style={s.inputGroup}>
                    <label style={s.label}>{userType === 'brand' ? 'BUSINESS NAME' : 'FULL NAME'}</label>
                    <input type="text" placeholder={userType === 'brand' ? 'e.g. Zizzy W3ars' : 'e.g. John Doe'} style={s.input} value={name} onChange={(e) => setName(e.target.value)} required={authMode === 'signup'} />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={s.label}>EMAIL ADDRESS</label>
                    <input type="email" placeholder="johndoe@gmail.com" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  {userType === 'brand' && (
                    <>
                      <div style={s.inputGroup}>
                        <label style={s.label}>PHONE NUMBER</label>
                        <input type="tel" placeholder="+1 (000) 000-0000" style={s.input} value={phone} onChange={(e) => setPhone(e.target.value)} required />
                      </div>
                      <div style={s.inputGroup}>
                        <label style={s.label}>BRAND CATEGORY</label>
                        <input type="text" placeholder="Fashion, Digital, Home" style={s.input} value={category} onChange={(e) => setCategory(e.target.value)} required />
                      </div>
                    </>
                  )}
                  <div style={s.inputGroup}>
                    <label style={s.label}>CREATE PASSWORD</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" style={s.input} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 0, top: '6px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{ ...s.button, opacity: loading ? 0.7 : 1 }}>{loading ? 'PROCESSING...' : (userType === 'brand' ? 'JOIN AS BRAND OWNER' : 'CREATE ACCOUNT')}</button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0 24px' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#1F1F1F' }}></div>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666' }}>OR CONTINUE WITH</div>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#1F1F1F' }}></div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }} className="auth-google-apple">
                  <button type="button" style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #333', color: '#FFF', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Google
                  </button>
                  <button type="button" style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #333', color: '#FFF', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFF"><path d="M16.82 2.76c.71-.85 1.18-2.04 1.05-3.23-.97.04-2.14.65-2.85 1.51-.62.75-1.18 2.01-1.01 3.16 1.08.08 2.1-.55 2.81-1.44zM18.89 19.34c0-.1 0-.17-.07-.27-1.89-3.25-1.62-5.91-.07-7.23-1.6-1.55-3.66-1.63-4.36-1.63-1.92 0-3.62 1.34-4.59 1.34-.94 0-2.31-1.14-3.8-1.14-1.99 0-3.9 1.16-4.94 3-.98 1.7-1.44 3.75-1.44 6.16 0 2.22.42 4.16.89 5.35.84 2.15 1.96 4.3 3.65 4.3 1.63 0 2.31-1.03 4.32-1.03s2.61 1.03 4.36 1.03c1.78 0 2.77-1.78 3.52-3.11.95-1.63 1.37-3.09 1.4-3.16z" /></svg>
                    Apple
                  </button>
                </div>

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '13px', color: '#888' }}>
                  Already have an account? <span style={{ color: brandColor, fontWeight: '600', cursor: 'pointer', borderBottom: `1px solid ${brandColor}` }} onClick={(e) => { e.preventDefault(); setAuthMode('signin'); }}>Sign in</span>
                </div>
              </>
            ) : (
              <>
                <h1 style={s.title}>Sign In</h1>
                <p style={s.subtitle}>
                  Access your personalized dashboard. Enter your credentials to proceed to your management interface.
                </p>

                <div style={s.inputGroup}>
                  <label style={s.label}>EMAIL ADDRESS</label>
                  <input type="email" placeholder="johndoe@gmail.com" style={s.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.label}>PASSWORD</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" style={s.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 0, top: '6px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{ ...s.button, marginTop: '40px', opacity: loading ? 0.7 : 1 }}>{loading ? 'AUTHENTICATING...' : 'Welcome Back'}</button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0 24px' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#1F1F1F' }}></div>
                  <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#666' }}>OR CONTINUE WITH</div>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#1F1F1F' }}></div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }} className="auth-google-apple">
                  <button type="button" style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid #333', color: '#FFF', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Google
                  </button>
                  <button type="button" style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1px solid #333', color: '#FFF', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFF"><path d="M16.82 2.76c.71-.85 1.18-2.04 1.05-3.23-.97.04-2.14.65-2.85 1.51-.62.75-1.18 2.01-1.01 3.16 1.08.08 2.1-.55 2.81-1.44zM18.89 19.34c0-.1 0-.17-.07-.27-1.89-3.25-1.62-5.91-.07-7.23-1.6-1.55-3.66-1.63-4.36-1.63-1.92 0-3.62 1.34-4.59 1.34-.94 0-2.31-1.14-3.8-1.14-1.99 0-3.9 1.16-4.94 3-.98 1.7-1.44 3.75-1.44 6.16 0 2.22.42 4.16.89 5.35.84 2.15 1.96 4.3 3.65 4.3 1.63 0 2.31-1.03 4.32-1.03s2.61 1.03 4.36 1.03c1.78 0 2.77-1.78 3.52-3.11.95-1.63 1.37-3.09 1.4-3.16z" /></svg>
                    Apple
                  </button>
                </div>

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '13px', color: '#888' }}>
                  Don't have an account? <span style={{ color: brandColor, fontWeight: '600', cursor: 'pointer', borderBottom: `1px solid ${brandColor}` }} onClick={(e) => { e.preventDefault(); setAuthMode('signup'); }}>Create one</span>
                </div>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Right Side Quote Box - Only visible on extremely wide desktop screens to anchor the design */}
      <div className="auth-quote-box" style={{ width: '400px', backgroundColor: '#070707', borderLeft: '1px solid #1F1F1F', padding: '80px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ padding: '60px 40px', border: '1px solid #1F1F1F', backgroundColor: '#0C0C0C' }}>
          <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '24px', lineHeight: '1.5', color: '#E5E5E5', marginBottom: '32px' }}>
            "Your brand is what people say about you when you're not in the room.<br />This highlights that branding isn't just what you tell the world; it’s the gut feeling or "vibe" the world has about your work."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <div style={{ width: '12px', height: '1px', backgroundColor: '#666' }}></div>
            JEFF BEZOS
          </div>
        </div>
      </div>

    </div>
  );
}
