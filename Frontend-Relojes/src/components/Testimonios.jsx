import React, { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

import img1 from '../assets/clientes/edited_cliente1.jpeg';
import img2 from '../assets/clientes/edited_cliente2.jpeg';
import img3 from '../assets/clientes/edited_cliente3.jpeg';
import img4 from '../assets/clientes/edited_cliente4.jpeg';
import img5 from '../assets/clientes/edited_cliente5.jpeg';
import img6 from '../assets/clientes/edited_cliente6.jpeg';

export default function Testimonios() {
  const scrollRef = useRef(null);

  const opiniones = [
    {
      id: 1,
      name: "Mateo V.",
      location: "San Isidro, Lima",
      text: "El nivel de detalle y precisión de este reloj supera mis expectativas. Una verdadera joya que transmite elegancia. La entrega fue rapidísima y el empaque es de primer nivel.",
      rating: 5,
      image: img1
    },
    {
      id: 2,
      name: "Valeria C.",
      location: "Arequipa",
      text: "La atención por WhatsApp fue impecable desde el primer momento. Recibí mi pedido en provincia súper rápido y en un empaque sumamente cuidado. 100% confiables.",
      rating: 5,
      image: img2
    },
    {
      id: 3,
      name: "Luis F.",
      location: "Miraflores, Lima",
      text: "Materiales premium, un mecanismo asombroso y un diseño espectacular. Sin duda mi tienda de cabecera para relojes automáticos aquí en Perú. Vale cada sol invertido.",
      rating: 5,
      image: img3
    },
    {
      id: 4,
      name: "Carlos M.",
      location: "Trujillo",
      text: "Excelente calidad y diseño espectacular. El reloj llegó exactamente en la fecha indicada y con todos sus certificados. Superó totalmente mis expectativas.",
      rating: 5,
      image: img4
    },
    {
      id: 5,
      name: "Andrea P.",
      location: "Cusco",
      text: "Un servicio al cliente maravilloso. Tenía dudas sobre el modelo y me asesoraron genial. El reloj es incluso más hermoso en persona, la calidad se nota al instante.",
      rating: 5,
      image: img5
    },
    {
      id: 6,
      name: "Jorge R.",
      location: "Surco, Lima",
      text: "Compré este reloj como autorregalo y ha sido un acierto total. Los acabados son de lujo y se siente muy sólido en la muñeca. Totalmente recomendado.",
      rating: 5,
      image: img6
    }
  ];

  // Duplicamos el arreglo para hacer el efecto infinito
  const opinionesInfinitas = [...opiniones, ...opiniones, ...opiniones];

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let animationId;

    // Mouse events para "jalar" con el mouse
    const mouseDown = (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const mouseLeave = () => {
      isDown = false;
      slider.style.cursor = 'grab';
    };

    const mouseUp = () => {
      isDown = false;
      slider.style.cursor = 'grab';
    };

    const mouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // Velocidad de arrastre
      slider.scrollLeft = scrollLeft - walk;
    };

    // Touch events para móviles
    const touchStart = (e) => {
      isDown = true;
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    const touchEnd = () => {
      isDown = false;
    };
    const touchMove = (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', mouseDown);
    slider.addEventListener('mouseleave', mouseLeave);
    slider.addEventListener('mouseup', mouseUp);
    slider.addEventListener('mousemove', mouseMove);
    
    slider.addEventListener('touchstart', touchStart, { passive: true });
    slider.addEventListener('touchend', touchEnd);
    slider.addEventListener('touchmove', touchMove, { passive: false });

    // Animación perpetua
    const play = () => {
      if (!isDown) {
        slider.scrollLeft += 0.6; // Velocidad de movimiento automático
        
        // Loop infinito: si llegamos a un tercio del scroll (ya que triplicamos el array)
        if (slider.scrollLeft >= slider.scrollWidth / 3) {
          slider.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(play);
    };
    animationId = requestAnimationFrame(play);

    return () => {
      slider.removeEventListener('mousedown', mouseDown);
      slider.removeEventListener('mouseleave', mouseLeave);
      slider.removeEventListener('mouseup', mouseUp);
      slider.removeEventListener('mousemove', mouseMove);
      
      slider.removeEventListener('touchstart', touchStart);
      slider.removeEventListener('touchend', touchEnd);
      slider.removeEventListener('touchmove', touchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section style={{
      padding: '100px 0', 
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
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

      <div 
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '40px',
          overflowX: 'auto',
          padding: '0 4vw',
          // Ocultar barra de scroll
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE
          cursor: 'grab'
        }}
      >
        <style>
          {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {opinionesInfinitas.map((opinion, index) => (
          <div key={`${opinion.id}-${index}`} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            minWidth: '280px', // Reducido horizontalmente
            maxWidth: '280px',
            userSelect: 'none' // Evita que se seleccione el texto al arrastrar
          }}>
            {/* Imagen del cliente más estrecha y alta */}
            <div style={{
              width: '100%',
              height: '320px', // Ampliado verticalmente
              overflow: 'hidden',
              borderRadius: '8px',
              position: 'relative',
              backgroundColor: '#f8f9fa',
              pointerEvents: 'none' // Evita el comportamiento de arrastrar imagen del navegador
            }}>
              <img 
                src={opinion.image.src || opinion.image} 
                alt={`Cliente ${opinion.name}`} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 70%',
                  opacity: 0.95
                }} 
              />
            </div>

            {/* Contenido (texto y rating) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[...Array(opinion.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--c-deep-purple)" color="var(--c-deep-purple)" />
                  ))}
                </div>
                <Quote size={18} color="var(--c-blush)" style={{ opacity: 0.4 }} />
              </div>
              
              <p style={{
                color: 'var(--c-deep-purple)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                fontStyle: 'italic',
                fontWeight: 400
              }}>
                "{opinion.text}"
              </p>
              
              <div style={{ marginTop: '4px' }}>
                <h4 style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  color: 'var(--c-indigo)',
                  fontSize: '1.05rem',
                  margin: '0 0 2px 0'
                }}>
                  {opinion.name}
                </h4>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--c-taupe)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 500
                }}>
                  {opinion.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
