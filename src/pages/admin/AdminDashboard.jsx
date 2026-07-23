import React, { useState, useEffect } from 'react';
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
    transition: 'background 0.15s, color 0.15s',
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '44px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
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
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: tokens.colorInk,
  },
  statChange: (positive) => ({
    fontSize: '14px',
    fontWeight: '400',
    color: positive ? tokens.colorSuccess : tokens.colorError,
    lineHeight: '20px',
  }),
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: tokens.colorInk,
    marginBottom: '16px',
    marginTop: '0',
  },
  tilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  tile: {
    backgroundColor: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    padding: '24px',
    border: `1px solid #dee2e6`,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'box-shadow 0.15s, border-color 0.15s',
    cursor: 'pointer',
  },
  tileIconWrap: (bg) => ({
    width: '44px',
    height: '44px',
    borderRadius: tokens.radiusSm,
    backgroundColor: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  tileIcon: {
    width: '24px',
    height: '24px',
  },
  tileTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: tokens.colorInk,
    margin: '0',
  },
  tileDesc: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: tokens.colorMuted,
    margin: '0',
  },
  recentSection: {
    backgroundColor: tokens.colorSurface,
    borderRadius: tokens.radiusMd,
    border: `1px solid #dee2e6`,
    overflow: 'hidden',
    marginBottom: '32px',
  },
  recentHeader: {
    padding: '16px 24px',
    borderBottom: `1px solid #dee2e6`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: tokens.colorInk,
    margin: '0',
  },
  viewAllLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: tokens.colorPrimary,
    textDecoration: 'none',
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
  monoText: {
    fontFamily: tokens.fontMono,
    fontSize: '14px',
    lineHeight: '20px',
  },
  alertBox: {
    backgroundColor: tokens.colorWarningSubtle,
    border: `1px solid ${tokens.colorWarning}`,
    borderRadius: tokens.radiusSm,
    padding: '12px 16px',
    marginBottom: '32px',
    fontSize: '14px',
    color: tokens.colorInk,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};

const mockStats = [
  { label: 'Total Revenue', value: '$48,320', change: '+12.4%', positive: true },
  { label: 'Orders Today', value: '134', change: '+5.1%', positive: true },
  { label: 'Active Users', value: '2,891', change: '-1.2%', positive: false },
  { label: 'Pending Shipments', value: '47', change: '+3.7%', positive: false },
  { label: 'Low Stock Items', value: '12', change: '+2', positive: false },
  { label: 'Total Products', value: '1,204', change: '+8', positive: true },
];

const quickAccessTiles = [
  {
    title: 'Manage Orders',
    desc: 'View, process, and update customer orders.',
    to: '/admin/orders',
    iconSrc: '/src/assets/icons/package.svg',
    iconBg: tokens.colorPrimarySubtle,
  },
  {
    title: 'Manage Products',
    desc: 'Add, edit, or remove products and inventory.',
    to: '/admin/products',
    iconSrc: '/src/assets/icons/edit.svg',
    iconBg: tokens.colorSecondarySubtle,
  },
  {
    title: 'Manage Users',
    desc: 'Review and manage customer accounts.',
    to: '/admin/users',
    iconSrc: '/src/assets/icons/user.svg',
    iconBg: tokens.colorSuccessSubtle,
  },
  {
    title: 'Reports',
    desc: 'Consolidated business reporting and analytics.',
    to: '/admin/reports',
    iconSrc: '/src/assets/icons/external-link.svg',
    iconBg: tokens.colorPrimarySubtle,
  },
  {
    title: 'Promotions',
    desc: 'Create and manage discount codes and campaigns.',
    to: '/admin/promotions',
    iconSrc: '/src/assets/icons/star.svg',
    iconBg: tokens.colorWarningSubtle,
  },
  {
    title: 'Notifications',
    desc: 'Configure and send system notifications.',
    to: '/admin/notifications',
    iconSrc: '/src/assets/icons/bell.svg',
    iconBg: tokens.colorErrorSubtle,
  },
];

const mockOrders = [
  { id: 'ORD-10042', customer: 'Alice Johnson', total: '$129.99', status: 'Pending', date: '2024-06-01' },
  { id: 'ORD-10041', customer: 'Bob Smith', total: '$54.50', status: 'Shipped', date: '2024-06-01' },
  { id: 'ORD-10040', customer: 'Carol White', total: '$320.00', status: 'Delivered', date: '2024-05-31' },
  { id: 'ORD-10039', customer: 'David Lee', total: '$89.00', status: 'Cancelled', date: '2024-05-31' },
  { id: 'ORD-10038', customer: 'Eva Martinez', total: '$210.75', status: 'Processing', date: '2024-05-30' },
];

const statusConfig = {
  Pending: { color: tokens.colorInk, bg: '#dee2e6' },
  Processing: { color: '#1864ab', bg: '#d0ebff' },
  Shipped: { color: '#0b7285', bg: '#c5f6fa' },
  Delivered: { color: '#2b8a3e', bg: tokens.colorSuccessSubtle },
  Cancelled: { color: tokens.colorError, bg: tokens.colorErrorSubtle },
};

export default function AdminDashboard() {
  const [hoveredTile, setHoveredTile] = useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 className="page-title" style={styles.pageTitle}>Admin Dashboard</h1>
          <nav style={styles.navActions}>
            <Link
              to="/admin/reports"
              className="nav-link"
              style={styles.navLink}
            >
              Admin Reports
            </Link>
          </nav>
        </header>

        <div style={styles.alertBox}>
          <img src="/src/assets/icons/bell.svg" alt="" aria-hidden="true" width={18} height={18} />
          <span>12 products are low in stock. <Link to="/admin/products" style={{ color: tokens.colorPrimary, fontWeight: '500' }}>Review inventory</Link></span>
        </div>

        <section aria-label="Key statistics">
          <h2 style={styles.sectionTitle}>Overview</h2>
          <div style={styles.statsGrid}>
            {mockStats.map((stat) => (
              <div key={stat.label} style={styles.statCard}>
                <span style={styles.statLabel}>{stat.label}</span>
                <span style={styles.statValue}>{stat.value}</span>
                <span style={styles.statChange(stat.positive)}>{stat.change} vs last period</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Quick access">
          <h2 style={styles.sectionTitle}>Quick Access</h2>
          <div style={styles.tilesGrid}>
            {quickAccessTiles.map((tile, idx) => (
              <Link
                key={tile.title}
                to={tile.to}
                style={{
                  ...styles.tile,
                  boxShadow: hoveredTile === idx ? '0 4px 16px rgba(76,110,245,0.12)' : 'none',
                  borderColor: hoveredTile === idx ? tokens.colorPrimary : '#dee2e6',
                }}
                onMouseEnter={() => setHoveredTile(idx)}
                onMouseLeave={() => setHoveredTile(null)}
                aria-label={tile.title}
              >
                <div style={styles.tileIconWrap(tile.iconBg)}>
                  <img src={tile.iconSrc} alt="" aria-hidden="true" style={styles.tileIcon} />
                </div>
                <h3 style={styles.tileTitle}>{tile.title}</h3>
                <p style={styles.tileDesc}>{tile.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section aria-label="Recent orders">
          <div style={styles.recentSection}>
            <div style={styles.recentHeader}>
              <h2 style={styles.recentTitle}>Recent Orders</h2>
              <Link to="/admin/orders" style={styles.viewAllLink}>View all</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table} aria-label="Recent orders table">
                <thead>
                  <tr>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => {
                    const sc = statusConfig[order.status] || statusConfig.Pending;
                    return (
                      <tr key={order.id}>
                        <td style={styles.td}>
                          <span style={styles.monoText}>{order.id}</span>
                        </td>
                        <td style={styles.td}>{order.customer}</td>
                        <td style={styles.td}>{order.date}</td>
                        <td style={styles.td}>{order.total}</td>
                        <td style={styles.td}>
                          <span style={styles.badge(sc.color, sc.bg)}>{order.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
