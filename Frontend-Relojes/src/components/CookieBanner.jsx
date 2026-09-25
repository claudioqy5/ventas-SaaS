import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#0B0B0C',
      border: '1px solid var(--c-gold)',
      color: '#ffffff',
      padding: '20px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      maxWidth: '90%',
      width: 'max-content',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      <div style={{
        fontSize: '0.85rem',
        lineHeight: '1.4',
        color: 'rgba(255, 255, 255, 0.85)',
        maxWidth: '500px',
        textAlign: 'left'
      }}>
        Utilizamos cookies para mejorar tu experiencia de compra y analizar nuestro tráfico. Al continuar navegando, aceptas nuestro uso de cookies.
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleAccept}
          style={{
            backgroundColor: 'var(--c-gold)',
            color: '#000000',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '4px',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s, transform 0.2s',
            fontFamily: 'var(--font-sans)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1c94d';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--c-gold)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
