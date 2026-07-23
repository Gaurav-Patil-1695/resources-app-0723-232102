import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import userIcon from '@/assets/icons/user.svg';
import bellIcon from '@/assets/icons/bell.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import menuIcon from '@/assets/icons/menu.svg';
import closeIcon from '@/assets/icons/close.svg';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const toggleAccountMenu = () => {
    setAccountMenuOpen((prev) => !prev);
  };

  return (
    <header className="header" style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        height: '64px',
        gap: '1rem',
      }}>
        {/* Logo */}
        <Link to="/" style={{ flexShrink: 0 }}>
          <img src={logo} alt="Site Logo" style={{ height: '36px', width: 'auto' }} />
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            maxWidth: '480px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '0 0.75rem',
            gap: '0.5rem',
          }}
        >
          <img src={searchIcon} alt="" style={{ width: '18px', height: '18px', opacity: 0.5 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.875rem',
              width: '100%',
              padding: '0.5rem 0',
            }}
          />
        </form>

        {/* Right Icons */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          {/* Notification Bell */}
          <button
            aria-label="Notifications"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={bellIcon} alt="" style={{ width: '22px', height: '22px' }} />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              position: 'relative',
            }}
          >
            <img src={cartIcon} alt="" style={{ width: '22px', height: '22px' }} />
          </Link>

          {/* Account Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleAccountMenu}
              aria-label="Account menu"
              aria-expanded={accountMenuOpen}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <img src={userIcon} alt="" style={{ width: '22px', height: '22px' }} />
              <img src={chevronDownIcon} alt="" style={{ width: '14px', height: '14px' }} />
            </button>

            {accountMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 0.5rem)',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  minWidth: '160px',
                  zIndex: 200,
                }}
              >
                <Link
                  to="/account"
                  onClick={() => setAccountMenuOpen(false)}
                  style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', textDecoration: 'none', color: '#111827' }}
                >
                  My Account
                </Link>
                <Link
                  to="/account/orders"
                  onClick={() => setAccountMenuOpen(false)}
                  style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', textDecoration: 'none', color: '#111827' }}
                >
                  My Orders
                </Link>
                <Link
                  to="/account/wishlist"
                  onClick={() => setAccountMenuOpen(false)}
                  style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', textDecoration: 'none', color: '#111827' }}
                >
                  Wishlist
                </Link>
                <hr style={{ margin: '0.25rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                <Link
                  to="/login"
                  onClick={() => setAccountMenuOpen(false)}
                  style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', textDecoration: 'none', color: '#111827' }}
                >
                  Login
                </Link>
                <Link
                  to="/logout"
                  onClick={() => setAccountMenuOpen(false)}
                  style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', textDecoration: 'none', color: '#dc2626' }}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={mobileMenuOpen ? closeIcon : menuIcon}
              alt=""
              style={{ width: '22px', height: '22px' }}
            />
          </button>
        </nav>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <nav
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            padding: '1rem',
          }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#111827', fontSize: '0.95rem' }}>Home</Link></li>
            <li><Link to="/products" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#111827', fontSize: '0.95rem' }}>Products</Link></li>
            <li><Link to="/cart" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#111827', fontSize: '0.95rem' }}>Cart</Link></li>
            <li><Link to="/account" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: '#111827', fontSize: '0.95rem' }}>Account</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
