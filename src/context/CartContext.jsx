import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'guest_cart';

function loadGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable
  }
}

function clearGuestCart() {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch {
    // storage unavailable
  }
}

function mergeCartItems(existing, incoming) {
  const map = new Map();
  existing.forEach((item) => map.set(item.product_id, { ...item }));
  incoming.forEach((item) => {
    if (map.has(item.product_id)) {
      map.get(item.product_id).quantity += item.quantity;
    } else {
      map.set(item.product_id, { ...item });
    }
  });
  return Array.from(map.values());
}

export function CartProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mergedRef = useRef(false);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  const fetchServerCart = useCallback(async () => {
    if (!isAuthenticated) return [];
    try {
      const response = await fetch('/api/cart', {
        headers: authHeaders(),
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.items || [];
    } catch {
      return [];
    }
  }, [isAuthenticated, authHeaders]);

  const syncServerCart = useCallback(async (cartItems) => {
    if (!isAuthenticated) return;
    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ items: cartItems }),
      });
    } catch {
      // sync failure is silent
    }
  }, [isAuthenticated, authHeaders]);

  // On auth change: merge guest cart into server cart
  useEffect(() => {
    if (isAuthenticated && !mergedRef.current) {
      mergedRef.current = true;
      setLoading(true);
      const guestItems = loadGuestCart();
      fetchServerCart()
        .then((serverItems) => {
          const merged = guestItems.length > 0
            ? mergeCartItems(serverItems, guestItems)
            : serverItems;
          setItems(merged);
          if (guestItems.length > 0) {
            clearGuestCart();
            syncServerCart(merged);
          }
        })
        .catch(() => {
          setItems(loadGuestCart());
        })
        .finally(() => setLoading(false));
    } else if (!isAuthenticated) {
      mergedRef.current = false;
      setItems(loadGuestCart());
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist guest cart to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      saveGuestCart(items);
    }
  }, [items, isAuthenticated]);

  const addItem = useCallback(async (product, quantity = 1) => {
    setError(null);
    const newItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || null,
      quantity,
    };

    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, newItem];
    });

    if (isAuthenticated) {
      try {
        await fetch('/api/cart/items', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ product_id: product.id, quantity }),
        });
      } catch (err) {
        setError('Failed to add item to cart');
      }
    }
  }, [isAuthenticated, authHeaders]);

  const removeItem = useCallback(async (productId) => {
    setError(null);
    setItems((prev) => prev.filter((i) => i.product_id !== productId));

    if (isAuthenticated) {
      try {
        await fetch(`/api/cart/items/${productId}`, {
          method: 'DELETE',
          headers: authHeaders(),
        });
      } catch (err) {
        setError('Failed to remove item from cart');
      }
    }
  }, [isAuthenticated, authHeaders]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    setError(null);
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.product_id === productId ? { ...i, quantity } : i
      )
    );

    if (isAuthenticated) {
      try {
        await fetch(`/api/cart/items/${productId}`, {
          method: 'PATCH',
          headers: authHeaders(),
          body: JSON.stringify({ quantity }),
        });
      } catch (err) {
        setError('Failed to update cart');
      }
    }
  }, [isAuthenticated, authHeaders, removeItem]);

  const clearCart = useCallback(async () => {
    setError(null);
    setItems([]);
    clearGuestCart();

    if (isAuthenticated) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: authHeaders(),
        });
      } catch (err) {
        setError('Failed to clear cart');
      }
    }
  }, [isAuthenticated, authHeaders]);

  const clearError = useCallback(() => setError(null), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = {
    items,
    loading,
    error,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    clearError,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
