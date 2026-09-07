import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import editIcon from '@/assets/icons/edit.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';

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
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: 0,
    color: '#212529',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid transparent',
    position: 'relative',
  },
  defaultBadge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    backgroundColor: '#e8ecfd',
    color: '#3b5bdb',
    borderRadius: '3px',
    padding: '2px 8px',
    marginBottom: '12px',
  },
  addressName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#212529',
  },
  addressLine: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    margin: '2px 0',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  btnIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#212529',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
  },
  btnIconDanger: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#f03e3e',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 16px',
    color: '#495057',
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    opacity: 0.4,
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '16px',
    marginBottom: '8px',
    color: '#212529',
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
};

const SAMPLE_ADDRESSES = [
  { id: '1', name: 'Jane Smith', line1: '123 Main Street', line2: 'Apt 4B', city: 'New York', state: 'NY', postcode: '10001', country: 'United States', isDefault: true },
  { id: '2', name: 'Jane Smith', line1: '456 Oak Avenue', line2: '', city: 'Brooklyn', state: 'NY', postcode: '11201', country: 'United States', isDefault: false },
];

export default function AccountAddresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(SAMPLE_ADDRESSES);

  const handleDelete = id => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backLink} onClick={() => navigate('/account')}>← Back to account</button>
        <div style={styles.topRow}>
          <h1 style={styles.heading}>Address book</h1>
          <button style={styles.btnPrimary} onClick={() => navigate('/account/addresses/new')}>
            <img src={plusIcon} alt="" style={{ width: '18px', height: '18px', filter: 'invert(1)' }} />
            Add new address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div style={styles.emptyState}>
            <img src={mapPinIcon} alt="" style={styles.emptyIcon} />
            <p style={styles.emptyText}>No saved addresses yet.</p>
            <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>Add an address to speed up checkout.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {addresses.map(address => (
              <div key={address.id} style={styles.card}>
                {address.isDefault && <div style={styles.defaultBadge}>Default</div>}
                <div style={styles.addressName}>{address.name}</div>
                <p style={styles.addressLine}>{address.line1}</p>
                {address.line2 && <p style={styles.addressLine}>{address.line2}</p>}
                <p style={styles.addressLine}>{address.city}, {address.state} {address.postcode}</p>
                <p style={styles.addressLine}>{address.country}</p>
                <div style={styles.cardActions}>
                  <button style={styles.btnIcon} onClick={() => navigate(`/account/addresses/${address.id}/edit`)}>
                    <img src={editIcon} alt="" style={{ width: '14px', height: '14px' }} />
                    Edit
                  </button>
                  {!address.isDefault && (
                    <button style={styles.btnIconDanger} onClick={() => handleDelete(address.id)}>
                      <img src={trashIcon} alt="" style={{ width: '14px', height: '14px' }} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
