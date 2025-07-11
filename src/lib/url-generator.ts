/**
 * URL Generator Utility
 * 
 * This module provides functions for generating unique, shareable URLs for quizzes
 * and handling URL-related operations.
 */

import { nanoid } from 'nanoid';

/**
 * Configuration options for URL generation
 */
export interface UrlGeneratorOptions {
  /** Length of the unique ID portion of the URL (default: 10) */
  length?: number;
  /** Base URL for the application (default: window.location.origin) */
  baseUrl?: string;
  /** Path prefix for quiz URLs (default: '/quiz/') */
  pathPrefix?: string;
}

/**
 * Generates a unique, shareable URL for a quiz
 * 
 * @param options - Configuration options for URL generation
 * @returns A unique URL string
 */
export function generateUniqueUrl(options?: UrlGeneratorOptions): string {
  const {
    length = 10,
    baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://quiz-app.com',
    pathPrefix = '/quiz/'
  } = options || {};

  // Generate a unique ID using nanoid and add quiz_ prefix
  const uniqueId = `quiz_${nanoid(length)}`;
  
  // Construct the full URL
  return `${baseUrl}${pathPrefix}${uniqueId}`;
}

/**
 * Extracts the unique ID from a quiz URL
 * 
 * @param url - The full quiz URL
 * @param pathPrefix - The path prefix used in the URL (default: '/quiz/')
 * @returns The unique ID portion of the URL
 */
export function extractUniqueIdFromUrl(url: string, pathPrefix: string = '/quiz/'): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    if (pathname.startsWith(pathPrefix)) {
      return pathname.substring(pathPrefix.length);
    }
    
    return null;
  } catch (error) {
    console.error('Invalid URL format:', error);
    return null;
  }
}

/**
 * Validates if a URL is a valid quiz URL
 * 
 * @param url - The URL to validate
 * @param pathPrefix - The path prefix used in the URL (default: '/quiz/')
 * @returns Boolean indicating if the URL is valid
 */
export function isValidQuizUrl(url: string, pathPrefix: string = '/quiz/'): boolean {
  try {
    const uniqueId = extractUniqueIdFromUrl(url, pathPrefix);
    return uniqueId !== null && uniqueId.length > 0;
  } catch (error) {
    return false;
  }
}
