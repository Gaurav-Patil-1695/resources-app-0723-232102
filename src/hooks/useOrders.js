import { useState, useEffect, useCallback } from 'react';
import { ordersService } from '@/services/ordersService';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderHistory = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await ordersService.getOrders(params);
      setOrders(data.orders || data);
      setError(null);
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderDetail = useCallback(async (orderId) => {
    setLoading(true);
    try {
      const data = await ordersService.getOrderById(orderId);
      setOrder(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOrder = useCallback(() => {
    setOrder(null);
  }, []);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  return {
    orders,
    order,
    loading,
    error,
    fetchOrderHistory,
    fetchOrderDetail,
    clearOrder,
  };
}
