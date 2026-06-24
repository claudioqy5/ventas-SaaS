const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Verifica si existe una variable de entorno de Vite definida en el build
    if (import.meta.env && import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5246';
    }
    
    // En produccion (VPS o Vercel), se usa por defecto la URL segura de la API en el VPS
    return 'https://ventassaas-api.helifyferdigital.cloud';
  }
  return 'http://localhost:5246';
};

export const API_URL = getApiUrl();
