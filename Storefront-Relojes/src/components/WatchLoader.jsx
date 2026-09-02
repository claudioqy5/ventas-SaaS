import React, { useEffect, useState, useMemo } from 'react';

/**
 * WatchLoader — Pantalla de carga minimalista de alta precisión
 * Basada en el dial de un cronógrafo analógico con manecillas en rojo vibrante (#ff3b30),
 * marcas numéricas cada 5 unidades (05..60) y contrapeso circular sobre fondo oscuro/azulado glassmorphic.
 */
export default function WatchLoader({ isLoading = true, onFinish, minDuration = 2200 }) {
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
      const rOuter = 136;
      const rInner = isMajor ? 120 : 128;

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
        strokeWidth: isMajor ? 2.6 : 1,
        strokeColor: isMajor ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'
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
        transform: fading ? 'scale(1.04)' : 'scale(1)',
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

      {/* Dial Vectorial SVG del Cronógrafo */}
      <div style={{ position: 'relative', width: '340px', height: '340px' }}>
        <svg
          viewBox="0 0 300 300"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            filter: 'drop-shadow(0 20px 50px rgba(0, 0, 0, 0.85))'
          }}
        >
          <defs>
            <linearGradient id="chronoBezel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.35)" />
              <stop offset="50%" stopColor="rgba(45, 66, 98, 0.6)" />
              <stop offset="100%" stopColor="rgba(208, 150, 131, 0.35)" />
            </linearGradient>
          </defs>

          {/* Cuerpo principal del dial */}
          <circle cx="150" cy="150" r="144" fill="rgba(9, 15, 26, 0.96)" stroke="url(#chronoBezel)" strokeWidth="2.5" />
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
              fill="rgba(255, 255, 255, 0.95)"
              fontSize="11.5"
              fontFamily="'JetBrains Mono', 'Courier New', monospace"
              fontWeight="700"
              letterSpacing="0.04em"
            >
              {n.val}
            </text>
          ))}

          {/* Firmas de Manufactura en estilo Geomanist (NineStyles: bold + light) */}
          <text
            x="150"
            y="74"
            textAnchor="middle"
            fill="#ffffff"
            fontFamily="'Outfit', sans-serif"
            fontSize="12.5"
            letterSpacing="-0.02em"
          >
            <tspan fontWeight="900">tempo</tspan>
            <tspan fontWeight="200" dx="2">preciso</tspan>
          </text>
          <text
            x="150"
            y="85"
            textAnchor="middle"
            fill="#D09683"
            fontFamily="'Outfit', sans-serif"
            fontSize="6.5"
            fontWeight="700"
            letterSpacing="0.22em"
          >
            CHRONOMÈTRE SUIZO
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
          {/* MANECILLAS ROJAS VIBRANTES (#ff3b30) — 100% VISIBLES      */}
          {/* Geometría con polígonos sólidos (sin errores de filtro 0) */}
          {/* Rotación nativa y CSS centrada exactamente en (150, 150)  */}
          {/* ========================================================= */}

          {/* 1. Manecilla Horaria Secundaria (Más corta, gira a ritmo horario) */}
          <g className="chrono-hour-hand">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 150 150"
              to="360 150 150"
              dur="4.8s"
              repeatCount="indefinite"
            />
            {/* Cuerpo de la aguja horaria con punta de flecha */}
            <polygon
              points="147.6,150 147.6,82 145,80 150,65 155,80 152.4,82 152.4,150"
              fill="#ff3b30"
            />
          </g>

          {/* 2. Manecilla Principal Larga (Minutero / Segundero Chrono a alta velocidad) */}
          <g className="chrono-fast-hand">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 150 150"
              to="360 150 150"
              dur="1.2s"
              repeatCount="indefinite"
            />
            {/* Varilla larga principal que apunta a las 12 (hasta y = 18) */}
            <polygon
              points="148.4,150 148.8,35 150,18 151.2,35 151.6,150"
              fill="#ff3b30"
            />
            {/* Extensión del contrapeso hacia el lado opuesto (las 6, hasta y = 188) */}
            <polygon
              points="148.5,150 148.5,188 151.5,188 151.5,150"
              fill="#ff3b30"
            />
            {/* Pequeño contrapeso circular / aro emblemático de cronógrafo */}
            <circle
              cx="150"
              cy="174"
              r="8"
              fill="#070c17"
              stroke="#ff3b30"
              strokeWidth="2.8"
            />
          </g>

          {/* 3. Punto Central / Pivote bien definido */}
          <circle cx="150" cy="150" r="9" fill="#182844" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.5" />
          <circle cx="150" cy="150" r="6" fill="#ff3b30" />
          <circle cx="150" cy="150" r="2.2" fill="#ffffff" />
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
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.96rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'baseline',
            gap: '2px'
          }}
        >
          <span style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>tempo</span>
          <span style={{ fontWeight: 200, letterSpacing: '-0.01em', marginLeft: '1px' }}>preciso</span>
          <span style={{ fontSize: '0.74rem', color: '#D09683', letterSpacing: '0.18em', marginLeft: '8px', textTransform: 'uppercase', fontWeight: 700 }}>• CALIBRANDO</span>
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

      {/* Reglas de Animación CSS sincronizadas */}
      <style>{`
        .chrono-fast-hand {
          transform-box: view-box;
          transform-origin: 150px 150px;
          animation: rotateChronoFast 1.2s linear infinite;
        }

        .chrono-hour-hand {
          transform-box: view-box;
          transform-origin: 150px 150px;
          animation: rotateChronoHour 4.8s linear infinite;
        }

        @keyframes rotateChronoFast {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateChronoHour {
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
