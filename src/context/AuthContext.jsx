import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token);

  const persistAuth = useCallback((newToken, newUser) => {
    try {
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
      if (newUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    } catch {
      // storage unavailable
    }
  }, []);

  const login = useCallback(async (credentials, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Login failed');
      }

      const data = await response.json();
      const newToken = data.access_token;
      const newUser = data.user;

      setToken(newToken);
      setUser(newUser);
      persistAuth(newToken, newUser);

      if (options.onSuccess) {
        options.onSuccess({ token: newToken, user: newUser });
      }

      return { token: newToken, user: newUser };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistAuth]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    persistAuth(null, null);
  }, [persistAuth]);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    } catch {
      // storage unavailable
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    // Validate token on mount (optional: decode JWT expiry)
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            logout();
          }
        }
      } catch {
        // malformed token
        logout();
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    token,
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
