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
      alignItems: 'center'
      /* overflow: hidden quitado para permitir que la tarjeta sobresalga hacia abajo */
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
        <div style={{ width: '45%', paddingRight: '4%', position: 'relative' }}>
          {/* Badge de Alta Horlogerie */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: '"Cinzel", serif',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--c-blush)',
            marginBottom: '16px'
          }}>
            <span style={{ width: '24px', height: '1px', background: 'var(--c-blush)', opacity: 0.6 }}></span>
            ALTA RELOJERÍA
          </div>

          {/* Titular SEO Oculto pero indexable */}
          <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
            Tempo Preciso: Boutique de Alta Relojería y Relojes de Lujo en Perú
          </h1>

          {/* Título Poético Visual (Ahora es H2 para mantener la jerarquía) */}
          <h2 style={{
            fontFamily: '"Cormorant Garamond", "Cinzel", serif',
            fontSize: 'clamp(2.8rem, 4.8vw, 4.4rem)',
            lineHeight: 1.05,
            color: 'var(--c-deep-purple)',
            marginBottom: '24px',
            letterSpacing: '0.03em',
          }}>
            <span style={{
              display: 'block',
              fontWeight: 300,
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              color: '#2b272c',
              whiteSpace: 'nowrap'
            }}>
              VALOR EN CADA
            </span>
            <span 
              className="luxury-title-accent"
              style={{
                fontWeight: 600,                
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '4px',
                fontSize: '1.05em'
              }}
            >
              SEGUNDO
            </span>
          </h2>

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
            Obras maestras de precisión. Curaduría exclusiva de las mejores marcas internacionales de lujo en Perú.
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
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            borderTop: '1px solid rgba(115, 96, 91, 0.15)',
            paddingTop: '26px',
            maxWidth: '380px' // Limitar el ancho para dar espacio a la tarjeta
          }}>
            <div>
              <div className="font-serif" style={{ color: 'var(--c-indigo)', fontSize: '1.35rem', fontWeight: 600 }}>
                100%
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--c-taupe)', letterSpacing: '0.04em', marginTop: '2px', fontWeight: 400 }}>
                Originales Multimarca
              </div>
            </div>
            <div>
              <div className="font-serif" style={{ color: 'var(--c-blush)', fontSize: '1.35rem', fontWeight: 600 }}>
                5 AÑOS
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--c-taupe)', letterSpacing: '0.04em', marginTop: '2px', fontWeight: 400 }}>
                Garantía Internacional
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta Flotante Promocional para incentivar Scroll (Pegada al fondo de la sección) */}
      <div 
        onClick={onExplore}
        style={{
          position: 'absolute',
          left: 'max(25%, calc(50vw - 650px))', /* Alinear con el contenido izquierdo */
          bottom: '-120px', /* Cuelga por debajo del Hero, mitad adentro mitad afuera */
          background: 'linear-gradient(135deg, var(--c-deep-purple) 0%, var(--c-indigo) 100%)',
          color: '#fff',
          padding: '45px 50px',
          borderRadius: '24px',
          width: 'min(90%, 550px)',
          boxShadow: '0 30px 60px rgba(45, 66, 98, 0.4)',
          zIndex: 30,
          cursor: 'pointer',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-15px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8, marginBottom: '14px', fontWeight: 600 }}>
          Beneficio Exclusivo
        </div>
        <div className="font-serif" style={{ fontSize: '3.6rem', lineHeight: 1.1, marginBottom: '10px', color: 'var(--c-blush)' }}>
          30% <span style={{ fontSize: '1.6rem', fontWeight: 400, fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>OFF</span>
        </div>
        <div style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '35px', lineHeight: 1.5, maxWidth: '400px' }}>
          En tu primer pedido de Alta Relojería. Aplica para colecciones seleccionadas.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Descubrir Ahora <ArrowRight size={20} />
        </div>
      </div>
    </section>
  );
}
