"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Truck, 
  User, 
  Award,
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
  X
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
      backgroundColor: 'var(--bg-main)',
      paddingTop: '32px',
      paddingBottom: '80px',
      position: 'relative'
    }}>
      {/* Notificación Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '36px',
          right: '36px',
          zIndex: 9999,
          backgroundColor: '#2e3135',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
          animation: 'slideUpToast 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <CheckCircle2 size={18} color="var(--c-gold)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>{toastMessage}</span>
        </div>
      )}

      <div style={{ maxWidth: '85%', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Barra superior de navegación */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#ffffff', border: '1px solid rgba(59, 60, 65, 0.15)', padding: '9px 18px',
              borderRadius: '9999px', color: 'var(--c-deep-purple)', fontSize: '0.85rem', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={16} /> Volver a la boutique
          </button>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.25)',
            padding: '5px 14px', borderRadius: '9999px', fontSize: '0.74rem', color: 'var(--c-deep-purple)',
            fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase'
          }}>
            <Sparkles size={12} color="var(--c-indigo)" />
            Portal Exclusivo
          </div>
        </div>

        {!user ? (
          /* NO AUTENTICADO */
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(59, 60, 65, 0.1)',
            padding: '56px 24px', textAlign: 'center', maxWidth: '480px', margin: '40px auto 0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.02)'
          }}>
            <User size={44} color="var(--c-taupe)" style={{ margin: '0 auto 18px', opacity: 0.5 }} />
            <h3 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--c-deep-purple)', marginBottom: '10px', fontWeight: 500 }}>
              Acceso a tu Cuenta
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--c-taupe)', lineHeight: 1.6, marginBottom: '28px', fontWeight: 400 }}>
              Para visualizar tu historial de compras, seguimiento y gestión de tu cuenta, inicia sesión.
            </p>
            <button type="button" onClick={onRequireAuth} className="btn-indigo">
              Iniciar Sesión
            </button>
          </div>
        ) : (
          /* AUTENTICADO: LAYOUT SIDEBAR + CONTENIDO */
          <div style={{
            display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap'
          }}>
            {/* --- SIDEBAR IZQUIERDO --- */}
            <aside style={{ width: '100%', maxWidth: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Resumen del Perfil */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '20px', padding: '32px 20px',
                border: '1px solid rgba(59, 60, 65, 0.1)', boxShadow: '0 6px 20px rgba(0,0,0,0.01)',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--c-deep-purple)', color: '#fff',
                  margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
                  fontFamily: 'Cinzel, serif', fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 className="font-serif" style={{ margin: '0 0 4px', fontSize: '1.2rem', color: 'var(--c-obsidian)', fontWeight: 500 }}>
                  {user.nombre}
                </h3>
                <p style={{ margin: '0 0 12px', fontSize: '0.84rem', color: 'var(--c-taupe)', fontWeight: 400 }}>{user.email}</p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#166534',
                  padding: '3px 12px', borderRadius: '16px', fontSize: '0.72rem', fontWeight: 500
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                  Cuenta Activa
                </div>
              </div>

              {/* Menú de Navegación */}
              <nav style={{
                backgroundColor: '#ffffff', borderRadius: '20px', padding: '14px',
                border: '1px solid rgba(59, 60, 65, 0.1)', boxShadow: '0 6px 20px rgba(0,0,0,0.01)',
                display: 'flex', flexDirection: 'column', gap: '4px'
              }}>
                <button
                  onClick={() => onNavigate && onNavigate('mis-compras')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 18px',
                    borderRadius: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left',
                    backgroundColor: activeTab === 'compras' ? '#f4f4f6' : 'transparent',
                    color: activeTab === 'compras' ? 'var(--c-obsidian)' : 'var(--c-taupe)',
                    fontWeight: activeTab === 'compras' ? 500 : 400
                  }}
                >
                  <Truck size={19} color={activeTab === 'compras' ? 'var(--c-obsidian)' : 'var(--c-taupe)'} />
                  <span style={{ flex: 1, fontSize: '0.94rem' }}>Mis Compras</span>
                  {pedidos.length > 0 && (
                    <span style={{ backgroundColor: 'var(--c-deep-purple)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 500 }}>
                      {pedidos.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => onNavigate && onNavigate('cuenta')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 18px',
                    borderRadius: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left',
                    backgroundColor: activeTab === 'cuenta' ? '#f4f4f6' : 'transparent',
                    color: activeTab === 'cuenta' ? 'var(--c-obsidian)' : 'var(--c-taupe)',
                    fontWeight: activeTab === 'cuenta' ? 500 : 400
                  }}
                >
                  <User size={19} color={activeTab === 'cuenta' ? 'var(--c-obsidian)' : 'var(--c-taupe)'} />
                  <span style={{ flex: 1, fontSize: '0.94rem' }}>Mi Cuenta</span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'rgba(59,60,65,0.08)', margin: '8px 0' }} />

                <button
                  onClick={() => { if (onLogout) onLogout(); if (onBack) onBack(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 18px',
                    borderRadius: '14px', border: 'none', cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left',
                    backgroundColor: 'transparent', color: 'var(--c-blush)', fontWeight: 500
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(219, 74, 43, 0.05)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={19} />
                  <span style={{ fontSize: '0.94rem' }}>Cerrar Sesión</span>
                </button>
              </nav>
            </aside>

            {/* --- CONTENIDO PRINCIPAL DERECHO --- */}
            <main style={{ flex: 1, minWidth: '310px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* Encabezado del área de contenido */}
              <div style={{ padding: '0 4px 6px' }}>
                <h1 className="font-serif" style={{ fontSize: '2.1rem', color: 'var(--c-obsidian)', margin: '0 0 8px', fontWeight: 500, letterSpacing: '-0.5px' }}>
                  {activeTab === 'compras' ? 'Historial de Compras' : 'Mi Cuenta'}
                </h1>
                <p style={{ color: 'var(--c-taupe)', margin: 0, fontSize: '0.95rem', lineHeight: 1.5, fontWeight: 400 }}>
                  {activeTab === 'compras' 
                    ? 'Supervisa tus recientes adquisiciones y consulta su estado de entrega en tiempo real.' 
                    : 'Gestiona tu información personal, preferencias y garantías exclusivas.'}
                </p>
              </div>

              {activeTab === 'compras' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Resumen de adquisiciones */}
                  <div style={{ display: 'flex', gap: '24px', backgroundColor: '#ffffff', padding: '22px 28px', borderRadius: '18px', border: '1px solid rgba(59,60,65,0.1)', boxShadow: '0 4px 14px rgba(0,0,0,0.015)' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                        Total Adquisiciones
                      </span>
                      <span className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>
                        {pedidos.length} {pedidos.length === 1 ? 'Reloj' : 'Relojes'}
                      </span>
                    </div>
                    <div style={{ width: '1px', backgroundColor: 'rgba(59,60,65,0.1)' }} />
                    <div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                        Inversión Acumulada
                      </span>
                      <span className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--c-indigo)' }}>
                        S/ {totalInvertido.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {cargandoPedidos ? (
                    <div style={{ textAlign: 'center', padding: '54px 20px', backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid rgba(59, 60, 65, 0.1)' }}>
                      <div style={{ width: '32px', height: '32px', border: '2px solid rgba(212, 175, 55, 0.25)', borderTopColor: 'var(--c-gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
                      <p style={{ color: 'var(--c-taupe)', fontSize: '0.9rem', margin: 0, fontWeight: 400 }}>Consultando historial de compras...</p>
                    </div>
                  ) : pedidos.length === 0 ? (
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(59, 60, 65, 0.1)', padding: '60px 24px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.015)' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.08)', color: 'var(--c-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Truck size={30} />
                      </div>
                      <h3 className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--c-deep-purple)', marginBottom: '8px', fontWeight: 500 }}>
                        Aún no registras compras online
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--c-taupe)', maxWidth: '440px', margin: '0 auto 26px', lineHeight: 1.6, fontWeight: 400 }}>
                        Descubre piezas exclusivas de alta relojería con garantía internacional.
                      </p>
                      <button type="button" onClick={onBack} className="btn-indigo">Explorar la Colección</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {pedidos.map((ped, idx) => {
                        const refCode = ped.id ? String(ped.id).slice(-6).toUpperCase() : `ORD-${idx + 1}`;
                        
                        return (
                          <div key={ped.id || idx} style={{ backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid rgba(59, 60, 65, 0.1)', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.015)', overflow: 'hidden' }}>
                            {/* Cabecera del pedido con Croquis / Stepper de Estado */}
                            <div style={{ padding: '18px 24px', backgroundColor: '#fbf9f6', borderBottom: '1px solid rgba(59, 60, 65, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--c-deep-purple)', fontFamily: 'monospace' }}>#{refCode}</span>
                                <span style={{ color: 'var(--c-taupe)', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 400 }}>
                                  <Calendar size={14} />
                                  {new Date(ped.fechaCreacion || Date.now()).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                {/* CROQUIS / STEPPER VISUAL DE ESTADO DEL PEDIDO */}
                                {ped.estadoOrden === 'CANCELADO' ? (
                                  <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '5px 12px', borderRadius: '9999px', backgroundColor: '#fee2e2', color: '#b91c1c', letterSpacing: '0.03em' }}>
                                    ORDEN CANCELADA
                                  </span>
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {/* Pasos: Pendiente -> Preparación -> Enviado -> Entregado */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: ped.estadoOrden === 'PENDIENTE_PAGO' || ped.estadoOrden === 'EN_PREPARACION' || ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? 1 : 0.35 }}>
                                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706' }}></div>
                                      </div>
                                      <span style={{ fontSize: '0.64rem', color: '#d97706', marginTop: '3px', fontWeight: 500 }}>Pendiente</span>
                                    </div>
                                    <div style={{ width: '18px', height: '2px', backgroundColor: ped.estadoOrden === 'EN_PREPARACION' || ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? '#3b82f6' : '#e5e7eb' }}></div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: ped.estadoOrden === 'EN_PREPARACION' || ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? 1 : 0.35 }}>
                                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: ped.estadoOrden === 'EN_PREPARACION' || ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? '#dbeafe' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {ped.estadoOrden === 'EN_PREPARACION' || ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></div> : null}
                                      </div>
                                      <span style={{ fontSize: '0.64rem', color: ped.estadoOrden === 'EN_PREPARACION' || ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? '#2563eb' : 'var(--c-taupe)', marginTop: '3px', fontWeight: 500 }}>Preparación</span>
                                    </div>
                                    <div style={{ width: '18px', height: '2px', backgroundColor: ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? '#8b5cf6' : '#e5e7eb' }}></div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? 1 : 0.35 }}>
                                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? '#ede9fe' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7c3aed' }}></div> : null}
                                      </div>
                                      <span style={{ fontSize: '0.64rem', color: ped.estadoOrden === 'ENVIADO' || ped.estadoOrden === 'ENTREGADO' ? '#7c3aed' : 'var(--c-taupe)', marginTop: '3px', fontWeight: 500 }}>Enviado</span>
                                    </div>
                                    <div style={{ width: '18px', height: '2px', backgroundColor: ped.estadoOrden === 'ENTREGADO' ? '#22c55e' : '#e5e7eb' }}></div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: ped.estadoOrden === 'ENTREGADO' ? 1 : 0.35 }}>
                                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: ped.estadoOrden === 'ENTREGADO' ? '#dcfce7' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {ped.estadoOrden === 'ENTREGADO' ? <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }}></div> : null}
                                      </div>
                                      <span style={{ fontSize: '0.64rem', color: ped.estadoOrden === 'ENTREGADO' ? '#16a34a' : 'var(--c-taupe)', marginTop: '3px', fontWeight: 500 }}>Entregado</span>
                                    </div>
                                  </div>
                                )}
                                
                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppOrderInquiry(ped)}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ffffff', border: '1px solid rgba(59, 60, 65, 0.15)', padding: '7px 13px', borderRadius: '9px', color: 'var(--c-deep-purple)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                >
                                  <ExternalLink size={13} />
                                  Soporte al Cliente
                                </button>
                              </div>
                            </div>
                            
                            {/* Alerta de seguimiento si hay número */}
                            {ped.numeroSeguimiento && ped.estadoOrden === 'ENVIADO' && (
                              <div style={{ backgroundColor: '#f0fdfa', borderBottom: '1px solid rgba(59,60,65,0.08)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f766e', fontSize: '0.84rem' }}>
                                <Truck size={15} />
                                <span>Tu pedido está en camino. Código de seguimiento: <strong style={{ fontWeight: 600 }}>{ped.numeroSeguimiento}</strong></span>
                              </div>
                            )}
                            
                            {/* Detalles del pedido */}
                            <div style={{ padding: '22px 24px' }}>
                              {ped.detalles && ped.detalles.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                  {ped.detalles.map((item, itemIdx) => (
                                    <div key={item.id || itemIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f4f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-indigo)', flexShrink: 0 }}>
                                          <Package size={22} />
                                        </div>
                                        <div>
                                          <h4 className="font-serif" style={{ fontSize: '0.98rem', fontWeight: 500, color: 'var(--c-deep-purple)', margin: '0 0 3px' }}>{item.nombreProducto}</h4>
                                          <span style={{ fontSize: '0.82rem', color: 'var(--c-taupe)', fontWeight: 400 }}>Cantidad: {item.cantidad} • Serie certificada</span>
                                        </div>
                                      </div>
                                      <div style={{ textAlign: 'right' }}>
                                        <span className="font-serif" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--c-deep-purple)' }}>
                                          S/ {Number(item.subtotal || item.precioUnitario * item.cantidad || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ fontSize: '0.88rem', color: 'var(--c-taupe)' }}>Compra en boutique física exclusiva</div>
                              )}
                              
                              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(59,60,65,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.84rem', color: 'var(--c-taupe)', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '7px' }}>
                                  <ShieldCheck size={15} color="var(--c-gold)" />
                                  Custodia y transporte con seguro incluido
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span style={{ fontSize: '0.86rem', color: 'var(--c-taupe)', fontWeight: 400 }}>Total:</span>
                                  <span className="font-serif" style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--c-indigo)', letterSpacing: '-0.01em' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  
                  {/* Tarjeta: Información Personal */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(59, 60, 65, 0.1)', padding: '28px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.015)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', padding: '7px', borderRadius: '9px' }}>
                          <User size={20} color="var(--c-gold)" />
                        </div>
                        <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--c-deep-purple)', margin: 0, fontWeight: 500 }}>
                          Información Personal
                        </h3>
                      </div>
                      
                      {!isEditingProfile ? (
                        <button
                          onClick={handleEditClick}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px', background: '#f4f4f6', border: 'none',
                            padding: '7px 15px', borderRadius: '9px', cursor: 'pointer', color: 'var(--c-obsidian)',
                            fontSize: '0.84rem', fontWeight: 500, transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e8e8eb'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f4f4f6'}
                        >
                          <Edit2 size={15} /> Editar Perfil
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => setIsEditingProfile(false)}
                            disabled={savingProfile}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: '1px solid rgba(59,60,65,0.2)', 
                              borderRadius: '9px', padding: '7px 12px', cursor: 'pointer', color: 'var(--c-taupe)', fontSize: '0.82rem', fontWeight: 400
                            }}
                          >
                            <X size={15} /> Cancelar
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--c-deep-purple)', border: 'none', 
                              borderRadius: '9px', padding: '7px 15px', cursor: 'pointer', color: '#fff', fontSize: '0.82rem', fontWeight: 500
                            }}
                          >
                            <Save size={15} /> {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
                      <div style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Nombres del Titular</span>
                        {!isEditingProfile ? (
                          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--c-obsidian)' }}>{user.nombres || user.nombre.split(' ')[0]}</span>
                        ) : (
                          <input type="text" value={profileFormData.nombres} onChange={e => setProfileFormData(p => ({ ...p, nombres: e.target.value }))}
                            style={{ width: '100%', padding: '3px 0', border: 'none', borderBottom: '2px solid var(--c-gold)', background: 'transparent', outline: 'none', fontSize: '1rem', color: 'var(--c-obsidian)', fontWeight: 500 }}
                          />
                        )}
                      </div>

                      <div style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Apellidos</span>
                        {!isEditingProfile ? (
                          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--c-obsidian)' }}>{user.apellidos || (user.nombre.split(' ').slice(1).join(' ') || '-')}</span>
                        ) : (
                          <input type="text" value={profileFormData.apellidos} onChange={e => setProfileFormData(p => ({ ...p, apellidos: e.target.value }))}
                            style={{ width: '100%', padding: '3px 0', border: 'none', borderBottom: '2px solid var(--c-gold)', background: 'transparent', outline: 'none', fontSize: '1rem', color: 'var(--c-obsidian)', fontWeight: 500 }}
                          />
                        )}
                      </div>

                      <div style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Correo Electrónico</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--c-obsidian)' }}>{user.email}</span>
                          {isEditingProfile && <span style={{ fontSize: '0.65rem', padding: '3px 7px', background: 'rgba(59,60,65,0.08)', borderRadius: '5px', fontWeight: 500, color: 'var(--c-taupe)' }}>No editable</span>}
                        </div>
                      </div>

                      <div style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Teléfono de Contacto</span>
                        {!isEditingProfile ? (
                          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--c-obsidian)' }}>{user.telefono || 'No especificado'}</span>
                        ) : (
                          <input type="tel" value={profileFormData.telefono} onChange={e => setProfileFormData(p => ({ ...p, telefono: e.target.value }))}
                            style={{ width: '100%', padding: '3px 0', border: 'none', borderBottom: '2px solid var(--c-gold)', background: 'transparent', outline: 'none', fontSize: '1rem', color: 'var(--c-obsidian)', fontWeight: 500 }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta: Dirección y Entregas */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(59, 60, 65, 0.1)', padding: '28px', boxShadow: '0 6px 18px rgba(0, 0, 0, 0.015)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', padding: '7px', borderRadius: '9px' }}>
                        <MapPin size={20} color="var(--c-gold)" />
                      </div>
                      <h3 className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--c-deep-purple)', margin: 0, fontWeight: 500 }}>
                        Preferencias de Entrega
                      </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: '4px' }}>Ciudad Base de Operaciones</span>
                        <p style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--c-obsidian)', margin: '0 0 4px' }}>{user.ciudad || 'Lima Metropolitana, Perú'}</p>
                        <p style={{ fontSize: '0.84rem', color: 'var(--c-taupe)', margin: 0, fontWeight: 400 }}>Transporte blindado pre-habilitado para todas tus compras con despacho directo.</p>
                      </div>

                      <div style={{ padding: '18px', borderRadius: '14px', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <Award size={26} color="var(--c-indigo)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <h4 className="font-serif" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--c-deep-purple)', margin: '0 0 4px' }}>Garantía Internacional Activa</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--c-taupe)', margin: 0, lineHeight: 1.5, fontWeight: 400 }}>Tu cuenta cuenta con mantenimiento preventivo, ajuste de calibre y pulido sin cargo en nuestras boutiques oficiales.</p>
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
