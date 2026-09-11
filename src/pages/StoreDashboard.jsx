import React, { useEffect, useState } from 'react';
import { ArrowRight, Image as ImageIcon, ShoppingBag } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import PageTransition from '../components/PageTransition';
import StoreAttribution from '../components/StoreAttribution';
import { getStoreFont } from '../lib/storeFonts';
import { getContrastColor } from '../lib/colors';

const titleCase = (value) => String(value || '').replace(/[-_]/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());

export default function StoreDashboard() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.id === id;
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isMobile = viewportWidth < 640;

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    async function fetchStoreDashboard() {
      if (!id) return;
      try {
        const [{ data: brandData, error: brandError }, { data: productData, error: productError }] = await Promise.all([
          supabase.from('brand_profiles').select('*').eq('id', id).maybeSingle(),
          supabase.from('products').select('*').eq('brand_id', id).order('created_at', { ascending: false })
        ]);
        if (brandError) throw brandError;
        if (productError) throw productError;
        if (!brandData) throw new Error('Brand not found.');
        const isBusinessStore = Boolean(
          brandData.plan_id === 'business' &&
          brandData.plan_ends_at &&
          new Date(brandData.plan_ends_at) > new Date()
        );
        if (!isBusinessStore) {
          navigate(`/shop-brand/${id}?view=products`, { replace: true });
          return;
        }
        setBrand(brandData);
        setProducts(productData || []);
      } catch (fetchError) {
        console.error('Error loading store dashboard:', fetchError);
        setError(fetchError.message || 'Unable to load this store.');
      } finally {
        setLoading(false);
      }
    }

    fetchStoreDashboard();
  }, [id, navigate]);

  const bannerUrls = [brand?.banner_url, brand?.banner_url_2, brand?.banner_url_3, brand?.banner_url_4].filter(Boolean);
  const bannerCount = bannerUrls.length;
  const bannerSignature = bannerUrls.join('|');

  useEffect(() => {
    setActiveBannerIndex(0);
    if (bannerCount < 2) return undefined;

    const interval = setInterval(() => {
      setActiveBannerIndex((current) => (current + 1) % bannerCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerCount, bannerSignature]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0A0A0A', color: '#FFF' }}>Loading store...</div>;
  if (error || !brand) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0A0A0A', color: '#FFF' }}>{error || 'Store not found.'}</div>;

  const primaryColor = brand.primary_color || '#0A0A0A';
  const secondaryColor = brand.secondary_color || '#1A1A1A';
  const accentColor = brand.accent_color || '#06acf8';
  const selectedFont = getStoreFont(brand.store_font);
  const brandNameFont = getStoreFont(brand.brand_name_font || brand.store_font);
  const textColor = '#FFFFFF';
  const mutedColor = 'rgba(255,255,255,0.72)';
  const accentTextColor = getContrastColor(accentColor);
  const banner = bannerUrls[activeBannerIndex];

  const categoryMap = new Map();
  products.forEach((product) => {
    const image = product.image_url?.split(',')[0];
    const entries = [
      product.gender && { key: `gender:${product.gender}`, label: titleCase(product.gender), eyebrow: 'Shop by gender' },
      product.product_type && { key: `type:${product.product_type}`, label: titleCase(product.product_type), eyebrow: 'Shop by type' }
    ].filter(Boolean);

    entries.forEach((entry) => {
      if (!categoryMap.has(entry.key)) categoryMap.set(entry.key, { ...entry, product });
      else if (!categoryMap.get(entry.key).product.image_url && image) categoryMap.set(entry.key, { ...entry, product });
    });
  });
  const categories = [...categoryMap.values()];
  const genderCategories = categories.filter((category) => category.key.startsWith('gender:'));
  const productTypeCategories = categories.filter((category) => category.key.startsWith('type:'));

  const openCategory = (category) => {
    const search = category.key.startsWith('type:')
      ? `?view=products&productType=${encodeURIComponent(category.key.slice(5))}`
      : `?view=products&gender=${encodeURIComponent(category.key.slice(7))}`;
    navigate(`/shop-brand/${id}${search}`);
  };

  const renderCategoryCard = (category) => {
    const image = category.product.image_url?.split(',')[0];
    return (
      <motion.button
        key={category.key}
        type="button"
        onClick={() => openCategory(category)}
        whileHover={isMobile ? undefined : { y: -6, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        aria-label={`Shop ${category.label}`}
        style={{ position: 'relative', width: '100%', aspectRatio: '16 / 7', minHeight: '180px', padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', background: secondaryColor, color: textColor, textAlign: 'left', cursor: 'pointer', boxShadow: '0 10px 24px rgba(0,0,0,0.12)' }}
      >
        {image ? <motion.img src={image} alt={category.label} whileHover={isMobile ? undefined : { scale: 1.08 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.62 }} /> : <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}><ImageIcon size={38} color={mutedColor} /></div>}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 25%, rgba(0,0,0,0.82) 100%)' }} />
        <div style={{ position: 'absolute', right: 18, bottom: 18, left: 18 }}>
          <span style={{ color: accentColor, fontSize: '10px', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{category.eyebrow}</span>
          <strong style={{ display: 'block', marginTop: '7px', fontSize: '25px' }}>{category.label}</strong>
        </div>
      </motion.button>
    );
  };

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', backgroundColor: primaryColor, color: textColor, fontFamily: selectedFont.family, overflowX: 'hidden' }}>
        <header style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minHeight: isMobile ? '76px' : '88px', padding: isMobile ? '14px 20px' : '18px 6vw', borderBottom: '1px solid rgba(255,255,255,0.18)', backgroundColor: 'rgba(0,0,0,0.12)', backdropFilter: 'blur(14px)' }}>
          {isOwner && <button type="button" onClick={() => navigate('/dashboard')} style={{ position: 'absolute', left: isMobile ? '20px' : '6vw', padding: '9px 12px', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '4px', background: 'transparent', color: textColor, fontFamily: 'inherit', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>Back to Dashboard</button>}
          <button type="button" onClick={() => navigate(`/shop-brand/${id}?view=products`)} aria-label="View all products" style={{ position: 'absolute', top: '50%', left: '50%', width: isMobile ? '60px' : '68px', height: isMobile ? '60px' : '68px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, transform: 'translate(-50%, -50%)', border: 'none', background: 'transparent', color: textColor, fontFamily: 'inherit', cursor: 'pointer' }}>
            {brand.logo_url ? <img src={brand.logo_url} alt={`${brand.brand_name} logo`} style={{ width: isMobile ? '52px' : '58px', height: isMobile ? '52px' : '58px', borderRadius: '50%', objectFit: 'cover', boxShadow: `0 0 0 4px ${primaryColor}` }} /> : <ShoppingBag size={isMobile ? 32 : 36} color={accentColor} />}
          </button>
        </header>

        <section style={{ position: 'relative', minHeight: isMobile ? '58vh' : '52vh', display: 'grid', placeItems: 'center', padding: isMobile ? '56px 24px' : '64px 7vw', backgroundColor: secondaryColor, overflow: 'hidden' }}>
          {banner ? <motion.img key={banner} initial={{ opacity: 0 }} animate={{ opacity: 0.48 }} transition={{ duration: 1.2 }} src={banner} alt="Store banner" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})` }} />}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 14px', color: accentColor, fontSize: '11px', fontWeight: '800', letterSpacing: '0.14em', textTransform: 'uppercase' }}>The collection</p>
            <h1 style={{ margin: 0, fontFamily: brandNameFont.family, fontSize: isMobile ? 'clamp(34px, 11vw, 52px)' : 'clamp(36px, 7vw, 76px)', lineHeight: 1.05, fontWeight: '800', textShadow: '0 4px 18px rgba(0,0,0,0.45)' }}>{brand.brand_name || 'Our Store'}</h1>
            {brand.brand_narrative && <p style={{ maxWidth: '560px', margin: '20px auto 0', color: textColor, fontSize: isMobile ? '13px' : '16px', lineHeight: 1.65, textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}>{brand.brand_narrative}</p>}
          </div>
        </section>

        <main style={{ maxWidth: '1320px', margin: '0 auto', padding: isMobile ? '48px 20px 64px' : '72px 6vw 96px' }}>
          <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'flex-end', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: isMobile ? '18px' : '24px', marginBottom: isMobile ? '34px' : '28px', flexWrap: 'wrap' }}>
            <div style={{ width: isMobile ? '100%' : 'auto', textAlign: isMobile ? 'center' : 'left' }}>
              <p style={{ margin: 0, color: accentColor, fontFamily: selectedFont.family, fontSize: '11px', fontWeight: '800', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Explore the collection</p>
              <h2 style={{ margin: '10px 0 0', fontFamily: selectedFont.family, fontSize: isMobile ? '32px' : 'clamp(28px, 4vw, 46px)', lineHeight: 1.08 }}>Shop by category</h2>
            </div>
            {!isMobile && (
              <motion.button type="button" whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(`/shop-brand/${id}?view=products`)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px 16px', border: `1px solid ${accentColor}`, borderRadius: '5px', background: accentColor, color: accentTextColor, fontFamily: 'inherit', fontWeight: '700', cursor: 'pointer', width: 'auto', boxShadow: `0 8px 20px ${accentColor}33` }}>
                Shop all <ArrowRight size={15} />
              </motion.button>
            )}
          </div>

          {categories.length === 0 ? (
            <div style={{ padding: '48px 24px', border: '1px dashed rgba(255,255,255,0.3)', color: mutedColor, textAlign: 'center' }}>Categories will appear here as products are added.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '36px' : '44px' }}>
              {genderCategories.length > 0 && (
                <section>
                  <h3 style={{ margin: '0 0 18px', fontFamily: selectedFont.family, fontSize: '18px', color: textColor, textAlign: isMobile ? 'center' : 'left' }}>Shop by Gender</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '18px' }}>
                    {genderCategories.map((category, index) => (
                      <motion.div key={category.key} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.08 }}>
                        {renderCategoryCard(category)}
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}
              {productTypeCategories.length > 0 && (
                <section>
                  <h3 style={{ margin: '0 0 18px', fontFamily: selectedFont.family, fontSize: '18px', color: textColor, textAlign: isMobile ? 'center' : 'left' }}>Shop by Product Type</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '18px' }}>
                    {productTypeCategories.map((category, index) => (
                      <motion.div key={category.key} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.08 }}>
                        {renderCategoryCard(category)}
                      </motion.div>
                    ))}
                  </div>
                  {isMobile && (
                    <motion.button type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(`/shop-brand/${id}?view=products`)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginTop: '24px', padding: '13px 16px', border: `1px solid ${accentColor}`, borderRadius: '5px', background: accentColor, color: accentTextColor, fontFamily: 'inherit', fontWeight: '700', cursor: 'pointer', boxShadow: `0 8px 20px ${accentColor}33` }}>
                      Shop all <ArrowRight size={15} />
                    </motion.button>
                  )}
                </section>
              )}
              {isMobile && productTypeCategories.length === 0 && (
                <motion.button type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(`/shop-brand/${id}?view=products`)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '13px 16px', border: `1px solid ${accentColor}`, borderRadius: '5px', background: accentColor, color: accentTextColor, fontFamily: 'inherit', fontWeight: '700', cursor: 'pointer', boxShadow: `0 8px 20px ${accentColor}33` }}>
                  Shop all <ArrowRight size={15} />
                </motion.button>
              )}
            </div>
          )}
        </main>

        <footer style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '20px', padding: isMobile ? '24px 20px' : '24px 6vw', borderTop: '1px solid rgba(255,255,255,0.18)', color: mutedColor, fontSize: '12px' }}>
          <span>{brand.manifesto || brand.brand_name}</span>
          <StoreAttribution color={mutedColor} />
        </footer>
      </div>
    </PageTransition>
  );
}
