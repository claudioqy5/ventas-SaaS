"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';

import imgEdifice from '../assets/hero/coleccion edifice.jpg';
import imgDorados from '../assets/hero/dorados.jpg';
import imgMujeres from '../assets/hero/mujeres.jpg';

const CAROUSEL_DATA = [
  {
    img: imgEdifice,
    title: 'Colección Edifice',
    desc: 'Velocidad e inteligencia en cada milímetro de titanio.',
    actionUrl: '/buscar?q=edifice',
    actionText: 'Descubrir Edifice'
  },
  {
    img: imgDorados,
    title: 'Elegancia Dorada',
    desc: 'Un brillo inconfundible que resalta tu distinción en cada instante.',
    actionUrl: '/buscar?q=dorado',
    actionText: 'Ver Colección'
  },
  {
    img: imgMujeres,
    title: 'Alta Relojería Femenina',
    desc: 'La perfecta armonía entre delicadeza y precisión absoluta.',
    actionUrl: '/categoria/mujer',
    actionText: 'Explorar Piezas'
  }
];

export default function Inicio({ onExplore, onOpenWhatsAppConcierge }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_DATA.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="hero-section" style={{
      position: 'relative',
      height: 'calc(98vh - 85px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
      overflow: 'hidden',
      color: '#fff',
      borderBottomLeftRadius: '100px',
      borderBottomRightRadius: '100px'
    }}>
      {/* Imágenes del Carrusel */}
      {CAROUSEL_DATA.map((item, index) => (
        <div 
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: 1
          }}
        >
          <img 
            src={item.img.src || item.img} 
            alt={item.title} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {/* Overlay gradiente oscuro para que resalten los textos y las letras de fondo */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)'
          }}></div>
        </div>
      ))}

      {/* Giant Background Text Top - L'GANTE */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(5rem, 16vw, 22rem)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 900,
        color: 'rgba(255, 255, 255, 0.06)',
        whiteSpace: 'nowrap',
        zIndex: 2,
        letterSpacing: '-0.02em',
        lineHeight: 0.8,
        pointerEvents: 'none'
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
        WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)',
        whiteSpace: 'nowrap',
        zIndex: 2,
        letterSpacing: '-0.02em',
        lineHeight: 0.8,
        pointerEvents: 'none'
      }}>
        EN CADA SEGUNDO
      </div>

      {/* Textos Dinámicos del Carrusel */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        {CAROUSEL_DATA.map((item, index) => (
          <div
            key={`text-${index}`}
            style={{
              position: 'absolute',
              textAlign: 'center',
              opacity: index === currentIndex ? 1 : 0,
              transform: index === currentIndex ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              width: '100%',
              maxWidth: '800px',
              padding: '0 20px'
            }}
          >
            <h2 style={{
              fontFamily: '"Cormorant Garamond", "Cinzel", serif',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 700,
              color: '#fff',
              textShadow: '0 10px 30px rgba(0,0,0,0.8)',
              marginBottom: '1rem',
              letterSpacing: '0.02em'
            }}>
              {item.title}
            </h2>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              color: '#f5f5f7',
              textShadow: '0 4px 10px rgba(0,0,0,0.8)',
              letterSpacing: '0.05em',
              fontWeight: 300,
              marginBottom: '20px'
            }}>
              {item.desc}
            </p>
            <a 
              href={item.actionUrl}
              style={{
                display: 'inline-block',
                marginTop: '15px',
                padding: '12px 36px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '0.8rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                pointerEvents: 'auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                e.target.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
                e.target.style.color = '#fff';
              }}
            >
              {item.actionText}
            </a>
          </div>
        ))}
      </div>

      {/* Pagination Dots (Indicadores) */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 20
      }}>
        {CAROUSEL_DATA.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: index === currentIndex ? '#fff' : 'rgba(255, 255, 255, 0.3)',
              border: index === currentIndex ? '2px solid rgba(255, 255, 255, 0.8)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
              outline: 'none',
              boxShadow: index === currentIndex ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none',
              transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)'
            }}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

