import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, ArrowLeft, ShieldCheck, Mail, Phone, MapPin, Package } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { motion } from 'framer-motion';

export default function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, warning } = location.state || {};

  if (!order) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
        <h2 style={{ color: '#111' }}>No Order Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    const receiptContent = `
========================================
         ZIZZYSTORES RECEIPT
========================================

ORDER NUMBER: ${order.order_number}
BRAND:        ${order.brand_name || 'ZizzyStores Vendor'}
DATE:         ${new Date().toLocaleString()}
STATUS:       PAID / SUCCESSFUL

----------------------------------------
CUSTOMER DETAILS:
----------------------------------------
NAME:         ${order.customer_name}
EMAIL:        ${order.customer_email}
PHONE:        ${order.customer_phone}
ADDRESS:      ${order.customer_address}

----------------------------------------
ORDER SUMMARY:
----------------------------------------
${order.items.map(item => `${item.qty}x ${item.name} - ₦${(item.price * item.qty).toLocaleString()}`).join('\n')}

TOTAL AMOUNT: ₦${order.total_amount.toLocaleString()}
PAYMENT:      ${order.payment_method.toUpperCase()}

----------------------------------------
TRANSACTION ID:
${order.transaction_id}

----------------------------------------
Thank you for your purchase.
Your order is being processed.
========================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${order.order_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const brandColor = '#06acf8';

  return (
    <PageTransition>
      <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', padding: '60px 20px', fontFamily: '"Inter", sans-serif' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ width: '80px', height: '80px', backgroundColor: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#FFF' }}
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#111', marginBottom: '16px' }}>Order Placed Successfully!</h1>
            <p style={{ color: '#666', fontSize: '16px' }}>Thank you for your purchase. We've received your order and it's being processed.</p>
            
            {warning && <div style={{ marginTop: '16px', color: '#F59E0B', fontSize: '13px', fontWeight: '600' }}>⚠️ {warning}</div>}
          </div>

          {/* Core Warning/Recommendation */}
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #F59E0B', borderRadius: '12px', padding: '20px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ShieldCheck size={24} color="#F59E0B" />
            <p style={{ color: '#92400E', fontWeight: '700', fontSize: '14px', margin: 0 }}>
              I recommend you download your receipt and keep it safe for your records.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Order Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={18} color={brandColor} /> Order Summary
                </h3>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                    <span style={{ color: '#666' }}>{item.qty}x {item.name}</span>
                    <span style={{ fontWeight: '600' }}>₦{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #EEE', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700' }}>Total Paid</span>
                  <span style={{ fontWeight: '800', color: brandColor, fontSize: '18px' }}>₦{order.total_amount.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Transaction Info</h3>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '2' }}>
                  <div><span style={{ color: '#999' }}>Order ID:</span> {order.order_number}</div>
                  <div><span style={{ color: '#999' }}>Transaction ID:</span> <code style={{ backgroundColor: '#F4F4F5', padding: '2px 4px', borderRadius: '4px' }}>{order.transaction_id}</code></div>
                  <div><span style={{ color: '#999' }}>Payment Method:</span> {order.payment_method.toUpperCase()}</div>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>Customer Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Mail size={16} color="#999" />
                    <div>
                      <div style={{ fontSize: '10px', color: '#999', fontWeight: '700', textTransform: 'uppercase' }}>Email</div>
                      <div style={{ fontSize: '14px', color: '#111' }}>{order.customer_email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Phone size={16} color="#999" />
                    <div>
                      <div style={{ fontSize: '10px', color: '#999', fontWeight: '700', textTransform: 'uppercase' }}>Phone</div>
                      <div style={{ fontSize: '14px', color: '#111' }}>{order.customer_phone}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <MapPin size={16} color="#999" />
                    <div>
                      <div style={{ fontSize: '10px', color: '#999', fontWeight: '700', textTransform: 'uppercase' }}>Shipping Address</div>
                      <div style={{ fontSize: '14px', color: '#111', lineHeight: '1.4' }}>{order.customer_address}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <button 
                  onClick={handleDownloadReceipt}
                  style={{ width: '100%', backgroundColor: '#111', color: '#FFF', border: 'none', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                >
                  <Download size={20} /> Download Your Receipt
                </button>
                <button 
                  onClick={() => navigate('/')}
                  style={{ width: '100%', backgroundColor: 'transparent', color: '#666', border: 'none', marginTop: '16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <ArrowLeft size={14} /> Back to Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .container { padding: 0 16px; }
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PageTransition>
  );
}
