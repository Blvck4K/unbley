import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Star, Plus, Minus, Truck, ShieldCheck, ArrowRight, ArrowLeft, User, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import PageTransition from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [qty, setQty] = useState(1);
  const { user } = useAuth();
  const isOwner = user?.id === brand?.id;
  const isCustomer = user?.user_metadata?.role === 'customer' || user?.user_metadata?.userType === 'customer';
  const [cartCount, setCartCount] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [editForm, setEditForm] = useState({
    title: '',
    price: '',
    description: '',
    tag: '',
    imageFile: null,
    imagePreview: null
  });

  // Scroll to top on load/URL change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((total, item) => total + item.qty, 0);
        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    };
    
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    async function fetchProductData() {
      if (!id) {
        setLoading(false);
        setError("Invalid URL context. Specific asset tag missing.");
        return;
      }
      try {
        setLoading(true);
        // 1. Fetch exact product
        const { data: pData, error: pError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (pError || !pData) throw pError || new Error("Asset not found");
        setProduct(pData);

        // 2. Fetch specific brand styles based on the product's owner
        const { data: bData, error: bError } = await supabase
          .from('brand_profiles')
          .select('*')
          .eq('id', pData.brand_id)
          .single();

        if (bError) throw bError;
        setBrand(bData);

        // 3. Fetch related catalog assets
        const { data: rData, error: rError } = await supabase
          .from('products')
          .select('*')
          .eq('brand_id', pData.brand_id)
          .neq('id', id)
          .limit(4);

        if (!rError) setRelatedProducts(rData || []);

      } catch (err) {
        console.error("Failed fetching digital asset details:", err);
        setError("This digital asset is not currently active.");
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    try {
      let existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Enforce Dedicated Single-Brand Cart Rule
      if (existingCart.length > 0 && existingCart[0].brand_id !== brand.id) {
        const strictOverride = window.confirm("Your cart holds assets from another creator. Adding this will replace your current cart. Proceed?");
        if (!strictOverride) return;
        existingCart = []; // Wipe it clear for the new dedicated brand
      }

      const existingItemIndex = existingCart.findIndex(i => i.id === product.id);
      
      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].qty += qty;
      } else {
        existingCart.push({
          id: product.id,
          name: product.title,
          variant: product.tag || 'Standard Edition',
          price: product.price,
          qty: qty,
          img: product.image_url,
          brand_id: brand.id
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Give feedback but don't force them out
      const userRes = window.confirm(`${qty}x ${product.title} deployed to your secure Cart. Do you wish to checkout immediately?`);
      if (userRes) navigate('/cart');
      
    } catch(err) {
      console.error('Cart Failure:', err);
      alert('Failed to connect to cart matrix.');
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    try {
      let existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Enforce Dedicated Single-Brand Cart Rule
      if (existingCart.length > 0 && existingCart[0].brand_id !== brand.id) {
        const strictOverride = window.confirm("Your cart holds assets from another creator. Checking out this asset will clear your pending items. Proceed?");
        if (!strictOverride) return;
        existingCart = [];
      }

      const existingItemIndex = existingCart.findIndex(i => i.id === product.id);
      
      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].qty += qty;
      } else {
        existingCart.push({
          id: product.id,
          name: product.title,
          variant: product.tag || 'Standard Edition',
          price: product.price,
          qty: qty,
          img: product.image_url,
          brand_id: brand.id
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      window.dispatchEvent(new Event('cartUpdated'));
      navigate('/cart');
    } catch(err) {
      console.error(err);
    }
  };

  const handleEditClick = () => {
    setEditForm({
      title: product.title,
      price: product.price,
      description: product.description || '',
      tag: product.tag || '',
      imageFile: null,
      imagePreview: product.image_url
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    setUploading(true);
    try {
      let imageUrl = editForm.imagePreview;
      if (editForm.imageFile) {
        const fileExt = editForm.imageFile.name.split('.').pop();
        const fileName = `${brand.id}-product-${Math.random()}.${fileExt}`;
        const filePath = `${brand.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('brand-assets').upload(filePath, editForm.imageFile);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('brand-assets').getPublicUrl(filePath);
        imageUrl = publicData.publicUrl;
      }

      const { error: updateError } = await supabase.from('products').update({
        title: editForm.title,
        price: parseFloat(editForm.price) || 0,
        description: editForm.description,
        tag: editForm.tag,
        image_url: imageUrl
      }).eq('id', product.id).eq('brand_id', brand.id);

      if (updateError) throw updateError;
      
      setProduct({ ...product, title: editForm.title, price: editForm.price, description: editForm.description, tag: editForm.tag, image_url: imageUrl });
      setIsEditModalOpen(false);
      alert('Asset Updated Successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating asset.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async () => {
    console.log('Delete attempt:', { productId: product.id, userId: user?.id, brandId: brand?.id, isOwner });

    if (!isOwner) {
      console.error('Deletion rejected: User is not authorized.');
      return;
    }
    
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this product? This act is irreversible.");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', product.id).eq('brand_id', brand.id);
      if (error) throw error;
      
      console.log('Product deleted successfully from DB');
      alert('Asset neutralized.');
      navigate(`/shop-brand/${brand.id}`);
    } catch (err) {
      console.error('Deletion failed:', err);
      alert('Deletion failed: ' + err.message);
    }
  };

  const handleImageSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setEditForm(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A', color: '#FFF' }}>Syncing Asset Data...</div>;
  if (error) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A', color: '#FFF' }}><h2>{error}</h2><button onClick={() => navigate(-1)} style={{ marginLeft: '16px', padding: '8px', cursor: 'pointer' }}>Go Back</button></div>;
  if (!product || !brand) return null;

  // Exact Theme Match for Seamless Transition from ShopBrand
  const primaryColor = brand.primary_color || '#0A0A0A';
  const secondaryColor = brand.secondary_color || '#1A1A1A';
  const accentColor = brand.accent_color || '#06acf8';
  
  const textColor = '#FDFDFD';
  const mutedColor = '#999';
  const borderColor = secondaryColor;

  const fontConfig = {
    heading: '"Playfair Display", serif',
    body: '"Inter", sans-serif'
  };

  const s = {
    page: { backgroundColor: primaryColor, color: textColor, minHeight: '100vh', fontFamily: fontConfig.body, overflowX: 'hidden' },

    // Header Matcher
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: `1px solid ${borderColor}`, backgroundColor: 'transparent', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' },
    logo: { fontFamily: fontConfig.heading, fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.05em', color: accentColor, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'uppercase' },
    logoImage: { height: '32px', width: '32px', borderRadius: '50%', objectFit: 'cover' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '24px' },
    iconButton: { cursor: 'pointer', display: 'flex', alignItems: 'center', color: textColor, transition: 'color 0.2s', '&:hover': { color: accentColor } },

    contentWrap: { padding: '48px 80px', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '80px' },
    heroLayout: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '64px' },

    // Image Core
    imageGallery: { display: 'flex', flexDirection: 'column', gap: '16px' },
    mainImageWrap: { width: '100%', height: '600px', backgroundColor: secondaryColor, overflow: 'hidden', borderRadius: '8px', border: `1px solid ${borderColor}`, position: 'relative' },
    mainImage: { width: '100%', height: '100%', objectFit: 'cover' },

    editBtn: { padding: '12px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF', borderRadius: '4px', zIndex: 20, border: '1px solid #333', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { backgroundColor: accentColor, color: '#000' } },
    deleteBtn: { padding: '12px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF', borderRadius: '4px', zIndex: 20, border: '1px solid #333', cursor: 'pointer', transition: 'background 0.2s', '&:hover': { backgroundColor: '#D44040' } },

    // Specific Product Detail Panel
    productDetails: { display: 'flex', flexDirection: 'column', paddingTop: '24px' },
    tag: { fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor, marginBottom: '12px' },
    title: { fontFamily: fontConfig.heading, fontSize: isMobile ? '28px' : '40px', fontWeight: '700', color: textColor, lineHeight: '1.2', marginBottom: '16px' },
    price: { fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: textColor, marginBottom: '24px' },
    description: { fontSize: '14px', color: mutedColor, lineHeight: '1.6', marginBottom: '32px', whiteSpace: 'pre-wrap' },

    sectionLabel: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: textColor, marginBottom: '16px' },
    
    qtyRow: { display: 'flex', gap: '16px', marginBottom: '16px' },
    qtyControl: { display: 'flex', alignItems: 'center', backgroundColor: secondaryColor, borderRadius: '4px', border: `1px solid ${borderColor}` },
    qtyBtn: { width: '40px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', background: 'transparent', color: textColor },
    qtyValue: { fontSize: '14px', fontWeight: '600', width: '32px', textAlign: 'center', color: textColor },
    
    addBtn: { flex: 1, backgroundColor: 'transparent', color: textColor, border: `1px solid ${borderColor}`, borderRadius: '4px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color 0.2s', '&:hover': { backgroundColor: secondaryColor } },
    buyBtn: { width: '100%', backgroundColor: accentColor, color: '#000', border: 'none', borderRadius: '4px', padding: '16px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '32px', transition: 'opacity 0.2s', '&:hover': { opacity: 0.9 } },

    trustRow: { display: 'flex', gap: '24px', paddingTop: '24px', borderTop: `1px solid ${borderColor}` },
    trustItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' },

    // Recommendations
    sectionTitleText: { fontFamily: fontConfig.heading, fontSize: '28px', fontWeight: '700', color: textColor, marginBottom: '32px' },
    recGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' },
    recCard: { display: 'flex', flexDirection: 'column', cursor: 'pointer', backgroundColor: secondaryColor, borderRadius: '8px', overflow: 'hidden', paddingBottom: '16px' },
    recImgWrap: { width: '100%', aspectRatio: '1', backgroundColor: '#111', overflow: 'hidden', marginBottom: '16px' },
    recImg: { width: '100%', height: '100%', objectFit: 'cover' },
    recTitle: { fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '4px', padding: '0 16px' },
    recPrice: { fontSize: '12px', color: accentColor, fontWeight: 'bold', padding: '0 16px' }
  };

  const imageUrls = product?.image_url ? product.image_url.split(',') : [];

  if (!product || !brand) return null;

  return (
    <PageTransition>
      <div style={s.page} className="detail-page">
      <style>{`
        @media (max-width: 768px) {
          .detail-header { padding: 16px 24px !important; }
          .detail-content { padding: 32px 24px !important; gap: 48px !important; }
          .detail-hero { grid-template-columns: 1fr !important; gap: 32px !important; }
          .detail-main-img { height: 400px !important; }
          .detail-rec-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
        }
      `}</style>
      
      {/* Header Match */}
      <div style={s.header} className="detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ ...s.iconButton, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} style={{ marginRight: '8px' }} />
          </div>
          <div style={s.logo} onClick={() => navigate(`/shop-brand/${brand.id}`)}>
            {brand.logo_url && <img src={brand.logo_url} style={s.logoImage} alt="Brand Logo" />}
            {brand.brand_name || 'Digital Atelier'}
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={{ ...s.iconButton, position: 'relative', display: 'flex' }} onClick={() => navigate('/cart')} title="Cart">
            <ShoppingCart size={isMobile ? 22 : 20} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: accentColor, color: '#000', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${primaryColor}` }}>
                {cartCount}
              </span>
            )}
          </div>
          {!isCustomer && (
            <div style={s.iconButton} onClick={() => navigate('/profile')} title="Account">
              <User size={20} />
            </div>
          )}
        </div>
      </div>

      <div style={s.contentWrap} className="detail-content">

        {/* Hero Section */}
        <div style={s.heroLayout} className="detail-hero">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={s.imageGallery} 
            className="detail-gallery"
          >
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', gap: '24px', width: '100%' }}>
              
              {/* Thumbnails */}
              {imageUrls.length > 1 && (
                <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '12px', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '8px' : '0' }}>
                  {imageUrls.map((url, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImg(index)}
                      style={{ 
                        width: isMobile ? '60px' : '80px', 
                        height: isMobile ? '60px' : '80px', 
                        border: `1px solid ${activeImg === index ? accentColor : borderColor}`, 
                        cursor: 'pointer', 
                        borderRadius: '4px', 
                        overflow: 'hidden',
                        opacity: activeImg === index ? 1 : 0.6,
                        flexShrink: 0
                      }}
                    >
                      <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`Thumb ${index}`} />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div style={{ ...s.mainImageWrap, flex: 1 }} className="detail-main-img">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImg}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={imageUrls[activeImg] || imageUrls[0]} 
                    alt={product.title} 
                    style={s.mainImage} 
                  />
                </AnimatePresence>

                {isOwner && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px', zIndex: 20 }}>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={s.editBtn} 
                      onClick={handleEditClick} 
                      title="Edit Asset Configuration"
                    >
                      <Edit2 size={20} />
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={s.deleteBtn} 
                      onClick={handleDeleteProduct} 
                      title="Delete Asset"
                    >
                      <Trash2 size={20} />
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={s.productDetails}
          >
            {product.tag && <div style={s.tag}>{product.tag}</div>}
            <h1 style={s.title}>{product.title}</h1>
            <div style={s.price}>₦{parseFloat(product.price).toLocaleString()}</div>

            <p style={s.description}>
              {product.description || "The designer of this asset chose to let the geometry speak for itself. No accompanying narrative was provided."}
            </p>

            {!isOwner && (
              <>
                <div style={s.sectionLabel}>Quantity Required</div>
                <div style={s.qtyRow}>
                  <div style={s.qtyControl}>
                    <button style={s.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14} /></button>
                    <div style={s.qtyValue}>{qty}</div>
                    <button style={s.qtyBtn} onClick={() => setQty(qty + 1)}><Plus size={14} /></button>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={s.addBtn} 
                    onClick={handleAddToCart}
                  >
                    Bag Asset
                  </motion.button>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={s.buyBtn} 
                  onClick={handleBuyNow}
                >
                  Acquire Immediately
                </motion.button>

                <div style={s.trustRow}>
                  <div style={s.trustItem}><Truck size={14} /> Global Priority Transit</div>
                  <div style={s.trustItem}><ShieldCheck size={14} /> Immutable Verifications</div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Related Assets Map */}
        {relatedProducts.length > 0 && (
          <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '80px', marginTop: '40px' }}>
            <h2 style={s.sectionTitleText}>Explore More The Collection...</h2>
            <div style={s.recGrid} className="detail-rec-grid">
              
              {relatedProducts.map(rel => (
                <div key={rel.id} style={s.recCard} onClick={() => navigate(`/product?id=${rel.id}`)}>
                  <div style={s.recImgWrap}>
                    {rel.image_url ? (
                      <img src={rel.image_url.split(',')[0]} alt={rel.title} style={s.recImg} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#111' }}></div>
                    )}
                  </div>
                  <div style={s.recTitle}>{rel.title}</div>
                  <div style={s.recPrice}>₦{parseFloat(rel.price).toLocaleString()}</div>
                </div>
              ))}

            </div>
          </div>
        )}

      </div>

      {isOwner && isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: secondaryColor, width: '100%', maxWidth: '600px', borderRadius: '8px', border: `1px solid ${borderColor}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: `1px solid ${borderColor}` }}>
              <h3 style={{ fontFamily: fontConfig.heading, fontSize: '20px', margin: 0, color: textColor }}>Edit Asset Configuration</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', color: mutedColor, cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} style={{ padding: '24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: '24px', flexDirection: 'row', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ width: '160px', height: '200px', backgroundColor: '#111', border: `1px dashed ${borderColor}`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                >
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageSelect} />
                  {editForm.imagePreview ? (
                    <img src={editForm.imagePreview} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} alt="Preview" />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: mutedColor }}>
                      <ImageIcon size={32} />
                      <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em' }}>UPLOAD IMAGE</span>
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '200px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: mutedColor, marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>ASSET TITLE *</label>
                    <input type="text" required value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: `1px solid ${borderColor}`, borderRadius: '4px', color: '#FFF', fontSize: '14px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: mutedColor, marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>PRICE (NGN) *</label>
                    <input type="number" required value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: `1px solid ${borderColor}`, borderRadius: '4px', color: '#FFF', fontSize: '14px', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: mutedColor, marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>HIGHLIGHT TAG</label>
                    <input type="text" value={editForm.tag} onChange={e => setEditForm({...editForm, tag: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: `1px solid ${borderColor}`, borderRadius: '4px', color: '#FFF', fontSize: '14px', outline: 'none' }} />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', color: mutedColor, marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>DESCRIPTION</label>
                <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: `1px solid ${borderColor}`, borderRadius: '4px', color: '#FFF', fontSize: '14px', minHeight: '100px', resize: 'vertical', outline: 'none' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, padding: '16px', border: `1px solid ${borderColor}`, backgroundColor: 'transparent', color: textColor, fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>CANCEL</button>
                <button type="submit" disabled={uploading} style={{ flex: 1, padding: '16px', border: 'none', backgroundColor: accentColor, color: '#000', fontWeight: 'bold', borderRadius: '4px', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? 'UPDATING...' : 'UPDATE ASSET'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </PageTransition>
  );
}
