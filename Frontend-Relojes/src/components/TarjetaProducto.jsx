import React, { useState } from 'react';
import { Eye, ShoppingBag, MessageCircle, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TarjetaProducto({
  product,
  variants = [],
  onQuickView,
  onAddToCart,
  onWhatsAppInquiry
}) {
  const [selectedVariant, setSelectedVariant] = React.useState(product);

  React.useEffect(() => {
    setSelectedVariant(product);
  }, [product]);

  const activeProduct = selectedVariant || product;

  const [isHovered, setIsHovered] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [added, setAdded] = useState(false);

  // Imágenes del producto (Foto 1 y Foto 2 si existe)
  const primaryImage = activeProduct.imagenUrl || (activeProduct.imagenes && activeProduct.imagenes[0]) || '/placeholder.jpg';
  const secondImage = activeProduct.imagenes && activeProduct.imagenes.length > 1 ? activeProduct.imagenes[1] : null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });

    const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(activeProduct);
    setAdded(true);

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#0B0B0C', '#D4AF37', '#F5E6C8', '#3B3C41']
    });

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onQuickView(activeProduct)}
      style={{
        position: 'relative',
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        border: isHovered ? '1px solid var(--c-gold)' : '1px solid rgba(59, 60, 65, 0.16)',
        padding: '20px',
        cursor: 'pointer',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? '-6px' : '0'})`,
        transition: 'transform 0.2s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isHovered
          ? '0 20px 45px -10px rgba(11, 11, 12, 0.15), 0 0 25px -5px rgba(212, 175, 55, 0.25)'
          : '0 8px 25px -5px rgba(26, 27, 31, 0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Reflejo de luz especular interactivo en tono Dorado suave */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(212, 175, 55, 0.12) 0%, transparent 80%)`,
        pointerEvents: 'none',
        zIndex: 4
      }} />

      {/* Header de la tarjeta */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          zIndex: 2,
          position: 'relative'
        }}>
          <span style={{
            fontSize: '0.68rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            color: 'var(--c-obsidian)',
            background: 'rgba(212, 175, 55, 0.14)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            padding: '4px 10px',
            borderRadius: '9999px'
          }}>
            {activeProduct.etiqueta || 'Haute Horlogerie'}
          </span>

          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.74rem',
            fontWeight: 600,
            color: activeProduct.stock > 0 ? '#10b981' : '#f43f5e'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: activeProduct.stock > 0 ? '#10b981' : '#f43f5e',
              display: 'inline-block'
            }}></span>
            {activeProduct.stock > 0 ? `${activeProduct.stock} disponibles` : 'Agotado'}
          </span>
        </div>

        {/* Imagen del Reloj sobre fondo perla suave */}
        <div 
          onMouseEnter={(e) => {
            e.stopPropagation();
            setIsImgHovered(true);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setIsImgHovered(false);
          }}
          style={{
            position: 'relative',
            width: '100%',
            height: '280px',
            borderRadius: '14px',
            overflow: 'hidden',
            backgroundColor: '#f8f6f2',
            border: '1px solid rgba(59, 60, 65, 0.1)',
            marginBottom: '18px'
          }}>
          {/* Foto Principal */}
          <img
            src={primaryImage}
            alt={`Reloj de Lujo ${activeProduct.nombre}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: (isImgHovered && secondImage) ? 0 : 1,
              transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />

          {/* Segunda Foto (se muestra suavemente al hacer hover SOLO en la imagen) */}
          {secondImage && (
            <img
              src={secondImage}
              alt={`Reloj de Lujo ${activeProduct.nombre} - Ángulo 2`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isImgHovered ? 1 : 0,
                transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          )}

          {/* Botón flotante para vista rápida */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: `translateX(-50%) translateY(${isHovered ? '0' : '20px'})`,
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 5
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(activeProduct);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--c-indigo)',
                color: 'var(--c-deep-purple)',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                padding: '8px 16px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 15px rgba(11, 11, 12, 0.15)'
              }}
            >
              <Eye size={13} color="var(--c-indigo)" />
              Detalles de Manufactura
            </button>
          </div>
        </div>

        {/* Información del Reloj */}
        <div>
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--c-blush)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 500,
            marginBottom: '6px'
          }}>
            {activeProduct.categoria || 'Reloj de Lujo'}
          </div>

          <h3 className="font-serif" style={{
            fontSize: '1.18rem',
            fontWeight: 600,
            color: 'var(--c-deep-purple)',
            letterSpacing: '0.01em',
            marginBottom: '8px',
            lineHeight: 1.3
          }}>
            {activeProduct.nombre}
          </h3>

          <p style={{
            fontSize: '0.84rem',
            color: 'var(--c-taupe)',
            lineHeight: 1.5,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {activeProduct.descripcion}
          </p>

          {/* Variantes (Circulitos de colores/modelos) */}
          {variants.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {variants.map(variant => {
                const isSelected = activeProduct.id === variant.id;
                const vImage = variant.imagenUrl || (variant.imagenes && variant.imagenes[0]);
                const colorAttr = variant.atributos?.find(a => (a.nombre || a.Nombre)?.toLowerCase() === 'color')?.valor || variant.atributos?.find(a => (a.nombre || a.Nombre)?.toLowerCase() === 'color')?.Valor;
                return (
                  <div
                    key={variant.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariant(variant);
                    }}
                    title={colorAttr ? `${variant.nombre} - ${colorAttr}` : variant.nombre}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      padding: '2px',
                      border: isSelected ? '1px solid var(--c-indigo)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backgroundImage: `url(${vImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer de la tarjeta */}
      <div style={{
        borderTop: '1px solid rgba(59, 60, 65, 0.12)',
        paddingTop: '14px',
        marginTop: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            Valor de Catálogo
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            {activeProduct.precioOferta > 0 ? (
              <>
                <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--c-taupe)', opacity: 0.6, fontFamily: 'var(--font-serif)', whiteSpace: 'nowrap' }}>
                  S/ {Number(activeProduct.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-serif" style={{ fontSize: '1.28rem', fontWeight: 600, color: 'var(--c-indigo)', whiteSpace: 'nowrap' }}>
                    S/ {Number(activeProduct.precioOferta).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    backgroundColor: 'var(--c-blush)',
                    color: '#ffffff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 600,
                    letterSpacing: '0.04em'
                  }}>
                    -{Math.round((1 - activeProduct.precioOferta / activeProduct.precio) * 100)}%
                  </span>
                </div>
              </>
            ) : (
              <span className="font-serif" style={{ fontSize: '1.28rem', fontWeight: 600, color: 'var(--c-indigo)', whiteSpace: 'nowrap' }}>
                S/ {Number(activeProduct.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
          <button
            onClick={handleAdd}
            disabled={activeProduct.stock <= 0}
            style={{
              background: added
                ? '#10b981'
                : 'var(--c-indigo)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '11px 14px',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.08em',
              fontWeight: 500,
              textTransform: 'uppercase',
              cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
              opacity: product.stock <= 0 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 14px rgba(11, 11, 12, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (!added && activeProduct.stock > 0) e.currentTarget.style.background = 'var(--c-indigo-hover)';
            }}
            onMouseLeave={(e) => {
              if (!added && activeProduct.stock > 0) e.currentTarget.style.background = 'var(--c-indigo)';
            }}
          >
            {added ? (
              <>
                <Check size={16} />
                Agregado
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                Agregar a la Bolsa
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onWhatsAppInquiry(activeProduct);
            }}
            title="Consultar disponibilidad con el Concierge por WhatsApp"
            style={{
              background: 'rgba(37, 211, 102, 0.12)',
              border: '1px solid rgba(37, 211, 102, 0.4)',
              color: '#1da851',
              borderRadius: '8px',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 2px 6px rgba(37, 211, 102, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#25d366';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(37, 211, 102, 0.12)';
              e.currentTarget.style.color = '#1da851';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 211, 102, 0.15)';
            }}
          >
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
