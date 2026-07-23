import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';
import packageIcon from '@/assets/icons/package.svg';
import userIcon from '@/assets/icons/user.svg';
import cartIcon from '@/assets/icons/cart.svg';
import editIcon from '@/assets/icons/edit.svg';
import starIcon from '@/assets/icons/star.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import menuIcon from '@/assets/icons/menu.svg';
import closeIcon from '@/assets/icons/close.svg';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: packageIcon, end: true },
  { label: 'Products', to: '/admin/products', icon: packageIcon },
  { label: 'Orders', to: '/admin/orders', icon: cartIcon },
  { label: 'Users', to: '/admin/users', icon: userIcon },
  { label: 'Categories', to: '/admin/categories', icon: editIcon },
  { label: 'Reviews', to: '/admin/reviews', icon: starIcon },
  { label: 'Addresses', to: '/admin/addresses', icon: mapPinIcon },
];

const activeLinkStyle = {
  backgroundColor: '#1d4ed8',
  color: '#ffffff',
};

const linkBaseStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.625rem 1rem',
  borderRadius: '8px',
  textDecoration: 'none',
  color: '#d1d5db',
  fontSize: '0.875rem',
  fontWeight: 500,
  transition: 'background-color 0.15s, color 0.15s',
};

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? '64px' : '240px',
        backgroundColor: '#1e3a5f',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.2s',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        minHeight: '64px',
      }}>
        {!collapsed && (
          <img src={logo} alt="Admin Logo" style={{ height: '28px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
        )}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={collapsed ? menuIcon : closeIcon}
            alt=""
            style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }}
          />
        </button>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              ...linkBaseStyle,
              ...(isActive ? activeLinkStyle : {}),
              justifyContent: collapsed ? 'center' : 'flex-start',
            })}
            title={collapsed ? item.label : undefined}
          >
            <img src={item.icon} alt="" style={{ width: '18px', height: '18px', flexShrink: 0, filter: 'brightness(0) invert(1)' }} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer */}
      {!collapsed && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '0.75rem',
          color: '#6b7280',
        }}>
          Admin Panel
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
