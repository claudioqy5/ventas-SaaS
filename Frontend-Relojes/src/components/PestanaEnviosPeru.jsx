"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Truck, ShieldCheck, MapPin, X, MessageCircle, Star } from 'lucide-react';

export default function PestanaEnviosPeru({ whatsappNumber = '51916382742', isVisible = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Cerrar si se hace clic o tap fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Fondo tenue translúcido al abrir en móviles/tablets para destacar el panel */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            zIndex: 991,
            animation: 'fadeIn 0.25s ease'
          }}
        />
      )}

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
            width: isOpen ? 'clamp(280px, 82vw, 315px)' : '0px',
            maxWidth: 'calc(100vw - 44px)',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            overflow: 'hidden',
            transition: 'all 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: isOpen ? '-12px 18px 45px rgba(0, 0, 0, 0.45)' : 'none'
          }}
        >
          <div style={{
            width: 'clamp(260px, 80vw, 295px)',
            maxWidth: 'calc(100vw - 44px)',
            backgroundColor: '#111215',
            color: '#ffffff',
            borderRadius: '16px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            padding: '20px 18px',
            boxSizing: 'border-box',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}>
          {/* Header del Panel */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{
                width: '18px',
                height: '12px',
                borderRadius: '2px',
                overflow: 'hidden',
                display: 'flex',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                flexShrink: 0
              }}>
                <div style={{ flex: 1, backgroundColor: '#D91023' }}></div>
                <div style={{ flex: 1, backgroundColor: '#FFFFFF' }}></div>
                <div style={{ flex: 1, backgroundColor: '#D91023' }}></div>
              </div>
              <span style={{
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                fontWeight: 700
              }}>
                Perú Directo
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar panel de envíos"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Título */}
          <h4 style={{
            margin: '0 0 4px 0',
            fontSize: '1.05rem',
            fontFamily: '"Cinzel", serif',
            color: '#ffffff',
            fontWeight: 700,
            letterSpacing: '0.02em'
          }}>
            Envíos Nacionales
          </h4>
          
          <p style={{
            margin: '0 0 14px 0',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.35
          }}>
            Despachos diarios y 100% seguros desde Lima a todo el país.
          </p>

          {/* Viñetas con beneficios minimalistas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <Truck size={14} color="#D4AF37" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.9)' }}>
                <strong>Shalom</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <ShieldCheck size={14} color="#34C759" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.9)' }}>
                <strong>Envío 100% Protegido</strong> con guía
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <MapPin size={14} color="#F5E6C8" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.9)' }}>
                <strong>Stock disponible</strong> en Lima
              </span>
            </div>
          </div>

          {/* Botón WhatsApp Minimalista */}
          <button
            onClick={() => {
              const text = encodeURIComponent(
                `👋 ¡Hola! Deseo consultar los costos y tiempos de envío a mi ciudad en Perú para los relojes de L'GANT.`
              );
              window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`, '_blank');
            }}
            style={{
              width: '100%',
              padding: '9px 12px',
              backgroundColor: 'var(--c-gold)',
              border: 'none',
              borderRadius: '8px',
              color: '#0d0e11',
              fontSize: '0.73rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: '0 3px 12px rgba(212, 175, 55, 0.25)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            <MessageCircle size={14} color="#0d0e11" />
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
    </>
  );
}
