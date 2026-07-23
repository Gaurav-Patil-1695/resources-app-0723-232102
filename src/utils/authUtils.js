/**
 * Decodes a JWT token and returns its payload claims.
 * NOTE: This is a client-side decode only — it does NOT verify the signature.
 * @param {string} token - JWT string.
 * @returns {object|null} Decoded payload object, or null if invalid.
 */
export function decodeJwtClaims(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonString = atob(padded);
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

/**
 * Checks whether a JWT token has expired based on the `exp` claim.
 * @param {string} token - JWT string.
 * @returns {boolean} True if the token is expired or invalid, false if still valid.
 */
export function isTokenExpired(token) {
  const claims = decodeJwtClaims(token);
  if (!claims || typeof claims.exp !== 'number') return true;

  const nowInSeconds = Date.now() / 1000;
  return claims.exp < nowInSeconds;
}

/**
 * Retrieves the stored auth token from localStorage.
 * @returns {string|null} The stored token or null.
 */
export function getStoredToken() {
  try {
    return localStorage.getItem('authToken');
  } catch {
    return null;
  }
}

/**
 * Stores an auth token in localStorage.
 * @param {string} token - JWT string to store.
 */
export function storeToken(token) {
  try {
    localStorage.setItem('authToken', token);
  } catch {
    // localStorage unavailable
  }
}

/**
 * Removes the auth token from localStorage.
 */
export function clearToken() {
  try {
    localStorage.removeItem('authToken');
  } catch {
    // localStorage unavailable
  }
}

/**
 * Returns decoded claims from the stored token, or null if missing/expired.
 * @returns {object|null} Decoded JWT payload or null.
 */
export function getAuthenticatedUser() {
  const token = getStoredToken();
  if (!token || isTokenExpired(token)) return null;
  return decodeJwtClaims(token);
}
