"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Truck, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  LogOut, 
  Package, 
  ExternalLink, 
  Calendar, 
  Sparkles,
  MapPin,
  Edit2,
  Save,
  X,
  Clock,
  Check,
  ChevronRight
} from 'lucide-react';
import { getCustomerOrders, updateCustomerProfile } from '../services/api';

export default function VistaPanelCliente({
  activeTab = 'compras', // 'compras' | 'cuenta'
  user,
  token,
  onNavigate,
  onBack,
  onLogout,
  onRequireAuth,
  whatsappNumber = '51962956919'
}) {
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: ''
  });

  useEffect(() => {
    if (token && user) {
      cargarPedidos();
    }
  }, [token, user]);

  const cargarPedidos = async () => {
    setCargandoPedidos(true);
    try {
      const data = await getCustomerOrders(token);
      setPedidos(data || []);
    } catch (err) {
      console.error("Error al cargar pedidos del cliente:", err);
    } finally {
      setCargandoPedidos(false);
    }
  };

  const handleEditClick = () => {
    setProfileFormData({
      nombres: user.nombres || user.nombre.split(' ')[0] || '',
      apellidos: user.apellidos || (user.nombre.split(' ').slice(1).join(' ') || ''),
      telefono: user.telefono || ''
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!profileFormData.nombres.trim() || !profileFormData.apellidos.trim()) {
      alert('Nombres y apellidos son obligatorios');
      return;
    }
    setSavingProfile(true);
    try {
      await updateCustomerProfile(token, profileFormData);
      
      if (user) {
        user.nombres = profileFormData.nombres;
        user.apellidos = profileFormData.apellidos;
        user.nombre = `${profileFormData.nombres} ${profileFormData.apellidos}`.trim();
        user.telefono = profileFormData.telefono;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('lgant_user', JSON.stringify(user));
        }
      }
      
      setIsEditingProfile(false);
      setToastMessage('Tu información se actualizó correctamente.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      alert(err.message || 'Error al actualizar perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const totalInvertido = pedidos.reduce((acc, p) => acc + (Number(p.total) || 0), 0);

  const handleWhatsAppOrderInquiry = (ped) => {
    const refCode = ped.id ? String(ped.id).slice(-6).toUpperCase() : 'CLIENTE';
    const text = encodeURIComponent(
      `👋 *CONSULTA DE COMPRA - CONCIERGE L'GANT*\n\n` +
      `Hola, deseo información sobre el seguimiento de mi orden *#${refCode}* realizada el ${new Date(ped.fechaCreacion || Date.now()).toLocaleDateString('es-PE')}.\n` +
      `Titular: ${user?.nombre || 'Cliente'}`
    );
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`, '_blank');
  };

  return (
    <div style={{
      minHeight: '85vh',
      backgroundColor: '#fafafa',
      paddingTop: '32px',
      paddingBottom: '80px',
      color: '#1a1a1a',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Toast Notificación */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          zIndex: 9999,
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          animation: 'slideUpToast 0.3s ease'
        }}>
          <CheckCircle2 size={18} color="#c5a059" />
          <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>{toastMessage}</span>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Barra superior de navegación */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              padding: '6px 0',
              color: '#666666',
              fontSize: '0.88rem',
              fontWeight: 400,
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#1a1a1a'}
            onMouseLeave={e => e.currentTarget.style.color = '#666666'}
          >
            <ArrowLeft size={16} /> Volver a la boutique
          </button>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffffff',
            border: '1px solid #e8e8e8',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: '#8a733e',
            fontWeight: 400,
            letterSpacing: '0.06em'
          }}>
            <Sparkles size={12} color="#c5a059" />
            Portal de Cliente
          </div>
        </div>

        {!user ? (
          /* NO AUTENTICADO */
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #eaeaea',
            padding: '56px 24px',
            textAlign: 'center',
            maxWidth: '460px',
            margin: '40px auto 0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <User size={40} color="#999999" style={{ margin: '0 auto 16px', strokeWidth: 1.5 }} />
            <h3 style={{ fontSize: '1.4rem', color: '#1a1a1a', marginBottom: '10px', fontWeight: 500, fontFamily: 'serif' }}>
              Acceso a tu Cuenta
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#666666', lineHeight: 1.6, marginBottom: '28px', fontWeight: 400 }}>
              Para visualizar tu historial de compras y gestionar tu información personal, inicia sesión.
            </p>
            <button
              type="button"
              onClick={onRequireAuth}
              style={{
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 400,
                cursor: 'pointer'
              }}
            >
              Iniciar Sesión
            </button>
          </div>
        ) : (
          /* AUTENTICADO: LAYOUT SIDEBAR + CONTENIDO */
          <div style={{
            display: 'flex', gap: '36px', alignItems: 'flex-start', flexWrap: 'wrap'
          }}>
            {/* --- SIDEBAR IZQUIERDO --- */}
            <aside style={{ width: '100%', maxWidth: '270px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Resumen del Perfil */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '28px 20px',
                border: '1px solid #eaeaea',
                boxShadow: '0 2px 10px rgba(0,0,0,0.01)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#f4f4f6',
                  color: '#1a1a1a',
                  margin: '0 auto 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontFamily: 'serif',
                  fontWeight: 400,
                  border: '1px solid #e0e0e0'
                }}>
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#1a1a1a', fontWeight: 500, fontFamily: 'serif' }}>
                  {user.nombre}
                </h3>
                <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: '#737373', fontWeight: 400 }}>{user.email}</p>
                
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #dcfce7',
                  color: '#166534',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 400
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                  Cuenta activa
                </div>
              </div>

              {/* Menú de Navegación */}
              <nav style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '12px',
                border: '1px solid #eaeaea',
                boxShadow: '0 2px 10px rgba(0,0,0,0.01)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <button
                  onClick={() => onNavigate && onNavigate('mis-compras')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    backgroundColor: activeTab === 'compras' ? '#f5f5f7' : 'transparent',
                    color: activeTab === 'compras' ? '#1a1a1a' : '#666666',
                    fontWeight: activeTab === 'compras' ? 500 : 400
                  }}
                >
                  <Truck size={18} color={activeTab === 'compras' ? '#1a1a1a' : '#888888'} strokeWidth={1.5} />
                  <span style={{ flex: 1, fontSize: '0.9rem' }}>Mis Compras</span>
                  {pedidos.length > 0 && (
                    <span style={{
                      backgroundColor: '#e5e5e7',
                      color: '#444444',
                      fontSize: '0.72rem',
                      padding: '2px 7px',
                      borderRadius: '10px',
                      fontWeight: 400
                    }}>
                      {pedidos.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => onNavigate && onNavigate('cuenta')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    backgroundColor: activeTab === 'cuenta' ? '#f5f5f7' : 'transparent',
                    color: activeTab === 'cuenta' ? '#1a1a1a' : '#666666',
                    fontWeight: activeTab === 'cuenta' ? 500 : 400
                  }}
                >
                  <User size={18} color={activeTab === 'cuenta' ? '#1a1a1a' : '#888888'} strokeWidth={1.5} />
                  <span style={{ flex: 1, fontSize: '0.9rem' }}>Mi Cuenta</span>
                </button>

                <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '8px 0' }} />

                <button
                  onClick={() => { if (onLogout) onLogout(); if (onBack) onBack(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    color: '#dc2626',
                    fontWeight: 400
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={18} strokeWidth={1.5} />
                  <span style={{ fontSize: '0.9rem' }}>Cerrar Sesión</span>
                </button>
              </nav>
            </aside>

            {/* --- CONTENIDO PRINCIPAL DERECHO --- */}
            <main style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Encabezado */}
              <div>
                <h1 style={{ fontSize: '1.75rem', color: '#1a1a1a', margin: '0 0 6px', fontWeight: 500, fontFamily: 'serif', letterSpacing: '-0.02em' }}>
                  {activeTab === 'compras' ? 'Historial de Compras' : 'Mi Cuenta'}
                </h1>
                <p style={{ color: '#666666', margin: 0, fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 400 }}>
                  {activeTab === 'compras' 
                    ? 'Supervisa tus compras y consulta el estado de envío de tus productos.' 
                    : 'Gestiona tu información personal y datos de contacto.'}
                </p>
              </div>

              {activeTab === 'compras' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Resumen simple */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px'
                  }}>
                    <div style={{
                      backgroundColor: '#ffffff',
                      padding: '20px 24px',
                      borderRadius: '14px',
                      border: '1px solid #eaeaea'
                    }}>
                      <span style={{ fontSize: '0.8rem', color: '#737373', fontWeight: 400, display: 'block', marginBottom: '4px' }}>
                        Total de adquisiciones
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a' }}>
                        {pedidos.length} {pedidos.length === 1 ? 'reloj' : 'relojes'}
                      </span>
                    </div>

                    <div style={{
                      backgroundColor: '#ffffff',
                      padding: '20px 24px',
                      borderRadius: '14px',
                      border: '1px solid #eaeaea'
                    }}>
                      <span style={{ fontSize: '0.8rem', color: '#737373', fontWeight: 400, display: 'block', marginBottom: '4px' }}>
                        Inversión acumulada
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 500, color: '#1a1a1a' }}>
                        S/ {totalInvertido.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {cargandoPedidos ? (
                    <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #eaeaea' }}>
                      <div style={{ width: '28px', height: '28px', border: '2px solid #e0e0e0', borderTopColor: '#1a1a1a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                      <p style={{ color: '#737373', fontSize: '0.88rem', margin: 0, fontWeight: 400 }}>Cargando información de pedidos...</p>
                    </div>
                  ) : pedidos.length === 0 ? (
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eaeaea', padding: '56px 24px', textAlign: 'center' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f5f5f7', color: '#666666', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Truck size={26} strokeWidth={1.5} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', color: '#1a1a1a', marginBottom: '6px', fontWeight: 500, fontFamily: 'serif' }}>
                        Aún no registras compras online
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#666666', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.6, fontWeight: 400 }}>
                        Explora nuestro catálogo para encontrar piezas exclusivas de alta relojería.
                      </p>
                      <button
                        type="button"
                        onClick={onBack}
                        style={{
                          backgroundColor: '#1a1a1a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '10px 24px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          fontWeight: 400,
                          cursor: 'pointer'
                        }}
                      >
                        Explorar Colección
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {pedidos.map((ped, idx) => {
                        const refCode = ped.id ? String(ped.id).slice(-6).toUpperCase() : `ORD-${idx + 1}`;
                        
                        return (
                          <div key={ped.id || idx} style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '14px',
                            border: '1px solid #eaeaea',
                            overflow: 'hidden'
                          }}>
                            {/* Cabecera del pedido */}
                            <div style={{
                              padding: '16px 22px',
                              backgroundColor: '#fafafa',
                              borderBottom: '1px solid #eaeaea',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '12px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#1a1a1a', fontFamily: 'monospace' }}>#{refCode}</span>
                                <span style={{ color: '#737373', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 400 }}>
                                  <Calendar size={14} strokeWidth={1.5} />
                                  {new Date(ped.fechaCreacion || Date.now()).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                {/* Estado del pedido en barra limpia */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#555555', fontWeight: 400 }}>
                                  <span style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: ped.estadoOrden === 'ENTREGADO' ? '#22c55e' : (ped.estadoOrden === 'ENVIADO' ? '#3b82f6' : '#f59e0b')
                                  }} />
                                  <span>
                                    {ped.estadoOrden === 'ENTREGADO' ? 'Entregado' : (ped.estadoOrden === 'ENVIADO' ? 'En camino' : (ped.estadoOrden === 'EN_PREPARACION' ? 'En preparación' : 'Pendiente'))}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppOrderInquiry(ped)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e0e0e0',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    color: '#444444',
                                    fontSize: '0.8rem',
                                    fontWeight: 400,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#1a1a1a'; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#444444'; }}
                                >
                                  <ExternalLink size={13} strokeWidth={1.5} />
                                  Soporte
                                </button>
                              </div>
                            </div>
                            
                            {/* Alerta de seguimiento */}
                            {ped.numeroSeguimiento && ped.estadoOrden === 'ENVIADO' && (
                              <div style={{ backgroundColor: '#f0f9ff', borderBottom: '1px solid #e0f2fe', padding: '10px 22px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', fontSize: '0.82rem', fontWeight: 400 }}>
                                <Truck size={15} strokeWidth={1.5} />
                                <span>Código de seguimiento: <span style={{ fontFamily: 'monospace' }}>{ped.numeroSeguimiento}</span></span>
                              </div>
                            )}
                            
                            {/* Detalles del pedido */}
                            <div style={{ padding: '20px 22px' }}>
                              {ped.detalles && ped.detalles.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                  {ped.detalles.map((item, itemIdx) => (
                                    <div key={item.id || itemIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666666', flexShrink: 0 }}>
                                          <Package size={20} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                          <h4 style={{ fontSize: '0.92rem', fontWeight: 500, color: '#1a1a1a', margin: '0 0 2px' }}>{item.nombreProducto}</h4>
                                          <span style={{ fontSize: '0.8rem', color: '#737373', fontWeight: 400 }}>Cantidad: {item.cantidad}</span>
                                        </div>
                                      </div>
                                      <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#1a1a1a' }}>
                                          S/ {Number(item.subtotal || item.precioUnitario * item.cantidad || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ fontSize: '0.85rem', color: '#737373', fontWeight: 400 }}>Compra realizada en tienda</div>
                              )}
                              
                              <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.82rem', color: '#737373', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <ShieldCheck size={15} color="#8a733e" strokeWidth={1.5} />
                                  Envío asegurado incluido
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '0.85rem', color: '#737373', fontWeight: 400 }}>Total:</span>
                                  <span style={{ fontSize: '1.15rem', fontWeight: 500, color: '#1a1a1a' }}>
                                    S/ {Number(ped.total || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'cuenta' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Tarjeta: Información Personal */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eaeaea', padding: '24px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.01)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={20} color="#1a1a1a" strokeWidth={1.5} />
                        <h3 style={{ fontSize: '1.15rem', color: '#1a1a1a', margin: 0, fontWeight: 500, fontFamily: 'serif' }}>
                          Información Personal
                        </h3>
                      </div>
                      
                      {!isEditingProfile ? (
                        <button
                          onClick={handleEditClick}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px', background: '#f5f5f7', border: 'none',
                            padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', color: '#1a1a1a',
                            fontSize: '0.82rem', fontWeight: 400, transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e5e7'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f5f5f7'}
                        >
                          <Edit2 size={14} strokeWidth={1.5} /> Editar
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setIsEditingProfile(false)}
                            disabled={savingProfile}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: '1px solid #e0e0e0', 
                              borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: '#666666', fontSize: '0.82rem', fontWeight: 400
                            }}
                          >
                            <X size={14} /> Cancelar
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '4px', background: '#1a1a1a', border: 'none', 
                              borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', color: '#ffffff', fontSize: '0.82rem', fontWeight: 400
                            }}
                          >
                            <Save size={14} /> {savingProfile ? 'Guardando...' : 'Guardar'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                      <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#fafafa', border: '1px solid #f0f0f0' }}>
                        <span style={{ fontSize: '0.75rem', color: '#737373', fontWeight: 400, display: 'block', marginBottom: '4px' }}>Nombres</span>
                        {!isEditingProfile ? (
                          <span style={{ fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a' }}>{user.nombres || user.nombre.split(' ')[0]}</span>
                        ) : (
                          <input type="text" value={profileFormData.nombres} onChange={e => setProfileFormData(p => ({ ...p, nombres: e.target.value }))}
                            style={{ width: '100%', padding: '4px 0', border: 'none', borderBottom: '1px solid #1a1a1a', background: 'transparent', outline: 'none', fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 400 }}
                          />
                        )}
                      </div>

                      <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#fafafa', border: '1px solid #f0f0f0' }}>
                        <span style={{ fontSize: '0.75rem', color: '#737373', fontWeight: 400, display: 'block', marginBottom: '4px' }}>Apellidos</span>
                        {!isEditingProfile ? (
                          <span style={{ fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a' }}>{user.apellidos || (user.nombre.split(' ').slice(1).join(' ') || '-')}</span>
                        ) : (
                          <input type="text" value={profileFormData.apellidos} onChange={e => setProfileFormData(p => ({ ...p, apellidos: e.target.value }))}
                            style={{ width: '100%', padding: '4px 0', border: 'none', borderBottom: '1px solid #1a1a1a', background: 'transparent', outline: 'none', fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 400 }}
                          />
                        )}
                      </div>

                      <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#fafafa', border: '1px solid #f0f0f0' }}>
                        <span style={{ fontSize: '0.75rem', color: '#737373', fontWeight: 400, display: 'block', marginBottom: '4px' }}>Correo Electrónico</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a' }}>{user.email}</span>
                      </div>

                      <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#fafafa', border: '1px solid #f0f0f0' }}>
                        <span style={{ fontSize: '0.75rem', color: '#737373', fontWeight: 400, display: 'block', marginBottom: '4px' }}>Teléfono</span>
                        {!isEditingProfile ? (
                          <span style={{ fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a' }}>{user.telefono || 'No especificado'}</span>
                        ) : (
                          <input type="tel" value={profileFormData.telefono} onChange={e => setProfileFormData(p => ({ ...p, telefono: e.target.value }))}
                            style={{ width: '100%', padding: '4px 0', border: 'none', borderBottom: '1px solid #1a1a1a', background: 'transparent', outline: 'none', fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 400 }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta: Preferencias de Entrega */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eaeaea', padding: '24px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.01)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                      <MapPin size={20} color="#1a1a1a" strokeWidth={1.5} />
                      <h3 style={{ fontSize: '1.15rem', color: '#1a1a1a', margin: 0, fontWeight: 500, fontFamily: 'serif' }}>
                        Preferencias de Entrega
                      </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#fafafa', border: '1px solid #f0f0f0' }}>
                        <span style={{ fontSize: '0.75rem', color: '#737373', fontWeight: 400, display: 'block', marginBottom: '4px' }}>Ciudad Principal</span>
                        <p style={{ fontSize: '0.95rem', fontWeight: 400, color: '#1a1a1a', margin: '0 0 4px' }}>{user.ciudad || 'Lima Metropolitana, Perú'}</p>
                        <p style={{ fontSize: '0.82rem', color: '#737373', margin: 0, fontWeight: 400 }}>Dirección configurada para tus entregas.</p>
                      </div>

                      <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#fafafa', border: '1px solid #eaeaea', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <ShieldCheck size={22} color="#8a733e" style={{ flexShrink: 0, marginTop: '2px' }} strokeWidth={1.5} />
                        <div>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 500, color: '#1a1a1a', margin: '0 0 4px' }}>Garantía Internacional</h4>
                          <p style={{ fontSize: '0.82rem', color: '#666666', margin: 0, lineHeight: 1.5, fontWeight: 400 }}>Tus piezas cuentan con garantía de mantenimiento y ajuste en nuestras boutique oficiales.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
