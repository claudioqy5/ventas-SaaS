import React from 'react';
import { Award, Compass, Gem, Sparkles } from 'lucide-react';

export default function Herencia() {
  return (
    <section id="artesania" style={{
      padding: '90px 24px',
      backgroundColor: '#f9f6f0',
      borderBottom: '1px solid rgba(59, 60, 65, 0.15)',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto'
      }}>
        {/* Encabezado de Sección con Emblema L'gant */}
        <div style={{ textAlign: 'center', marginBottom: '55px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
            <img
              src="/logo-lgant-gold.png"
              alt="L'gant"
              style={{ height: '52px', width: 'auto', objectFit: 'contain', opacity: 0.95 }}
            />
          </div>
          <span style={{
            fontSize: '0.74rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--c-blush)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 700
          }}>
            LA BÚSQUEDA DE LA PERFECCIÓN
          </span>
          <h2 className="font-serif" style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.9rem)',
            color: 'var(--c-deep-purple)',
            marginTop: '12px',
            marginBottom: '16px',
            letterSpacing: '0.02em',
            fontWeight: 800
          }}>
            Manufactura de Alta Relojería
          </h2>
          <div className="font-classic" style={{
            fontSize: '1.1rem',
            color: 'var(--c-taupe)',
            maxWidth: '820px',
            margin: '0 auto',
            lineHeight: 1.75,
            textAlign: 'justify'
          }}>
            <p style={{ marginBottom: '16px' }}>
              Bienvenidos a <strong>L'gant</strong>, la boutique líder en <strong>relojes de lujo en Perú</strong>. Nuestra pasión por la <strong>alta relojería</strong> nos ha llevado a crear un catálogo privado con la más exclusiva curaduría de marcas internacionales. Si buscas adquirir relojes originales, automáticos y de inversión, te encuentras en el lugar indicado.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Cada guardatiempo de nuestra selección multimarca representa la cúspide de la ingeniería de precisión suiza. Entendemos que adquirir piezas de casas históricas (como <strong>Rolex, Omega, Cartier o Patek Philippe</strong>) es una inversión para toda la vida. Por ello, todos nuestros modelos son inspeccionados meticulosamente, entregados en su estuche original y cuentan con garantía internacional certificada.
            </p>
            <p>
              Explora nuestra exclusiva colección de <strong>relojes suizos para hombre y mujer</strong>, que abarca desde clásicos de vestir hasta robustos relojes de buceo y cronógrafos deportivos. Realizamos envíos totalmente asegurados a Lima y todo el territorio nacional, garantizando que tu próxima obra maestra llegue a tus manos con la máxima seguridad y elegancia.
            </p>
          </div>
        </div>

        {/* 3 Pilares en tarjetas blancas elegantes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '55px'
        }}>
          {/* Pilar 1 */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(59, 60, 65, 0.15)',
            borderRadius: '18px',
            padding: '36px 28px',
            boxShadow: '0 8px 25px rgba(11, 11, 12, 0.05)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'rgba(11, 11, 12, 0.06)',
              border: '1px solid rgba(11, 11, 12, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Compass size={24} color="var(--c-indigo)" />
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--c-deep-purple)', marginBottom: '12px', fontWeight: 800 }}>
              Selección de Marcas Internacionales
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--c-taupe)', lineHeight: 1.6 }}>
              Curaduría rigurosa de cronógrafos automáticos, complicados y piezas de coleccionista importadas directamente de las casas relojeras más prestigiosas.
            </p>
          </div>

          {/* Pilar 2 */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(59, 60, 65, 0.15)',
            borderRadius: '18px',
            padding: '36px 28px',
            boxShadow: '0 8px 25px rgba(11, 11, 12, 0.05)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Gem size={24} color="var(--c-blush)" />
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--c-deep-purple)', marginBottom: '12px', fontWeight: 800 }}>
              Garantía y Autenticidad 100%
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--c-taupe)', lineHeight: 1.6 }}>
              Todos los modelos cuentan con estuche original, documentos oficiales de serie y respaldo de garantía internacional de 5 años en Perú.
            </p>
          </div>

          {/* Pilar 3 */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(59, 60, 65, 0.15)',
            borderRadius: '18px',
            padding: '36px 28px',
            boxShadow: '0 8px 25px rgba(11, 11, 12, 0.05)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 230, 200, 0.25)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Award size={24} color="var(--c-deep-purple)" />
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--c-deep-purple)', marginBottom: '12px', fontWeight: 800 }}>
              Entrega VIP Segura en Perú
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--c-taupe)', lineHeight: 1.6 }}>
              Despachos asegurados a Lima y provincias, con atención preferencial de nuestro equipo de concierge en cada paso de su adquisición.
            </p>
          </div>
        </div>

        {/* Cita de Alta Relojería */}
        <div style={{
          maxWidth: '850px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '38px',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 10px 30px rgba(11, 11, 12, 0.06)'
        }}>
          <Sparkles size={24} color="var(--c-blush)" style={{ margin: '0 auto 16px' }} />
          <blockquote className="font-classic" style={{
            fontSize: '1.45rem',
            fontStyle: 'italic',
            color: 'var(--c-deep-purple)',
            lineHeight: 1.6,
            marginBottom: '16px'
          }}>
            "Un reloj de lujo no solo señala el transcurso de las horas; custodia el legado de los momentos más trascendentes de quien lo porta."
          </blockquote>
          <cite className="font-serif" style={{
            fontSize: '0.82rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--c-indigo)',
            fontStyle: 'normal',
            fontWeight: 700
          }}>
            — L'GANT • Boutique de Alta Relojería en Perú
          </cite>
        </div>
      </div>
    </section>
  );
}
