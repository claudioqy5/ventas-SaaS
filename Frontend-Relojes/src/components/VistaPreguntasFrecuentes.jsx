"use client";
import React, { useState, useMemo } from 'react';

// Iconos SVG limpios y minimalistas (sin emojis, sin hidratación desfasada)
const ArrowLeftIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const SearchIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronDownIcon = ({ size = 18, color = "currentColor", rotate = false }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{
      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      transform: rotate ? 'rotate(180deg)' : 'rotate(0deg)'
    }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const TruckIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const CreditCardIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const ShieldCheckIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

const RefreshIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const WhatsAppIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const FAQ_DATA = [
  {
    id: 'orig-1',
    categoria: 'Garantía y Autenticidad',
    icon: ShieldCheckIcon,
    pregunta: '¿Los relojes son 100% originales y nuevos?',
    respuesta: 'Sí, absolutamente. Cada guardatiempo comercializado en Tempo Preciso Boutique es 100% original, legítimo y sin estrenar. Todas las piezas se entregan en su caja y estuche de fábrica original, con sus respectivos manuales de usuario, certificado de procedencia y tarjeta de garantía oficial sellada.'
  },
  {
    id: 'orig-2',
    categoria: 'Garantía y Autenticidad',
    icon: ShieldCheckIcon,
    pregunta: '¿Cómo funciona la garantía de los productos?',
    respuesta: 'Nuestros relojes cuentan con una garantía oficial de 12 a 24 meses (dependiendo de la manufactura y marca) que cubre defectos en la maquinaria interna, mecanismo y precisión del calibre. No cubre desgastes estéticos por uso ordinario, rotura de cristal por caídas accidentales o inmersión en agua fuera de los límites de hermeticidad especificados por el fabricante.'
  },
  {
    id: 'env-1',
    categoria: 'Envíos y Entregas',
    icon: TruckIcon,
    pregunta: '¿Hacen envíos a todo el Perú y cuál es el tiempo de entrega?',
    respuesta: 'Sí, realizamos envíos a nivel nacional con altos estándares de seguridad:\n• Lima Metropolitana y Callao: Despacho prioritario en 24 a 48 horas hábiles mediante personal propio de seguridad o courier exprés.\n• Provincias: Entregas en 48 a 72 horas hábiles a través de Olva Courier o Shalom con guía de transporte certificada y valor declarado asegurado.'
  },
  {
    id: 'env-2',
    categoria: 'Envíos y Entregas',
    icon: TruckIcon,
    pregunta: '¿Cómo puedo hacer seguimiento a mi pedido?',
    respuesta: 'Inmediatamente después de procesar y despachar tu compra, recibirás un mensaje a tu WhatsApp y a tu correo electrónico con el número de seguimiento (código de tracking) y el enlace directo para consultar el trayecto en tiempo real de tu envío.'
  },
  {
    id: 'env-3',
    categoria: 'Envíos y Entregas',
    icon: TruckIcon,
    pregunta: '¿El envío tiene costo adicional?',
    respuesta: 'Ofrecemos Envío Gratuito para Lima Metropolitana en compras superiores a S/ 250.00. Para pedidos de menor valor o despachos interprovinciales, el costo de transporte se calcula automáticamente en base a tu distrito o provincia de destino de forma transparente antes de pagar.'
  },
  {
    id: 'pag-1',
    categoria: 'Pagos y Facturación',
    icon: CreditCardIcon,
    pregunta: '¿Qué medios de pago aceptan y qué tan seguro es comprar?',
    respuesta: 'Toda nuestra plataforma cuenta con cifrado SSL de 256 bits para garantizar la máxima seguridad en cada transacción. Aceptamos:\n• Tarjetas de crédito y débito: Visa, Mastercard, American Express y Diners Club procesadas de manera segura vía pasarela bancaria.\n• Billeteras Digitales: Yape y Plin para pagos ágiles sin comisiones.\n• Transferencia directa: Cuentas corrientes BCP, BBVA e Interbank.'
  },
  {
    id: 'pag-2',
    categoria: 'Pagos y Facturación',
    icon: CreditCardIcon,
    pregunta: '¿Los precios incluyen IGV? ¿Emiten Boleta y Factura?',
    respuesta: 'Sí, todos los precios mostrados en nuestro catálogo ya incluyen el Impuesto General a las Ventas (18% IGV). Al momento de realizar tu compra puedes solicitar Boleta de Venta Electrónica ingresando tu DNI, o Factura Electrónica indicando la Razón Social y el RUC de tu empresa.'
  },
  {
    id: 'cam-1',
    categoria: 'Cambios y Devoluciones',
    icon: RefreshIcon,
    pregunta: '¿Puedo solicitar cambio si el modelo o tamaño no me convence?',
    respuesta: 'Sí. Dispones de un plazo de hasta 7 días calendario tras recibir tu pedido para solicitar un cambio por otro modelo o referencia de igual o mayor valor. El reloj debe presentarse en estado impecable: sin uso, con todos sus plásticos protectores originales intactos, etiquetas, estuche, manuales y boleta o factura de compra.'
  },
  {
    id: 'tie-1',
    categoria: 'Boutique y Asesoría',
    icon: ShieldCheckIcon,
    pregunta: '¿Tienen tienda física o showroom donde pueda ver los relojes?',
    respuesta: 'Nuestra boutique y showroom principal se encuentra ubicada en San Isidro, Lima (Av. Camino Real 1225). Atendemos tanto al público en general como bajo cita previa para quienes deseen una sesión privada de apreciación y asesoramiento con nuestro Concierge de relojería.'
  }
];

const CATEGORIAS = ['Todas', 'Garantía y Autenticidad', 'Envíos y Entregas', 'Pagos y Facturación', 'Cambios y Devoluciones'];

export default function VistaPreguntasFrecuentes({ onBack, onOpenWhatsAppConcierge }) {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [openIds, setOpenIds] = useState(['orig-1', 'env-1']); // Primeras abiertas por defecto

  const toggleAccordion = (id) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const preguntasFiltradas = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const coincideCat = categoriaActiva === 'Todas' || item.categoria === categoriaActiva;
      const q = busqueda.toLowerCase().trim();
      const coincideBusqueda = !q || 
        item.pregunta.toLowerCase().includes(q) || 
        item.respuesta.toLowerCase().includes(q) ||
        item.categoria.toLowerCase().includes(q);
      return coincideCat && coincideBusqueda;
    });
  }, [categoriaActiva, busqueda]);

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      padding: '40px 24px 90px',
      width: '100%',
      minHeight: '80vh'
    }}>
      
      {/* Botón Volver y Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(52, 21, 57, 0.15)',
            color: 'var(--c-deep-purple)',
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-sans)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(52, 21, 57, 0.05)';
            e.currentTarget.style.borderColor = 'var(--c-deep-purple)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(52, 21, 57, 0.15)';
          }}
        >
          <ArrowLeftIcon size={16} color="var(--c-deep-purple)" />
          Volver al Catálogo
        </button>

        <nav style={{ fontSize: '0.8rem', color: 'rgba(52, 21, 57, 0.5)', letterSpacing: '0.04em' }}>
          <span style={{ cursor: 'pointer' }} onClick={onBack}>Inicio</span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: 'var(--c-blush)', fontWeight: 600 }}>Preguntas Frecuentes</span>
        </nav>
      </div>

      {/* Header Principal con Estilo Editorial */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
        <span style={{
          display: 'inline-block',
          fontSize: '0.74rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--c-blush)',
          fontFamily: 'var(--font-serif)',
          fontWeight: 600,
          marginBottom: '8px'
        }}>
          CENTRO DE ASISTENCIA Y AYUDA
        </span>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
          color: 'var(--c-deep-purple)',
          fontWeight: 600,
          lineHeight: 1.2,
          marginBottom: '16px'
        }}>
          Preguntas Frecuentes
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: 'rgba(52, 21, 57, 0.7)',
          lineHeight: 1.6,
          margin: 0
        }}>
          Resolvemos todas tus dudas sobre autenticidad, métodos de pago seguros, tiempos de entrega en Lima y provincias, y garantías oficiales.
        </p>
      </div>

      {/* Barra de Búsqueda Rápida */}
      <div style={{
        maxWidth: '620px',
        margin: '0 auto 36px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'rgba(52, 21, 57, 0.4)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <SearchIcon size={20} color="var(--c-blush)" />
        </div>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Escribe tu consulta (ej. envíos, garantía, Yape, boleta)..."
          style={{
            width: '100%',
            padding: '14px 16px 14px 48px',
            fontSize: '0.95rem',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(52, 21, 57, 0.12)',
            borderRadius: '12px',
            color: 'var(--c-deep-purple)',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(52, 21, 57, 0.04)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--c-blush)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(183, 121, 135, 0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(52, 21, 57, 0.12)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(52, 21, 57, 0.04)';
          }}
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda('')}
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'rgba(52, 21, 57, 0.4)',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Filtros de Categorías */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '40px'
      }}>
        {CATEGORIAS.map(cat => {
          const isActive = categoriaActiva === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: isActive ? '1px solid var(--c-deep-purple)' : '1px solid rgba(52, 21, 57, 0.1)',
                backgroundColor: isActive ? 'var(--c-deep-purple)' : '#ffffff',
                color: isActive ? '#ffffff' : 'rgba(52, 21, 57, 0.75)'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Lista Acordeón de Preguntas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '60px' }}>
        {preguntasFiltradas.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '50px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed rgba(52, 21, 57, 0.15)'
          }}>
            <p style={{ margin: '0 0 10px', color: 'var(--c-deep-purple)', fontWeight: 600 }}>
              No encontramos respuestas para "{busqueda}"
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(52, 21, 57, 0.6)' }}>
              Intenta con otra palabra clave o pregúntale directamente a nuestro asesor por WhatsApp.
            </p>
          </div>
        ) : (
          preguntasFiltradas.map(item => {
            const isOpen = openIds.includes(item.id);
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: isOpen ? '1px solid rgba(183, 121, 135, 0.4)' : '1px solid rgba(52, 21, 57, 0.08)',
                  boxShadow: isOpen ? '0 4px 16px rgba(52, 21, 57, 0.05)' : 'none',
                  overflow: 'hidden',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: isOpen ? 'rgba(183, 121, 135, 0.12)' : 'rgba(52, 21, 57, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background-color 0.2s'
                    }}>
                      <IconComponent size={18} color={isOpen ? "var(--c-blush)" : "var(--c-deep-purple)"} />
                    </div>
                    <div>
                      <span style={{
                        display: 'block',
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--c-blush)',
                        fontWeight: 600,
                        marginBottom: '2px'
                      }}>
                        {item.categoria}
                      </span>
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--c-deep-purple)',
                        fontFamily: 'var(--font-sans)'
                      }}>
                        {item.pregunta}
                      </span>
                    </div>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    <ChevronDownIcon size={20} color="var(--c-deep-purple)" rotate={isOpen} />
                  </div>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 22px 74px',
                    borderTop: '1px solid rgba(52, 21, 57, 0.04)'
                  }}>
                    <p style={{
                      margin: '14px 0 0 0',
                      fontSize: '0.92rem',
                      lineHeight: 1.65,
                      color: 'rgba(52, 21, 57, 0.8)',
                      whiteSpace: 'pre-line'
                    }}>
                      {item.respuesta}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Banner de Contacto Directo Concierge */}
      <div style={{
        backgroundColor: 'var(--c-deep-purple)',
        borderRadius: '18px',
        padding: '36px 32px',
        color: '#ffffff',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '560px' }}>
          <span style={{
            fontSize: '0.74rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--c-blush)',
            fontFamily: 'var(--font-serif)',
            fontWeight: 600
          }}>
            ¿TIENES OTRA DUDA?
          </span>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.45rem',
            fontWeight: 600,
            margin: '6px 0 8px 0',
            color: '#ffffff'
          }}>
            Nuestro Concierge de Relojería te atiende en directo
          </h3>
          <p style={{
            fontSize: '0.88rem',
            margin: 0,
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.5
          }}>
            Si deseas consultar por un modelo particular, solicitar fotos o coordinar un pedido a medida, escríbenos directamente por WhatsApp.
          </p>
        </div>

        <button
          onClick={onOpenWhatsAppConcierge}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#25D366',
            color: '#ffffff',
            border: 'none',
            padding: '13px 26px',
            borderRadius: '999px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 211, 102, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 211, 102, 0.3)';
          }}
        >
          <WhatsAppIcon size={20} color="#ffffff" />
          Conversar con un Asesor
        </button>
      </div>

    </div>
  );
}
