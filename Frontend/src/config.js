const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Check if a Vite environment variable is defined
    if (import.meta.env && import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5246';
    }
    
    // In production (VPS or Vercel), default to the secure VPS API URL
    return 'https://ventassaas-api.helifyferdigital.cloud';
  }
  return 'http://localhost:5246';
};

export const API_URL = getApiUrl();
