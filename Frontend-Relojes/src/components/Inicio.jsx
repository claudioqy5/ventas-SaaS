import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Inicio({ onExplore, onOpenWhatsAppConcierge }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{
      position: 'relative',
      minHeight: 'calc(100vh - 85px)',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      {/* Columna Derecha: Galería de Relojes (Crossfade) Full Bleed */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '50%',
        overflow: 'hidden',
        zIndex: 1,
        boxShadow: '-40px 0 100px rgba(0,0,0,0.45)' // Sombra muy pronunciada hacia la izquierda
      }}>
        {['/watches/chronograph_gold.jpg', '/watches/moonphase_blue.jpg', '/watches/skeleton_titanium.jpg'].map((img, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentImageIndex === idx ? 1 : 0,
              transition: 'opacity 2s ease-in-out, transform 4.5s ease-out',
              transform: currentImageIndex === idx ? 'scale(1)' : 'scale(1.05)',
            }}
          />
        ))}
        
        {/* Un sutil difuminado blanco interior por si la foto es muy oscura, para doble suavidad */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '80px',
          height: '100%',
          background: 'linear-gradient(to right, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />
      </div>

      {/* Halos ambientales suaves en Indigo (Solo en lado izquierdo) */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '550px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(45, 66, 98, 0.08) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        width: '100%',
        padding: '50px 5%', /* Padding fluido para que se apegue más a la izquierda en pantallas anchas */
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Columna Izquierda: Mensaje en fondo luminoso */}
        <div style={{ width: '45%', paddingRight: '4%' }}>
          {/* Título Principal */}
          <h1 style={{
            fontFamily: '"Outfit", sans-serif',
            fontSize: 'clamp(3.5rem, 6.5vw, 5.5rem)', // Más grande para mayor impacto
            fontWeight: 200, // Minimalista y muy limpio
            lineHeight: 1.05,
            color: 'var(--c-deep-purple)',
            letterSpacing: '-0.03em', // Tracking ajustado típico de diseño moderno
            marginBottom: '24px'
          }}>
            VALOR EN CADA <br />
            <span style={{ fontWeight: 500, color: 'var(--c-indigo)' }}>SEGUNDO</span>
          </h1>

          {/* Subtítulo en Taupe cálido */}
          <p style={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '1.25rem',
            lineHeight: 1.6,
            color: 'var(--c-taupe)',
            marginBottom: '40px',
            maxWidth: '520px',
            fontWeight: 300,
            letterSpacing: '0.01em'
          }}>
            Obras maestras de precisión. Ingeniería suiza y lujo en cada detalle.
          </p>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginBottom: '50px' }}>
            <button
              onClick={onExplore}
              className="btn-indigo blush-shimmer"
            >
              Explorar Guardatiempos
              <ArrowRight size={17} />
            </button>
            <button
              onClick={onOpenWhatsAppConcierge}
              className="btn-outline-luxury"
            >
              Asesor Privado VIP
            </button>
          </div>

          {/* Sellos de Excelencia */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            borderTop: '1px solid rgba(115, 96, 91, 0.15)',
            paddingTop: '26px'
          }}>
            <div>
              <div className="font-serif" style={{ color: 'var(--c-indigo)', fontSize: '1.35rem', fontWeight: 800 }}>
                100%
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--c-taupe)', letterSpacing: '0.04em', marginTop: '2px', fontWeight: 500 }}>
                Manufactura Suiza
              </div>
            </div>
            <div>
              <div className="font-serif" style={{ color: 'var(--c-blush)', fontSize: '1.35rem', fontWeight: 800 }}>
                5 AÑOS
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--c-taupe)', letterSpacing: '0.04em', marginTop: '2px', fontWeight: 500 }}>
                Garantía Internacional
              </div>
            </div>
            <div>
              <div className="font-serif" style={{ color: 'var(--c-deep-purple)', fontSize: '1.35rem', fontWeight: 800 }}>
                COSC
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--c-taupe)', letterSpacing: '0.04em', marginTop: '2px', fontWeight: 500 }}>
                Cronómetro Certificado
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
