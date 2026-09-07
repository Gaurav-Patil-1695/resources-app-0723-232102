import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and deduplicates Tailwind CSS classes
 * using tailwind-merge.
 *
 * @param {...import('clsx').ClassValue} inputs - Class name values (strings, arrays, objects).
 * @returns {string} Merged and deduplicated class name string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
