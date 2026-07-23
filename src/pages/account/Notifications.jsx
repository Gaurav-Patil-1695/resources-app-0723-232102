import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bellIcon from '@/assets/icons/bell.svg';
import emptyStateImg from '@/assets/images/empty-state.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: 0,
    color: '#212529',
  },
  btnGhost: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
  },
  notifCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '16px 20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'border-color 0.15s',
  },
  notifCardUnread: {
    borderLeft: '4px solid #4c6ef5',
  },
  notifIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '9999px',
    backgroundColor: '#e8ecfd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifIconImg: {
    width: '18px',
    height: '18px',
    opacity: 0.7,
  },
  notifBody: {
    flex: 1,
  },
  notifText: {
    margin: '0 0 4px',
    fontSize: '16px',
    color: '#212529',
    lineHeight: '1.625',
  },
  notifMeta: {
    fontSize: '12px',
    color: '#495057',
    margin: 0,
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    flexShrink: 0,
    marginTop: '6px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 16px',
  },
  emptyImg: {
    width: '80px',
    height: '80px',
    opacity: 0.5,
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#212529',
    marginBottom: '8px',
  },
  emptyLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: 0,
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    borderRadius: '6px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#f03e3e',
  },
  retryBtn: {
    padding: '6px 14px',
    backgroundColor: 'transparent',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '24px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  toast: {
    position: 'fixed',
    top: '16px',
    right: '16px',
    zIndex: 1000,
    backgroundColor: '#d3f9d8',
    color: '#212529',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    text: 'Your return request for "Running Shoes (Size 10)" has been approved. A prepaid label has been emailed to you.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'n2',
    text: 'Your order ORD-10045 has been delivered. We hope you enjoy your purchase!',
    time: '1 day ago',
    read: false,
  },
  {
    id: 'n3',
    text: 'Your order ORD-10044 has shipped. Tracking number: FEDEX9876543210.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 'n4',
    text: 'A new promotion is available: 20% off all sneakers this weekend.',
    time: '5 days ago',
    read: true,
  },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const markRead = id => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleRetry = () => {
    setError(false);
  };

  return (
    <div style={styles.page}>
      {toast && <div style={styles.toast}>{toast}</div>}
      <div style={styles.container}>
        <button style={styles.backLink} onClick={() => navigate('/account')}>← Back to account</button>
        <div style={styles.topRow}>
          <h1 style={styles.heading}>Notifications</h1>
          <button style={styles.btnGhost} onClick={markAllRead}>Mark all as read</button>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>⚠</span>
            <span style={{ flex: 1 }}>Unable to load notifications. Please try again.</span>
            <button style={styles.retryBtn} onClick={handleRetry}>Retry</button>
          </div>
        )}

        {!error && notifications.length === 0 && (
          <div style={styles.emptyState}>
            <img src={emptyStateImg} alt="" style={styles.emptyImg} />
            <p style={styles.emptyText}>You're all caught up — no notifications yet</p>
            <button style={styles.emptyLink} onClick={() => navigate('/products')}>Browse products</button>
          </div>
        )}

        {!error && notifications.map(notif => (
          <div
            key={notif.id}
            style={{
              ...styles.notifCard,
              ...(notif.read ? {} : styles.notifCardUnread),
            }}
            role="button"
            tabIndex={0}
            onClick={() => markRead(notif.id)}
            onKeyDown={e => e.key === 'Enter' && markRead(notif.id)}
            onMouseEnter={e => e.currentTarget.style.borderColor = notif.read ? '#e9ecef' : '#4c6ef5'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
          >
            <div style={styles.notifIcon}>
              <img src={bellIcon} alt="" style={styles.notifIconImg} />
            </div>
            <div style={styles.notifBody}>
              <p style={{ ...styles.notifText, fontWeight: notif.read ? '400' : '600' }}>{notif.text}</p>
              <p style={styles.notifMeta}>{notif.time}</p>
            </div>
            {!notif.read && <div style={styles.unreadDot} aria-label="Unread" />}
          </div>
        ))}
      </div>
    </div>
  );
}
