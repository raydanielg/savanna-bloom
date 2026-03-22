/**
 * Get the full URL for storage assets (images, videos, etc.)
 * In production, storage is served from the backend domain
 */
export function getStorageUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production, use backend domain for storage
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `https://app.godeepafricasafari.com/${cleanPath}`;
  }
  
  // In development, use Vite proxy
  return `/${cleanPath}`;
}

/**
 * Get the backend URL
 */
export function getBackendUrl(): string {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://app.godeepafricasafari.com';
  }
  return 'http://localhost:8000';
}
