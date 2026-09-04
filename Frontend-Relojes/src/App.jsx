"use client";
import React, { useState, useEffect, useMemo } from 'react';
import BarraNavegacion from './components/BarraNavegacion';
import Inicio from './components/Inicio';
import TarjetaProducto from './components/TarjetaProducto';
import ModalProducto from './components/ModalProducto';
import CajonCarrito from './components/CajonCarrito';
import ModalAjustesInquilino from './components/ModalAjustesInquilino';
import ModalAuthCliente from './components/ModalAuthCliente';
import Herencia from './components/Herencia';
import PieDePagina from './components/PieDePagina';
import { fetchStoreProducts } from './services/api';
import CargadorReloj from './components/CargadorReloj';
import BotonWhatsApp from './components/BotonWhatsApp';
import PanelFiltros from './components/PanelFiltros';
import MarcasDestacadas from './components/MarcasDestacadas';
import { SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';

const STORAGE_KEY_CART = 'aurelia_vip_cart_v1';
const STORAGE_KEY_EMPRESA = 'aurelia_saas_empresa_id';
const STORAGE_KEY_API_URL = 'aurelia_saas_api_url';
const WHATSAPP_CONCIERGE = '51962956919';


export default function App({ initialCategory }) {
  const [empresaId, setEmpresaId] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_EMPRESA) || '' : ''));
  const [apiUrl, setApiUrl] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_API_URL) || 'http://localhost:5000/api/public/store' : 'http://localhost:5000/api/public/store'));

  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState('Aurelia Haute Horlogerie');
  const [isConnected, setIsConnected] = useState(false);
  const [isFallback, setIsFallback] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // El loader solo se activa si es la primera carga real del navegador (no en navegación SPA)
  const [isLoaderActive, setIsLoaderActive] = useState(false);

  // Comprobar sessionStorage solo en el cliente, tras el primer render
  useEffect(() => {
    if (!sessionStorage.getItem('tp_loaded')) {
      setIsLoaderActive(true);
      const timer = setTimeout(() => {
        setIsLoaderActive(false);
        sessionStorage.setItem('tp_loaded', '1');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTriggerLoader = () => {
    sessionStorage.removeItem('tp_loaded');
    setIsLoaderActive(true);
    setTimeout(() => {
      setIsLoaderActive(false);
      sessionStorage.setItem('tp_loaded', '1');
    }, 2500);
  };

  // Filtros y búsqueda
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Todos');
  const [showFullCatalog, setShowFullCatalog] = useState(!!initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  
  // Filtros avanzados (Barra lateral)
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: { min: '', max: '' },
    inStockOnly: false,
    materials: []
  });

  // Modales
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
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

  const handleSaveEmpresaId = (id) => {
    setEmpresaId(id);
    localStorage.setItem(STORAGE_KEY_EMPRESA, id);
  };

  const handleSaveApiUrl = (url) => {
    setApiUrl(url);
    localStorage.setItem(STORAGE_KEY_API_URL, url);
  };

  // Categorías
  const categories = useMemo(() => {
    const list = new Set(['Todos']);
    products.forEach((p) => {
      if (p.categoria) list.add(p.categoria);
    });
    return Array.from(list);
  }, [products]);

  // Filtrado y ordenación
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'Todos' || p.categoria === selectedCategory;
        const query = searchQuery.toLowerCase();
        const matchesSearch = !query ||
          p.nombre.toLowerCase().includes(query) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(query)) ||
          (p.categoria && p.categoria.toLowerCase().includes(query));
          
        // Lógica de Filtros Avanzados
        const pPrice = Number(p.precio) || 0;
        const matchesMinPrice = advancedFilters.priceRange.min === '' || pPrice >= Number(advancedFilters.priceRange.min);
        const matchesMaxPrice = advancedFilters.priceRange.max === '' || pPrice <= Number(advancedFilters.priceRange.max);
        const matchesStock = !advancedFilters.inStockOnly || p.stock > 0;
        
        let matchesMaterial = true;
        if (advancedFilters.materials.length > 0) {
           const pMat = p.specs?.material?.toLowerCase() || '';
           matchesMaterial = advancedFilters.materials.some(mat => pMat.includes(mat.toLowerCase()));
        }

        return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStock && matchesMaterial;
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.precio - a.precio;
        if (sortBy === 'price-asc') return a.precio - b.precio;
        if (sortBy === 'name') return a.nombre.localeCompare(b.nombre);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

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
      `👋 *CONSULTA DE DISPONIBILIDAD - AURELIA*\n\n` +
      `Hola, me interesa conocer más detalles y coordinar la adquisición del guardatiempo:\n` +
      `⚜️ *${product.nombre}*\n` +
      `💰 Precio: S/ ${Number(product.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n` +
      `¿Podría un asesor de la boutique brindarme información de disponibilidad y entrega?`
    );
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_CONCIERGE}&text=${text}`, '_blank');
  };

  const handleOpenWhatsAppConcierge = () => {
    const text = encodeURIComponent(
      `👋 *ATENCIÓN VIP - CONCIERGE AURELIA*\n\n` +
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
      {/* Pantalla de Carga: solo cuando corresponde */}
      {isLoaderActive && <CargadorReloj isLoading={isLoaderActive} minDuration={1800} />}

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
      />

      {/* Hero Section: Solo se muestra en la página principal, no en páginas de categoría ni en el catálogo expandido */}
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
      <main id="catalogo" style={{
        maxWidth: '1680px',
        margin: '0 auto',
        padding: '50px 40px 90px',
        width: '100%',
        flex: 1
      }}>
        {/* Encabezado del Catálogo */}
        <div style={{
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
              {showFullCatalog ? '✦ CATÁLOGO PRIVADO' : '✦ SELECCIÓN EXCLUSIVA'}
            </span>
            <h2 className="font-serif" style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              color: 'var(--c-deep-purple)',
              letterSpacing: '0.02em',
              marginTop: '6px',
              fontWeight: 600
            }}>
              {showFullCatalog ? 'Guardatiempos Exclusivos' : 'Nuestros Modelos Más Vendidos'}
            </h2>
          </div>

          {/* Selector de ordenamiento */}
          {showFullCatalog && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <SlidersHorizontal size={16} color="var(--c-indigo)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--c-taupe)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                Ordenar por:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(115, 96, 91, 0.25)',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  color: 'var(--c-deep-purple)',
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(45, 66, 98, 0.05)'
                }}
              >
                <option value="featured">Colección Destacada</option>
                <option value="price-desc">Mayor Valor</option>
                <option value="price-asc">Menor Valor</option>
                <option value="name">Nombre Alfabético</option>
              </select>
            </div>
          )}
        </div>

        {/* Pestañas de Categoría */}
        {showFullCatalog && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '36px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(115, 96, 91, 0.12)'
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
                      : '1px solid rgba(115, 96, 91, 0.18)',
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
                      ? '0 6px 18px rgba(45, 66, 98, 0.25)'
                      : '0 2px 8px rgba(45, 66, 98, 0.04)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--c-blush)';
                      e.currentTarget.style.color = 'var(--c-indigo)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(115, 96, 91, 0.18)';
                      e.currentTarget.style.color = 'var(--c-deep-purple)';
                    }
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Layout Principal de Contenido: Sidebar + Grid */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          
          {/* Panel de Filtros Lateral */}
          {showFullCatalog && <PanelFiltros filters={advancedFilters} setFilters={setAdvancedFilters} />}

          {/* Área de Productos */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Estado de carga */}
            {loading ? (
          <div style={{ textAlign: 'center', padding: '90px 20px' }}>
            <RefreshCw size={36} color="var(--c-indigo)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 16px' }} />
            <p className="font-serif" style={{ color: 'var(--c-deep-purple)', fontSize: '1.1rem', letterSpacing: '0.04em', fontWeight: 700 }}>
              Sincronizando Manufactura con el Catálogo...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Sin resultados */
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid rgba(115, 96, 91, 0.15)',
            boxShadow: '0 4px 20px rgba(45, 66, 98, 0.05)'
          }}>
            <AlertCircle size={42} color="var(--c-blush)" style={{ margin: '0 auto 16px' }} />
            <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--c-deep-purple)', marginBottom: '8px', fontWeight: 800 }}>
              No se encontraron piezas con ese criterio
            </h3>
            <p style={{ color: 'var(--c-taupe)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Intenta restablecer los filtros de búsqueda o seleccionar otra categoría.
            </p>
            <button
              onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}
              className="btn-outline-luxury"
            >
              Restablecer Búsqueda
            </button>
          </div>
        ) : (
          /* Grid de Productos en tarjetas blancas luminosas */
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '30px'
            }}>
              {(showFullCatalog ? filteredProducts : filteredProducts.slice(0, 4)).map((product) => (
                <TarjetaProducto
                  key={product.id}
                  product={product}
                  onQuickView={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                  onWhatsAppInquiry={handleWhatsAppInquiry}
                />
              ))}
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
                    boxShadow: '0 8px 24px rgba(45, 66, 98, 0.12)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--c-indigo)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(45, 66, 98, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = 'var(--c-indigo)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(45, 66, 98, 0.12)';
                  }}
                >
                  Ver más modelos
                </button>
              </div>
            )}
          </>
        )}
        </div>
        </div>
      </main>

      {/* Sección de Arte y Manufactura */}
      <Herencia />

      {/* Footer de Alta Relojería */}
      <PieDePagina
        onOpenWhatsAppConcierge={handleOpenWhatsAppConcierge}
        storeName={storeName}
      />

      {/* Modal de Vista Rápida del Reloj */}
      <ModalProducto
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onWhatsAppInquiry={handleWhatsAppInquiry}
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

      {/* Botón flotante de WhatsApp global */}
      <BotonWhatsApp phoneNumber={WHATSAPP_CONCIERGE} />
    </div>
  );
}
