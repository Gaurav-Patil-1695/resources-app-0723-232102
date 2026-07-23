import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cartIcon from '@/assets/icons/cart.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const tokens = {
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorOnPrimary: '#ffffff',
  colorSurface: '#ffffff',
  colorCanvas: '#f8f9fa',
  colorBorder: '#868e96',
  colorError: '#f03e3e',
  colorErrorSubtle: '#ffe3e3',
  colorSuccess: '#37b24d',
  colorSuccessSubtle: '#d3f9d8',
  colorDisabledBg: '#e9ecef',
  colorDisabledText: '#adb5bd',
  colorFocusRing: '#4c6ef5',
  radiusMd: '10px',
  radiusSm: '6px',
  radiusXs: '3px',
  radiusFull: '9999px',
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '20px',
  space6: '24px',
  space8: '32px',
  space10: '40px',
  space12: '48px',
  contentMaxWidth: '1200px',
  fontSans: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
};

const STATUS = { LOADING: 'loading', IDLE: 'idle', ERROR: 'error' };

const MOCK_CART_ITEMS = [
  {
    id: 'ci-001',
    sku_id: 'aaaaaaaa-0000-0000-0000-000000000001',
    name: 'Wireless Noise-Cancelling Headphones',
    variant: 'Midnight Black / Over-Ear',
    price: 79.99,
    quantity: 1,
    image: null,
    stock: 10,
  },
  {
    id: 'ci-002',
    sku_id: 'aaaaaaaa-0000-0000-0000-000000000002',
    name: 'Mechanical Keyboard',
    variant: 'TKL / Cherry MX Red',
    price: 129.99,
    quantity: 2,
    image: null,
    stock: 5,
  },
  {
    id: 'ci-003',
    sku_id: 'aaaaaaaa-0000-0000-0000-000000000003',
    name: 'USB-C Hub 7-in-1',
    variant: 'Space Grey',
    price: 39.99,
    quantity: 1,
    image: null,
    stock: 20,
  },
];

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        background: isError ? tokens.colorErrorSubtle : tokens.colorSuccessSubtle,
        color: isError ? tokens.colorError : tokens.colorSuccess,
        border: `1px solid ${isError ? tokens.colorError : tokens.colorSuccess}`,
        borderRadius: tokens.radiusMd,
        padding: `${tokens.space3} ${tokens.space6}`,
        fontFamily: tokens.fontSans,
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: tokens.space3,
        minWidth: '260px',
        maxWidth: '400px',
      }}
    >
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          fontSize: '18px',
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        gap: tokens.space4,
        padding: tokens.space6,
        background: tokens.colorSurface,
        borderRadius: tokens.radiusMd,
        border: `1px solid ${tokens.colorBorder}`,
        marginBottom: tokens.space4,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: '96px',
          height: '96px',
          borderRadius: tokens.radiusSm,
          background: tokens.colorDisabledBg,
          flexShrink: 0,
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
        <div style={{ height: '20px', width: '60%', background: tokens.colorDisabledBg, borderRadius: tokens.radiusXs, animation: 'shimmer 1.5s infinite' }} />
        <div style={{ height: '16px', width: '40%', background: tokens.colorDisabledBg, borderRadius: tokens.radiusXs, animation: 'shimmer 1.5s infinite' }} />
        <div style={{ height: '16px', width: '25%', background: tokens.colorDisabledBg, borderRadius: tokens.radiusXs, animation: 'shimmer 1.5s infinite' }} />
      </div>
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div
      style={{
        background: tokens.colorSurface,
        borderRadius: tokens.radiusMd,
        border: `1px solid ${tokens.colorBorder}`,
        padding: tokens.space6,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.space4,
      }}
    >
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ height: '18px', background: tokens.colorDisabledBg, borderRadius: tokens.radiusXs, animation: 'shimmer 1.5s infinite' }} />
      ))}
    </div>
  );
}

function EmptyState({ onShop }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${tokens.space12} ${tokens.space6}`,
        textAlign: 'center',
        gap: tokens.space6,
      }}
    >
      <img
        src={cartIcon}
        alt=""
        aria-hidden="true"
        style={{ width: '80px', height: '80px', opacity: 0.3 }}
      />
      <div>
        <h2
          style={{
            fontFamily: tokens.fontSans,
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: '32px',
            color: tokens.colorInk,
            margin: `0 0 ${tokens.space2}`,
          }}
        >
          Your cart is empty
        </h2>
        <p
          style={{
            fontFamily: tokens.fontSans,
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            color: tokens.colorMuted,
            margin: 0,
          }}
        >
          Looks like you haven't added anything yet.
        </p>
      </div>
      <button
        onClick={onShop}
        style={{
          background: tokens.colorPrimary,
          color: tokens.colorOnPrimary,
          border: 'none',
          borderRadius: tokens.radiusMd,
          padding: `${tokens.space3} ${tokens.space8}`,
          fontFamily: tokens.fontSans,
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: '44px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = tokens.colorPrimaryDark; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = tokens.colorPrimary; }}
      >
        Start shopping
      </button>
    </div>
  );
}

function ErrorState({ onRefresh }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${tokens.space12} ${tokens.space6}`,
        textAlign: 'center',
        gap: tokens.space4,
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: tokens.colorErrorSubtle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
        }}
        aria-hidden="true"
      >
        !
      </div>
      <div>
        <h2
          style={{
            fontFamily: tokens.fontSans,
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: '32px',
            color: tokens.colorInk,
            margin: `0 0 ${tokens.space2}`,
          }}
        >
          Couldn't load your cart
        </h2>
        <p
          style={{
            fontFamily: tokens.fontSans,
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            color: tokens.colorMuted,
            margin: 0,
          }}
        >
          Please refresh the page.
        </p>
      </div>
      <button
        onClick={onRefresh}
        style={{
          background: tokens.colorPrimary,
          color: tokens.colorOnPrimary,
          border: 'none',
          borderRadius: tokens.radiusMd,
          padding: `${tokens.space3} ${tokens.space8}`,
          fontFamily: tokens.fontSans,
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: '44px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = tokens.colorPrimaryDark; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = tokens.colorPrimary; }}
      >
        Refresh
      </button>
    </div>
  );
}

function CartItemRow({ item, onQuantityChange, onRemove, isUpdating }) {
  const lineTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div
      style={{
        display: 'flex',
        gap: tokens.space4,
        padding: tokens.space6,
        background: tokens.colorSurface,
        borderRadius: tokens.radiusMd,
        border: `1px solid ${tokens.colorBorder}`,
        marginBottom: tokens.space4,
        alignItems: 'flex-start',
        opacity: isUpdating ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <img
        src={item.image || placeholderProduct}
        alt={item.name}
        style={{
          width: '96px',
          height: '96px',
          objectFit: 'cover',
          borderRadius: tokens.radiusSm,
          border: `1px solid ${tokens.colorBorder}`,
          flexShrink: 0,
          background: tokens.colorCanvas,
        }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
        <h3
          style={{
            fontFamily: tokens.fontSans,
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
            color: tokens.colorInk,
            margin: 0,
          }}
        >
          {item.name}
        </h3>
        {item.variant && (
          <p
            style={{
              fontFamily: tokens.fontSans,
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
              color: tokens.colorMuted,
              margin: 0,
            }}
          >
            {item.variant}
          </p>
        )}
        <p
          style={{
            fontFamily: tokens.fontSans,
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            color: tokens.colorBody,
            margin: 0,
          }}
        >
          ${item.price.toFixed(2)} each
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.space2,
            marginTop: tokens.space2,
          }}
        >
          <button
            aria-label={`Decrease quantity of ${item.name}`}
            disabled={isUpdating || item.quantity <= 1}
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: tokens.radiusSm,
              background: item.quantity <= 1 ? tokens.colorDisabledBg : tokens.colorSurface,
              cursor: item.quantity <= 1 || isUpdating ? 'not-allowed' : 'pointer',
              padding: 0,
              transition: 'background 0.15s',
            }}
          >
            <img src={minusIcon} alt="" aria-hidden="true" style={{ width: '14px', height: '14px' }} />
          </button>
          <span
            aria-live="polite"
            aria-label={`Quantity: ${item.quantity}`}
            style={{
              fontFamily: tokens.fontSans,
              fontSize: '16px',
              fontWeight: 500,
              color: tokens.colorInk,
              minWidth: '28px',
              textAlign: 'center',
              display: 'inline-block',
            }}
          >
            {item.quantity}
          </span>
          <button
            aria-label={`Increase quantity of ${item.name}`}
            disabled={isUpdating || item.quantity >= item.stock}
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: tokens.radiusSm,
              background: item.quantity >= item.stock ? tokens.colorDisabledBg : tokens.colorSurface,
              cursor: item.quantity >= item.stock || isUpdating ? 'not-allowed' : 'pointer',
              padding: 0,
              transition: 'background 0.15s',
            }}
          >
            <img src={plusIcon} alt="" aria-hidden="true" style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: tokens.space3,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: tokens.fontSans,
            fontSize: '16px',
            fontWeight: 700,
            color: tokens.colorInk,
          }}
        >
          ${lineTotal}
        </span>
        <button
          aria-label={`Remove ${item.name} from cart`}
          disabled={isUpdating}
          onClick={() => onRemove(item.id, item.name)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.space1,
            background: 'none',
            border: 'none',
            cursor: isUpdating ? 'not-allowed' : 'pointer',
            color: tokens.colorError,
            fontFamily: tokens.fontSans,
            fontSize: '14px',
            fontWeight: 400,
            padding: `${tokens.space1} ${tokens.space2}`,
            borderRadius: tokens.radiusSm,
            minHeight: '44px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { if (!isUpdating) e.currentTarget.style.background = tokens.colorErrorSubtle; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
        >
          <img src={trashIcon} alt="" aria-hidden="true" style={{ width: '14px', height: '14px' }} />
          Remove
        </button>
      </div>
    </div>
  );
}

function OrderSummary({ items, onCheckout, isCheckingOut }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? (subtotal >= 50 ? 0 : 5.99) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div
      style={{
        background: tokens.colorSurface,
        borderRadius: tokens.radiusMd,
        border: `1px solid ${tokens.colorBorder}`,
        padding: tokens.space6,
        position: 'sticky',
        top: tokens.space6,
      }}
    >
      <h2
        style={{
          fontFamily: tokens.fontSans,
          fontSize: '20px',
          fontWeight: 600,
          lineHeight: '28px',
          color: tokens.colorInk,
          margin: `0 0 ${tokens.space5}`,
        }}
      >
        Order summary
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space3 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: tokens.fontSans, fontSize: '14px', color: tokens.colorMuted }}>Subtotal</span>
          <span style={{ fontFamily: tokens.fontSans, fontSize: '14px', color: tokens.colorBody }}>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: tokens.fontSans, fontSize: '14px', color: tokens.colorMuted }}>Shipping</span>
          <span style={{ fontFamily: tokens.fontSans, fontSize: '14px', color: tokens.colorBody }}>
            {shipping === 0 ? (
              <span style={{ color: tokens.colorSuccess, fontWeight: 500 }}>Free</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: tokens.fontSans, fontSize: '14px', color: tokens.colorMuted }}>Estimated tax (8%)</span>
          <span style={{ fontFamily: tokens.fontSans, fontSize: '14px', color: tokens.colorBody }}>${tax.toFixed(2)}</span>
        </div>
        <hr
          style={{
            border: 'none',
            borderTop: `1px solid ${tokens.colorBorder}`,
            margin: `${tokens.space2} 0`,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: tokens.fontSans,
              fontSize: '16px',
              fontWeight: 600,
              color: tokens.colorInk,
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: tokens.fontSans,
              fontSize: '16px',
              fontWeight: 700,
              color: tokens.colorInk,
            }}
          >
            ${total.toFixed(2)}
          </span>
        </div>
        {subtotal > 0 && subtotal < 50 && (
          <p
            style={{
              fontFamily: tokens.fontSans,
              fontSize: '12px',
              color: tokens.colorMuted,
              margin: `${tokens.space1} 0 0`,
              background: tokens.colorPrimarySubtle,
              borderRadius: tokens.radiusXs,
              padding: `${tokens.space1} ${tokens.space2}`,
            }}
          >
            Add ${(50 - subtotal).toFixed(2)} more for free shipping!
          </p>
        )}
      </div>
      <button
        onClick={onCheckout}
        disabled={items.length === 0 || isCheckingOut}
        aria-label="Proceed to checkout"
        style={{
          marginTop: tokens.space6,
          width: '100%',
          background: items.length === 0 || isCheckingOut ? tokens.colorDisabledBg : tokens.colorPrimary,
          color: items.length === 0 || isCheckingOut ? tokens.colorDisabledText : tokens.colorOnPrimary,
          border: 'none',
          borderRadius: tokens.radiusMd,
          padding: `${tokens.space3} ${tokens.space6}`,
          fontFamily: tokens.fontSans,
          fontSize: '16px',
          fontWeight: 600,
          cursor: items.length === 0 || isCheckingOut ? 'not-allowed' : 'pointer',
          minHeight: '44px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => {
          if (items.length > 0 && !isCheckingOut) e.currentTarget.style.background = tokens.colorPrimaryDark;
        }}
        onMouseLeave={(e) => {
          if (items.length > 0 && !isCheckingOut) e.currentTarget.style.background = tokens.colorPrimary;
        }}
      >
        {isCheckingOut ? 'Processing…' : 'Proceed to checkout'}
      </button>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUS.LOADING);
  const [items, setItems] = useState([]);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const loadCart = useCallback(() => {
    setStatus(STATUS.LOADING);
    setTimeout(() => {
      try {
        setItems(MOCK_CART_ITEMS);
        setStatus(STATUS.IDLE);
      } catch {
        setStatus(STATUS.ERROR);
      }
    }, 900);
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = useCallback(async (itemId, newQuantity) => {
    if (newQuantity < 0) return;
    if (newQuantity === 0) {
      handleRemove(itemId);
      return;
    }
    setUpdatingIds((prev) => new Set([...prev, itemId]));
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch {
      showToast('Failed to update quantity. Please try again.', 'error');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  }, [showToast]);

  const handleRemove = useCallback(async (itemId, itemName) => {
    setUpdatingIds((prev) => new Set([...prev, itemId]));
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      showToast('Item removed from cart', 'success');
    } catch {
      showToast('Failed to remove item. Please try again.', 'error');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  }, [showToast]);

  const handleCheckout = useCallback(async () => {
    if (items.length === 0 || isCheckingOut) return;
    setIsCheckingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      navigate('/checkout');
    } catch {
      showToast('Unable to proceed to checkout. Please try again.', 'error');
      setIsCheckingOut(false);
    }
  }, [items.length, isCheckingOut, navigate, showToast]);

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        *:focus-visible {
          outline: 3px solid ${tokens.colorFocusRing};
          outline-offset: 2px;
        }
      `}</style>
      <main
        id="main-content"
        style={{
          background: tokens.colorCanvas,
          minHeight: '100vh',
          fontFamily: tokens.fontSans,
          paddingTop: tokens.space8,
          paddingBottom: tokens.space12,
        }}
      >
        <div
          style={{
            maxWidth: tokens.contentMaxWidth,
            margin: '0 auto',
            padding: `0 ${tokens.space6}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.space4,
              marginBottom: tokens.space6,
            }}
          >
            <h1
              style={{
                fontFamily: tokens.fontSans,
                fontSize: '32px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: '40px',
                color: tokens.colorInk,
                margin: 0,
              }}
            >
              Your cart
            </h1>
            {status === STATUS.IDLE && (
              <span
                aria-label={`${totalItemCount} item${totalItemCount !== 1 ? 's' : ''} in cart`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: tokens.colorPrimarySubtle,
                  color: tokens.colorPrimary,
                  fontFamily: tokens.fontSans,
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  lineHeight: '16px',
                  padding: `${tokens.space1} ${tokens.space2}`,
                  borderRadius: tokens.radiusFull,
                  verticalAlign: 'middle',
                }}
              >
                {totalItemCount} item{totalItemCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {status === STATUS.LOADING && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 340px',
                gap: tokens.space8,
                alignItems: 'start',
              }}
            >
              <div>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
              <SkeletonSummary />
            </div>
          )}

          {status === STATUS.ERROR && (
            <ErrorState onRefresh={loadCart} />
          )}

          {status === STATUS.IDLE && items.length === 0 && (
            <EmptyState onShop={() => navigate('/products')} />
          )}

          {status === STATUS.IDLE && items.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 340px',
                gap: tokens.space8,
                alignItems: 'start',
              }}
            >
              <section aria-label="Cart items">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                    isUpdating={updatingIds.has(item.id)}
                  />
                ))}
              </section>
              <aside aria-label="Order summary">
                <OrderSummary
                  items={items}
                  onCheckout={handleCheckout}
                  isCheckingOut={isCheckingOut}
                />
              </aside>
            </div>
          )}
        </div>
      </main>
      <Toast toast={toast} onClose={dismissToast} />
    </>
  );
}
