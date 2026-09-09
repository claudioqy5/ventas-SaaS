import React, { useState } from 'react';
import { ShoppingBag, User, Truck, CreditCard, ChevronLeft, Trash2 } from 'lucide-react';

export default function ProcesoPago({ items = [], onUpdateQuantity, onRemoveItem, onBack }) {
  const [currentStep, setCurrentStep] = useState(1);

  const subtotal = items.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
  const discount = 0;
  const total = subtotal - discount;

  const steps = [
    { id: 1, label: 'Carrito de compras', icon: ShoppingBag },
    { id: 2, label: 'Datos personales', icon: User },
    { id: 3, label: 'Datos de entrega', icon: Truck },
    { id: 4, label: 'Método de pago', icon: CreditCard }
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-main)', paddingTop: '30px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', fontFamily: 'var(--font-main)' }}>
        {/* Header and Back Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-logo)', fontSize: '2rem', color: 'var(--c-obsidian)', letterSpacing: '0.05em', margin: 0, cursor: 'pointer' }} onClick={onBack}>
            L'GANT
          </h1>
          <button 
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            <ChevronLeft size={16} /> Comprar más productos
          </button>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '50px', overflowX: 'auto', paddingBottom: '10px' }}>
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isPassed = currentStep > step.id;
            const StepIcon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '110px' }}>
                  <div style={{ 
                    width: '46px', height: '46px', 
                    borderRadius: '50%', 
                    border: `2px solid ${isActive || isPassed ? 'var(--c-blush)' : 'rgba(59, 60, 65, 0.2)'}`,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    color: isActive || isPassed ? 'var(--bg-surface)' : 'var(--c-taupe)',
                    backgroundColor: isActive || isPassed ? 'var(--c-blush)' : 'transparent',
                    marginBottom: '10px',
                    transition: 'all 0.3s'
                  }}>
                    <StepIcon size={20} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 600 : 500, color: isActive ? 'var(--c-obsidian)' : 'var(--c-taupe)', textAlign: 'center', lineHeight: 1.3 }}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div style={{ 
                    height: '2px', width: '60px', 
                    backgroundColor: isPassed ? 'var(--c-blush)' : 'rgba(59, 60, 65, 0.2)',
                    margin: '0 5px', alignSelf: 'flex-start', marginTop: '22px',
                    transition: 'all 0.3s'
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main Content Layout */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Left Side - Cart Items Table */}
          <div style={{ flex: '1 1 600px', background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-subtle)' }}>
            {currentStep === 1 && (
              <>
                {items.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--c-taupe)' }}>
                    <ShoppingBag size={48} style={{ opacity: 0.3, margin: '0 auto 15px' }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--c-obsidian)' }}>Tu carrito de compras está vacío.</p>
                    <button onClick={onBack} style={{ marginTop: '20px', padding: '10px 24px', background: 'var(--c-blush)', color: 'var(--c-obsidian)', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                      Explorar el catálogo
                    </button>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--c-obsidian)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                          <th style={{ padding: '12px 0', textAlign: 'left', width: '45%' }}>PRODUCTO</th>
                          <th style={{ padding: '12px 0', textAlign: 'center' }}>PRECIO</th>
                          <th style={{ padding: '12px 0', textAlign: 'center' }}>CANTIDAD</th>
                          <th style={{ padding: '12px 0', textAlign: 'center' }}>TOTAL</th>
                          <th style={{ padding: '12px 0', textAlign: 'center', width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => (
                          <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '20px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <img src={item.imagenUrl} alt={item.nombre} style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(59,60,65,0.1)' }} />
                              <div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--c-taupe)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>L'GANT</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--c-obsidian)', fontWeight: 600, lineHeight: 1.3 }}>{item.nombre}</div>
                              </div>
                            </td>
                            <td style={{ padding: '20px 0', textAlign: 'center', fontWeight: 500, color: 'var(--c-taupe)', fontSize: '0.9rem' }}>
                              S/ {Number(item.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: '20px 0', textAlign: 'center' }}>
                              <div style={{ display: 'inline-flex', border: '1px solid var(--border-light)', borderRadius: '6px', overflow: 'hidden' }}>
                                <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} style={{ width: '32px', height: '32px', border: 'none', background: '#f9f7f4', cursor: 'pointer', color: 'var(--c-obsidian)' }}>-</button>
                                <div style={{ width: '40px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>{item.quantity}</div>
                                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} style={{ width: '32px', height: '32px', border: 'none', background: '#f9f7f4', cursor: 'pointer', color: 'var(--c-obsidian)' }}>+</button>
                              </div>
                            </td>
                            <td style={{ padding: '20px 0', textAlign: 'center', fontWeight: 600, color: 'var(--c-obsidian)', fontSize: '0.9rem' }}>
                              S/ {(item.precio * item.quantity).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ padding: '20px 0', textAlign: 'center' }}>
                              <button onClick={() => onRemoveItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--c-taupe)', cursor: 'pointer', padding: '6px' }}>
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            {currentStep > 1 && (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--c-taupe)' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--c-obsidian)', fontWeight: 600, marginBottom: '10px' }}>
                  Paso: {steps.find(s => s.id === currentStep).label}
                </p>
                <p style={{ fontSize: '0.9rem', marginBottom: '30px' }}>
                  Este formulario se implementará próximamente según los requerimientos del método de pago.
                </p>
                <button 
                  onClick={() => setCurrentStep(currentStep - 1)} 
                  style={{ padding: '10px 24px', borderRadius: '4px', background: 'transparent', border: '1px solid var(--c-obsidian)', color: 'var(--c-obsidian)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Regresar al paso anterior
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Summary */}
          <div style={{ width: '100%', maxWidth: '380px', background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-subtle)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '35px' }}>
              <input type="text" placeholder="Cupón de descuento" style={{ flex: 1, padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.85rem', outline: 'none', fontFamily: 'var(--font-main)' }} />
              <button style={{ background: 'var(--c-obsidian)', color: 'var(--text-light)', border: 'none', padding: '0 20px', borderRadius: '6px', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.05em', cursor: 'pointer' }}>AGREGAR</button>
            </div>
            
            <h3 style={{ fontSize: '1.05rem', color: 'var(--c-obsidian)', fontWeight: 700, textAlign: 'center', marginBottom: '25px', letterSpacing: '0.05em' }}>RESUMEN DE COMPRA</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--c-taupe)' }}>
              <span>Subtotal</span>
              <span>S/ {subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.9rem', color: 'var(--c-taupe)' }}>
              <span>Descuentos</span>
              <span>S/ {discount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(59,60,65,0.15)', paddingTop: '20px', marginBottom: '30px', fontSize: '1.2rem', color: 'var(--c-obsidian)', fontWeight: 700 }}>
              <span>TOTAL</span>
              <span>S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
            </div>
            
            <button 
              disabled={items.length === 0}
              onClick={() => { if (currentStep < 4) setCurrentStep(currentStep + 1); }}
              style={{ 
                width: '100%', padding: '16px', 
                background: items.length === 0 ? '#e2e8f0' : 'var(--c-blush)', 
                color: items.length === 0 ? '#94a3b8' : 'var(--c-obsidian)', 
                border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.95rem', 
                letterSpacing: '0.05em', cursor: items.length === 0 ? 'not-allowed' : 'pointer', 
                transition: 'all 0.3s' 
              }}
            >
              {currentStep < 4 ? 'SIGUIENTE →' : 'FINALIZAR COMPRA'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
