import React, { useState, useEffect, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [actionInProgress, setActionInProgress] = useState(null);
  const [tableNotFound, setTableNotFound] = useState(false);

  const fetchWithdrawalRequests = useCallback(async () => {
    try {
      setLoading(true);
      setTableNotFound(false);

      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });

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
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchWithdrawalRequests();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('admin_withdrawal_requests')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'withdrawal_requests' },
        () => fetchWithdrawalRequests()
      ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchWithdrawalRequests]);

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
      <div className="unbley-app-layout">
        <Sidebar profileData={{}} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <aside className="unbley-secondary-admin-nav" style={{
          width: '190px',
          minWidth: '190px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          backgroundColor: '#FAFAF9',
          borderRight: '1px solid #EAE6DF',
          padding: '88px 12px 20px',
          boxSizing: 'border-box'
        }}>
          <div style={{ padding: '0 10px 10px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em', color: '#9A7252' }}>
            ADMIN TOOLS
          </div>
          <Link
            to="/support"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 10px',
              borderRadius: '8px',
              color: '#111827',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            <MessageSquare size={17} />
            Support Chat
          </Link>
          <Link
            to="/admin/payments"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 10px',
              marginTop: '4px',
              borderRadius: '8px',
              color: '#111827',
              backgroundColor: '#F0ECE4',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            <CreditCard size={17} />
            <span style={{ flex: 1 }}>Payments</span>
            {withdrawalRequests.filter(request => request.status === 'pending').length > 0 && (
              <span style={{
                background: '#DC2626',
                color: '#FFFFFF',
                borderRadius: '9999px',
                minWidth: '18px',
                padding: '2px 5px',
                textAlign: 'center',
                fontSize: '10px',
                fontWeight: '800'
              }}>
                {withdrawalRequests.filter(request => request.status === 'pending').length > 99
                  ? '99+'
                  : withdrawalRequests.filter(request => request.status === 'pending').length}
              </span>
            )}
          </Link>
        </aside>

        <div className="unbley-main-content">
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

          {/* Main Content */}
          <main className="unbley-workspace-container">
            
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
