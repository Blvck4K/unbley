import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  CreditCard, 
  ArrowLeft, 
  Check,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';
import Sidebar from '../components/Sidebar';
import PageTransition from '../components/PageTransition';

export default function AdminPayments() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [merchantTransactions, setMerchantTransactions] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({
    processedPayments: 0,
    pendingFunds: 0,
    availableFunds: 0,
    totalPayouts: 0,
    successfulPayouts: 0,
    failedPayouts: 0,
    refunds: 0,
    platformFees: 0
  });
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [actionInProgress, setActionInProgress] = useState(null);
  const [tableNotFound, setTableNotFound] = useState(false);
  const [financialTableNotFound, setFinancialTableNotFound] = useState(false);
  const refreshTimerRef = useRef(null);
  const requestRef = useRef(0);

  const fetchWithdrawalRequests = useCallback(async () => {
    const requestId = ++requestRef.current;
    try {
      setLoading(true);
      setTableNotFound(false);

      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestId !== requestRef.current) return;
      if (error) {
        if (
          error.code === 'PGRST116' ||
          error.code === '42P01' ||
          error.message?.toLowerCase().includes('not found') ||
          error.message?.toLowerCase().includes('does not exist')
        ) {
          setTableNotFound(true);
          setWithdrawalRequests([]);
        } else {
          console.error('Error fetching withdrawal requests:', error);
          toast?.error('Failed to load withdrawal requests');
        }
      } else {
        setWithdrawalRequests(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setTableNotFound(true);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [toast]);

  const fetchFinancialSummary = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('merchant_financial_transactions')
        .select('id, merchant_id, type, amount, status, created_at, payment_provider, metadata')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        if (
          error.code === 'PGRST116' ||
          error.code === '42P01' ||
          error.message?.toLowerCase().includes('not found') ||
          error.message?.toLowerCase().includes('does not exist')
        ) {
          setFinancialTableNotFound(true);
          setMerchantTransactions([]);
          setFinancialSummary({
            processedPayments: 0,
            pendingFunds: 0,
            availableFunds: 0,
            totalPayouts: 0,
            successfulPayouts: 0,
            failedPayouts: 0,
            refunds: 0,
            platformFees: 0
          });
          return;
        }
        throw error;
      }

      const entries = data || [];
      const fromLedgerMinorUnits = (amount) => Number(amount || 0) / 100;
      const totalSales = entries.filter(item => item.type === 'PAYMENT' && Number(item.amount) > 0).reduce((sum, item) => sum + fromLedgerMinorUnits(item.amount), 0);
      const pendingFunds = entries.filter(item => item.type === 'PAYMENT' && item.status === 'PENDING').reduce((sum, item) => sum + fromLedgerMinorUnits(item.amount), 0);
      const availableFunds = entries.filter(item => item.type === 'PAYMENT' && (item.status === 'AVAILABLE' || item.status === 'POSTED')).reduce((sum, item) => sum + fromLedgerMinorUnits(item.amount), 0);
      const totalPayouts = entries.filter(item => item.type === 'PAYOUT').reduce((sum, item) => sum + fromLedgerMinorUnits(Math.abs(Number(item.amount || 0))), 0);
      const successfulPayouts = entries.filter(item => item.type === 'PAYOUT' && item.status === 'SUCCESS').reduce((sum, item) => sum + fromLedgerMinorUnits(Math.abs(Number(item.amount || 0))), 0);
      const failedPayouts = entries.filter(item => item.type === 'PAYOUT_FAILED').reduce((sum, item) => sum + fromLedgerMinorUnits(Math.abs(Number(item.amount || 0))), 0);
      const refunds = entries.filter(item => item.type === 'REFUND').reduce((sum, item) => sum + fromLedgerMinorUnits(Math.abs(Number(item.amount || 0))), 0);
      const platformFees = entries.filter(item => item.type === 'PLATFORM_FEE').reduce((sum, item) => sum + fromLedgerMinorUnits(Math.abs(Number(item.amount || 0))), 0);

      setFinancialSummary({
        processedPayments: totalSales,
        pendingFunds,
        availableFunds,
        totalPayouts,
        successfulPayouts,
        failedPayouts,
        refunds,
        platformFees
      });
      setMerchantTransactions(entries);
      setFinancialTableNotFound(false);
    } catch (err) {
      console.error('Failed to load financial summary:', err);
      setFinancialTableNotFound(true);
    }
  }, []);

  const scheduleWithdrawalRefresh = useCallback(() => {
    if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = window.setTimeout(() => {
      refreshTimerRef.current = null;
      fetchWithdrawalRequests();
    }, 400);
  }, [fetchWithdrawalRequests]);

  useEffect(() => {
    fetchWithdrawalRequests();
    fetchFinancialSummary();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('admin_withdrawal_requests')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'withdrawal_requests' },
        scheduleWithdrawalRefresh
      ).subscribe();

    return () => {
      if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
      supabase.removeChannel(channel);
    };
  }, [fetchWithdrawalRequests, fetchFinancialSummary, scheduleWithdrawalRefresh]);

  useEffect(() => {
    const fetchUnreadSupport = async () => {
      const { count } = await supabase
        .from('concierge_messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender', 'user')
        .is('read_at', null);
      setUnreadSupportCount(count ?? 0);
    };
    fetchUnreadSupport();
  }, []);

  const updateStatus = async (requestId, newStatus) => {
    setActionInProgress(requestId);
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast?.success(`Request marked as ${newStatus}`);
      fetchWithdrawalRequests();
    } catch (err) {
      console.error('Error updating status:', err);
      toast?.error('Failed to update request status');
    } finally {
      setActionInProgress(null);
    }
  };

  const formatMoney = (amount) => '₦' + Number(amount || 0).toLocaleString();
  const fromLedgerMinorUnits = (amount) => Number(amount || 0) / 100;

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: '#FEF3C7', color: '#92400E', label: 'PENDING' };
      case 'approved': return { bg: '#DBEAFE', color: '#1E40AF', label: 'APPROVED' };
      case 'paid_out': return { bg: '#DCFCE7', color: '#15803D', label: 'PAID OUT' };
      default: return { bg: '#E5E7EB', color: '#374151', label: status?.toUpperCase() };
    }
  };

  const filteredRequests = selectedTab === 'all' 
    ? withdrawalRequests
    : withdrawalRequests.filter(req => req.status === selectedTab);

  if (!isAdmin) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#374151' }}>
        Access denied.
      </div>
    );
  }

  const stats = {
    pending: withdrawalRequests.filter(r => r.status === 'pending').length,
    approved: withdrawalRequests.filter(r => r.status === 'approved').length,
    paid_out: withdrawalRequests.filter(r => r.status === 'paid_out').length,
    total: withdrawalRequests.reduce((sum, r) => sum + (r.amount || 0), 0),
    pending_amount: withdrawalRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + (r.amount || 0), 0)
  };

  return (
    <PageTransition>
      <div className="unbley-app-layout admin-payments-page">
        <Sidebar profileData={{}} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="unbley-main-content admin-main-content">
          {/* Top Header */}
          <header className="unbley-top-header">
            <div className="unbley-header-left">
              <div>
                <div className="unbley-header-title-row">
                  <h1 className="unbley-header-title">Withdrawal Payments</h1>
                  <span className="unbley-live-badge">
                    <span className="unbley-live-dot" />
                    LIVE
                  </span>
                </div>
                <p className="unbley-header-subtitle">Manage seller withdrawal requests and payment statuses</p>
              </div>
            </div>

            <div className="unbley-header-actions">
              <Link to="/dashboard" className="unbley-btn-white">
                <ArrowLeft size={14} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </header>

          <nav className="support-admin-switcher" aria-label="Admin tools">
            <Link to="/support">
              <MessageSquare size={16} />
              <span>Support Chat</span>
              {unreadSupportCount > 0 && (
                <span className="support-admin-switcher-badge">
                  {unreadSupportCount > 99 ? '99+' : unreadSupportCount}
                </span>
              )}
            </Link>
            <Link to="/admin/payments" className="active">
              <CreditCard size={16} />
              <span>Payments</span>
              {withdrawalRequests.filter(request => request.status === 'pending').length > 0 && (
                <span className="support-admin-switcher-badge">
                  {withdrawalRequests.filter(request => request.status === 'pending').length > 99
                    ? '99+'
                    : withdrawalRequests.filter(request => request.status === 'pending').length}
                </span>
              )}
            </Link>
          </nav>

          {/* Main Content */}
          <main className="unbley-workspace-container">
            <div className="unbley-metrics-grid" style={{ marginBottom: '20px' }}>
              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-cream" style={{ color: '#F59E0B' }}>
                    <CreditCard size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">PROCESSED PAYMENTS</div>
                  <div className="unbley-metric-value">{formatMoney(financialSummary.processedPayments)}</div>
                  <div className="unbley-metric-subtext">Total verified merchant sales</div>
                </div>
              </div>

              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-blue" style={{ color: '#3B82F6' }}>
                    <Check size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">PENDING MERCHANT FUNDS</div>
                  <div className="unbley-metric-value">{formatMoney(financialSummary.pendingFunds)}</div>
                  <div className="unbley-metric-subtext">Awaiting settlement date</div>
                </div>
              </div>

              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-cream" style={{ color: '#10B981' }}>
                    <CreditCard size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">AVAILABLE FUNDS</div>
                  <div className="unbley-metric-value">{formatMoney(financialSummary.availableFunds)}</div>
                  <div className="unbley-metric-subtext">Ready for payout</div>
                </div>
              </div>

              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-blue" style={{ color: '#7C3AED' }}>
                    <Check size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">TOTAL PAYOUTS</div>
                  <div className="unbley-metric-value">{formatMoney(financialSummary.totalPayouts)}</div>
                  <div className="unbley-metric-subtext">All merchant transfers</div>
                </div>
              </div>
            </div>

            {!financialTableNotFound && merchantTransactions.length > 0 && (
              <div className="unbley-table-card" style={{ marginBottom: '20px' }}>
                <div className="unbley-table-header-bar">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#111827', margin: 0 }}>Financial Activity</h3>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>Recent payment, payout, refund, and platform fee events</p>
                  </div>
                </div>
                <table className="unbley-table">
                  <thead>
                    <tr>
                      <th>TYPE</th>
                      <th>MERCHANT</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {merchantTransactions.slice(0, 8).map(transaction => (
                      <tr key={transaction.id}>
                        <td style={{ fontWeight: '700', color: '#111827' }}>{transaction.type}</td>
                        <td style={{ fontSize: '12px', color: '#6B7280' }}>{transaction.merchant_id?.slice(0, 8) || '—'}</td>
                        <td style={{ fontWeight: '800', color: '#111827' }}>{formatMoney(fromLedgerMinorUnits(Math.abs(Number(transaction.amount || 0))))}</td>
                        <td>
                          <span style={{
                            backgroundColor: transaction.status === 'SUCCESS' ? '#DCFCE7' : transaction.status === 'PENDING' ? '#FEF3C7' : '#E5E7EB',
                            color: transaction.status === 'SUCCESS' ? '#15803D' : transaction.status === 'PENDING' ? '#92400E' : '#374151',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700'
                          }}>{String(transaction.status || 'POSTED')}</span>
                        </td>
                        <td style={{ fontSize: '11px', color: '#9CA3AF' }}>{transaction.created_at ? new Date(transaction.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="unbley-metrics-grid" style={{ marginBottom: '20px' }}>
              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-cream" style={{ color: '#10B981' }}>
                    <Check size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">SUCCESSFUL PAYOUTS</div>
                  <div className="unbley-metric-value">{formatMoney(financialSummary.successfulPayouts)}</div>
                  <div className="unbley-metric-subtext">Completed transfer value</div>
                </div>
              </div>

              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-blue" style={{ color: '#F43F5E' }}>
                    <AlertCircle size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">FAILED PAYOUTS</div>
                  <div className="unbley-metric-value">{formatMoney(financialSummary.failedPayouts)}</div>
                  <div className="unbley-metric-subtext">Escalated or retriable amounts</div>
                </div>
              </div>

              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-cream" style={{ color: '#F59E0B' }}>
                    <Check size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">REFUNDS</div>
                  <div className="unbley-metric-value">{formatMoney(financialSummary.refunds)}</div>
                  <div className="unbley-metric-subtext">Returned customer amounts</div>
                </div>
              </div>

              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-blue" style={{ color: '#6B7280' }}>
                    <CreditCard size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">PLATFORM FEES</div>
                  <div className="unbley-metric-value">{formatMoney(financialSummary.platformFees)}</div>
                  <div className="unbley-metric-subtext">Recorded commission collected</div>
                </div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="unbley-metrics-grid">
              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-cream" style={{ color: '#F59E0B' }}>
                    <CreditCard size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">TOTAL PENDING</div>
                  <div className="unbley-metric-value">{formatMoney(stats.pending_amount)}</div>
                  <div className="unbley-metric-subtext">{stats.pending} request{stats.pending !== 1 ? 's' : ''} awaiting approval</div>
                </div>
              </div>

              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-blue" style={{ color: '#3B82F6' }}>
                    <Check size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">APPROVED</div>
                  <div className="unbley-metric-value">{stats.approved}</div>
                  <div className="unbley-metric-subtext">Request{stats.approved !== 1 ? 's' : ''} approved, pending payout</div>
                </div>
              </div>

              <div className="unbley-metric-card">
                <div className="unbley-metric-top">
                  <div className="unbley-icon-box-cream" style={{ color: '#10B981' }}>
                    <Check size={18} />
                  </div>
                </div>
                <div>
                  <div className="unbley-metric-label">PAID OUT</div>
                  <div className="unbley-metric-value">{stats.paid_out}</div>
                  <div className="unbley-metric-subtext">Request{stats.paid_out !== 1 ? 's' : ''} successfully completed</div>
                </div>
              </div>
            </div>

            {/* Table Card */}
            <div className="unbley-table-card">
              {/* Filter Tabs */}
              <div style={{
                display: 'flex',
                gap: '12px',
                borderBottom: '1px solid #E5E7EB',
                padding: '16px 20px',
                overflow: 'auto',
                WebkitOverflowScrolling: 'touch'
              }}>
                {[
                  { key: 'all', label: 'All Requests', count: withdrawalRequests.length },
                  { key: 'pending', label: 'Pending', count: stats.pending },
                  { key: 'approved', label: 'Approved', count: stats.approved },
                  { key: 'paid_out', label: 'Paid Out', count: stats.paid_out }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: selectedTab === tab.key ? '2px solid #6A3E1F' : '1px solid #E5E7EB',
                      backgroundColor: selectedTab === tab.key ? '#FFFBF8' : '#FFFFFF',
                      color: selectedTab === tab.key ? '#6A3E1F' : '#6B7280',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Empty State */}
              {tableNotFound && (
                <div style={{
                  padding: '64px 20px',
                  textAlign: 'center',
                  color: '#9CA3AF'
                }}>
                  <AlertCircle size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <div style={{ fontWeight: '700', color: '#374151', marginBottom: '6px', fontSize: '16px' }}>
                    Table Not Found
                  </div>
                  <p style={{ fontSize: '13px', marginBottom: '16px' }}>
                    The withdrawal_requests table doesn't exist yet in the database.
                  </p>
                  <code style={{
                    backgroundColor: '#F3F4F6',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    display: 'inline-block'
                  }}>
                    Create: withdrawal_requests table
                  </code>
                </div>
              )}

              {/* Loading State */}
              {loading && !tableNotFound && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                  <div style={{ fontSize: '14px' }}>Loading withdrawal requests...</div>
                </div>
              )}

              {/* Requests Table */}
              {!loading && !tableNotFound && filteredRequests.length === 0 && (
                <div style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontSize: '14px'
                }}>
                  No {selectedTab !== 'all' ? selectedTab : ''} withdrawal requests
                </div>
              )}

              {!loading && !tableNotFound && filteredRequests.length > 0 && (
                <table className="unbley-table">
                  <thead>
                    <tr>
                      <th>BRAND NAME</th>
                      <th>AMOUNT</th>
                      <th>BANK DETAILS</th>
                      <th>DATE REQUESTED</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map(request => {
                      const statusObj = getStatusColor(request.status);
                      return (
                        <tr key={request.id}>
                          <td style={{ fontWeight: '700', color: '#111827' }}>
                            {request.brand_name || 'Unknown Brand'}
                          </td>
                          <td style={{ fontWeight: '800', color: '#111827' }}>
                            {formatMoney(request.amount)}
                          </td>
                          <td style={{ fontSize: '12px', color: '#6B7280' }}>
                            <div>{request.bank_name}</div>
                            <div style={{ fontWeight: '600', marginTop: '2px' }}>{request.account_number}</div>
                            <div style={{ fontSize: '11px', marginTop: '2px' }}>{request.account_name}</div>
                          </td>
                          <td style={{ fontSize: '11px', color: '#9CA3AF' }}>
                            {request.created_at 
                              ? new Date(request.created_at).toLocaleDateString('en-GB', { 
                                  day: 'numeric', month: 'short', year: '2-digit',
                                  hour: '2-digit', minute: '2-digit'
                                })
                              : '—'
                            }
                          </td>
                          <td>
                            <span style={{
                              backgroundColor: statusObj.bg,
                              color: statusObj.color,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}>
                              {statusObj.label}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {request.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateStatus(request.id, 'approved')}
                                    disabled={actionInProgress === request.id}
                                    style={{
                                      padding: '6px 12px',
                                      backgroundColor: '#3B82F6',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      cursor: actionInProgress === request.id ? 'not-allowed' : 'pointer',
                                      opacity: actionInProgress === request.id ? 0.6 : 1
                                    }}
                                  >
                                    {actionInProgress === request.id ? 'Processing...' : 'Approve'}
                                  </button>
                                </>
                              )}
                              {request.status === 'approved' && (
                                <button
                                  onClick={() => updateStatus(request.id, 'paid_out')}
                                  disabled={actionInProgress === request.id}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    cursor: actionInProgress === request.id ? 'not-allowed' : 'pointer',
                                    opacity: actionInProgress === request.id ? 0.6 : 1
                                  }}
                                >
                                  {actionInProgress === request.id ? 'Processing...' : 'Mark Paid'}
                                </button>
                              )}
                              {request.status === 'paid_out' && (
                                <span style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#F0FDF4',
                                  color: '#15803D',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '600'
                                }}>
                                  ✓ Completed
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
}
