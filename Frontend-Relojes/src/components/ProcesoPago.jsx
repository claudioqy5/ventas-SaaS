import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Truck, CreditCard, ChevronLeft, Trash2, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function LocationMarker({ position, setPosition, setAddressData }) {
  const map = useMap();
  
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      map.flyTo(e.latlng, map.getZoom());
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
          headers: { 'Accept-Language': 'es' }
        });
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          setAddressData(prev => ({
            ...prev,
            departamento: addr.state || addr.region || prev.departamento || '',
            provincia: addr.city || addr.county || prev.provincia || '',
            distrito: addr.suburb || addr.town || addr.village || addr.city_district || prev.distrito || '',
            direccion: `${addr.road || ''} ${addr.house_number || ''}`.trim() || prev.direccion || ''
          }));
        }
      } catch (err) {
        console.error("Error reverse geocoding:", err);
      }
    }
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function ProcesoPago({ items = [], onUpdateQuantity, onRemoveItem, onBack }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [recipientType, setRecipientType] = useState('yo');
  const [recipientData, setRecipientData] = useState({ nombres: '', apellidos: '', dni: '' });
  const [deliveryAddress, setDeliveryAddress] = useState({
    departamento: '', provincia: '', distrito: '', direccion: '', referencia: ''
  });
  const [mapPosition, setMapPosition] = useState({ lat: -12.0464, lng: -77.0428 });
  const [additionalNotes, setAdditionalNotes] = useState('');

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
            const isClickable = step.id < currentStep; // Can go back to previous steps
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
            {currentStep === 2 && (
              <div style={{ padding: '10px 0' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--c-obsidian)', fontWeight: 600, marginBottom: '20px' }}>Datos Personales</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--c-taupe)', marginBottom: '30px' }}>
                  Completa tus datos para enviarte la confirmación de la compra. Si ya tienes una cuenta, puedes <a href="#" style={{ color: 'var(--c-blush)', textDecoration: 'underline', fontWeight: 500 }}>iniciar sesión</a>.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Nombres *</label>
                    <input type="text" style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Ej. Juan Carlos" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Apellidos *</label>
                    <input type="text" style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Ej. Pérez Gómez" />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Correo Electrónico *</label>
                  <input type="email" style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="ejemplo@correo.com" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Tipo Documento *</label>
                    <select style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)', backgroundColor: '#fff', color: 'var(--c-obsidian)' }}>
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="PASAPORTE">Pasaporte</option>
                      <option value="RUC">RUC</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Número de Documento *</label>
                    <input type="text" style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Tu número de documento" />
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Teléfono Móvil (WhatsApp) *</label>
                  <div style={{ display: 'flex' }}>
                    <span style={{ padding: '12px 14px', border: '1px solid var(--border-light)', borderRight: 'none', borderRadius: '6px 0 0 6px', background: '#f9f7f4', color: 'var(--c-taupe)', fontSize: '0.9rem' }}>+51</span>
                    <input type="tel" style={{ flex: 1, padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '0 6px 6px 0', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="999 999 999" />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                  <button 
                    onClick={() => setCurrentStep(1)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--c-taupe)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    <ChevronLeft size={18} /> Volver al carrito
                  </button>
                  <button 
                    onClick={() => setCurrentStep(3)} 
                    style={{ padding: '14px 28px', background: 'var(--c-obsidian)', color: 'var(--text-light)', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em', cursor: 'pointer' }}
                  >
                    CONTINUAR
                  </button>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div style={{ padding: '10px 0' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--c-obsidian)', fontWeight: 600, marginBottom: '20px' }}>Datos de Entrega</h2>
                
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
                      <input type="text" value={recipientData.nombres} onChange={e => setRecipientData({...recipientData, nombres: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Ej. Ana" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Apellidos del receptor *</label>
                      <input type="text" value={recipientData.apellidos} onChange={e => setRecipientData({...recipientData, apellidos: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Ej. Silva" />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>DNI del receptor *</label>
                      <input type="text" value={recipientData.dni} onChange={e => setRecipientData({...recipientData, dni: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Número de DNI" />
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
                    <MapContainer center={[mapPosition.lat, mapPosition.lng]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker position={mapPosition} setPosition={setMapPosition} setAddressData={setDeliveryAddress} />
                    </MapContainer>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Departamento *</label>
                    <input type="text" value={deliveryAddress.departamento} onChange={e => setDeliveryAddress({...deliveryAddress, departamento: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Ej. Lima" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Provincia *</label>
                    <input type="text" value={deliveryAddress.provincia} onChange={e => setDeliveryAddress({...deliveryAddress, provincia: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Ej. Lima" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Distrito *</label>
                    <input type="text" value={deliveryAddress.distrito} onChange={e => setDeliveryAddress({...deliveryAddress, distrito: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Ej. Miraflores" />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Dirección de Entrega *</label>
                  <input type="text" value={deliveryAddress.direccion} onChange={e => setDeliveryAddress({...deliveryAddress, direccion: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Av., Calle, Jr. / N° / Dpto" />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Referencia (Opcional)</label>
                  <input type="text" value={deliveryAddress.referencia} onChange={e => setDeliveryAddress({...deliveryAddress, referencia: e.target.value})} style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)' }} placeholder="Ej. Frente a parque, rejas verdes, etc." />
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--c-obsidian)', fontWeight: 500, marginBottom: '8px' }}>Información adicional para la entrega</label>
                  <textarea value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)} rows="3" style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', fontFamily: 'var(--font-main)', resize: 'vertical' }} placeholder="Ej. Dejar en recepción, horario preferido, etc."></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                  <button 
                    onClick={() => setCurrentStep(2)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--c-taupe)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    <ChevronLeft size={18} /> Volver a datos personales
                  </button>
                  <button 
                    onClick={() => setCurrentStep(4)} 
                    style={{ padding: '14px 28px', background: 'var(--c-obsidian)', color: 'var(--text-light)', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em', cursor: 'pointer' }}
                  >
                    CONTINUAR
                  </button>
                </div>
              </div>
            )}
            {currentStep > 3 && (
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
