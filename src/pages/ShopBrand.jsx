import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, ShieldCheck, Truck, Headphones, Filter, Plus, Trash2, X, Image as ImageIcon, Edit2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

export default function ShopBrand({ customId }) {
  const { id: urlId, slug } = useParams(); // URL parameter targeting the brand ID or slug
  const id = customId || urlId;
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const isCustomer = user?.user_metadata?.role === 'customer' || user?.user_metadata?.userType === 'customer';
  
  // Real-time State
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Admin State
  const isOwner = user?.id === id;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // New Product Form
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    description: '',
    tag: '',
    sizes: '',
    imageFile: null,
    imagePreview: null,
    additionalImages: []
  });

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
    async function fetchStoreData() {
      if (!id && !slug) {
        setLoading(false);
        setError("Invalid URL Context. The specific brand link is incomplete.");
        return;
      }
      try {
        setLoading(true);
        let brandData, brandError;

        if (id) {
          // Fetch specific Brand Profile by ID
          ({ data: brandData, error: brandError } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('id', id)
            .single());
        } else if (slug) {
          // Fetch specific Brand Profile by Slug (assuming a slug/brand_name field)
          ({ data: brandData, error: brandError } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('brand_name', slug.replace(/-/g, ' ')) // Simple mapping for demonstration
            .single());
        }

        if (brandError) throw brandError;
        if (!brandData) throw new Error("Brand not found.");
        
        setBrand(brandData);

        // Fetch associated live Products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('brand_id', brandData.id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
        
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStoreData();
  }, [id]);

  // Admin Product Creation Logic
  const handleImageSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setNewProduct(prev => ({ 
      ...prev, 
      imageFile: file, 
      imagePreview: URL.createObjectURL(file) 
    }));
  };

  const handleEditClick = (e, product) => {
    e.stopPropagation();
    setEditingProductId(product.id);
    setNewProduct({
      title: product.title,
      price: product.price,
      description: product.description || '',
      tag: product.tag || '',
      sizes: product.sizes || '',
      imageFile: null,
      imagePreview: product.image_url,
      additionalImages: product.image_url && product.image_url.includes(',') 
        ? product.image_url.split(',').slice(1).map(url => ({ file: null, preview: url }))
        : []
    });
    setIsAddModalOpen(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!isOwner || !newProduct.title || !newProduct.price) return;
    
    setUploading(true);
    try {
      let imageUrls = [];
      
      // Upload main image
      if (newProduct.imageFile) {
        const fileExt = newProduct.imageFile.name.split('.').pop();
        const fileName = `${id}-product-main-${Math.random()}.${fileExt}`;
        const filePath = `${id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('brand-assets').upload(filePath, newProduct.imageFile);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('brand-assets').getPublicUrl(filePath);
        imageUrls.push(publicData.publicUrl);
      } else if (editingProductId && newProduct.imagePreview) {
        // Keep existing main image if not changed
        imageUrls.push(newProduct.imagePreview.split(',')[0]);
      }

      // Upload additional images
      for (const img of newProduct.additionalImages) {
        if (img.file) {
          const fileExt = img.file.name.split('.').pop();
          const fileName = `${id}-product-extra-${Math.random()}.${fileExt}`;
          const filePath = `${id}/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('brand-assets').upload(filePath, img.file);
          if (uploadError) throw uploadError;
          const { data: publicData } = supabase.storage.from('brand-assets').getPublicUrl(filePath);
          imageUrls.push(publicData.publicUrl);
        } else if (img.preview) {
          imageUrls.push(img.preview);
        }
      }

      const finalImageUrl = imageUrls.join(',');

      if (editingProductId) {
        const { error: updateError } = await supabase
          .from('products')
          .update({
            title: newProduct.title,
            price: parseFloat(newProduct.price) || 0,
            description: newProduct.description,
            tag: newProduct.tag,
            sizes: newProduct.sizes,
            image_url: finalImageUrl
          })
          .eq('id', editingProductId)
          .eq('brand_id', id);

        if (updateError) throw updateError;
        
        setProducts(prev => prev.map(p => p.id === editingProductId ? { ...p, title: newProduct.title, price: newProduct.price, description: newProduct.description, tag: newProduct.tag, sizes: newProduct.sizes, image_url: finalImageUrl } : p));
        alert('Asset Updated Successfully!');
      } else {
        const { data: newProd, error: insertError } = await supabase
          .from('products')
          .insert({
            brand_id: id,
            title: newProduct.title,
            price: parseFloat(newProduct.price) || 0,
            description: newProduct.description,
            tag: newProduct.tag,
            sizes: newProduct.sizes,
            image_url: finalImageUrl,
            status: 'active'
          })
          .select()
          .single();
          
        if (insertError) throw insertError;
        setProducts([newProd, ...products]);
        alert('Asset Deployed Successfully!');
      }
      
      setNewProduct({ title: '', price: '', description: '', tag: '', sizes: '', imageFile: null, imagePreview: null, additionalImages: [] });
      setIsAddModalOpen(false);
      setEditingProductId(null);

    } catch (err) {
      console.error('Failed saving product:', err);
      alert('Error saving product: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId, e) => {
    e.stopPropagation(); // prevent card click
    
    console.log('Delete attempt:', { productId, userId: user?.id, brandId: id, isOwner });
    
    if (!isOwner) {
      console.error('Delete failed: User is not the owner.');
      return;
    }
    
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this product? This act is irreversible.");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('brand_id', id);

      if (error) throw error;
      
      console.log('Product deleted successfully from DB');
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Deletion failed:', err);
      alert('Deletion failed: ' + err.message);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      
      // Prevent ordering from multiple brands in same cart to avoid conflicted split payments
      if (cart.length > 0 && cart[0].brand_id !== product.brand_id) {
        alert("Your cart contains items from a differing brand. Please checkout your current items first.");
        return;
      }

      if (existingItemIndex > -1) {
        cart[existingItemIndex].qty += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.title,
          price: parseFloat(product.price),
          img: product.image_url?.split(',')[0] || '',
          brand_id: product.brand_id,
          qty: 1,
          variant: 'Default' // Safely handles any generic size mapping
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Visual feedback
      const btn = e.target;
      const originalText = btn.innerText;
      btn.innerText = 'ADDED!';
      btn.style.backgroundColor = '#10503D';
      btn.style.color = '#FFF';
      
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = accentColor;
        btn.style.color = '#000';
      }, 1500);
      
    } catch (err) {
      console.error("Cart error", err);
    }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A', color: '#FFF' }}>Initializing Digital Atelier...</div>;
  if (error) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A', color: '#FFF' }}><h2>Store Not Found</h2><p>The atelier you are seeking does not exist or the link is invalid.</p></div>;
  if (!brand) return null;

  // Dynamic Theme Generation tied directly to DB variables
  const primaryColor = brand.primary_color || '#0A0A0A';
  const secondaryColor = brand.secondary_color || '#1A1A1A';
  const accentColor = brand.accent_color || '#06acf8';
  
  // Simple heuristic: if primary color is light, text should be dark. (Defaulting to dark mode rules for this engine right now)
  const isDarkBase = true; // Assuming the base brand intent is normally dark in a premium setting 
  const textColor = '#FDFDFD';
  const mutedColor = '#999';
  const borderColor = secondaryColor;

  const fontConfig = {
    heading: '"Playfair Display", serif',
    body: '"Inter", sans-serif'
  };

  const getGridCols = () => {
    if (isMobile) return 'repeat(2, 1fr)';
    if (isTablet) return 'repeat(2, 1fr)';
    return 'repeat(3, 1fr)';
  };

  const s = {
    page: { backgroundColor: primaryColor, color: textColor, minHeight: '100vh', fontFamily: fontConfig.body, overflowX: 'hidden' },

    // Header
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '20px 24px' : '24px 48px', borderBottom: `1px solid ${borderColor}`, backgroundColor: 'transparent', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' },
    logo: { fontFamily: fontConfig.heading, fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.05em', color: accentColor, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'uppercase' },
    logoImage: { height: '32px', width: '32px', borderRadius: '50%', objectFit: 'cover' },
    headerRight: { display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '24px' },
    searchBox: { display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '8px', backgroundColor: secondaryColor, padding: '10px 16px', borderRadius: '4px', width: '240px' },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', width: '100%', color: textColor },
    iconButton: { cursor: 'pointer', display: 'flex', alignItems: 'center', color: textColor, transition: 'color 0.2s', '&:hover': { color: accentColor } },

    // Hero Section
    hero: { position: 'relative', width: '100%', height: isMobile ? '40vh' : '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: secondaryColor, overflow: 'hidden' },
    heroImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 },
    heroContent: { position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', maxWidth: '800px' },
    heroTitle: { fontFamily: fontConfig.heading, fontSize: isMobile ? '28px' : '56px', fontWeight: '800', color: '#FFF', marginBottom: '12px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' },
    heroSubtitle: { fontFamily: fontConfig.body, fontSize: isMobile ? '13px' : '18px', color: '#FFF', fontWeight: '500', textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: '1.4' },

    // Trust Signals
    trustSignals: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: isMobile ? '24px' : '64px', padding: '32px 24px', backgroundColor: primaryColor, borderBottom: `1px solid ${borderColor}` },
    trustItem: { display: 'flex', alignItems: 'center', gap: '12px' },
    trustIcon: { color: accentColor },
    trustText: { fontSize: '12px', fontWeight: '600', color: textColor, letterSpacing: '0.05em', textTransform: 'uppercase' },

    // Main Content
    mainContainer: { display: 'flex', flexDirection: 'column', padding: isMobile ? '32px 24px 80px 24px' : '64px 48px 80px 48px', maxWidth: '1440px', margin: '0 auto', position: 'relative' },
    mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '24px' : '0', width: '100%' },
    mainTitle: { fontFamily: fontConfig.heading, fontSize: isMobile ? '28px' : '32px', fontWeight: '700', color: textColor },
    
    ownerBar: { backgroundColor: 'rgba(6, 172, 248, 0.1)', border: `1px solid ${accentColor}`, padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' },
    
    // Grid
    productGrid: { display: 'grid', gridTemplateColumns: getGridCols(), gap: isMobile ? '24px' : '32px', width: '100%' },
    productCard: { display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', transition: 'transform 0.3s ease', backgroundColor: secondaryColor, borderRadius: '8px', overflow: 'hidden' },
    productImageWrap: { width: '100%', aspectRatio: '4/5', backgroundColor: '#111', position: 'relative', overflow: 'hidden' },
    image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },

    tagBase: { position: 'absolute', top: '12px', left: '12px', padding: '4px 8px', fontSize: '9px', fontWeight: '800', fontFamily: fontConfig.body, letterSpacing: '0.1em', textTransform: 'uppercase', zIndex: 10, backgroundColor: textColor, color: primaryColor },
    editBtn: { padding: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF', borderRadius: '4px', zIndex: 20, border: '1px solid #333', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { backgroundColor: accentColor, color: '#000' } },
    deleteBtn: { padding: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFF', borderRadius: '4px', zIndex: 20, border: '1px solid #333', cursor: 'pointer', transition: 'background 0.2s', '&:hover': { backgroundColor: '#D44040' } },

    productInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '20px' },
    productName: { fontFamily: fontConfig.heading, fontSize: '18px', fontWeight: '600', color: textColor, marginBottom: '8px' },
    productPrice: { fontSize: '15px', fontWeight: '700', color: accentColor, marginBottom: '16px' },
    productDesc: { fontSize: '12px', color: mutedColor, lineHeight: '1.5', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    
    // Buttons
    buttonGroup: { display: 'flex', gap: '8px', width: '100%', marginTop: 'auto' },
    addToCartBtn: { flex: 1, backgroundColor: accentColor, color: '#000', padding: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'opacity 0.2s' },
    viewBtn: { flex: 1, backgroundColor: 'transparent', color: textColor, padding: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', border: `1px solid ${borderColor}`, borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s' },

    // Empty State
    emptyState: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: secondaryColor, border: `1px dashed ${borderColor}`, borderRadius: '8px', padding: isMobile ? '48px 24px' : '80px 24px', textAlign: 'center' },
    emptyTitle: { fontFamily: fontConfig.heading, fontSize: '24px', fontWeight: '700', color: textColor, marginBottom: '12px' },
    emptyDesc: { fontSize: '14px', color: mutedColor, maxWidth: '400px', marginBottom: '24px', lineHeight: '1.6' },

    // Footer
    footer: { borderTop: `1px solid ${borderColor}`, paddingTop: '64px', paddingBottom: '32px', backgroundColor: secondaryColor },
    footerTop: { display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', padding: isMobile ? '0 24px' : '0 48px', marginBottom: '64px', gap: isMobile ? '48px' : '0' },
    footerLeft: { maxWidth: '300px' },
    footerLogo: { fontFamily: fontConfig.heading, fontSize: '18px', fontWeight: '700', color: accentColor, marginBottom: '24px' },
    footerDesc: { fontSize: '12px', color: mutedColor, lineHeight: '1.6' },

    footerMenus: { display: 'flex', flexWrap: 'wrap', gap: isMobile ? '48px' : '80px' },
    footerCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
    footerColTitle: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: textColor, textTransform: 'uppercase', marginBottom: '8px' },
    footerLink: { fontSize: '12px', color: mutedColor, textDecoration: 'none', cursor: 'pointer' },

    newsletterInputGroup: { display: 'flex', borderBottom: `1px solid ${borderColor}`, paddingBottom: '8px', marginTop: '16px' },
    newsletterInput: { flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', color: textColor },
    newsletterBtn: { background: 'none', border: 'none', fontSize: '10px', fontWeight: '700', cursor: 'pointer', color: accentColor, letterSpacing: '0.1em' },
    
    footerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '0 24px' : '0 48px', borderTop: `1px solid ${borderColor}`, paddingTop: '24px' },
    copyright: { fontSize: '10px', color: mutedColor }
  };

  return (
    <PageTransition>
      <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.logo} onClick={() => navigate('/')}>
          {brand.logo_url && <img src={brand.logo_url} style={s.logoImage} alt="Brand Logo" />}
          {brand.brand_name || 'Digital Atelier'}
        </div>
        <div style={s.headerRight}>
          <div style={s.searchBox}>
            <Search size={14} color={mutedColor} />
            <input type="text" placeholder={isMobile ? "SEARCH..." : "Search curated goods..."} style={s.searchInput} />
          </div>
          <div style={{ ...s.iconButton, position: 'relative', display: 'flex' }} onClick={() => navigate('/cart')} title="Cart">
            <ShoppingCart size={isMobile ? 22 : 18} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: accentColor, color: '#000', fontSize: '10px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${primaryColor}` }}>
                {cartCount}
              </span>
            )}
          </div>
          {!isCustomer && (
            <div style={s.iconButton} onClick={() => navigate('/profile')} title="My Account">
              <User size={isMobile ? 20 : 18} />
            </div>
          )}
        </div>
      </div>

      <div style={s.hero}>
        {brand.banner_url ? (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            src={brand.banner_url} 
            alt="Hero Banner" 
            style={s.heroImage} 
          />
        ) : (
          <div style={s.heroImage}></div> // Fallback colored box
        )}
        <div style={s.heroContent}>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={s.heroTitle}
          >
            {brand.brand_name ? `The ${brand.brand_name} Collection` : 'The Permanent Collection'}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={s.heroSubtitle}
          >
            {brand.tagline || brand.brand_narrative || 'Curating timeless pieces from global artisans.'}
          </motion.p>
        </div>
      </div>

      {/* Trust Signals */}
      <div style={s.trustSignals}>
        <div style={s.trustItem}><ShieldCheck size={20} style={s.trustIcon} /><span style={s.trustText}>Secure Checkout</span></div>
        <div style={s.trustItem}><Truck size={20} style={s.trustIcon} /><span style={s.trustText}>Premium Delivery</span></div>
      </div>

      {/* Main Content */}
      <div style={s.mainContainer}>
        
        {isOwner && (
          <div style={s.ownerBar}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: accentColor, marginBottom: '4px' }}>Owner Environment Active</div>
              <div style={{ fontSize: '12px', color: '#CCC' }}>You are viewing your own storefront. You can instantly modify your digital inventory.</div>
            </div>
            <button onClick={() => { setEditingProductId(null); setNewProduct({ title: '', price: '', description: '', tag: '', sizes: '', imageFile: null, imagePreview: null, additionalImages: [] }); setIsAddModalOpen(true); }} style={{ backgroundColor: accentColor, color: '#000', padding: '12px 24px', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={16} /> Add Product
            </button>
          </div>
        )}

        <div style={s.mainHeader}>
          <h2 style={s.mainTitle}>All Products</h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '12px', color: mutedColor, border: `1px solid ${borderColor}`, padding: '10px 16px', borderRadius: '4px' }}>Filter</span>
            <span style={{ fontSize: '12px', color: mutedColor, border: `1px solid ${borderColor}`, padding: '10px 16px', borderRadius: '4px' }}>Sort <ChevronDown size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></span>
          </div>
        </div>

        {products.length === 0 ? (
          <div style={s.emptyState}>
            <h3 style={s.emptyTitle}>{isOwner ? "Your Gallery is Empty" : "Gallery Updating"}</h3>
            <p style={s.emptyDesc}>{isOwner ? "Inject your first digital artifact into the ecosystem to begin processing sales." : "The curator is currently updating this digital space."}</p>
            {isOwner && <button onClick={() => { setEditingProductId(null); setNewProduct({ title: '', price: '', description: '', tag: '', sizes: '', imageFile: null, imagePreview: null, additionalImages: [] }); setIsAddModalOpen(true); }} style={s.buttonGroup.addToCartBtn}>Launch Initial Product</button>}
          </div>
        ) : (
          <div style={s.productGrid}>
             {/* Map Live Products */}
             {products.map((product, idx) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={s.productCard} 
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div style={s.productImageWrap}>
                  {product.image_url ? (
                    <motion.img 
                      src={product.image_url.split(',')[0]} 
                      alt={product.title} 
                      style={{ ...s.image, transform: hoveredProduct === product.id ? 'scale(1.05)' : 'scale(1)' }} 
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: borderColor }}><ImageIcon size={48} /></div>
                  )}
                  {product.tag && <div style={s.tagBase}>{product.tag}</div>}
                  
                  {isOwner && hoveredProduct === product.id && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px', zIndex: 20 }}>
                      <div style={s.editBtn} onClick={(e) => handleEditClick(e, product)} title="Edit product settings">
                        <Edit2 size={16} />
                      </div>
                      <div style={s.deleteBtn} onClick={(e) => handleDeleteProduct(product.id, e)} title="Delete specific product">
                        <Trash2 size={16} />
                      </div>
                    </div>
                  )}
                </div>

                <div style={s.productInfo}>
                  <div style={s.productName}>{product.title}</div>
                  <div style={s.productPrice}>₦{parseFloat(product.price).toLocaleString()}</div>
                  {product.description && <div style={s.productDesc}>{product.description}</div>}
                  
                  <div style={{ ...s.buttonGroup, opacity: (hoveredProduct === product.id || isMobile || isOwner) ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                    {!isOwner && (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{...s.addToCartBtn, transition: 'all 0.3s'}} 
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        Bag It
                      </motion.button>
                    )}
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={s.viewBtn} 
                      onClick={(e) => { e.stopPropagation(); navigate(`/product?id=${product.id}`); }}
                    >
                      Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <div style={s.footerTop}>
          <div style={s.footerLeft}>
            <div style={s.footerLogo}>{brand.brand_name || 'Digital Atelier'}</div>
            <p style={s.footerDesc}>{brand.manifesto || "Mastering the architecture of modern commerce through monolithic design and unparalleled curation."}</p>
          </div>

          <div style={s.footerMenus}>
            <div style={s.footerCol}>
              <div style={s.footerColTitle}>Social Footprint</div>
              {brand.instagram_url && <a href={brand.instagram_url} target="_blank" rel="noreferrer" style={s.footerLink}>Instagram</a>}
              {brand.twitter_url && <a href={brand.twitter_url} target="_blank" rel="noreferrer" style={s.footerLink}>X / Twitter</a>}
              {brand.tiktok_url && <a href={brand.tiktok_url} target="_blank" rel="noreferrer" style={s.footerLink}>TikTok</a>}
              {!brand.instagram_url && !brand.twitter_url && !brand.tiktok_url && <span style={s.footerLink}>Link Matrix Syncing...</span>}
            </div>

            <div style={{ width: isMobile ? '100%' : '280px' }}>
              <div style={s.footerColTitle}>The Insider Newsletter</div>
              <div style={s.newsletterInputGroup}>
                <input type="email" placeholder="EMAIL ADDRESS" style={s.newsletterInput} />
                <button style={s.newsletterBtn}>JOIN THE CIRCLE</button>
              </div>
            </div>
          </div>
        </div>
        
        <div style={s.footerBottom}>
          <div style={s.copyright}>© {new Date().getFullYear()} {brand.brand_name || 'BRAND'}. Secured by Zizzystores Infrastructural Core.</div>
        </div>
      </div>

      {/* Admin Add Product Modal Layer */}
      {isOwner && isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: secondaryColor, width: '100%', maxWidth: '600px', borderRadius: '8px', border: `1px solid ${borderColor}`, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: `1px solid ${borderColor}` }}>
              <h3 style={{ fontFamily: fontConfig.heading, fontSize: '20px', margin: 0, color: textColor }}>{editingProductId ? 'Edit Asset Configuration' : 'Catalog New Asset'}</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: mutedColor, cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddProduct} style={{ padding: '24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', gap: '24px', flexDirection: isMobile ? 'column' : 'row', marginBottom: '24px' }}>
                
                {/* Image Uploader */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ width: isMobile ? '100%' : '200px', height: '200px', backgroundColor: '#111', border: `1px dashed ${borderColor}`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageSelect} />
                    {newProduct.imagePreview ? (
                      <img src={newProduct.imagePreview.split(',')[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} alt="Preview" />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: mutedColor }}>
                        <ImageIcon size={32} />
                        <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em' }}>MAIN IMAGE</span>
                      </div>
                    )}
                  </div>

                  {/* Additional Images Mini-grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[0, 1, 2].map(i => (
                      <div 
                        key={i}
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (loadEv) => {
                                const newExtras = [...newProduct.additionalImages];
                                newExtras[i] = { file, preview: loadEv.target.result };
                                setNewProduct({ ...newProduct, additionalImages: newExtras });
                              };
                              reader.readAsDataURL(file);
                            }
                          };
                          input.click();
                        }}
                        style={{ aspectRatio: '1', backgroundColor: '#0A0A0A', border: `1px dashed ${borderColor}`, borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}
                      >
                        {newProduct.additionalImages[i]?.preview ? (
                          <img src={newProduct.additionalImages[i].preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Plus size={16} color={mutedColor} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: mutedColor, marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>ASSET TITLE *</label>
                    <input type="text" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: `1px solid ${borderColor}`, borderRadius: '4px', color: '#FFF', fontSize: '14px', outline: 'none' }} placeholder="E.g. Lunar Dust Jacket" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: mutedColor, marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>PRICE (NGN) *</label>
                    <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: `1px solid ${borderColor}`, borderRadius: '4px', color: '#FFF', fontSize: '14px', outline: 'none' }} placeholder="45000" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: mutedColor, marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>HIGHLIGHT TAG (OPTIONAL)</label>
                    <input type="text" value={newProduct.tag} onChange={e => setNewProduct({...newProduct, tag: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: `1px solid ${borderColor}`, borderRadius: '4px', color: '#FFF', fontSize: '14px', outline: 'none' }} placeholder="E.g. LIMITED EDITION" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', color: mutedColor, marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>AVAILABLE SIZES (E.G. S, M, L, XL)</label>
                    <input type="text" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: `1px solid ${borderColor}`, borderRadius: '4px', color: '#FFF', fontSize: '14px', outline: 'none' }} placeholder="S, M, L, XL" />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', color: mutedColor, marginBottom: '8px', fontWeight: 'bold', letterSpacing: '0.1em' }}>DESCRIPTION (OPTIONAL)</label>
                <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ width: '100%', padding: '12px', backgroundColor: '#111', border: `1px solid ${borderColor}`, borderRadius: '4px', color: '#FFF', fontSize: '14px', minHeight: '100px', resize: 'vertical', outline: 'none' }} placeholder="Detail the construction, materials, and origin of the asset..."></textarea>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1, padding: '16px', border: `1px solid ${borderColor}`, backgroundColor: 'transparent', color: textColor, fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>CANCEL</button>
                <button type="submit" disabled={uploading} style={{ flex: 1, padding: '16px', border: 'none', backgroundColor: accentColor, color: '#000', fontWeight: 'bold', borderRadius: '4px', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? (editingProductId ? 'UPDATING...' : 'UPLOADING...') : (editingProductId ? 'UPDATE ASSET' : 'DEPLOY ASSET')}
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
