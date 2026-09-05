import React, { useState } from 'react';
import { Shield, Lock, CreditCard, Sparkles, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import PaystackPop from '@paystack/inline-js';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function FinalizeActivation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paystack'); // 'paystack' or 'flutterwave'

  const onSuccess = async (transaction) => {
    setProcessing(true);
    setErrorMsg('');
    try {
      // 1. Physically unlock the store gateway barrier in the Postgres DB
      let updateResult = await supabase
        .from('brand_profiles')
        .update({ 
          store_active: true, 
          last_transaction_id: transaction.reference,
          updated_at: new Date() 
        })
        .eq('id', user?.id);
        
      // Fallback: If the column 'last_transaction_id' is missing in the DB, 
      // we still want to activate the store regardless.
      if (updateResult.error) {
        console.warn("Primary activation update failed, attempting minimal fallback:", updateResult.error);
        updateResult = await supabase
          .from('brand_profiles')
          .update({ 
            store_active: true, 
            updated_at: new Date() 
          })
          .eq('id', user?.id);
      }
        
      if (updateResult.error) throw updateResult.error;

      // 2. Refresh the local Auth Session immediately
      const { error: authError } = await supabase.auth.updateUser({
        data: { store_active: true }
      });
      
      if (authError) throw authError;

      // 3. Complete! Navigate to Success Page
      const finalAmount = paymentMethod === 'paystack' ? 30000 : 30;
      const finalCurrency = paymentMethod === 'paystack' ? 'NGN' : 'USD';
      
      navigate('/success', { 
        state: { 
          reference: transaction.reference, 
          amount: finalAmount,
          currency: finalCurrency,
          email: user?.email,
          brandName: user?.user_metadata?.brand_name || 'Your Premium Store',
          method: paymentMethod
        } 
      });
      
    } catch (err) {
      console.error("Critical Post-Payment DB failure:", err);
      setErrorMsg("Payment processed but database error occurred. Reference: " + transaction.reference);
      setProcessing(false);
    }
  };

  const onClose = () => {
    console.log('Customer abandoned flow');
    setProcessing(false);
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
        amount: 30000 * 100,
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
        amount: 30,
        currency: "USD",
        customer: {
          email: user?.email || "pending@unbley.com",
          name: user?.user_metadata?.brand_name || "New Store Owner",
        },
        customizations: {
          title: "Unbley Activation",
          description: "Premium Storefront Activation",
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
            .fin-left { padding: 80px 24px 48px !important; border-right: none !important; border-bottom: 1px solid #3D261A !important; }
            .fin-right { padding: 48px 24px !important; }
          }
        `}</style>
        
        {/* LEFT PANE */}
        <div style={s.leftPane} className="fin-left">
          <div style={s.logo}>Unbley.</div>
          <div style={{ marginTop: 'auto', marginBottom: '10vh' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '42px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '48px', color: '#FDFBF7' }}>
              Crafting <span style={{ color: '#E8DCCF' }}>distinction</span> in the digital marketplace.
            </h1>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
              <div style={{ color: '#E8DCCF' }}><Globe size={20} /></div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', color: '#FDFBF7' }}>Custom Domain Inclusion</div>
                <div style={{ fontSize: '13px', color: '#C9BFB5' }}>Establish authority with a professional .store domain.</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE */}
        <div style={s.rightPane} className="fin-right">
          <div style={{ alignSelf: 'flex-end', fontSize: '11px', color: '#6B584C', letterSpacing: '0.05em' }}>SUPPORT</div>
          <div style={{ display: 'flex', flexDirection: 'column', margin: 'auto', maxWidth: '480px', width: '100%' }}>
            <div style={{ color: brandColor, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>FINALIZE ACTIVATION</div>
            <h2 style={s.mainTitle}>Unlock Your Brand's Potential</h2>
            <p style={{ color: '#6B584C', fontSize: '14px', lineHeight: '1.6', marginBottom: '48px' }}>
              Activate your professional store and secure your complimentary domain for the first year.
            </p>

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

            <div style={s.checkoutBox}>
              <div style={{ fontSize: '10px', color: '#6B584C', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>TOTAL DUE (FIRST YEAR)</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <div style={s.price}>
                  {paymentMethod === 'paystack' ? '₦30,000' : '$30.00'}
                </div>
                <div style={{ fontSize: '18px', color: '#8D5B36', textDecoration: 'line-through' }}>
                  {paymentMethod === 'paystack' ? '₦50,000' : '$60.00'}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: brandColor, marginTop: '8px', fontWeight: 'bold' }}>
                40% Discount Applied
              </div>
              <div style={{ fontSize: '11px', color: '#6B584C', marginTop: '12px' }}>
                Renewal Cost: {paymentMethod === 'paystack' ? '₦50,000' : '$60.00'} yearly
              </div>
            </div>

            {errorMsg && <div style={s.errorBox}>{errorMsg}</div>}

            <button style={s.payBtn} onClick={handlePayClick} disabled={processing}>
              {processing ? 'Processing...' : `Pay via ${paymentMethod === 'paystack' ? 'Paystack' : 'Flutterwave'}`}
              <ArrowRight size={20} />
            </button>

            <div style={{ textAlign: 'center', color: '#6B584C', fontSize: '11px', marginTop: '24px' }}>
              <Shield size={14} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#6A3E1F' }} />
              Secure 256-bit encrypted transaction.
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
