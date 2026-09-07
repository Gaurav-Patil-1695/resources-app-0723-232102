import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const tokens = {
  colorCanvas: '#f8f9fa',
  colorSurface: '#ffffff',
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorBorder: '#868e96',
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorSuccess: '#37b24d',
  colorSuccessSubtle: '#d3f9d8',
  colorError: '#f03e3e',
  colorErrorSubtle: '#ffe3e3',
  colorWarning: '#fd7e14',
  colorWarningSubtle: '#fff4e6',
  colorDisabledBg: '#e9ecef',
  colorDisabledText: '#adb5bd',
  fontSans: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  radiusMd: '10px',
  radiusSm: '6px',
  radiusXs: '3px',
  radiusFull: '9999px',
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: tokens.colorWarningSubtle, color: tokens.colorWarning },
  approved: { label: 'Approved', bg: tokens.colorSuccessSubtle, color: tokens.colorSuccess },
  rejected: { label: 'Rejected', bg: tokens.colorErrorSubtle, color: tokens.colorError },
  processing: { label: 'Processing', bg: tokens.colorPrimarySubtle, color: tokens.colorPrimary },
};

const MOCK_RETURNS = [
  {
    id: 'RET-001',
    orderId: 'ORD-10045',
    customer: 'Alice Johnson',
    email: 'alice@example.com',
    reason: 'Defective product',
    status: 'pending',
    requestedAt: '2024-06-01T10:23:00Z',
    amount: 89.99,
  },
  {
    id: 'RET-002',
    orderId: 'ORD-10031',
    customer: 'Bob Smith',
    email: 'bob@example.com',
    reason: 'Wrong item received',
    status: 'approved',
    requestedAt: '2024-06-02T14:05:00Z',
    amount: 45.00,
  },
  {
    id: 'RET-003',
    orderId: 'ORD-10028',
    customer: 'Carol White',
    email: 'carol@example.com',
    reason: 'Changed mind',
    status: 'rejected',
    requestedAt: '2024-06-03T09:17:00Z',
    amount: 120.50,
  },
  {
    id: 'RET-004',
    orderId: 'ORD-10067',
    customer: 'David Lee',
    email: 'david@example.com',
    reason: 'Not as described',
    status: 'pending',
    requestedAt: '2024-06-04T11:45:00Z',
    amount: 34.99,
  },
  {
    id: 'RET-005',
    orderId: 'ORD-10072',
    customer: 'Eva Martinez',
    email: 'eva@example.com',
    reason: 'Arrived damaged',
    status: 'processing',
    requestedAt: '2024-06-05T08:30:00Z',
    amount: 199.00,
  },
];

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, bg: tokens.colorDisabledBg, color: tokens.colorMuted };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: tokens.radiusFull,
        background: config.bg,
        color: config.color,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: tokens.fontSans,
      }}
    >
      {config.label}
    </span>
  );
}

export default function AdminReturnList() {
  const navigate = useNavigate();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setReturns(MOCK_RETURNS);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = returns.filter((r) => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.orderId.toLowerCase().includes(q) ||
      r.customer.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const styles = {
    page: {
      minHeight: '100vh',
      background: tokens.colorCanvas,
      fontFamily: tokens.fontSans,
      color: tokens.colorBody,
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    header: {
      marginBottom: '24px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: tokens.colorInk,
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      margin: '0 0 4px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: tokens.colorMuted,
      margin: 0,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    searchWrapper: {
      position: 'relative',
      flex: '1',
      minWidth: '200px',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '16px',
      height: '16px',
      opacity: 0.5,
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      padding: '10px 12px 10px 36px',
      border: `1px solid ${tokens.colorBorder}`,
      borderRadius: tokens.radiusSm,
      fontSize: '14px',
      fontFamily: tokens.fontSans,
      color: tokens.colorInk,
      background: tokens.colorSurface,
      outline: 'none',
      boxSizing: 'border-box',
    },
    filterSelect: {
      padding: '10px 12px',
      border: `1px solid ${tokens.colorBorder}`,
      borderRadius: tokens.radiusSm,
      fontSize: '14px',
      fontFamily: tokens.fontSans,
      color: tokens.colorInk,
      background: tokens.colorSurface,
      outline: 'none',
      cursor: 'pointer',
      minWidth: '140px',
    },
    tableWrapper: {
      background: tokens.colorSurface,
      borderRadius: tokens.radiusMd,
      border: `1px solid ${tokens.colorBorder}`,
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: tokens.colorMuted,
      borderBottom: `1px solid ${tokens.colorBorder}`,
      background: tokens.colorCanvas,
    },
    td: {
      padding: '14px 16px',
      fontSize: '14px',
      color: tokens.colorBody,
      borderBottom: `1px solid #dee2e6`,
      verticalAlign: 'middle',
    },
    trHover: {
      cursor: 'pointer',
    },
    idCode: {
      fontFamily: tokens.fontMono,
      fontSize: '13px',
      color: tokens.colorInk,
      fontWeight: '500',
    },
    actionBtn: {
      padding: '6px 14px',
      background: tokens.colorPrimary,
      color: '#ffffff',
      border: 'none',
      borderRadius: tokens.radiusSm,
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: tokens.fontSans,
      transition: 'background 0.15s',
    },
    emptyState: {
      textAlign: 'center',
      padding: '64px 24px',
      color: tokens.colorMuted,
    },
    emptyImg: {
      width: '80px',
      height: '80px',
      opacity: 0.4,
      marginBottom: '16px',
    },
    emptyTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: tokens.colorInk,
      marginBottom: '8px',
    },
    loadingRow: {
      textAlign: 'center',
      padding: '48px',
      color: tokens.colorMuted,
      fontSize: '14px',
    },
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Return Requests</h1>
          <p style={styles.subtitle}>Review and manage customer return requests.</p>
        </div>

        <div style={styles.toolbar}>
          <div style={styles.searchWrapper}>
            <img src="@/assets/icons/search.svg" alt="" style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by ID, order, or customer…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              aria-label="Search return requests"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.filterSelect}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="processing">Processing</option>
          </select>
        </div>

        <div style={styles.tableWrapper}>
          {loading ? (
            <div style={styles.loadingRow}>Loading return requests…</div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyState}>
              <img src="@/assets/images/empty-state.svg" alt="" style={styles.emptyImg} />
              <div style={styles.emptyTitle}>No return requests found</div>
              <p style={{ fontSize: '14px', margin: 0 }}>Try adjusting your search or filter.</p>
            </div>
          ) : (
            <table style={styles.table} aria-label="Return requests table">
              <thead>
                <tr>
                  <th style={styles.th}>Return ID</th>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Requested</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ret, idx) => (
                  <tr
                    key={ret.id}
                    style={{
                      ...styles.trHover,
                      background: idx % 2 === 0 ? tokens.colorSurface : '#f8f9fa',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = tokens.colorPrimarySubtle;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = idx % 2 === 0 ? tokens.colorSurface : '#f8f9fa';
                    }}
                    onClick={() => navigate(`/admin/returns/${ret.id}`)}
                  >
                    <td style={styles.td}>
                      <span style={styles.idCode}>{ret.id}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.idCode}>{ret.orderId}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: '500', color: tokens.colorInk }}>{ret.customer}</div>
                      <div style={{ fontSize: '12px', color: tokens.colorMuted }}>{ret.email}</div>
                    </td>
                    <td style={{ ...styles.td, maxWidth: '200px' }}>
                      <span
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {ret.reason}
                      </span>
                    </td>
                    <td style={styles.td}>{formatAmount(ret.amount)}</td>
                    <td style={styles.td}>
                      <StatusBadge status={ret.status} />
                    </td>
                    <td style={{ ...styles.td, whiteSpace: 'nowrap' }}>{formatDate(ret.requestedAt)}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.actionBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/returns/${ret.id}`);
                        }}
                        aria-label={`Review return ${ret.id}`}
                        onMouseEnter={(e) => { e.currentTarget.style.background = tokens.colorPrimaryDark; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = tokens.colorPrimary; }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div
          style={{
            marginTop: '16px',
            fontSize: '13px',
            color: tokens.colorMuted,
            textAlign: 'right',
          }}
        >
          {!loading && `Showing ${filtered.length} of ${returns.length} requests`}
        </div>
      </div>
    </div>
  );
}
