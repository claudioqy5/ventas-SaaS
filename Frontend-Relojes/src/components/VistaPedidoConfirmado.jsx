"use client";
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Copy, Check, Truck, MapPin, CreditCard, 
  ShoppingBag, ChevronLeft, ShieldCheck, FileText, 
  ExternalLink, Clock, ArrowRight, User, Lock, Award, PackageCheck
} from 'lucide-react';

function WhatsAppIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function VistaPedidoConfirmado({
  order,
  onBackToCatalog,
  onNavigate,
  user,
  whatsappNumber = '51962956919'
}) {
  const [copied, setCopied] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [accountPassword, setAccountPassword] = useState('');

  // Confetti elegante al montar la vista
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confettiModule) => {
          const confetti = confettiModule.default || confettiModule;
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.4 },
            colors: ['#D4AF37', '#1A1B1F', '#F5E6C8', '#0B0B0C']
          });
        }).catch(() => {});
      }
    } catch {}
  }, []);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleWhatsAppCoordination = () => {
    if (!order) return;
    const methodNames = {
      yape: 'Billetera Móvil (Yape/Plin)',
      tarjeta: 'Tarjeta de Crédito / Débito',
      transferencia: 'Transferencia Bancaria',
      contraentrega: 'Pago Contra Entrega'
    };

    const clientName = order.personalData 
      ? `${order.personalData.nombres} ${order.personalData.apellidos}`.trim()
      : (user ? user.nombre : 'Cliente');

    const address = order.deliveryAddress 
      ? `${order.deliveryAddress.direccion}, ${order.deliveryAddress.distrito}`
      : 'Dirección coordinada';

    const itemsSummary = (order.items || [])
      .map(i => `  • ${i.quantity}x ${i.nombre || i.name} (S/ ${(i.precio || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })})`)
      .join('\n');

    const message = 
      `👋 *COORDINACIÓN DE DESPACHO - L'GANT BOUTIQUE*\n\n` +
      `Hola, acabo de registrar mi compra en la tienda online:\n\n` +
      `📌 *Código de Pedido:* #${order.orderId}\n` +
      `👤 *Cliente:* ${clientName}\n` +
      `💳 *Método de Pago:* ${methodNames[order.paymentMethod] || order.paymentMethod}\n` +
      `📍 *Entrega en:* ${address}\n` +
      `💰 *Total Abonado:* S/ ${(order.total || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n\n` +
      (itemsSummary ? `📦 *Relojes:* \n${itemsSummary}\n\n` : '') +
      `Adjunto el comprobante de pago para proceder con la verificación y empaque de alta seguridad. ¡Muchas gracias!`;

    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`, '_blank');
  };

  // Fallback si no hay orden activa en sesión
  if (!order) {
    return (
      <div style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        backgroundColor: 'var(--bg-main)'
      }}>
        <div style={{
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          background: 'var(--bg-surface)',
          padding: '44px 32px',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid var(--c-blush)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <ShoppingBag size={28} color="var(--c-blush)" />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--c-obsidian)', fontWeight: 700, marginBottom: '10px' }}>
            No hay una orden reciente en esta sesión
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--c-taupe)', lineHeight: 1.6, marginBottom: '28px' }}>
            Si ya realizaste una adquisición, puedes revisar el estado detallado en tu historial de pedidos o continuar explorando nuestro catálogo de alta relojería.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate ? onNavigate('mis-compras') : onBackToCatalog()}
              className="btn-outline-luxury"
              style={{ padding: '12px 22px', fontSize: '0.85rem' }}
            >
              Ver Mis Compras
            </button>
            <button
              onClick={onBackToCatalog}
              style={{
                padding: '12px 24px',
                background: 'var(--c-obsidian)',
                color: 'var(--text-light)',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Explorar Catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const clientFirstName = order.personalData?.nombres || (user?.nombre || 'Cliente VIP');
  const clientFullName = order.personalData 
    ? `${order.personalData.nombres} ${order.personalData.apellidos}`.trim()
    : (user?.nombre || 'Cliente VIP');

  const recipientFullName = order.recipientType === 'yo'
    ? clientFullName
    : `${order.recipientData?.nombres || ''} ${order.recipientData?.apellidos || ''}`.trim();

  const recipientDni = order.recipientType === 'yo'
    ? (order.personalData?.numDoc || '')
    : (order.recipientData?.dni || '');

  const paymentLabels = {
    yape: 'Billetera Móvil (Yape / Plin)',
    tarjeta: 'Tarjeta de Crédito / Débito',
    transferencia: `Transferencia ${order.paymentDetails?.bancoTransferencia || 'Bancaria'}`,
    contraentrega: 'Pago Contra Entrega'
  };

  return (
    <div style={{
      minHeight: '85vh',
      backgroundColor: 'var(--bg-main)',
      paddingTop: '20px',
      paddingBottom: '80px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0 24px',
        fontFamily: 'var(--font-main)'
      }}>

        {/* Barra superior de retorno */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button
            onClick={onBackToCatalog}
            className="btn-outline-luxury"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '0.82rem'
            }}
          >
            <ChevronLeft size={16} /> Volver a la Tienda
          </button>

          <span style={{ fontSize: '0.8rem', color: 'var(--c-taupe)' }}>
            Fecha de Registro: <strong style={{ color: 'var(--c-obsidian)' }}>{order.date || new Date().toLocaleDateString('es-PE')}</strong>
          </span>
        </div>

        {/* HERO BANNER DE CONFIRMACIÓN */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          padding: '40px 32px',
          textAlign: 'center',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Sello de Autenticidad L'gant */}
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)',
            border: '2px solid var(--c-blush)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(212, 175, 55, 0.25)'
          }}>
            <CheckCircle2 size={40} color="var(--c-blush)" strokeWidth={2.2} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(212, 175, 55, 0.1)',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--c-blush)',
            fontWeight: 700,
            marginBottom: '10px'
          }}>
            <Award size={14} /> ORDEN CONFIRMADA CON ÉXITO
          </div>

          <h1 style={{
            fontSize: '2rem',
            color: 'var(--c-obsidian)',
            fontWeight: 700,
            margin: '0 0 10px',
            fontFamily: 'var(--font-main)',
            letterSpacing: '-0.02em'
          }}>
            ¡Gracias por tu compra, {clientFirstName}!
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--c-taupe)',
            maxWidth: '680px',
            margin: '0 auto 24px',
            lineHeight: 1.5
          }}>
            Tu orden ha sido registrada en nuestro sistema de custodia y empaque. A continuación encontrarás el resumen oficial de tu adquisición.
          </p>

          {/* Badge interactivo de Código de Pedido */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: '30px',
            padding: '8px 20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--c-taupe)' }}>Código de Pedido:</span>
            <span style={{ fontSize: '1rem', color: 'var(--c-obsidian)', fontWeight: 700, letterSpacing: '0.04em' }}>
              #{order.orderId}
            </span>
            <button
              onClick={() => handleCopyCode(order.orderId)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: copied ? '#e6f7ed' : '#f5f5f7',
                border: 'none',
                borderRadius: '16px',
                padding: '4px 10px',
                fontSize: '0.75rem',
                color: copied ? '#16a34a' : 'var(--c-obsidian)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Copiar código al portapapeles"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* LAYOUT PRINCIPAL DE 2 COLUMNAS (CONTENIDO + ACCIONES) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.1fr)',
          gap: '32px',
          alignItems: 'start'
        }}>

          {/* COLUMNA IZQUIERDA: DETALLES DE LA COMPRA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Tarjeta: Artículos Adquiridos */}
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '14px',
              border: '1px solid var(--border-light)',
              padding: '24px 26px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-light)',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={18} color="var(--c-blush)" />
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--c-obsidian)', fontWeight: 600, margin: 0 }}>
                    Relojes Adquiridos ({order.items ? order.items.reduce((acc, it) => acc + (it.quantity || 1), 0) : 0})
                  </h3>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--c-taupe)' }}>
                  Garantía Oficial Incluida
                </span>
              </div>

              {/* Lista de productos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(order.items || []).map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: idx === order.items.length - 1 ? '0' : '16px',
                    borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #f2f2f4'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '8px',
                        background: '#f8f8fa',
                        border: '1px solid #eaeaec',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {item.imagen ? (
                          <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <ShoppingBag size={22} color="#a0a0a5" />
                        )}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--c-obsidian)', marginBottom: '4px' }}>
                          {item.nombre || item.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--c-taupe)' }}>
                          Cantidad: <strong style={{ color: 'var(--c-obsidian)' }}>{item.quantity}</strong>
                          {item.color && <span> • Color: {item.color}</span>}
                          {item.codigoModelo && <span> • Modelo: {item.codigoModelo}</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-obsidian)' }}>
                        S/ {((item.precio || 0) * (item.quantity || 1)).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--c-taupe)' }}>
                        S/ {(item.precio || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })} c/u
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desglose de Totales */}
              <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.88rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--c-taupe)' }}>
                  <span>Subtotal:</span>
                  <span style={{ color: 'var(--c-obsidian)', fontWeight: 500 }}>
                    S/ {(order.subtotal || order.total || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--c-taupe)' }}>
                  <span>Transporte y Custodia Asegurada:</span>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>Envío Gratis</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '2px dashed var(--border-light)',
                  paddingTop: '12px',
                  marginTop: '6px',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--c-obsidian)'
                }}>
                  <span>Total Abonado:</span>
                  <span style={{ color: 'var(--c-blush)', fontSize: '1.25rem' }}>
                    S/ {(order.total || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjeta: Información de Entrega & Facturación */}
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '14px',
              border: '1px solid var(--border-light)',
              padding: '24px 26px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              {/* Bloque Entrega */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Truck size={17} color="var(--c-blush)" />
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--c-obsidian)', fontWeight: 600, margin: 0 }}>
                    Destino y Entrega
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--c-taupe)' }}>Destinatario: </span>
                    <strong style={{ color: 'var(--c-obsidian)' }}>{recipientFullName}</strong>
                  </div>
                  {recipientDni && (
                    <div>
                      <span style={{ color: 'var(--c-taupe)' }}>Documento (DNI): </span>
                      <strong style={{ color: 'var(--c-obsidian)' }}>{recipientDni}</strong>
                    </div>
                  )}
                  {order.deliveryAddress && (
                    <>
                      <div>
                        <span style={{ color: 'var(--c-taupe)' }}>Dirección: </span>
                        <span style={{ color: 'var(--c-obsidian)', fontWeight: 500 }}>
                          {order.deliveryAddress.direccion}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--c-taupe)' }}>Ubicación: </span>
                        <span style={{ color: 'var(--c-obsidian)', fontWeight: 500 }}>
                          {order.deliveryAddress.distrito}, {order.deliveryAddress.provincia}, {order.deliveryAddress.departamento}
                        </span>
                      </div>
                      {order.deliveryAddress.referencia && (
                        <div>
                          <span style={{ color: 'var(--c-taupe)' }}>Referencia: </span>
                          <span style={{ color: 'var(--c-obsidian)', fontStyle: 'italic' }}>
                            {order.deliveryAddress.referencia}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Bloque Pago y Comprobante */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <CreditCard size={17} color="var(--c-blush)" />
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--c-obsidian)', fontWeight: 600, margin: 0 }}>
                    Pago y Comprobante
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--c-taupe)' }}>Método: </span>
                    <strong style={{ color: 'var(--c-obsidian)' }}>
                      {paymentLabels[order.paymentMethod] || order.paymentMethod}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-taupe)' }}>Comprobante: </span>
                    <strong style={{ color: 'var(--c-obsidian)' }}>
                      {order.tipoComprobante === 'factura' ? 'Factura Electrónica' : 'Boleta de Venta'}
                    </strong>
                  </div>
                  {order.tipoComprobante === 'factura' && order.facturaData?.ruc && (
                    <>
                      <div>
                        <span style={{ color: 'var(--c-taupe)' }}>RUC: </span>
                        <strong style={{ color: 'var(--c-obsidian)' }}>{order.facturaData.ruc}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--c-taupe)' }}>Razón Social: </span>
                        <span style={{ color: 'var(--c-obsidian)' }}>{order.facturaData.razonSocial}</span>
                      </div>
                    </>
                  )}
                  {order.paymentDetails?.codigoOperacionYape && (
                    <div>
                      <span style={{ color: 'var(--c-taupe)' }}>Operación Yape: </span>
                      <strong style={{ color: 'var(--c-blush)' }}>{order.paymentDetails.codigoOperacionYape}</strong>
                    </div>
                  )}
                  {order.paymentDetails?.codigoOperacionTransferencia && (
                    <div>
                      <span style={{ color: 'var(--c-taupe)' }}>N° Operación: </span>
                      <strong style={{ color: 'var(--c-blush)' }}>{order.paymentDetails.codigoOperacionTransferencia}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Panel Informativo: Próximos pasos de entrega */}
            <div style={{
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.28)',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '0.88rem',
              color: 'var(--c-obsidian)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '6px' }}>
                <ShieldCheck size={18} color="var(--c-blush)" /> Siguiente paso para tu despacho:
              </div>
              {order.paymentMethod === 'yape' || order.paymentMethod === 'transferencia' ? (
                <p style={{ margin: 0, color: 'var(--c-taupe)', lineHeight: 1.5 }}>
                  Por favor envíanos la captura o constancia de tu operación por WhatsApp pulsando el botón verde de la derecha. De esta forma registramos tu pago de inmediato y procedemos al empaque sellado de alta seguridad.
                </p>
              ) : order.paymentMethod === 'contraentrega' ? (
                <p style={{ margin: 0, color: 'var(--c-taupe)', lineHeight: 1.5 }}>
                  Nos pondremos en contacto contigo vía WhatsApp o llamada para confirmar la fecha y franja horaria de entrega en tu domicilio antes del despacho.
                </p>
              ) : (
                <p style={{ margin: 0, color: 'var(--c-taupe)', lineHeight: 1.5 }}>
                  Tu pago ha sido validado correctamente. En breve recibirás el código de seguimiento de tu encomienda para rastrear el trayecto del courier.
                </p>
              )}
            </div>

          </div>

          {/* COLUMNA DERECHA: ACCIONES Y SELLOS DE CONFIANZA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Caja de Acciones Inmediatas */}
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '14px',
              border: '1px solid var(--border-light)',
              padding: '26px 24px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
            }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--c-obsidian)', fontWeight: 700, margin: '0 0 16px' }}>
                ¿Qué deseas hacer ahora?
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Botón Principal WhatsApp */}
                <button
                  onClick={handleWhatsAppCoordination}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    background: '#25D366',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(37, 211, 102, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <WhatsAppIcon size={22} color="#ffffff" />
                  Coordinar Despacho por WhatsApp
                </button>

                {/* Botón Ver Mis Compras */}
                <button
                  onClick={() => onNavigate ? onNavigate('mis-compras') : onBackToCatalog()}
                  style={{
                    width: '100%',
                    padding: '13px 20px',
                    background: '#ffffff',
                    color: 'var(--c-obsidian)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--c-blush)';
                    e.currentTarget.style.background = '#fdfbf7';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  <PackageCheck size={18} color="var(--c-blush)" />
                  Ver Mis Compras y Seguimiento
                </button>

                {/* Botón Volver al Catálogo */}
                <button
                  onClick={onBackToCatalog}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'transparent',
                    color: 'var(--c-taupe)',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--c-obsidian)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--c-taupe)'}
                >
                  Continuar viendo el catálogo <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Registro de Cuenta Post-Compra (Solo si no está autenticado) */}
            {!user && (
              <div style={{
                background: 'var(--bg-surface)',
                borderRadius: '14px',
                border: '1px solid var(--border-light)',
                padding: '22px 20px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--c-obsidian)', marginBottom: '4px' }}>
                  ¿Deseas guardar tu cuenta VIP?
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--c-taupe)', lineHeight: 1.4, marginBottom: '14px' }}>
                  Crea una contraseña para acceder a tu historial de compras y realizar futuras adquisiciones en 1 solo clic.
                </p>

                {accountCreated ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.82rem',
                    color: '#16a34a',
                    fontWeight: 600,
                    background: '#e6f7ed',
                    padding: '10px 14px',
                    borderRadius: '6px'
                  }}>
                    <Check size={16} /> ¡Cuenta guardada exitosamente para {order.personalData?.email || 'tu perfil'}!
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="password" 
                      value={accountPassword}
                      onChange={e => setAccountPassword(e.target.value)}
                      placeholder="Crea una contraseña segura"
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '1px solid var(--border-light)',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        outline: 'none'
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (accountPassword.trim().length >= 6) {
                          setAccountCreated(true);
                        }
                      }}
                      style={{
                        padding: '10px 16px',
                        background: 'var(--c-obsidian)',
                        color: 'var(--text-light)',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Guardar
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tarjeta de Garantías y Compromiso L'gant */}
            <div style={{
              background: 'linear-gradient(135deg, #111215 0%, #1a1b1f 100%)',
              color: '#ffffff',
              borderRadius: '14px',
              padding: '24px 22px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}>
              <h4 style={{
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--c-blush)',
                fontWeight: 700,
                margin: '0 0 16px'
              }}>
                Compromiso de Alta Relojería
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Award size={18} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: '#ffffff' }}>100% Autenticidad Garantizada</strong>
                    <span style={{ color: '#a0a0a5' }}>Incluye caja original de fábrica, estuche y manual de usuario.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <ShieldCheck size={18} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: '#ffffff' }}>Custodia y Empaque Blindado</strong>
                    <span style={{ color: '#a0a0a5' }}>Protección de alta seguridad sellada hasta la entrega a tus manos.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Clock size={18} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: '#ffffff' }}>Atención Personalizada Concierge</strong>
                    <span style={{ color: '#a0a0a5' }}>Asistencia continua antes, durante y después de tu entrega.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
