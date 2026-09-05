import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Settings, ShieldCheck, Clock, Sparkles, Watch, User, X, Menu } from 'lucide-react';
import Link from 'next/link';

export default function BarraNavegacion({
  cartCount,
  onOpenCart,
  onOpenSettings,
  isConnected,
  isFallback,
  storeName,
  searchQuery,
  setSearchQuery,
  onTriggerLoader,
  user,
  onOpenAuth
}) {
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lógica de visibilidad del Header al desplazarse:
  // Al desplazar hacia ABAJO: el header se muestra (fixed en el top)
  // Al desplazar hacia ARRIBA: el header se oculta (-100%)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // En la parte superior de la página, siempre visible
      if (currentScrollY <= 20) {
        setShowHeader(true);
      } else {
        const diff = currentScrollY - lastScrollY.current;
        if (diff > 3) {
          // Desplazamiento hacia ABAJO -> Mostrar Header
          setShowHeader(true);
        } else if (diff < -3) {
          // Desplazamiento hacia ARRIBA -> Ocultar Header
          setShowHeader(false);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Foco automático suave cuando se abre el buscador
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Cierre suave al hacer clic fuera del buscador si no hay búsqueda activa
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        if (!searchQuery) {
          setShowSearch(false);
        }
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch, searchQuery]);

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(115, 96, 91, 0.16)',
        boxShadow: '0 4px 20px rgba(45, 66, 98, 0.08)',
        transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease'
      }}>
        {/* Top micro-bar en perla suave */}
        <div style={{
          backgroundColor: '#f6f3ee',
          borderBottom: '1px solid rgba(115, 96, 91, 0.12)',
          padding: '7px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '0.74rem',
          letterSpacing: '0.08em',
          color: 'var(--c-taupe)'
        }}>
          <div className="marquee-container" style={{ width: '100%' }}>
            <div className="marquee-text">
              ENVIOS A TODO EL PERÚ &nbsp;&nbsp;•&nbsp;&nbsp; ENTREGA EN TU DOMICILIO &nbsp;&nbsp;•&nbsp;&nbsp; 3 AÑOS DE GARANTIA &nbsp;&nbsp;•&nbsp;&nbsp; ESCRIBE A NUESTRA LINEA DE VENTAS POR WHATSAPP +51 962956919
            </div>
          </div>
        </div>

        <div className="navbar-main" style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          {/* Hamburger Menu (Mobile Only) */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'var(--c-deep-purple)',
              cursor: 'pointer',
              display: 'none' // Hidden by default, shown in media query
            }}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Brand Logo - Carga completa de la página principal (como F5) */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onTriggerLoader) {
                onTriggerLoader();
              }
              window.location.href = '/';
            }}
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Watch size={28} color="#5e1743" strokeWidth={1.5} />
              <div style={{ width: '1.5px', height: '36px', backgroundColor: '#000' }}></div>
              <div style={{ fontSize: '2.2rem', fontFamily: '"Cinzel", serif', color: '#5e1743', lineHeight: 1, letterSpacing: '0.05em' }}>
                TP
              </div>
            </div>
            <div style={{
              fontSize: '0.65rem',
              letterSpacing: '0.45em',
              fontFamily: '"Cinzel", serif',
              color: '#000',
              textTransform: 'uppercase',
              marginLeft: '0.45em'
            }}>
              TEMPO PRECISO
            </div>
          </a>



        {/* Enlaces de Navegación de Alta Categoría */}
        <nav className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
          {[
            { label: 'Hombre', href: '/categoria/hombre', tag: 'Hombre' },
            { label: 'Mujer', href: '/categoria/mujer', tag: 'Mujer' },
            { label: 'Marcas', href: '/categoria/marcas', isHighlight: true },
            { label: 'Novedades', href: '/categoria/novedades', badge: 'Nuevo' },
            { label: 'Ofertas', href: '/categoria/ofertas', badge: 'VIP' },
            { label: 'Accesorios', href: '/categoria/accesorios' }
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              style={{
                color: item.isHighlight ? 'var(--c-indigo)' : 'var(--c-deep-purple)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 0',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--c-blush)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = item.isHighlight ? 'var(--c-indigo)' : 'var(--c-deep-purple)';
              }}
            >
              {item.label}
              {item.badge && (
                <span style={{
                  fontSize: '0.58rem',
                  backgroundColor: item.badge === 'VIP' ? 'var(--c-blush)' : 'var(--c-indigo)',
                  color: '#ffffff',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  lineHeight: 1,
                  fontWeight: 800,
                  letterSpacing: '0.05em'
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Acciones */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Botón de Mi Cuenta VIP (Login) */}
          <button
            onClick={onOpenAuth}
            title={user ? `Cuenta VIP: ${user.nombre}` : "Mi Cuenta VIP / Iniciar Sesión"}
            style={{
              height: '42px',
              padding: user ? '0 16px' : '0',
              width: user ? 'auto' : '42px',
              borderRadius: user ? '9999px' : '50%',
              background: user ? 'var(--c-deep-purple)' : '#ffffff',
              border: user ? '1px solid var(--c-blush)' : '1px solid var(--border-light)',
              color: user ? '#ffffff' : 'var(--c-deep-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(45, 66, 98, 0.08)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--c-blush)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = user ? 'var(--c-blush)' : 'var(--border-light)';
            }}
          >
            <User size={18} color={user ? 'var(--c-blush)' : 'var(--c-deep-purple)'} />
            {user && (
              <span style={{
                fontSize: '0.8rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                {user.nombre.split(' ')[0]} (VIP)
              </span>
            )}
          </button>

          {/* Buscador Desplegable con Animación Suave */}
          <div
            className="navbar-search"
            ref={searchContainerRef}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: '42px',
              width: showSearch ? '270px' : '42px',
              borderRadius: '9999px',
              backgroundColor: '#ffffff',
              border: `1px solid ${showSearch ? 'var(--c-indigo)' : 'var(--border-light)'}`,
              boxShadow: showSearch
                ? '0 4px 18px rgba(45, 66, 98, 0.12)'
                : '0 2px 8px rgba(45, 66, 98, 0.06)',
              transition: 'width 0.38s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease',
              overflow: 'hidden',
              padding: showSearch ? '0 10px 0 13px' : '0',
              justifyContent: showSearch ? 'flex-start' : 'center',
              cursor: showSearch ? 'default' : 'pointer'
            }}
            onClick={() => {
              if (!showSearch) setShowSearch(true);
            }}
            title={!showSearch ? "Buscar en el catálogo" : undefined}
            onMouseEnter={(e) => {
              if (!showSearch) e.currentTarget.style.borderColor = 'var(--c-blush)';
            }}
            onMouseLeave={(e) => {
              if (!showSearch) e.currentTarget.style.borderColor = 'var(--border-light)';
            }}
          >
            {/* Ícono de búsqueda */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowSearch(prev => !prev);
              }}
              aria-label={showSearch ? "Cerrar búsqueda" : "Abrir buscador"}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showSearch ? 'var(--c-indigo)' : 'var(--c-deep-purple)',
                cursor: 'pointer',
                flexShrink: 0,
                width: showSearch ? '24px' : '42px',
                height: '42px',
                transition: 'color 0.2s ease, width 0.3s ease'
              }}
            >
              <Search size={18} />
            </button>

            {/* Input de texto con aparición y deslizamiento suave */}
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar reloj, calibre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowSearch(false);
                }
              }}
              style={{
                flex: 1,
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--c-deep-purple)',
                fontSize: '0.85rem',
                fontWeight: 500,
                marginLeft: showSearch ? '8px' : '0',
                opacity: showSearch ? 1 : 0,
                transform: showSearch ? 'translateX(0)' : 'translateX(-12px)',
                transition: 'opacity 0.28s ease 0.08s, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1) 0.08s',
                pointerEvents: showSearch ? 'auto' : 'none'
              }}
            />

            {/* Botón de limpiar / cerrar */}
            {showSearch && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (searchQuery) {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  } else {
                    setShowSearch(false);
                  }
                }}
                title={searchQuery ? "Borrar texto" : "Cerrar buscador"}
                aria-label="Cerrar"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--c-taupe)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  padding: 0,
                  flexShrink: 0,
                  marginLeft: '4px',
                  opacity: showSearch ? 1 : 0,
                  transform: showSearch ? 'scale(1)' : 'scale(0.7)',
                  transition: 'opacity 0.2s ease 0.1s, transform 0.2s ease 0.1s, color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-deep-purple)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--c-taupe)'}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Bolsa de Compras */}
          <button
            onClick={onOpenCart}
            title="Bolsa de Compras"
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              color: 'var(--c-deep-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(45, 66, 98, 0.06)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--c-blush)';
              e.currentTarget.style.color = 'var(--c-indigo)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.color = 'var(--c-deep-purple)';
            }}
          >
            <ShoppingBag size={18} />
            {isMounted && cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--c-blush)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 6px rgba(208, 150, 131, 0.6)'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
    <div className="header-spacer" style={{ height: '105px', width: '100%' }} />
    </>
  );
}

