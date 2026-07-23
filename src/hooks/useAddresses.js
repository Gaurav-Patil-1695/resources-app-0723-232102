import { useState, useEffect, useCallback } from 'react';
import { addressesService } from '@/services/addressesService';

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await addressesService.getAddresses();
      setAddresses(data.addresses || data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addAddress = useCallback(async (addressData) => {
    setLoading(true);
    try {
      const newAddress = await addressesService.createAddress(addressData);
      setAddresses((prev) => [...prev, newAddress]);
      setError(null);
      return newAddress;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (addressId, addressData) => {
    setLoading(true);
    try {
      const updated = await addressesService.updateAddress(addressId, addressData);
      setAddresses((prev) =>
        prev.map((a) => (a.id === addressId ? updated : a))
      );
      setError(null);
      return updated;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (addressId) => {
    setLoading(true);
    try {
      await addressesService.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const setDefaultAddress = useCallback(async (addressId) => {
    setLoading(true);
    try {
      const updated = await addressesService.setDefault(addressId);
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        }))
      );
      setError(null);
      return updated;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
