import React from 'react';
import { Clock, ShieldCheck, MapPin, MessageCircle } from 'lucide-react';

export default function Footer({ onOpenWhatsAppConcierge, storeName }) {
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
          {/* Col 1: Marca */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--c-indigo) 0%, var(--c-blush) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff'
              }}>
                <Clock size={19} color="#ffffff" />
              </div>
              <div className="brand-geomanist" style={{ fontSize: '1.6rem', color: '#ffffff' }}>
                <span className="brand-bold" style={{ color: '#ffffff' }}>tempo</span>
                <span className="brand-light" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>preciso</span>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '20px', color: '#e5e1dd' }}>
              tempo preciso. Exclusividad, artesanía centenaria y calibres mecánicos certificados para los coleccionistas más exigentes.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-blush)', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Garantía de 5 Años y Entrega Asegurada</span>
            </div>
          </div>

          {/* Col 2: Salones de Venta */}
          <div>
            <h4 className="font-serif" style={{ fontSize: '0.92rem', color: '#ffffff', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '18px', fontWeight: 800 }}>
              Salones Privados VIP
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Rue du Rhône 42, 1204 Genève, Suiza</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Bahnhofstrasse 28, 8001 Zürich</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Boutique Autorizada & Concierge Virtual 24/7</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Asistencia y Concierge */}
          <div>
            <h4 className="font-serif" style={{ fontSize: '0.92rem', color: '#ffffff', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '18px', fontWeight: 800 }}>
              Atención Personalizada
            </h4>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '18px', color: '#e5e1dd' }}>
              Nuestros maestros relojeros y asesores patrimoniales están a su disposición para coordinar citas privadas y entregas a domicilio.
            </p>
            <button
              onClick={onOpenWhatsAppConcierge}
              className="btn-blush"
              style={{ width: '100%', fontSize: '0.78rem', padding: '12px 18px' }}
            >
              <MessageCircle size={16} />
              Iniciar Chat con Concierge VIP
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
            © {new Date().getFullYear()} AURELIA • Haute Horlogerie. Todos los derechos reservados.
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <span>Autenticidad Certificada</span>
            <span>Custodia Internacional</span>
            <span>SaaS Storefront Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
