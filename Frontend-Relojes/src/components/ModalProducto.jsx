import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, ShieldCheck, Check, CreditCard, Sparkles, Truck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ModalProducto({
  product,
  onClose,
  onAddToCart,
  onWhatsAppInquiry,
  allProducts = [],
  onSelectProduct
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const images = product.imagenes && product.imagenes.length > 0
    ? product.imagenes
    : (product.imagenUrl ? [product.imagenUrl] : ['/placeholder.jpg']);

  const angleLabels = ['Frontal', 'Esfera 45°', 'Correa & Broche', 'Tapa Posterior'];

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

  const handleMercadoPagoCheckout = () => {
    onAddToCart(product, quantity);
    onClose();
    // Abrir directamente la bolsa / checkout
  };

  const specs = product.specs || {
    calibre: 'Calibre de Alta Precisión Automática / Cuarzo Certificado',
    rubies: '32 Joyas de Rubí Sintético',
    reservaMarcha: '68 Horas Continuas',
    diametro: '42 mm',
    cristal: 'Zafiro Sintético con Doble Antirreflejo',
    hermeticidad: '100 Metros (10 ATM)',
    material: 'Acero Inoxidable Quirúrgico 316L / Oro Rose'
  };

  // Productos relacionados (excluyendo el producto actual)
  const relatedProducts = allProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(24, 18, 25, 0.65)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          border: '1px solid rgba(115, 96, 91, 0.2)',
          borderRadius: '24px',
          maxWidth: '1020px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 30px 80px rgba(45, 66, 98, 0.3), 0 0 40px rgba(208, 150, 131, 0.2)',
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

        {/* Sección Superior: Galería de Imágenes + Información Principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px'
        }}>
          {/* Columna Izquierda: Galería con 4 Ángulos */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Imagen Principal Seleccionada */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '380px',
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: '#f9f8f6',
              border: '1px solid rgba(115, 96, 91, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}>
              <img
                src={images[selectedImageIndex]}
                alt={`${product.nombre} - Ángulo ${selectedImageIndex + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'all 0.3s ease'
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(6px)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--c-indigo)',
                letterSpacing: '0.05em'
              }}>
                ✦ Ángulo {selectedImageIndex + 1}
              </span>
            </div>

            {/* Galería de 4 Miniaturas (Ángulos) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              width: '100%',
              marginTop: '14px'
            }}>
              {images.map((imgUrl, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    onMouseEnter={() => setSelectedImageIndex(idx)}
                    style={{
                      position: 'relative',
                      height: '75px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isSelected
                        ? '2px solid var(--c-indigo)'
                        : '1px solid rgba(115, 96, 91, 0.2)',
                      boxShadow: isSelected ? '0 4px 14px rgba(45, 66, 98, 0.25)' : 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: '#f8f6f2'
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Ángulo ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: isSelected ? 1 : 0.65
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Sellos de Confianza */}
            <div style={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
              backgroundColor: '#f8f6f3',
              padding: '14px 18px',
              borderRadius: '14px',
              border: '1px solid rgba(115, 96, 91, 0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-indigo)', fontSize: '0.78rem', fontWeight: 600 }}>
                <ShieldCheck size={16} color="var(--c-blush)" />
                <span>Garantía Internacional de 5 Años</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-taupe)', fontSize: '0.78rem' }}>
                <Truck size={16} color="var(--c-indigo)" />
                <span>Envío Asegurado Gratis a todo el Perú</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Especificaciones Técnicas y Botones */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
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
                <span style={{
                  fontSize: '0.7rem',
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontWeight: 700
                }}>
                  ✓ En Stock
                </span>
              </div>

              <h2 className="font-serif" style={{
                fontSize: '1.8rem',
                color: 'var(--c-deep-purple)',
                letterSpacing: '0.02em',
                marginBottom: '12px',
                lineHeight: 1.2,
                fontWeight: 800
              }}>
                {product.nombre}
              </h2>

              {/* Precios */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '18px' }}>
                <span className="font-serif" style={{
                  fontSize: '1.9rem',
                  fontWeight: 800,
                  color: 'var(--c-indigo)'
                }}>
                  S/ {Number(product.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
                <span style={{
                  fontSize: '1.1rem',
                  textDecoration: 'line-through',
                  color: 'var(--c-taupe)',
                  opacity: 0.6
                }}>
                  S/ {Number(product.precio * 1.25).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  backgroundColor: 'var(--c-blush)',
                  color: '#fff',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  fontWeight: 800
                }}>
                  -20% VIP
                </span>
              </div>

              <p style={{
                fontSize: '0.9rem',
                color: 'var(--c-taupe)',
                lineHeight: 1.6,
                marginBottom: '20px'
              }}>
                {product.descripcion}
              </p>

              {/* Ficha de Manufactura */}
              <div style={{
                backgroundColor: '#f9f7f4',
                border: '1px solid rgba(115, 96, 91, 0.18)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '22px'
              }}>
                <div style={{
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-serif)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--c-indigo)',
                  fontWeight: 800,
                  marginBottom: '10px'
                }}>
                  ✦ Especificaciones Técnicas
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.7rem', fontWeight: 600 }}>Calibre</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.calibre}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.7rem', fontWeight: 600 }}>Cristal</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.cristal}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.7rem', fontWeight: 600 }}>Hermeticidad</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.hermeticidad}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.7rem', fontWeight: 600 }}>Diámetro</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.diametro || '42 mm'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones y Métodos de Pago (Mercado Pago) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Cantidad */}
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
                    style={{ background: 'none', border: 'none', color: 'var(--c-deep-purple)', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 10px', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--c-indigo)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    style={{ background: 'none', border: 'none', color: 'var(--c-deep-purple)', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                {/* Agregar a la bolsa */}
                <button
                  onClick={handleAdd}
                  className="btn-indigo blush-shimmer"
                  style={{ flex: 1, padding: '13px 18px', fontSize: '0.82rem' }}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      ¡Añadido a la Bolsa!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Añadir a la Bolsa
                    </>
                  )}
                </button>
              </div>

              {/* Botón Mercado Pago con Tarjeta */}
              <button
                onClick={handleMercadoPagoCheckout}
                style={{
                  width: '100%',
                  backgroundColor: '#009ee3', // Azul Mercado Pago oficial
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '13px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 158, 227, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#008ac6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009ee3'}
              >
                <CreditCard size={18} />
                Pagar con Tarjeta (Mercado Pago)
              </button>

              {/* Consulta por WhatsApp */}
              <button
                onClick={() => onWhatsAppInquiry(product)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(37, 211, 102, 0.08)',
                  border: '1px solid rgba(37, 211, 102, 0.35)',
                  color: '#15803d',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '11px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <MessageCircle size={16} />
                Consultar por WhatsApp con Asesor
              </button>
            </div>
          </div>
        </div>

        {/* Sección Inferior: Productos Relacionados (Para seguir comprando) */}
        {relatedProducts.length > 0 && (
          <div style={{
            marginTop: '36px',
            paddingTop: '28px',
            borderTop: '1px solid rgba(115, 96, 91, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 className="font-serif" style={{
                fontSize: '1.1rem',
                color: 'var(--c-deep-purple)',
                letterSpacing: '0.04em',
                fontWeight: 700,
                margin: 0
              }}>
                ✦ TAMBIÉN TE PUEDE INTERESAR
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--c-taupe)', letterSpacing: '0.05em' }}>
                Explora más guardatiempos exclusivos
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: '16px'
            }}>
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    if (onSelectProduct) {
                      onSelectProduct(rel);
                      setSelectedImageIndex(0);
                    }
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(115, 96, 91, 0.16)',
                    borderRadius: '14px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--c-blush)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(45, 66, 98, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(115, 96, 91, 0.16)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: '#f8f6f2',
                    marginBottom: '10px'
                  }}>
                    <img
                      src={rel.imagenUrl}
                      alt={rel.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--c-blush)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                      {rel.categoria || 'Colección'}
                    </span>
                    <h4 style={{
                      fontSize: '0.82rem',
                      color: 'var(--c-deep-purple)',
                      margin: '2px 0 6px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: 700
                    }}>
                      {rel.nombre}
                    </h4>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--c-indigo)' }}>
                      S/ {Number(rel.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
