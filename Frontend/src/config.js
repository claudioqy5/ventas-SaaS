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
    
    // Default to using the current hostname with port 5246
    return `http://${hostname}:5246`;
  }
  return 'http://localhost:5246';
};

export const API_URL = getApiUrl();
