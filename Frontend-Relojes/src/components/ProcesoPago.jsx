import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, User, Truck, CreditCard, ChevronLeft, Trash2, MapPin,
  Building2, Copy, Check, ShieldCheck, Lock,
  Smartphone, AlertCircle, Zap
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { submitOrder, createMercadoPagoPreference } from '../services/api';

const DeliveryMap = dynamic(() => import('./DeliveryMap'), { ssr: false });

const WhatsAppIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);





export default function ProcesoPago({ 
  items = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onBack,
  onClearCart,
  user,
  token,
  onRequireAuth,
  onOrderSuccess,
  whatsappNumber = '51916382742'
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // PASO 2: Datos Personales
  const [personalData, setPersonalData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    tipoDoc: 'DNI',
    numDoc: '',
    telefono: ''
  });

  // Autocompletar con los datos del usuario logueado (datos personales y dirección de entrega previa)
  useEffect(() => {
    if (user) {
      const primerNombre = user.nombres || (user.nombre || '').trim().split(' ')[0] || '';
      const apellidos = user.apellidos || (user.nombre || '').trim().split(' ').slice(1).join(' ') || '';

      // Autocompletar datos personales — siempre desde el perfil si el usuario está logueado
      setPersonalData(prev => ({
        ...prev,
        nombres: primerNombre || prev.nombres,
        apellidos: apellidos || prev.apellidos,
        email: user.email || user.correo || prev.email,
        telefono: user.telefono || prev.telefono,
        tipoDoc: user.tipoDocumento || prev.tipoDoc,
        numDoc: user.numeroDocumento || user.numDoc || prev.numDoc
      }));

      // Autocompletar dirección de entrega (de la última compra guardada en el perfil)
      // Solo si el campo aún no fue editado manualmente
      setDeliveryAddress(prev => ({
        ...prev,
        departamento: prev.departamento || user.departamento || '',
        provincia: prev.provincia || user.provincia || '',
        distrito: prev.distrito || user.distrito || '',
        direccion: prev.direccion || user.direccion || '',
        referencia: prev.referencia || user.referencia || ''
      }));
    }
  }, [user]);

  // PASO 3: Datos de Entrega
  const [recipientType, setRecipientType] = useState('yo');
  const [recipientData, setRecipientData] = useState({ nombres: '', apellidos: '', dni: '' });
  const [deliveryAddress, setDeliveryAddress] = useState({
    departamento: '', provincia: '', distrito: '', direccion: '', referencia: ''
  });
  const [mapPosition, setMapPosition] = useState({ lat: -12.0464, lng: -77.0428 });
  const [additionalNotes, setAdditionalNotes] = useState('');

  // PASO 4: Método de Pago
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('yape'); // 'yape' | 'transferencia' | 'mercadopago'
  const [paymentDetails, setPaymentDetails] = useState({
    codigoOperacionYape: '',
    bancoTransferencia: 'BCP',
    codigoOperacionTransferencia: ''
  });

  // Comprobante y Términos
  const [tipoComprobante, setTipoComprobante] = useState('boleta'); // 'boleta' | 'factura'
  const [facturaData, setFacturaData] = useState({ ruc: '', razonSocial: '', direccionFiscal: '' });
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [copiedText, setCopiedText] = useState('');

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

  const handleGuestCheckout = () => {
    setIsGuestMode(true);
    setCurrentStep(4);
  };

  const handleDirectWhatsAppPurchase = () => {
    const waNumber = whatsappNumber;
    const itemsSummary = (items || [])
      .map(i => `  • ${i.quantity}x ${i.nombre} (S/ ${Number(i.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })})`)
      .join('\n');

    const text = `*NUEVO PEDIDO RÁPIDO (INVITADO) - L'GANT BOUTIQUE*\n\n` +
      `Hola, me gustaría realizar la compra de estos productos de forma rápida como invitado:\n\n` +
      `*PRODUCTOS EN CARRITO:*\n${itemsSummary}\n\n` +
      `*TOTAL A PAGAR: S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}*\n\n` +
      `Deseo coordinar el método de pago (Yape / BCP / Interbank) y los datos de despacho directamente por WhatsApp. ¡Gracias!`;

    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`, '_blank');
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
      if (!token) {
        onRequireAuth();
        return;
      }
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    } else if (currentStep === 4) {
      handleFinalizarCompra();
    }
  };

  const handleFinalizarCompra = async () => {
    if (!isGuestMode) {
      if (!validateStep2()) {
        setCurrentStep(2);
        return;
      }
      if (!validateStep3()) {
        setCurrentStep(3);
        return;
      }
      if (!token) {
        onRequireAuth();
        return;
      }
    }

    if (!validateStep4()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const orderData = {
        subtotal: subtotal,
        impuesto: 0,
        total: total,
        metodoPago: `Online - ${paymentMethod}${isGuestMode ? ' (Invitado)' : ''}`,
        nombreCliente: isGuestMode
          ? (personalData.nombres ? `${personalData.nombres} ${personalData.apellidos}` : 'Cliente Invitado (WhatsApp)')
          : `${personalData.nombres} ${personalData.apellidos}`,
        tipoDocumento: isGuestMode ? '-' : personalData.tipoDoc,
        numeroDocumento: isGuestMode ? '' : personalData.numDoc,

        // Productos del carrito
        items: items.map(item => ({
          productoId: item.id || item._id,
          nombreProducto: item.nombre,
          cantidad: item.quantity,
          precioUnitario: item.precio
        })),

        // Datos de entrega
        direccionEntrega: isGuestMode ? 'Coordinar entrega por WhatsApp' : deliveryAddress.direccion,
        departamentoEntrega: isGuestMode ? '' : deliveryAddress.departamento,
        provinciaEntrega: isGuestMode ? '' : deliveryAddress.provincia,
        distritoEntrega: isGuestMode ? '' : deliveryAddress.distrito,
        referenciaEntrega: isGuestMode ? '' : deliveryAddress.referencia,

        // Datos del receptor
        esEntregaATercero: isGuestMode ? false : recipientType === 'otro',
        nombreReceptor: (!isGuestMode && recipientType === 'otro') ? `${recipientData.nombres} ${recipientData.apellidos}`.trim() : null,
        dniReceptor: (!isGuestMode && recipientType === 'otro') ? recipientData.dni : null,
        notasEntrega: additionalNotes || null,

        // Datos de comprobante
        tipoComprobante: tipoComprobante === 'factura' ? 'Factura' : 'Boleta',
        rucFactura: tipoComprobante === 'factura' ? facturaData.ruc : null,
        razonSocialFactura: tipoComprobante === 'factura' ? facturaData.razonSocial : null,
        direccionFiscalFactura: tipoComprobante === 'factura' ? facturaData.direccionFiscal : null,

        // Código de operación de pago
        codigoOperacionPago: paymentMethod === 'yape'
          ? paymentDetails.codigoOperacionYape
          : paymentMethod === 'transferencia'
            ? paymentDetails.codigoOperacionTransferencia
            : null
      };

      // 1. Crear la orden en el backend (registra en BD y en Pedidos Web del Admin)
      const res = await submitOrder(token, orderData);

      // 2. Si es Mercado Pago: redirigir a MP
      if (paymentMethod === 'mercadopago') {
        const mpRes = await createMercadoPagoPreference(token, {
          orderId: res.orderId,
          items: items
        });
        const checkoutUrl = mpRes.initPoint;
        if (checkoutUrl && typeof window !== 'undefined') {
          // Open in a new tab to avoid Mercado Pago CSP / BFCache issues
          const newWindow = window.open(checkoutUrl, '_blank');
          
          // Fallback if popup blocker prevented the new tab
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            window.location.href = checkoutUrl;
          }
        }
        return;
      }

      const newOrder = {
        orderId: res.orderId,
        date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: [...items],
        subtotal,
        discount,
        total,
        personalData: isGuestMode ? { nombres: 'Cliente', apellidos: 'Invitado', email: 'invitado@tienda.com', telefono: 'WhatsApp' } : personalData,
        deliveryAddress: isGuestMode ? { direccion: 'Coordinación por WhatsApp', distrito: 'Por definir' } : deliveryAddress,
        recipientType,
        recipientData,
        additionalNotes,
        paymentMethod,
        paymentDetails,
        tipoComprobante,
        facturaData,
        isGuestMode
      };

      // Confetti de celebración elegante
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

      if (onClearCart) onClearCart();
      if (onOrderSuccess) onOrderSuccess(newOrder);

      // Si es compra como invitado, derivar a WhatsApp para coordinar despacho
      if (isGuestMode) {
        const waNumber = whatsappNumber;
        const itemsSummary = (items || [])
          .map(i => `  • ${i.quantity}x ${i.nombre} (S/ ${Number(i.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })})`)
          .join('\n');

        const opCodeText = (paymentMethod === 'yape' && paymentDetails.codigoOperacionYape)
          ? `\n*N° Operación Yape:* ${paymentDetails.codigoOperacionYape}`
          : (paymentMethod === 'transferencia' && paymentDetails.codigoOperacionTransferencia)
            ? `\n*N° Operación Transferencia (${paymentDetails.bancoTransferencia}):* ${paymentDetails.codigoOperacionTransferencia}`
            : '';

        const text = `*NUEVO PEDIDO RÁPIDO #${res.orderId ? res.orderId.slice(-6).toUpperCase() : ''} - L'GANT BOUTIQUE*\n\n` +
          `¡Hola! Registré mi compra como invitado en la tienda web:\n\n` +
          `*MÉTODO DE PAGO:* ${paymentMethod.toUpperCase()}${opCodeText}\n` +
          `*TOTAL ABONADO:* S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n\n` +
          `*PRODUCTOS:*\n${itemsSummary}\n\n` +
          `Envío este mensaje para coordinar los datos de envío y la entrega. ¡Muchas gracias!`;

        window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`, '_blank');
      }
    } catch (err) {
      setSubmitError(err.message || 'Error al procesar el pedido. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
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
                  <div className="checkout-table-container" style={{ overflowX: 'auto' }}>
                    <table className="checkout-table-cart" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                      <button 
                        type="button"
                        onClick={handleGuestCheckout}
                        style={{
                          padding: '12px 24px',
                          background: 'transparent',
                          border: '1px solid var(--c-obsidian)',
                          color: 'var(--c-obsidian)',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Como Invitado &rarr;
                      </button>

                      <button 
                        onClick={() => { setIsGuestMode(false); setCurrentStep(2); }}
                        style={{ 
                          padding: '14px 28px', 
                          background: 'var(--c-obsidian)', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '6px', 
                          fontWeight: 600, 
                          fontSize: '0.9rem', 
                          letterSpacing: '0.05em', 
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        Continuar
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
                      placeholder={whatsappNumber ? whatsappNumber.replace(/^51/, '').replace(/(\d{3})(?=\d)/g, "$1 ") : "916 382 742"} 
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
                <p style={{ fontSize: '0.85rem', color: 'var(--c-taupe)', marginBottom: '20px' }}>
                  Selecciona tu método de pago preferido. Todas las transacciones son seguras y verificadas.
                </p>

                {isGuestMode && (
                  <div style={{
                    background: 'rgba(212, 175, 55, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    fontSize: '0.83rem',
                    color: 'var(--c-obsidian)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <span>
                      <strong>Modo Invitado:</strong> Selecciona tu pago. Al finalizar la compra, se registrará tu pedido en el sistema y serás derivado a WhatsApp para coordinar la entrega.
                    </span>
                    <button 
                      type="button"
                      onClick={() => setIsGuestMode(false)} 
                      style={{ background: 'none', border: 'none', color: 'var(--c-taupe)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Llenar formulario completo
                    </button>
                  </div>
                )}

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
                      <div style={{ fontSize: '0.7rem', color: 'var(--c-taupe)' }}>BCP / Interbank</div>
                    </div>
                  </div>

                  {/* Opción 5: Mercado Pago */}
                  <div 
                    onClick={() => setPaymentMethod('mercadopago')}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '8px',
                      border: paymentMethod === 'mercadopago' ? '2px solid #009ee3' : '1px solid var(--border-light)',
                      background: paymentMethod === 'mercadopago' ? '#f0f9ff' : '#fcfbf8',
                      boxShadow: paymentMethod === 'mercadopago' ? '0 4px 14px rgba(0, 158, 227, 0.2)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: paymentMethod === 'mercadopago' ? 'rgba(0, 158, 227, 0.15)' : '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* Logo MP simplificado */}
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="11" cy="11" r="11" fill={paymentMethod === 'mercadopago' ? '#009ee3' : '#b0bec5'}/>
                        <text x="5" y="15" fontSize="11" fontWeight="bold" fill="white" fontFamily="Arial">MP</text>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>Mercado Pago</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--c-taupe)' }}>Tarjeta / Billetera</div>
                    </div>
                  </div>

                </div>

                {/* CONTENIDO DEL MÉTODO SELECCIONADO */}
                <div style={{ background: '#fcfbf8', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '24px', marginBottom: '25px' }}>
                  
                  {/* Vista 1: Yape / Plin */}
                  {paymentMethod === 'yape' && (
                    <div>
                      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {/* Tarjeta de Código QR Oficial de Yape */}
                        <div style={{
                          background: '#742284',
                          borderRadius: '14px',
                          padding: '8px',
                          boxShadow: '0 8px 20px rgba(116, 34, 132, 0.2)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          border: '1.5px solid rgba(212, 175, 55, 0.35)',
                          maxWidth: '170px',
                          width: '100%',
                          flexShrink: 0
                        }}>
                          <img 
                            src="/qr-yape.png" 
                            alt="Código QR Yape - Grupo Sercal S.A.C."
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '8px',
                              display: 'block'
                            }}
                          />
                        </div>

                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ display: 'inline-block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#742284', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontWeight: 600 }}>
                              Yape Oficial
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <ShieldCheck size={14} /> Verificado
                            </span>
                          </div>
                          
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-obsidian)', marginBottom: '3px', letterSpacing: '0.04em' }}>
                            997 099 683
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-obsidian)', marginBottom: '4px' }}>
                            Titular: Grupo Sercal S.a.c.
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--c-taupe)', marginBottom: '12px' }}>
                            Escanea el código QR desde tu app de Yape o transfiere directamente al número celular.
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleCopy('997099683', 'yape_num')}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--c-obsidian)', cursor: 'pointer', fontWeight: 500, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
                          >
                            {copiedText === 'yape_num' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                            {copiedText === 'yape_num' ? '¡Número copiado!' : 'Copiar número celular'}
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



                  {/* Vista 3: Transferencia Bancaria */}
                  {paymentMethod === 'transferencia' && (
                    <div>
                      {/* Selector de Banco */}
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        {['BCP', 'Interbank'].map(banco => (
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
                        <div style={{ fontSize: '0.8rem', color: 'var(--c-taupe)', marginBottom: '10px', fontWeight: 500 }}>
                          Titular: <strong style={{ color: 'var(--c-obsidian)' }}>GRUPO SERCAL S.A.C.</strong>
                        </div>
                        
                        {paymentDetails.bancoTransferencia === 'BCP' && (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--border-light)' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>
                                Cta. Corriente BCP Soles: <strong style={{ fontFamily: 'monospace' }}>355-7216688-0-94</strong>
                              </span>
                              <button type="button" onClick={() => handleCopy('355-7216688-0-94', 'bcp_cta')} style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {copiedText === 'bcp_cta' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />} Copiar
                              </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>
                                CCI Interbancario: <strong style={{ fontFamily: 'monospace' }}>002 355 007216688094 67</strong>
                              </span>
                              <button type="button" onClick={() => handleCopy('00235500721668809467', 'bcp_cci')} style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {copiedText === 'bcp_cci' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />} Copiar
                              </button>
                            </div>
                          </>
                        )}

                        {paymentDetails.bancoTransferencia === 'Interbank' && (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--border-light)' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>
                                Cta. Corriente Interbank Soles: <strong style={{ fontFamily: 'monospace' }}>500-3007303149</strong>
                              </span>
                              <button type="button" onClick={() => handleCopy('500-3007303149', 'ibk_cta')} style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {copiedText === 'ibk_cta' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />} Copiar
                              </button>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--c-obsidian)' }}>
                                CCI Interbancario: <strong style={{ fontFamily: 'monospace' }}>003-500-003007303149-61</strong>
                              </span>
                              <button type="button" onClick={() => handleCopy('003-500-003007303149-61', 'ibk_cci')} style={{ background: 'none', border: 'none', color: 'var(--c-blush)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
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

                  {/* Vista 5: Mercado Pago */}
                  {paymentMethod === 'mercadopago' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #009ee3, #00bcff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,158,227,0.3)' }}>
                          <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '-0.5px' }}>MP</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-obsidian)', marginBottom: '4px' }}>
                            Pago seguro con Mercado Pago
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--c-taupe)', lineHeight: 1.5, margin: 0 }}>
                            Al confirmar, serás redirigido al checkout seguro de Mercado Pago donde podrás pagar con tarjeta de crédito, débito, billetera digital MP, o en efectivo.
                          </p>
                        </div>
                      </div>

                      {/* Métodos aceptados */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                        {[
                          { label: 'Visa / Mastercard', color: '#1a1f71' },
                          { label: 'American Express', color: '#016fd0' },
                          { label: 'Billetera MP', color: '#009ee3' },
                          { label: 'Cuotas sin interés', color: '#00a650' }
                        ].map(m => (
                          <div key={m.label} style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--c-obsidian)', fontWeight: 500 }}>{m.label}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.78rem', color: 'var(--c-taupe)', background: '#f0f9ff', border: '1px solid #bde0f7', padding: '12px 14px', borderRadius: '8px' }}>
                        <ShieldCheck size={18} color="#009ee3" style={{ flexShrink: 0 }} />
                        <span>Tu pago está protegido por Mercado Pago. Una vez confirmado, tu pedido pasará automáticamente a <strong>En preparación</strong>.</span>
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
            
            {submitError && (
              <div style={{ padding: '12px', marginBottom: '16px', background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, textAlign: 'center' }}>
                ⚠️ {submitError}
              </div>
            )}
            
            <button 
              disabled={items.length === 0 || isSubmitting}
              onClick={handleNextStep}
              style={{ 
                width: '100%', padding: '16px', 
                background: items.length === 0 || isSubmitting ? '#e2e8f0' : 'var(--c-blush)', 
                color: items.length === 0 || isSubmitting ? '#94a3b8' : 'var(--c-obsidian)', 
                border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.95rem', 
                letterSpacing: '0.05em', cursor: items.length === 0 || isSubmitting ? 'not-allowed' : 'pointer', 
                transition: 'all 0.3s' 
              }}
            >
              {isSubmitting ? 'PROCESANDO...' : currentStep < 4 ? 'CONTINUAR' : 'FINALIZAR COMPRA'}
            </button>

            {items.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0 10px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--c-taupe)', fontWeight: 600, letterSpacing: '0.05em' }}>O TAMBIÉN</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                </div>

                <button
                  type="button"
                  onClick={handleDirectWhatsAppPurchase}
                  style={{
                    width: '100%',
                    padding: '13px',
                    background: '#25D366',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  <WhatsAppIcon size={18} color="#ffffff" />
                  COMPRA RÁPIDA POR WHATSAPP
                </button>
              </div>
            )}
          </div>
        </div>

      </div>



    </div>
  );
}
