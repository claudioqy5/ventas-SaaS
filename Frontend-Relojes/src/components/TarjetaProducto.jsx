import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Check } from 'lucide-react';
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
  const [added, setAdded] = useState(false);

  // Imágenes del producto (Foto 1 y Foto 2 si existe)
  const primaryImage = activeProduct.imagenUrl || (activeProduct.imagenes && activeProduct.imagenes[0]) || '/placeholder.jpg';
  const secondImage = activeProduct.imagenes && activeProduct.imagenes.length > 1 ? activeProduct.imagenes[1] : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(activeProduct);
    setAdded(true);

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#1a1a1a', '#c5a059', '#f4f4f6']
    });

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView(activeProduct)}
      style={{
        position: 'relative',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        border: '1px solid #eaeaea',
        padding: '18px',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
        boxShadow: isHovered
          ? '0 12px 30px rgba(0, 0, 0, 0.07)'
          : '0 2px 10px rgba(0, 0, 0, 0.02)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Contenido Superior */}
      <div>
        {/* Header de la tarjeta (Etiqueta + Stock) */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            color: '#8a733e',
            backgroundColor: '#faf8f5',
            border: '1px solid #f0eae1',
            padding: '3px 10px',
            borderRadius: '12px'
          }}>
            {activeProduct.etiqueta || 'Boutique'}
          </span>

          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.72rem',
            fontWeight: 400,
            color: activeProduct.stock > 0 ? '#166534' : '#991b1b'
          }}>
            <span style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: activeProduct.stock > 0 ? '#22c55e' : '#ef4444',
              display: 'inline-block'
            }} />
            {activeProduct.stock > 0 ? `${activeProduct.stock} dispon.` : 'Agotado'}
          </span>
        </div>

        {/* Imagen del Reloj */}
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
            height: '260px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#f8f8fa',
            border: '1px solid #f0f0f0',
            marginBottom: '16px'
          }}>
          {/* Foto Principal */}
          <img
            src={primaryImage}
            alt={activeProduct.nombre}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: (isImgHovered && secondImage) ? 0 : 1,
              transform: isHovered && !secondImage ? 'scale(1.03)' : 'scale(1)',
              transition: 'opacity 0.35s ease, transform 0.35s ease'
            }}
          />

          {/* Segunda Foto (transición suave al hacer hover si existe) */}
          {secondImage && (
            <img
              src={secondImage}
              alt={`${activeProduct.nombre} - vista 2`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isImgHovered ? 1 : 0,
                transform: isImgHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'opacity 0.35s ease, transform 0.35s ease'
              }}
            />
          )}
        </div>

        {/* Información del Producto */}
        <div>
          <span style={{
            fontSize: '0.7rem',
            color: '#888888',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 400,
            display: 'block',
            marginBottom: '4px'
          }}>
            {activeProduct.categoria || 'Relojes'}
          </span>

          <h3 className="font-serif" style={{
            fontSize: '1.05rem',
            fontWeight: 500,
            color: '#1a1a1a',
            margin: '0 0 6px',
            lineHeight: 1.35
          }}>
            {activeProduct.nombre}
          </h3>

          <p style={{
            fontSize: '0.82rem',
            color: '#666666',
            lineHeight: 1.45,
            margin: '0 0 14px',
            fontWeight: 400,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {activeProduct.descripcion}
          </p>

          {/* Variantes (si existen) */}
          {variants.length > 1 && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {variants.map(variant => {
                const isSelected = activeProduct.id === variant.id;
                const vImage = variant.imagenUrl || (variant.imagenes && variant.imagenes[0]);
                const colorAttr = variant.atributos?.find(a => (a.nombre || a.Nombre)?.toLowerCase() === 'color')?.valor;
                return (
                  <div
                    key={variant.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariant(variant);
                    }}
                    title={colorAttr ? `${variant.nombre} - ${colorAttr}` : variant.nombre}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      padding: '2px',
                      border: isSelected ? '1px solid #1a1a1a' : '1px solid transparent',
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
                      backgroundPosition: 'center'
                    }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer de la tarjeta (Precio + Botones) */}
      <div style={{
        borderTop: '1px solid #f0f0f0',
        paddingTop: '12px',
        marginTop: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.72rem', color: '#888888', fontWeight: 400 }}>
            Precio
          </span>
          <div style={{ textAlign: 'right' }}>
            {activeProduct.precioOferta > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: '#999999', fontWeight: 400 }}>
                  S/ {Number(activeProduct.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
                <span className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1a1a1a' }}>
                  S/ {Number(activeProduct.precioOferta).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ) : (
              <span className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1a1a1a' }}>
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
              backgroundColor: added ? '#166534' : '#1a1a1a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.8rem',
              fontWeight: 400,
              cursor: activeProduct.stock <= 0 ? 'not-allowed' : 'pointer',
              opacity: activeProduct.stock <= 0 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!added && activeProduct.stock > 0) e.currentTarget.style.backgroundColor = '#333333';
            }}
            onMouseLeave={(e) => {
              if (!added && activeProduct.stock > 0) e.currentTarget.style.backgroundColor = '#1a1a1a';
            }}
          >
            {added ? (
              <>
                <Check size={15} />
                Agregado
              </>
            ) : (
              <>
                <ShoppingBag size={15} strokeWidth={1.5} />
                Agregar a la bolsa
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onWhatsAppInquiry(activeProduct);
            }}
            title="Consultar por WhatsApp"
            style={{
              backgroundColor: '#f5f5f7',
              border: '1px solid #e0e0e0',
              color: '#1a1a1a',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <MessageCircle size={17} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}
