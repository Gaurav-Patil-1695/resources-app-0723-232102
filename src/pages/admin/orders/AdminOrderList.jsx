import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import packageIcon from '@/assets/icons/package.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
import emptyStateImg from '@/assets/images/empty-state.svg';

const STATUS_OPTIONS = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#3b5bdb' },
  shipped: { bg: '#d3f9d8', color: '#37b24d' },
  delivered: { bg: '#d3f9d8', color: '#2f9e44' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
};

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        backgroundColor: colors.bg,
        color: colors.color,
        lineHeight: '16px',
      }}
    >
      {status}
    </span>
  );
}

const MOCK_ORDERS = [
  {
    id: 'ORD-10001',
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    status: 'pending',
    total: 129.99,
    itemCount: 3,
    createdAt: '2024-06-01T10:23:00Z',
  },
  {
    id: 'ORD-10002',
    customerName: 'Bob Smith',
    customerEmail: 'bob@example.com',
    status: 'shipped',
    total: 249.50,
    itemCount: 2,
    createdAt: '2024-06-02T14:05:00Z',
  },
  {
    id: 'ORD-10003',
    customerName: 'Carol White',
    customerEmail: 'carol@example.com',
    status: 'delivered',
    total: 89.00,
    itemCount: 1,
    createdAt: '2024-06-03T09:11:00Z',
  },
  {
    id: 'ORD-10004',
    customerName: 'David Brown',
    customerEmail: 'david@example.com',
    status: 'cancelled',
    total: 59.99,
    itemCount: 2,
    createdAt: '2024-06-04T16:44:00Z',
  },
  {
    id: 'ORD-10005',
    customerName: 'Eva Martinez',
    customerEmail: 'eva@example.com',
    status: 'confirmed',
    total: 320.00,
    itemCount: 5,
    createdAt: '2024-06-05T11:30:00Z',
  },
  {
    id: 'ORD-10006',
    customerName: 'Frank Lee',
    customerEmail: 'frank@example.com',
    status: 'processing',
    total: 175.25,
    itemCount: 4,
    createdAt: '2024-06-06T08:00:00Z',
  },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AdminOrderList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [loading, setLoading] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === '' ||
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerEmail.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: '#212529',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '32px',
    },
    headerIcon: {
      width: '32px',
      height: '32px',
      opacity: 0.7,
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
      lineHeight: '40px',
      color: '#212529',
      margin: 0,
    },
    controls: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    searchWrapper: {
      position: 'relative',
      flex: '1 1 260px',
      minWidth: '200px',
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '18px',
      height: '18px',
      opacity: 0.5,
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      boxSizing: 'border-box',
      paddingLeft: '40px',
      paddingRight: '12px',
      paddingTop: '10px',
      paddingBottom: '10px',
      fontSize: '14px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      border: '1px solid #868e96',
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      color: '#212529',
      outline: 'none',
      minHeight: '44px',
    },
    filterTabs: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    filterTab: (active) => ({
      padding: '8px 16px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
      border: active ? '2px solid #4c6ef5' : '1px solid #868e96',
      backgroundColor: active ? '#e8ecfd' : '#ffffff',
      color: active ? '#4c6ef5' : '#495057',
      minHeight: '44px',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.15s ease',
    }),
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      border: '1px solid #dee2e6',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    thead: {
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #dee2e6',
    },
    th: {
      padding: '12px 16px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#495057',
      textAlign: 'left',
      whiteSpace: 'nowrap',
    },
    td: {
      padding: '14px 16px',
      fontSize: '14px',
      color: '#343a40',
      borderBottom: '1px solid #e9ecef',
      verticalAlign: 'middle',
    },
    trHover: {
      cursor: 'pointer',
    },
    orderId: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '14px',
      fontWeight: '400',
      color: '#4c6ef5',
      letterSpacing: '0em',
    },
    customerName: {
      fontWeight: '500',
      color: '#212529',
    },
    customerEmail: {
      fontSize: '12px',
      color: '#495057',
      marginTop: '2px',
    },
    total: {
      fontWeight: '600',
      color: '#212529',
    },
    actionCell: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '4px',
    },
    chevron: {
      width: '18px',
      height: '18px',
      opacity: 0.4,
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      color: '#495057',
    },
    emptyImg: {
      width: '120px',
      height: '120px',
      marginBottom: '24px',
      opacity: 0.6,
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '8px',
    },
    emptyText: {
      fontSize: '14px',
      color: '#495057',
    },
    summary: {
      fontSize: '14px',
      color: '#495057',
      marginBottom: '12px',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src={packageIcon} alt="" style={styles.headerIcon} aria-hidden="true" />
          <h1 style={styles.title}>Orders</h1>
        </div>

        <div style={styles.controls}>
          <div style={styles.searchWrapper}>
            <img src={searchIcon} alt="" style={styles.searchIcon} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search by order ID, customer name or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              aria-label="Search orders"
            />
          </div>
        </div>

        <div style={styles.filterTabs} role="group" aria-label="Filter orders by status">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              style={styles.filterTab(statusFilter === opt.value)}
              onClick={() => setStatusFilter(opt.value)}
              aria-pressed={statusFilter === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '16px', marginBottom: '8px' }}>
          <p style={styles.summary}>
            Showing <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? 'order' : 'orders'}
            {statusFilter ? ` with status "${statusFilter}"` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p>
        </div>

        <div style={styles.card}>
          {filteredOrders.length === 0 ? (
            <div style={styles.emptyState}>
              <img src={emptyStateImg} alt="No orders found" style={styles.emptyImg} />
              <p style={styles.emptyTitle}>No orders found</p>
              <p style={styles.emptyText}>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table} aria-label="Orders table">
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th} scope="col">Order ID</th>
                    <th style={styles.th} scope="col">Customer</th>
                    <th style={styles.th} scope="col">Date</th>
                    <th style={styles.th} scope="col">Items</th>
                    <th style={styles.th} scope="col">Total</th>
                    <th style={styles.th} scope="col">Status</th>
                    <th style={{ ...styles.th, textAlign: 'right' }} scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      style={{
                        ...styles.trHover,
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                      }}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate(`/admin/orders/${order.id}`);
                        }
                      }}
                      tabIndex={0}
                      role="row"
                      aria-label={`Order ${order.id} for ${order.customerName}`}
                    >
                      <td style={styles.td}>
                        <span style={styles.orderId}>{order.id}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.customerName}>{order.customerName}</div>
                        <div style={styles.customerEmail}>{order.customerEmail}</div>
                      </td>
                      <td style={styles.td}>{formatDate(order.createdAt)}</td>
                      <td style={styles.td}>{order.itemCount}</td>
                      <td style={styles.td}>
                        <span style={styles.total}>{formatCurrency(order.total)}</span>
                      </td>
                      <td style={styles.td}>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={styles.actionCell}>
                          <span style={{ fontSize: '14px', color: '#4c6ef5' }}>View</span>
                          <img src={chevronRightIcon} alt="" style={styles.chevron} aria-hidden="true" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
