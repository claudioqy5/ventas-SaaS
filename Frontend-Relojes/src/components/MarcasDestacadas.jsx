import React from 'react';

export default function MarcasDestacadas() {
  const marcas = [
    {
      name: 'ROLEX',
      logo: (
        <svg viewBox="0 0 160 45" width="130" height="36" xmlns="http://www.w3.org/2000/svg">
          <path d="M70 12 L73 20 L80 14 L87 20 L90 12 L85 24 L75 24 Z" fill="#006039" />
          <circle cx="70" cy="11" r="1.5" fill="#006039" />
          <circle cx="80" cy="13" r="1.5" fill="#006039" />
          <circle cx="90" cy="11" r="1.5" fill="#006039" />
          <text x="50%" y="38" dominantBaseline="middle" textAnchor="middle" fill="#006039" fontFamily="'Georgia', serif" fontSize="20" fontWeight="bold" letterSpacing="4px">ROLEX</text>
        </svg>
      )
    },
    {
      name: 'OMEGA',
      logo: (
        <svg viewBox="0 0 160 45" width="130" height="36" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="18" dominantBaseline="middle" textAnchor="middle" fill="#c41230" fontFamily="'Times New Roman', serif" fontSize="22" fontWeight="bold">Ω</text>
          <text x="50%" y="38" dominantBaseline="middle" textAnchor="middle" fill="#000000" fontFamily="'Helvetica Neue', sans-serif" fontSize="18" fontWeight="bold" letterSpacing="3px">OMEGA</text>
        </svg>
      )
    },
    {
      name: 'G-SHOCK',
      logo: (
        <svg viewBox="0 0 150 40" width="130" height="34" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="22" dominantBaseline="middle" textAnchor="middle" fill="#000" fontFamily="'Arial Black', 'Impact', sans-serif" fontSize="28" fontWeight="900" letterSpacing="-0.5px" transform="scale(1, 0.9)">G-SHOCK</text>
          <rect x="15" y="32" width="120" height="4" fill="#e3000f" />
        </svg>
      )
    },
    {
      name: 'TAG HEUER',
      logo: (
        <svg viewBox="0 0 160 45" width="130" height="36" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="6" width="110" height="15" fill="#000" />
          <text x="80" y="17" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontFamily="'Arial Black', sans-serif" fontSize="11" fontWeight="900" letterSpacing="1px">TAG HEUER</text>
          <path d="M25 21 L80 38 L135 21 Z" fill="#e3000f" />
          <text x="80" y="29" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontFamily="'Arial Black', sans-serif" fontSize="9" fontWeight="900">SWISS 1860</text>
        </svg>
      )
    },
    {
      name: 'CASIO',
      logo: (
        <svg viewBox="0 0 120 40" width="110" height="36" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="24" dominantBaseline="middle" textAnchor="middle" fill="#00378b" fontFamily="'Arial Black', 'Helvetica', sans-serif" fontSize="28" fontWeight="900" transform="scale(1.1, 0.85)">CASIO</text>
        </svg>
      )
    },
    {
      name: 'CARTIER',
      logo: (
        <svg viewBox="0 0 160 45" width="130" height="36" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="26" dominantBaseline="middle" textAnchor="middle" fill="#000" fontFamily="'Baskerville', 'Georgia', serif" fontSize="26" fontStyle="italic" letterSpacing="2px">Cartier</text>
        </svg>
      )
    },
    {
      name: 'SEIKO',
      logo: (
        <svg viewBox="0 0 120 40" width="110" height="36" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="24" dominantBaseline="middle" textAnchor="middle" fill="#002f6c" fontFamily="'Times New Roman', 'Georgia', serif" fontSize="30" fontWeight="bold" letterSpacing="1px" transform="scale(1.05, 0.95)">SEIKO</text>
        </svg>
      )
    },
    {
      name: 'PATEK PHILIPPE',
      logo: (
        <svg viewBox="0 0 180 45" width="150" height="36" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="20" dominantBaseline="middle" textAnchor="middle" fill="#000" fontFamily="'Times New Roman', serif" fontSize="16" fontWeight="bold" letterSpacing="2px">PATEK PHILIPPE</text>
          <text x="50%" y="35" dominantBaseline="middle" textAnchor="middle" fill="#666" fontFamily="'Times New Roman', serif" fontSize="11" letterSpacing="3px">GENEVE</text>
        </svg>
      )
    },
    {
      name: 'CITIZEN',
      logo: (
        <svg viewBox="0 0 220 50" width="180" height="40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="18" fill="#ee2737" />
          <path d="M25 15 L25 25 L32 30" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="55" y="33" fill="#000" fontFamily="'Georgia', 'Times New Roman', serif" fontSize="34" fontWeight="bold" letterSpacing="1px">CITIZEN</text>
        </svg>
      )
    },
    {
      name: 'LONGINES',
      logo: (
        <svg viewBox="0 0 160 45" width="130" height="36" xmlns="http://www.w3.org/2000/svg">
          <path d="M68 12 L92 12 M70 12 L70 20 L90 20 L90 12 M65 16 L95 16" stroke="#001e4e" strokeWidth="1.5" fill="none" />
          <text x="50%" y="38" dominantBaseline="middle" textAnchor="middle" fill="#001e4e" fontFamily="'Times New Roman', serif" fontSize="18" fontWeight="bold" letterSpacing="3px">LONGINES</text>
        </svg>
      )
    },
    {
      name: 'ORIENT',
      logo: (
        <svg viewBox="0 0 160 50" width="140" height="42" xmlns="http://www.w3.org/2000/svg">
          <path d="M70 5 L80 15 L90 5 Z" fill="#e3000f" />
          <circle cx="80" cy="18" r="6" fill="#e3000f" />
          <text x="50%" y="42" dominantBaseline="middle" textAnchor="middle" fill="#000" fontFamily="'Times New Roman', serif" fontSize="26" fontWeight="bold" letterSpacing="1px">ORIENT</text>
        </svg>
      )
    },
    {
      name: 'AUDEMARS PIGUET',
      logo: (
        <svg viewBox="0 0 180 45" width="150" height="36" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="20" dominantBaseline="middle" textAnchor="middle" fill="#000" fontFamily="'Times New Roman', serif" fontSize="15" fontWeight="bold" letterSpacing="1px">AUDEMARS PIGUET</text>
          <text x="50%" y="35" dominantBaseline="middle" textAnchor="middle" fill="#777" fontFamily="'Arial', sans-serif" fontSize="9" letterSpacing="2px">LE BRASSUS</text>
        </svg>
      )
    },
    {
      name: 'BULOVA',
      logo: (
        <svg viewBox="0 0 140 50" width="120" height="42" xmlns="http://www.w3.org/2000/svg">
          <path d="M65 5 L65 15 M75 5 L75 15 M70 15 L70 25" stroke="#777" strokeWidth="2.5" fill="none" />
          <circle cx="70" cy="27" r="2" fill="#777" />
          <text x="50%" y="42" dominantBaseline="middle" textAnchor="middle" fill="#000" fontFamily="'Times New Roman', serif" fontSize="24" fontWeight="600" letterSpacing="3px">BULOVA</text>
        </svg>
      )
    },
    {
      name: 'TISSOT',
      logo: (
        <svg viewBox="0 0 140 40" width="120" height="34" xmlns="http://www.w3.org/2000/svg">
          <text x="55" y="26" fill="#000" fontFamily="'Helvetica Neue', 'Arial', sans-serif" fontSize="26" fontWeight="bold" letterSpacing="2px">TISSOT</text>
          <rect x="12" y="10" width="20" height="20" fill="#e31e24" />
          <rect x="20" y="14" width="4" height="12" fill="#fff" />
          <rect x="16" y="18" width="12" height="4" fill="#fff" />
        </svg>
      )
    }
  ];

  // Duplicamos el arreglo para lograr el desplazamiento continuo (infinite marquee) sin huecos
  const marqueeMarcas = [...marcas, ...marcas, ...marcas];

  return (
    <div className="marcas-section">
      <div className="marcas-wrapper">
        <p className="marcas-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline', position: 'relative', top: '-1px', color: 'var(--c-blush)' }}><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>
          EXCLUSIVA SELECCIÓN DE MARCAS INTERNACIONALES
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', display: 'inline', position: 'relative', top: '-1px', color: 'var(--c-blush)' }}><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>
        </p>

        {/* Marquee Perpetuo Infinito (Desktop: Izquierda a Derecha | Móvil: Derecha a Izquierda) */}
        <div className="marcas-marquee-container">
          <div className="marcas-marquee-track">
            {marqueeMarcas.map((marca, i) => (
              <div key={i} className="marca-item" title={marca.name}>
                {marca.logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


