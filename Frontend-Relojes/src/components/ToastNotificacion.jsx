import React, { useEffect, useRef } from 'react';
import { Check, X, ShoppingBag } from 'lucide-react';

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
    <div className="toast-popup-overlay">
      <div ref={toastRef} className="toast-popup-card">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="toast-popup-close-btn"
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--c-deep-purple)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--c-taupe)')}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="toast-popup-header">
          <div className="toast-popup-check-icon">
            <Check size={12} strokeWidth={3} />
          </div>
          <span className="toast-popup-header-title">
            Añadido con éxito a su carrito
          </span>
        </div>

        {/* Detalles del producto */}
        <div className="toast-popup-body">
          <div className="toast-popup-img-wrap">
            <img
              src={product.imagenUrl}
              alt={product.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="toast-popup-info">
            <h4 className="font-serif toast-popup-title">
              {product.nombre}
            </h4>
            <span className="toast-popup-category">
              {product.categoria || 'Reloj'}
            </span>
            <span className="font-serif toast-popup-price">
              S/ {Number(product.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => {
              onClose();
              onOpenCart();
            }}
            className="toast-popup-action-btn"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--c-indigo)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--c-deep-purple)')}
          >
            <ShoppingBag size={14} />
            Ver Carrito de compras
          </button>
        </div>
      </div>

      <style>{`
        .toast-popup-overlay {
          position: fixed;
          top: 80px;
          right: 30px;
          z-index: 9999;
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .toast-popup-card {
          width: 350px;
          max-width: calc(100vw - 32px);
          background-color: #ffffff;
          box-shadow: 0 16px 36px rgba(11, 11, 12, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.3);
          padding: 20px;
          position: relative;
          border-radius: 4px;
        }
        .toast-popup-close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--c-taupe);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }
        .toast-popup-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          padding-right: 24px;
        }
        .toast-popup-check-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }
        .toast-popup-header-title {
          font-size: 0.75rem;
          font-family: var(--font-serif);
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #10b981;
          text-transform: uppercase;
        }
        .toast-popup-body {
          display: flex;
          gap: 14px;
          margin-bottom: 16px;
        }
        .toast-popup-img-wrap {
          width: 75px;
          height: 90px;
          background-color: #f8f6f2;
          border: 1px solid rgba(59, 60, 65, 0.15);
          padding: 3px;
          flex-shrink: 0;
        }
        .toast-popup-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }
        .toast-popup-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--c-deep-purple);
          margin-bottom: 4px;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .toast-popup-category {
          font-size: 0.7rem;
          color: var(--c-taupe);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .toast-popup-price {
          font-size: 1rem;
          font-weight: 700;
          color: var(--c-indigo);
        }
        .toast-popup-action-btn {
          width: 100%;
          padding: 11px 14px;
          background-color: var(--c-deep-purple);
          color: #ffffff;
          border: none;
          font-family: var(--font-serif);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        /* Versión Móvil */
        @media (max-width: 600px) {
          .toast-popup-overlay {
            top: 70px;
            right: 12px;
            left: 12px;
            display: flex;
            justify-content: center;
          }
          .toast-popup-card {
            width: 100%;
            max-width: 310px;
            padding: 12px 14px;
            box-shadow: 0 10px 28px rgba(11, 11, 12, 0.22), 0 0 0 1px rgba(212, 175, 55, 0.35);
          }
          .toast-popup-header {
            margin-bottom: 10px;
            gap: 6px;
          }
          .toast-popup-check-icon {
            width: 17px;
            height: 17px;
          }
          .toast-popup-header-title {
            font-size: 0.68rem;
            letter-spacing: 0.04em;
          }
          .toast-popup-body {
            gap: 10px;
            margin-bottom: 12px;
          }
          .toast-popup-img-wrap {
            width: 55px;
            height: 65px;
          }
          .toast-popup-title {
            font-size: 0.82rem;
            margin-bottom: 2px;
          }
          .toast-popup-category {
            font-size: 0.65rem;
            margin-bottom: 4px;
          }
          .toast-popup-price {
            font-size: 0.88rem;
          }
          .toast-popup-action-btn {
            padding: 9px 12px;
            font-size: 0.72rem;
            letter-spacing: 0.05em;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
