import React, { useEffect, useRef } from 'react';
import { Check, X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function ToastNotificacion({ product, onClose, onOpenCart }) {
  const toastRef = useRef(null);

  // Cerrar al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (toastRef.current && !toastRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    
    // Auto cerrar después de 5 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timer);
    };
  }, [onClose, product]);

  if (!product) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px', // Justo debajo de la barra de navegación
        right: '40px',
        zIndex: 9999,
        animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        ref={toastRef}
        style={{
          width: '380px',
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 40px rgba(45, 66, 98, 0.15), 0 0 0 1px rgba(115, 96, 91, 0.1)',
          padding: '24px',
          position: 'relative',
        }}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--c-taupe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-deep-purple)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-taupe)')}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Check size={14} strokeWidth={3} />
          </div>
          <span style={{
            fontSize: '0.8rem',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#10b981',
            textTransform: 'uppercase'
          }}>
            Añadido con éxito a su bolsa
          </span>
        </div>

        {/* Detalles del producto */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '90px',
            height: '110px',
            backgroundColor: '#f8f6f2',
            border: '1px solid rgba(115, 96, 91, 0.1)',
            padding: '4px'
          }}>
            <img
              src={product.imagenUrl}
              alt={product.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 className="font-serif" style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--c-deep-purple)',
              marginBottom: '6px',
              lineHeight: 1.3
            }}>
              {product.nombre}
            </h4>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--c-taupe)',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {product.categoria || 'Reloj'}
            </span>
            <span className="font-serif" style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--c-indigo)'
            }}>
              S/ {Number(product.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => {
              onClose();
              onOpenCart();
            }}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'var(--c-deep-purple)',
              color: '#ffffff',
              border: 'none',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--c-indigo)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--c-deep-purple)')}
          >
            <ShoppingBag size={16} />
            Ver Bolsa
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
