"use client";
import React, { useState, useEffect, useMemo } from 'react';
import BarraNavegacion from './components/BarraNavegacion';
import Inicio from './components/Inicio';
import TarjetaProducto from './components/TarjetaProducto';
import PaginaDetalleProducto from './components/PaginaDetalleProducto';
import CajonCarrito from './components/CajonCarrito';
import ProcesoPago from './components/ProcesoPago';

import ModalAjustesInquilino from './components/ModalAjustesInquilino';
import ModalAuthCliente from './components/ModalAuthCliente';
import Testimonios from './components/Testimonios';
import PieDePagina from './components/PieDePagina';
import { fetchStoreProducts } from './services/api';
import CargadorReloj from './components/CargadorReloj';
import BotonWhatsApp from './components/BotonWhatsApp';
import PanelFiltros from './components/PanelFiltros';
import MarcasDestacadas from './components/MarcasDestacadas';
import ToastNotificacion from './components/ToastNotificacion';
import WebThreads from './components/WebThreads';
import Beneficios from './components/Beneficios';
import VistaPreguntasFrecuentes from './components/VistaPreguntasFrecuentes';
import VistaTerminosCondiciones from './components/VistaTerminosCondiciones';
import { SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';

const STORAGE_KEY_CART = 'lgant_vip_cart_v1';
const STORAGE_KEY_EMPRESA = 'lgant_saas_empresa_id';
const STORAGE_KEY_API_URL = 'lgant_saas_api_url';
const WHATSAPP_CONCIERGE = '51962956919';


export default function App({ initialCategory, initialProductId, initialView = 'catalog' }) {
  const [empresaId, setEmpresaId] = useState(process.env.NEXT_PUBLIC_EMPRESA_ID || '6a9a503000746b35867cddaf');
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'https://ventassaas-api.helifyferdigital.cloud/api/relojes-store');

  // Recuperar de localStorage solo después de montar (para evitar errores de hidratación de Next.js)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmpresa = localStorage.getItem(STORAGE_KEY_EMPRESA) || localStorage.getItem('aurelia_saas_empresa_id');
      if (storedEmpresa) setEmpresaId(storedEmpresa);

      const storedUrl = localStorage.getItem(STORAGE_KEY_API_URL) || localStorage.getItem('aurelia_saas_api_url');
      if (storedUrl) setApiUrl(storedUrl);
    }
  }, []);

  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState("L'gant");
  const [isConnected, setIsConnected] = useState(false);
  const [isFallback, setIsFallback] = useState(true);
  const [loading, setLoading] = useState(true);

  
  // El loader HTML nativo (del layout.jsx) ya se muestra de inmediato.
  // Aquí solo controlamos cuándo hacer fade-out y marcamos la sesión.
  const [isLoaderActive, setIsLoaderActive] = useState(false);

  useEffect(() => {
    const loaderEl = document.getElementById('tp-initial-loader');
    if (!loaderEl || loaderEl.style.display === 'none') {
      // Ya se ocultó (navegación SPA) — no hacer nada
      return;
    }
    // Primera carga o refresh: mostrar el loader por un rato y luego fade-out
    setIsLoaderActive(true);
    const timer = setTimeout(() => {
      loaderEl.classList.add('tp-fade-out');
      setTimeout(() => {
        loaderEl.style.display = 'none';
        setIsLoaderActive(false);
        sessionStorage.setItem('tp_loaded', '1');
      }, 700);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleTriggerLoader = () => {
    const loaderEl = document.getElementById('tp-initial-loader');
    if (!loaderEl) return;
    sessionStorage.removeItem('tp_loaded');
    loaderEl.style.display = 'flex';
    loaderEl.style.opacity = '1';
    loaderEl.style.transform = 'scale(1)';
    loaderEl.classList.remove('tp-fade-out');
    setIsLoaderActive(true);
    setTimeout(() => {
      loaderEl.classList.add('tp-fade-out');
      setTimeout(() => {
        loaderEl.style.display = 'none';
        setIsLoaderActive(false);
        sessionStorage.setItem('tp_loaded', '1');
      }, 700);
    }, 2200);
  };

  // Filtros y búsqueda
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Todos');
  const [showFullCatalog, setShowFullCatalog] = useState(!!initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  
  // Modales, Notificaciones y Vistas
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeView, setActiveView] = useState(initialView || 'catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [addedProduct, setAddedProduct] = useState(null);

  // Filtros avanzados (Barra lateral)
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: { min: '', max: '' },
    inStockOnly: false,
    dynamic: {} // Store selected attributes like { "Color": ["Negro"], "Correa": ["Goma"] }
  });

  // Sincronizar selectedCategory cuando cambia initialCategory (por navegación en Next.js o recarga)
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setShowFullCatalog(true);
      setActiveView('catalog');
      setSelectedProduct(null);
    }
  }, [initialCategory]);

  const handleSelectCategory = (catName) => {
    if (catName.toLowerCase() === 'marcas') {
      const marcasEl = document.querySelector('.marcas-section');
      if (marcasEl) {
        marcasEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    setSelectedCategory(catName);
    setShowFullCatalog(true);
    setActiveView('catalog');
    setSelectedProduct(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/categoria/${catName.toLowerCase()}`);
    }
    setTimeout(() => {
      const catalogoEl = document.getElementById('catalogo');
      if (catalogoEl) {
        catalogoEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 40);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveView('product');
    if (typeof window !== 'undefined' && product) {
      window.history.pushState({}, '', `/producto/${product.id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
    setActiveView('catalog');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateView = (viewName) => {
    setSelectedProduct(null);
    setActiveView(viewName);
    if (typeof window !== 'undefined') {
      if (viewName === 'faq') {
        window.history.pushState({}, '', '/preguntas-frecuentes');
      } else if (viewName === 'terminos') {
        window.history.pushState({}, '', '/terminos-y-condiciones');
      } else if (viewName === 'checkout') {
        window.history.pushState({}, '', '/checkout');
      } else {
        window.history.pushState({}, '', '/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejar historial del navegador (Atrás / Adelante)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes('/preguntas-frecuentes')) {
        setActiveView('faq');
        setSelectedProduct(null);
      } else if (path.includes('/terminos-y-condiciones')) {
        setActiveView('terminos');
        setSelectedProduct(null);
      } else if (path.includes('/checkout')) {
        setActiveView('checkout');
        setSelectedProduct(null);
      } else if (path.includes('/producto/')) {
        const id = path.split('/producto/')[1];
        if (id && products.length > 0) {
          const found = products.find(p => String(p.id) === String(id));
          if (found) {
            setSelectedProduct(found);
            setActiveView('product');
          }
        }
      } else if (path.includes('/categoria/')) {
        const catSlug = path.split('/categoria/')[1]?.split('/')[0]?.split('?')[0];
        if (catSlug) {
          const decoded = decodeURIComponent(catSlug);
          const catName = decoded.charAt(0).toUpperCase() + decoded.slice(1).toLowerCase();
          setSelectedCategory(catName);
          setShowFullCatalog(true);
          setActiveView('catalog');
          setSelectedProduct(null);
        }
      } else {
        setActiveView('catalog');
        setSelectedProduct(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);


  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART) || localStorage.getItem('aurelia_vip_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Cargar productos del Backend SaaS o catálogo exclusivo
  const loadCatalog = async () => {
    setLoading(true);
    const data = await fetchStoreProducts(empresaId, apiUrl);
    setProducts(data.products || []);
    setIsConnected(data.connected);
    setIsFallback(data.isFallback);
    if (data.storeName) setStoreName(data.storeName);
    setLoading(false);
  };

  useEffect(() => {
    loadCatalog();
  }, [empresaId, apiUrl]);

  useEffect(() => {
    if (initialProductId && products.length > 0) {
      const found = products.find(p => String(p.id) === String(initialProductId));
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, [initialProductId, products]);


  const handleSaveEmpresaId = (id) => {
    setEmpresaId(id);
    localStorage.setItem(STORAGE_KEY_EMPRESA, id);
  };

  const handleSaveApiUrl = (url) => {
    setApiUrl(url);
    localStorage.setItem(STORAGE_KEY_API_URL, url);
  };

  // Opciones dinámicas para filtros
  const { availableMaterials, availableColors } = useMemo(() => {
    const matSet = new Set();
    const colSet = new Set();
    products.forEach(p => {
      if (p.atributos && Array.isArray(p.atributos)) {
        p.atributos.forEach(attr => {
          if (attr.nombre && attr.valor) {
            const nameLower = attr.nombre.toLowerCase();
            if (nameLower.includes('material')) {
              matSet.add(attr.valor);
            } else if (nameLower.includes('color')) {
              colSet.add(attr.valor);
            }
          }
        });
      }
    });
    return {
      availableMaterials: Array.from(matSet).sort(),
      availableColors: Array.from(colSet).sort()
    };
  }, [products]);

  // Extraer atributos dinámicos de todos los productos (Correa, Color, Material, etc.)
  const dynamicAttributesMap = useMemo(() => {
    const map = {};
    products.forEach(p => {
      if (p.atributos && Array.isArray(p.atributos)) {
        p.atributos.forEach(attr => {
          const name = (attr.nombre || attr.Nombre)?.trim();
          const val = (attr.valor || attr.Valor)?.trim();
          if (!name || !val) return;
          if (!map[name]) map[name] = new Set();
          map[name].add(val);
        });
      }
    });
    // Convertir Sets a Arrays ordenados
    const result = {};
    for (const [key, set] of Object.entries(map)) {
      result[key] = Array.from(set).sort();
    }
    return result;
  }, [products]);

  // Categorías
  const categories = useMemo(() => {
    const list = new Set(['Todos']);
    
    // Categorías del backend presentes en los productos
    products.forEach((p) => {
      if (p.categoria) list.add(p.categoria);
      if (p.categorias && Array.isArray(p.categorias)) {
        p.categorias.forEach(c => list.add(c));
      }
    });

    // Si existen productos con precioOferta > 0 o la categoría actual es Ofertas
    const hasOfertas = products.some(p => Number(p.precioOferta) > 0);
    if (hasOfertas || (selectedCategory && selectedCategory.toLowerCase() === 'ofertas')) {
      list.add('Ofertas');
    }

    // Asegurar que la categoría seleccionada aparezca en los chips (ej: Hombre, Mujer, etc.)
    if (selectedCategory && selectedCategory !== 'Todos') {
      list.add(selectedCategory);
    }

    return Array.from(list);
  }, [products, selectedCategory]);

  // Filtrado y ordenación
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        let matchesCategory = false;
        const selLower = (selectedCategory || 'Todos').toLowerCase().trim();

        if (selLower === 'todos') {
          matchesCategory = true;
        } else if (selLower === 'ofertas') {
          // El usuario especificó: "(los productos que tienen preciooferta)"
          // y también puede ser una categoría en el backend (Category.Nombre === "Ofertas")
          const hasOfferPrice = Number(p.precioOferta) > 0 && (p.precio ? Number(p.precioOferta) < Number(p.precio) : true);
          const isOfferCategory = (p.categoria && (p.categoria.toLowerCase() === 'ofertas' || p.categoria.toLowerCase() === 'oferta')) || (p.categorias && p.categorias.some(c => c.toLowerCase() === 'ofertas' || c.toLowerCase() === 'oferta'));
          matchesCategory = hasOfferPrice || isOfferCategory;
        } else if (selLower === 'novedades') {
          // Categoría Novedades en backend, o etiqueta de novedad, o nuevo ingreso
          const isNoveltyCategory = (p.categoria && (p.categoria.toLowerCase().includes('novedad') || p.categoria.toLowerCase().includes('nuevo'))) || (p.categorias && p.categorias.some(c => c.toLowerCase().includes('novedad') || c.toLowerCase().includes('nuevo')));
          const isNoveltyTag = p.etiqueta && (p.etiqueta.toLowerCase().includes('novedad') || p.etiqueta.toLowerCase().includes('nuevo'));
          const isEsNuevo = !!p.esNuevo;
          matchesCategory = isNoveltyCategory || isNoveltyTag || isEsNuevo;
        } else if (selLower === 'hombre') {
          // Categoría Hombre en el backend (o atributo de género)
          const isHombreCat = (p.categoria && p.categoria.toLowerCase().includes('hombre')) || (p.categorias && p.categorias.some(c => c.toLowerCase().includes('hombre')));
          const isHombreAttr = p.atributos?.some(a => 
            (a.nombre?.toLowerCase().includes('género') || a.nombre?.toLowerCase().includes('genero')) &&
            a.valor?.toLowerCase().includes('hombre')
          );
          matchesCategory = isHombreCat || isHombreAttr;
        } else if (selLower === 'mujer') {
          // Categoría Mujer en el backend (o atributo de género)
          const isMujerCat = (p.categoria && p.categoria.toLowerCase().includes('mujer')) || (p.categorias && p.categorias.some(c => c.toLowerCase().includes('mujer')));
          const isMujerAttr = p.atributos?.some(a => 
            (a.nombre?.toLowerCase().includes('género') || a.nombre?.toLowerCase().includes('genero')) &&
            a.valor?.toLowerCase().includes('mujer')
          );
          matchesCategory = isMujerCat || isMujerAttr;
        } else if (selLower === 'accesorios') {
          matchesCategory = (p.categoria && p.categoria.toLowerCase().includes('accesorio')) || (p.categorias && p.categorias.some(c => c.toLowerCase().includes('accesorio')));
        } else if (selLower === 'marcas') {
          matchesCategory = true;
        } else {
          matchesCategory = (p.categoria && p.categoria.toLowerCase() === selLower) || (p.categorias && p.categorias.some(c => c.toLowerCase() === selLower));
        }
        const query = searchQuery.toLowerCase();
        const matchesSearch = !query ||
          p.nombre.toLowerCase().includes(query) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(query)) ||
          (p.categoria && p.categoria.toLowerCase().includes(query)) ||
          (p.categorias && p.categorias.some(c => c.toLowerCase().includes(query)));
          
        // Lógica de Filtros Avanzados
        const pPrice = Number(p.precio) || 0;
        const matchesMinPrice = advancedFilters.priceRange.min === '' || pPrice >= Number(advancedFilters.priceRange.min);
        const matchesMaxPrice = advancedFilters.priceRange.max === '' || pPrice <= Number(advancedFilters.priceRange.max);
        const matchesStock = !advancedFilters.inStockOnly || p.stock > 0;
        
        let matchesDynamic = true;
        if (advancedFilters.dynamic && Object.keys(advancedFilters.dynamic).length > 0) {
          for (const [attrName, selectedValues] of Object.entries(advancedFilters.dynamic)) {
            if (selectedValues && selectedValues.length > 0) {
              const pAttr = p.atributos?.find(a => 
                (a?.nombre || a?.Nombre)?.toLowerCase().trim() === attrName.toLowerCase().trim()
              );
              if (!pAttr) {
                matchesDynamic = false;
                break;
              }
              const attrVal = (pAttr.valor || pAttr.Valor || '').toLowerCase().trim();
              if (!selectedValues.some(val => attrVal.includes(val.toLowerCase().trim()))) {
                matchesDynamic = false;
                break;
              }
            }
          }
        }

        return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStock && matchesDynamic;
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return Number(b.precio) - Number(a.precio);
        if (sortBy === 'price-asc') return Number(a.precio) - Number(b.precio);
        if (sortBy === 'name') return a.nombre.localeCompare(b.nombre);
        if (sortBy === 'name-desc') return b.nombre.localeCompare(a.nombre);
        if (sortBy === 'stock') return (b.stock || 0) - (a.stock || 0);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, advancedFilters]);

  const groupedProducts = useMemo(() => {
    const groups = {};
    const result = [];
    
    filteredProducts.forEach(p => {
      // Usar codigoModelo si existe, de lo contrario usar el ID para que no se agrupe
      const key = p.codigoModelo ? p.codigoModelo : p.id;
      if (!groups[key]) {
        groups[key] = { main: p, variants: [p] };
        result.push(groups[key]);
      } else {
        groups[key].variants.push(p);
      }
    });
    return result;
  }, [filteredProducts]);

  // Carrito
  const handleAddToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          imagenUrl: product.imagenUrl,
          unidadMedida: product.unidadMedida,
          quantity: qty
        }
      ];
    });
    setAddedProduct(product);
  };

  const handleUpdateQuantity = (productId, qty) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleWhatsAppInquiry = (product) => {
    const text = encodeURIComponent(
      `👋 *CONSULTA DE DISPONIBILIDAD - L'GANT*\n\n` +
      `Hola, me interesa conocer más detalles y coordinar la adquisición del guardatiempo:\n` +
      `⚜️ *${product.nombre}*\n` +
      `💰 Precio: S/ ${Number(product.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n` +
      `¿Podría un asesor de la boutique brindarme información de disponibilidad y entrega?`
    );
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_CONCIERGE}&text=${text}`, '_blank');
  };

  const handleOpenWhatsAppConcierge = () => {
    const text = encodeURIComponent(
      `👋 *ATENCIÓN VIP - CONCIERGE L'GANT*\n\n` +
      `Hola, deseo comunicarme con un asesor de la boutique para recibir asesoramiento sobre su colección de alta relojería.`
    );
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_CONCIERGE}&text=${text}`, '_blank');
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      {/* El loader ahora vive como HTML nativo en layout.jsx — no se renderiza desde React */}

      {/* Barra de Navegación Luminosa */}
      <BarraNavegacion
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isConnected={isConnected}
        isFallback={isFallback}
        storeName={storeName}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onTriggerLoader={handleTriggerLoader}
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* VISTA PRINCIPAL: Checkout, Producto, Preguntas Frecuentes, Términos o Catálogo General */}
      {activeView === 'checkout' ? (
        <ProcesoPago
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onBack={handleBackToCatalog}
          onClearCart={() => setCart([])}
        />
      ) : selectedProduct ? (
        <PaginaDetalleProducto
          product={selectedProduct}
          onBack={handleBackToCatalog}
          onAddToCart={handleAddToCart}
          onWhatsAppInquiry={handleWhatsAppInquiry}
          allProducts={products}
          onSelectProduct={handleSelectProduct}
        />
      ) : activeView === 'faq' ? (
        <VistaPreguntasFrecuentes
          onBack={handleBackToCatalog}
          onOpenWhatsAppConcierge={handleOpenWhatsAppConcierge}
        />
      ) : activeView === 'terminos' ? (
        <VistaTerminosCondiciones
          onBack={handleBackToCatalog}
        />
      ) : (
        <>
          {/* Hero Section: Solo se muestra en la página principal, no en páginas de categoría ni catálogo expandido */}
          {!initialCategory && !showFullCatalog && (
            <>
              <Inicio
                onExplore={scrollToCatalog}
                onOpenWhatsAppConcierge={handleOpenWhatsAppConcierge}
              />
              {/* Banner de Marcas Reconocidas */}
              <MarcasDestacadas />
            </>
          )}

          {/* Sección Principal de Catálogo de Relojes */}
          <main id="catalogo" className="catalog-main" style={{
            maxWidth: '1680px',
            margin: '0 auto',
            padding: '50px 40px 90px',
            width: '100%',
            flex: 1
          }}>
            {/* Encabezado del Catálogo */}
            <div className="catalog-header" style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
              gap: '20px'
            }}>
              <div>
                <span style={{
                  fontSize: '0.74rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--c-blush)',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 500
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline', position: 'relative', top: '-1px' }}><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>
                  {showFullCatalog ? 'CATÁLOGO PRIVADO' : 'SELECCIÓN EXCLUSIVA'}
                </span>
                <h2 className="font-serif" style={{
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                  color: 'var(--c-deep-purple)',
                  letterSpacing: '0.02em',
                  marginTop: '4px',
                  fontWeight: 600
                }}>
                  {showFullCatalog ? (
                    selectedCategory && selectedCategory.toLowerCase() !== 'todos'
                      ? (selectedCategory.toLowerCase() === 'ofertas'
                          ? 'Ofertas Exclusivas'
                          : selectedCategory.toLowerCase() === 'novedades'
                            ? 'Novedades & Nuevos Ingresos'
                            : `Colección ${selectedCategory}`)
                      : 'Guardatiempos Exclusivos'
                  ) : 'Los más Vendidos'}
                </h2>
              </div>

              {/* Controles de Ordenamiento y Filtros en Móvil */}
              {showFullCatalog && (
                <div className="catalog-controls-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {/* Botón de Abrir Filtros en Móvil */}
                  <button
                    className="mobile-filter-trigger-btn"
                    onClick={() => setIsMobileFilterOpen(true)}
                    style={{
                      display: 'none',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#ffffff',
                      color: 'var(--c-deep-purple)',
                      border: '1px solid rgba(59, 60, 65, 0.25)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '0.84rem',
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(11, 11, 12, 0.06)'
                    }}
                  >
                    <SlidersHorizontal size={16} color="var(--c-indigo)" />
                    <span>Filtros</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="sort-by-label" style={{ fontSize: '0.78rem', color: 'var(--c-taupe)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                      Ordenar por:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(59, 60, 65, 0.25)',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        color: 'var(--c-deep-purple)',
                        fontSize: '0.84rem',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 600,
                        outline: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(11, 11, 12, 0.06)'
                      }}
                    >
                      <option value="featured">Colección Destacada</option>
                      <option value="price-desc">Mayor Valor</option>
                      <option value="price-asc">Menor Valor</option>
                      <option value="name">Nombre Alfabético</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Pestañas de Categoría (Barra Deslizable en Móvil) */}
            {showFullCatalog && (
              <div className="category-chips-container" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '36px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(59, 60, 65, 0.12)'
              }}>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        background: isSelected
                          ? 'var(--c-indigo)'
                          : '#ffffff',
                        border: isSelected
                          ? '1px solid var(--c-indigo)'
                          : '1px solid rgba(59, 60, 65, 0.18)',
                        color: isSelected ? '#ffffff' : 'var(--c-deep-purple)',
                        fontFamily: 'var(--font-serif)',
                        fontSize: '0.78rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: isSelected ? 600 : 400,
                        padding: '9px 20px',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        boxShadow: isSelected
                          ? '0 6px 18px rgba(11, 11, 12, 0.25)'
                          : '0 2px 8px rgba(11, 11, 12, 0.04)'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Layout Principal de Contenido: Sidebar + Grid */}
            <div className="catalog-layout" style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
              
              {/* Panel de Filtros Lateral (Desktop Sidebar + Mobile Drawer) */}
              {showFullCatalog && (
                <PanelFiltros
                  filters={advancedFilters}
                  setFilters={setAdvancedFilters}
                  dynamicAttributesMap={dynamicAttributesMap}
                  isMobileOpen={isMobileFilterOpen}
                  onCloseMobile={() => setIsMobileFilterOpen(false)}
                />
              )}

              {/* Área de Productos */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '90px 20px' }}>
                    <RefreshCw size={36} color="var(--c-indigo)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 16px' }} />
                    <p className="font-serif" style={{ color: 'var(--c-deep-purple)', fontSize: '1.1rem', letterSpacing: '0.04em', fontWeight: 700 }}>
                      Sincronizando Manufactura con el Catálogo...
                    </p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '70px 20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid rgba(59, 60, 65, 0.15)',
                    boxShadow: '0 4px 20px rgba(11, 11, 12, 0.06)'
                  }}>
                    <AlertCircle size={42} color="var(--c-blush)" style={{ margin: '0 auto 16px' }} />
                    <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--c-deep-purple)', marginBottom: '8px', fontWeight: 800 }}>
                      {selectedCategory && selectedCategory.toLowerCase() !== 'todos'
                        ? `No se encontraron piezas en la categoría ${selectedCategory}`
                        : 'No se encontraron piezas con ese criterio'}
                    </h3>
                    <p style={{ color: 'var(--c-taupe)', fontSize: '0.88rem', marginBottom: '20px' }}>
                      {selectedCategory && selectedCategory.toLowerCase() !== 'todos'
                        ? 'Pronto agregaremos nuevas manufacturas a esta colección. Explora nuestro catálogo completo.'
                        : 'Intenta restablecer los filtros de búsqueda o seleccionar otra categoría.'}
                    </p>
                    <button
                      onClick={() => handleSelectCategory('Todos')}
                      className="btn-outline-luxury"
                    >
                      Ver Todo el Catálogo
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid-4-products">
                      {(showFullCatalog ? groupedProducts : groupedProducts.slice(0, 4)).map((group) => (
                        <TarjetaProducto
                          key={group.main.id}
                          product={group.main}
                          variants={group.variants}
                          onQuickView={handleSelectProduct}
                          onAddToCart={handleAddToCart}
                          onWhatsAppInquiry={handleWhatsAppInquiry}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>


            {!showFullCatalog && filteredProducts.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
                <button 
                  onClick={() => {
                    setShowFullCatalog(true);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  style={{
                    padding: '16px 42px',
                    backgroundColor: '#ffffff',
                    color: 'var(--c-indigo)',
                    border: '2px solid var(--c-indigo)',
                    borderRadius: '9999px',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 24px rgba(11, 11, 12, 0.12)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--c-indigo)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(11, 11, 12, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = 'var(--c-indigo)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(11, 11, 12, 0.12)';
                  }}
                >
                  Ver más modelos
                </button>
              </div>
            )}
          </main>


      {/* Sección Transicional con Animación WebThreads en la Nueva Paleta */}
      {!initialCategory && (
        <section style={{ 
          position: 'relative', 
          width: '100%', 
          height: '460px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#fcfbf8', // Fondo perla exacto de la página principal
          overflow: 'hidden'
        }}>
          {/* Fondo animado WebGL en Oro Metálico, Charcoal y Champaña */}
          <WebThreads
            color1="#D4AF37" // Oro Metálico
            color2="#1A1B1F" // Charcoal Noir
            color3="#F5E6C8" // Champaña Cálido
            speed={0.35}
            threadCount={3}
            frequency={9.5}
            spread={0.18}
            taper={1.6}
            position={0.49}
            fanMode="center"
            glow={0.02}
            falloff={0.6}
            thickness={0.9}
            brightness={0.55}
            opacity={1}
            mirror={true}
            shimmer={false}
            grain={true}
            grainIntensity={0}
            mouseInteraction={true}
            mouseStrength={0.25}
            lightMode={true}
            backgroundColor="#fcfbf8"
          />
          
          {/* Texto superpuesto */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            color: 'var(--c-obsidian)',
            pointerEvents: 'none'
          }}>
            <span style={{
              display: 'block',
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--c-blush)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              La Precisión del Movimiento
            </span>
            <h2 style={{
              fontFamily: '"Cinzel", serif', // Fuente del logo L'gant
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 400, // Más delgado, como solicitó el usuario
              letterSpacing: '0.04em',
              margin: 0
            }}>
              Eternidad en cada Segundo
            </h2>
          </div>
        </section>
      )}

      {/* Sección "Nuevos Ingresos" */}
      {!initialCategory && filteredProducts.length > 4 && (
        <section style={{
          padding: '80px 24px',
          backgroundColor: 'var(--bg-main)', // Fondo igual al de la página principal
          position: 'relative'
        }}>
          <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '55px' }}>
              <span style={{
                fontSize: '0.74rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--c-blush)',
                fontFamily: 'var(--font-serif)',
                fontWeight: 600
              }}>
                Descubre lo Último
              </span>
              <h2 className="font-serif" style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                color: 'var(--c-deep-purple)',
                letterSpacing: '0.02em',
                marginTop: '6px',
                fontWeight: 600
              }}>
                Nuevos Ingresos
              </h2>
            </div>
            <div className="grid-4-products">
              {filteredProducts.slice(4, 8).map((product) => (
                <TarjetaProducto
                  key={product.id}
                  product={product}
                  onQuickView={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onWhatsAppInquiry={handleWhatsAppInquiry}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sección de Beneficios */}
      {!initialCategory && <Beneficios />}

      {/* Sección de Opiniones */}
      {!initialCategory && <Testimonios />}

        </>
      )}

      {/* Footer de Alta Relojería - SIEMPRE VISIBLE */}
      <PieDePagina
        onOpenWhatsAppConcierge={handleOpenWhatsAppConcierge}
        storeName={storeName}
        onNavigate={handleNavigateView}
        onSelectCategory={handleSelectCategory}
      />

      {/* Bolsa de Compras VIP / Drawer */}
      <CajonCarrito
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        whatsappNumber={WHATSAPP_CONCIERGE}
        onGoToCheckout={() => {
          setSelectedProduct(null);
          setActiveView('checkout');
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/checkout');
          }
          window.scrollTo(0, 0);
        }}
      />

      {/* Modal de Vinculación SaaS Multi-Tenant */}
      <ModalAjustesInquilino
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        empresaId={empresaId}
        onSaveEmpresaId={handleSaveEmpresaId}
        apiUrl={apiUrl}
        onSaveApiUrl={handleSaveApiUrl}
        onReload={loadCatalog}
      />

      {/* Modal de Iniciar Sesión / Registro / Perfil VIP del Cliente */}
      <ModalAuthCliente
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={currentUser}
        onLogin={(userData) => setCurrentUser(userData)}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Botón flotante de WhatsApp global (oculto en el carrito y durante el checkout) */}
      <BotonWhatsApp phoneNumber={WHATSAPP_CONCIERGE} isVisible={!isCartOpen && activeView !== 'checkout'} />

      {/* Notificación Toast al agregar al carrito */}
      <ToastNotificacion
        product={addedProduct}
        onClose={() => setAddedProduct(null)}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </div>
  );
}
