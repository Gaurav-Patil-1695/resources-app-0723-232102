import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const tokens = {
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorSecondary: '#fd7e14',
  colorSecondarySubtle: '#fff3e6',
  colorSuccess: '#37b24d',
  colorSuccessSubtle: '#d3f9d8',
  colorWarning: '#fd7e14',
  colorWarningSubtle: '#fff4e6',
  colorError: '#f03e3e',
  colorErrorSubtle: '#ffe3e3',
  colorSurface: '#ffffff',
  colorCanvas: '#f8f9fa',
  colorBorder: '#868e96',
  colorOnPrimary: '#ffffff',
  radiusMd: '10px',
  radiusSm: '6px',
  radiusXs: '3px',
  radiusFull: '9999px',
  fontSans: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
};

const styles = {
  page: {
    backgroundColor: tokens.colorCanvas,
    minHeight: '100vh',
    fontFamily: tokens.fontSans,
    color: tokens.colorInk,
    padding: '32px 24px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: tokens.colorInk,
    margin: '0',
  },
  navActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  navLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: tokens.colorPrimary,
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: tokens.radiusSm,
    border: `1px solid ${tokens.colorPrimary}`,
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '44px',
  },
  filterBar: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '32px',
    backgroundColor: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    border: `1px solid #dee2e6`,
    padding: '16px 24px',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: tokens.colorMuted,
    whiteSpace: 'nowrap',
  },
  select: {
    fontSize: '14px',
    fontWeight: '400',
    color: tokens.colorInk,
    border: `1px solid ${tokens.colorBorder}`,
    borderRadius: tokens.radiusSm,
    padding: '8px 12px',
    backgroundColor: tokens.colorSurface,
    minHeight: '44px',
    outline: 'none',
    cursor: 'pointer',
  },
  applyBtn: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorOnPrimary,
    backgroundColor: tokens.colorPrimary,
    border: 'none',
    borderRadius: tokens.radiusSm,
    padding: '8px 20px',
    minHeight: '44px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: tokens.colorInk,
    marginBottom: '16px',
    marginTop: '0',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  summaryCard: {
    backgroundColor: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    padding: '24px',
    border: `1px solid #dee2e6`,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    lineHeight: '16px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '36px',
    color: tokens.colorInk,
  },
  statSub: {
    fontSize: '13px',
    fontWeight: '400',
    color: tokens.colorMuted,
    lineHeight: '18px',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  panel: {
    backgroundColor: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    border: `1px solid #dee2e6`,
    overflow: 'hidden',
  },
  panelHeader: {
    padding: '16px 24px',
    borderBottom: `1px solid #dee2e6`,
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: tokens.colorInk,
    margin: '0',
  },
  panelBody: {
    padding: '24px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: tokens.colorMuted,
    padding: '12px 24px',
    textAlign: 'left',
    borderBottom: `1px solid #dee2e6`,
    backgroundColor: tokens.colorCanvas,
  },
  td: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: tokens.colorBody,
    padding: '12px 24px',
    borderBottom: `1px solid #dee2e6`,
  },
  barChartWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  barLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: tokens.colorBody,
    width: '100px',
    flexShrink: '0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  barTrack: {
    flex: '1',
    backgroundColor: '#dee2e6',
    borderRadius: tokens.radiusFull,
    height: '10px',
    overflow: 'hidden',
  },
  barFill: (pct, color) => ({
    width: `${pct}%`,
    height: '100%',
    backgroundColor: color,
    borderRadius: tokens.radiusFull,
    transition: 'width 0.4s ease',
  }),
  barValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: tokens.colorInk,
    width: '64px',
    textAlign: 'right',
    flexShrink: '0',
  },
  monoText: {
    fontFamily: tokens.fontMono,
    fontSize: '13px',
    lineHeight: '20px',
  },
  badge: (color, bg) => ({
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
    padding: '2px 8px',
    borderRadius: '9999px',
    color,
    backgroundColor: bg,
  }),
  downloadBtn: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorPrimary,
    backgroundColor: tokens.colorPrimarySubtle,
    border: `1px solid ${tokens.colorPrimary}`,
    borderRadius: tokens.radiusSm,
    padding: '8px 16px',
    minHeight: '44px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background 0.15s',
  },
  fullPanel: {
    backgroundColor: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    border: `1px solid #dee2e6`,
    overflow: 'hidden',
    marginBottom: '32px',
  },
  fullPanelHeader: {
    padding: '16px 24px',
    borderBottom: `1px solid #dee2e6`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
};

const periods = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'This year', 'All time'];
const categories = ['All categories', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'];

const summaryStats = [
  { label: 'Total Revenue', value: '$184,320', sub: '+14.2% vs prior period' },
  { label: 'Total Orders', value: '3,241', sub: '+8.7% vs prior period' },
  { label: 'Avg Order Value', value: '$56.87', sub: '+5.1% vs prior period' },
  { label: 'New Customers', value: '872', sub: '+11.3% vs prior period' },
  { label: 'Return Rate', value: '3.4%', sub: '-0.6% vs prior period' },
  { label: 'Fulfillment Rate', value: '97.1%', sub: '+0.2% vs prior period' },
];

const topProducts = [
  { rank: 1, name: 'Wireless Headphones Pro', sku: 'WHP-001', units: 412, revenue: '$24,720' },
  { rank: 2, name: 'Running Shoes X2', sku: 'RSX-002', units: 389, revenue: '$19,450' },
  { rank: 3, name: 'Smart Watch Series 5', sku: 'SWS-005', units: 310, revenue: '$46,500' },
  { rank: 4, name: 'Yoga Mat Premium', sku: 'YMP-010', units: 290, revenue: '$8,700' },
  { rank: 5, name: 'Portable Speaker', sku: 'PSP-003', units: 264, revenue: '$13,200' },
];

const revenueByCategory = [
  { category: 'Electronics', value: 68400, pct: 100, color: tokens.colorPrimary },
  { category: 'Clothing', value: 42100, pct: 62, color: tokens.colorSecondary },
  { category: 'Sports', value: 31200, pct: 46, color: tokens.colorSuccess },
  { category: 'Home & Garden', value: 24600, pct: 36, color: '#ae3ec9' },
  { category: 'Books', value: 18020, pct: 26, color: '#1098ad' },
];

const orderStatusBreakdown = [
  { status: 'Delivered', count: 2810, pct: 87, color: tokens.colorSuccess },
  { status: 'Shipped', count: 241, pct: 7, color: '#1098ad' },
  { status: 'Processing', count: 108, pct: 3, color: '#1864ab' },
  { status: 'Pending', count: 52, pct: 2, color: '#868e96' },
  { status: 'Cancelled', count: 30, pct: 1, color: tokens.colorError },
];

const recentRefunds = [
  { id: 'REF-2241', order: 'ORD-10030', customer: 'Grace Kim', amount: '$129.99', reason: 'Defective product', date: '2024-05-30' },
  { id: 'REF-2240', order: 'ORD-10021', customer: 'Henry Brown', amount: '$54.50', reason: 'Wrong item', date: '2024-05-29' },
  { id: 'REF-2239', order: 'ORD-10015', customer: 'Irene Cho', amount: '$89.00', reason: 'Not as described', date: '2024-05-28' },
];

export default function AdminReports() {
  const [period, setPeriod] = useState('Last 30 days');
  const [category, setCategory] = useState('All categories');

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>Admin Reports</h1>
          <nav style={styles.navActions}>
            <Link to="/admin" className="nav-link" style={styles.navLink}>
              Admin Dashboard
            </Link>
          </nav>
        </header>

        <div style={styles.filterBar} role="search" aria-label="Report filters">
          <span style={styles.filterLabel}>Filter by:</span>
          <label htmlFor="period-select" style={{ ...styles.filterLabel, fontWeight: '400' }}>Period</label>
          <select
            id="period-select"
            style={styles.select}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            aria-label="Select period"
          >
            {periods.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <label htmlFor="category-select" style={{ ...styles.filterLabel, fontWeight: '400' }}>Category</label>
          <select
            id="category-select"
            style={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Select category"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button style={styles.applyBtn} type="button" aria-label="Apply filters">
            Apply
          </button>
        </div>

        <section aria-label="Summary statistics">
          <h2 style={styles.sectionTitle}>Summary — {period}</h2>
          <div style={styles.summaryGrid}>
            {summaryStats.map((s) => (
              <div key={s.label} style={styles.summaryCard}>
                <span style={styles.statLabel}>{s.label}</span>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statSub}>{s.sub}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={styles.twoCol}>
          <section aria-label="Revenue by category" style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Revenue by Category</h2>
            </div>
            <div style={styles.panelBody}>
              <div style={styles.barChartWrap}>
                {revenueByCategory.map((row) => (
                  <div key={row.category} style={styles.barRow}>
                    <span style={styles.barLabel} title={row.category}>{row.category}</span>
                    <div style={styles.barTrack} role="progressbar" aria-valuenow={row.pct} aria-valuemin={0} aria-valuemax={100} aria-label={row.category}>
                      <div style={styles.barFill(row.pct, row.color)} />
                    </div>
                    <span style={styles.barValue}>${(row.value / 1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section aria-label="Order status breakdown" style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Order Status Breakdown</h2>
            </div>
            <div style={styles.panelBody}>
              <div style={styles.barChartWrap}>
                {orderStatusBreakdown.map((row) => (
                  <div key={row.status} style={styles.barRow}>
                    <span style={styles.barLabel} title={row.status}>{row.status}</span>
                    <div style={styles.barTrack} role="progressbar" aria-valuenow={row.pct} aria-valuemin={0} aria-valuemax={100} aria-label={row.status}>
                      <div style={styles.barFill(row.pct, row.color)} />
                    </div>
                    <span style={styles.barValue}>{row.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section aria-label="Top products by revenue" style={styles.fullPanel}>
          <div style={styles.fullPanelHeader}>
            <h2 style={{ ...styles.panelTitle, margin: '0' }}>Top Products by Revenue</h2>
            <button style={styles.downloadBtn} type="button" aria-label="Export top products as CSV">
              <img src="/src/assets/icons/external-link.svg" alt="" aria-hidden="true" width={16} height={16} />
              Export CSV
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table} aria-label="Top products table">
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>SKU</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Units Sold</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.sku}>
                    <td style={styles.td}>
                      <span style={{ fontWeight: '600', color: tokens.colorMuted }}>{p.rank}</span>
                    </td>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>
                      <span style={styles.monoText}>{p.sku}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{p.units.toLocaleString()}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>{p.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-label="Recent refunds" style={styles.fullPanel}>
          <div style={styles.fullPanelHeader}>
            <h2 style={{ ...styles.panelTitle, margin: '0' }}>Recent Refunds</h2>
            <button style={styles.downloadBtn} type="button" aria-label="Export refunds as CSV">
              <img src="/src/assets/icons/external-link.svg" alt="" aria-hidden="true" width={16} height={16} />
              Export CSV
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table} aria-label="Recent refunds table">
              <thead>
                <tr>
                  <th style={styles.th}>Refund ID</th>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRefunds.map((r) => (
                  <tr key={r.id}>
                    <td style={styles.td}><span style={styles.monoText}>{r.id}</span></td>
                    <td style={styles.td}><span style={styles.monoText}>{r.order}</span></td>
                    <td style={styles.td}>{r.customer}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{r.amount}</td>
                    <td style={styles.td}>{r.reason}</td>
                    <td style={styles.td}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
