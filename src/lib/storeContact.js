import { supabase } from './supabase';

export const isStoreRoute = (pathname) => (
  pathname.startsWith('/shop-brand/') ||
  pathname.startsWith('/@') ||
  pathname === '/product' ||
  pathname.startsWith('/store-dashboard/')
);

export const normalizeWhatsAppNumber = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return null;

  const normalized = digits.startsWith('00')
    ? digits.slice(2)
    : digits.startsWith('0')
      ? `234${digits.slice(1)}`
      : digits;

  return normalized.length >= 10 && normalized.length <= 15 ? normalized : null;
};

export async function fetchStoreContact(location) {
  const { pathname, search } = location;
  let brandId = null;
  let brandSlug = null;

  if (pathname.startsWith('/shop-brand/')) {
    brandId = decodeURIComponent(pathname.slice('/shop-brand/'.length));
  } else if (pathname.startsWith('/@')) {
    brandSlug = decodeURIComponent(pathname.slice(2));
  } else if (pathname.startsWith('/store-dashboard/')) {
    brandId = decodeURIComponent(pathname.slice('/store-dashboard/'.length));
  } else if (pathname === '/product') {
    const productId = new URLSearchParams(search).get('id');
    if (!productId) return null;

    const { data: product } = await supabase
      .from('products')
      .select('brand_id')
      .eq('id', productId)
      .maybeSingle();
    brandId = product?.brand_id || null;
  }

  if (!brandId && !brandSlug) return null;

  let query = supabase.from('brand_profiles').select('phone_number');
  query = brandId ? query.eq('id', brandId) : query.ilike('brand_name', brandSlug);
  const { data: brand } = await query.maybeSingle();
  return normalizeWhatsAppNumber(brand?.phone_number);
}
