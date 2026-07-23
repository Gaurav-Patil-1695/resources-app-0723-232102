import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 30000;

export function NotificationProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await fetch('/api/notifications', {
        headers: authHeaders(),
      });
      if (!response.ok) return;
      const data = await response.json();
      const list = data.notifications || data.items || [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.read).length);
    } catch {
      // silent poll failure
    }
  }, [isAuthenticated, authHeaders]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await fetch('/api/notifications/unread-count', {
        headers: authHeaders(),
      });
      if (!response.ok) return;
      const data = await response.json();
      setUnreadCount(data.count ?? 0);
    } catch {
      // silent failure
    }
  }, [isAuthenticated, authHeaders]);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchNotifications().finally(() => setLoading(false));

      pollRef.current = setInterval(() => {
        fetchUnreadCount();
      }, POLL_INTERVAL_MS);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const markAsRead = useCallback(async (notificationId) => {
    setError(null);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: authHeaders(),
      });
    } catch {
      setError('Failed to mark notification as read');
    }
  }, [authHeaders]);

  const markAllAsRead = useCallback(async () => {
    setError(null);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: authHeaders(),
      });
    } catch {
      setError('Failed to mark all notifications as read');
    }
  }, [authHeaders]);

  const deleteNotification = useCallback(async (notificationId) => {
    setError(null);
    const target = notifications.find((n) => n.id === notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    if (target && !target.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
    } catch {
      setError('Failed to delete notification');
    }
  }, [notifications, authHeaders]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchNotifications();
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications]);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    clearError,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
