import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Landmark, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

const BANK_OPTIONS = [
  'Access Bank',
  'ALAT by WEMA',
  'Apex MFB',
  'ASO Savings',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'FCMB',
  'Globus Bank',
  'Greenwich Bank',
  'GTBank',
  'Jaiz Bank',
  'Keystone Bank',
  'Kuda MFB',
  'Lotus Bank',
  'Moniepoint MFB',
  'Opay',
  'Palmpay',
  'Parkway - ReadyCash',
  'Paycom',
  'Polaris Bank',
  'Providus Bank',
  'Rubies MFB',
  'Sparkle Microfinance Bank',
  'Stanbic IBTC',
  'Sterling Bank',
  'SunTrust Bank',
  'TAJ Bank',
  'Titan Trust Bank',
  'UBA',
  'Union Bank',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
  'Other Bank'
];

const BANK_CODE_MAP = {
  'Access Bank': '044',
  'ALAT by WEMA': '035',
  'Apex MFB': '770',
  'ASO Savings': '401',
  'Citibank Nigeria': '023',
  'Ecobank Nigeria': '050',
  'Fidelity Bank': '070',
  'First Bank of Nigeria': '011',
  'FCMB': '214',
  'Globus Bank': '00103',
  'Greenwich Bank': '562',
  'GTBank': '058',
  'Jaiz Bank': '301',
  'Keystone Bank': '082',
  'Kuda MFB': '50211',
  'Lotus Bank': '303',
  'Moniepoint MFB': '110',
  'Opay': '329',
  'Palmpay': '999991',
  'Parkway - ReadyCash': '311',
  'Paycom': '559',
  'Polaris Bank': '076',
  'Providus Bank': '101',
  'Rubies MFB': '125',
  'Sparkle Microfinance Bank': '377',
  'Stanbic IBTC': '221',
  'Sterling Bank': '232',
  'SunTrust Bank': '100',
  'TAJ Bank': '302',
  'Titan Trust Bank': '102',
  'UBA': '033',
  'Union Bank': '032',
  'Unity Bank': '215',
  'Wema Bank': '035',
  'Zenith Bank': '057'
};

export default function PaymentSetupModal({ isOpen = false, onClose, onComplete }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resolvingAccount, setResolvingAccount] = useState(false);
  const [error, setError] = useState(null);
  const [verificationNote, setVerificationNote] = useState('');
  const [formData, setFormData] = useState({
    bank_name: '',
    custom_bank_name: '',
    account_name: '',
    account_number: '',
    phone_number: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const selectedBankName = formData.bank_name === 'Other Bank' ? (formData.custom_bank_name || '').trim() : formData.bank_name;
  const selectedBankCode = BANK_CODE_MAP[selectedBankName] || '';

  const resolveAccountName = async (bankLabel, accountNumber) => {
    const cleanBankName = (bankLabel || '').trim();
    const cleanAccountNumber = String(accountNumber || '').replace(/\D/g, '');
    const bankCode = BANK_CODE_MAP[cleanBankName] || '';

    if (!cleanBankName || (!bankCode && cleanBankName !== 'Other Bank') || cleanAccountNumber.length < 10) {
      return;
    }

    try {
      setResolvingAccount(true);
      setError(null);
      setVerificationNote('');

      const response = await fetch('/api/payments/resolve-bank-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_number: cleanAccountNumber, bank_code: bankCode, bank_name: cleanBankName })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setVerificationNote('We could not match that account automatically. You can still type the account name manually and continue.');
        return;
      }

      const accountName = payload?.account_name?.trim();
      if (accountName) {
        setFormData(prev => ({ ...prev, account_name: accountName }));
        setVerificationNote('');
      }
    } catch (resolveErr) {
      console.warn('Bank account verification failed:', resolveErr);
      setVerificationNote('We could not match that account automatically. You can still type the account name manually and continue.');
    } finally {
      setResolvingAccount(false);
    }
  };

  React.useEffect(() => {
    async function fetchPaymentInfo() {
      if (!user || !isOpen) return;
      try {
        const { data, error: fetchErr } = await supabase
          .from('brand_profiles')
          .select('bank_name, account_name, account_number, phone_number')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchErr) {
          console.warn("PaymentSetupModal fetch warning:", fetchErr.message);
        }
        if (data) {
          setFormData(prev => ({
            ...prev,
            bank_name: data.bank_name || '',
            account_name: data.account_name || '',
            account_number: data.account_number || '',
            phone_number: data.phone_number || user.user_metadata?.phone || ''
          }));
        } else if (user.user_metadata?.phone) {
          setFormData(prev => ({ ...prev, phone_number: user.user_metadata.phone }));
        }
      } catch (e) {
        console.error("Error fetching payment info:", e);
      }
    }
    fetchPaymentInfo();
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bankToSave = selectedBankName;

    if (!bankToSave || !formData.account_number || !formData.phone_number) {
      setError('Please fill in the required bank and contact details');
      return;
    }

    if (formData.account_number.replace(/\D/g, '').length < 10) {
      setError('Account number must be at least 10 digits');
      return;
    }

    if (!formData.account_name) {
      setError('Please enter the account holder name or wait for automatic verification to fill it in.');
      return;
    }

    setLoading(true);
    try {
      const { error: saveError } = await supabase
        .from('brand_profiles')
        .upsert({
          id: user.id,
          email_address: user.email || '',
          brand_name: user.user_metadata?.brand_name || user.user_metadata?.full_name || 'Your Brand',
          owner_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          bank_name: bankToSave,
          bank_code: selectedBankCode,
          account_name: formData.account_name,
          account_number: formData.account_number,
          phone_number: formData.phone_number,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (saveError) throw saveError;

      onComplete?.();
      handleClose();
    } catch (err) {
      setError(err.message || 'Could not save payment details.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ bank_name: '', custom_bank_name: '', account_name: '', account_number: '', phone_number: '' });
    setError(null);
    setVerificationNote('');
    setResolvingAccount(false);
    onClose?.();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div
        className="payment-setup-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000000,
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #EAE3D9',
            boxShadow: '0 20px 50px rgba(34, 21, 16, 0.2)',
            maxWidth: '500px',
            width: '100%',
            overflow: 'hidden',
            fontFamily: '"Inter", sans-serif'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '28px 28px 20px',
            borderBottom: '1px solid #EAE3D9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#111827',
                margin: 0,
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Landmark size={24} color="#6A3E1F" />
                Setup Payment Wallet
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#6B7280',
                margin: 0
              }}>
                Add your bank details to receive payments
              </p>
            </div>
            <button
              onClick={handleClose}
              style={{
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                color: '#6B7280',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.color = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px 28px' }}>
            {error && (
              <div style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{
                  fontSize: '13px',
                  color: '#991B1B',
                  margin: 0
                }}>
                  {error}
                </p>
              </div>
            )}

            {verificationNote && !error && (
              <div style={{
                backgroundColor: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <AlertCircle size={18} color="#A16207" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{
                  fontSize: '12px',
                  color: '#92400E',
                  margin: 0
                }}>
                  {verificationNote}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Phone Number */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="e.g., +234 801 234 5678"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6A3E1F';
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Bank Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Bank Name *
                </label>
                <select
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={(e) => {
                    const value = e.target.value;
                    const nextAccountNumber = formData.account_number;

                    setFormData(prev => ({
                      ...prev,
                      bank_name: value,
                      custom_bank_name: value === 'Other Bank' ? prev.custom_bank_name : ''
                    }));
                    setError(null);

                    if (value && value !== 'Other Bank' && nextAccountNumber.replace(/\D/g, '').length >= 10) {
                      resolveAccountName(value, nextAccountNumber);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    backgroundColor: '#FFFFFF',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6A3E1F';
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select your bank</option>
                  {BANK_OPTIONS.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>

                {formData.bank_name === 'Other Bank' && (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '6px'
                    }}>
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="custom_bank_name"
                      value={formData.custom_bank_name}
                      onChange={(e) => {
                        const value = e.target.value;
                        const nextAccountNumber = formData.account_number;
                        handleInputChange(e);
                        if (value.trim() && nextAccountNumber.replace(/\D/g, '').length >= 10) {
                          resolveAccountName(value, nextAccountNumber);
                        }
                      }}
                      placeholder="Enter your bank name"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        transition: 'all 0.15s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#6A3E1F';
                        e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#D1D5DB';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Account Number */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Account Number *
                </label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={(e) => {
                    const nextValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                    const activeBankName = formData.bank_name === 'Other Bank' ? formData.custom_bank_name : formData.bank_name;
                    setFormData(prev => ({ ...prev, account_number: nextValue }));
                    setError(null);

                    if (nextValue.length >= 10 && activeBankName) {
                      resolveAccountName(activeBankName, nextValue);
                    }
                  }}
                  placeholder="Your 10-digit account number"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6A3E1F';
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Account Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '6px'
                }}>
                  Account Name *
                </label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleInputChange}
                  placeholder="Your full name or business name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6A3E1F';
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 62, 31, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Info Box */}
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBEF63',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '8px'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: '#15803D',
                  margin: 0
                }}>
                  ✓ Your payment information is encrypted and secure. We never share your bank details with third parties.
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || resolvingAccount}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: loading || resolvingAccount ? '#D1D5DB' : '#6A3E1F',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    cursor: loading || resolvingAccount ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && !resolvingAccount) {
                      e.currentTarget.style.backgroundColor = '#5a3219';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && !resolvingAccount) {
                      e.currentTarget.style.backgroundColor = '#6A3E1F';
                    }
                  }}
                >
                  {resolvingAccount ? 'Verifying account...' : (loading ? 'Saving...' : 'Save & Continue')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}
