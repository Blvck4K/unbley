import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, Search, Store, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import PageTransition from '../components/PageTransition';
import { useToast } from '../context/ToastContext';

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const escapeCsv = (value) => {
  const text = formatValue(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export default function AdminStoreOwners() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const refreshTimerRef = useRef(null);
  const requestRef = useRef(0);

  const fetchOwners = useCallback(async () => {
    const requestId = ++requestRef.current;
    setLoading(true);
    const { data, error } = await supabase
      .from('brand_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (requestId !== requestRef.current) return;
    if (error) {
      console.error('Could not load store owners:', error);
      toast?.error('Could not load store owners. Apply the admin read policy first.');
    } else {
      setOwners(data || []);
      setLastUpdated(new Date());
    }
    if (requestId === requestRef.current) setLoading(false);
  }, [toast]);

  const scheduleOwnersRefresh = useCallback(() => {
    if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = window.setTimeout(() => {
      refreshTimerRef.current = null;
      fetchOwners();
    }, 400);
  }, [fetchOwners]);

  useEffect(() => {
    if (!isAdmin) return undefined;
    const initialFetch = window.setTimeout(() => fetchOwners(), 0);
    const channel = supabase
      .channel('admin_store_owners')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'brand_profiles' }, scheduleOwnersRefresh)
      .subscribe();
    return () => {
      window.clearTimeout(initialFetch);
      if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
      supabase.removeChannel(channel);
    };
  }, [fetchOwners, isAdmin, scheduleOwnersRefresh]);

  const columns = useMemo(() => {
    const keys = new Set();
    owners.forEach((owner) => Object.keys(owner).forEach((key) => keys.add(key)));
    return [...keys];
  }, [owners]);

  const filteredOwners = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return owners;
    return owners.filter((owner) => columns.some((column) => formatValue(owner[column]).toLowerCase().includes(normalizedQuery)));
  }, [columns, owners, query]);

  const downloadCsv = () => {
    if (!columns.length) return;
    const csv = [
      columns.map(escapeCsv).join(','),
      ...filteredOwners.map((owner) => columns.map((column) => escapeCsv(owner[column])).join(','))
    ].join('\n');
    const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unbley-store-owners-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Access denied.</div>;
  }

  return (
    <PageTransition>
      <div className="unbley-app-layout admin-store-owners-page">
        <Sidebar profileData={{}} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="unbley-main-content admin-main-content">
          <header className="unbley-top-header">
            <div className="unbley-header-left">
              <div>
                <div className="unbley-header-title-row">
                  <h1 className="unbley-header-title">Store Owners</h1>
                  <span className="unbley-live-badge"><span className="unbley-live-dot" /> ADMIN</span>
                </div>
                <p className="unbley-header-subtitle">View every store owner profile and its current details.</p>
              </div>
            </div>
            <div className="unbley-header-actions">
              <Link to="/dashboard" className="unbley-btn-white"><ArrowLeft size={14} /> Back to Dashboard</Link>
              <button type="button" className="unbley-btn-primary" onClick={downloadCsv} disabled={!filteredOwners.length}>
                <Download size={15} /> Download CSV
              </button>
            </div>
          </header>

          <main className="unbley-workspace-container">
            <div className="store-owners-toolbar">
              <label className="store-owners-search">
                <Search size={17} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search every owner detail..." aria-label="Search store owners" />
              </label>
              <div className="store-owners-toolbar-meta">
                <span><Store size={15} /> {filteredOwners.length} of {owners.length} owners</span>
                <button type="button" className="store-owners-refresh" onClick={fetchOwners} disabled={loading} title="Refresh store owners">
                  <RefreshCw size={15} className={loading ? 'store-owners-spin' : ''} /> Refresh
                </button>
              </div>
            </div>

            <div className="store-owners-table-wrap">
              <table className="store-owners-table">
                <thead><tr>{columns.map((column) => <th key={column}>{column.replaceAll('_', ' ')}</th>)}</tr></thead>
                <tbody>
                  {loading && <tr><td colSpan={Math.max(columns.length, 1)} className="store-owners-empty">Loading store owners...</td></tr>}
                  {!loading && filteredOwners.map((owner, index) => (
                    <tr key={owner.id || index}>{columns.map((column) => <td key={column} title={formatValue(owner[column])}>{formatValue(owner[column])}</td>)}</tr>
                  ))}
                  {!loading && !filteredOwners.length && <tr><td colSpan={Math.max(columns.length, 1)} className="store-owners-empty">No store owners match your search.</td></tr>}
                </tbody>
              </table>
            </div>
            <p className="store-owners-footnote">{lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}.` : 'Waiting for data.'} Changes in Supabase appear here automatically.</p>
          </main>
        </div>
      </div>
    </PageTransition>
  );
}
