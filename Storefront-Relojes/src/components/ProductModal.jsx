import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, ShieldCheck, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onWhatsAppInquiry
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#2D4262', '#D09683', '#73605B']
    });

    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const specs = product.specs || {
    calibre: 'Calibre Suizo de Precisión Automática',
    rubies: '32 Joyas de Rubí Sintético',
    reservaMarcha: '68 Horas Continuas',
    diametro: '42 mm',
    cristal: 'Zafiro Sintético con Doble Antirreflejo',
    hermeticidad: '100 Metros (10 ATM)',
    material: 'Oro / Acero Inoxidable Quirúrgico 316L'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(45, 66, 98, 0.45)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          border: '1px solid rgba(115, 96, 91, 0.2)',
          borderRadius: '24px',
          maxWidth: '960px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(45, 66, 98, 0.25), 0 0 40px rgba(208, 150, 131, 0.2)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '32px',
          padding: '36px'
        }}
      >
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f8f6f2',
            border: '1px solid rgba(115, 96, 91, 0.2)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--c-deep-purple)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--c-blush)';
            e.currentTarget.style.color = 'var(--c-indigo)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(115, 96, 91, 0.2)';
            e.currentTarget.style.color = 'var(--c-deep-purple)';
          }}
        >
          <X size={18} />
        </button>

        {/* Columna Izquierda: Imagen Grande del Reloj */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '420px',
            borderRadius: '18px',
            overflow: 'hidden',
            backgroundColor: '#f8f6f2',
            border: '1px solid rgba(115, 96, 91, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={product.imagenUrl}
              alt={product.nombre}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          <div style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--c-indigo)',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}>
            <ShieldCheck size={16} color="var(--c-blush)" />
            <span>Certificado de Garantía Internacional de 5 Años</span>
          </div>
        </div>

        {/* Columna Derecha: Especificaciones Técnicas */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{
              fontSize: '0.74rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--c-blush)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 700
            }}>
              {product.categoria || 'Guardatiempo de Alta Gama'}
            </span>

            <h2 className="font-serif" style={{
              fontSize: '1.8rem',
              color: 'var(--c-deep-purple)',
              letterSpacing: '0.02em',
              marginTop: '6px',
              marginBottom: '14px',
              lineHeight: 1.2,
              fontWeight: 800
            }}>
              {product.nombre}
            </h2>

            <div className="font-serif" style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--c-indigo)',
              marginBottom: '18px'
            }}>
              S/ {Number(product.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>

            <p style={{
              fontSize: '0.92rem',
              color: 'var(--c-taupe)',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              {product.descripcion}
            </p>

            {/* Ficha de Manufactura en fondo perla */}
            <div style={{
              backgroundColor: '#f9f7f4',
              border: '1px solid rgba(115, 96, 91, 0.18)',
              borderRadius: '14px',
              padding: '18px',
              marginBottom: '26px'
            }}>
              <div style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--c-indigo)',
                fontWeight: 800,
                marginBottom: '12px'
              }}>
                ✦ Ficha Técnica de Manufactura
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Calibre</span>
                  <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.calibre}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Cristal</span>
                  <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.cristal}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Hermeticidad</span>
                  <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.hermeticidad}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>Diámetro de Caja</span>
                  <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.diametro || '42 mm'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones y Cantidad */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              {/* Selector de cantidad */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '4px'
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--c-deep-purple)',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}
                >
                  -
                </button>
                <span style={{
                  padding: '0 12px',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 800,
                  color: 'var(--c-indigo)'
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--c-deep-purple)',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}
                >
                  +
                </button>
              </div>

              {/* Botón principal Agregar en Indigo */}
              <button
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className="btn-indigo blush-shimmer"
                style={{ flex: 1, padding: '14px 20px' }}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    ¡Guardatiempo Reservado!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Agregar a la Bolsa VIP
                  </>
                )}
              </button>
            </div>

            {/* Consulta directa por WhatsApp */}
            <button
              onClick={() => onWhatsAppInquiry(product)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(37, 211, 102, 0.08)',
                border: '1px solid rgba(37, 211, 102, 0.35)',
                color: '#15803d',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.16)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.08)';
              }}
            >
              <MessageCircle size={16} />
              Consultar con un Asesor por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
