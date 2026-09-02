import React, { useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function Hero({ onExplore, onOpenWhatsAppConcierge }) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });

    const tiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    const tiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '50px 24px 80px',
      overflow: 'hidden'
    }}>
      {/* Halos ambientales suaves en Blush (#D09683) e Indigo (#2D4262) */}
      <div style={{
        position: 'absolute',
        top: '5%',
        right: '15%',
        width: '500px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(208, 150, 131, 0.18) 0%, rgba(208, 150, 131, 0.04) 60%, transparent 80%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width: '550px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(45, 66, 98, 0.08) 0%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: '60px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Columna Izquierda: Mensaje en fondo luminoso */}
        <div>
          {/* Badge superior en Blush */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 18px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(208, 150, 131, 0.15)',
            border: '1px solid rgba(208, 150, 131, 0.4)',
            color: 'var(--c-deep-purple)',
            fontSize: '0.74rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            marginBottom: '26px'
          }}>
            <Sparkles size={14} color="var(--c-blush)" />
            tempo preciso • Colección Suiza 2026
          </div>

          {/* Título Principal */}
          <h1 className="font-serif" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.1rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            color: 'var(--c-deep-purple)',
            letterSpacing: '0.02em',
            marginBottom: '24px'
          }}>
            EL ARTE SUPREMO DE DOMINAR <br />
            <span className="palette-gradient-text">EL TIEMPO</span>
          </h1>

          {/* Subtítulo en Taupe cálido */}
          <p className="font-classic" style={{
            fontSize: '1.45rem',
            lineHeight: 1.5,
            color: 'var(--c-taupe)',
            marginBottom: '36px',
            maxWidth: '580px',
            fontWeight: 400
          }}>
            Piezas concebidas como obras maestras de la ingeniería mecánica. Ensambladas individualmente con oro de 18 quilates, cristal de zafiro irrayable y calibres certificados por los más altos estándares suizos.
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

        {/* Columna Derecha: Tarjeta 3D Luminosa del Reloj Hero */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          perspective: '1200px'
        }}>
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              borderRadius: '26px',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(208, 150, 131, 0.35)',
              padding: '24px',
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
              boxShadow: '0 25px 60px -15px rgba(45, 66, 98, 0.15), 0 0 35px -10px rgba(208, 150, 131, 0.3)',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
          >
            {/* Destello de luz especular interactivo */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle 350px at ${mousePos.x}% ${mousePos.y}%, rgba(208, 150, 131, 0.15) 0%, transparent 80%)`,
              pointerEvents: 'none',
              borderRadius: '26px',
              zIndex: 3
            }} />

            {/* Badge de Pieza Insignia */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{
                background: 'rgba(45, 66, 98, 0.08)',
                border: '1px solid rgba(45, 66, 98, 0.2)',
                color: 'var(--c-indigo)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 700
              }}>
                ✦ Pieza Insignia
              </span>
              <span style={{
                color: 'var(--c-taupe)',
                fontSize: '0.74rem',
                letterSpacing: '0.1em',
                fontWeight: 600
              }}>
                N° 01 / 25
              </span>
            </div>

            {/* Imagen del Reloj */}
            <div style={{
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              backgroundColor: '#f8f6f2',
              border: '1px solid rgba(115, 96, 91, 0.1)',
              marginBottom: '20px'
            }}>
              <img
                src="/watches/chronograph_gold.jpg"
                alt="Vetruvius Chronograph Tourbillon"
                style={{
                  width: '100%',
                  height: '380px',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>

            {/* Ficha técnica del reloj insignia */}
            <div>
              <div style={{
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                color: 'var(--c-blush)',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '4px'
              }}>
                Grand Complication
              </div>
              <h3 className="font-serif" style={{
                fontSize: '1.35rem',
                color: 'var(--c-deep-purple)',
                letterSpacing: '0.03em',
                marginBottom: '8px',
                fontWeight: 800
              }}>
                Vetruvius Tourbillon 18k
              </h3>
              <p style={{
                fontSize: '0.86rem',
                color: 'var(--c-taupe)',
                lineHeight: 1.5,
                marginBottom: '16px'
              }}>
                Caja en oro rosa, esfera verde esmeralda y escape de tourbillon volante a las 6h.
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '14px',
                borderTop: '1px solid rgba(115, 96, 91, 0.12)'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Precio de Lista
                  </span>
                  <span className="font-serif" style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: 'var(--c-indigo)'
                  }}>
                    S/ 14,850.00
                  </span>
                </div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#10b981',
                  fontSize: '0.76rem',
                  fontWeight: 700
                }}>
                  ● 3 Unidades en Bóveda
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
