import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes a URL by adding https:// if missing and handling other edge cases
 */
export function normalizeUrl(url: string): string {
  let normalizedUrl = url.trim().toLowerCase();

  // Remove any trailing slashes
  normalizedUrl = normalizedUrl.replace(/\/+$/, '');

  // Add protocol if missing
  if (
    !normalizedUrl.startsWith('http://') &&
    !normalizedUrl.startsWith('https://')
  ) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    // Use URL constructor to validate and normalize
    const urlObj = new URL(normalizedUrl);

    // Ensure we have a valid hostname
    if (!urlObj.hostname) {
      throw new Error('Invalid hostname');
    }

    // Remove any default ports
    if (urlObj.port === '80' || urlObj.port === '443') {
      urlObj.port = '';
    }

    return urlObj.toString();
  } catch (error) {
    throw new Error('Invalid URL format');
  }
}

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    normalizeUrl(url);
    return true;
  } catch {
    return false;
  }
}
