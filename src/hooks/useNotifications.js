import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationsService } from '@/services/notificationsService';

const POLL_INTERVAL_MS = 30000;

export function useNotifications() {
  const [list, setList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationsService.getNotifications();
      setList(data.notifications || data);
      setUnreadCount(
        (data.notifications || data).filter((n) => !n.read).length
      );
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [fetchNotifications]);

  const markRead = useCallback(async (notificationId) => {
    try {
      await notificationsService.markRead(notificationId);
      setList((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err);
    }
  }, []);

  return { list, unreadCount, markRead, loading, error };
}
