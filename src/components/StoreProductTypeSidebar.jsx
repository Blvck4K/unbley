import React, { useEffect, useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function StoreProductTypeSidebar({
  brandId,
  accentColor,
  textColor,
  mutedColor,
  borderColor
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchProductTypes() {
      const { data, error } = await supabase
        .from('products')
        .select('product_type')
        .eq('brand_id', brandId)
        .not('product_type', 'is', null);

      if (error) {
        console.warn('Unable to load store product types:', error.message);
        return;
      }

      if (isMounted) {
        setProductTypes([...new Set((data || []).map((product) => product.product_type).filter(Boolean))]);
      }
    }

    if (brandId) fetchProductTypes();
    return () => {
      isMounted = false;
    };
  }, [brandId]);

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    border: `1px solid ${borderColor}`,
    borderRadius: '4px',
    background: 'transparent',
    color: textColor,
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer'
  };

  return (
    <div style={{ position: 'relative' }}>
      <button type="button" onClick={() => setIsOpen((open) => !open)} style={buttonStyle} aria-expanded={isOpen}>
        <Filter size={14} />
        <span>Product types</span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200, minWidth: '180px', padding: '8px', background: '#111', border: `1px solid ${borderColor}`, borderRadius: '4px', boxShadow: '0 12px 30px rgba(0,0,0,0.2)' }}>
          <button type="button" onClick={() => navigate(`/shop-brand/${brandId}`)} style={{ display: 'block', width: '100%', padding: '9px 10px', border: 'none', background: 'transparent', color: accentColor, textAlign: 'left', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
            All products
          </button>
          {productTypes.length === 0 ? (
            <div style={{ padding: '9px 10px', color: mutedColor, fontSize: '11px' }}>No product types yet</div>
          ) : productTypes.map((productType) => (
            <button key={productType} type="button" onClick={() => navigate(`/shop-brand/${brandId}`)} style={{ display: 'block', width: '100%', padding: '9px 10px', border: 'none', borderTop: `1px solid ${borderColor}`, background: 'transparent', color: textColor, textAlign: 'left', fontSize: '11px', cursor: 'pointer', textTransform: 'capitalize' }}>
              {productType}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
