/**
 * Default fallback error message.
 */
const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Maps known HTTP status codes to user-facing messages.
 */
const HTTP_STATUS_MESSAGES = {
  400: 'The request was invalid. Please check your input and try again.',
  401: 'You are not logged in. Please sign in to continue.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'A conflict occurred. The resource may already exist.',
  422: 'The submitted data is invalid. Please review and correct it.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'A server error occurred. Please try again later.',
  502: 'The server is temporarily unavailable. Please try again later.',
  503: 'The service is currently unavailable. Please try again later.',
};

/**
 * Parses an API error response (Axios error or fetch Response) into a
 * user-facing message string.
 * @param {unknown} error - The caught error object.
 * @returns {string} Human-readable error message.
 */
export function parseApiError(error) {
  if (!error) return DEFAULT_ERROR_MESSAGE;

  // Axios-style error with a response object
  if (error.response) {
    const { status, data } = error.response;

    // Prefer explicit message/detail from the server body
    if (data) {
      if (typeof data === 'string' && data.trim()) return data.trim();
      if (typeof data.detail === 'string' && data.detail.trim()) return data.detail.trim();
      if (typeof data.message === 'string' && data.message.trim()) return data.message.trim();
      if (Array.isArray(data.detail) && data.detail.length > 0) {
        const first = data.detail[0];
        if (typeof first === 'string') return first;
        if (first && typeof first.msg === 'string') return first.msg;
      }
    }

    // Fall back to status-code mapping
    if (HTTP_STATUS_MESSAGES[status]) return HTTP_STATUS_MESSAGES[status];

    return DEFAULT_ERROR_MESSAGE;
  }

  // Network error (no response received)
  if (error.request || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'A network error occurred. Please check your connection and try again.';
  }

  // Plain Error object
  if (error instanceof Error && error.message) {
    return error.message;
  }

  // String error
  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Parses field-level validation errors from an API response into a
 * key→message map suitable for setting form errors.
 * @param {unknown} error - The caught error object.
 * @returns {Record<string, string>} Map of field name to error message.
 */
export function parseFieldErrors(error) {
  const fieldErrors = {};

  if (!error || !error.response || !error.response.data) return fieldErrors;

  const { data } = error.response;

  // FastAPI / Pydantic detail array: [{ loc: ['body', 'email'], msg: '...' }]
  if (Array.isArray(data.detail)) {
    data.detail.forEach((item) => {
      if (item && Array.isArray(item.loc) && typeof item.msg === 'string') {
        const field = item.loc[item.loc.length - 1];
        if (field && typeof field === 'string') {
          fieldErrors[field] = item.msg;
        }
      }
    });
    return fieldErrors;
  }

  // Flat errors object: { email: 'message', password: 'message' }
  if (typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    Object.entries(data.errors).forEach(([field, message]) => {
      if (typeof message === 'string') fieldErrors[field] = message;
    });
  }

  return fieldErrors;
}

/**
 * Returns true if the error represents an authentication failure (401).
 * @param {unknown} error - The caught error object.
 * @returns {boolean}
 */
export function isAuthError(error) {
  return error?.response?.status === 401;
}

/**
 * Returns true if the error represents a not-found response (404).
 * @param {unknown} error - The caught error object.
 * @returns {boolean}
 */
export function isNotFoundError(error) {
  return error?.response?.status === 404;
}
