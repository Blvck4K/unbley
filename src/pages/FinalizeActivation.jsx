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
      navigate('/success', { 
        state: { 
          reference: transaction.reference, 
          amount: 30000, 
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
        email: user?.email || "pending@zizzystores.com",
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
        amount: 30000,
        currency: "NGN",
        customer: {
          email: user?.email || "pending@zizzystores.com",
          name: user?.user_metadata?.brand_name || "New Store Owner",
        },
        customizations: {
          title: "Zizzystores Activation",
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

  const brandColor = '#06acf8';
  
  const s = {
    page: { display: 'flex', height: '100vh', width: '100%', fontFamily: '"Inter", sans-serif', color: '#FFF', overflow: 'hidden', backgroundColor: '#080808' },
    leftPane: { flex: 1, backgroundColor: '#121212', position: 'relative', display: 'flex', flexDirection: 'column', padding: '48px 64px', overflow: 'hidden', borderRight: '1px solid #1F1F1F' },
    rightPane: { flex: 1, backgroundColor: '#080808', display: 'flex', flexDirection: 'column', padding: '48px 64px', position: 'relative', overflowY: 'auto' },
    logo: { fontFamily: '"Playfair Display", serif', fontSize: '18px', letterSpacing: '0.05em', color: '#FFF', textTransform: 'uppercase', fontWeight: 'bold' },
    mainTitle: { fontFamily: '"Playfair Display", serif', fontSize: '44px', fontWeight: '400', marginBottom: '24px', lineHeight: '1.1' },
    checkoutBox: { backgroundColor: '#111', borderLeft: `2px solid ${brandColor}`, padding: '32px', position: 'relative', marginBottom: '40px' },
    price: { fontFamily: '"Playfair Display", serif', fontSize: '36px', fontWeight: '700' },
    payBtn: { 
      width: '100%', 
      height: '56px', 
      backgroundColor: brandColor, 
      color: '#000', 
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
    errorBox: { backgroundColor: '#311', color: '#F85149', padding: '16px', borderRadius: '4px', fontSize: '12px', marginBottom: '24px', border: '1px solid #522' }
  };

  return (
    <PageTransition>
      <div style={s.page} className="fin-page">
        <style>{`
          @media (max-width: 768px) {
            .fin-page { flex-direction: column !important; height: auto !important; min-height: 100vh; overflow-y: auto !important; }
            .fin-left { padding: 80px 24px 48px !important; border-right: none !important; border-bottom: 1px solid #1F1F1F !important; }
            .fin-right { padding: 48px 24px !important; }
          }
        `}</style>
        
        {/* LEFT PANE */}
        <div style={s.leftPane} className="fin-left">
          <div style={s.logo}>Zizzystores.</div>
          <div style={{ marginTop: 'auto', marginBottom: '10vh' }}>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '48px', lineHeight: '1.2', marginBottom: '48px' }}>
              Crafting <span style={{ fontStyle: 'italic' }}>distinction</span> in the digital marketplace.
            </h1>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
              <div style={{ color: brandColor }}><Globe size={20} /></div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>Custom Domain Inclusion</div>
                <div style={{ fontSize: '13px', color: '#888' }}>Establish authority with a professional .store domain.</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE */}
        <div style={s.rightPane} className="fin-right">
          <div style={{ alignSelf: 'flex-end', fontSize: '11px', color: '#666' }}>SUPPORT</div>
          <div style={{ display: 'flex', flexDirection: 'column', margin: 'auto', maxWidth: '480px', width: '100%' }}>
            <div style={{ color: brandColor, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '16px' }}>FINALIZE ACTIVATION</div>
            <h2 style={s.mainTitle}>Unlock Your Brand's Potential</h2>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6', marginBottom: '48px' }}>
              Activate your professional store and secure your complimentary domain for the first year.
            </p>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '16px' }}>SELECT REGION</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.div 
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(6, 172, 248, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('paystack')}
                  style={{ 
                    flex: 1, padding: '16px', borderRadius: '8px', 
                    backgroundColor: paymentMethod === 'paystack' ? 'rgba(6, 172, 248, 0.05)' : '#111',
                    border: `1px solid ${paymentMethod === 'paystack' ? brandColor : '#222'}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ color: paymentMethod === 'paystack' ? brandColor : '#888', fontSize: '12px', fontWeight: 'bold' }}>Local (Paystack)</div>
                  <div style={{ color: '#555', fontSize: '10px', marginTop: '4px' }}>Nigeria Cards & Transfer</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(6, 172, 248, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPaymentMethod('flutterwave')}
                  style={{ 
                    flex: 1, padding: '16px', borderRadius: '8px', 
                    backgroundColor: paymentMethod === 'flutterwave' ? 'rgba(6, 172, 248, 0.05)' : '#111',
                    border: `1px solid ${paymentMethod === 'flutterwave' ? brandColor : '#222'}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ color: paymentMethod === 'flutterwave' ? brandColor : '#888', fontSize: '12px', fontWeight: 'bold' }}>International (FW)</div>
                  <div style={{ color: '#555', fontSize: '10px', marginTop: '4px' }}>Cards outside Nigeria</div>
                </motion.div>
              </div>
            </div>

            <div style={s.checkoutBox}>
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '8px' }}>TOTAL DUE</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <div style={s.price}>₦30,000</div>
                <div style={{ fontSize: '18px', color: '#666', textDecoration: 'line-through' }}>₦50,000</div>
              </div>
              <div style={{ fontSize: '12px', color: brandColor, marginTop: '8px', fontWeight: 'bold' }}>40% Discount Applied</div>
            </div>

            {errorMsg && <div style={s.errorBox}>{errorMsg}</div>}

            <button style={s.payBtn} onClick={handlePayClick} disabled={processing}>
              {processing ? 'Processing...' : `Pay via ${paymentMethod === 'paystack' ? 'Paystack' : 'Flutterwave'}`}
              <ArrowRight size={20} />
            </button>

            <div style={{ textAlign: 'center', color: '#666', fontSize: '11px', marginTop: '24px' }}>
              <Shield size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Secure 256-bit encrypted transaction.
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
