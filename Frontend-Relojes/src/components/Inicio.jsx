import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    image: '/hero/hero1.jpg',
    title: 'Reloj Casio ABL-100WE-1A',
    desc: 'Un clásico retro reimaginado. Elegancia digital atemporal en acero inoxidable.'
  },
  {
    id: 2,
    image: '/hero/hero2.jpg',
    title: 'Reloj Casio AE-1000W-4AVDF',
    desc: 'Deportivo y audaz. Diseño resistente con mapa mundial y correa de resina roja.'
  },
  {
    id: 3,
    image: '/hero/hero3.jpg',
    title: 'Reloj Casio Edifice Slim EFR-S567D-2AV',
    desc: 'Precisión ultradelgada. Esfera azul profundo con acabados de alta gama y cristal de zafiro.'
  },
  {
    id: 4,
    image: '/hero/hero4.jpg',
    title: 'Reloj Casio MDV-107D-1A3VDF',
    desc: 'El legendario diver. Bisel bicolor y resistencia superior para las mayores exigencias.'
  }
];

export default function Inicio({ onExplore, onOpenWhatsAppConcierge }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambio automático cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentIndex];

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

      {/* CARRUSEL DE RELOJES */}
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
        {/* Textos del Reloj y Navegación */}
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
          {/* FLECHAS FLOTANTES DE NAVEGACIÓN */}
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 15,
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: '#fff', border: '1px solid #eaeaea',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}
          >
            <ChevronLeft size={20} color="#000" />
          </button>
          
          <button
            onClick={handleNext}
            style={{
              position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 15,
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: '#fff', border: '1px solid #eaeaea',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}
          >
            <ChevronRight size={20} color="#000" />
          </button>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", "Cinzel", serif',
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 700,
            color: 'var(--c-obsidian)',
            marginBottom: '10px'
          }}>
            {activeSlide.title}
          </h2>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            color: 'var(--c-steel)',
            lineHeight: 1.6,
            marginBottom: '30px'
          }}>
            {activeSlide.desc}
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
              Explorar <ArrowRight size={16} />
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
              <MessageCircle size={16} /> Contactar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

