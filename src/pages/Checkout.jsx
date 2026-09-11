import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Lock, ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PaystackPop from '@paystack/inline-js';
import { useToast } from '../context/ToastContext';
import { isDarkColor, getContrastColor, getMutedColor, getBorderColor } from '../lib/colors';
import PageTransition from '../components/PageTransition';
import StoreAttribution from '../components/StoreAttribution';
import PaymentFailureModal from '../components/PaymentFailureModal';
import { nigeriaLocations, nigeriaStates } from '../lib/nigeriaLocations';
import { motion } from 'framer-motion';

const normalizePublicKey = (value) => String(value || '').trim().replace(/^['"]|['"]$/g, '');
const normalizeSubaccountCode = (value) => String(value || '').trim().replace(/^['"]|['"]$/g, '');
const normalizeLocation = (value) => String(value || '').trim().toLowerCase();

const getDeliveryFee = (brandProfile, customer) => {
  const legacyFee = Number(brandProfile?.local_shipping ?? brandProfile?.shipping_fee ?? 0);
  const sameCityFee = Number(brandProfile?.same_city_delivery_fee);
  const sameStateFee = Number(brandProfile?.same_state_delivery_fee);
  const outsideStateFee = Number(brandProfile?.outside_state_delivery_fee);
  const customerCity = normalizeLocation(customer?.city);
  const customerState = normalizeLocation(customer?.state);
  const brandCity = normalizeLocation(brandProfile?.city);
  const brandState = normalizeLocation(brandProfile?.state_province);

  if (customerCity && brandCity && customerCity === brandCity && Number.isFinite(sameCityFee)) return Math.max(0, sameCityFee);
  if (customerState && brandState && customerState === brandState && Number.isFinite(sameStateFee)) return Math.max(0, sameStateFee);
  if (Number.isFinite(outsideStateFee)) return Math.max(0, outsideStateFee);
  return Math.max(0, Number.isFinite(legacyFee) ? legacyFee : 0);
};

const getDeliveryZoneLabel = (brandProfile, customer) => {
  const customerCity = normalizeLocation(customer?.city);
  const customerState = normalizeLocation(customer?.state);
  const brandCity = normalizeLocation(brandProfile?.city);
  const brandState = normalizeLocation(brandProfile?.state_province);

  if (customerCity && brandCity && customerCity === brandCity) return `Within ${brandProfile.city}`;
  if (customerState && brandState && customerState === brandState) return `Within ${brandProfile.state_province}`;
  if (customerState) return `Outside ${brandProfile?.state_province || 'store state'}`;
  return 'Select your delivery location';
};

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const initialCartItemsRef = useRef(cartItems);
  const [cartValidationError, setCartValidationError] = useState('');
  const [cartValidated, setCartValidated] = useState(false);
  const paymentHandledRef = useRef(false);

  const [brand, setBrand] = useState(null);

  useEffect(() => {
    async function fetchBrand() {
      if (cartItems.length > 0 && cartItems[0].brand_id) {
        const { data } = await supabase.from('brand_profiles').select('*').eq('id', cartItems[0].brand_id).single();
        if (data) setBrand(data);
      }
    }
    fetchBrand();
  }, [cartItems]);

  useEffect(() => {
    const validateCart = async () => {
      const initialCartItems = initialCartItemsRef.current;
      if (initialCartItems.length === 0) {
        setCartValidated(true);
        return;
      }

      const brandId = initialCartItems[0]?.brand_id;
      const productIds = [...new Set(initialCartItems.map(item => item?.id).filter(Boolean))];
      if (!brandId || productIds.length !== initialCartItems.length) {
        setCartValidationError('This cart is missing product information. Return to the store and add the items again.');
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, image_url, status, brand_id')
        .eq('brand_id', brandId)
        .in('id', productIds);

      if (error) {
        setCartValidationError('We could not verify the products in your cart. Please try again.');
        return;
      }

      const productsById = new Map((data || []).map(product => [product.id, product]));
      const normalizedItems = initialCartItems.map(item => {
        const product = productsById.get(item.id);
        const quantity = Number(item.qty);
        if (!product || product.status !== 'active' || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return null;
        return { ...item, name: product.title, price: Number(product.price), image: product.image_url || item.image, qty: quantity };
      });

      if (normalizedItems.some(item => !item)) {
        setCartValidationError('One or more items in your cart are no longer available. Please return to the store and refresh your cart.');
        return;
      }

      setCartItems(normalizedItems);
      setCartValidationError('');
      setCartValidated(true);
    };

    validateCart();
  }, []);

  const bgMain = brand?.primary_color || '#FAFAFA';
  const isDark = isDarkColor(bgMain);
  const accentColor = brand?.accent_color || '#6A3E1F';
  const secondaryBg = brand?.secondary_color || (isDark ? '#141414' : '#FFFFFF');
  const textColor = getContrastColor(bgMain);
  const mutedColor = getMutedColor(bgMain);
  const borderColor = getBorderColor(bgMain);
  const dangerColor = '#D83A3A';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#FFFFFF';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    state: '',
    city: '',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingFee = getDeliveryFee(brand, formData);
  const deliveryZoneLabel = getDeliveryZoneLabel(brand, formData);
  const hasDeliveryLocation = Boolean(formData.state && formData.city);
  const total = subtotal + shippingFee;

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [confirmationRetryAvailable, setConfirmationRetryAvailable] = useState(false);
  const paystackPublicKey = normalizePublicKey(import.meta.env.VITE_PAYSTACK_PUBLIC_KEY);
  const flutterwavePublicKey = normalizePublicKey(import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY);
  const hasPaystack = Boolean(paystackPublicKey);
  const hasFlutterwave = Boolean(flutterwavePublicKey);
  const [paymentMethod, setPaymentMethod] = useState(() => {
    if (hasPaystack) return 'paystack';
    if (hasFlutterwave) return 'flutterwave';
    return 'paystack';
  });

  const formatCurrency = (amount) => `₦${amount.toLocaleString()}`;

  const showPaymentFailure = (reason) => {
    setIsProcessing(false);
    paymentHandledRef.current = false;
    const message = reason instanceof Error ? reason.message : String(reason || 'We could not complete your payment. Please try again.');
    setPaymentError(message);
  };

  const confirmationRetryKey = 'unbley:checkout-confirmation-retry';

  const onSuccess = async (transaction, retryRequest = null) => {
    if (paymentHandledRef.current) return;
    paymentHandledRef.current = true;
    setIsProcessing(true);
    
    const requestItems = retryRequest?.items || cartItems;
    const brandId = retryRequest?.brandId || requestItems[0]?.brand_id;
    if (!brandId) {
      console.error("No brand_id found in cart items.");
      showPaymentFailure('This checkout is missing its store information. Your cart is still saved. Please return to the cart and try again.');
      return;
    }

    const transactionReference = retryRequest?.transactionReference || transaction?.reference || transaction?.trxref || transaction?.transaction_id || transaction?.tx_ref;
    if (!transactionReference) {
      showPaymentFailure('The payment provider did not return a transaction reference. Your cart is still saved.');
      return;
    }

    try {
      const customerDetails = retryRequest?.customer || { ...formData };
      sessionStorage.setItem(confirmationRetryKey, JSON.stringify({
        brandId,
        provider: retryRequest?.provider || paymentMethod,
        transactionReference,
        items: requestItems,
        customer: customerDetails
      }));
      const response = await fetch('/api/payments/confirm-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId,
          provider: retryRequest?.provider || paymentMethod,
          transactionReference,
          items: requestItems,
          customer: customerDetails
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.order) {
        throw new Error(`${payload.error || 'Payment was verified, but the order could not be confirmed.'} Reference: ${transactionReference}`);
      }

      const orderData = {
        ...payload.order,
        brand_name: brand?.brand_name || 'Digital Atelier',
        items: payload.order.items || requestItems
      };

      // The order is confirmed independently of optional notifications.
      localStorage.removeItem('cart');
      sessionStorage.removeItem(confirmationRetryKey);
      window.dispatchEvent(new Event('cartUpdated'));
      setIsProcessing(false);
      navigate('/checkout-success', { state: { order: orderData } });

      // A notification outage must never make a paid order look unsuccessful.
      sendTelegramNotification(orderData).catch((notificationError) => {
        console.warn('Order notification failed after successful checkout:', notificationError);
      });
    } catch (err) {
      console.error("Critical Post-Checkout failure:", err);
      showPaymentFailure(err.message || 'Payment was received, but the order could not be confirmed. Your cart is still saved.');
      setConfirmationRetryAvailable(true);
    }
  };

  const retryOrderConfirmation = () => {
    try {
      const retryData = JSON.parse(sessionStorage.getItem(confirmationRetryKey) || 'null');
      if (!retryData?.transactionReference) {
        setConfirmationRetryAvailable(false);
        setPaymentError('The previous payment attempt could not be recovered. Your cart is still saved.');
        return;
      }
      setPaymentError('');
      setConfirmationRetryAvailable(false);
      onSuccess({ reference: retryData.transactionReference }, retryData);
    } catch {
      setPaymentError('The previous payment attempt could not be recovered. Your cart is still saved.');
    }
  };

  const sendTelegramNotification = async (order) => {
    const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) {
      console.warn("Telegram notification skipped: Token or Chat ID missing.");
      return;
    }

    // Plain text mode with NO special character parsing (most stable)
    const message = `
NEW ORDER ALERT
------------------------
Order: ${order.order_number}
Brand: ${brand?.brand_name || 'Store'}
Amount: NGN ${order.total_amount.toLocaleString()}
Method: ${order.payment_method.toUpperCase()}

Customer: ${order.customer_name}
Email: ${order.customer_email}
Phone: ${order.customer_phone}
Address: ${order.customer_address}

Items:
${order.items.map(item => `- ${item.qty}x ${item.name}${item.size ? ` (${item.size})` : ''}${item.color ? ` [${item.color}]` : ''}`).join('\n')}

Transaction ID: ${order.transaction_id}
------------------------
View in Dashboard.
    `.trim();

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
          // Removed parse_mode entirely to avoid parsing errors
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Telegram API Error:", errorData);
        throw new Error(`Telegram error: ${errorData.description}`);
      }
    } catch (e) {
      console.error("Telegram notify failed:", e);
      throw e;
    }
  };

  const onClose = () => {
    if (paymentHandledRef.current) return;
    showPaymentFailure('The payment window was closed or the payment was cancelled. Your cart is still saved.');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'state' ? { city: '' } : {})
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentSubmit = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to checkout.");
      navigate('/store');
      return;
    }
    if (!cartValidated) {
      toast.error(cartValidationError || 'Please wait while we verify your cart.');
      return;
    }

    paymentHandledRef.current = false;

    // Validation
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = document.querySelector('.has-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'paystack') {
      handlePaystack();
    } else {
      handleFlutterwave();
    }
  };

  const handlePaystack = () => {
    const testPaymentAdapter = typeof window !== 'undefined' && window.__UNBLEY_PAYMENT_TEST__;
    if (testPaymentAdapter) {
      testPaymentAdapter({ provider: 'paystack', amount: total, onSuccess, onCancel: onClose, onError: showPaymentFailure });
      return;
    }
    const paystackKey = paystackPublicKey;
    if (!paystackKey) {
      showPaymentFailure('Paystack is currently unavailable. Please select Flutterwave or contact support.');
      return;
    }
    if (!/^pk_(test|live)_/.test(paystackKey)) {
      showPaymentFailure('Paystack public key is invalid. Configure a pk_test_ or pk_live_ key in the deployed environment.');
      return;
    }

    const paystackSubaccountCode = normalizeSubaccountCode(brand?.paystack_subaccount_code);
    const validPaystackSubaccount = /^ACCT_[A-Za-z0-9]+$/.test(paystackSubaccountCode);

    try {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: paystackKey,
        email: formData.email,
        amount: Math.round(total * 100),
        currency: 'NGN',
        ref: `UNB-PSTK-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        ...(validPaystackSubaccount ? { subaccount: paystackSubaccountCode } : {}),
        onSuccess: (transaction) => onSuccess(transaction),
        onCancel: () => onClose(),
      });
    } catch (error) {
      console.error("Paystack initialization failed:", error);
      showPaymentFailure(error.message || 'Failed to initialize Paystack. Please try again or use Flutterwave.');
    }
  };

  const handleFlutterwave = () => {
    const testPaymentAdapter = typeof window !== 'undefined' && window.__UNBLEY_PAYMENT_TEST__;
    if (testPaymentAdapter) {
      testPaymentAdapter({ provider: 'flutterwave', amount: total, onSuccess, onCancel: onClose, onError: showPaymentFailure });
      return;
    }
    const flwKey = flutterwavePublicKey;
    if (!flwKey) {
      showPaymentFailure('Flutterwave payment configuration is missing. Please contact support.');
      return;
    }
    if (!/^FLWPUBK_(TEST|LIVE)-/.test(flwKey)) {
      showPaymentFailure('Flutterwave public key is invalid. Configure an FLWPUBK_TEST- or FLWPUBK_LIVE- key in the deployed environment.');
      return;
    }

    if (typeof window.FlutterwaveCheckout !== 'function') {
      showPaymentFailure('Flutterwave checkout is still loading or was blocked by your browser. Please try again or disable your ad blocker.');
      return;
    }

    const flutterwaveSubaccountCode = normalizeSubaccountCode(brand?.flutterwave_subaccount_code);
    const validFlutterwaveSubaccount = /^\d+$/.test(flutterwaveSubaccountCode);

    try {
      window.FlutterwaveCheckout({
        public_key: flwKey,
        tx_ref: `UNB-FLW-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        amount: total,
        currency: "NGN",
        payment_options: "card, account, ussd, banktransfer, qr",
        customer: {
          email: formData.email,
          phone_number: formData.phone,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
        },
        ...(validFlutterwaveSubaccount ? {
          subaccounts: [
            {
              id: flutterwaveSubaccountCode,
            }
          ]
        } : {}),
        customizations: {
          title: brand?.brand_name || "Unbley Order",
          description: `Order from ${brand?.brand_name || 'Store'}`,
          logo: brand?.logo_url || (typeof window !== 'undefined' ? `${window.location.origin}/favicon.svg` : "https://unbley.com/favicon.svg"),
        },
        callback: (data) => {
          console.log("Flutterwave Success:", data);
          onSuccess({ reference: data.transaction_id || data.tx_ref });
        },
        onclose: () => onClose(),
      });
    } catch (error) {
      console.error("Flutterwave initialization failed:", error);
      showPaymentFailure(error.message || 'Failed to launch Flutterwave. Please try again.');
    }
  };

  const s = {
    page: { backgroundColor: bgMain, color: textColor, minHeight: '100vh', fontFamily: '"Inter", sans-serif', overflowX: 'hidden', display: 'flex', flexDirection: 'column' },
    
    // Header
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', backgroundColor: secondaryBg, borderBottom: `1px solid ${borderColor}` },
    logo: { fontFamily: '"Inter", sans-serif', fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.05em', color: textColor },
    headerRight: { display: 'flex', alignItems: 'center', gap: '16px', color: mutedColor, fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em' },

    // Content Wrap
    contentWrap: { flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' },

    // Stepper
    stepper: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' },
    step: { display: 'flex', alignItems: 'center', gap: '8px' },
    stepNumActive: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: accentColor, color: isDarkColor(accentColor) ? '#FFFFFF' : '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' },
    stepNumIdle: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: secondaryBg, border: `1px solid ${borderColor}`, color: mutedColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' },
    stepTextActive: { fontSize: '13px', fontWeight: '700', color: accentColor },
    stepTextIdle: { fontSize: '13px', fontWeight: '500', color: mutedColor },
    stepLine: { width: '48px', height: '1px', backgroundColor: borderColor },

    // Main Layout
    layout: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '64px', maxWidth: '1200px', width: '100%' },

    // Left Col
    leftCol: { display: 'flex', flexDirection: 'column' },
    sectionTitle: { fontSize: '28px', fontWeight: '700', color: textColor, marginBottom: '32px' },
    sectionSubtitle: { fontSize: '14px', color: mutedColor, marginBottom: '24px', fontWeight: '500' },

    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    inputGroupFull: { display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' },
    label: { fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: textColor },
    input: { backgroundColor: inputBg, border: `1px solid ${borderColor}`, padding: '16px', fontSize: '14px', color: textColor, borderRadius: '4px', outline: 'none', transition: 'border-color 0.2s, background-color 0.2s', width: '100%' },
    select: { backgroundColor: inputBg, border: `1px solid ${borderColor}`, padding: '16px', paddingRight: '40px', fontSize: '14px', color: textColor, borderRadius: '4px', outline: 'none', transition: 'border-color 0.2s, background-color 0.2s', width: '100%', cursor: 'pointer', colorScheme: isDark ? 'dark' : 'light' },
    errorText: { color: dangerColor, fontSize: '11px', marginTop: '4px' },

    actionsCol: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' },
    continueBtn: { backgroundColor: accentColor, color: isDarkColor(accentColor) ? '#FFFFFF' : '#111111', border: 'none', padding: '18px 32px', fontSize: '14px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'opacity 0.2s', width: '100%' },
    disclaimerText: { fontSize: '12px', color: mutedColor, textAlign: 'center' },
    backBtn: { background: 'none', border: 'none', color: mutedColor, fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', padding: '12px' },

    // Right Col
    rightCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
    summaryBox: { backgroundColor: secondaryBg, padding: '32px', borderRadius: '4px', border: `1px solid ${borderColor}` },
    summaryTitle: { fontSize: '20px', fontWeight: '600', color: textColor, marginBottom: '32px' },
    
    summaryItem: { display: 'flex', gap: '16px', marginBottom: '24px' },
    summaryItemImg: { width: '64px', height: '64px', borderRadius: '4px', backgroundColor: '#111', overflow: 'hidden' },
    summaryItemDetails: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    summaryItemName: { fontSize: '14px', fontWeight: '600', color: textColor, marginBottom: '4px' },
    summaryItemVariant: { fontSize: '12px', color: mutedColor, marginBottom: '8px' },
    summaryItemPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    summaryItemQty: { fontSize: '12px', color: mutedColor },
    summaryItemPrice: { fontSize: '14px', fontWeight: '700', color: accentColor },

    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: mutedColor },
    summaryRowValue: { color: textColor, fontWeight: '500' },
    deliveryImportant: { fontSize: '11px', color: accentColor, fontWeight: '600', textAlign: 'right', marginTop: '-12px', marginBottom: '16px' },

    divider: { height: '1px', backgroundColor: borderColor, margin: '24px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    totalLabel: { fontSize: '16px', fontWeight: '700', color: textColor },
    totalValue: { fontSize: '24px', fontWeight: '800', color: accentColor },

    guaranteeBox: { backgroundColor: inputBg, padding: '16px', borderRadius: '4px', border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'flex-start', gap: '12px' },
    guaranteeText: { fontSize: '9px', fontWeight: '700', color: mutedColor, letterSpacing: '0.05em', lineHeight: '1.5' },

    encryptionBox: { backgroundColor: secondaryBg, border: `1px solid ${borderColor}`, padding: '16px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' },
    encryptionIcons: { display: 'flex', gap: '16px', color: mutedColor },
    encryptionText: { fontSize: '10px', fontWeight: '700', color: textColor, letterSpacing: '0.05em' },

    // Footer
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 48px', marginTop: 'auto', backgroundColor: bgMain, borderTop: `1px solid ${borderColor}` },
    footerLogo: { fontSize: '14px', fontWeight: '700', color: textColor },
    footerLinks: { display: 'flex', gap: '32px', fontSize: '11px', color: mutedColor },
    footerLinkItem: { cursor: 'pointer', textDecoration: 'none' },
    copyright: { fontSize: '11px', color: mutedColor },
  };

  const getInputStyle = (fieldName) => {
    return {
      ...s.input,
      border: `1px solid ${errors[fieldName] ? '#D83A3A' : 'transparent'}`,
      backgroundColor: errors[fieldName] ? '#FFF5F5' : inputBg
    };
  };

  const getSelectStyle = (fieldName) => ({
    ...s.select,
    border: `1px solid ${errors[fieldName] ? '#D83A3A' : borderColor}`,
    backgroundColor: errors[fieldName] ? '#FFF5F5' : inputBg
  });

  if (cartItems.length === 0) {
    return (
      <PageTransition>
        <div style={s.page}>
          <div style={s.header} className="checkout-header">
            <div style={s.logo}>{brand?.brand_name ? brand.brand_name.toUpperCase() : 'DIGITAL ATELIER'}</div>
            <div style={s.headerRight}>
              <Lock size={14} />
              SECURE CHECKOUT
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: secondaryBg, border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <ShoppingCart size={36} color={mutedColor} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: textColor, marginBottom: '12px' }}>Your Cart is Empty</h2>
            <p style={{ fontSize: '14px', color: mutedColor, maxWidth: '420px', lineHeight: '1.6', marginBottom: '32px' }}>
              There are no items in your cart to checkout. Please explore our collections to add items before proceeding.
            </p>
            <button
              onClick={() => brand?.id ? navigate(`/shop-brand/${brand.id}`) : navigate('/store')}
              style={{ ...s.continueBtn, width: 'auto', padding: '16px 36px', display: 'inline-flex' }}
            >
              <ArrowLeft size={16} /> Explore Collections
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div style={s.page}>
      
      <style>{`
        @media (max-width: 768px) {
          .checkout-header { padding: 16px 24px !important; }
          .checkout-content { padding: 32px 24px !important; }
          .checkout-layout { display: flex !important; flex-direction: column !important; gap: 40px !important; }
          .form-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .actions-col { position: sticky; bottom: 0; background: ${secondaryBg}; padding: 24px; margin: 32px -24px -32px -24px; box-shadow: 0 -10px 30px rgba(0,0,0,0.1); z-index: 100; border-top: 1px solid ${borderColor}; }
          .right-col { order: -1 !important; margin-bottom: 0 !important; }
          .footer-links { display: none !important; }
          .checkout-footer { padding: 24px !important; flex-direction: column; gap: 16px; align-items: center !important; text-align: center; }
          .stepper-wrap { display: none !important; }
          .section-title { font-size: 24px !important; margin-bottom: 24px !important; text-align: center; }
        }
      `}</style>

      {/* Header */}
      <div style={s.header} className="checkout-header">
        <div style={s.logo}>{brand?.brand_name ? brand.brand_name.toUpperCase() : 'DIGITAL ATELIER'}</div>
        <div style={s.headerRight}>
          <Lock size={14} />
          SECURE CHECKOUT
          <ShoppingCart size={18} style={{ marginLeft: '16px', color: textColor }} cursor="pointer" onClick={() => navigate('/cart')} />
        </div>
      </div>

      {/* Content */}
      <div style={s.contentWrap} className="checkout-content">
        
        {/* Stepper */}
        <div style={s.stepper} className="stepper-wrap">
          <div style={s.step}>
            <div style={s.stepNumActive}>1</div>
            <div style={s.stepTextActive}>Details</div>
          </div>
          <div style={s.stepLine}></div>
          <div style={s.step}>
            <div style={s.stepNumIdle}>2</div>
            <div style={s.stepTextIdle}>Payment</div>
          </div>
        </div>

        {/* Layout Grid */}
        <div style={s.layout} className="checkout-layout">
          
          {/* Left Column (Forms) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={s.leftCol}
          >
            <h1 style={s.sectionTitle}>Contact & Shipping</h1>
            
            <div style={s.formGrid} className="form-grid">
              
              {/* Contact Info (New) */}
              <div style={s.inputGroupFull} className={errors.email ? 'has-error' : ''}>
                <label htmlFor="checkout-email" style={s.label}>Email Address *</label>
                <input id="checkout-email" type="email" name="email" value={formData.email} onChange={handleInputChange} style={getInputStyle('email')} placeholder="For order confirmation" autoComplete="email" />
                {errors.email && <div style={s.errorText}>{errors.email}</div>}
              </div>
              
              <div style={s.inputGroupFull} className={errors.phone ? 'has-error' : ''}>
                <label htmlFor="checkout-phone" style={s.label}>Phone Number *</label>
                <input id="checkout-phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={getInputStyle('phone')} placeholder="For delivery updates" autoComplete="tel" />
                {errors.phone && <div style={s.errorText}>{errors.phone}</div>}
              </div>

              {/* Shipping Details */}
              <div style={s.inputGroup} className={errors.firstName ? 'has-error' : ''}>
                <label htmlFor="checkout-first-name" style={s.label}>First Name *</label>
                <input id="checkout-first-name" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} style={getInputStyle('firstName')} autoComplete="given-name" />
                {errors.firstName && <div style={s.errorText}>{errors.firstName}</div>}
              </div>
              
              <div style={s.inputGroup} className={errors.lastName ? 'has-error' : ''}>
                <label htmlFor="checkout-last-name" style={s.label}>Last Name *</label>
                <input id="checkout-last-name" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} style={getInputStyle('lastName')} autoComplete="family-name" />
                {errors.lastName && <div style={s.errorText}>{errors.lastName}</div>}
              </div>
              
              <div style={s.inputGroupFull} className={errors.address ? 'has-error' : ''}>
                <label htmlFor="checkout-address" style={s.label}>Address *</label>
                <textarea id="checkout-address" name="address" value={formData.address} onChange={handleInputChange} style={{ ...getInputStyle('address'), minHeight: '112px', resize: 'vertical', fontFamily: 'inherit' }} placeholder="House number, street, area" autoComplete="street-address" />
                {errors.address && <div style={s.errorText}>{errors.address}</div>}
              </div>
              
              <div style={s.inputGroup} className={errors.state ? 'has-error' : ''}>
                <label htmlFor="checkout-state" style={s.label}>State *</label>
                <select id="checkout-state" name="state" value={formData.state} onChange={handleInputChange} style={getSelectStyle('state')} autoComplete="address-level1">
                  <option value="" style={{ color: '#111827', backgroundColor: '#FFFFFF' }}>Select a state</option>
                  {nigeriaStates.map(state => <option key={state} value={state} style={{ color: '#111827', backgroundColor: '#FFFFFF' }}>{state}</option>)}
                </select>
                {errors.state && <div style={s.errorText}>{errors.state}</div>}
              </div>

              <div style={s.inputGroup} className={errors.city ? 'has-error' : ''}>
                <label htmlFor="checkout-city" style={s.label}>City *</label>
                <select id="checkout-city" name="city" value={formData.city} onChange={handleInputChange} style={{ ...getSelectStyle('city'), color: formData.city ? textColor : mutedColor, opacity: formData.state ? 1 : 0.65 }} autoComplete="address-level2" disabled={!formData.state}>
                  <option value="" style={{ color: '#111827', backgroundColor: '#FFFFFF' }}>{formData.state ? 'Select a city' : 'Select a state first'}</option>
                  {(nigeriaLocations[formData.state] || []).map(city => <option key={city} value={city} style={{ color: '#111827', backgroundColor: '#FFFFFF' }}>{city}</option>)}
                </select>
                {errors.city && <div style={s.errorText}>{errors.city}</div>}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{ ...s.sectionSubtitle, marginBottom: '16px', color: textColor }}>Payment Method</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <motion.div 
                  whileHover={{ scale: 1.02, backgroundColor: brand ? 'rgba(255,255,255,0.08)' : 'rgba(15, 44, 89, 0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('paystack')}
                  style={{ 
                    padding: '20px', 
                    borderRadius: '8px', 
                    backgroundColor: paymentMethod === 'paystack' ? (brand ? 'rgba(255,255,255,0.05)' : 'rgba(15, 44, 89, 0.05)') : secondaryBg,
                    border: `1px solid ${paymentMethod === 'paystack' ? accentColor : borderColor}`,
                    cursor: 'pointer',
                    transition: 'border-color 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `1px solid ${accentColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === 'paystack' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accentColor }}></div>}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: paymentMethod === 'paystack' ? accentColor : textColor }}>Local (Paystack)</span>
                  </div>
                  <div style={{ fontSize: '11px', color: mutedColor }}>Best for Nigeria Card, Transfer & USSD</div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02, backgroundColor: brand ? 'rgba(255,255,255,0.08)' : 'rgba(15, 44, 89, 0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('flutterwave')}
                  style={{ 
                    padding: '20px', 
                    borderRadius: '8px', 
                    backgroundColor: paymentMethod === 'flutterwave' ? (brand ? 'rgba(255,255,255,0.05)' : 'rgba(15, 44, 89, 0.05)') : secondaryBg,
                    border: `1px solid ${paymentMethod === 'flutterwave' ? accentColor : borderColor}`,
                    cursor: 'pointer',
                    transition: 'border-color 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `1px solid ${accentColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === 'flutterwave' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accentColor }}></div>}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: paymentMethod === 'flutterwave' ? accentColor : textColor }}>International (Flutterwave)</span>
                  </div>
                  <div style={{ fontSize: '11px', color: mutedColor }}>Best for International Cards & Mobile Money</div>
                </motion.div>
              </div>
            </div>

            <div style={s.actionsCol} className="actions-col">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{...s.continueBtn, opacity: isProcessing ? 0.7 : 1}} 
                onClick={handlePaymentSubmit} 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Proceed to Secure Payment
                  </>
                )}
              </motion.button>
              
              <div style={s.disclaimerText}>
                You’ll review your order before final payment
              </div>

              <button style={s.backBtn} onClick={() => navigate('/cart')}>
                <ArrowLeft size={14} />
                Return to Cart
              </button>
            </div>
          </motion.div>

          {/* Right Column (Summary) */}
          <div style={s.rightCol} className="right-col">
            <div style={s.summaryBox}>
              <h2 style={s.summaryTitle}>Order Summary</h2>
              
              {cartItems.map((item) => (
                <div key={item.id} style={s.summaryItem}>
                  <div style={s.summaryItemImg}>
                    <img src={item.img ? item.img.split(',')[0] : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&q=80' }} />
                  </div>
                  <div style={s.summaryItemDetails}>
                    <div style={s.summaryItemName}>{item.name}</div>
                    <div style={s.summaryItemVariant}>
                      {item.variant}
                      {(item.size || item.color) && (
                        <span style={{ marginLeft: '8px', color: accentColor, fontWeight: '700' }}>
                          [{item.size && `SIZE: ${item.size}`}{item.size && item.color && ' | '}{item.color && `COLOUR: ${item.color}`}]
                        </span>
                      )}
                    </div>
                    <div style={s.summaryItemPriceRow}>
                      <div style={s.summaryItemQty}>Qty: {item.qty}</div>
                      <div style={s.summaryItemPrice}>{formatCurrency(item.price * item.qty)}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div style={s.divider}></div>
              
              <div style={s.summaryRow}>
                <span>Subtotal</span>
                <span style={s.summaryRowValue}>{formatCurrency(subtotal)}</span>
              </div>
              <div style={s.summaryRow}>
                <span>Delivery fee <small style={{ color: mutedColor }}>({deliveryZoneLabel})</small></span>
                <span style={s.summaryRowValue}>{hasDeliveryLocation ? (shippingFee > 0 ? formatCurrency(shippingFee) : 'Free') : 'Select location first'}</span>
              </div>
              <div style={s.deliveryImportant}>
                Delivery fee included in total
              </div>

              <div style={s.divider}></div>
              
              <div style={s.totalRow}>
                <span style={s.totalLabel}>Total</span>
                <span style={s.totalValue}>{formatCurrency(total)}</span>
              </div>

              <div style={s.guaranteeBox}>
                <CheckCircle2 size={16} color="#10503D" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={s.guaranteeText}>ATELIER GUARANTEE: AUTHENTICITY & SECURE DELIVERY.</div>
              </div>
            </div>

            <div style={s.encryptionBox}>
              <div style={s.encryptionIcons}>
                <ShieldCheck size={20} />
                <CreditCard size={20} />
                <Lock size={20} />
              </div>
              <div style={s.encryptionText}>
                SECURED BY {paymentMethod === 'paystack' ? 'PAYSTACK' : 'FLUTTERWAVE'} & SSL ENCRYPTION
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={s.footer} className="checkout-footer">
        <div style={s.footerLogo}>{brand ? brand.brand_name : 'Digital Atelier'}</div>
        
        <div style={s.footerLinks} className="footer-links">
          <a style={s.footerLinkItem}>Privacy Policy</a>
          <a style={s.footerLinkItem}>Terms of Service</a>
          <a style={s.footerLinkItem}>Shipping & Returns</a>
          <a style={s.footerLinkItem}>Sustainability</a>
        </div>
        
        <div style={s.copyright}>© {new Date().getFullYear()} {brand ? brand.brand_name : 'Digital Atelier'}. All rights reserved.</div>
        <StoreAttribution color={mutedColor} />
      </div>

      <PaymentFailureModal
        error={paymentError}
        canRetryConfirmation={confirmationRetryAvailable}
        onRetry={confirmationRetryAvailable ? retryOrderConfirmation : () => setPaymentError('')}
        onClose={() => setPaymentError('')}
        onReturnToCart={() => navigate('/cart')}
        styles={{ secondaryBg, textColor, borderColor, mutedColor, dangerColor, continueBtn: s.continueBtn, backBtn: s.backBtn }}
      />
      </div>
    </PageTransition>
  );
}
