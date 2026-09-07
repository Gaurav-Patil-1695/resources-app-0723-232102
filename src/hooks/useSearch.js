import { useState, useEffect, useRef, useCallback } from 'react';
import { searchService } from '@/services/searchService';

const DEBOUNCE_DELAY_MS = 300;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);

  const search = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchService.search(searchQuery);
      setResults(data.results || data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const data = await searchService.autocomplete(searchQuery);
      setSuggestions(data.suggestions || data);
    } catch (err) {
      setSuggestions([]);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(query);
    }, DEBOUNCE_DELAY_MS);
    return () => {
      clearTimeout(debounceTimer.current);
    };
  }, [query, fetchSuggestions]);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const submitSearch = useCallback(() => {
    search(query);
  }, [query, search]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
  }, []);

  return {
    query,
    setQuery: handleQueryChange,
    results,
    suggestions,
    loading,
    error,
    submitSearch,
    clearSearch,
  };
}
