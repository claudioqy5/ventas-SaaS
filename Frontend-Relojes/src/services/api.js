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
export const LUXURY_SAMPLE_WATCHES = [
  {
    id: 'sample-1',
    nombre: 'Vetruvius Chronograph Tourbillon',
    descripcion: 'Caja en oro rosa de 18k con esfera verde esmeralda cepillada con efecto rayos de sol. Escape de tourbillon volante a las 6 en punto.',
    precio: 14850.00,
    categoria: 'Hombre',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 3,
    imagenUrl: '/watches/chronograph_gold.jpg',
    specs: { calibre: 'Calibre VT-9080', rubies: '38 Joyas', reservaMarcha: '72 Horas' },
    destacado: true,
    etiqueta: 'Edición Limitada'
  },
  {
    id: 'sample-2',
    nombre: 'Vortex Titanium Skeleton',
    descripcion: 'Esqueleto mecánico de titanio pulido grado aeroespacial con bisel de cerámica negra facetada. Visibilidad total del tren de engranajes.',
    precio: 11200.00,
    categoria: 'Hombre',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 5,
    imagenUrl: '/watches/skeleton_titanium.jpg',
    specs: { calibre: 'Calibre VX-Skeleton', rubies: '31 Joyas', reservaMarcha: '55 Horas' },
    destacado: true,
    etiqueta: 'Buceo Extremo'
  },
  {
    id: 'sample-3',
    nombre: 'Celestial Master Moonphase',
    descripcion: 'Elegancia pura en oro rosa con esfera azul noche guilloché artesanal. Indicador de fase lunar astronómica.',
    precio: 16900.00,
    categoria: 'Marcas',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 2,
    imagenUrl: '/watches/moonphase_blue.jpg',
    specs: { calibre: 'Calibre Astrum 2800', rubies: '29 Joyas', reservaMarcha: '65 Horas' },
    destacado: true,
    etiqueta: 'Pieza de Colección'
  },
  {
    id: 'sample-4',
    nombre: 'Geneva Classic Heritage',
    descripcion: 'Reloj de vestir clásico para hombre. Caja de oro amarillo de 18 quilates con esfera texturizada y correa de piel de aligátor marrón auténtica.',
    precio: 9500.00,
    categoria: 'Hombre',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 2,
    imagenUrl: '/watches/mens_classic.png',
    specs: { calibre: 'Calibre GH-40 Auto', rubies: '25 Joyas', reservaMarcha: '48 Horas' },
    destacado: true,
    etiqueta: 'Clásico'
  },
  {
    id: 'sample-5',
    nombre: 'Empress Diamond Rose',
    descripcion: 'Elegancia absoluta para mujer. Oro rosa engastado con diamantes corte brillante en el bisel, esfera de nácar natural y agujas facetadas.',
    precio: 18200.00,
    categoria: 'Mujer',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 1,
    imagenUrl: '/watches/womens_diamond.png',
    specs: { calibre: 'Calibre Mini-Auto', rubies: '21 Joyas', reservaMarcha: '42 Horas' },
    destacado: true,
    etiqueta: 'Exclusivo Mujer'
  },
  {
    id: 'sample-6',
    nombre: 'Oceanic Pro Chrono',
    descripcion: 'Robusto cronógrafo deportivo en acero inoxidable cepillado con esfera azul profundo. Diseñado para resistir condiciones extremas conservando el lujo intacto.',
    precio: 8900.00,
    categoria: 'Novedades',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 4,
    imagenUrl: '/watches/sports_steel.png',
    specs: { calibre: 'Calibre C-300', rubies: '33 Joyas', reservaMarcha: '50 Horas' },
    destacado: true,
    etiqueta: 'Novedad'
  },
  {
    id: 'sample-7',
    nombre: 'Aviator Heritage 1945',
    descripcion: 'Inspirado en la historia de la aviación. Esfera negra mate con números arábigos luminiscentes y correa de piel envejecida a mano.',
    precio: 6500.00,
    categoria: 'Ofertas',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 3,
    imagenUrl: '/watches/aviator_vintage.png',
    specs: { calibre: 'Calibre Manual A-19', rubies: '17 Joyas', reservaMarcha: '40 Horas' },
    destacado: true,
    etiqueta: 'Oportunidad VIP'
  },
  {
    id: 'sample-8',
    nombre: 'Minimalist Ultra-Thin',
    descripcion: 'La máxima expresión del minimalismo. Esfera blanca de esmalte con delgados números romanos y una caja ultraplana. Elegancia discreta.',
    precio: 12400.00,
    categoria: 'Accesorios',
    tipoProducto: 'Unidad',
    unidadMedida: 'Pieza',
    stock: 2,
    imagenUrl: '/watches/minimalist_dress.png',
    specs: { calibre: 'Calibre Ultra-Plano', rubies: '28 Joyas', reservaMarcha: '45 Horas' },
    destacado: true,
    etiqueta: 'Alta Costura'
  }
];

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
