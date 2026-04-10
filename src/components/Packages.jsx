import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Packages() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBrands() {
      try {
        const { data, error } = await supabase
          .from('brand_profiles')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBrands(data || []);
      } catch (err) {
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  if (loading) return null;

  return (
    <section className="packages-section" id="solutions">
      <div className="container">
        <div className="flex justify-between items-center" style={{ marginBottom: '48px', flexDirection: window.innerWidth <= 768 ? 'column' : 'row', textAlign: window.innerWidth <= 768 ? 'center' : 'left', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Brands Of the Month</h2>
            <p className="text-secondary" style={{ fontSize: '14px' }}>Premium Stores enjoying active growth via ZizzyStores.</p>
          </div>
          <a href="store" className="font-bold flex items-center gap-2" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            View All Brands <ArrowRight size={16} />
          </a>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {brands.map((brand, i) => (
            <div key={brand.id || i} className="package-card" onClick={() => navigate(`/shop-brand/${brand.id}`)} style={{ cursor: 'pointer' }}>
              <div className="package-img" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.brand_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ShoppingBag size={48} opacity={0.2} />
                )}
              </div>
              <div className="package-content">
                <div className="flex justify-between items-start" style={{ marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{brand.brand_name || 'New Brand'}</h3>
                    <p className="text-muted" style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {brand.category || 'RETAIL • COMMERCE'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'black', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                    <CheckCircle2 size={25} strokeWidth={3} />
                  </div>
                </div>

                <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                  <div className="package-price">Live Site</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Active Setup</div>
                </div>

                <button
                  className="btn btn-outline"
                  style={{ width: '100%', marginTop: '24px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/shop-brand/${brand.id}`);
                  }}
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

