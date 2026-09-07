/**
 * Environment configuration
 * Reads Vite import.meta.env variables and exports typed constants.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Shop';
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
export const ENABLE_MOCK_API = import.meta.env.VITE_ENABLE_MOCK_API === 'true';
export const STATIC_BASE_URL = import.meta.env.VITE_STATIC_BASE_URL || '';
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

/** Convenience flag: true when running in production mode */
export const IS_PRODUCTION = APP_ENV === 'production';

/** Convenience flag: true when running in development mode */
export const IS_DEVELOPMENT = APP_ENV === 'development';
