import React, { useEffect, useState, useMemo } from 'react';

/**
 * WatchLoader — Pantalla de carga minimalista de alta precisión
 * Basada en el dial de un cronógrafo analógico con manecillas en rojo vibrante (#ff3b30),
 * marcas numéricas cada 5 unidades (05..60) y contrapeso circular sobre fondo oscuro/azulado glassmorphic.
 */
export default function WatchLoader({ isLoading = true, onFinish, minDuration = 2000 }) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Contador de calibración fluido (0% a 100%)
  useEffect(() => {
    let start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / minDuration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [minDuration]);

  // Transición suave de desvanecimiento (Fade Out)
  useEffect(() => {
    if (!isLoading && progress >= 100) {
      setFading(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onFinish) onFinish();
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress, onFinish]);

  // Cálculo paramétrico de 60 marcas de minutos y 12 números (05, 10, 15... 60)
  const { ticks, numbers } = useMemo(() => {
    const cx = 150;
    const cy = 150;
    const tickList = [];
    const numList = [];

    // 60 marcas perimetrales
    for (let i = 0; i < 60; i++) {
      const angleDeg = i * 6 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const isMajor = i % 5 === 0;
      const rOuter = 135;
      const rInner = isMajor ? 120 : 127;

      const x1 = cx + rOuter * Math.cos(angleRad);
      const y1 = cy + rOuter * Math.sin(angleRad);
      const x2 = cx + rInner * Math.cos(angleRad);
      const y2 = cy + rInner * Math.sin(angleRad);

      tickList.push({
        id: `t-${i}`,
        x1,
        y1,
        x2,
        y2,
        isMajor,
        strokeWidth: isMajor ? 2.4 : 1,
        strokeColor: isMajor ? '#ffffff' : 'rgba(255, 255, 255, 0.38)'
      });
    }

    // Números cada 5 unidades en tipografía de precisión
    for (let k = 1; k <= 12; k++) {
      const numVal = k === 12 ? '60' : String(k * 5).padStart(2, '0');
      const numAngleDeg = k * 30 - 90;
      const numAngleRad = (numAngleDeg * Math.PI) / 180;
      const rNum = 104;

      const x = cx + rNum * Math.cos(numAngleRad);
      const y = cy + rNum * Math.sin(numAngleRad);

      numList.push({
        id: `num-${k}`,
        val: numVal,
        x,
        y
      });
    }

    return { ticks: tickList, numbers: numList };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Fondo oscuro/azulado con gradiente radial y glassmorphism
        background: 'radial-gradient(circle at 50% 45%, #182844 0%, #0d1627 50%, #070c17 100%)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        opacity: fading ? 0 : 1,
        transform: fading ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fading ? 'none' : 'auto',
        userSelect: 'none'
      }}
    >
      {/* Halo de luz ambiental en el centro */}
      <div
        style={{
          position: 'absolute',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45, 66, 98, 0.45) 0%, rgba(208, 150, 131, 0.1) 45%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Dial Vectorial SVG del Cronógrafo (Tamaño optimizado a 340px) */}
      <div style={{ position: 'relative', width: '340px', height: '340px' }}>
        <svg
          viewBox="0 0 300 300"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            filter: 'drop-shadow(0 20px 50px rgba(0, 0, 0, 0.8))'
          }}
        >
          <defs>
            {/* Bisel del dial */}
            <linearGradient id="chronoBezel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.35)" />
              <stop offset="50%" stopColor="rgba(45, 66, 98, 0.6)" />
              <stop offset="100%" stopColor="rgba(208, 150, 131, 0.35)" />
            </linearGradient>

            {/* Resplandor neón rojo para las manecillas */}
            <filter id="handGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ff3b30" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Cuerpo principal del dial */}
          <circle cx="150" cy="150" r="144" fill="rgba(9, 15, 26, 0.94)" stroke="url(#chronoBezel)" strokeWidth="2" />
          <circle cx="150" cy="150" r="136" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <circle cx="150" cy="150" r="88" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" strokeDasharray="3 3" />

          {/* 60 Marcas de minutos y segundos */}
          {ticks.map((t) => (
            <line
              key={t.id}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.strokeColor}
              strokeWidth={t.strokeWidth}
              strokeLinecap="round"
            />
          ))}

          {/* Marcas numéricas cada 5 unidades (05, 10, 15... 60) */}
          {numbers.map((n) => (
            <text
              key={n.id}
              x={n.x}
              y={n.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="rgba(255, 255, 255, 0.92)"
              fontSize="11"
              fontFamily="'JetBrains Mono', 'Courier New', monospace"
              fontWeight="700"
              letterSpacing="0.04em"
            >
              {n.val}
            </text>
          ))}

          {/* Firmas de Manufactura */}
          <text
            x="150"
            y="74"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="'Cinzel', serif"
            fontSize="10"
            fontWeight="900"
            letterSpacing="0.22em"
          >
            A U R E L I A
          </text>
          <text
            x="150"
            y="85"
            textAnchor="middle"
            fill="#D09683"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontSize="6.5"
            fontWeight="800"
            letterSpacing="0.24em"
          >
            CHRONOMETRE SUIZO
          </text>

          {/* Sub-esfera decorativa de 60s a las 6 en punto */}
          <circle cx="150" cy="206" r="22" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" />
          <line x1="150" y1="188" x2="150" y2="192" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="150" y1="220" x2="150" y2="224" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="132" y1="206" x2="136" y2="206" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="164" y1="206" x2="168" y2="206" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <text
            x="150"
            y="208"
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.45)"
            fontSize="5.5"
            fontFamily="monospace"
            letterSpacing="0.1em"
          >
            60s
          </text>

          {/* ========================================================= */}
          {/* MANECILLAS ROJAS (#ff3b30) ANCLADAS EXACTAMENTE AL CENTRO */}
          {/* ========================================================= */}

          {/* Contenedor centrado en (150, 150) */}
          <g transform="translate(150, 150)">
            {/* 1. Manecilla Horaria Secundaria (Más corta) */}
            <g className="hour-hand-rotator">
              {/* Brazo horario desde (0,0) hacia las 12 (0, -70) */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-70"
                stroke="#ff3b30"
                strokeWidth="4.6"
                strokeLinecap="round"
                filter="url(#handGlow)"
              />
              {/* Flecha horaria */}
              <polygon points="-5,-68 5,-68 0,-82" fill="#ff3b30" filter="url(#handGlow)" />
            </g>

            {/* 2. Manecilla Principal Larga (Minutero / Segundero Chrono a alta velocidad) */}
            <g className="chrono-sweep-rotator">
              {/* Varilla principal larga que apunta a las 12 (0, -120) */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-120"
                stroke="#ff3b30"
                strokeWidth="2.8"
                strokeLinecap="round"
                filter="url(#handGlow)"
              />
              {/* Punta afilada del segundero */}
              <line
                x1="0"
                y1="-118"
                x2="0"
                y2="-133"
                stroke="#ff3b30"
                strokeWidth="1.6"
                strokeLinecap="round"
                filter="url(#handGlow)"
              />

              {/* Extensión del contrapeso hacia las 6 (0, 36) */}
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="36"
                stroke="#ff3b30"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#handGlow)"
              />

              {/* Pequeño contrapeso circular / aro emblemático de cronógrafo */}
              <circle
                cx="0"
                cy="25"
                r="7.5"
                fill="#070c17"
                stroke="#ff3b30"
                strokeWidth="2.6"
                filter="url(#handGlow)"
              />
            </g>

            {/* 3. Punto Central / Pivote bien definido */}
            <circle cx="0" cy="0" r="9" fill="#1b283d" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="6" fill="#ff3b30" />
            <circle cx="0" cy="0" r="2.4" fill="#ffffff" />
          </g>
        </svg>
      </div>

      {/* Barra de estado y progreso de calibración */}
      <div
        style={{
          marginTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.86rem',
            letterSpacing: '0.24em',
            color: '#ffffff',
            fontWeight: 800,
            textTransform: 'uppercase'
          }}
        >
          Sincronizando Manufactura
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem',
            color: '#D09683',
            letterSpacing: '0.08em'
          }}
        >
          <span>CALIBRACIÓN SUIZA COSC</span>
          <span>•</span>
          <span style={{ fontWeight: 800, minWidth: '40px', color: '#ffffff' }}>{progress}%</span>
        </div>

        {/* Barra de progreso fluida con resplandor rojo */}
        <div
          style={{
            width: '200px',
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginTop: '8px'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#ff3b30',
              boxShadow: '0 0 12px #ff3b30',
              transition: 'width 0.12s ease-out'
            }}
          />
        </div>
      </div>

      {/* Reglas de Animación CSS sincronizadas por GPU */}
      <style>{`
        .chrono-sweep-rotator {
          transform-origin: 0 0;
          animation: chronoRotateFast 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }

        .hour-hand-rotator {
          transform-origin: 0 0;
          animation: chronoRotateSlow 4.8s linear infinite;
          will-change: transform;
        }

        @keyframes chronoRotateFast {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes chronoRotateSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
