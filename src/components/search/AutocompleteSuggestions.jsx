import { useEffect, useRef } from 'react';
import searchIcon from '@/assets/icons/search.svg';

function getSuggestionText(suggestion) {
  if (typeof suggestion === 'string') return suggestion;
  return suggestion.label ?? suggestion.text ?? suggestion.name ?? '';
}

function getSuggestionKey(suggestion, index) {
  if (typeof suggestion === 'object' && suggestion !== null && (suggestion.id ?? suggestion.value) !== undefined) {
    return suggestion.id ?? suggestion.value;
  }
  return index;
}

export default function AutocompleteSuggestions({
  suggestions,
  activeSuggestionIndex,
  onSelect,
  onHover,
  loading,
}) {
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current || activeSuggestionIndex < 0) return;
    const activeItem = listRef.current.querySelector(
      `#suggestion-item-${activeSuggestionIndex}`
    );
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest' });
    }
  }, [activeSuggestionIndex]);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <ul
      id="autocomplete-suggestions-list"
      ref={listRef}
      className="autocomplete-suggestions"
      role="listbox"
      aria-label="Search suggestions"
    >
      {loading && (
        <li className="autocomplete-suggestions__loading" role="option" aria-selected="false">
          Loading...
        </li>
      )}

      {!loading &&
        suggestions.map((suggestion, index) => {
          const text = getSuggestionText(suggestion);
          const key = getSuggestionKey(suggestion, index);
          const isActive = index === activeSuggestionIndex;

          return (
            <li
              key={key}
              id={`suggestion-item-${index}`}
              className={[
                'autocomplete-suggestions__item',
                isActive ? 'autocomplete-suggestions__item--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role="option"
              aria-selected={isActive}
              onMouseDown={(event) => {
                // Prevent input blur before click registers
                event.preventDefault();
                onSelect(suggestion);
              }}
              onMouseEnter={() => onHover(index)}
            >
              <img
                src={searchIcon}
                alt=""
                className="autocomplete-suggestions__item-icon"
                aria-hidden="true"
              />
              <span className="autocomplete-suggestions__item-text">{text}</span>
            </li>
          );
        })}
    </ul>
  );
}
