import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, MessageCircle, ShieldCheck, Check, CreditCard, Sparkles, Truck, Lock, ChevronRight, ChevronLeft, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import TarjetaProducto from './TarjetaProducto';

export default function PaginaDetalleProducto({
  product,
  onBack,
  onAddToCart,
  onWhatsAppInquiry,
  allProducts = [],
  onSelectProduct
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Zoom interactivo al posar el mouse sobre la imagen de la página de detalle
  const [zoomStyle, setZoomStyle] = useState({
    transform: 'scale(1)',
    transformOrigin: 'center center',
    cursor: 'zoom-in'
  });

  const handleZoomMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({
      transform: 'scale(2.2)',
      transformOrigin: `${x}% ${y}%`,
      cursor: 'zoom-in'
    });
  };

  const handleZoomMouseLeave = () => {
    setZoomStyle({
      transform: 'scale(1)',
      transformOrigin: 'center center',
      cursor: 'zoom-in'
    });
  };

  if (!product) return null;

  const images = product.imagenes && product.imagenes.length > 0
    ? product.imagenes
    : (product.imagenUrl ? [product.imagenUrl] : ['/placeholder.jpg']);

  const angleLabels = ['Vista Frontal', 'Esfera & Bisel 45°', 'Correa & Cierre', 'Caja Posterior'];

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0B0B0C', '#D4AF37', '#F5E6C8', '#3B3C41']
    });

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleMercadoPagoCheckout = () => {
    onAddToCart(product, quantity);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
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

  const brandName = product.marca || product.categoria || 'HAUTE HORLOGERIE';
  const skuCode = `REL${String(product.id).padStart(7, '0')}`;

  // Productos relacionados
  const relatedProducts = allProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail-page" style={{
      width: '100%',
      minHeight: '80vh',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--c-deep-purple)',
      paddingBottom: '80px'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '30px 24px'
      }}>
        {/* Migas de Pan (Breadcrumbs) con tipografía oficial Montserrat */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-serif)',
          color: 'var(--c-taupe)',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              color: 'var(--c-indigo)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-subtle)',
              marginRight: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--c-blush)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
          >
            <ArrowLeft size={15} />
            Volver al Catálogo
          </button>
          <span>Inicio</span>
          <ChevronRight size={14} color="var(--c-taupe)" />
          <span>Relojes</span>
          <ChevronRight size={14} color="var(--c-taupe)" />
          <span>{product.categoria || 'Colección'}</span>
          <ChevronRight size={14} color="var(--c-taupe)" />
          <span style={{ color: 'var(--c-indigo)', fontWeight: 600 }}>{product.nombre}</span>
        </div>

        {/* Layout Principal Sin Bordes de Card (Layout Limpio Estilo Chronos) */}
        <div className="product-detail-layout" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.18fr) minmax(0, 1fr)',
          gap: '48px',
          alignItems: 'flex-start'
        }}>
          {/* Columna Izquierda: Miniaturas Verticales + Galería Principal con Flechas */}
          <div className="product-detail-gallery" style={{ display: 'flex', gap: '18px' }}>
            {/* Columna de Miniaturas Verticales a la Izquierda */}
            <div className="product-detail-thumbs" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              width: '82px',
              flexShrink: 0
            }}>
              {images.map((imgUrl, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    onMouseEnter={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '82px',
                      height: '82px',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--c-blush)' : '1px solid var(--border-light)',
                      padding: '5px',
                      backgroundColor: '#ffffff',
                      boxShadow: isSelected ? '0 4px 14px var(--c-blush-glow)' : 'none',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Ángulo ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '10px'
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Visualizador de Imagen Principal con Flechas de Navegación y Zoom Lens */}
            <div 
              className="product-detail-main-img" 
              onMouseMove={handleZoomMouseMove}
              onMouseLeave={handleZoomMouseLeave}
              style={{
                position: 'relative',
                flex: 1,
                height: '520px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(59, 60, 65, 0.16)',
                boxShadow: '0 10px 30px rgba(11, 11, 12, 0.08)',
                cursor: 'zoom-in'
              }}>
              {/* Botón Flecha Izquierda */}
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(11, 11, 12, 0.1)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--c-blush)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
              >
                <ChevronLeft size={20} color="var(--c-deep-purple)" />
              </button>

              <img
                src={images[selectedImageIndex]}
                alt={`${product.nombre} - Ángulo ${selectedImageIndex + 1}`}
                style={{
                  maxHeight: '92%',
                  maxWidth: '92%',
                  objectFit: 'contain',
                  borderRadius: '16px',
                  ...zoomStyle,
                  transition: 'transform 0.15s ease-out, transform-origin 0.1s ease-out'
                }}
              />

              {/* Botón Flecha Derecha */}
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(11, 11, 12, 0.1)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--c-blush)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
              >
                <ChevronRight size={20} color="var(--c-deep-purple)" />
              </button>
            </div>
          </div>

          {/* Columna Derecha: Detalles del Producto, Precios y Acciones */}
          <div>
            {/* Marca / Categoría */}
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--c-blush)',
              fontFamily: 'var(--font-serif)',
              marginBottom: '6px'
            }}>
              {brandName}
            </div>

            {/* Título Principal */}
            <h1 className="font-serif" style={{
              fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)',
              fontWeight: 600,
              color: 'var(--c-deep-purple)',
              lineHeight: 1.2,
              marginBottom: '8px'
            }}>
              {product.nombre}
            </h1>

            {/* Código SKU */}
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--c-taupe)',
              fontFamily: 'var(--font-serif)',
              marginBottom: '20px'
            }}>
              SKU: {skuCode}
            </div>

            {/* Sección de Precios */}
            <div style={{ marginBottom: '22px' }}>
              {product.precioOferta > 0 ? (
                <>
                  <div style={{ fontSize: '1.05rem', textDecoration: 'line-through', color: 'var(--c-taupe)', opacity: 0.6, marginBottom: '2px', fontFamily: 'var(--font-serif)' }}>
                    S/ {Number(product.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span className="font-serif" style={{ fontSize: '2.3rem', fontWeight: 600, color: 'var(--c-indigo)' }}>
                      S/ {Number(product.precioOferta).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                    <span style={{ backgroundColor: 'var(--c-blush)', color: '#ffffff', fontSize: '0.76rem', fontWeight: 600, fontFamily: 'var(--font-serif)', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '6px', boxShadow: '0 2px 8px var(--c-blush-glow)' }}>
                      OFERTA VIP -{Math.round((1 - product.precioOferta / product.precio) * 100)}%
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span className="font-serif" style={{ fontSize: '2.3rem', fontWeight: 600, color: 'var(--c-indigo)' }}>
                    S/ {Number(product.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            {/* Cuadro Promocional de Cuotas en Paleta del Sistema */}
            <div style={{
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              backgroundColor: 'var(--bg-card-alt)',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.84rem', color: 'var(--c-deep-purple)', fontFamily: 'var(--font-serif)', fontWeight: 500 }}>
                  Desde <strong style={{ color: 'var(--c-indigo)' }}>S/ {Number(product.precio / 6).toFixed(2)} al mes</strong> o en 3 cuotas sin intereses.
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--c-taupe)', marginTop: '2px', fontFamily: 'var(--font-serif)' }}>
                  Con todas las tarjetas de crédito <span style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600, color: 'var(--c-indigo)' }}>Más información</span>
                </div>
              </div>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--c-indigo)',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '0.05em'
              }}>
                Powerpay
              </span>
            </div>

            {/* Fila de Selección de Cantidad + Botón Principal AÑADIR A LA BOLSA */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {/* Select de Cantidad */}
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{
                  width: '75px',
                  height: '52px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: '#ffffff',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 500,
                  color: 'var(--c-deep-purple)',
                  padding: '0 10px',
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-subtle)'
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>

              {/* Botón AÑADIR A LA BOLSA con botón oficial Indigo + Blush Shimmer */}
              <button
                onClick={handleAdd}
                className="btn-indigo blush-shimmer"
                style={{
                  flex: 1,
                  height: '52px',
                  fontSize: '0.88rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    ¡Añadido a la Bolsa!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Añadir a la Bolsa de Compras
                  </>
                )}
              </button>
            </div>

            {/* Botón secundario Mercado Pago en Estilo de Lujo Coherente */}
            <button
              onClick={handleMercadoPagoCheckout}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#009ee3',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.84rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0, 158, 227, 0.25)',
                transition: 'all 0.2s ease',
                marginBottom: '28px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#008ac6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009ee3'}
            >
              <CreditCard size={18} />
              PAGAR CON TARJETA (MERCADO PAGO)
            </button>

            {/* Íconos Informativos de Beneficios en Paleta de Lujo */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              textAlign: 'center',
              padding: '18px 0',
              borderTop: '1px solid var(--border-light)',
              borderBottom: '1px solid var(--border-light)',
              marginBottom: '24px'
            }}>
              <div>
                <Truck size={22} color="var(--c-indigo)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.76rem', color: 'var(--c-deep-purple)', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Envíos a todo Perú</div>
              </div>
              <div>
                <Sparkles size={22} color="var(--c-blush)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.76rem', color: 'var(--c-deep-purple)', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Envío Gratuito VIP</div>
              </div>
              <div>
                <ShieldCheck size={22} color="var(--c-indigo)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: '0.76rem', color: 'var(--c-deep-purple)', fontFamily: 'var(--font-serif)', fontWeight: 600 }}>Garantía 3 Años</div>
              </div>
            </div>

            {/* Botones de Compartir y Consulta por WhatsApp */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-serif)',
              color: 'var(--c-taupe)',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600 }}>Compartir guardatiempo:</span>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.nombre, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Enlace copiado al portapapeles');
                    }
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-indigo)', display: 'flex', alignItems: 'center', padding: 0 }}
                  title="Copiar Enlace"
                >
                  <Share2 size={17} />
                </button>
              </div>

              <button
                onClick={() => onWhatsAppInquiry(product)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#15803d',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <MessageCircle size={16} />
                Consultar por WhatsApp
              </button>
            </div>

            {/* Ficha Técnica y Especificaciones */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <h3 className="font-serif" style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '14px',
                color: 'var(--c-indigo)'
              }}>
                Especificaciones Técnicas y Manufactura
              </h3>

              {product.atributos && product.atributos.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.82rem', fontFamily: 'var(--font-serif)' }}>
                  {product.atributos.map((attr, idx) => (
                    <div key={idx}>
                      <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem', textTransform: 'capitalize' }}>{attr.nombre}</span>
                      <strong style={{ color: 'var(--c-deep-purple)' }}>{attr.valor}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.82rem', fontFamily: 'var(--font-serif)' }}>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Calibre de Movimiento</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.calibre}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Cristal</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.cristal}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Hermeticidad</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.hermeticidad}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Diámetro de Caja</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.diametro || '42 mm'}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Productos Relacionados ("TAMBIÉN TE PUEDE INTERESAR") */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '70px', paddingTop: '40px', borderTop: '1px solid var(--border-light)' }}>
            <span style={{
              display: 'block',
              textAlign: 'center',
              fontSize: '0.74rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--c-blush)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 600,
              marginBottom: '6px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline', position: 'relative', top: '-1px' }}><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>
              SELECCIÓN EXCLUSIVA
            </span>
            <h3 className="font-serif" style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              color: 'var(--c-deep-purple)',
              marginBottom: '28px',
              textAlign: 'center'
            }}>
              Tambien te pueden interesar
            </h3>

            <div className="grid-4-products">
              {relatedProducts.map((rel) => (
                <TarjetaProducto
                  key={rel.id}
                  product={rel}
                  onQuickView={(p) => {
                    if (onSelectProduct) {
                      onSelectProduct(p);
                      setSelectedImageIndex(0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  onAddToCart={onAddToCart}
                  onWhatsAppInquiry={onWhatsAppInquiry}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
