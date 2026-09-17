import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';

export default function Inicio({ onExplore, onOpenWhatsAppConcierge, onNavigateView }) {
  return (
    <section className="hero-section" style={{
      position: 'relative',
      height: 'calc(98vh - 85px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      overflow: 'hidden',
      color: '#000',
      borderBottomLeftRadius: '100px',
      borderBottomRightRadius: '100px'
    }}>
      {/* Giant Background Text Top - L'GANTE */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(5rem, 16vw, 22rem)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 900,
        color: 'rgba(0, 0, 0, 0.04)',
        whiteSpace: 'nowrap',
        zIndex: 1,
        letterSpacing: '-0.02em',
        lineHeight: 0.8
      }}>
        L'GANT
      </div>

      {/* Giant Background Text Bottom - EN CADA SEGUNDO */}
      <div style={{
        position: 'absolute',
        top: '70%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(4rem, 12vw, 15rem)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 900,
        color: 'transparent',
        WebkitTextStroke: '3px rgba(0, 0, 0, 0.05)',
        whiteSpace: 'nowrap',
        zIndex: 1,
        letterSpacing: '-0.02em',
        lineHeight: 0.8
      }}>
        EN CADA SEGUNDO
      </div>


      {/* Bottom Left Info */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '8%',
        zIndex: 4,
        maxWidth: '300px'
      }}>
        <h3 style={{ 
          fontFamily: 'var(--font-sans)', 
          fontSize: '1.1rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em',
          marginBottom: '15px',
          fontWeight: 600,
          color: '#000'
        }}>
          LIMITED PRE-ORDERS
        </h3>
        <p style={{
          color: 'rgba(0, 0, 0, 0.7)',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          Own the next-generation watch engineered for your comfort and bold individuality.
        </p>
      </div>

    </section>
  );
}
