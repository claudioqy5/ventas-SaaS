// Servicio de conexión con el Backend SaaS Multi-Tenant
// Consume los endpoints públicos creados en PublicStoreController.cs

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/public/store';
const DEFAULT_EMPRESA_ID = import.meta.env.VITE_EMPRESA_ID || '';

// Catálogo de Alta Relojería exclusivo de demostración y respaldo
export const LUXURY_SAMPLE_WATCHES = [
  {
    id: 'sample-1',
    nombre: 'Vetruvius Chronograph Tourbillon',
    descripcion: 'Caja en oro rosa de 18k con esfera verde esmeralda cepillada con efecto rayos de sol. Escape de tourbillon volante a las 6 en punto y calibre automático suizo de manufactura propia.',
    precio: 14850.00,
    categoria: 'Tourbillon',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 3,
    imagenUrl: '/watches/chronograph_gold.jpg',
    specs: {
      calibre: 'Calibre VT-9080 Manufactura',
      rubies: '38 Joyas',
      reservaMarcha: '72 Horas',
      diametro: '42 mm',
      cristal: 'Zafiro abombado con doble tratamiento antirreflejo',
      hermeticidad: '100 Metros (10 ATM)',
      material: 'Oro Rosa 18k & Piel de Aligátor'
    },
    destacado: true,
    etiqueta: 'Edición Limitada'
  },
  {
    id: 'sample-2',
    nombre: 'Vortex Titanium Skeleton Diver',
    descripcion: 'Esqueleto mecánico de titanio pulido grado aeroespacial con bisel de cerámica negra facetada. Visibilidad total del tren de engranajes y sistema de amortiguación antichoque.',
    precio: 11200.00,
    categoria: 'Esqueleto & Buceo',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 5,
    imagenUrl: '/watches/skeleton_titanium.jpg',
    specs: {
      calibre: 'Calibre VX-Skeleton Hi-Beat',
      rubies: '31 Joyas',
      reservaMarcha: '55 Horas',
      diametro: '43 mm',
      cristal: 'Cristal Zafiro resistente a rayaduras 9 Mohs',
      hermeticidad: '300 Metros (30 ATM Profesional)',
      material: 'Titanio Grado 5 & Cerámica'
    },
    destacado: true,
    etiqueta: 'Buceo Extremo'
  },
  {
    id: 'sample-3',
    nombre: 'Celestial Master Moonphase Royale',
    descripcion: 'Elegancia pura en oro rosa con esfera azul noche guilloché artesanal. Indicador de fase lunar astronómica con acabado en oro pulido y números romanos aplicados a mano.',
    precio: 16900.00,
    categoria: 'Clásicos & Complicaciones',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 2,
    imagenUrl: '/watches/moonphase_blue.jpg',
    specs: {
      calibre: 'Calibre Astrum 2800 Calendario Lunar',
      rubies: '29 Joyas',
      reservaMarcha: '65 Horas',
      diametro: '40 mm',
      cristal: 'Zafiro ultra-delgado curvado',
      hermeticidad: '50 Metros (5 ATM)',
      material: 'Oro Rosa 18k & Correa Piel Hecha a Mano'
    },
    destacado: true,
    etiqueta: 'Pieza de Colección'
  }
];

export async function fetchStoreProducts(empresaId = DEFAULT_EMPRESA_ID, apiUrl = DEFAULT_API_URL) {
  if (!empresaId) {
    // Si aún no se ha configurado la EmpresaId del SaaS, usamos el catálogo exclusivo
    return {
      connected: false,
      isFallback: true,
      storeName: 'Aurelia Haute Horlogerie',
      products: LUXURY_SAMPLE_WATCHES
    };
  }

  try {
    const res = await fetch(`${apiUrl}/${empresaId}/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    // Traer información de la tienda
    let storeInfo = { nombre: 'Tienda de Relojes' };
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
      categoria: item.categoriaId || 'Colección Principal',
      tipoProducto: item.tipoProducto,
      unidadMedida: item.unidadMedida,
      stock: item.stock,
      imagenUrl: item.imagenUrl || '/watches/chronograph_gold.jpg',
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
      storeName: storeInfo.nombre || 'Boutique Autorizada',
      products: mapped.length > 0 ? mapped : LUXURY_SAMPLE_WATCHES
    };
  } catch (err) {
    console.warn('No se pudo conectar con el Backend SaaS, mostrando colección de alta relojería:', err);
    return {
      connected: false,
      isFallback: true,
      storeName: 'Aurelia Haute Horlogerie (Modo Muestra)',
      products: LUXURY_SAMPLE_WATCHES,
      error: err.message
    };
  }
}
