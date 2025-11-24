/**
 * Get the base API URL
 * Uses the public backend URL directly (beat-finder-api.undrstnd.ch)
 */
export function getApiUrl(): string {
  // Default to public backend URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://beat-finder-api.undrstnd.ch';
  
  // Add protocol if missing (assume https for production)
  if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    // Check if it's localhost (use http) or production (use https)
    if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
      return `http://${apiUrl}`;
    }
    return `https://${apiUrl}`;
  }
  
  return apiUrl;
}

/**
 * Build a full API endpoint URL
 * Always uses /api/v1 prefix (backend uses /api/v1 for all routes)
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getApiUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cleanBase = baseUrl.replace(/\/$/, '');
  
  // Always use /api/v1 prefix (backend uses /api/v1 for all routes)
  return `${cleanBase}/api/v1${cleanEndpoint}`;
}

