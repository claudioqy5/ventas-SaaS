import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Settings, ShieldCheck, Clock, Sparkles, Watch, User, X, Menu, Truck, ChevronDown, ChevronUp } from 'lucide-react';
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
  onOpenAuth,
  onNavigateView,
  onLogout,
  selectedCategory,
  onSelectCategory
}) {
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  // Cerrar menú de usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

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
          // Desplazamiento hacia ABAJO -> Ocultar Header
          setShowHeader(false);
        } else if (diff < -3) {
          // Desplazamiento hacia ARRIBA -> Mostrar Header
          setShowHeader(true);
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
        borderBottom: '1px solid rgba(59, 60, 65, 0.14)',
        boxShadow: '0 4px 20px rgba(11, 11, 12, 0.06)',
        transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease'
      }}>
        {/* Top micro-bar en carbón de lujo con texto dorado */}
        <div style={{
          backgroundColor: '#1A1B1F',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          padding: '7px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '0.74rem',
          letterSpacing: '0.08em',
          color: 'var(--c-gold)'
        }}>
          <div className="marquee-container" style={{ width: '100%' }}>
            <div className="marquee-text" style={{ color: 'var(--c-gold)' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src="/logo-lgant-gold.png"
                alt="L'gant"
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
              />
              <div style={{ width: '1.5px', height: '36px', backgroundColor: 'var(--c-gold)', opacity: 0.6 }}></div>
              <div style={{ fontSize: '2.1rem', fontFamily: '"Cinzel", serif', color: 'var(--c-obsidian)', lineHeight: 1, letterSpacing: '0.06em', fontWeight: 700 }}>
                L'GANT
              </div>
            </div>
            <div style={{
              fontSize: '0.58rem',
              letterSpacing: '0.42em',
              fontFamily: '"Cinzel", serif',
              color: 'var(--c-steel)',
              textTransform: 'uppercase',
              marginLeft: '0.42em',
              fontWeight: 600
            }}>
              HAUTE HORLOGERIE
            </div>
          </a>



        {/* Enlaces de Navegación de Alta Categoría */}
        <nav className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
          {[
            { label: 'Hombre', href: '/categoria/hombre', tag: 'Hombre' },
            { label: 'Mujer', href: '/categoria/mujer', tag: 'Mujer' },
            { label: 'Marcas', href: '/categoria/marcas', isHighlight: true, isBrand: true },
            { label: 'Novedades', href: '/categoria/novedades', tag: 'Novedades', badge: 'Nuevo' },
            { label: 'Ofertas', href: '/categoria/ofertas', tag: 'Ofertas', badge: 'VIP' },
            { label: 'Accesorios', href: '/categoria/accesorios', tag: 'Accesorios' }
          ].map((item, idx) => {
            const targetTag = item.tag || item.label;
            const isCatActive = selectedCategory && (
              selectedCategory.toLowerCase() === targetTag.toLowerCase()
            );

            return (
              <Link
                key={idx}
                href={item.href}
                onClick={(e) => {
                  if (onSelectCategory) {
                    e.preventDefault();
                    onSelectCategory(targetTag);
                    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                  }
                }}
                style={{
                  color: isCatActive 
                    ? 'var(--c-blush)' 
                    : item.isHighlight 
                      ? 'var(--c-indigo)' 
                      : 'var(--c-deep-purple)',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: isCatActive ? 700 : 500,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 0',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  borderBottom: isCatActive ? '2px solid var(--c-gold)' : '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isCatActive) e.currentTarget.style.color = 'var(--c-blush)';
                }}
                onMouseLeave={(e) => {
                  if (!isCatActive) {
                    e.currentTarget.style.color = item.isHighlight ? 'var(--c-indigo)' : 'var(--c-deep-purple)';
                  }
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
            );
          })}
        </nav>

        {/* Acciones */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Menú de Usuario VIP (Dropdown desplegable estilo popover) */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                if (user) {
                  setIsUserMenuOpen(prev => !prev);
                } else {
                  onOpenAuth('login');
                }
              }}
              title={user ? `Cuenta VIP: ${user.nombre}` : "Mi Cuenta VIP / Iniciar Sesión"}
              style={{
                height: '42px',
                padding: user ? '0 16px 0 14px' : '0',
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
                boxShadow: '0 2px 8px rgba(11, 11, 12, 0.08)',
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
                <>
                  <span style={{
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700,
                    letterSpacing: '0.04em'
                  }}>
                    {user.nombres ? user.nombres.split(' ')[0] : user.nombre.split(' ')[0]}
                  </span>
                  {isUserMenuOpen ? (
                    <ChevronUp size={14} color="var(--c-blush)" />
                  ) : (
                    <ChevronDown size={14} color="rgba(255, 255, 255, 0.75)" />
                  )}
                </>
              )}
            </button>

            {/* Popover flotante exactamente como la captura de referencia */}
            {isUserMenuOpen && user && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  boxShadow: '0 16px 38px -4px rgba(0, 0, 0, 0.16), 0 4px 14px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(0, 0, 0, 0.07)',
                  padding: '18px 18px 16px',
                  minWidth: '240px',
                  zIndex: 300,
                  animation: 'fadeIn 0.2s ease-out'
                }}
              >
                {/* Flecha triangular apuntando hacia el nombre */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #ffffff',
                    filter: 'drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.05))'
                  }}
                />

                {/* Opción 1: Mis compras */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onNavigateView) {
                      onNavigateView('mis-compras');
                    } else {
                      onOpenAuth('pedidos');
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '11px 14px',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Truck size={22} color="var(--c-deep-purple)" />
                  </div>
                  <span style={{ fontSize: '0.96rem', fontWeight: 500, color: '#333333', fontFamily: 'inherit' }}>
                    Mis compras
                  </span>
                </button>

                {/* Opción 2: Mi cuenta */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onNavigateView) {
                      onNavigateView('cuenta');
                    } else {
                      onOpenAuth('cuenta');
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '11px 14px',
                    marginTop: '4px',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <User size={22} color="var(--c-deep-purple)" />
                  </div>
                  <span style={{ fontSize: '0.96rem', fontWeight: 500, color: '#333333', fontFamily: 'inherit' }}>
                    Mi cuenta
                  </span>
                </button>

                {/* Opción 3: Cerrar sesión */}
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--c-obsidian)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.96rem',
                    letterSpacing: '0.01em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(11, 11, 12, 0.15)',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--c-deep-purple)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--c-obsidian)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

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
                ? '0 4px 18px rgba(11, 11, 12, 0.12)'
                : '0 2px 8px rgba(11, 11, 12, 0.06)',
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
              boxShadow: '0 2px 8px rgba(11, 11, 12, 0.06)',
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
                backgroundColor: 'var(--c-gold)',
                color: 'var(--c-obsidian)',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.6)'
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

