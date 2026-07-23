import { useState, useCallback, useMemo } from 'react';

const DEFAULT_FILTERS = {};

export function useFilters(initialFilters = DEFAULT_FILTERS) {
  const [filters, setFilters] = useState(initialFilters);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const toggleFilterValue = useCallback((key, value) => {
    setFilters((prev) => {
      const current = prev[key];
      if (Array.isArray(current)) {
        const exists = current.includes(value);
        return {
          ...prev,
          [key]: exists
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      }
      return {
        ...prev,
        [key]: [value],
      };
    });
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const queryParams = useMemo(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;
      if (Array.isArray(value) && value.length === 0) return;
      params[key] = Array.isArray(value) ? value.join(',') : value;
    });
    return params;
  }, [filters]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(queryParams).length > 0;
  }, [queryParams]);

  return {
    filters,
    setFilter,
    toggleFilterValue,
    removeFilter,
    resetFilters,
    queryParams,
    hasActiveFilters,
  };
}
