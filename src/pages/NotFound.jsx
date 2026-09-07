import { Link } from 'react-router-dom';
import emptyStateSrc from '@/assets/images/empty-state.svg';
import chevronLeftSrc from '@/assets/icons/chevron-left.svg';

const tokens = {
  colorCanvas: '#f8f9fa',
  colorSurface: '#ffffff',
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorBorder: '#868e96',
  colorOnPrimary: '#ffffff',
  colorLink: '#4c6ef5',
  colorLinkHover: '#3b5bdb',
  familySans: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  radiusMd: '10px',
  radiusLg: '16px',
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: tokens.colorCanvas,
        fontFamily: tokens.familySans,
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <img
        src={emptyStateSrc}
        alt="Page not found illustration"
        style={{ width: '200px', height: '200px', marginBottom: '32px', opacity: 0.75 }}
      />

      <p
        style={{
          fontFamily: tokens.familySans,
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: tokens.colorMuted,
          marginBottom: '12px',
        }}
      >
        Error 404
      </p>

      <h1
        style={{
          fontFamily: tokens.familySans,
          fontSize: '32px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: '40px',
          color: tokens.colorInk,
          marginBottom: '16px',
          maxWidth: '480px',
        }}
      >
        Page not found
      </h1>

      <p
        style={{
          fontFamily: tokens.familySans,
          fontSize: '16px',
          lineHeight: 1.5,
          color: tokens.colorMuted,
          marginBottom: '40px',
          maxWidth: '400px',
        }}
      >
        Sorry, we couldn&rsquo;t find the page you&rsquo;re looking for. It may have been moved,
        deleted, or the URL might be incorrect.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: tokens.colorPrimary,
            color: tokens.colorOnPrimary,
            fontFamily: tokens.familySans,
            fontSize: '16px',
            fontWeight: 600,
            padding: '12px 28px',
            borderRadius: tokens.radiusMd,
            textDecoration: 'none',
            minHeight: '44px',
          }}
        >
          <img src={chevronLeftSrc} alt="" width={16} height={16} />
          Go to Home
        </Link>

        <Link
          to="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: tokens.colorSurface,
            color: tokens.colorPrimary,
            fontFamily: tokens.familySans,
            fontSize: '16px',
            fontWeight: 600,
            padding: '12px 28px',
            borderRadius: tokens.radiusMd,
            textDecoration: 'none',
            minHeight: '44px',
            border: `1.5px solid ${tokens.colorPrimary}`,
          }}
        >
          Browse Products
        </Link>
      </div>

      <nav
        style={{
          marginTop: '48px',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
        aria-label="Helpful links"
      >
        {[
          { label: 'Home', to: '/' },
          { label: 'All Products', to: '/products' },
          { label: 'My Account', to: '/account' },
          { label: 'Cart', to: '/cart' },
        ].map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            style={{
              fontFamily: tokens.familySans,
              fontSize: '14px',
              color: tokens.colorLink,
              textDecoration: 'none',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
