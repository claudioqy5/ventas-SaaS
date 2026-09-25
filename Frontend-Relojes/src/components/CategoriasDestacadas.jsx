import React from 'react';
import casualImg from '../assets/categorias/casual.jpg';
import clasicoImg from '../assets/categorias/clasico.jpg';
import deportivoImg from '../assets/categorias/deportivo.jpg';
import edificeImg from '../assets/categorias/edifice.jpg';
import eleganteImg from '../assets/categorias/elegante.jpg';
import retroImg from '../assets/categorias/retro.jpg';

export default function CategoriasDestacadas({ onSelectCategory }) {
  const categorias = [
    { id: 'casual', nombre: 'Casual', imagen: casualImg, tag: 'Casual', style: { fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif', fontWeight: 500, fontStyle: 'normal', letterSpacing: '0.05em' } },
    { id: 'clasico', nombre: 'Clásico', imagen: clasicoImg, tag: 'Clásico', style: { fontFamily: 'var(--font-serif), "Times New Roman", serif', fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.05em' } },
    { id: 'deportivo', nombre: 'Deportivo', imagen: deportivoImg, tag: 'Deportivo', style: { fontFamily: '"Impact", "Arial Black", sans-serif', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '0.05em' } },
    { id: 'edifice', nombre: 'Edifice', imagen: edificeImg, tag: 'Edifice', style: { fontFamily: '"Trebuchet MS", "Lucida Sans Unicode", sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' } },
    { id: 'elegante', nombre: 'Elegante', imagen: eleganteImg, tag: 'Elegante', style: { fontFamily: 'var(--font-serif), "Georgia", serif', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.2em' } },
    { id: 'retro', nombre: 'Retro', imagen: retroImg, tag: 'Retro', style: { fontFamily: '"Courier New", monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' } }
  ];

  return (
    <div className="categorias-destacadas" style={{ padding: '60px 24px', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{
            fontSize: '0.74rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--c-blush)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
            marginBottom: '8px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline', position: 'relative', top: '-1px' }}><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>
            DESCUBRE TU ESTILO
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', display: 'inline', position: 'relative', top: '-1px' }}><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/></svg>
          </p>
          <h2 className="font-serif" style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            color: 'var(--c-deep-purple)',
            fontWeight: 600,
            letterSpacing: '0.02em',
            marginTop: '4px'
          }}>
            Colecciones Destacadas
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '20px',
          width: '100%'
        }}>
          {categorias.map((cat, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                if (onSelectCategory) {
                    onSelectCategory(cat.tag);
                }
              }}
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '4/5',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(11, 11, 12, 0.08)',
                transition: 'transform 0.4s ease, box-shadow 0.4s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(11, 11, 12, 0.15)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(11, 11, 12, 0.08)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
              }}
            >
              <img 
                src={cat.imagen.src || cat.imagen} 
                alt={cat.nombre} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '40px 16px 16px',
                background: 'linear-gradient(to top, rgba(11,11,12,0.85) 0%, rgba(11,11,12,0) 100%)',
                color: '#ffffff',
                textAlign: 'center',
                pointerEvents: 'none'
              }}>
                <h3 style={{ fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.6)', margin: 0, ...cat.style }}>
                  {cat.nombre}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
