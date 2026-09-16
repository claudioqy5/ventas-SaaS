import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';

export default function Inicio({ onExplore, onOpenWhatsAppConcierge }) {
  return (
    <section className="hero-section" style={{
      position: 'relative',
      minHeight: 'calc(100vh - 85px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, var(--c-charcoal) 0%, var(--c-obsidian) 80%)',
      overflow: 'hidden',
      color: '#fff'
    }}>
      {/* Giant Background Text */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(5rem, 18vw, 22rem)',
        fontFamily: 'var(--font-sans)',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.04)',
        whiteSpace: 'nowrap',
        zIndex: 1,
        letterSpacing: '-0.02em',
        lineHeight: 0.8
      }}>
        SYNTH ERA
      </div>

      {/* Floating Watch Image */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '900px',
        height: '70vh',
        minHeight: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        animation: 'floatElement 6s ease-in-out infinite'
      }}>
        <img 
          src="/watches/edifice_hero.jpg" 
          alt="Edifice Watch" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            mixBlendMode: 'lighten',
            filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.8))'
          }}
        />
      </div>

      {/* Cursive Text Overlay "MODERN ARMOR" */}
      <div style={{
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(3rem, 9vw, 11rem)',
        fontFamily: 'LeBistrotDesAmoureux, cursive',
        color: 'var(--c-gold)',
        whiteSpace: 'nowrap',
        zIndex: 3,
        textShadow: '0 10px 30px rgba(0,0,0,0.8)',
        pointerEvents: 'none'
      }}>
        Modern Armor
      </div>

      {/* "CREATED FOR YOU." */}
      <div style={{
        position: 'absolute',
        top: '68%',
        left: '15%',
        fontFamily: 'LeBistrotDesAmoureux, cursive',
        fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
        color: '#fff',
        zIndex: 4,
        transform: 'rotate(-4deg)',
        textShadow: '0 4px 15px rgba(0,0,0,0.5)'
      }}>
        Created for you.
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
          color: '#fff'
        }}>
          LIMITED PRE-ORDERS
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          Own the next-generation watch engineered for your comfort and bold individuality.
        </p>
      </div>

      {/* Bottom Right Glass Card */}
      <div onClick={onExplore} style={{
        position: 'absolute',
        bottom: '10%',
        right: '8%',
        zIndex: 4,
        background: 'rgba(26, 27, 31, 0.65)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '30px',
        borderRadius: '20px',
        maxWidth: '320px',
        cursor: 'pointer',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s ease',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-12px)';
        e.currentTarget.style.background = 'rgba(26, 27, 31, 0.85)';
        e.currentTarget.style.border = '1px solid rgba(212, 175, 55, 0.3)'; // Gold hover border
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'rgba(26, 27, 31, 0.65)';
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
      }}>
        <h3 style={{ 
          fontFamily: 'var(--font-sans)', 
          fontSize: '1rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em',
          marginBottom: '15px',
          fontWeight: 600,
          color: '#fff'
        }}>
          THIS MONTH'S EXCLUSIVE
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.65)',
          fontSize: '0.85rem',
          lineHeight: 1.5,
          marginBottom: '25px'
        }}>
          Pre-order now and unlock exclusive pricing this month.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em', fontWeight: 500 }}>See more info</span>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            border: '1px solid rgba(255,255,255,0.3)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            transition: 'all 0.3s ease'
          }}>
            <Eye size={14} />
          </div>
        </div>
      </div>
    </section>
  );
}
