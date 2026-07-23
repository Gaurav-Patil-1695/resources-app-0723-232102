import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ROLES = ['admin', 'manager', 'customer'];

const MOCK_USERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15', phone: '+1 555 0101', ordersCount: 3, lastLogin: '2024-05-10' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'customer', status: 'active', createdAt: '2024-02-10', phone: '+1 555 0102', ordersCount: 12, lastLogin: '2024-05-08' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'manager', status: 'active', createdAt: '2024-02-20', phone: '+1 555 0103', ordersCount: 1, lastLogin: '2024-05-09' },
  { id: '4', name: 'David Brown', email: 'david@example.com', role: 'customer', status: 'inactive', createdAt: '2024-03-01', phone: '+1 555 0104', ordersCount: 5, lastLogin: '2024-04-01' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'customer', status: 'active', createdAt: '2024-03-05', phone: '+1 555 0105', ordersCount: 8, lastLogin: '2024-05-11' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'manager', status: 'active', createdAt: '2024-03-12', phone: '+1 555 0106', ordersCount: 2, lastLogin: '2024-05-07' },
  { id: '7', name: 'Grace Wilson', email: 'grace@example.com', role: 'customer', status: 'active', createdAt: '2024-03-18', phone: '+1 555 0107', ordersCount: 20, lastLogin: '2024-05-12' },
  { id: '8', name: 'Hank Moore', email: 'hank@example.com', role: 'admin', status: 'active', createdAt: '2024-04-02', phone: '+1 555 0108', ordersCount: 0, lastLogin: '2024-05-10' },
  { id: '9', name: 'Iris Taylor', email: 'iris@example.com', role: 'customer', status: 'inactive', createdAt: '2024-04-10', phone: '+1 555 0109', ordersCount: 3, lastLogin: '2024-03-20' },
  { id: '10', name: 'Jack Anderson', email: 'jack@example.com', role: 'customer', status: 'active', createdAt: '2024-04-15', phone: '+1 555 0110', ordersCount: 7, lastLogin: '2024-05-06' },
  { id: '11', name: 'Karen Thomas', email: 'karen@example.com', role: 'manager', status: 'active', createdAt: '2024-04-22', phone: '+1 555 0111', ordersCount: 1, lastLogin: '2024-05-11' },
  { id: '12', name: 'Leo Jackson', email: 'leo@example.com', role: 'customer', status: 'active', createdAt: '2024-05-01', phone: '+1 555 0112', ordersCount: 4, lastLogin: '2024-05-13' },
];

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    padding: '32px 24px',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: '#4c6ef5',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '20px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: '0 0 24px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #868e96',
    padding: '24px',
  },
  cardFull: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #868e96',
    padding: '24px',
    gridColumn: '1 / -1',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    margin: '0 0 16px 0',
    paddingBottom: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    lineHeight: '16px',
  },
  fieldValue: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#343a40',
  },
  roleBadge: (role) => ({
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
    padding: '2px 8px',
    borderRadius: '9999px',
    backgroundColor:
      role === 'admin' ? '#e8ecfd' : role === 'manager' ? '#fff3e6' : '#d3f9d8',
    color:
      role === 'admin' ? '#3b5bdb' : role === 'manager' ? '#fd7e14' : '#37b24d',
  }),
  statusBadge: (status) => ({
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '9999px',
    backgroundColor: status === 'active' ? '#d3f9d8' : '#e9ecef',
    color: status === 'active' ? '#37b24d' : '#495057',
  }),
  selectWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  selectLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#343a40',
  },
  select: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '10px 12px',
    minHeight: '44px',
    cursor: 'pointer',
    outline: 'none',
    width: '100%',
    maxWidth: '320px',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    padding: '10px 20px',
    minHeight: '44px',
    cursor: 'pointer',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffffff',
    color: '#343a40',
    border: '1px solid #868e96',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    padding: '10px 20px',
    minHeight: '44px',
    cursor: 'pointer',
  },
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    padding: '10px 20px',
    minHeight: '44px',
    cursor: 'pointer',
  },
  successMsg: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '12px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '9999px',
    backgroundColor: '#e8ecfd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#4c6ef5',
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40vh',
    gap: '16px',
    color: '#495057',
    fontSize: '16px',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#212529',
    lineHeight: '28px',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    lineHeight: '16px',
  },
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const found = MOCK_USERS.find((u) => u.id === id);
    if (found) {
      setUser({ ...found });
      setSelectedRole(found.role);
    }
  }, [id]);

  const handleRoleSave = () => {
    if (!user || selectedRole === user.role) return;
    setIsSaving(true);
    setTimeout(() => {
      setUser((prev) => ({ ...prev, role: selectedRole }));
      setSaveSuccess(true);
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleStatusToggle = () => {
    if (!user) return;
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    setUser((prev) => ({ ...prev, status: nextStatus }));
  };

  if (!user) {
    return (
      <div style={styles.page}>
        <div style={styles.inner}>
          <div style={styles.notFound}>
            <img
              src="/src/assets/images/empty-state.svg"
              alt="User not found"
              style={{ width: '80px', height: '80px', opacity: 0.5 }}
            />
            <p>User not found.</p>
            <button
              style={styles.btnSecondary}
              onClick={() => navigate('/admin/users')}
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <button
          style={styles.backBtn}
          onClick={() => navigate('/admin/users')}
          aria-label="Back to user list"
        >
          <img
            src="/src/assets/icons/chevron-left.svg"
            alt=""
            style={{ width: '14px', height: '14px' }}
          />
          Back to Users
        </button>

        <h1 style={styles.pageTitle}>User Detail</h1>

        <div style={styles.grid}>
          {/* Profile Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Profile</h2>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
              <div style={styles.avatar}>
                <span style={styles.avatarText}>{initials}</span>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '14px', color: '#495057', marginBottom: '8px' }}>
                  {user.email}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={styles.roleBadge(user.role)}>{user.role}</span>
                  <span style={styles.statusBadge(user.status)}>{user.status}</span>
                </div>
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>User ID</span>
                <span style={{ ...styles.fieldValue, fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '13px' }}>
                  {user.id}
                </span>
              </div>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Phone</span>
                <span style={styles.fieldValue}>{user.phone}</span>
              </div>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Member Since</span>
                <span style={styles.fieldValue}>{user.createdAt}</span>
              </div>
              <div style={styles.fieldRow}>
                <span style={styles.fieldLabel}>Last Login</span>
                <span style={styles.fieldValue}>{user.lastLogin}</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Account Stats</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={styles.statCard}>
                <span style={styles.statValue}>{user.ordersCount}</span>
                <span style={styles.statLabel}>Orders</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statValue}>{user.status === 'active' ? 'Active' : 'Inactive'}</span>
                <span style={styles.statLabel}>Account Status</span>
              </div>
              <div style={styles.statCard}>
                <span style={{ ...styles.statValue, fontSize: '14px', fontWeight: '600', textTransform: 'capitalize' }}>
                  {user.role}
                </span>
                <span style={styles.statLabel}>Current Role</span>
              </div>
              <div style={styles.statCard}>
                <span style={{ ...styles.statValue, fontSize: '14px', fontWeight: '600' }}>
                  {user.lastLogin}
                </span>
                <span style={styles.statLabel}>Last Login</span>
              </div>
            </div>
          </div>

          {/* Role Assignment Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Role Assignment</h2>
            <p style={{ fontSize: '14px', color: '#495057', marginBottom: '16px', marginTop: 0 }}>
              Assign a role to control what this user can access in the system.
            </p>
            <div style={styles.selectWrapper}>
              <label style={styles.selectLabel} htmlFor="role-select">
                Role
              </label>
              <select
                id="role-select"
                style={styles.select}
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setSaveSuccess(false);
                }}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.btnRow}>
              <button
                style={{
                  ...styles.btnPrimary,
                  opacity: isSaving || selectedRole === user.role ? 0.6 : 1,
                  cursor: isSaving || selectedRole === user.role ? 'not-allowed' : 'pointer',
                }}
                onClick={handleRoleSave}
                disabled={isSaving || selectedRole === user.role}
              >
                <img
                  src="/src/assets/icons/check.svg"
                  alt=""
                  style={{ width: '14px', height: '14px' }}
                />
                {isSaving ? 'Saving…' : 'Save Role'}
              </button>
            </div>
            {saveSuccess && (
              <div style={styles.successMsg} role="status" aria-live="polite">
                <img
                  src="/src/assets/icons/check.svg"
                  alt=""
                  style={{ width: '14px', height: '14px' }}
                />
                Role updated successfully.
              </div>
            )}
          </div>

          {/* Account Actions Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Account Actions</h2>
            <p style={{ fontSize: '14px', color: '#495057', marginBottom: '16px', marginTop: 0 }}>
              Manage this user's account status or perform administrative actions.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#343a40', margin: '0 0 8px 0' }}>
                  Account Status
                </p>
                <p style={{ fontSize: '12px', color: '#495057', margin: '0 0 12px 0' }}>
                  Currently: <span style={styles.statusBadge(user.status)}>{user.status}</span>
                </p>
                <button
                  style={{
                    ...styles.btnSecondary,
                    borderColor: user.status === 'active' ? '#f03e3e' : '#37b24d',
                    color: user.status === 'active' ? '#f03e3e' : '#37b24d',
                  }}
                  onClick={handleStatusToggle}
                >
                  {user.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                </button>
              </div>
              <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#343a40', margin: '0 0 4px 0' }}>
                  Danger Zone
                </p>
                <p style={{ fontSize: '12px', color: '#495057', margin: '0 0 12px 0' }}>
                  Permanently delete this user and all associated data.
                </p>
                <button
                  style={styles.btnDanger}
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
                      navigate('/admin/users');
                    }
                  }}
                >
                  <img
                    src="/src/assets/icons/trash.svg"
                    alt=""
                    style={{ width: '14px', height: '14px' }}
                  />
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
