"use client";
import React, { useState, useEffect, useRef } from 'react';

/*
  Matriz Tipográfica Minimalista (Estilo Editorial Suizo / Eindhoven Design)
  7 Filas x 8 Columnas
  Frase: "ELEGANTE EN CADA SEGUNDO"
  Sin cajas, sin bordes, sin tarjetas. Pura tipografía gigante y minimalista.

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
    { char: 'L', word: 'elegante', stage: 1, delay: 60 },
    { char: 'E', word: 'elegante', stage: 1, delay: 120, isIntersection: true, intersectWord: 'en' },
    { char: 'G', word: 'elegante', stage: 1, delay: 180 },
    { char: 'A', word: 'elegante', stage: 1, delay: 240, isIntersection: true, intersectWord: 'cada' },
    { char: 'N', word: 'elegante', stage: 1, delay: 300 },
    { char: 'T', word: 'elegante', stage: 1, delay: 360 },
    { char: 'E', word: 'elegante', stage: 1, delay: 420, isIntersection: true, intersectWord: 'segundo' }
  ],
  // Fila 2
  [
    null, null,
    { char: 'N', word: 'en', stage: 2, delay: 80 },
    null,
    { char: 'D', word: 'cada', stage: 3, delay: 80 },
    null, null,
    { char: 'G', word: 'segundo', stage: 4, delay: 80 }
  ],
  // Fila 3
  [
    null, null, null, null,
    { char: 'A', word: 'cada', stage: 3, delay: 160 },
    null, null,
    { char: 'U', word: 'segundo', stage: 4, delay: 160 }
  ],
  // Fila 4
  [
    null, null, null, null, null, null, null,
    { char: 'N', word: 'segundo', stage: 4, delay: 240 }
  ],
  // Fila 5
  [
    null, null, null, null, null, null, null,
    { char: 'D', word: 'segundo', stage: 4, delay: 320 }
  ],
  // Fila 6
  [
    null, null, null, null, null, null, null,
    { char: 'O', word: 'segundo', stage: 4, delay: 400 }
  ]
];

export default function CrucigramaHero() {
  // Etapa de animación secuencial (0 a 4)
  const [currentStage, setCurrentStage] = useState(0);
  // Palabra resaltada por hover interactivo
  const [hoveredWord, setHoveredWord] = useState(null);
  const timersRef = useRef([]);

  const runAnimation = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setCurrentStage(0);

    // 1. ELEGANTE (a los 200ms)
    timersRef.current.push(setTimeout(() => setCurrentStage(1), 200));

    // 2. EN (a los 1300ms)
    timersRef.current.push(setTimeout(() => setCurrentStage(2), 1300));

    // 3. CADA (a los 2300ms)
    timersRef.current.push(setTimeout(() => setCurrentStage(3), 2300));

    // 4. SEGUNDO (a los 3300ms)
    timersRef.current.push(setTimeout(() => setCurrentStage(4), 3300));
  };

  useEffect(() => {
    runAnimation();
    return () => timersRef.current.forEach(clearTimeout);
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

  // Resaltado al pasar el mouse por encima
  const isLetterHovered = (cell) => {
    if (!cell) return false;
    if (!hoveredWord) return false;
    return cell.word === hoveredWord || (cell.isIntersection && cell.intersectWord === hoveredWord);
  };

  return (
    <div style={{
      marginBottom: '28px',
      userSelect: 'none',
      position: 'relative'
    }}>
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

      {/* COMPOSICIÓN TIPOGRÁFICA GIGANTE (SIN BORDES, SIN CAJAS, ESTILO EINDHOVEN) */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, clamp(34px, 4.4vw, 52px))',
          gridTemplateRows: 'repeat(7, clamp(38px, 4.8vw, 56px))',
          gap: 0,
          margin: '0 0 16px 0',
          padding: 0,
          background: 'transparent',
          border: 'none',
          lineHeight: 1
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
                    fontSize: 'clamp(2.5rem, 4.5vw, 4.2rem)',
                    lineHeight: 0.9,
                    letterSpacing: '-0.04em',
                    color: hovered ? 'var(--c-gold)' : '#0b0b0c',
                    opacity: !visible ? 0 : shouldDim ? 0.25 : 1,
                    transform: !visible 
                      ? 'translateY(14px) scale(0.92)' 
                      : (hovered ? 'scale(1.08)' : 'translateY(0) scale(1)'),
                    transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s',
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

      {/* Subtítulo editorial minimalista estilo Eindhoven */}
      <div 
        onClick={runAnimation}
        title="Clic para reiniciar animación"
        style={{
          fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
          fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
          fontWeight: 400,
          color: '#55575e',
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          opacity: currentStage >= 4 ? 1 : 0.6,
          transition: 'opacity 0.5s ease'
        }}
      >
        <span>Elegante en cada segundo</span>
        <span style={{ fontSize: '0.75rem', color: '#999', opacity: 0.7 }}>•</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--c-gold)', fontWeight: 600, letterSpacing: '0.04em' }}>L'GANT</span>
      </div>
    </div>
  );
}
