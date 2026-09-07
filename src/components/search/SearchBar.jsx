import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '@/assets/icons/search.svg';
import closeIcon from '@/assets/icons/close.svg';
import AutocompleteSuggestions from './AutocompleteSuggestions';

const AUTOCOMPLETE_DEBOUNCE_MS = 250;

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const debounceTimer = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveSuggestionIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const trimmed = query.trim();

    if (!trimmed) {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(trimmed);
    }, AUTOCOMPLETE_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  async function fetchSuggestions(term) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const response = await fetch(
        `/search/autocomplete?q=${encodeURIComponent(term)}`,
        { signal: abortControllerRef.current.signal }
      );
      if (!response.ok) {
        throw new Error('Autocomplete request failed');
      }
      const data = await response.json();
      setSuggestions(data.suggestions ?? data ?? []);
      setIsOpen(true);
      setActiveSuggestionIndex(-1);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setSuggestions([]);
        setIsOpen(false);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    setQuery(event.target.value);
  }

  function handleClear() {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveSuggestionIndex(-1);
    inputRef.current?.focus();
  }

  function submitSearch(searchQuery) {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setIsOpen(false);
    setActiveSuggestionIndex(-1);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(event) {
    if (!isOpen || suggestions.length === 0) {
      if (event.key === 'Enter') {
        submitSearch(query);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
          const selected = suggestions[activeSuggestionIndex];
          const selectedText = typeof selected === 'string' ? selected : selected.label ?? selected.text ?? selected.name ?? '';
          setQuery(selectedText);
          submitSearch(selectedText);
        } else {
          submitSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveSuggestionIndex(-1);
        break;
      default:
        break;
    }
  }

  function handleSuggestionSelect(suggestion) {
    const selectedText = typeof suggestion === 'string' ? suggestion : suggestion.label ?? suggestion.text ?? suggestion.name ?? '';
    setQuery(selectedText);
    submitSearch(selectedText);
  }

  function handleFocus() {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  }

  return (
    <div
      ref={containerRef}
      className="search-bar"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-owns="autocomplete-suggestions-list"
    >
      <div className="search-bar__input-wrapper">
        <img
          src={searchIcon}
          alt=""
          className="search-bar__icon search-bar__icon--search"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          className="search-bar__input"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Search..."
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="autocomplete-suggestions-list"
          aria-activedescendant={
            activeSuggestionIndex >= 0
              ? `suggestion-item-${activeSuggestionIndex}`
              : undefined
          }
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="search-bar__clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <img src={closeIcon} alt="" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className="search-bar__submit-btn"
          onClick={() => submitSearch(query)}
          aria-label="Submit search"
        >
          <img src={searchIcon} alt="" aria-hidden="true" />
        </button>
      </div>

      {isOpen && suggestions.length > 0 && (
        <AutocompleteSuggestions
          suggestions={suggestions}
          activeSuggestionIndex={activeSuggestionIndex}
          onSelect={handleSuggestionSelect}
          onHover={setActiveSuggestionIndex}
          loading={loading}
        />
      )}
    </div>
  );
}
