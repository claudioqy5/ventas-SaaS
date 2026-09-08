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

const DEFAULT_API_URL = getEnvVar('VITE_API_URL', 'NEXT_PUBLIC_API_URL', 'https://ventassaas-api.helifyferdigital.cloud/api/relojes-store');
const DEFAULT_EMPRESA_ID = getEnvVar('VITE_EMPRESA_ID', 'NEXT_PUBLIC_EMPRESA_ID', '6a9a503000746b35867cddaf');

// Catálogo de Alta Relojería exclusivo de demostración y respaldo
export const LUXURY_SAMPLE_WATCHES = [];

export async function fetchStoreProducts(empresaId = DEFAULT_EMPRESA_ID, apiUrl = DEFAULT_API_URL) {
  if (!empresaId) {
    // Si aún no se ha configurado la EmpresaId del SaaS, usamos el catálogo exclusivo
    return {
      connected: false,
      isFallback: true,
      storeName: "L'gant",
      products: LUXURY_SAMPLE_WATCHES
    };
  }

  try {
    const res = await fetch(`${apiUrl}/productos/${empresaId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    // Traer información de la tienda
    let storeInfo = { nombre: "L'gant" };
    try {
      const storeRes = await fetch(`${apiUrl}/${empresaId}`);
      if (storeRes.ok) {
        storeInfo = await storeRes.json();
      }
    } catch {
      // Si falla info básica, continuamos con los productos
    }

    // Mapeo de respaldo para nombres de categoría si el backend solo envía el ID
    const FALLBACK_CATEGORIES = {
      '6a9bbb08e8664e218790b637': 'G-Shock',
      '6a9bbbe7e8664e218790b63f': 'Vintage',
      '6a9bbb13e8664e218790b639': 'Baby-G',
      '6a9bbbe0e8664e218790b63e': 'Edifice',
      '6a9bbbede8664e218790b640': 'Accesorios'
    };

    // Mapear productos del SaaS
    const mapped = data.map(item => {
      let catName = item.categoria || item.categoriaId || 'Colección Principal';
      if (FALLBACK_CATEGORIES[item.categoriaId?.toLowerCase()]) {
        catName = FALLBACK_CATEGORIES[item.categoriaId.toLowerCase()];
      }
      
      return {
      id: item.id || item._id,
      nombre: item.nombre,
      descripcion: item.descripcion || 'Pieza exclusiva de alta relojería.',
      precio: item.precio || 0,
      precioOferta: item.precioOferta || 0,
      categoria: catName,
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
    };
    });

    return {
      connected: true,
      isFallback: false,
      storeName: storeInfo.nombre || "L'gant • Boutique Perú",
      products: mapped.length > 0 ? mapped : LUXURY_SAMPLE_WATCHES
    };
  } catch (err) {
    console.warn('No se pudo conectar con el Backend SaaS, mostrando colección de alta relojería:', err);
    return {
      connected: false,
      isFallback: true,
      storeName: "L'gant • Boutique Perú",
      products: LUXURY_SAMPLE_WATCHES,
      error: err.message
    };
  }
}
