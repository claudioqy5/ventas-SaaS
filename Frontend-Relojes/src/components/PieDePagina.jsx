import React from 'react';
import { Watch, ShieldCheck, MapPin, MessageCircle } from 'lucide-react';

export default function PieDePagina({ onOpenWhatsAppConcierge, storeName }) {
  return (
    <footer id="garantia" style={{
      backgroundColor: 'var(--c-deep-purple)',
      borderTop: '2px solid var(--c-blush)',
      padding: '80px 24px 40px',
      color: 'rgba(255, 255, 255, 0.75)'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          paddingBottom: '50px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {/* Col 1: Marca con Logo Idéntico al Header */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Watch size={26} color="var(--c-blush)" strokeWidth={1.5} />
                <div style={{ width: '1.5px', height: '32px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}></div>
                <div style={{ fontSize: '2.1rem', fontFamily: '"Cinzel", serif', color: '#ffffff', lineHeight: 1, letterSpacing: '0.05em' }}>
                  TP
                </div>
              </div>
              <div style={{
                fontSize: '0.64rem',
                letterSpacing: '0.45em',
                fontFamily: '"Cinzel", serif',
                color: 'rgba(255, 255, 255, 0.9)',
                textTransform: 'uppercase',
                marginTop: '4px'
              }}>
                TEMPO PRECISO
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '20px', color: '#e5e1dd' }}>
              TEMPO PRECISO. Boutique de alta relojería fina en Perú. Curaduría exclusiva de las mejores marcas internacionales de lujo para coleccionistas.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-blush)', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Garantía de 5 Años y Envío Asegurado a Todo el Perú</span>
            </div>
          </div>

          {/* Col 2: Salones de Venta en Perú */}
          <div>
            <h4 className="font-serif" style={{ fontSize: '0.92rem', color: '#ffffff', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '18px', fontWeight: 800 }}>
              Boutique & Showrooms Perú
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Av. Camino Real 1225, San Isidro, Lima - Perú</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Av. Primavera 1050, Santiago de Surco, Lima</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Despachos Directos a Todo el Perú (Arequipa, Trujillo, Cusco)</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Asistencia y Concierge */}
          <div>
            <h4 className="font-serif" style={{ fontSize: '0.92rem', color: '#ffffff', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '18px', fontWeight: 800 }}>
              Atención Personalizada
            </h4>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '18px', color: '#e5e1dd' }}>
              Nuestros asesores expertos en alta relojería están a su disposición para coordinar citas privadas en showroom y entregas personalizadas.
            </p>
            <button
              onClick={onOpenWhatsAppConcierge}
              className="btn-blush"
              style={{ width: '100%', fontSize: '0.78rem', padding: '12px 18px' }}
            >
              <MessageCircle size={16} />
              Iniciar Chat con Concierge VIP Perú
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          paddingTop: '30px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: 'rgba(255, 255, 255, 0.5)'
        }}>
          <div>
            © {new Date().getFullYear()} TEMPO PRECISO • Boutique de Alta Relojería en Perú. Todos los derechos reservados.
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <span>Relojes 100% Auténticos Multimarca</span>
            <span>Garantía en Perú</span>
            <span>Plataforma SaaS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
