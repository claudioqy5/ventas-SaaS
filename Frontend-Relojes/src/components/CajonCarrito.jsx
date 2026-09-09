import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CajonCarrito({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onGoToCheckout,
  whatsappNumber = '51962956919'
}) {
  // Control de animación suave de entrada y salida
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = 'hidden';
      const frame1 = requestAnimationFrame(() => {
        const frame2 = requestAnimationFrame(() => {
          setVisible(true);
        });
        return () => cancelAnimationFrame(frame2);
      });
      return () => cancelAnimationFrame(frame1);
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => {
        setRender(false);
      }, 380);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Limpieza de bloqueo de scroll
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!render) return null;

  const total = items.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

  const handleGoToCheckout = () => {
    onClose();
    if (onGoToCheckout) {
      onGoToCheckout();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(24, 18, 25, 0.55)',
        backdropFilter: visible ? 'blur(10px)' : 'blur(0px)',
        WebkitBackdropFilter: visible ? 'blur(10px)' : 'blur(0px)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), backdrop-filter 0.35s ease',
        pointerEvents: visible ? 'auto' : 'none'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid rgba(59, 60, 65, 0.16)',
          boxShadow: visible ? '-20px 0 60px rgba(11, 11, 12, 0.25)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '28px',
          overflowY: 'auto',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.38s ease',
          boxSizing: 'border-box'
        }}
      >
        {/* Header de la Bolsa */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '18px',
            borderBottom: '1px solid rgba(59, 60, 65, 0.15)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={18} color="var(--c-indigo)" />
              <h3 className="font-serif" style={{
                fontSize: '1.15rem',
                color: 'var(--c-deep-purple)',
                letterSpacing: '0.02em',
                fontWeight: 600
              }}>
                Bolsa de Compras
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#f8f6f2',
                border: '1px solid rgba(59, 60, 65, 0.2)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--c-taupe)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Lista de Relojes en la Bolsa */}
          {items.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--c-taupe)'
            }}>
              <ShoppingBag size={44} color="var(--c-blush)" style={{ margin: '0 auto 16px' }} />
              <p className="font-serif" style={{ fontSize: '1rem', color: 'var(--c-deep-purple)', marginBottom: '8px', fontWeight: 600 }}>
                Tu bolsa de compras está vacía
              </p>
              <p style={{ fontSize: '0.84rem', color: 'var(--c-taupe)', fontFamily: 'var(--font-serif)' }}>
                Explora el catálogo y añade los relojes que deseas ordenar.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '58vh', overflowY: 'auto', paddingRight: '4px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#f9f7f4',
                    border: '1px solid rgba(59, 60, 65, 0.12)'
                  }}
                >
                  <img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid rgba(59, 60, 65, 0.15)'
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 className="font-serif" style={{
                      fontSize: '0.86rem',
                      color: 'var(--c-deep-purple)',
                      marginBottom: '4px',
                      lineHeight: 1.25,
                      fontWeight: 600
                    }}>
                      {item.nombre}
                    </h4>
                    <div className="font-serif" style={{
                      fontSize: '0.86rem',
                      color: 'var(--c-indigo)',
                      fontWeight: 600
                    }}>
                      S/ {Number(item.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(59, 60, 65, 0.2)',
                          color: 'var(--c-deep-purple)',
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '0.9rem'
                        }}
                      >
                        -
                      </button>
                      <span className="font-serif" style={{ fontSize: '0.82rem', color: 'var(--c-deep-purple)', fontWeight: 600 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(59, 60, 65, 0.2)',
                          color: 'var(--c-deep-purple)',
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '0.9rem'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--c-taupe)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Eliminar de la bolsa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer y Botón Ir a Comprar */}
        {items.length > 0 && (
          <div style={{
            borderTop: '1px solid rgba(59, 60, 65, 0.15)',
            paddingTop: '20px',
            marginTop: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-serif)',
              color: 'var(--c-taupe)'
            }}>
              <span>Custodia y Transporte Asegurado</span>
              <span style={{ color: 'var(--c-indigo)', fontWeight: 600 }}>Cortesía VIP (S/ 0.00)</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '18px'
            }}>
              <span className="font-serif" style={{ fontSize: '0.95rem', color: 'var(--c-deep-purple)', letterSpacing: '0.02em', fontWeight: 500 }}>
                Total a Liquidar:
              </span>
              <span className="font-serif" style={{
                fontSize: '1.45rem',
                fontWeight: 600,
                color: 'var(--c-indigo)'
              }}>
                S/ {Number(total).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={handleGoToCheckout}
              className="btn-indigo blush-shimmer"
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <ShoppingBag size={17} />
              IR A COMPRAR
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
