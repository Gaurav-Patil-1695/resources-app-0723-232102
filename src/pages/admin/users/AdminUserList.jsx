import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = ['All', 'admin', 'manager', 'customer'];

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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: 0,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  select: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '8px 12px',
    minHeight: '44px',
    cursor: 'pointer',
    outline: 'none',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '8px 12px',
    minHeight: '44px',
    flex: '1',
    maxWidth: '360px',
  },
  searchIcon: {
    width: '16px',
    height: '16px',
    flexShrink: 0,
    opacity: 0.5,
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#212529',
    backgroundColor: 'transparent',
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #868e96',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #868e96',
  },
  th: {
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    textAlign: 'left',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#343a40',
    borderBottom: '1px solid #e9ecef',
  },
  trHover: {
    cursor: 'pointer',
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
      role === 'admin'
        ? '#e8ecfd'
        : role === 'manager'
        ? '#fff3e6'
        : '#d3f9d8',
    color:
      role === 'admin'
        ? '#3b5bdb'
        : role === 'manager'
        ? '#fd7e14'
        : '#37b24d',
  }),
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '14px',
    gap: '16px',
  },
  emptyImg: {
    width: '80px',
    height: '80px',
    opacity: 0.5,
  },
  actionLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '16px',
    borderTop: '1px solid #e9ecef',
  },
  pageBtn: (active) => ({
    minWidth: '36px',
    minHeight: '36px',
    padding: '4px 10px',
    borderRadius: '6px',
    border: active ? 'none' : '1px solid #868e96',
    backgroundColor: active ? '#4c6ef5' : '#ffffff',
    color: active ? '#ffffff' : '#343a40',
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    cursor: 'pointer',
  }),
};

const PAGE_SIZE = 10;

const MOCK_USERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'customer', status: 'active', createdAt: '2024-02-10' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'manager', status: 'active', createdAt: '2024-02-20' },
  { id: '4', name: 'David Brown', email: 'david@example.com', role: 'customer', status: 'inactive', createdAt: '2024-03-01' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'customer', status: 'active', createdAt: '2024-03-05' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'manager', status: 'active', createdAt: '2024-03-12' },
  { id: '7', name: 'Grace Wilson', email: 'grace@example.com', role: 'customer', status: 'active', createdAt: '2024-03-18' },
  { id: '8', name: 'Hank Moore', email: 'hank@example.com', role: 'admin', status: 'active', createdAt: '2024-04-02' },
  { id: '9', name: 'Iris Taylor', email: 'iris@example.com', role: 'customer', status: 'inactive', createdAt: '2024-04-10' },
  { id: '10', name: 'Jack Anderson', email: 'jack@example.com', role: 'customer', status: 'active', createdAt: '2024-04-15' },
  { id: '11', name: 'Karen Thomas', email: 'karen@example.com', role: 'manager', status: 'active', createdAt: '2024-04-22' },
  { id: '12', name: 'Leo Jackson', email: 'leo@example.com', role: 'customer', status: 'active', createdAt: '2024-05-01' },
];

export default function AdminUserList() {
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);

  const filtered = MOCK_USERS.filter((u) => {
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, search]);

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.header}>
          <h1 style={styles.title}>Users</h1>
        </div>

        <div style={styles.filterRow}>
          <div style={styles.searchWrapper}>
            <img src="/src/assets/icons/search.svg" alt="" style={styles.searchIcon} />
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search users"
            />
          </div>

          <label style={styles.filterLabel} htmlFor="role-filter">
            Role
          </label>
          <select
            id="role-filter"
            style={styles.select}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r === 'All' ? 'All roles' : r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.card}>
          {paged.length === 0 ? (
            <div style={styles.emptyState}>
              <img
                src="/src/assets/images/empty-state.svg"
                alt="No users found"
                style={styles.emptyImg}
              />
              <span>No users match the current filters.</span>
            </div>
          ) : (
            <>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Joined</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        ...styles.trHover,
                        backgroundColor: hoveredRow === user.id ? '#f8f9fa' : 'transparent',
                      }}
                      onMouseEnter={() => setHoveredRow(user.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={styles.td}>
                        <span style={{ fontWeight: '500', color: '#212529' }}>{user.name}</span>
                      </td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        <span style={styles.roleBadge(user.role)}>{user.role}</span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '12px',
                            fontWeight: '600',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: user.status === 'active' ? '#d3f9d8' : '#e9ecef',
                            color: user.status === 'active' ? '#37b24d' : '#495057',
                          }}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: '#495057' }}>{user.createdAt}</td>
                      <td style={styles.td}>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            color: '#4c6ef5',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                          aria-label={`View details for ${user.name}`}
                        >
                          <img
                            src="/src/assets/icons/edit.svg"
                            alt=""
                            style={{ width: '14px', height: '14px' }}
                          />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <button
                    style={styles.pageBtn(false)}
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <img
                      src="/src/assets/icons/chevron-left.svg"
                      alt="Previous"
                      style={{ width: '14px', height: '14px' }}
                    />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      style={styles.pageBtn(p === currentPage)}
                      onClick={() => setPage(p)}
                      aria-current={p === currentPage ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    style={styles.pageBtn(false)}
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <img
                      src="/src/assets/icons/chevron-right.svg"
                      alt="Next"
                      style={{ width: '14px', height: '14px' }}
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <p style={{ marginTop: '12px', fontSize: '12px', color: '#495057' }}>
          {filtered.length} user{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>
    </div>
  );
}
