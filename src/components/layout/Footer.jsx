import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';

const Footer = () => {
  const currentYear = 2024;

  return (
    <footer style={{
      backgroundColor: '#111827',
      color: '#d1d5db',
      padding: '3rem 1rem 1.5rem',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          {/* Brand Column */}
          <div>
            <img src={logo} alt="Site Logo" style={{ height: '32px', width: 'auto', marginBottom: '1rem', filter: 'brightness(0) invert(1)' }} />
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#9ca3af' }}>
              Your one-stop destination for quality products at great prices.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f9fafb', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Shop
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/products" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>All Products</Link></li>
              <li><Link to="/categories" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Categories</Link></li>
              <li><Link to="/deals" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Deals</Link></li>
              <li><Link to="/new-arrivals" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>New Arrivals</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f9fafb', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Account
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/account" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>My Account</Link></li>
              <li><Link to="/account/orders" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>My Orders</Link></li>
              <li><Link to="/account/wishlist" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Wishlist</Link></li>
              <li><Link to="/account/addresses" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Addresses</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f9fafb', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Support
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/help" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Help Center</Link></li>
              <li><Link to="/contact" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Contact Us</Link></li>
              <li><Link to="/returns" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Returns & Refunds</Link></li>
              <li><Link to="/shipping" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Shipping Info</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f9fafb', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Legal
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/privacy" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Terms of Service</Link></li>
              <li><Link to="/cookies" style={{ textDecoration: 'none', color: '#9ca3af', fontSize: '0.875rem' }}>Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #374151', marginBottom: '1.5rem' }} />

        <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
          &copy; {currentYear} ShopApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
