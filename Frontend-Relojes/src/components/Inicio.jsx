import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function Inicio({ onExplore, onOpenWhatsAppConcierge }) {
  return (
    <section className="hero-section" style={{
      position: 'relative',
      height: 'calc(98vh - 85px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      overflow: 'hidden',
      color: '#000',
      borderBottomLeftRadius: '100px',
      borderBottomRightRadius: '100px'
    }}>
      {/* Giant Background Text Top - L'GANTE */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(5rem, 16vw, 22rem)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 900,
        color: 'rgba(0, 0, 0, 0.03)',
        whiteSpace: 'nowrap',
        zIndex: 1,
        letterSpacing: '-0.02em',
        lineHeight: 0.8
      }}>
        L'GANT
      </div>

      {/* Giant Background Text Bottom - EN CADA SEGUNDO */}
      <div style={{
        position: 'absolute',
        top: '75%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(4rem, 12vw, 15rem)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 900,
        color: 'transparent',
        WebkitTextStroke: '2px rgba(0, 0, 0, 0.05)',
        whiteSpace: 'nowrap',
        zIndex: 1,
        letterSpacing: '-0.02em',
        lineHeight: 0.8
      }}>
        EN CADA SEGUNDO
      </div>

      {/* STATIC HERO CONTENT */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Textos del Reloj y Botones */}
        <div style={{
          position: 'relative',
          textAlign: 'center',
          maxWidth: '800px',
          width: '100%',
          padding: '40px 60px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", "Cinzel", serif',
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 700,
            color: 'var(--c-obsidian)',
            marginBottom: '10px'
          }}>
            Boutique de Alta Relojería
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'var(--c-steel)',
            lineHeight: 1.6,
            marginBottom: '30px'
          }}>
            Descubre nuestra colección exclusiva. Precisión, elegancia y diseño en cada segundo de tu vida.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={onExplore}
              style={{
                padding: '14px 28px', backgroundColor: '#000', color: '#fff',
                border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease'
              }}
            >
              Explorar Colección <ArrowRight size={16} />
            </button>
            <button
              onClick={onOpenWhatsAppConcierge}
              style={{
                padding: '14px 28px', backgroundColor: '#fff', color: '#000',
                border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600,
                letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease'
              }}
            >
              <MessageCircle size={16} /> Asesoría Personalizada
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

