import { Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';
import placeholderProductSrc from '@/assets/images/placeholder-product.svg';
import searchIconSrc from '@/assets/icons/search.svg';
import cartIconSrc from '@/assets/icons/cart.svg';
import userIconSrc from '@/assets/icons/user.svg';
import heartIconSrc from '@/assets/icons/heart.svg';
import starIconSrc from '@/assets/icons/star.svg';
import chevronRightSrc from '@/assets/icons/chevron-right.svg';

const tokens = {
  colorCanvas: '#f8f9fa',
  colorSurface: '#ffffff',
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorSecondary: '#fd7e14',
  colorSecondarySubtle: '#fff3e6',
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorBorder: '#868e96',
  colorOnPrimary: '#ffffff',
  colorLink: '#4c6ef5',
  colorLinkHover: '#3b5bdb',
  colorSuccess: '#37b24d',
  colorSuccessSubtle: '#d3f9d8',
  familySans: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  radiusMd: '10px',
  radiusLg: '16px',
  radiusXl: '24px',
  radiusFull: '9999px',
  radiusSm: '6px',
};

const featuredCategories = [
  { id: 'electronics', label: 'Electronics', emoji: '💻' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'home-living', label: 'Home & Living', emoji: '🏠' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'sports', label: 'Sports', emoji: '🏅' },
  { id: 'books', label: 'Books', emoji: '📚' },
];

const featuredProducts = [
  { id: 1, name: 'Wireless Headphones', price: 1299, originalPrice: 2499, rating: 4.5, reviews: 128, badge: '48% off' },
  { id: 2, name: 'Running Shoes', price: 899, originalPrice: 1799, rating: 4.3, reviews: 94, badge: '50% off' },
  { id: 3, name: 'Smart Watch', price: 3499, originalPrice: 5999, rating: 4.7, reviews: 213, badge: '42% off' },
  { id: 4, name: 'Casual Tote Bag', price: 449, originalPrice: 999, rating: 4.1, reviews: 67, badge: '55% off' },
];

function NavBar() {
  return (
    <header
      style={{
        background: tokens.colorSurface,
        borderBottom: `1px solid ${tokens.colorBorder}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          height: '60px',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img src={logoSrc} alt="ShopMini" height={32} />
          <span
            style={{
              marginLeft: '8px',
              fontFamily: tokens.familySans,
              fontSize: '20px',
              fontWeight: 700,
              color: tokens.colorPrimary,
              letterSpacing: '-0.01em',
            }}
          >
            ShopMini
          </span>
        </Link>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: tokens.colorCanvas,
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: tokens.radiusSm,
            padding: '0 12px',
            height: '40px',
            gap: '8px',
          }}
        >
          <img src={searchIconSrc} alt="" width={16} height={16} style={{ opacity: 0.5 }} />
          <input
            type="search"
            placeholder="Search products, brands and more…"
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontFamily: tokens.familySans,
              fontSize: '14px',
              color: tokens.colorInk,
              outline: 'none',
            }}
            aria-label="Search products"
          />
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <Link
            to="/wishlist"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: tokens.radiusMd,
              color: tokens.colorMuted,
              textDecoration: 'none',
            }}
            aria-label="Wishlist"
          >
            <img src={heartIconSrc} alt="" width={22} height={22} />
          </Link>
          <Link
            to="/cart"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: tokens.radiusMd,
              color: tokens.colorMuted,
              textDecoration: 'none',
            }}
            aria-label="Cart"
          >
            <img src={cartIconSrc} alt="" width={22} height={22} />
          </Link>
          <Link
            to="/account"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: tokens.radiusMd,
              color: tokens.colorMuted,
              textDecoration: 'none',
            }}
            aria-label="Account"
          >
            <img src={userIconSrc} alt="" width={22} height={22} />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function HeroBanner() {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${tokens.colorPrimary} 0%, ${tokens.colorPrimaryDark} 100%)`,
        color: tokens.colorOnPrimary,
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p
          style={{
            fontFamily: tokens.familySans,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: tokens.colorPrimarySubtle,
            marginBottom: '12px',
          }}
        >
          Limited Time Sale
        </p>
        <h1
          style={{
            fontFamily: tokens.familySans,
            fontSize: '40px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: '16px',
            maxWidth: '720px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Up to 60% off on electronics, fashion &amp; home essentials
        </h1>
        <p
          style={{
            fontFamily: tokens.familySans,
            fontSize: '16px',
            lineHeight: 1.5,
            color: tokens.colorPrimarySubtle,
            marginBottom: '32px',
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Discover thousands of products at unbeatable prices, delivered fast to your door.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: tokens.colorOnPrimary,
              color: tokens.colorPrimary,
              fontFamily: tokens.familySans,
              fontSize: '16px',
              fontWeight: 600,
              padding: '12px 28px',
              borderRadius: tokens.radiusMd,
              textDecoration: 'none',
              minHeight: '44px',
            }}
          >
            Shop Now
            <img src={chevronRightSrc} alt="" width={16} height={16} />
          </Link>
          <Link
            to="/products?category=home-living"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              color: tokens.colorOnPrimary,
              fontFamily: tokens.familySans,
              fontSize: '16px',
              fontWeight: 600,
              padding: '12px 28px',
              borderRadius: tokens.radiusFull,
              textDecoration: 'none',
              border: `2px solid ${tokens.colorOnPrimary}`,
              minHeight: '44px',
            }}
          >
            🏠 Home &amp; Living
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section style={{ padding: '48px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontFamily: tokens.familySans,
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: tokens.colorInk,
            marginBottom: '24px',
          }}
        >
          Shop by Category
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '16px',
          }}
        >
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: tokens.colorSurface,
                border: `1px solid ${tokens.colorBorder}`,
                borderRadius: tokens.radiusLg,
                padding: '24px 16px',
                textDecoration: 'none',
                color: tokens.colorInk,
                fontFamily: tokens.familySans,
                fontSize: '14px',
                fontWeight: 500,
                transition: 'box-shadow 0.15s',
              }}
            >
              <span style={{ fontSize: '32px', lineHeight: 1 }}>{cat.emoji}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: tokens.colorSurface,
        border: `1px solid ${tokens.colorBorder}`,
        borderRadius: tokens.radiusLg,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div style={{ position: 'relative', background: tokens.colorCanvas, aspectRatio: '1 / 1' }}>
        <img
          src={placeholderProductSrc}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {product.badge && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: tokens.colorSecondary,
              color: tokens.colorOnPrimary,
              fontFamily: tokens.familySans,
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              padding: '2px 8px',
              borderRadius: tokens.radiusFull,
            }}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <h3
          style={{
            fontFamily: tokens.familySans,
            fontSize: '16px',
            fontWeight: 600,
            color: tokens.colorInk,
            margin: 0,
            lineHeight: '24px',
          }}
        >
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <img src={starIconSrc} alt="" width={14} height={14} style={{ filter: 'sepia(1) saturate(5) hue-rotate(5deg)' }} />
          <span style={{ fontFamily: tokens.familySans, fontSize: '14px', color: tokens.colorMuted }}>
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
          <span
            style={{
              fontFamily: tokens.familySans,
              fontSize: '20px',
              fontWeight: 700,
              color: tokens.colorInk,
            }}
          >
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span
            style={{
              fontFamily: tokens.familySans,
              fontSize: '14px',
              color: tokens.colorMuted,
              textDecoration: 'line-through',
            }}
          >
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedProducts() {
  return (
    <section style={{ padding: '0 24px 48px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <h2
            style={{
              fontFamily: tokens.familySans,
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: tokens.colorInk,
              margin: 0,
            }}
          >
            Featured Deals
          </h2>
          <Link
            to="/products"
            style={{
              fontFamily: tokens.familySans,
              fontSize: '14px',
              color: tokens.colorLink,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View all products
            <img src={chevronRightSrc} alt="" width={14} height={14} />
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section style={{ padding: '0 24px 48px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            background: tokens.colorSecondarySubtle,
            border: `1px solid ${tokens.colorSecondary}`,
            borderRadius: tokens.radiusXl,
            padding: '40px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: tokens.familySans,
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: tokens.colorSecondary,
                marginBottom: '8px',
              }}
            >
              New Members Offer
            </p>
            <h2
              style={{
                fontFamily: tokens.familySans,
                fontSize: '24px',
                fontWeight: 700,
                color: tokens.colorInk,
                marginBottom: '8px',
                letterSpacing: '-0.01em',
              }}
            >
              Get 10% off your first order
            </h2>
            <p
              style={{
                fontFamily: tokens.familySans,
                fontSize: '14px',
                color: tokens.colorMuted,
                maxWidth: '400px',
                lineHeight: 1.5,
              }}
            >
              Sign up today and use code <strong>WELCOME10</strong> at checkout.
            </p>
          </div>
          <Link
            to="/register"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: tokens.colorSecondary,
              color: tokens.colorOnPrimary,
              fontFamily: tokens.familySans,
              fontSize: '16px',
              fontWeight: 600,
              padding: '12px 28px',
              borderRadius: tokens.radiusMd,
              textDecoration: 'none',
              minHeight: '44px',
              flexShrink: 0,
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: tokens.colorInk,
        color: tokens.colorOnPrimary,
        padding: '40px 24px',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '32px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: tokens.familySans,
              fontSize: '20px',
              fontWeight: 700,
              color: tokens.colorOnPrimary,
              marginBottom: '8px',
            }}
          >
            ShopMini
          </div>
          <p
            style={{
              fontFamily: tokens.familySans,
              fontSize: '14px',
              color: tokens.colorBorder,
              maxWidth: '240px',
              lineHeight: 1.5,
            }}
          >
            Your one-stop destination for great deals on everything you need.
          </p>
        </div>
        <nav style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          <div>
            <p
              style={{
                fontFamily: tokens.familySans,
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: tokens.colorBorder,
                marginBottom: '12px',
              }}
            >
              Shop
            </p>
            {['All Products', 'Electronics', 'Fashion', 'Home & Living'].map((label) => (
              <Link
                key={label}
                to="/products"
                style={{
                  display: 'block',
                  fontFamily: tokens.familySans,
                  fontSize: '14px',
                  color: tokens.colorOnPrimary,
                  textDecoration: 'none',
                  marginBottom: '8px',
                  opacity: 0.85,
                }}
              >
                {label}
              </Link>
            ))}
          </div>
          <div>
            <p
              style={{
                fontFamily: tokens.familySans,
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: tokens.colorBorder,
                marginBottom: '12px',
              }}
            >
              Account
            </p>
            {['Sign In', 'Register', 'Orders', 'Wishlist'].map((label) => (
              <Link
                key={label}
                to="/account"
                style={{
                  display: 'block',
                  fontFamily: tokens.familySans,
                  fontSize: '14px',
                  color: tokens.colorOnPrimary,
                  textDecoration: 'none',
                  marginBottom: '8px',
                  opacity: 0.85,
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div
        style={{
          maxWidth: '1200px',
          margin: '32px auto 0',
          paddingTop: '24px',
          borderTop: `1px solid rgba(134,142,150,0.3)`,
          fontFamily: tokens.familySans,
          fontSize: '12px',
          color: tokens.colorBorder,
        }}
      >
        © {new Date().getFullYear()} ShopMini. All rights reserved.
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: tokens.colorCanvas,
        fontFamily: tokens.familySans,
      }}
    >
      <NavBar />
      <main style={{ flex: 1 }}>
        <HeroBanner />
        <CategoryGrid />
        <FeaturedProducts />
        <PromoBanner />
      </main>
      <Footer />
    </div>
  );
}
