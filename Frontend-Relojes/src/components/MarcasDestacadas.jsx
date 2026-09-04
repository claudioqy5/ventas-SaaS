import React from 'react';

export default function MarcasDestacadas() {
  const marcas = [
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
      name: 'CASIO',
      logo: (
        <svg viewBox="0 0 120 40" width="110" height="36" xmlns="http://www.w3.org/2000/svg">
          <text x="50%" y="24" dominantBaseline="middle" textAnchor="middle" fill="#00378b" fontFamily="'Arial Black', 'Helvetica', sans-serif" fontSize="28" fontWeight="900" transform="scale(1.1, 0.85)">CASIO</text>
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
      name: 'CITIZEN',
      logo: (
        <svg viewBox="0 0 220 50" width="180" height="40" xmlns="http://www.w3.org/2000/svg">
          {/* Círculo Rojo Promaster */}
          <circle cx="25" cy="25" r="18" fill="#ee2737" />
          {/* Manecillas blancas */}
          <path d="M25 15 L25 25 L32 30" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Texto CITIZEN */}
          <text x="55" y="33" fill="#000" fontFamily="'Georgia', 'Times New Roman', serif" fontSize="34" fontWeight="bold" letterSpacing="1px">CITIZEN</text>
        </svg>
      )
    },
    {
      name: 'ORIENT',
      logo: (
        <svg viewBox="0 0 160 50" width="140" height="42" xmlns="http://www.w3.org/2000/svg">
          {/* Mockup del crest rojo */}
          <path d="M70 5 L80 15 L90 5 Z" fill="#e3000f" />
          <circle cx="80" cy="18" r="6" fill="#e3000f" />
          <text x="50%" y="42" dominantBaseline="middle" textAnchor="middle" fill="#000" fontFamily="'Times New Roman', serif" fontSize="26" fontWeight="bold" letterSpacing="1px">ORIENT</text>
        </svg>
      )
    },
    {
      name: 'BULOVA',
      logo: (
        <svg viewBox="0 0 140 50" width="120" height="42" xmlns="http://www.w3.org/2000/svg">
          {/* Mockup Tuning Fork */}
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
          {/* Swiss cross rojo real */}
          <rect x="12" y="10" width="20" height="20" fill="#e31e24" />
          <rect x="20" y="14" width="4" height="12" fill="#fff" />
          <rect x="16" y="18" width="12" height="4" fill="#fff" />
        </svg>
      )
    }
  ];

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#fdfdfd',
      borderTop: '1px solid rgba(115, 96, 91, 0.1)',
      borderBottom: '1px solid rgba(115, 96, 91, 0.1)',
      padding: '160px 0 60px', // Aún más espacio para la enorme tarjeta flotante
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1680px',
        margin: '0 auto',
        padding: '0 40px',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: 'var(--c-taupe)',
          textTransform: 'uppercase',
          marginBottom: '30px',
          fontWeight: 600
        }}>
          EXCLUSIVA SELECCIÓN DE MARCAS INTERNACIONALES
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'clamp(30px, 5vw, 70px)',
          flexWrap: 'wrap'
        }}>
          {marcas.map((marca, i) => (
            <div key={i} style={{
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'grayscale(100%) opacity(0.6)',
            }}
            title={marca.name}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'grayscale(0%) opacity(1)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'grayscale(100%) opacity(0.6)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              {marca.logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
