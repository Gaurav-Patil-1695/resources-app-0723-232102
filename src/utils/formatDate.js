/**
 * Formats an ISO date string to a human-readable display string.
 * @param {string} isoDate - ISO 8601 date string.
 * @param {object} [options] - Optional Intl.DateTimeFormat options.
 * @returns {string} Formatted date string.
 */
export function formatDate(isoDate, options = {}) {
  if (!isoDate) return '';

  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  };

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-IN', defaultOptions).format(date);
}

/**
 * Formats an ISO date string to include time.
 * @param {string} isoDate - ISO 8601 date string.
 * @returns {string} Formatted date-time string.
 */
export function formatDateTime(isoDate) {
  if (!isoDate) return '';

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Formats an ISO date string to a short date (DD/MM/YYYY).
 * @param {string} isoDate - ISO 8601 date string.
 * @returns {string} Short formatted date string.
 */
export function formatShortDate(isoDate) {
  if (!isoDate) return '';

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export default formatDate;
