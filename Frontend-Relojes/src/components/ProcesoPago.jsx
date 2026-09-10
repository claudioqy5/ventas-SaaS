import React, { useState } from 'react';
import { 
  ShoppingBag, User, Truck, CreditCard, ChevronLeft, Trash2, MapPin,
  Building2, PackageCheck, Copy, Check, ShieldCheck, Lock,
  CheckCircle2, Smartphone, AlertCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';

const DeliveryMap = dynamic(() => import('./DeliveryMap'), { ssr: false });

// Ícono SVG oficial de WhatsApp sin dependencias externas
function WhatsAppIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Ilustración vectorial SVG de Código QR para Yape / Plin
function LuxuryQRCode({ size = 150 }) {
  return (
    <div style={{
      width: size,
      height: size,
      background: '#ffffff',
      padding: '10px',
      borderRadius: '12px',
      border: '2px solid var(--c-blush)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
    }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" fill="var(--c-obsidian)">
        <rect x="6" y="6" width="26" height="26" rx="4" fill="none" stroke="var(--c-obsidian)" strokeWidth="4" />
        <rect x="12" y="12" width="14" height="14" rx="2" fill="var(--c-blush)" />
        
        <rect x="68" y="6" width="26" height="26" rx="4" fill="none" stroke="var(--c-obsidian)" strokeWidth="4" />
        <rect x="74" y="12" width="14" height="14" rx="2" fill="var(--c-blush)" />
        
        <rect x="6" y="68" width="26" height="26" rx="4" fill="none" stroke="var(--c-obsidian)" strokeWidth="4" />
        <rect x="12" y="74" width="14" height="14" rx="2" fill="var(--c-blush)" />
        
        <rect x="38" y="9" width="6" height="6" rx="1" />
        <rect x="48" y="9" width="6" height="6" rx="1" />
        <rect x="58" y="9" width="6" height="6" rx="1" />
        <rect x="38" y="19" width="12" height="6" rx="1" />
        <rect x="54" y="19" width="8" height="6" rx="1" />
        <rect x="9" y="38" width="6" height="6" rx="1" />
        <rect x="19" y="38" width="12" height="6" rx="1" />
        <rect x="9" y="48" width="12" height="6" rx="1" />
        <rect x="9" y="58" width="6" height="6" rx="1" />
        
        <circle cx="50" cy="50" r="13" fill="var(--c-obsidian)" />
        <circle cx="50" cy="50" r="11" fill="none" stroke="var(--c-blush)" strokeWidth="1.5" />
        <text x="50" y="54" textAnchor="middle" fill="var(--c-blush)" fontSize="10" fontWeight="bold" fontFamily="serif">L</text>
        
        <rect x="71" y="38" width="8" height="6" rx="1" />
        <rect x="83" y="38" width="8" height="6" rx="1" />
        <rect x="67" y="48" width="6" height="6" rx="1" />
        <rect x="77" y="48" width="14" height="6" rx="1" />
        <rect x="71" y="58" width="10" height="6" rx="1" />
        <rect x="85" y="58" width="6" height="6" rx="1" />
        <rect x="38" y="71" width="8" height="6" rx="1" />
        <rect x="50" y="71" width="12" height="6" rx="1" />
        <rect x="38" y="81" width="12" height="6" rx="1" />
        <rect x="54" y="81" width="8" height="6" rx="1" />
        <rect x="67" y="68" width="6" height="6" rx="1" />
        <rect x="77" y="76" width="14" height="6" rx="1" />
        <rect x="69" y="86" width="10" height="6" rx="1" />
        <rect x="83" y="86" width="8" height="6" rx="1" />
      </svg>
    </div>
  );
}

export default function ProcesoPago({ 
  items = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onBack,
  onClearCart
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});

  // PASO 2: Datos Personales (Guest Checkout)
  const [personalData, setPersonalData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    tipoDoc: 'DNI',
    numDoc: '',
    telefono: ''
  });

  // PASO 3: Datos de Entrega
  const [recipientType, setRecipientType] = useState('yo');
  const [recipientData, setRecipientData] = useState({ nombres: '', apellidos: '', dni: '' });
  const [deliveryAddress, setDeliveryAddress] = useState({
    departamento: '', provincia: '', distrito: '', direccion: '', referencia: ''
  });
  const [mapPosition, setMapPosition] = useState({ lat: -12.0464, lng: -77.0428 });
  const [additionalNotes, setAdditionalNotes] = useState('');

  // PASO 4: Método de Pago
  const [paymentMethod, setPaymentMethod] = useState('yape'); // 'yape' | 'tarjeta' | 'transferencia' | 'contraentrega'
  const [paymentDetails, setPaymentDetails] = useState({
    codigoOperacionYape: '',
    tarjetaNumero: '',
    tarjetaNombre: '',
    tarjetaExpiracion: '',
    tarjetaCvv: '',
    bancoTransferencia: 'BCP',
    codigoOperacionTransferencia: '',
    modoContraentrega: 'efectivo'
  });

  // Comprobante y Términos
  const [tipoComprobante, setTipoComprobante] = useState('boleta'); // 'boleta' | 'factura'
  const [facturaData, setFacturaData] = useState({ ruc: '', razonSocial: '', direccionFiscal: '' });
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [copiedText, setCopiedText] = useState('');

  // Estado de Orden Exitosa
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [accountPassword, setAccountPassword] = useState('');

  const subtotal = items.reduce((acc, item) => acc + (item.precio * item.quantity), 0);
  const discount = 0;
  const total = subtotal - discount;

  const steps = [
    { id: 1, label: 'Carrito de compras', icon: ShoppingBag },
    { id: 2, label: 'Datos personales', icon: User },
    { id: 3, label: 'Datos de entrega', icon: Truck },
    { id: 4, label: 'Método de pago', icon: CreditCard }
  ];

  const handleCopy = (text, key) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(key);
      setTimeout(() => setCopiedText(''), 2500);
    }
  };

  // Validaciones por paso
  const validateStep2 = () => {
    const errors = {};
    if (!personalData.nombres.trim()) errors.nombres = 'Ingresa tus nombres';
    if (!personalData.apellidos.trim()) errors.apellidos = 'Ingresa tus apellidos';
    if (!personalData.email.trim() || !personalData.email.includes('@')) errors.email = 'Ingresa un correo electrónico válido';
    if (!personalData.numDoc.trim()) errors.numDoc = 'Ingresa tu número de documento';
    if (!personalData.telefono.trim() || personalData.telefono.length < 8) errors.telefono = 'Ingresa un teléfono válido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors = {};
    if (!deliveryAddress.departamento.trim()) errors.departamento = 'Indica el departamento';
    if (!deliveryAddress.provincia.trim()) errors.provincia = 'Indica la provincia';
    if (!deliveryAddress.distrito.trim()) errors.distrito = 'Indica el distrito';
    if (!deliveryAddress.direccion.trim()) errors.direccion = 'Indica la dirección exacta de entrega';
    if (recipientType === 'otro') {
      if (!recipientData.nombres.trim()) errors.recipientNombres = 'Indica los nombres del receptor';
      if (!recipientData.apellidos.trim()) errors.recipientApellidos = 'Indica los apellidos del receptor';
      if (!recipientData.dni.trim()) errors.recipientDni = 'Indica el DNI del receptor';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = () => {
    const errors = {};
    if (paymentMethod === 'yape' && !paymentDetails.codigoOperacionYape.trim()) {
      errors.codigoOperacionYape = 'Ingresa el código de operación de Yape / Plin';
    }
    if (paymentMethod === 'transferencia' && !paymentDetails.codigoOperacionTransferencia.trim()) {
      errors.codigoOperacionTransferencia = 'Ingresa el número de constancia o comprobante';
    }
    if (paymentMethod === 'tarjeta') {
      const cleanNum = paymentDetails.tarjetaNumero.replace(/\s+/g, '');
      if (!cleanNum || cleanNum.length < 15) {
        errors.tarjetaNumero = 'Número de tarjeta incompleto (15 o 16 dígitos)';
      }
      if (!paymentDetails.tarjetaNombre.trim()) {
        errors.tarjetaNombre = 'Ingresa el nombre como figura en el plástico';
      }
      if (!paymentDetails.tarjetaExpiracion.trim()) {
        errors.tarjetaExpiracion = 'Indica MM/AA';
      }
      if (!paymentDetails.tarjetaCvv.trim() || paymentDetails.tarjetaCvv.length < 3) {
        errors.tarjetaCvv = 'CVV inválido';
      }
    }
    if (tipoComprobante === 'factura') {
      if (!facturaData.ruc.trim() || facturaData.ruc.length !== 11) {
        errors.ruc = 'El RUC debe tener 11 dígitos numéricos';
      }
      if (!facturaData.razonSocial.trim()) {
        errors.razonSocial = 'Ingresa la Razón Social';
      }
    }
    if (!termsAccepted) {
      errors.terms = 'Debes aceptar los términos y condiciones para continuar';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (items.length > 0) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    } else if (currentStep === 4) {
      handleFinalizarCompra();
    }
  };

  const handleFinalizarCompra = () => {
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }
    if (!validateStep3()) {
      setCurrentStep(3);
      return;
    }
    if (!validateStep4()) {
      return;
    }

    const orderId = `LGT-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      subtotal,
      discount,
      total,
      personalData,
      deliveryAddress,
      recipientType,
      recipientData,
      additionalNotes,
      paymentMethod,
      paymentDetails,
      tipoComprobante,
      facturaData
    };

    // Confetti de celebración elegante sin emojis
    try {
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confettiModule) => {
          const confetti = confettiModule.default || confettiModule;
          confetti({
            particleCount: 110,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#1A1B1F', '#F5E6C8', '#0B0B0C']
          });
        }).catch(() => {});
      }
    } catch {}

    setOrderSuccess(newOrder);
    if (onClearCart) onClearCart();
  };

  const handleWhatsAppCoordination = () => {
    if (!orderSuccess) return;
    const phone = '51962956919';
    const methodNames = {
      yape: 'Billetera Móvil (Yape/Plin)',
      tarjeta: 'Tarjeta de Crédito/Débito',
      transferencia: 'Transferencia Bancaria',
      contraentrega: 'Pago Contra Entrega'
    };

    const message = `Hola L'gant, acabo de registrar mi pedido *#${orderSuccess.orderId}* en la tienda online.
- *Cliente:* ${orderSuccess.personalData.nombres} ${orderSuccess.personalData.apellidos}
- *Total:* S/ ${orderSuccess.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
- *Método de Pago:* ${methodNames[orderSuccess.paymentMethod] || orderSuccess.paymentMethod}
- *Entrega en:* ${orderSuccess.deliveryAddress.direccion}, ${orderSuccess.deliveryAddress.distrito}
Deseo coordinar el despacho y verificación de mi compra.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`, '_blank');
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-main)', paddingTop: '30px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', fontFamily: 'var(--font-main)' }}>
        
        {/* Encabezado y botón Volver */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1vh' }}>
          <button 
            onClick={onBack}
            className="btn-outline-luxury"
            style={{ padding: '10px 20px', fontSize: '0.8rem' }}
          >
            <ChevronLeft size={16} /> Volver al catálogo
          </button>
        </div>

        {/* Stepper Superior */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '1vh', overflowX: 'auto', paddingBottom: '1vh' }}>
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isPassed = currentStep > step.id;
            const isClickable = step.id < currentStep;
            const StepIcon = step.icon;
            
            return (
              <React.Fragment key={step.id}>
                <div 
                  onClick={() => { if (isClickable) setCurrentStep(step.id); }}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    width: '110px',
                    cursor: isClickable ? 'pointer' : 'default',
                    opacity: isClickable ? 0.85 : 1,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => { if (isClickable) e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { if (isClickable) e.currentTarget.style.opacity = '0.85'; }}
                >
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

        {/* Layout Principal: Formulario a la Izquierda y Resumen a la Derecha */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 600px', background: 'var(--bg-surface)', padding: '28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-subtle)' }}>
            
            {/* PASO 1: Carrito de Compras */}
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

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                      <button 
                        onClick={() => setCurrentStep(2)}
                        style={{ padding: '14px 28px', background: 'var(--c-obsidian)', color: 'var(--text-light)', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em', cursor: 'pointer' }}
                      >
                        CONTINUAR
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* PASO 2: Datos Personales (Completamente como Invitado) */}
            {currentStep === 2 && (
              <div style={{ padding: '10px 0' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--c-obsidian)', fontWeight: 600, marginBottom: '8px' }}>Datos Personales</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--c-taupe)', marginBottom: '25px' }}>
                  Completa tus datos para enviarte la confirmación de compra y tu comprobante.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Nombres *</label>
                    <input 
                      type="text" 
                      value={personalData.nombres}
                      onChange={e => {
                        setPersonalData({...personalData, nombres: e.target.value});
                        if (formErrors.nombres) setFormErrors({...formErrors, nombres: null});
                      }}
                      style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.nombres ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                      placeholder="Ej. Juan Carlos" 
                    />
                    {formErrors.nombres && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.nombres}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Apellidos *</label>
                    <input 
                      type="text" 
                      value={personalData.apellidos}
                      onChange={e => {
                        setPersonalData({...personalData, apellidos: e.target.value});
                        if (formErrors.apellidos) setFormErrors({...formErrors, apellidos: null});
                      }}
                      style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.apellidos ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                      placeholder="Ej. Pérez Gómez" 
                    />
                    {formErrors.apellidos && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.apellidos}</span>}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Correo Electrónico *</label>
                  <input 
                    type="email" 
                    value={personalData.email}
                    onChange={e => {
                      setPersonalData({...personalData, email: e.target.value});
                      if (formErrors.email) setFormErrors({...formErrors, email: null});
                    }}
                    style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.email ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                    placeholder="ejemplo@correo.com" 
                  />
                  {formErrors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.email}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Tipo Documento *</label>
                    <select 
                      value={personalData.tipoDoc}
                      onChange={e => setPersonalData({...personalData, tipoDoc: e.target.value})}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)', backgroundColor: '#fff', color: 'var(--c-obsidian)' }}
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="PASAPORTE">Pasaporte</option>
                      <option value="RUC">RUC</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Número de Documento *</label>
                    <input 
                      type="text" 
                      value={personalData.numDoc}
                      onChange={e => {
                        setPersonalData({...personalData, numDoc: e.target.value});
                        if (formErrors.numDoc) setFormErrors({...formErrors, numDoc: null});
                      }}
                      style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.numDoc ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                      placeholder="Tu número de documento" 
                    />
                    {formErrors.numDoc && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.numDoc}</span>}
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Teléfono Móvil (WhatsApp) *</label>
                  <div style={{ display: 'flex' }}>
                    <span style={{ padding: '12px 14px', border: `1px solid ${formErrors.telefono ? '#ef4444' : 'var(--border-light)'}`, borderRight: 'none', borderRadius: '6px 0 0 6px', background: '#f9f7f4', color: 'var(--c-taupe)', fontSize: '0.9rem' }}>+51</span>
                    <input 
                      type="tel" 
                      value={personalData.telefono}
                      onChange={e => {
                        setPersonalData({...personalData, telefono: e.target.value});
                        if (formErrors.telefono) setFormErrors({...formErrors, telefono: null});
                      }}
                      style={{ flex: 1, padding: '12px 14px', border: `1px solid ${formErrors.telefono ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '0 6px 6px 0', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                      placeholder="999 999 999" 
                    />
                  </div>
                  {formErrors.telefono && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.telefono}</span>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                  <button 
                    onClick={() => setCurrentStep(1)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--c-taupe)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    <ChevronLeft size={18} /> Volver al carrito
                  </button>
                  <button 
                    onClick={() => {
                      if (validateStep2()) setCurrentStep(3);
                    }} 
                    style={{ padding: '14px 28px', background: 'var(--c-obsidian)', color: 'var(--text-light)', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em', cursor: 'pointer' }}
                  >
                    CONTINUAR
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: Datos de Entrega y Mapa */}
            {currentStep === 3 && (
              <div style={{ padding: '10px 0' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--c-obsidian)', fontWeight: 600, marginBottom: '8px' }}>Datos de Entrega</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--c-taupe)', marginBottom: '20px' }}>
                  Indica quién recibirá el reloj y selecciona tu ubicación para el despacho.
                </p>
                
                <div style={{ marginBottom: '25px', display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--c-obsidian)' }}>
                    <input type="radio" name="recipient" value="yo" checked={recipientType === 'yo'} onChange={() => setRecipientType('yo')} style={{ accentColor: 'var(--c-obsidian)' }} />
                    Yo recibiré el pedido
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--c-obsidian)' }}>
                    <input type="radio" name="recipient" value="otro" checked={recipientType === 'otro'} onChange={() => setRecipientType('otro')} style={{ accentColor: 'var(--c-obsidian)' }} />
                    Otra persona recibirá el pedido
                  </label>
                </div>

                {recipientType === 'otro' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', padding: '20px', background: '#fcfbf8', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Nombres del receptor *</label>
                      <input 
                        type="text" 
                        value={recipientData.nombres} 
                        onChange={e => setRecipientData({...recipientData, nombres: e.target.value})} 
                        style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.recipientNombres ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                        placeholder="Ej. Ana" 
                      />
                      {formErrors.recipientNombres && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.recipientNombres}</span>}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Apellidos del receptor *</label>
                      <input 
                        type="text" 
                        value={recipientData.apellidos} 
                        onChange={e => setRecipientData({...recipientData, apellidos: e.target.value})} 
                        style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.recipientApellidos ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                        placeholder="Ej. Silva" 
                      />
                      {formErrors.recipientApellidos && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.recipientApellidos}</span>}
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>DNI del receptor *</label>
                      <input 
                        type="text" 
                        value={recipientData.dni} 
                        onChange={e => setRecipientData({...recipientData, dni: e.target.value})} 
                        style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.recipientDni ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                        placeholder="Número de DNI" 
                      />
                      {formErrors.recipientDni && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.recipientDni}</span>}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--c-obsidian)', fontWeight: 600, marginBottom: '8px' }}>
                    <MapPin size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                    Selecciona tu ubicación en el mapa
                  </label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--c-taupe)', marginBottom: '12px' }}>
                    Haz clic en el mapa para ubicar tu dirección. Los campos se completarán automáticamente.
                  </p>
                  <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', marginBottom: '15px' }}>
                    <DeliveryMap mapPosition={mapPosition} setMapPosition={setMapPosition} setDeliveryAddress={setDeliveryAddress} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Departamento *</label>
                    <input 
                      type="text" 
                      value={deliveryAddress.departamento} 
                      onChange={e => setDeliveryAddress({...deliveryAddress, departamento: e.target.value})} 
                      style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.departamento ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                      placeholder="Ej. Lima" 
                    />
                    {formErrors.departamento && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.departamento}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Provincia *</label>
                    <input 
                      type="text" 
                      value={deliveryAddress.provincia} 
                      onChange={e => setDeliveryAddress({...deliveryAddress, provincia: e.target.value})} 
                      style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.provincia ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                      placeholder="Ej. Lima" 
                    />
                    {formErrors.provincia && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.provincia}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Distrito *</label>
                    <input 
                      type="text" 
                      value={deliveryAddress.distrito} 
                      onChange={e => setDeliveryAddress({...deliveryAddress, distrito: e.target.value})} 
                      style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.distrito ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                      placeholder="Ej. Miraflores" 
                    />
                    {formErrors.distrito && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.distrito}</span>}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Dirección de Entrega *</label>
                  <input 
                    type="text" 
                    value={deliveryAddress.direccion} 
                    onChange={e => setDeliveryAddress({...deliveryAddress, direccion: e.target.value})} 
                    style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.direccion ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                    placeholder="Av., Calle, Jr. / N° / Dpto" 
                  />
                  {formErrors.direccion && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.direccion}</span>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Referencia (Opcional)</label>
                  <input 
                    type="text" 
                    value={deliveryAddress.referencia} 
                    onChange={e => setDeliveryAddress({...deliveryAddress, referencia: e.target.value})} 
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} 
                    placeholder="Ej. Frente a parque, rejas verdes, etc." 
                  />
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Información adicional para la entrega</label>
                  <textarea 
                    value={additionalNotes} 
                    onChange={e => setAdditionalNotes(e.target.value)} 
                    rows="3" 
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)', resize: 'vertical' }} 
                    placeholder="Ej. Dejar en recepción, horario preferido de entrega, etc."
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                  <button 
                    onClick={() => setCurrentStep(2)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--c-taupe)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    <ChevronLeft size={18} /> Volver a datos personales
                  </button>
                  <button 
                    onClick={() => {
                      if (validateStep3()) setCurrentStep(4);
                    }} 
                    style={{ padding: '14px 28px', background: 'var(--c-obsidian)', color: 'var(--text-light)', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em', cursor: 'pointer' }}
                  >
                    CONTINUAR
                  </button>
                </div>
              </div>
            )}

            {/* PASO 4: Método de Pago */}
            {currentStep === 4 && (
              <div style={{ padding: '10px 0' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--c-obsidian)', fontWeight: 600, marginBottom: '8px' }}>Método de Pago</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--c-taupe)', marginBottom: '25px' }}>
                  Selecciona tu método de pago preferido. Todas las transacciones son seguras y verificadas.
                </p>

                {/* Tabs de Métodos de Pago */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '25px' }}>
                  
                  {/* Opción 1: Yape / Plin */}
                  <div 
                    onClick={() => setPaymentMethod('yape')}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '8px',
                      border: paymentMethod === 'yape' ? '2px solid var(--c-blush)' : '1px solid var(--border-light)',
                      background: paymentMethod === 'yape' ? '#ffffff' : '#fcfbf8',
                      boxShadow: paymentMethod === 'yape' ? '0 4px 14px rgba(212, 175, 55, 0.15)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: paymentMethod === 'yape' ? 'rgba(212, 175, 55, 0.15)' : '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: paymentMethod === 'yape' ? 'var(--c-obsidian)' : 'var(--c-taupe)' }}>
                      <Smartphone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>Yape / Plin</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--c-taupe)' }}>Billeteras Digitales</div>
                    </div>
                  </div>

                  {/* Opción 2: Tarjeta */}
                  <div 
                    onClick={() => setPaymentMethod('tarjeta')}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '8px',
                      border: paymentMethod === 'tarjeta' ? '2px solid var(--c-blush)' : '1px solid var(--border-light)',
                      background: paymentMethod === 'tarjeta' ? '#ffffff' : '#fcfbf8',
                      boxShadow: paymentMethod === 'tarjeta' ? '0 4px 14px rgba(212, 175, 55, 0.15)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: paymentMethod === 'tarjeta' ? 'rgba(212, 175, 55, 0.15)' : '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: paymentMethod === 'tarjeta' ? 'var(--c-obsidian)' : 'var(--c-taupe)' }}>
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>Tarjeta</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--c-taupe)' }}>Crédito / Débito</div>
                    </div>
                  </div>

                  {/* Opción 3: Transferencia Bancaria */}
                  <div 
                    onClick={() => setPaymentMethod('transferencia')}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '8px',
                      border: paymentMethod === 'transferencia' ? '2px solid var(--c-blush)' : '1px solid var(--border-light)',
                      background: paymentMethod === 'transferencia' ? '#ffffff' : '#fcfbf8',
                      boxShadow: paymentMethod === 'transferencia' ? '0 4px 14px rgba(212, 175, 55, 0.15)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: paymentMethod === 'transferencia' ? 'rgba(212, 175, 55, 0.15)' : '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: paymentMethod === 'transferencia' ? 'var(--c-obsidian)' : 'var(--c-taupe)' }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>Transferencia</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--c-taupe)' }}>BCP / BBVA / Interbank</div>
                    </div>
                  </div>

                  {/* Opción 4: Contra Entrega */}
                  <div 
                    onClick={() => setPaymentMethod('contraentrega')}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '8px',
                      border: paymentMethod === 'contraentrega' ? '2px solid var(--c-blush)' : '1px solid var(--border-light)',
                      background: paymentMethod === 'contraentrega' ? '#ffffff' : '#fcfbf8',
                      boxShadow: paymentMethod === 'contraentrega' ? '0 4px 14px rgba(212, 175, 55, 0.15)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: paymentMethod === 'contraentrega' ? 'rgba(212, 175, 55, 0.15)' : '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: paymentMethod === 'contraentrega' ? 'var(--c-obsidian)' : 'var(--c-taupe)' }}>
                      <PackageCheck size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>Contra Entrega</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--c-taupe)' }}>Paga al recibir</div>
                    </div>
                  </div>

                </div>

                {/* CONTENIDO DEL MÉTODO SELECCIONADO */}
                <div style={{ background: '#fcfbf8', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '24px', marginBottom: '25px' }}>
                  
                  {/* Vista 1: Yape / Plin */}
                  {paymentMethod === 'yape' && (
                    <div>
                      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                        <LuxuryQRCode size={140} />
                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <span style={{ display: 'inline-block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(212, 175, 55, 0.2)', color: 'var(--c-obsidian)', padding: '3px 10px', borderRadius: '12px', fontWeight: 600, marginBottom: '8px' }}>
                            Billetera Oficial L'GANT
                          </span>
                          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--c-obsidian)', marginBottom: '4px' }}>
                            962 956 919
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--c-taupe)', marginBottom: '12px' }}>
                            Titular: L'GANT PERÚ S.A.C.
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleCopy('962956919', 'yape_num')}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--c-obsidian)', cursor: 'pointer', fontWeight: 500 }}
                          >
                            {copiedText === 'yape_num' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                            {copiedText === 'yape_num' ? 'Copiado al portapapeles' : 'Copiar número celular'}
                          </button>
                        </div>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>
                          Número de Operación o Referencia *
                        </label>
                        <input 
                          type="text" 
                          value={paymentDetails.codigoOperacionYape}
                          onChange={e => {
                            setPaymentDetails({...paymentDetails, codigoOperacionYape: e.target.value});
                            if (formErrors.codigoOperacionYape) setFormErrors({...formErrors, codigoOperacionYape: null});
                          }}
                          placeholder="Ej. 7849102"
                          style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.codigoOperacionYape ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', background: '#ffffff', fontFamily: 'var(--font-main)' }}
                        />
                        {formErrors.codigoOperacionYape && (
                          <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={12} /> {formErrors.codigoOperacionYape}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8rem', color: 'var(--c-taupe)', background: '#ffffff', padding: '12px 14px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                        <ShieldCheck size={18} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>Transfiere el monto exacto de <strong>S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>. Al confirmar, podrás enviar tu constancia directamente por WhatsApp para un despacho prioritario.</span>
                      </div>
                    </div>
                  )}

                  {/* Vista 2: Tarjeta */}
                  {paymentMethod === 'tarjeta' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>Tarjetas aceptadas:</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', background: '#1a1f71', color: '#fff', borderRadius: '4px' }}>VISA</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', background: '#eb001b', color: '#fff', borderRadius: '4px' }}>MASTERCARD</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', background: '#006fcf', color: '#fff', borderRadius: '4px' }}>AMEX</span>
                        </div>
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Número de Tarjeta *</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="text" 
                            maxLength="19"
                            value={paymentDetails.tarjetaNumero}
                            onChange={e => {
                              const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                              setPaymentDetails({...paymentDetails, tarjetaNumero: val});
                              if (formErrors.tarjetaNumero) setFormErrors({...formErrors, tarjetaNumero: null});
                            }}
                            placeholder="0000 0000 0000 0000"
                            style={{ width: '100%', padding: '12px 14px 12px 42px', border: `1px solid ${formErrors.tarjetaNumero ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', background: '#ffffff', fontFamily: 'monospace' }}
                          />
                          <CreditCard size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--c-taupe)' }} />
                        </div>
                        {formErrors.tarjetaNumero && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.tarjetaNumero}</span>}
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Nombre del Titular *</label>
                        <input 
                          type="text" 
                          value={paymentDetails.tarjetaNombre}
                          onChange={e => {
                            setPaymentDetails({...paymentDetails, tarjetaNombre: e.target.value.toUpperCase()});
                            if (formErrors.tarjetaNombre) setFormErrors({...formErrors, tarjetaNombre: null});
                          }}
                          placeholder="TAL CUAL FIGURA EN EL PLÁSTICO"
                          style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.tarjetaNombre ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', background: '#ffffff', fontFamily: 'var(--font-main)' }}
                        />
                        {formErrors.tarjetaNombre && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.tarjetaNombre}</span>}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Expiración (MM/AA) *</label>
                          <input 
                            type="text" 
                            maxLength="5"
                            value={paymentDetails.tarjetaExpiracion}
                            onChange={e => {
                              let v = e.target.value.replace(/\D/g, '');
                              if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                              setPaymentDetails({...paymentDetails, tarjetaExpiracion: v});
                              if (formErrors.tarjetaExpiracion) setFormErrors({...formErrors, tarjetaExpiracion: null});
                            }}
                            placeholder="MM/AA"
                            style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.tarjetaExpiracion ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', background: '#ffffff', fontFamily: 'monospace' }}
                          />
                          {formErrors.tarjetaExpiracion && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.tarjetaExpiracion}</span>}
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>CVV / CVC *</label>
                          <div style={{ position: 'relative' }}>
                            <input 
                              type="password" 
                              maxLength="4"
                              value={paymentDetails.tarjetaCvv}
                              onChange={e => {
                                setPaymentDetails({...paymentDetails, tarjetaCvv: e.target.value.replace(/\D/g, '')});
                                if (formErrors.tarjetaCvv) setFormErrors({...formErrors, tarjetaCvv: null});
                              }}
                              placeholder="123"
                              style={{ width: '100%', padding: '12px 14px 12px 38px', border: `1px solid ${formErrors.tarjetaCvv ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', background: '#ffffff', fontFamily: 'monospace' }}
                            />
                            <Lock size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--c-taupe)' }} />
                          </div>
                          {formErrors.tarjetaCvv && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> {formErrors.tarjetaCvv}</span>}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--c-taupe)' }}>
                        <Lock size={14} color="var(--c-blush)" />
                        <span>Transacción protegida con cifrado SSL de 256 bits y cumplimiento PCI-DSS.</span>
                      </div>
                    </div>
                  )}

                  {/* Vista 3: Transferencia Bancaria */}
                  {paymentMethod === 'transferencia' && (
                    <div>
                      {/* Selector de Banco */}
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        {['BCP', 'BBVA', 'Interbank'].map(banco => (
                          <button
                            key={banco}
                            type="button"
                            onClick={() => setPaymentDetails({...paymentDetails, bancoTransferencia: banco})}
                            style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '6px',
                              border: paymentDetails.bancoTransferencia === banco ? '2px solid var(--c-blush)' : '1px solid var(--border-light)',
                              background: paymentDetails.bancoTransferencia === banco ? '#ffffff' : '#f0ede8',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              color: 'var(--c-obsidian)',
                              cursor: 'pointer'
                            }}
                          >
                            {banco}
                          </button>
                        ))}
                      </div>

                      {/* Datos del Banco Seleccionado */}
                      <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--c-taupe)', marginBottom: '4px' }}>Titular: <strong>L'GANT PERÚ S.A.C.</strong> | RUC: <strong>20608945123</strong></div>
                        
                        {paymentDetails.bancoTransferencia === 'BCP' && (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--border-light)' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>Cta. Corriente BCP Soles: <strong>191-84920412-0-45</strong></span>
                              <button type="button" onClick={() => handleCopy('19184920412045', 'bcp_cta')} style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {copiedText === 'bcp_cta' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />} Copiar
                              </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>CCI Interbancario: <strong>002-191-008492041204-56</strong></span>
                              <button type="button" onClick={() => handleCopy('00219100849204120456', 'bcp_cci')} style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {copiedText === 'bcp_cci' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />} Copiar
                              </button>
                            </div>
                          </>
                        )}

                        {paymentDetails.bancoTransferencia === 'BBVA' && (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--border-light)' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>Cta. Corriente BBVA Soles: <strong>0011-0342-0100482910</strong></span>
                              <button type="button" onClick={() => handleCopy('001103420100482910', 'bbva_cta')} style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {copiedText === 'bbva_cta' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />} Copiar
                              </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>CCI Interbancario: <strong>011-342-000100482910-18</strong></span>
                              <button type="button" onClick={() => handleCopy('01134200010048291018', 'bbva_cci')} style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {copiedText === 'bbva_cci' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />} Copiar
                              </button>
                            </div>
                          </>
                        )}

                        {paymentDetails.bancoTransferencia === 'Interbank' && (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--border-light)' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>Cta. Corriente Interbank Soles: <strong>200-3001849201</strong></span>
                              <button type="button" onClick={() => handleCopy('2003001849201', 'ibk_cta')} style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {copiedText === 'ibk_cta' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />} Copiar
                              </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>CCI Interbancario: <strong>003-200-003001849201-32</strong></span>
                              <button type="button" onClick={() => handleCopy('00320000300184920132', 'ibk_cci')} style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {copiedText === 'ibk_cci' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />} Copiar
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>
                          Número de Operación de la Transferencia *
                        </label>
                        <input 
                          type="text" 
                          value={paymentDetails.codigoOperacionTransferencia}
                          onChange={e => {
                            setPaymentDetails({...paymentDetails, codigoOperacionTransferencia: e.target.value});
                            if (formErrors.codigoOperacionTransferencia) setFormErrors({...formErrors, codigoOperacionTransferencia: null});
                          }}
                          placeholder="Ej. OP-9584210"
                          style={{ width: '100%', padding: '12px 14px', border: `1px solid ${formErrors.codigoOperacionTransferencia ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.9rem', outline: 'none', background: '#ffffff', fontFamily: 'var(--font-main)' }}
                        />
                        {formErrors.codigoOperacionTransferencia && (
                          <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={12} /> {formErrors.codigoOperacionTransferencia}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Vista 4: Contra Entrega */}
                  {paymentMethod === 'contraentrega' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                        <PackageCheck size={24} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--c-obsidian)', marginBottom: '4px' }}>
                            Pago Seguro al Recibir en Domicilio
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--c-taupe)', lineHeight: 1.4, margin: 0 }}>
                            Válido para Lima Metropolitana y Callao. Nuestro agente motorizado te permitirá verificar el precinto de seguridad del reloj antes de realizar el cobro.
                          </p>
                        </div>
                      </div>

                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 600, marginBottom: '10px' }}>
                        ¿Cómo pagarás al repartidor?
                      </label>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--c-obsidian)' }}>
                          <input 
                            type="radio" 
                            name="modoContraentrega" 
                            value="efectivo" 
                            checked={paymentDetails.modoContraentrega === 'efectivo'} 
                            onChange={() => setPaymentDetails({...paymentDetails, modoContraentrega: 'efectivo'})}
                            style={{ accentColor: 'var(--c-obsidian)' }}
                          />
                          Efectivo exacto
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--c-obsidian)' }}>
                          <input 
                            type="radio" 
                            name="modoContraentrega" 
                            value="pos" 
                            checked={paymentDetails.modoContraentrega === 'pos'} 
                            onChange={() => setPaymentDetails({...paymentDetails, modoContraentrega: 'pos'})}
                            style={{ accentColor: 'var(--c-obsidian)' }}
                          />
                          Tarjeta con POS físico
                        </label>
                      </div>
                    </div>
                  )}

                </div>

                {/* Tipo de Comprobante (Boleta / Factura) */}
                <div style={{ marginBottom: '25px', padding: '18px', background: '#fcfbf8', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--c-obsidian)', fontWeight: 600, marginBottom: '10px' }}>
                    Tipo de Comprobante de Pago
                  </label>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: tipoComprobante === 'factura' ? '15px' : '0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--c-obsidian)' }}>
                      <input 
                        type="radio" 
                        name="comprobante" 
                        value="boleta" 
                        checked={tipoComprobante === 'boleta'} 
                        onChange={() => setTipoComprobante('boleta')}
                        style={{ accentColor: 'var(--c-obsidian)' }}
                      />
                      Boleta de Venta
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--c-obsidian)' }}>
                      <input 
                        type="radio" 
                        name="comprobante" 
                        value="factura" 
                        checked={tipoComprobante === 'factura'} 
                        onChange={() => setTipoComprobante('factura')}
                        style={{ accentColor: 'var(--c-obsidian)' }}
                      />
                      Factura Electrónica
                    </label>
                  </div>

                  {tipoComprobante === 'factura' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-light)' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '6px' }}>RUC (11 dígitos) *</label>
                        <input 
                          type="text" 
                          maxLength="11"
                          value={facturaData.ruc} 
                          onChange={e => {
                            setFacturaData({...facturaData, ruc: e.target.value.replace(/\D/g, '')});
                            if (formErrors.ruc) setFormErrors({...formErrors, ruc: null});
                          }} 
                          style={{ width: '100%', padding: '10px 12px', border: `1px solid ${formErrors.ruc ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.85rem', outline: 'none', background: '#fff' }} 
                          placeholder="20XXXXXXXXX" 
                        />
                        {formErrors.ruc && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '2px', display: 'block' }}>{formErrors.ruc}</span>}
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '6px' }}>Razón Social *</label>
                        <input 
                          type="text" 
                          value={facturaData.razonSocial} 
                          onChange={e => {
                            setFacturaData({...facturaData, razonSocial: e.target.value});
                            if (formErrors.razonSocial) setFormErrors({...formErrors, razonSocial: null});
                          }} 
                          style={{ width: '100%', padding: '10px 12px', border: `1px solid ${formErrors.razonSocial ? '#ef4444' : 'var(--border-light)'}`, borderRadius: '6px', fontSize: '0.85rem', outline: 'none', background: '#fff' }} 
                          placeholder="Nombre de la empresa" 
                        />
                        {formErrors.razonSocial && <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '2px', display: 'block' }}>{formErrors.razonSocial}</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Términos y Condiciones */}
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--c-obsidian)', lineHeight: 1.4 }}>
                    <input 
                      type="checkbox" 
                      checked={termsAccepted} 
                      onChange={e => {
                        setTermsAccepted(e.target.checked);
                        if (formErrors.terms) setFormErrors({...formErrors, terms: null});
                      }}
                      style={{ accentColor: 'var(--c-obsidian)', marginTop: '2px', cursor: 'pointer' }} 
                    />
                    <span>
                      He leído y acepto los <strong>Términos y Condiciones</strong> de compra, la política de garantías oficiales de 24 meses y la política de privacidad de L'gant.
                    </span>
                  </label>
                  {formErrors.terms && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> {formErrors.terms}
                    </span>
                  )}
                </div>

                {/* Botones de Navegación del Paso 4 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                  <button 
                    onClick={() => setCurrentStep(3)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--c-taupe)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    <ChevronLeft size={18} /> Volver a entrega
                  </button>
                  <button 
                    onClick={handleFinalizarCompra} 
                    style={{ 
                      padding: '16px 36px', 
                      background: 'var(--c-obsidian)', 
                      color: 'var(--c-blush)', 
                      border: '1px solid var(--c-blush)', 
                      borderRadius: '6px', 
                      fontWeight: 700, 
                      fontSize: '0.95rem', 
                      letterSpacing: '0.08em', 
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(11, 11, 12, 0.25)',
                      transition: 'all 0.3s'
                    }}
                  >
                    FINALIZAR COMPRA
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Lado Derecho - Tarjeta de Resumen de Compra */}
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
              onClick={handleNextStep}
              style={{ 
                width: '100%', padding: '16px', 
                background: items.length === 0 ? '#e2e8f0' : 'var(--c-blush)', 
                color: items.length === 0 ? '#94a3b8' : 'var(--c-obsidian)', 
                border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.95rem', 
                letterSpacing: '0.05em', cursor: items.length === 0 ? 'not-allowed' : 'pointer', 
                transition: 'all 0.3s' 
              }}
            >
              {currentStep < 4 ? 'CONTINUAR' : 'FINALIZAR COMPRA'}
            </button>
          </div>
        </div>

      </div>

      {/* MODAL / PANTALLA DE COMPRA EXITOSA */}
      {orderSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 11, 12, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{
            maxWidth: '640px',
            width: '100%',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--c-blush)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            padding: '36px 30px',
            textAlign: 'center',
            margin: 'auto',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', border: '2px solid var(--c-blush)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} color="var(--c-blush)" />
            </div>

            <span style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-blush)', fontWeight: 700 }}>
              ORDEN CONFIRMADA CON ÉXITO
            </span>

            <h2 style={{ fontSize: '1.4rem', color: 'var(--c-obsidian)', fontWeight: 700, margin: '8px 0 6px', fontFamily: 'var(--font-main)' }}>
              ¡Gracias por tu compra, {orderSuccess.personalData.nombres}!
            </h2>

            <div style={{ display: 'inline-block', background: '#fcfbf8', border: '1px solid var(--border-light)', borderRadius: '20px', padding: '6px 16px', fontSize: '0.85rem', color: 'var(--c-obsidian)', fontWeight: 600, marginBottom: '24px' }}>
              Código de Pedido: <span style={{ color: 'var(--c-blush)', fontWeight: 700 }}>#{orderSuccess.orderId}</span>
            </div>

            {/* Resumen del Pedido */}
            <div style={{ background: '#fcfbf8', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '18px', textAlign: 'left', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--c-taupe)' }}>Fecha:</span>
                <span style={{ fontWeight: 500, color: 'var(--c-obsidian)' }}>{orderSuccess.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--c-taupe)' }}>Destinatario:</span>
                <span style={{ fontWeight: 500, color: 'var(--c-obsidian)' }}>
                  {orderSuccess.recipientType === 'yo' 
                    ? `${orderSuccess.personalData.nombres} ${orderSuccess.personalData.apellidos}` 
                    : `${orderSuccess.recipientData.nombres} ${orderSuccess.recipientData.apellidos} (DNI: ${orderSuccess.recipientData.dni})`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--c-taupe)' }}>Dirección:</span>
                <span style={{ fontWeight: 500, color: 'var(--c-obsidian)', textAlign: 'right', maxWidth: '60%' }}>
                  {orderSuccess.deliveryAddress.direccion}, {orderSuccess.deliveryAddress.distrito}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--c-taupe)' }}>Método de Pago:</span>
                <span style={{ fontWeight: 600, color: 'var(--c-obsidian)', textTransform: 'capitalize' }}>
                  {orderSuccess.paymentMethod === 'yape' && 'Billetera Móvil (Yape/Plin)'}
                  {orderSuccess.paymentMethod === 'tarjeta' && 'Tarjeta de Crédito / Débito'}
                  {orderSuccess.paymentMethod === 'transferencia' && `Transferencia ${orderSuccess.paymentDetails.bancoTransferencia}`}
                  {orderSuccess.paymentMethod === 'contraentrega' && 'Pago Contra Entrega'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px', marginTop: '6px', fontSize: '1rem', fontWeight: 700, color: 'var(--c-obsidian)' }}>
                <span>Total Abonado:</span>
                <span style={{ color: 'var(--c-blush)' }}>S/ {orderSuccess.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Mensaje de Próximos Pasos según Método de Pago */}
            <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', padding: '14px', textAlign: 'left', marginBottom: '25px', fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '4px' }}>
                <ShieldCheck size={16} color="var(--c-blush)" /> Siguiente paso para tu entrega:
              </div>
              {orderSuccess.paymentMethod === 'yape' || orderSuccess.paymentMethod === 'transferencia' ? (
                <span>Envíanos la captura o constancia de tu operación por WhatsApp para registrar tu pago de inmediato y proceder al empaque de alta seguridad.</span>
              ) : orderSuccess.paymentMethod === 'contraentrega' ? (
                <span>Nos pondremos en contacto contigo por WhatsApp para confirmar la fecha y franja horaria de entrega en tu domicilio.</span>
              ) : (
                <span>Tu pago ha sido validado correctamente. Recibirás en tu correo electrónico la confirmación con el código de seguimiento de tu encomienda.</span>
              )}
            </div>

            {/* Botones de Acción */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
              <button
                onClick={handleWhatsAppCoordination}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                <WhatsAppIcon size={20} color="#ffffff" />
                Coordinar Despacho por WhatsApp
              </button>
              
              <button
                onClick={onBack}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  color: 'var(--c-obsidian)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Volver al catálogo
              </button>
            </div>

            {/* Opcional Modelo B: Invitación Post-Compra para Crear Cuenta */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-obsidian)', marginBottom: '4px' }}>
                ¿Deseas guardar tus datos para tu próxima compra?
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--c-taupe)', marginBottom: '12px' }}>
                Crea una contraseña y podrás rastrear tus pedidos y comprar en 1 clic en el futuro.
              </p>
              
              {accountCreated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                  <Check size={16} /> ¡Cuenta creada exitosamente para {orderSuccess.personalData.email}!
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="password" 
                    value={accountPassword}
                    onChange={e => setAccountPassword(e.target.value)}
                    placeholder="Crea una contraseña segura"
                    style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (accountPassword.trim().length >= 6) {
                        setAccountCreated(true);
                      }
                    }}
                    style={{ padding: '10px 18px', background: 'var(--c-obsidian)', color: 'var(--text-light)', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Guardar Cuenta
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
