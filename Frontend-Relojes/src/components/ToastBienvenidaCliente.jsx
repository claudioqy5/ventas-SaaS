import React, { useEffect, useRef } from 'react';
import { CheckCircle2, X, Sparkles, UserCheck } from 'lucide-react';

export default function ToastBienvenidaCliente({ user, onClose }) {
  const toastRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    function handleClickOutside(event) {
      if (toastRef.current && !toastRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    // Auto-cerrar después de 4.5 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timer);
    };
  }, [user, onClose]);

  if (!user) return null;

  // Extraer el primer nombre para un saludo cálido y personalizado
  const primerNombre = user.nombres 
    ? user.nombres.split(' ')[0] 
    : (user.nombre ? user.nombre.split(' ')[0] : 'Cliente');

  const inicial = primerNombre.charAt(0).toUpperCase();

  return (
    <div
      style={{
        position: 'fixed',
        top: '85px',
        right: '30px',
        zIndex: 9999,
        animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '420px',
        width: 'calc(100vw - 40px)'
      }}
    >
      <div
        ref={toastRef}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px 22px',
          boxShadow: '0 20px 45px rgba(11, 11, 12, 0.16), 0 0 0 1px rgba(212, 175, 55, 0.35)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Barra de acento dorada superior sutil */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #d4af37, #f7e08b, #d4af37)'
          }}
        />

        {/* Monograma / Avatar VIP */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1b1424 0%, #2c1b3d 100%)',
            border: '2px solid rgba(212, 175, 55, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d4af37',
            fontSize: '1.2rem',
            fontWeight: 700,
            fontFamily: 'serif',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(27, 20, 36, 0.25)',
            position: 'relative'
          }}
        >
          {inicial}
          {/* Insignia de verificación activa */}
          <div 
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              background: '#16a34a',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: '2px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ffffff' }} />
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span
              style={{
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#b8902d',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={12} color="#d4af37" /> SESIÓN VIP INICIADA
            </span>
          </div>

          <h4
            className="font-serif"
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: 'var(--c-obsidian)',
              margin: '0 0 4px 0',
              lineHeight: 1.2
            }}
          >
            ¡Bienvenido, {primerNombre}!
          </h4>

          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--c-taupe)',
              margin: 0,
              lineHeight: 1.4
            }}
          >
            Tu cuenta ha sido verificada. Disfruta de tu experiencia de compra exclusiva.
          </p>
        </div>

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Cerrar notificación"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--c-taupe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '6px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-obsidian)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-taupe)')}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
