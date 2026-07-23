import { useState, useCallback, useMemo } from 'react';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export function usePagination(initialPage = DEFAULT_PAGE, initialLimit = DEFAULT_LIMIT) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => {
    if (limit <= 0) return 0;
    return Math.ceil(total / limit);
  }, [total, limit]);

  const goToPage = useCallback((targetPage) => {
    setPage(targetPage);
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(DEFAULT_PAGE);
  }, []);

  const resetPagination = useCallback(() => {
    setPage(DEFAULT_PAGE);
    setLimit(initialLimit);
    setTotal(0);
  }, [initialLimit]);

  const paginationParams = useMemo(() => ({
    page,
    limit,
  }), [page, limit]);

  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    page,
    limit,
    total,
    totalPages,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    resetPagination,
    paginationParams,
    hasPrevPage,
    hasNextPage,
  };
}
