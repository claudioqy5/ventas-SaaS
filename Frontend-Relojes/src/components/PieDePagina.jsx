import React from 'react';
import { Mail, Phone, MapPin, Watch, ShieldCheck } from 'lucide-react';

const TikTokIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3" />
  </svg>
);

const FacebookIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const CardBadge = ({ children, bg, color }) => (
  <div style={{
    backgroundColor: bg || '#ffffff',
    color: color || '#1434CB',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: 800,
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '42px',
    height: '26px',
    border: bg ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'
  }}>
    {children}
  </div>
);

const BookOpenIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const FooterLink = ({ href = "#", onClick, children }) => (
  <li>
    <a 
      href={href} 
      onClick={onClick}
      style={{
        color: 'rgba(255, 255, 255, 0.75)',
        textDecoration: 'none',
        transition: 'color 0.2s',
        fontSize: '0.85rem',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}
    >
      {children}
    </a>
  </li>
);

export default function PieDePagina({ onOpenWhatsAppConcierge, storeName, onNavigate }) {
  const marcas = [
    "Rolex", "Cartier", "Patek Philippe", "Audemars Piguet",
    "Omega", "Tag Heuer", "Breitling", "Hublot",
    "IWC", "Jaeger-LeCoultre", "Tudor", "Panerai"
  ];

  const handleLinkClick = (viewName, fallbackUrl) => (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(viewName);
    } else {
      window.location.href = fallbackUrl;
    }
  };

  return (
    <footer id="garantia" className="footer-main" style={{
      backgroundColor: 'var(--c-deep-purple)',
      borderTop: '2px solid var(--c-blush)',
      padding: '80px 24px 30px',
      color: 'rgba(255, 255, 255, 0.75)'
    }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        
        {/* TOP GRID: 4 COLUMNS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '50px',
          paddingBottom: '60px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          
          {/* COL 1: CANALES DE ATENCIÓN */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              Canales de Atención
            </h4>
            <div style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginBottom: '24px' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Mail size={22} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#ffffff', fontWeight: 600 }}>Comercial:</p>
                  <a href="mailto:concierge@tempopreciso.pe" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none' }}>concierge@tempopreciso.pe</a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Phone size={22} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#ffffff', fontWeight: 600 }}>Atención 24/7 (WhatsApp):</p>
                  <button 
                    onClick={onOpenWhatsAppConcierge}
                    style={{ background: 'none', border: 'none', padding: 0, color: 'rgba(255, 255, 255, 0.75)', cursor: 'pointer', textAlign: 'left' }}
                  >
                    +51 962 956 919
                  </button>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={22} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <p style={{ margin: '0 0 4px 0', color: '#ffffff', fontWeight: 600 }}>Boutique Principal:</p>
                  <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.75)' }}>Av. Camino Real 1225,<br/>San Isidro, Lima - Perú</p>
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: TEMPO PRECISO */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              Tempo Preciso
            </h4>
            <div style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginBottom: '24px' }}></div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterLink href="/categoria/hombre">Relojes para Hombre</FooterLink>
              <FooterLink href="/categoria/mujer">Relojes para Mujer</FooterLink>
              <FooterLink href="/categoria/novedades">Nuevos Ingresos</FooterLink>
              <FooterLink href="/categoria/marcas">Alta Relojería</FooterLink>
              <FooterLink href="/categoria/accesorios">Accesorios y Cajas</FooterLink>
              <FooterLink href="/" onClick={handleLinkClick('catalog', '/')}>Nuestra Herencia</FooterLink>
              <FooterLink href="/" onClick={handleLinkClick('catalog', '/')}>Boutiques</FooterLink>
              <FooterLink href="#" onClick={(e) => { e.preventDefault(); if (onOpenWhatsAppConcierge) onOpenWhatsAppConcierge(); }}>Contáctanos</FooterLink>
            </ul>
          </div>

          {/* COL 3: MARCAS */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              Marcas
            </h4>
            <div style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginBottom: '24px' }}></div>
            
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              columnGap: '10px',
              rowGap: '14px' 
            }}>
              {marcas.map(marca => (
                <FooterLink key={marca} href="/categoria/marcas">{marca}</FooterLink>
              ))}
            </ul>
          </div>

          {/* COL 4: OTROS ENLACES */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              Otros Enlaces
            </h4>
            <div style={{ width: '100%', height: '1px', backgroundColor: '#ffffff', marginBottom: '24px' }}></div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterLink href="/preguntas-frecuentes" onClick={handleLinkClick('faq', '/preguntas-frecuentes')}>
                Preguntas Frecuentes
              </FooterLink>
              <FooterLink href="/terminos-y-condiciones" onClick={handleLinkClick('terminos', '/terminos-y-condiciones')}>
                Términos y Condiciones
              </FooterLink>
              <FooterLink href="/terminos-y-condiciones" onClick={handleLinkClick('terminos', '/terminos-y-condiciones')}>
                Políticas de Privacidad
              </FooterLink>
              <FooterLink href="/terminos-y-condiciones" onClick={handleLinkClick('terminos', '/terminos-y-condiciones')}>
                Cambios y Devoluciones
              </FooterLink>
              <FooterLink href="/preguntas-frecuentes" onClick={handleLinkClick('faq', '/preguntas-frecuentes')}>
                Servicio Técnico Autorizado
              </FooterLink>
              
              {/* Libro de reclamaciones con icono representativo SVG limpio (sin emojis) */}
              <li style={{ marginTop: '10px' }}>
                <a 
                  href="/terminos-y-condiciones" 
                  onClick={handleLinkClick('terminos', '/terminos-y-condiciones')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                >
                  <BookOpenIcon size={16} color="var(--c-blush)" />
                  Libro de Reclamaciones Virtual
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM SECTION: SOCIAL & PAYMENTS & COPYRIGHT */}
        <div style={{ paddingTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            {/* Redes Sociales */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', textTransform: 'uppercase' }}>Síguenos:</span>
              <div style={{ display: 'flex', gap: '14px' }}>
                <a href="#" style={{ color: 'rgba(255,255,255,0.75)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--c-blush)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}>
                  <FacebookIcon size={20} />
                </a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.75)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--c-blush)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}>
                  <InstagramIcon size={20} />
                </a>
                <a href="#" style={{ color: 'rgba(255,255,255,0.75)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--c-blush)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}>
                  <TikTokIcon size={20} />
                </a>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', textTransform: 'uppercase' }}>Pago Seguro:</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <CardBadge bg="#009EE3" color="#ffffff">
                  <span style={{ fontSize: '0.55rem', marginRight: '2px', color: '#000' }}>mercado</span>
                  <span style={{ fontSize: '0.55rem' }}>pago</span>
                </CardBadge>
                <CardBadge bg="#1434CB" color="#ffffff">VISA</CardBadge>
                <CardBadge bg="#222222" color="#ffffff">
                  <div style={{ position: 'relative', width: '16px', height: '10px' }}>
                    <div style={{ position: 'absolute', left: 0, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EB001B', opacity: 0.9 }}></div>
                    <div style={{ position: 'absolute', right: 0, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F79E1B', opacity: 0.9 }}></div>
                  </div>
                </CardBadge>
                <CardBadge bg="#002663" color="#ffffff">AMEX</CardBadge>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.4)'
          }}>
            <div>
              © {new Date().getFullYear()} TEMPO PRECISO. Boutique de Alta Relojería en Perú. Todos los derechos reservados.
            </div>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <span>Relojes 100% Auténticos</span>
              <span>Garantía Internacional</span>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
