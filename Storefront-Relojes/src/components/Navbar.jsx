import React, { useState } from 'react';
import { ShoppingBag, Search, Settings, ShieldCheck, Clock, Sparkles } from 'lucide-react';

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenSettings,
  isConnected,
  isFallback,
  storeName,
  searchQuery,
  setSearchQuery,
  onTriggerLoader
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
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.74rem',
        letterSpacing: '0.08em',
        color: 'var(--c-taupe)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--c-indigo)', fontWeight: 600 }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--c-blush)',
              boxShadow: '0 0 8px var(--c-blush)',
              display: 'inline-block'
            }}></span>
            Boutique & Concierge Privado
          </span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={14} color="var(--c-blush)" />
            Certificado Oficial de Autenticidad
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Botón para probar la pantalla de carga */}
          {onTriggerLoader && (
            <button
              onClick={onTriggerLoader}
              title="Ver animación del dial de cronógrafo analógico"
              style={{
                background: 'rgba(255, 59, 48, 0.08)',
                border: '1px solid rgba(255, 59, 48, 0.35)',
                color: '#ff3b30',
                padding: '4px 12px',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff3b30';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 59, 48, 0.08)';
                e.currentTarget.style.color = '#ff3b30';
              }}
            >
              ⏱️ Probar Loader
            </button>
          )}

          {/* Indicador de conexión SaaS */}
          <button
            onClick={onOpenSettings}
            title="Configurar conexión con tu SaaS"
            style={{
              background: isConnected ? 'rgba(45, 66, 98, 0.08)' : 'rgba(208, 150, 131, 0.15)',
              border: `1px solid ${isConnected ? 'var(--c-indigo)' : 'var(--c-blush)'}`,
              color: isConnected ? 'var(--c-indigo)' : 'var(--c-deep-purple)',
              padding: '4px 12px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Settings size={12} color="var(--c-indigo)" />
            {isConnected ? 'SaaS Conectado' : 'Conectar con SaaS / Demostración'}
          </button>
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
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--c-indigo) 0%, var(--c-deep-purple) 60%, var(--c-blush) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(45, 66, 98, 0.25)',
            border: '2px solid #ffffff'
          }}>
            <Clock size={22} color="#ffffff" strokeWidth={2.4} />
          </div>
          <div>
            <div className="font-serif" style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: 'var(--c-deep-purple)',
              lineHeight: 1.1
            }}>
              A U R E L I A
            </div>
            <div style={{
              fontSize: '0.64rem',
              letterSpacing: '0.24em',
              color: 'var(--c-blush)',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginTop: '3px'
            }}>
              {storeName || 'Haute Horlogerie • Suiza'}
            </div>
          </div>
        </a>

        {/* Enlaces de Navegación */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '34px' }}>
          <a href="#catalogo" style={{
            color: 'var(--c-deep-purple)',
            textDecoration: 'none',
            fontSize: '0.86rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            transition: 'color 0.2s',
            borderBottom: '2px solid var(--c-blush)',
            paddingBottom: '4px'
          }}>
            Colección
          </a>
          <a href="#artesania" style={{
            color: 'var(--c-taupe)',
            textDecoration: 'none',
            fontSize: '0.86rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-indigo)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--c-taupe)'}
          >
            Manufactura
          </a>
          <a href="#garantia" style={{
            color: 'var(--c-taupe)',
            textDecoration: 'none',
            fontSize: '0.86rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-serif)',
            fontWeight: 600,
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--c-indigo)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--c-taupe)'}
          >
            Garantía
          </a>
        </nav>

        {/* Acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

          {/* Bolsa VIP */}
          <button
            onClick={onOpenCart}
            style={{
              position: 'relative',
              background: 'var(--c-indigo)',
              border: 'none',
              borderRadius: '9999px',
              padding: '10px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#ffffff',
              boxShadow: '0 4px 18px rgba(45, 66, 98, 0.25)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(45, 66, 98, 0.35)';
              e.currentTarget.style.background = 'var(--c-indigo-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(45, 66, 98, 0.25)';
              e.currentTarget.style.background = 'var(--c-indigo)';
            }}
          >
            <ShoppingBag size={17} color="#ffffff" />
            <span style={{
              fontSize: '0.82rem',
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.08em',
              fontWeight: 700
            }}>
              Bolsa VIP
            </span>
            {cartCount > 0 && (
              <span style={{
                backgroundColor: 'var(--c-blush)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px var(--c-blush)'
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
