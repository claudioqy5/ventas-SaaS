import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 1,
    image: '/hero/hero1.jpg',
    tag: 'TÁCTICO & RESISTENCIA',
    title: 'CASIO MUDMASTER & EDIFICE',
    desc: 'Ingeniería extrema diseñada para resistir ambientes exigentes con un acabado robusto de alta precisión.'
  },
  {
    id: 2,
    image: '/hero/hero2.jpg',
    tag: 'COLECCIÓN PRIVADA',
    title: 'CRONÓGRAFOS DE ALTA GAMA',
    desc: 'Piezas maestras que combinan la tradición suiza con acabados artesanales en titanio y acero inoxidable.'
  },
  {
    id: 3,
    image: '/hero/hero3.jpg',
    tag: 'EDICIONES LIMITADAS 2026',
    title: 'PRECISIÓN & ELEGANCIA AUDAL',
    desc: 'Diseño vanguardista creado para reflejar tu individualidad y destacar en cada segundo.'
  },
  {
    id: 4,
    image: '/hero/hero4.jpg',
    tag: 'HAUTE HORLOGERIE PERÚ',
    title: 'OBRAS MAESTRAS DEL TIEMPO',
    desc: 'Curaduría exclusiva con garantía oficial de 3 años y entrega asegurada en todo el Perú.'
  }
];

export default function Inicio({ onExplore, onOpenWhatsAppConcierge, onNavigateView }) {
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
      minHeight: '620px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0B0B0C',
      overflow: 'hidden',
      color: '#ffffff',
      borderBottomLeftRadius: '60px',
      borderBottomRightRadius: '60px'
    }}>
      <style>{`
        @keyframes heroPanSmooth {
          0% {
            transform: scale(1.06) translate3d(-18px, 0, 0);
          }
          100% {
            transform: scale(1.12) translate3d(18px, 0, 0);
          }
        }
        .hero-bg-pan {
          animation: heroPanSmooth 7s cubic-bezier(0.25, 1, 0.5, 1) infinite alternate;
        }
      `}</style>

      {/* CAROUSEL DE IMÁGENES DE FONDO CON PANNING Y SUAVE CROSSFADE */}
      {HERO_SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 1,
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
          >
            <div
              className={isActive ? 'hero-bg-pan' : ''}
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                willChange: 'transform'
              }}
            />
          </div>
        );
      })}

      {/* OVERLAY DE LUJO / GRADIENTE DE CONTRASTE */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(11, 11, 12, 0.45) 0%, rgba(11, 11, 12, 0.78) 75%, rgba(11, 11, 12, 0.92) 100%)',
        zIndex: 2
      }} />

      {/* CAPA DE GRADIENTE DIRECCIONAL */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(11, 11, 12, 0.85) 0%, rgba(11, 11, 12, 0.3) 50%, rgba(11, 11, 12, 0.85) 100%)',
        zIndex: 2
      }} />

      {/* MARCA DE AGUA TIPOGRÁFICA GIGANTE TOP - L'GANT */}
      <div style={{
        position: 'absolute',
        top: '28%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(5rem, 16vw, 20rem)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 900,
        color: 'rgba(255, 255, 255, 0.05)',
        whiteSpace: 'nowrap',
        zIndex: 3,
        letterSpacing: '-0.02em',
        lineHeight: 0.8,
        userSelect: 'none',
        pointerEvents: 'none'
      }}>
        L'GANT
      </div>

      {/* MARCA DE AGUA TIPOGRÁFICA GIGANTE BOTTOM - EN CADA SEGUNDO */}
      <div style={{
        position: 'absolute',
        top: '72%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(4rem, 12vw, 14rem)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 900,
        color: 'transparent',
        WebkitTextStroke: '2px rgba(255, 255, 255, 0.08)',
        whiteSpace: 'nowrap',
        zIndex: 3,
        letterSpacing: '-0.02em',
        lineHeight: 0.8,
        userSelect: 'none',
        pointerEvents: 'none'
      }}>
        EN CADA SEGUNDO
      </div>

      {/* CONTENIDO PRINCIPAL HERO */}
      <div style={{
        position: 'relative',
        zIndex: 4,
        maxWidth: '1280px',
        width: '100%',
        padding: '0 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%'
      }}>
        <div style={{ maxWidth: '640px' }}>
          
          {/* BADGE DORADO DE CATEGORÍA */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: 'var(--c-gold)',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            backdropFilter: 'blur(8px)'
          }}>
            <Sparkles size={14} color="var(--c-gold)" />
            {activeSlide.tag}
          </div>

          {/* TÍTULO PRINCIPAL DINÁMICO */}
          <h1 style={{
            fontFamily: '"Cinzel", serif',
            fontSize: 'clamp(2.2rem, 4.2vw, 3.8rem)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '0.03em',
            marginBottom: '18px',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}>
            {activeSlide.title}
          </h1>

          {/* DESCRIPCIÓN */}
          <p style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
            lineHeight: 1.65,
            marginBottom: '35px',
            fontWeight: 400,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)'
          }}>
            {activeSlide.desc}
          </p>

          {/* BOTONES DE ACCIÓN */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={onExplore}
              style={{
                padding: '16px 32px',
                backgroundColor: 'var(--c-gold)',
                color: '#0B0B0C',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--c-gold)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              Explorar Colección
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onOpenWhatsAppConcierge}
              style={{
                padding: '16px 28px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(37, 211, 102, 0.2)';
                e.currentTarget.style.borderColor = '#25D366';
                e.currentTarget.style.color = '#25D366';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              <MessageCircle size={18} />
              Concierge WhatsApp
            </button>
          </div>

        </div>
      </div>

      {/* FLECHAS FLOTANTES DE NAVEGACIÓN */}
      <button
        onClick={handlePrev}
        aria-label="Anterior"
        style={{
          position: 'absolute',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 5,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(11, 11, 12, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--c-gold)';
          e.currentTarget.style.color = '#000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(11, 11, 12, 0.4)';
          e.currentTarget.style.color = '#ffffff';
        }}
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={handleNext}
        aria-label="Siguiente"
        style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 5,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(11, 11, 12, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--c-gold)';
          e.currentTarget.style.color = '#000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(11, 11, 12, 0.4)';
          e.currentTarget.style.color = '#ffffff';
        }}
      >
        <ChevronRight size={22} />
      </button>

      {/* NAVEGACIÓN POR INDICADORES (DOTS & CONTADOR 01/04) */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: 'rgba(11, 11, 12, 0.5)',
        padding: '8px 20px',
        borderRadius: '999px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)'
      }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-gold)', fontFamily: '"Cinzel", serif' }}>
          0{currentIndex + 1}
        </span>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {HERO_SLIDES.map((_, idx) => {
            const isDotActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Diapositiva ${idx + 1}`}
                style={{
                  height: '6px',
                  width: isDotActive ? '28px' : '8px',
                  borderRadius: '999px',
                  backgroundColor: isDotActive ? 'var(--c-gold)' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  padding: 0
                }}
              />
            );
          })}
        </div>

        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', fontFamily: '"Cinzel", serif' }}>
          0{HERO_SLIDES.length}
        </span>
      </div>

    </section>
  );
}

