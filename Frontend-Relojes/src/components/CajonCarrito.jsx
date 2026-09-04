import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Send } from 'lucide-react';

export default function CajonCarrito({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  whatsappNumber = '51962956919'
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + (item.precio * item.quantity), 0);

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    let message = `🎩 *SOLICITUD DE ADQUISICIÓN VIP - AURELIA HAUTE HORLOGERIE*\n`;
    message += `═══════════════════════════\n`;
    if (customerName) message += `👤 *Cliente:* ${customerName}\n`;
    if (customerPhone) message += `📞 *Teléfono:* ${customerPhone}\n`;
    if (customerAddress) message += `📍 *Dirección de Entrega:* ${customerAddress}\n`;
    if (notes) message += `📝 *Observaciones:* ${notes}\n`;
    message += `═══════════════════════════\n`;
    message += `*GUARDATIEMPOS SELECCIONADOS:*\n`;

    items.forEach((item, index) => {
      message += `\n${index + 1}. *${item.nombre}*\n`;
      message += `   • Cantidad: ${item.quantity} ${item.unidadMedida || 'pza'}\n`;
      message += `   • Precio unitario: S/ ${Number(item.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n`;
      message += `   • Subtotal: S/ ${Number(item.precio * item.quantity).toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n`;
    });

    message += `\n═══════════════════════════\n`;
    message += `💰 *TOTAL GENERAL:* S/ ${Number(total).toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n`;
    message += `═══════════════════════════\n`;
    message += `🛡️ *Incluye:* Garantía Internacional 5 años, estuche de nogal y entrega asegurada.\n\n`;
    message += `Deseo coordinar la reserva y el método de pago con el Concierge.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encoded}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(45, 66, 98, 0.4)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end'
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid rgba(115, 96, 91, 0.2)',
          boxShadow: '-20px 0 60px rgba(45, 66, 98, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '28px',
          overflowY: 'auto'
        }}
      >
        {/* Header de la Bolsa */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '18px',
            borderBottom: '1px solid rgba(115, 96, 91, 0.15)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={20} color="var(--c-indigo)" />
              <h3 className="font-serif" style={{
                fontSize: '1.25rem',
                color: 'var(--c-deep-purple)',
                letterSpacing: '0.04em',
                fontWeight: 800
              }}>
                Bolsa de Adquisición VIP
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#f8f6f2',
                border: '1px solid rgba(115, 96, 91, 0.2)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--c-taupe)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Lista de Relojes en la Bolsa */}
          {items.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--c-taupe)'
            }}>
              <ShoppingBag size={48} color="var(--c-blush)" style={{ margin: '0 auto 16px' }} />
              <p className="font-serif" style={{ fontSize: '1.05rem', color: 'var(--c-deep-purple)', marginBottom: '8px', fontWeight: 700 }}>
                Tu bolsa está vacía
              </p>
              <p style={{ fontSize: '0.86rem', color: 'var(--c-taupe)' }}>
                Explora el catálogo y añade los guardatiempos que deseas adquirir.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '35vh', overflowY: 'auto', paddingRight: '4px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: '#f9f7f4',
                    border: '1px solid rgba(115, 96, 91, 0.12)'
                  }}
                >
                  <img
                    src={item.imagenUrl}
                    alt={item.nombre}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid rgba(115, 96, 91, 0.15)'
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4 className="font-serif" style={{
                      fontSize: '0.88rem',
                      color: 'var(--c-deep-purple)',
                      marginBottom: '4px',
                      lineHeight: 1.2,
                      fontWeight: 800
                    }}>
                      {item.nombre}
                    </h4>
                    <div style={{
                      fontSize: '0.86rem',
                      color: 'var(--c-indigo)',
                      fontWeight: 800
                    }}>
                      S/ {Number(item.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(115, 96, 91, 0.2)',
                          color: 'var(--c-deep-purple)',
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: '0.82rem', color: 'var(--c-deep-purple)', fontWeight: 700 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(115, 96, 91, 0.2)',
                          color: 'var(--c-deep-purple)',
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--c-taupe)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Eliminar de la bolsa"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Formulario Concierge de Entrega */}
          {items.length > 0 && (
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(115, 96, 91, 0.15)'
            }}>
              <div style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-serif)',
                color: 'var(--c-indigo)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 800,
                marginBottom: '10px'
              }}>
                ✦ Datos del Titular para la Entrega
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Nombre y Apellidos"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(115, 96, 91, 0.2)',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    color: 'var(--c-deep-purple)',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder="Teléfono / WhatsApp de contacto"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(115, 96, 91, 0.2)',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    color: 'var(--c-deep-purple)',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder="Dirección o Ciudad de Entrega"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(115, 96, 91, 0.2)',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    color: 'var(--c-deep-purple)',
                    fontSize: '0.84rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer y Checkout de WhatsApp */}
        {items.length > 0 && (
          <div style={{
            borderTop: '1px solid rgba(115, 96, 91, 0.15)',
            paddingTop: '20px',
            marginTop: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px',
              fontSize: '0.82rem',
              color: 'var(--c-taupe)'
            }}>
              <span>Custodia y Transporte Asegurado</span>
              <span style={{ color: 'var(--c-indigo)', fontWeight: 700 }}>Cortesía VIP (S/ 0.00)</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '18px'
            }}>
              <span className="font-serif" style={{ fontSize: '1rem', color: 'var(--c-deep-purple)', letterSpacing: '0.04em', fontWeight: 800 }}>
                Total a Liquidar:
              </span>
              <span className="font-serif" style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--c-indigo)'
              }}>
                S/ {Number(total).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={handleCheckoutWhatsApp}
              style={{
                width: '100%',
                background: '#25d366',
                color: '#ffffff',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.86rem',
                letterSpacing: '0.1em',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 18px rgba(37, 211, 102, 0.35)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Send size={16} />
              Finalizar Pedido con Concierge VIP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
