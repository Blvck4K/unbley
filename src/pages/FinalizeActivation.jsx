import React, { useState } from 'react';
import { Shield, Lock, CreditCard, Sparkles, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import PaystackPop from '@paystack/inline-js';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function FinalizeActivation() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const selectedPlanId = location.state?.planId || 'activation';
  const selectedPlanName = location.state?.planName || 'Store Activation';
  const selectedPeriod = location.state?.period || 'Selected Period';
  const selectedAmount = location.state?.amount !== undefined ? location.state.amount : 30000;
  const selectedUsdAmount = location.state?.usdAmount !== undefined ? location.state.usdAmount : 30;
  const isFreeTrial = selectedAmount === 0 || selectedPlanId === 'free-trial';
  const isAnnualPlan = String(selectedPeriod).toLowerCase().includes('annual') || String(selectedPeriod).toLowerCase().includes('year');
  const includesDomain = selectedPlanId === 'starter' && isAnnualPlan;
  const planBenefits = selectedPlanId === 'business'
    ? ['Everything in Unbley Starter', 'Staff accounts for growing teams', 'Automated logistics rate calculator', 'Custom receipts and invoices', 'Priority concierge assistance']
    : selectedPlanId === 'starter'
      ? ['Unlimited product listings', 'Direct Paystack bank settlements', 'Zero commission on direct sales', 'Standard creator support']
      : ['Full storefront access', 'List up to 10 products', 'Accept local and card payments', 'Direct WhatsApp integration', 'Standard store analytics'];

  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paidReference, setPaidReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paystack'); // 'paystack' or 'flutterwave'

  const onSuccess = async (transaction) => {
    setProcessing(true);
    setErrorMsg('');
    const reference = transaction?.reference || transaction?.transaction_id || transaction?.tx_ref;
    if (reference) setPaidReference(reference);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) throw new Error('Your session has expired. Please sign in again.');

      const response = await fetch('/api/payments/confirm-activation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          planId: selectedPlanId,
          interval: location.state?.interval || 'monthly',
          provider: paymentMethod,
          reference,
          trial: isFreeTrial
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'Activation could not be completed.');

      await refreshUser?.();

      // 3. Complete! Navigate to Success Page
      const finalAmount = isFreeTrial ? 0 : (paymentMethod === 'paystack' ? selectedAmount : selectedUsdAmount);
      const finalCurrency = isFreeTrial ? 'NGN' : (paymentMethod === 'paystack' ? 'NGN' : 'USD');
      const finalMethod = isFreeTrial ? 'Free Trial' : paymentMethod;
      
      navigate('/success', { 
        state: { 
          type: isFreeTrial ? 'free_trial' : 'paid_plan',
          reference,
          amount: finalAmount,
          currency: finalCurrency,
          email: user?.email,
          brandName: user?.user_metadata?.brand_name || 'Your Premium Store',
          method: finalMethod,
          planId: selectedPlanId,
          planName: selectedPlanName,
          period: selectedPeriod
        } 
      });
      
    } catch (err) {
      console.error("Critical Post-Payment DB failure:", err);
      setErrorMsg(`${err.message || 'Activation could not be completed.'}${reference ? ` Reference: ${reference}` : ''}`);
      setProcessing(false);
    }
  };

  const retryActivation = () => {
    if (!paidReference || processing) return;
    setErrorMsg('Retrying activation confirmation...');
    onSuccess({ reference: paidReference });
  };

  const onClose = () => {
    console.log('Customer abandoned flow');
    setProcessing(false);
  };

  const handleFreeTrial = async () => {
    setProcessing(true);
    setErrorMsg('');
    try {
      await onSuccess({ reference: `trial_${Date.now()}` });
    } catch (err) {
      console.error("Trial activation error:", err);
      setErrorMsg("Failed to activate free trial. Please try again.");
      setProcessing(false);
    }
  };

  const handleActionClick = () => {
    if (isFreeTrial) {
      handleFreeTrial();
    } else {
      handlePayClick();
    }
  };

  const handlePayClick = () => {
    if (paymentMethod === 'paystack') {
      handlePaystack();
    } else {
      handleFlutterwave();
    }
  };

  const handlePaystack = () => {
    if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
      alert("Config Error: VITE_PAYSTACK_PUBLIC_KEY missing!");
      return;
    }
    setProcessing(true);

    try {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user?.email || "pending@unbley.com",
        amount: selectedAmount * 100,
        currency: 'NGN',
        ref: (new Date()).getTime().toString(),
        onSuccess: (transaction) => onSuccess(transaction),
        onCancel: () => onClose(),
      });
    } catch (error) {
      console.error("Paystack failed:", error);
      setProcessing(false);
    }
  };

  const handleFlutterwave = () => {
    if (!import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY) {
      alert("Config Error: VITE_FLUTTERWAVE_PUBLIC_KEY missing!");
      return;
    }
    setProcessing(true);

    try {
      if (!window.FlutterwaveCheckout) {
        alert("Payment gateway is loading, please try again in a moment.");
        setProcessing(false);
        return;
      }
      window.FlutterwaveCheckout({
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: (new Date()).getTime().toString(),
        amount: selectedUsdAmount,
        currency: "USD",
        customer: {
          email: user?.email || "pending@unbley.com",
          name: user?.user_metadata?.brand_name || "New Store Owner",
        },
        customizations: {
          title: `Unbley Activation - ${selectedPlanName}`,
          description: selectedPeriod,
        },
        callback: (data) => {
          onSuccess({ reference: data.transaction_id || data.tx_ref });
        },
        onclose: () => onClose(),
      });
    } catch (error) {
      console.error("Flutterwave failed:", error);
      setProcessing(false);
    }
  };

  const brandColor = '#6A3E1F';
  
  const s = {
    page: { display: 'flex', height: '100vh', width: '100%', fontFamily: '"Inter", sans-serif', color: '#221510', overflow: 'hidden', backgroundColor: '#FBF9F5' },
    leftPane: { flex: 1, backgroundColor: '#261710', position: 'relative', display: 'flex', flexDirection: 'column', padding: '48px 64px', overflow: 'hidden', borderRight: '1px solid #3D261A', color: '#FDFBF7' },
    rightPane: { flex: 1, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', padding: '48px 64px', position: 'relative', overflowY: 'auto', color: '#221510' },
    logo: { fontFamily: 'var(--font-heading)', fontSize: '20px', letterSpacing: '-0.02em', color: '#FDFBF7', textTransform: 'none', fontWeight: '800' },
    mainTitle: { fontFamily: 'var(--font-heading)', fontSize: '38px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '24px', lineHeight: '1.15', color: '#221510' },
    checkoutBox: { backgroundColor: '#F7F2EC', borderLeft: `3px solid ${brandColor}`, borderTop: '1px solid #DFCFC2', borderRight: '1px solid #DFCFC2', borderBottom: '1px solid #DFCFC2', borderRadius: '8px', padding: '32px', position: 'relative', marginBottom: '40px' },
    price: { fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', color: '#221510' },
    payBtn: { 
      width: '100%', 
      height: '56px', 
      backgroundColor: brandColor, 
      color: '#FFFFFF', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 24px', 
      fontSize: '14px', 
      fontWeight: 'bold', 
      border: 'none', 
      borderRadius: '4px', 
      cursor: processing ? 'not-allowed' : 'pointer', 
      opacity: processing ? 0.7 : 1 
    },
    errorBox: { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '16px', borderRadius: '4px', fontSize: '12px', marginBottom: '24px', border: '1px solid #F87171' }
  };

  return (
    <PageTransition>
      <div style={s.page} className="fin-page">
        <style>{`
          @media (max-width: 768px) {
            .fin-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow-y: auto !important; }
            .fin-left { display: none !important; }
            .fin-right { padding: 48px 24px !important; }
          }
        `}</style>
        
        {/* LEFT PANE */}
        <div style={s.leftPane} className="fin-left">
          <div style={s.logo}>Unbley.</div>
          <div style={{ marginTop: 'auto', marginBottom: '10vh' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '48px', color: '#FDFBF7' }}>
              Everything you need to <span style={{ color: '#E8DCCF' }}>sell beautifully</span> online.
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {planBenefits.map(benefit => (
                <div key={benefit} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={17} color="#E8DCCF" />
                  <span style={{ fontSize: '13px', color: '#FDFBF7' }}>{benefit}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <Globe size={17} color="#E8DCCF" />
                <span style={{ fontSize: '13px', color: '#C9BFB5' }}>
                  {includesDomain ? 'Complimentary .store domain included for the first year.' : 'Connect your own domain whenever you are ready.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE */}
        <div style={s.rightPane} className="fin-right">
          <button onClick={() => navigate('/support')} style={{ alignSelf: 'flex-end', border: 'none', background: 'transparent', padding: 0, fontSize: '11px', color: '#6B584C', letterSpacing: '0.05em', cursor: 'pointer' }}>SUPPORT</button>
          <div style={{ display: 'flex', flexDirection: 'column', margin: 'auto', maxWidth: '480px', width: '100%' }}>
            <div style={{ color: brandColor, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>FINALIZE ACTIVATION</div>
            <h2 style={s.mainTitle}>Activate your Unbley store</h2>
            <p style={{ color: '#6B584C', fontSize: '14px', lineHeight: '1.6', marginBottom: '48px' }}>
              Start selling online with a storefront, payments, products, and tools built for modern Nigerian businesses.
            </p>

            {!isFreeTrial ? (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '10px', color: '#6B584C', marginBottom: '16px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>SELECT REGION</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod('paystack')}
                    style={{ 
                      flex: 1, padding: '16px', borderRadius: '8px', 
                      backgroundColor: paymentMethod === 'paystack' ? '#F7F2EC' : '#FFFFFF',
                      border: `1.5px solid ${paymentMethod === 'paystack' ? brandColor : '#DFCFC2'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ color: paymentMethod === 'paystack' ? brandColor : '#6B584C', fontSize: '12px', fontWeight: 'bold' }}>Local (Paystack)</div>
                    <div style={{ color: '#8D5B36', fontSize: '10px', marginTop: '4px' }}>Nigeria Cards & Transfer</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod('flutterwave')}
                    style={{ 
                      flex: 1, padding: '16px', borderRadius: '8px', 
                      backgroundColor: paymentMethod === 'flutterwave' ? '#F7F2EC' : '#FFFFFF',
                      border: `1.5px solid ${paymentMethod === 'flutterwave' ? brandColor : '#DFCFC2'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ color: paymentMethod === 'flutterwave' ? brandColor : '#6B584C', fontSize: '12px', fontWeight: 'bold' }}>International (FW)</div>
                    <div style={{ color: '#8D5B36', fontSize: '10px', marginTop: '4px' }}>Cards outside Nigeria</div>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#F7F2EC',
                border: '1px solid #DFCFC2',
                borderRadius: '8px',
                padding: '16px 20px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Sparkles size={22} color={brandColor} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#221510' }}>
                    14-Day Full Access Free Trial
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#6B584C', marginTop: '2px' }}>
                    No credit card or payment required. Activate and start selling immediately.
                  </div>
                </div>
              </div>
            )}

            <div style={s.checkoutBox}>
              <div style={{ fontSize: '10px', color: '#6B584C', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>
                SELECTED PLAN: <span style={{ color: brandColor }}>{selectedPlanName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <div style={s.price}>
                  {isFreeTrial ? 'Free (₦0)' : (paymentMethod === 'paystack' ? `₦${selectedAmount.toLocaleString()}` : `$${selectedUsdAmount}.00`)}
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#6B584C', marginTop: '8px' }}>
                Billing Cycle: {selectedPeriod}
              </div>
            </div>

            {errorMsg && (
              <div style={s.errorBox}>
                <div>{errorMsg}</div>
                {paidReference && (
                  <button onClick={retryActivation} disabled={processing} style={{ marginTop: '12px', border: '1px solid #DC2626', background: 'transparent', color: '#DC2626', padding: '8px 12px', borderRadius: '4px', fontWeight: '700', cursor: processing ? 'not-allowed' : 'pointer' }}>
                    {processing ? 'Confirming activation...' : 'Retry activation without paying again'}
                  </button>
                )}
              </div>
            )}

            <button style={s.payBtn} onClick={handleActionClick} disabled={processing}>
              <span>
                {processing 
                  ? 'Activating Store...' 
                  : (isFreeTrial ? 'Start 14-Day Free Trial Now' : `Pay via ${paymentMethod === 'paystack' ? 'Paystack' : 'Flutterwave'}`)
                }
              </span>
              <ArrowRight size={20} />
            </button>

            <div style={{ textAlign: 'center', color: '#6B584C', fontSize: '11px', marginTop: '24px' }}>
              <Shield size={14} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#6A3E1F' }} />
              {isFreeTrial ? 'No credit card required. Cancel anytime.' : 'Secure 256-bit encrypted transaction.'}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
