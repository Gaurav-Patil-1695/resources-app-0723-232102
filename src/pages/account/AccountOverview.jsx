import { useNavigate } from 'react-router-dom';
import bellIcon from '@/assets/icons/bell.svg';
import packageIcon from '@/assets/icons/package.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import userIcon from '@/assets/icons/user.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: '0 0 8px 0',
    color: '#212529',
  },
  subtext: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '32px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '9999px',
    backgroundColor: '#e8ecfd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarIcon: {
    width: '32px',
    height: '32px',
    opacity: 0.6,
  },
  profileName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '4px',
  },
  profileEmail: {
    fontSize: '14px',
    color: '#495057',
  },
  tilesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  },
  tile: {
    flex: '1',
    minWidth: '140px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    border: '1px solid transparent',
    transition: 'border-color 0.15s',
  },
  tileLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  tileDesc: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    margin: 0,
  },
  tileIcon: {
    width: '24px',
    height: '24px',
    opacity: 0.7,
    marginBottom: '4px',
  },
  muted: {
    color: '#495057',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: 0,
  },
  quickLinksCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  quickLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #868e96',
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontSize: '16px',
    color: '#212529',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    transition: 'background-color 0.15s',
  },
};

export default function AccountOverview() {
  const navigate = useNavigate();

  const user = {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    unreadNotifications: 3,
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>My Account</h1>
        <p style={styles.muted}>Save your details for faster checkout and access your full order history anytime.</p>

        <div style={{ marginTop: '32px' }}>
          <div style={styles.sectionLabel}>Profile</div>
          <div style={styles.card}>
            <div style={styles.profileRow}>
              <div style={styles.avatar}>
                <img src={userIcon} alt="User" style={styles.avatarIcon} />
              </div>
              <div>
                <div style={styles.profileName}>{user.name}</div>
                <div style={styles.profileEmail}>{user.email}</div>
              </div>
            </div>
            <p style={styles.muted}>Save your details for faster checkout and access your full order history anytime.</p>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={styles.sectionLabel}>Quick Links</div>
          <div style={styles.quickLinksCard}>
            <button
              style={styles.quickLink}
              onClick={() => navigate('/account/profile')}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <span>Profile &amp; Password</span>
              <span style={{ color: '#868e96' }}>›</span>
            </button>
            <button
              style={styles.quickLink}
              onClick={() => navigate('/account/orders')}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <span>Order history</span>
              <span style={{ color: '#868e96' }}>›</span>
            </button>
            <button
              style={styles.quickLink}
              onClick={() => navigate('/account/addresses')}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <span>Addresses</span>
              <span style={{ color: '#868e96' }}>›</span>
            </button>
            <button
              style={{ ...styles.quickLink, borderBottom: 'none' }}
              onClick={() => navigate('/account/notifications')}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <span>Notifications</span>
              <span style={{ color: '#868e96' }}>›</span>
            </button>
          </div>
        </div>

        <div>
          <div style={styles.sectionLabel}>Overview</div>
          <div style={styles.tilesGrid}>
            <div
              style={styles.tile}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/account/orders')}
              onKeyDown={e => e.key === 'Enter' && navigate('/account/orders')}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4c6ef5'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
            >
              <img src={packageIcon} alt="" style={styles.tileIcon} />
              <span style={styles.tileLabel}>Orders</span>
              <p style={styles.tileDesc}>Track your orders and view order history</p>
            </div>
            <div
              style={styles.tile}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/account/addresses')}
              onKeyDown={e => e.key === 'Enter' && navigate('/account/addresses')}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4c6ef5'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
            >
              <img src={mapPinIcon} alt="" style={styles.tileIcon} />
              <span style={styles.tileLabel}>Addresses</span>
              <p style={styles.tileDesc}>Manage your saved addresses</p>
            </div>
            <div
              style={styles.tile}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/account/notifications')}
              onKeyDown={e => e.key === 'Enter' && navigate('/account/notifications')}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4c6ef5'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
            >
              <img src={bellIcon} alt="" style={styles.tileIcon} />
              <span style={styles.tileLabel}>Notifications</span>
              <p style={styles.tileDesc}>Unread notifications: {user.unreadNotifications}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
