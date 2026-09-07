import React, { useState } from 'react';
import { Eye, ShoppingBag, MessageCircle, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TarjetaProducto({
  product,
  onQuickView,
  onAddToCart,
  onWhatsAppInquiry
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [added, setAdded] = useState(false);

  // Imágenes del producto (Foto 1 y Foto 2 si existe)
  const primaryImage = product.imagenUrl || (product.imagenes && product.imagenes[0]) || '/placeholder.jpg';
  const secondImage = product.imagenes && product.imagenes.length > 1 ? product.imagenes[1] : null;

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
    onAddToCart(product);
    setAdded(true);

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#2D4262', '#D09683', '#73605B']
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
      onClick={() => onQuickView(product)}
      style={{
        position: 'relative',
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        border: isHovered ? '1px solid var(--c-blush)' : '1px solid rgba(115, 96, 91, 0.16)',
        padding: '20px',
        cursor: 'pointer',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? '-6px' : '0'})`,
        transition: 'transform 0.2s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isHovered
          ? '0 20px 45px -10px rgba(45, 66, 98, 0.15), 0 0 25px -5px rgba(208, 150, 131, 0.25)'
          : '0 8px 25px -5px rgba(54, 50, 55, 0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Reflejo de luz especular interactivo en tono Blush suave */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(208, 150, 131, 0.14) 0%, transparent 80%)`,
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
            color: 'var(--c-deep-purple)',
            background: 'rgba(208, 150, 131, 0.18)',
            border: '1px solid rgba(208, 150, 131, 0.45)',
            padding: '4px 10px',
            borderRadius: '9999px'
          }}>
            {product.etiqueta || 'Haute Horlogerie'}
          </span>

          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.74rem',
            fontWeight: 600,
            color: product.stock > 0 ? '#10b981' : '#f43f5e'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: product.stock > 0 ? '#10b981' : '#f43f5e',
              display: 'inline-block'
            }}></span>
            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
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
            border: '1px solid rgba(115, 96, 91, 0.1)',
            marginBottom: '18px'
          }}>
          {/* Foto Principal */}
          <img
            src={primaryImage}
            alt={`Reloj de Lujo ${product.nombre}`}
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
              alt={`Reloj de Lujo ${product.nombre} - Ángulo 2`}
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
                onQuickView(product);
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
                boxShadow: '0 4px 15px rgba(45, 66, 98, 0.15)'
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
            {product.categoria || 'Reloj de Lujo'}
          </div>

          <h3 className="font-serif" style={{
            fontSize: '1.18rem',
            fontWeight: 600,
            color: 'var(--c-deep-purple)',
            letterSpacing: '0.01em',
            marginBottom: '8px',
            lineHeight: 1.3
          }}>
            {product.nombre}
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
            {product.descripcion}
          </p>
        </div>
      </div>

      {/* Footer de la tarjeta */}
      <div style={{
        borderTop: '1px solid rgba(115, 96, 91, 0.12)',
        paddingTop: '14px',
        marginTop: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '6px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
            Valor de Catálogo
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            {product.precioOferta > 0 ? (
              <>
                <span style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--c-taupe)', opacity: 0.6, fontFamily: 'var(--font-serif)', whiteSpace: 'nowrap' }}>
                  S/ {Number(product.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--c-indigo)', whiteSpace: 'nowrap' }}>
                    S/ {Number(product.precioOferta).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                  <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                    -{Math.round((1 - product.precioOferta / product.precio) * 100)}%
                  </span>
                </div>
              </>
            ) : (
              <div className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--c-indigo)', whiteSpace: 'nowrap' }}>
                S/ {Number(product.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
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
              boxShadow: '0 4px 14px rgba(45, 66, 98, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (!added && product.stock > 0) e.currentTarget.style.background = 'var(--c-indigo-hover)';
            }}
            onMouseLeave={(e) => {
              if (!added && product.stock > 0) e.currentTarget.style.background = 'var(--c-indigo)';
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
              onWhatsAppInquiry(product);
            }}
            title="Consultar disponibilidad con el Concierge por WhatsApp"
            style={{
              background: 'rgba(37, 211, 102, 0.1)',
              border: '1px solid rgba(37, 211, 102, 0.35)',
              color: '#25d366',
              borderRadius: '8px',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#25d366';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)';
              e.currentTarget.style.color = '#25d366';
            }}
          >
            <MessageCircle size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
