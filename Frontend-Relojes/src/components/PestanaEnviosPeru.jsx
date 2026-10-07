"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Truck, ShieldCheck, MapPin, X, MessageCircle, Star } from 'lucide-react';

export default function PestanaEnviosPeru({ whatsappNumber = '51916382742', isVisible = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar si se hace clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <aside 
      ref={containerRef}
      aria-label="Información de envíos en Perú"
      style={{
        position: 'fixed',
        right: 0,
        top: '52%',
        transform: 'translateY(-50%)',
        zIndex: 992,
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'var(--font-main)'
      }}
    >
      {/* Panel Desplegable (se muestra suavemente hacia la izquierda) */}
      <div
        style={{
          width: isOpen ? '310px' : '0px',
          maxWidth: 'calc(100vw - 48px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          overflow: 'hidden',
          transition: 'all 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isOpen ? '-12px 18px 45px rgba(0, 0, 0, 0.45)' : 'none'
        }}
      >
        <div style={{
          width: '310px',
          maxWidth: 'calc(100vw - 48px)',
          backgroundColor: '#141519',
          color: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid rgba(212, 175, 55, 0.55)',
          borderRight: 'none',
          padding: '22px 20px',
          boxSizing: 'border-box'
        }}>
          {/* Header del Panel */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Bandera de Perú */}
              <div style={{
                width: '22px',
                height: '15px',
                borderRadius: '3px',
                overflow: 'hidden',
                display: 'flex',
                boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.25)',
                flexShrink: 0
              }}>
                <div style={{ flex: 1, backgroundColor: '#D91023' }}></div>
                <div style={{ flex: 1, backgroundColor: '#FFFFFF' }}></div>
                <div style={{ flex: 1, backgroundColor: '#D91023' }}></div>
              </div>
              <span style={{
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                fontWeight: 700
              }}>
                Tienda Oficial en Perú
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar panel de envíos"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Título */}
          <h4 style={{
            margin: '0 0 6px 0',
            fontSize: '1.12rem',
            fontFamily: '"Cinzel", serif',
            color: '#ffffff',
            fontWeight: 700,
            letterSpacing: '0.02em'
          }}>
            Envíos a Todo el Perú
          </h4>
          
          <p style={{
            margin: '0 0 14px 0',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.78)',
            lineHeight: 1.45
          }}>
            Despachos diarios y seguros desde Lima hacia todas las provincias a nivel nacional.
          </p>

          <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)', marginBottom: '14px' }}></div>

          {/* Viñetas con beneficios */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Truck size={15} color="#D4AF37" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: '#ffffff' }}>Shalom y Olva Courier</strong>
                <span style={{ fontSize: '0.70rem', color: 'rgba(255,255,255,0.65)' }}>Entrega a domicilio o retiro en agencia</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(52, 199, 89, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={15} color="#34C759" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: '#ffffff' }}>Envío 100% Protegido</strong>
                <span style={{ fontSize: '0.70rem', color: 'rgba(255,255,255,0.65)' }}>Código de rastreo y guía de remisión</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={15} color="#f5e6c8" />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: '#ffffff' }}>Stock Local en Perú</strong>
                <span style={{ fontSize: '0.70rem', color: 'rgba(255,255,255,0.65)' }}>Disponibilidad inmediata sin esperas</span>
              </div>
            </div>
          </div>

          {/* Botón WhatsApp */}
          <button
            onClick={() => {
              const text = encodeURIComponent(
                `👋 ¡Hola! Deseo consultar los costos y tiempos de envío a mi ciudad en Perú para los relojes de L'GANT.`
              );
              window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`, '_blank');
            }}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'var(--c-gold)',
              border: 'none',
              borderRadius: '8px',
              color: '#0d0e11',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            <MessageCircle size={15} color="#0d0e11" />
            <span>Consultar Cobertura</span>
          </button>
        </div>
      </div>

      {/* Pestaña Fija en el Borde Derecho (Estilo Referencia Usuario - Siempre Visible) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir información de envíos en Perú"
        style={{
          background: 'linear-gradient(180deg, #F5D061 0%, #D4AF37 50%, #C59B27 100%)',
          color: '#0d0e12',
          border: '1.5px solid rgba(255, 255, 255, 0.45)',
          borderRight: 'none',
          borderRadius: '10px 0 0 10px',
          padding: '13px 7px 11px 7px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '7px',
          boxShadow: '-4px 4px 18px rgba(0, 0, 0, 0.35), 0 0 16px rgba(212, 175, 55, 0.3)',
          transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '-6px 6px 24px rgba(0, 0, 0, 0.45), 0 0 22px rgba(212, 175, 55, 0.55)';
          e.currentTarget.style.transform = 'translateX(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '-4px 4px 18px rgba(0, 0, 0, 0.35), 0 0 16px rgba(212, 175, 55, 0.3)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        {/* Bandera de Perú en la pestaña */}
        <div style={{
          width: '18px',
          height: '12px',
          borderRadius: '2px',
          overflow: 'hidden',
          display: 'flex',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          border: '1px solid rgba(0,0,0,0.2)',
          flexShrink: 0
        }}>
          <div style={{ flex: 1, backgroundColor: '#D91023' }}></div>
          <div style={{ flex: 1, backgroundColor: '#FFFFFF' }}></div>
          <div style={{ flex: 1, backgroundColor: '#D91023' }}></div>
        </div>

        {/* Texto Vertical */}
        <span style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          fontSize: '0.72rem',
          letterSpacing: '0.20em',
          fontWeight: 800,
          color: '#0d0e12',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-sans)',
          userSelect: 'none'
        }}>
          ENVÍOS PERÚ
        </span>

        {/* Estrellas de Garantía (como en la referencia) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center', marginTop: '2px' }}>
          <Star size={11} fill="#0d0e12" color="#0d0e12" />
          <Star size={11} fill="#0d0e12" color="#0d0e12" />
          <Star size={11} fill="#0d0e12" color="#0d0e12" />
        </div>
      </button>
    </aside>
  );
}
