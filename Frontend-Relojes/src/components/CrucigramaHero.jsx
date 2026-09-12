"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

/*
  Matriz del Crucigrama: 7 Filas (0 a 6) x 8 Columnas (0 a 7)
  Frase: "ELEGANTE EN CADA SEGUNDO"

  Fila 0:                         [C] (col 4)               [S] (col 7)
  Fila 1: [E] [L] [E] [G]         [A] (col 4) [N] [T]       [E] (col 7)   -> "ELEGANTE" (horizontal)
  Fila 2:         [N] (col 2)     [D] (col 4)               [G] (col 7)   -> "EN" (vertical en col 2)
  Fila 3:                         [A] (col 4)               [U] (col 7)   -> "CADA" (vertical en col 4)
  Fila 4:                                                   [N] (col 7)   -> "SEGUNDO" (vertical en col 7)
  Fila 5:                                                   [D] (col 7)
  Fila 6:                                                   [O] (col 7)
*/

const GRID_DATA = [
  // Fila 0
  [
    null, null, null, null,
    { char: 'C', word: 'cada', wordIdx: 2, order: 0 },
    null, null,
    { char: 'S', word: 'segundo', wordIdx: 3, order: 0 }
  ],
  // Fila 1: ELEGANTE (horizontal)
  [
    { char: 'E', word: 'elegante', wordIdx: 0, order: 0 },
    { char: 'L', word: 'elegante', wordIdx: 0, order: 1 },
    { char: 'E', word: 'elegante', wordIdx: 0, order: 2, isIntersection: true, intersectWord: 'en' },
    { char: 'G', word: 'elegante', wordIdx: 0, order: 3 },
    { char: 'A', word: 'elegante', wordIdx: 0, order: 4, isIntersection: true, intersectWord: 'cada' },
    { char: 'N', word: 'elegante', wordIdx: 0, order: 5 },
    { char: 'T', word: 'elegante', wordIdx: 0, order: 6 },
    { char: 'E', word: 'elegante', wordIdx: 0, order: 7, isIntersection: true, intersectWord: 'segundo' }
  ],
  // Fila 2
  [
    null, null,
    { char: 'N', word: 'en', wordIdx: 1, order: 1 },
    null,
    { char: 'D', word: 'cada', wordIdx: 2, order: 2 },
    null, null,
    { char: 'G', word: 'segundo', wordIdx: 3, order: 2 }
  ],
  // Fila 3
  [
    null, null, null, null,
    { char: 'A', word: 'cada', wordIdx: 2, order: 3 },
    null, null,
    { char: 'U', word: 'segundo', wordIdx: 3, order: 3 }
  ],
  // Fila 4
  [
    null, null, null, null, null, null, null,
    { char: 'N', word: 'segundo', wordIdx: 3, order: 4 }
  ],
  // Fila 5
  [
    null, null, null, null, null, null, null,
    { char: 'D', word: 'segundo', wordIdx: 3, order: 5 }
  ],
  // Fila 6
  [
    null, null, null, null, null, null, null,
    { char: 'O', word: 'segundo', wordIdx: 3, order: 6 }
  ]
];

const WORDS_INFO = [
  { id: 'elegante', label: 'ELEGANTE', color: '#d4af37' },
  { id: 'en', label: 'EN', color: '#c5a059' },
  { id: 'cada', label: 'CADA', color: '#e5c158' },
  { id: 'segundo', label: 'SEGUNDO', color: '#d4af37' }
];

export default function CrucigramaHero() {
  // activeStep indica cuántas palabras ya se han revelado (0 a 4)
  const [activeStep, setActiveStep] = useState(0);
  // currentHighlight indica qué palabra está destacada en el momento (por animación o por hover)
  const [currentHighlight, setCurrentHighlight] = useState('elegante');
  const [isHovering, setIsHovering] = useState(null);
  const timerRef = useRef([]);

  const startSequence = () => {
    // Limpiar timers existentes
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];

    setActiveStep(0);
    setCurrentHighlight('elegante');

    // Palabra 1: ELEGANTE (inicia casi de inmediato a los 250ms)
    timerRef.current.push(setTimeout(() => {
      setActiveStep(1);
      setCurrentHighlight('elegante');
    }, 250));

    // Palabra 2: EN (a los 1500ms)
    timerRef.current.push(setTimeout(() => {
      setActiveStep(2);
      setCurrentHighlight('en');
    }, 1500));

    // Palabra 3: CADA (a los 2700ms)
    timerRef.current.push(setTimeout(() => {
      setActiveStep(3);
      setCurrentHighlight('cada');
    }, 2700));

    // Palabra 4: SEGUNDO (a los 3900ms)
    timerRef.current.push(setTimeout(() => {
      setActiveStep(4);
      setCurrentHighlight('segundo');
    }, 3900));

    // Finalización: Todas brillan juntas a los 5200ms
    timerRef.current.push(setTimeout(() => {
      setCurrentHighlight('all');
    }, 5200));
  };

  useEffect(() => {
    startSequence();
    return () => timerRef.current.forEach(clearTimeout);
  }, []);

  // Determinar si una celda debe mostrarse según activeStep
  const isCellVisible = (cell) => {
    if (!cell) return false;
    // Si la palabra pertenece a un paso que ya fue alcanzado
    if (cell.wordIdx < activeStep) return true;
    // Si es una intersección y su palabra de cruce ya fue alcanzada
    if (cell.isIntersection) {
      if (cell.intersectWord === 'en' && activeStep >= 2) return true;
      if (cell.intersectWord === 'cada' && activeStep >= 3) return true;
      if (cell.intersectWord === 'segundo' && activeStep >= 4) return true;
    }
    return false;
  };

  // Determinar si una celda está destacada
  const isCellHighlighted = (cell) => {
    if (!cell) return false;
    const targetWord = isHovering || currentHighlight;
    if (targetWord === 'all') return true;
    if (cell.word === targetWord) return true;
    if (cell.isIntersection && cell.intersectWord === targetWord) return true;
    return false;
  };

  return (
    <div className="crucigrama-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: '32px',
      position: 'relative'
    }}>

      {/* Frase accesible para lectores de pantalla y SEO */}
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

      {/* MATRIZ DE CRUCIGRAMA */}
      <div 
        role="img" 
        aria-label="Crucigrama tipográfico: ELEGANTE EN CADA SEGUNDO"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, clamp(34px, 4.3vw, 46px))',
          gridTemplateRows: 'repeat(7, clamp(34px, 4.3vw, 46px))',
          gap: 'clamp(4px, 0.6vw, 7px)',
          padding: '16px',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(250,248,244,0.4) 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(212, 175, 55, 0.22)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          position: 'relative'
        }}
      >
        {GRID_DATA.map((row, rIdx) => (
          <React.Fragment key={rIdx}>
            {row.map((cell, cIdx) => {
              if (!cell) {
                return (
                  <div 
                    key={`${rIdx}-${cIdx}`} 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      pointerEvents: 'none'
                    }} 
                  />
                );
              }

              const visible = isCellVisible(cell);
              const highlighted = visible && isCellHighlighted(cell);
              const isMainRow = rIdx === 1; // Fila principal "ELEGANTE"

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onMouseEnter={() => setIsHovering(cell.word)}
                  onMouseLeave={() => setIsHovering(null)}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    fontFamily: '"Bodoni Moda", "Cinzel", "Cormorant Garamond", serif',
                    fontSize: 'clamp(1.1rem, 1.6vw, 1.45rem)',
                    fontWeight: isMainRow ? 700 : 600,
                    letterSpacing: '0.02em',
                    userSelect: 'none',
                    cursor: visible ? 'pointer' : 'default',
                    opacity: visible ? 1 : 0.08,
                    transform: visible 
                      ? (highlighted ? 'scale(1.06)' : 'scale(1)') 
                      : 'scale(0.85) translateY(6px)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    
                    // Estilo visual del azulejo de lujo
                    background: !visible 
                      ? 'rgba(0, 0, 0, 0.02)' 
                      : highlighted
                        ? (cell.isIntersection 
                            ? 'linear-gradient(135deg, #1A1B1F 0%, #0B0B0C 100%)' 
                            : 'linear-gradient(135deg, #ffffff 0%, #fbf9f4 100%)')
                        : '#ffffff',

                    color: !visible 
                      ? 'transparent' 
                      : highlighted
                        ? (cell.isIntersection ? 'var(--c-gold)' : 'var(--c-obsidian)')
                        : 'var(--c-obsidian)',

                    border: !visible 
                      ? '1px dashed rgba(59, 60, 65, 0.12)' 
                      : highlighted
                        ? (cell.isIntersection 
                            ? '1.5px solid var(--c-gold)' 
                            : '1.5px solid rgba(212, 175, 55, 0.65)')
                        : '1px solid rgba(59, 60, 65, 0.15)',

                    boxShadow: visible && highlighted
                      ? (cell.isIntersection 
                          ? '0 6px 18px rgba(212, 175, 55, 0.35)' 
                          : '0 4px 14px rgba(212, 175, 55, 0.25)')
                      : (visible ? '0 2px 6px rgba(0,0,0,0.03)' : 'none'),

                    position: 'relative'
                  }}
                >
                  {cell.char}

                  {/* Detalle joyero: Punto dorado en letras de intersección */}
                  {cell.isIntersection && visible && (
                    <span style={{
                      position: 'absolute',
                      top: '3px',
                      right: '3px',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'var(--c-gold)',
                      boxShadow: '0 0 4px rgba(212, 175, 55, 0.8)'
                    }} />
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* BARRA DE LECTURA SECUENCIAL EN PALABRAS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '16px',
        flexWrap: 'wrap'
      }}>
        {WORDS_INFO.map((w, idx) => {
          const isRevealed = activeStep > idx;
          const isWordActive = (isHovering === w.id) || (currentHighlight === w.id) || (currentHighlight === 'all' && isRevealed);

          return (
            <button
              key={w.id}
              onClick={() => setCurrentHighlight(w.id)}
              onMouseEnter={() => setIsHovering(w.id)}
              onMouseLeave={() => setIsHovering(null)}
              style={{
                background: isWordActive ? 'var(--c-obsidian)' : '#ffffff',
                color: isWordActive ? 'var(--c-gold)' : (isRevealed ? 'var(--c-obsidian)' : 'var(--c-taupe)'),
                border: `1px solid ${isWordActive ? 'var(--c-gold)' : (isRevealed ? 'rgba(212, 175, 55, 0.4)' : 'rgba(59, 60, 65, 0.15)')}`,
                borderRadius: '20px',
                padding: '5px 14px',
                fontSize: '0.78rem',
                fontFamily: '"Cinzel", "Montserrat", sans-serif',
                fontWeight: 700,
                letterSpacing: '0.14em',
                cursor: 'pointer',
                opacity: isRevealed ? 1 : 0.4,
                transform: isWordActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isWordActive ? '0 4px 12px rgba(212, 175, 55, 0.25)' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title={`Resaltar palabra "${w.label}"`}
            >
              {isWordActive && <Sparkles size={11} color="var(--c-gold)" />}
              {w.label}
            </button>
          );
        })}

        {/* Botón para reiniciar la secuencia animada */}
        <button
          onClick={startSequence}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--c-taupe)',
            cursor: 'pointer',
            padding: '5px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s'
          }}
          title="Repetir animación de revelado"
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--c-gold)';
            e.currentTarget.style.transform = 'rotate(-45deg)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--c-taupe)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* CITA POÉTICA INFERIOR */}
      <div style={{
        marginTop: '12px',
        fontSize: '0.92rem',
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontStyle: 'italic',
        color: activeStep >= 4 ? 'var(--c-gold)' : 'var(--c-taupe)',
        letterSpacing: '0.04em',
        transition: 'color 0.4s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>“Elegante en cada segundo”</span>
      </div>

    </div>
  );
}
