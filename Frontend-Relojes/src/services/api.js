// Servicio de conexión con el Backend SaaS Multi-Tenant
// Consume los endpoints públicos creados en PublicStoreController.cs

const getEnvVar = (viteKey, nextKey, defaultValue) => {
  if (typeof process !== 'undefined' && process.env && process.env[nextKey]) {
    return process.env[nextKey];
  }
  if (typeof import.meta !== 'undefined' && import.meta && import.meta.env && import.meta.env[viteKey]) {
    return import.meta.env[viteKey];
  }
  return defaultValue;
};

const DEFAULT_API_URL = getEnvVar('VITE_API_URL', 'NEXT_PUBLIC_API_URL', 'http://localhost:5000/api/public/store');
const DEFAULT_EMPRESA_ID = getEnvVar('VITE_EMPRESA_ID', 'NEXT_PUBLIC_EMPRESA_ID', '');

// Catálogo de Alta Relojería exclusivo de demostración y respaldo
export const LUXURY_SAMPLE_WATCHES = [];

export async function fetchStoreProducts(empresaId = DEFAULT_EMPRESA_ID, apiUrl = DEFAULT_API_URL) {
  if (!empresaId) {
    // Si aún no se ha configurado la EmpresaId del SaaS, usamos el catálogo exclusivo
    return {
      connected: false,
      isFallback: true,
      storeName: 'TEMPO PRECISO',
      products: LUXURY_SAMPLE_WATCHES
    };
  }

  try {
    const res = await fetch(`${apiUrl}/productos/${empresaId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    // Traer información de la tienda
    let storeInfo = { nombre: 'TEMPO PRECISO' };
    try {
      const storeRes = await fetch(`${apiUrl}/${empresaId}`);
      if (storeRes.ok) {
        storeInfo = await storeRes.json();
      }
    } catch {
      // Si falla info básica, continuamos con los productos
    }

    // Mapear productos del SaaS
    const mapped = data.map(item => ({
      id: item.id || item._id,
      nombre: item.nombre,
      descripcion: item.descripcion || 'Pieza exclusiva de alta relojería.',
      precio: item.precio || 0,
      precioOferta: item.precioOferta || 0,
      categoria: item.categoriaId || 'Colección Principal',
      tipoProducto: item.tipoProducto,
      unidadMedida: item.unidadMedida,
      stock: item.stock,
      imagenUrl: (item.imagenes && item.imagenes.length > 0) ? item.imagenes[0] : (item.imagenUrl || '/watches/chronograph_gold.jpg'),
      imagenes: item.imagenes || [],
      precioOferta: item.precioOferta || 0,
      specs: {
        calibre: 'Calibre Automático Certificado',
        cristal: 'Cristal de Zafiro Antirreflejo',
        material: 'Acero Noble / Oro / Piel',
        hermeticidad: '100m Water Resistant'
      },
      etiqueta: item.stock <= 2 ? 'Últimas Piezas' : 'Disponible'
    }));

    return {
      connected: true,
      isFallback: false,
      storeName: storeInfo.nombre || 'TEMPO PRECISO • Boutique Perú',
      products: mapped.length > 0 ? mapped : LUXURY_SAMPLE_WATCHES
    };
  } catch (err) {
    console.warn('No se pudo conectar con el Backend SaaS, mostrando colección de alta relojería:', err);
    return {
      connected: false,
      isFallback: true,
      storeName: 'TEMPO PRECISO • Boutique Perú',
      products: LUXURY_SAMPLE_WATCHES,
      error: err.message
    };
  }
}
