"use client";
import React, { useState, useEffect, useRef } from 'react';

/*
  Matriz Tipográfica Minimalista (Estilo Editorial Suizo / Eindhoven Design)
  7 Filas x 8 Columnas
  Frase: "ELEGANTE EN CADA SEGUNDO"
  Sin cajas, sin bordes, sin tarjetas. Pura tipografía gigante, minimalista y de alta gama.

  Fila 0:                         [C] (col 4)               [S] (col 7)
  Fila 1: [E] [L] [E] [G]         [A] (col 4) [N] [T]       [E] (col 7)   -> "ELEGANTE"
  Fila 2:         [N] (col 2)     [D] (col 4)               [G] (col 7)   -> "EN"
  Fila 3:                         [A] (col 4)               [U] (col 7)   -> "CADA"
  Fila 4:                                                   [N] (col 7)   -> "SEGUNDO"
  Fila 5:                                                   [D] (col 7)
  Fila 6:                                                   [O] (col 7)
*/

const GRID_LAYOUT = [
  // Fila 0
  [
    null, null, null, null,
    { char: 'C', word: 'cada', stage: 3, delay: 0 },
    null, null,
    { char: 'S', word: 'segundo', stage: 4, delay: 0 }
  ],
  // Fila 1: ELEGANTE
  [
    { char: 'E', word: 'elegante', stage: 1, delay: 0 },
    { char: 'L', word: 'elegante', stage: 1, delay: 50 },
    { char: 'E', word: 'elegante', stage: 1, delay: 100, isIntersection: true, intersectWord: 'en' },
    { char: 'G', word: 'elegante', stage: 1, delay: 150 },
    { char: 'A', word: 'elegante', stage: 1, delay: 200, isIntersection: true, intersectWord: 'cada' },
    { char: 'N', word: 'elegante', stage: 1, delay: 250 },
    { char: 'T', word: 'elegante', stage: 1, delay: 300 },
    { char: 'E', word: 'elegante', stage: 1, delay: 350, isIntersection: true, intersectWord: 'segundo' }
  ],
  // Fila 2
  [
    null, null,
    { char: 'N', word: 'en', stage: 2, delay: 70 },
    null,
    { char: 'D', word: 'cada', stage: 3, delay: 70 },
    null, null,
    { char: 'G', word: 'segundo', stage: 4, delay: 70 }
  ],
  // Fila 3
  [
    null, null, null, null,
    { char: 'A', word: 'cada', stage: 3, delay: 140 },
    null, null,
    { char: 'U', word: 'segundo', stage: 4, delay: 140 }
  ],
  // Fila 4
  [
    null, null, null, null, null, null, null,
    { char: 'N', word: 'segundo', stage: 4, delay: 210 }
  ],
  // Fila 5
  [
    null, null, null, null, null, null, null,
    { char: 'D', word: 'segundo', stage: 4, delay: 280 }
  ],
  // Fila 6
  [
    null, null, null, null, null, null, null,
    { char: 'O', word: 'segundo', stage: 4, delay: 350 }
  ]
];

export default function CrucigramaHero() {
  const [currentStage, setCurrentStage] = useState(0);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [splitOffset, setSplitOffset] = useState('100%');
  const timersRef = useRef([]);
  const containerRef = useRef(null);

  const runAnimation = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setCurrentStage(0);

    // 1. ELEGANTE
    timersRef.current.push(setTimeout(() => setCurrentStage(1), 180));

    // 2. EN
    timersRef.current.push(setTimeout(() => setCurrentStage(2), 1200));

    // 3. CADA
    timersRef.current.push(setTimeout(() => setCurrentStage(3), 2100));

    // 4. SEGUNDO
    timersRef.current.push(setTimeout(() => setCurrentStage(4), 3000));
  };

  useEffect(() => {
    runAnimation();
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  // Cálculo dinámico del corte exacto donde inicia la imagen del reloj (al 50% de la pantalla)
  useEffect(() => {
    const updateOffset = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth <= 991) {
        setSplitOffset('100%');
        return;
      }
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const boundary = window.innerWidth * 0.50; // La imagen del reloj ocupa el 50% derecho
        const offset = Math.max(0, boundary - rect.left);
        setSplitOffset(`${offset}px`);
      }
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    const t1 = setTimeout(updateOffset, 50);
    const t2 = setTimeout(updateOffset, 300);

    return () => {
      window.removeEventListener('resize', updateOffset);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const isLetterVisible = (cell) => {
    if (!cell) return false;
    if (cell.stage <= currentStage) return true;
    if (cell.isIntersection) {
      if (cell.intersectWord === 'en' && currentStage >= 2) return true;
      if (cell.intersectWord === 'cada' && currentStage >= 3) return true;
      if (cell.intersectWord === 'segundo' && currentStage >= 4) return true;
    }
    return false;
  };

  const isLetterHovered = (cell) => {
    if (!cell) return false;
    if (!hoveredWord) return false;
    return cell.word === hoveredWord || (cell.isIntersection && cell.intersectWord === hoveredWord);
  };

  const renderGrid = (theme) => {
    const isDark = theme === 'dark'; // Dark = sobre la imagen oscura (letras blancas con contraste)
    const textColor = isDark ? '#ffffff' : '#09090b';
    const hoverColor = isDark ? '#fbf4dc' : 'var(--c-gold)';
    const textShadow = isDark 
      ? '0 2px 24px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.95)' 
      : 'none';

    return (
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gridTemplateRows: 'repeat(7, clamp(48px, 6.2vw, 84px))',
          gap: 0,
          width: '100%',
          maxWidth: '820px',
          margin: 0,
          padding: 0,
          background: 'transparent',
          border: 'none',
          lineHeight: 0.88,
          justifyContent: 'stretch'
        }}
      >
        {GRID_LAYOUT.map((row, rIdx) => (
          <React.Fragment key={rIdx}>
            {row.map((cell, cIdx) => {
              if (!cell) {
                return <div key={`${rIdx}-${cIdx}`} style={{ width: '100%', height: '100%' }} />;
              }

              const visible = isLetterVisible(cell);
              const hovered = isLetterHovered(cell);
              const shouldDim = hoveredWord && !hovered;

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onMouseEnter={() => setHoveredWord(cell.word)}
                  onMouseLeave={() => setHoveredWord(null)}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"Montserrat", "Plus Jakarta Sans", -apple-system, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(2.4rem, 5.6vw, 5.8rem)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.04em',
                    color: hovered ? hoverColor : textColor,
                    textShadow: textShadow,
                    opacity: !visible ? 0 : shouldDim ? 0.2 : 1,
                    transform: !visible 
                      ? 'translateY(18px) scale(0.92)' 
                      : (hovered ? 'scale(1.06)' : 'translateY(0) scale(1)'),
                    transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), color 0.25s',
                    cursor: 'default',
                    pointerEvents: visible ? 'auto' : 'none'
                  }}
                >
                  {cell.char}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      style={{
        marginBottom: '18px',
        userSelect: 'none',
        position: 'relative',
        width: '100%',
        maxWidth: '820px'
      }}
    >
      {/* Título semántico SEO accesible */}
      <h2 style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0
      }}>
        Elegante en cada segundo
      </h2>

      {/* COMPOSICIÓN TIPOGRÁFICA GIGANTE CON EFECTO SPLIT-COLOR (DOS TONOS) */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '820px', margin: '0 0 18px 0' }}>
        {/* CAPA 1: Letras Negras (Fondo Claro a la Izquierda) */}
        <div style={{
          width: '100%',
          clipPath: splitOffset === '100%' ? 'none' : `inset(0 calc(100% - ${splitOffset}) 0 0)`,
          WebkitClipPath: splitOffset === '100%' ? 'none' : `inset(0 calc(100% - ${splitOffset}) 0 0)`
        }}>
          {renderGrid('light')}
        </div>

        {/* CAPA 2: Letras Blancas (Sobre el Reloj a partir del 50% de la pantalla) */}
        {splitOffset !== '100%' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            clipPath: `inset(0 0 0 ${splitOffset})`,
            WebkitClipPath: `inset(0 0 0 ${splitOffset})`
          }}>
            {renderGrid('dark')}
          </div>
        )}
      </div>

      {/* Subtítulo editorial estilo revista de alta gama */}
      <div 
        onClick={runAnimation}
        title="Clic para reiniciar animación"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginTop: '6px',
          cursor: 'pointer',
          opacity: currentStage >= 4 ? 1 : 0.65,
          transition: 'opacity 0.5s ease',
          flexWrap: 'wrap'
        }}
      >
        <span style={{
          fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
          fontSize: 'clamp(1rem, 1.25vw, 1.22rem)',
          fontWeight: 500,
          color: '#3d3f44',
          letterSpacing: '-0.02em'
        }}>
          Elegante en cada segundo.
        </span>
        <span style={{ width: '36px', height: '1px', background: 'rgba(59, 60, 65, 0.25)' }} />
        <span style={{
          fontFamily: '"Cinzel", serif',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.22em',
          color: 'var(--c-gold)',
          textTransform: 'uppercase'
        }}>
          Haute Horlogerie
        </span>
      </div>
    </div>
  );
}
