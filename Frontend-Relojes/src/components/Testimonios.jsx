import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonios() {
  const opiniones = [
    {
      id: 1,
      name: "Carlos M.",
      location: "Madrid",
      text: "El nivel de detalle y precisión de este reloj supera mis expectativas. Una verdadera joya que transmite elegancia y estatus.",
      rating: 5,
    },
    {
      id: 2,
      name: "Elena R.",
      location: "Barcelona",
      text: "La atención al cliente fue impecable desde el primer momento. Recibí mi pedido al día siguiente en un empaque sumamente cuidado. Excelente servicio.",
      rating: 5,
    },
    {
      id: 3,
      name: "Javier G.",
      location: "Valencia",
      text: "Materiales premium, un mecanismo asombroso y un diseño espectacular. Sin duda mi marca de cabecera para relojes automáticos a partir de ahora.",
      rating: 5,
    }
  ];

  return (
    <section style={{
      padding: '90px 24px',
      backgroundColor: 'var(--bg-main)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '55px' }}>
          <span style={{
            fontSize: '0.74rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--c-blush)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 600
          }}>
            Experiencias
          </span>
          <h2 className="font-serif" style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            color: 'var(--c-deep-purple)',
            letterSpacing: '0.02em',
            marginTop: '6px',
            fontWeight: 600
          }}>
            Opiniones de Clientes
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {opiniones.map((opinion) => (
            <div key={opinion.id} style={{
              backgroundColor: '#ffffff',
              padding: '40px 30px',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-card)',
              position: 'relative',
              transition: 'transform 0.3s ease',
              border: '1px solid rgba(115, 96, 91, 0.08)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <Quote size={28} color="var(--c-blush)" style={{ opacity: 0.4, marginBottom: '20px' }} />
              
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(opinion.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--c-blush)" color="var(--c-blush)" />
                ))}
              </div>
              
              <p style={{
                color: 'var(--c-deep-purple)',
                fontSize: '1rem',
                lineHeight: 1.6,
                fontStyle: 'italic',
                marginBottom: '24px',
                flexGrow: 1
              }}>
                "{opinion.text}"
              </p>
              
              <div>
                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 700,
                  color: 'var(--c-indigo)',
                  fontSize: '1.1rem',
                  margin: '0 0 4px 0'
                }}>
                  {opinion.name}
                </h4>
                <span style={{
                  fontSize: '0.85rem',
                  color: 'var(--c-taupe)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {opinion.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
