"use client";
import React, { useState } from 'react';

const ArrowLeftIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const FileTextIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ShieldCheckIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <path d="m9 12 2 2 4-4"></path>
  </svg>
);

const CheckCircleIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const SECCIONES = [
  { id: 'sec-1', titulo: '1. Identificación del Titular' },
  { id: 'sec-2', titulo: '2. Aceptación y Marco Legal' },
  { id: 'sec-3', titulo: '3. Precios, Moneda e Impuestos (IGV)' },
  { id: 'sec-4', titulo: '4. Pasarelas de Pago y Seguridad' },
  { id: 'sec-5', titulo: '5. Despacho y Tiempos de Entrega' },
  { id: 'sec-6', titulo: '6. Garantía de Fábrica y Autenticidad' },
  { id: 'sec-7', titulo: '7. Política de Cambios y Devoluciones' },
  { id: 'sec-8', titulo: '8. Protección de Datos Personales' },
  { id: 'sec-9', titulo: '9. Libro de Reclamaciones' },
  { id: 'sec-10', titulo: '10. Jurisdicción y Ley Aplicable' }
];

export default function VistaTerminosCondiciones({ onBack }) {
  const [seccionActiva, setSeccionActiva] = useState('sec-1');

  const scrollToSection = (id) => {
    setSeccionActiva(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{
      maxWidth: '1120px',
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
          <span style={{ color: 'var(--c-blush)', fontWeight: 600 }}>Términos y Condiciones</span>
        </nav>
      </div>

      {/* Header Legal */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 46px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: '999px',
          backgroundColor: 'rgba(183, 121, 135, 0.1)',
          color: 'var(--c-blush)',
          fontSize: '0.74rem',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>
          <ShieldCheckIcon size={14} color="var(--c-blush)" />
          Marco Legal Vigente en Perú
        </div>

        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2rem, 3.4vw, 2.7rem)',
          color: 'var(--c-deep-purple)',
          fontWeight: 600,
          lineHeight: 1.25,
          marginBottom: '16px'
        }}>
          Términos y Condiciones de Uso
        </h1>
        <p style={{
          fontSize: '0.92rem',
          color: 'rgba(52, 21, 57, 0.7)',
          lineHeight: 1.6,
          margin: 0
        }}>
          Última actualización: Septiembre 2026. Regulado bajo la legislación de la República del Perú conforme a la <strong>Ley N° 29571 (Código de Protección y Defensa del Consumidor)</strong> y la <strong>Ley N° 29733 (Ley de Protección de Datos Personales)</strong>.
        </p>
      </div>

      {/* Layout: Índice Lateral + Contenido Detallado */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '40px',
        alignItems: 'start'
      }}>
        
        {/* Columna Lateral de Navegación Rápida */}
        <aside style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(52, 21, 57, 0.08)',
          boxShadow: '0 2px 12px rgba(52, 21, 57, 0.03)',
          position: 'sticky',
          top: '100px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <FileTextIcon size={18} color="var(--c-blush)" />
            <h4 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--c-deep-purple)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              Índice de Cláusulas
            </h4>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {SECCIONES.map((sec) => {
              const isSelected = seccionActiva === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  style={{
                    textAlign: 'left',
                    background: isSelected ? 'rgba(183, 121, 135, 0.1)' : 'none',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.82rem',
                    color: isSelected ? 'var(--c-blush)' : 'rgba(52, 21, 57, 0.8)',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(52, 21, 57, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'none';
                  }}
                >
                  {sec.titulo}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Columna Principal de Contenido Legal */}
        <div style={{
          gridColumn: 'span 2',
          display: 'flex',
          flexDirection: 'column',
          gap: '36px'
        }}>

          {/* Sección 1 */}
          <section id="sec-1" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(52, 21, 57, 0.08)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--c-deep-purple)', marginTop: 0, marginBottom: '14px', fontWeight: 600 }}>
              1. Identificación del Titular y la Plataforma
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(52, 21, 57, 0.8)', margin: '0 0 12px' }}>
              El presente sitio web y plataforma de comercio electrónico opera bajo la marca comercial <strong>TEMPO PRECISO BOUTIQUE</strong>, debidamente constituida conforme a las leyes de la República del Perú.
            </p>
            <ul style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'rgba(52, 21, 57, 0.8)', paddingLeft: '20px', margin: 0 }}>
              <li><strong>Razón Social:</strong> TEMPO PRECISO S.A.C.</li>
              <li><strong>RUC:</strong> 20608945123</li>
              <li><strong>Domicilio Fiscal:</strong> Av. Camino Real 1225, San Isidro, Lima - Perú</li>
              <li><strong>Canal Oficial de Atención:</strong> concierge@tempopreciso.pe | +51 962 956 919</li>
            </ul>
          </section>

          {/* Sección 2 */}
          <section id="sec-2" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(52, 21, 57, 0.08)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--c-deep-purple)', marginTop: 0, marginBottom: '14px', fontWeight: 600 }}>
              2. Aceptación de los Términos y Marco Normativo
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(52, 21, 57, 0.8)', margin: 0 }}>
              Al navegar, registrarse o concretar una transacción a través de este portal, el usuario declara ser mayor de edad con capacidad legal para contratar y manifiesta su plena conformidad con estos Términos y Condiciones. Nuestras operaciones se rigen íntegramente por la <strong>Ley N° 29571 (Código de Protección y Defensa del Consumidor)</strong> y la normativa emitida por el <strong>INDECOPI</strong>.
            </p>
          </section>

          {/* Sección 3 */}
          <section id="sec-3" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(52, 21, 57, 0.08)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--c-deep-purple)', marginTop: 0, marginBottom: '14px', fontWeight: 600 }}>
              3. Precios, Moneda e Impuestos (IGV)
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(52, 21, 57, 0.8)', margin: '0 0 14px' }}>
              Todos los precios exhibidos en la tienda virtual están expresados en <strong>Soles Peruanos (PEN - S/)</strong> e incluyen taxativamente el <strong>18% del Impuesto General a las Ventas (IGV)</strong> conforme a las disposiciones tributarias de la SUNAT.
            </p>
            <div style={{
              backgroundColor: 'rgba(183, 121, 135, 0.08)',
              borderLeft: '4px solid var(--c-blush)',
              padding: '14px 18px',
              borderRadius: '0 8px 8px 0',
              fontSize: '0.85rem',
              color: 'var(--c-deep-purple)'
            }}>
              <strong>Emisión de Comprobantes:</strong> El cliente puede optar libremente por recibir <strong>Boleta de Venta Electrónica</strong> (con DNI) o <strong>Factura Electrónica</strong> (con RUC activo y habido), la cual será remitida a su correo electrónico al confirmarse el despacho.
            </div>
          </section>

          {/* Sección 4 */}
          <section id="sec-4" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(52, 21, 57, 0.08)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--c-deep-purple)', marginTop: 0, marginBottom: '14px', fontWeight: 600 }}>
              4. Medios de Pago y Seguridad en Transacciones
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(52, 21, 57, 0.8)', margin: '0 0 12px' }}>
              Ponemos a disposición de nuestros clientes métodos de pago que cumplen los protocolos internacionales de seguridad PCI-DSS y tokenización bancaria:
            </p>
            <ul style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'rgba(52, 21, 57, 0.8)', paddingLeft: '20px', margin: 0 }}>
              <li><strong>Tarjetas de crédito o débito:</strong> Visa, Mastercard, American Express y Diners Club.</li>
              <li><strong>Billeteras Móviles:</strong> Pagos directos vía Yape y Plin mediante código QR o número de contacto corporativo.</li>
              <li><strong>Transferencia Bancaria:</strong> Cuentas corrientes corporativas en BCP, BBVA e Interbank.</li>
            </ul>
          </section>

          {/* Sección 5 */}
          <section id="sec-5" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(52, 21, 57, 0.08)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--c-deep-purple)', marginTop: 0, marginBottom: '14px', fontWeight: 600 }}>
              5. Despacho, Cobertura y Tiempos de Entrega
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(52, 21, 57, 0.8)', margin: '0 0 12px' }}>
              Realizamos envíos a toda la República del Perú asegurando la integridad física de cada reloj mediante embalajes de alta resistencia y precintos inviolables:
            </p>
            <ul style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'rgba(52, 21, 57, 0.8)', paddingLeft: '20px', margin: 0 }}>
              <li><strong>Lima Metropolitana y Callao:</strong> Entrega entre 24 y 48 horas hábiles siguientes a la validación de la orden.</li>
              <li><strong>Provincias del Perú:</strong> Entrega entre 48 y 72 horas hábiles a través de couriers certificados (Olva Courier, Shalom).</li>
              <li><strong>Recepción del Paquete:</strong> Toda entrega requiere la firma y DNI del titular o persona debidamente autorizada en la dirección de entrega.</li>
            </ul>
          </section>

          {/* Sección 6 */}
          <section id="sec-6" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(52, 21, 57, 0.08)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--c-deep-purple)', marginTop: 0, marginBottom: '14px', fontWeight: 600 }}>
              6. Garantía de Autenticidad y Funcionamiento
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(52, 21, 57, 0.8)', margin: '0 0 12px' }}>
              Garantizamos que el 100% de los guardatiempos ofertados son piezas auténticas, legítimas y manufacturadas con los más rigurosos estándares de la relojería.
            </p>
            <ul style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'rgba(52, 21, 57, 0.8)', paddingLeft: '20px', margin: 0 }}>
              <li><strong>Plazo de Garantía:</strong> Entre 12 y 24 meses según la marca y fabricante sobre defectos de manufactura en la maquinaria y movimiento interno.</li>
              <li><strong>Exclusiones de Garantía:</strong> No ampara daños por golpes accidentales, caídas, rayaduras externas, manipulación por técnicos no autorizados o uso fuera de los parámetros de resistencia al agua (ATM) establecidos en la ficha técnica.</li>
            </ul>
          </section>

          {/* Sección 7 */}
          <section id="sec-7" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(52, 21, 57, 0.08)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--c-deep-purple)', marginTop: 0, marginBottom: '14px', fontWeight: 600 }}>
              7. Políticas de Cambio y Devoluciones
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(52, 21, 57, 0.8)', margin: '0 0 12px' }}>
              En consonancia con el Código de Protección al Consumidor:
            </p>
            <ul style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'rgba(52, 21, 57, 0.8)', paddingLeft: '20px', margin: 0 }}>
              <li><strong>Plazo:</strong> El cliente puede solicitar el cambio dentro de los <strong>7 días calendario</strong> contados a partir del día siguiente a la recepción del bien.</li>
              <li><strong>Condiciones del producto:</strong> La pieza no debe presentar marcas de uso, debe mantener íntegros los plásticos protectores, manuales de fábrica, caja original y comprobante de pago respectivo.</li>
            </ul>
          </section>

          {/* Sección 8 */}
          <section id="sec-8" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(52, 21, 57, 0.08)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--c-deep-purple)', marginTop: 0, marginBottom: '14px', fontWeight: 600 }}>
              8. Protección de Datos Personales (Ley N° 29733)
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(52, 21, 57, 0.8)', margin: 0 }}>
              En estricto acatamiento de la <strong>Ley N° 29733</strong>, los datos proporcionados por el usuario serán tratados de manera confidencial y con la exclusiva finalidad de gestionar compras, facturación y despacho. No comercializamos bases de datos. El cliente podrá en todo momento ejercer sus derechos <strong>ARCO (Acceso, Rectificación, Cancelación y Oposición)</strong> mediante solicitud dirigida a nuestro correo institucional.
            </p>
          </section>

          {/* Sección 9 */}
          <section id="sec-9" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(52, 21, 57, 0.08)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--c-deep-purple)', marginTop: 0, marginBottom: '14px', fontWeight: 600 }}>
              9. Libro de Reclamaciones Virtual
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(52, 21, 57, 0.8)', margin: 0 }}>
              Conforme a lo ordenado por el <strong>Decreto Supremo N° 011-2011-PCM</strong> y el Código de Protección y Defensa del Consumidor, nuestra tienda pone a disposición del público el <strong>Libro de Reclamaciones Virtual</strong> en el pie de página de este portal para registrar formalmente cualquier queja o reclamo respecto a los bienes y servicios adquiridos.
            </p>
          </section>

          {/* Sección 10 */}
          <section id="sec-10" style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(52, 21, 57, 0.08)'
          }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--c-deep-purple)', marginTop: 0, marginBottom: '14px', fontWeight: 600 }}>
              10. Jurisdicción y Solución de Controversias
            </h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(52, 21, 57, 0.8)', margin: 0 }}>
              Cualquier discrepancia o controversia derivada de la interpretación o ejecución de los presentes términos se resolverá en primera instancia de mutuo acuerdo. En su defecto, las partes se someten expresamente a la competencia de los jueces y tribunales del <strong>Distrito Judicial de Lima, Perú</strong>, y a las instancias administrativas del <strong>INDECOPI</strong>.
            </p>
          </section>

        </div>

      </div>

    </div>
  );
}
