import React, { useState } from 'react';
import { ShoppingBag, Search, Settings, ShieldCheck, Clock, Sparkles, Watch, User } from 'lucide-react';
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

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(115, 96, 91, 0.16)',
      boxShadow: '0 4px 20px rgba(45, 66, 98, 0.05)',
      transition: 'all 0.3s ease'
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

      {/* Barra Principal Luminosa */}
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
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
        </Link>

        {/* Enlaces de Navegación de Alta Categoría */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
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
                padding: '4px 0'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

          {/* Buscador */}
          {showSearch ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '9999px',
              padding: '6px 14px',
              border: '1px solid var(--c-indigo)',
              boxShadow: '0 4px 15px rgba(45, 66, 98, 0.1)'
            }}>
              <Search size={16} color="var(--c-indigo)" style={{ marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Buscar reloj, calibre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--c-deep-purple)',
                  fontSize: '0.85rem',
                  width: '180px',
                  fontWeight: 500
                }}
              />
              <button
                onClick={() => setShowSearch(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--c-taupe)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  marginLeft: '4px'
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              title="Buscar en el catálogo"
              style={{
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
              <Search size={18} />
            </button>
          )}

          {/* Bolsa VIP Minimalista */}
          <button
            onClick={onOpenCart}
            title="Ver Bolsa"
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
            {cartCount > 0 && (
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
  );
}
