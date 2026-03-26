/**
 * Get the full URL for storage assets (images, videos, etc.)
 * In production, storage is served from the backend domain
 */
export function getStorageUrl(path: string): string {
  if (!path) return '';
  
  // If it's already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Remove leading slash if present
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If the path starts with 'storage/', it's already correct for the backend
  // but if it doesn't, we might need to add it depending on how it's stored
  
  // In production, use backend domain for storage
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `https://app.godeepafricasafari.com/${cleanPath}`;
  }
  
  // In development, use Vite proxy or absolute backend URL
  const backendUrl = getBackendUrl();
  return `${backendUrl}/${cleanPath}`;
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
