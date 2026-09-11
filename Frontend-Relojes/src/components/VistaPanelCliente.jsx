"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Truck, 
  User, 
  Award, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  LogOut, 
  Package, 
  ExternalLink, 
  Calendar, 
  CreditCard, 
  Sparkles,
  MapPin,
  Phone,
  Mail,
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
  whatsappNumber = '51999999999'
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
    const refCode = ped.id ? String(ped.id).slice(-6).toUpperCase() : 'VIP';
    const text = encodeURIComponent(
      `👋 *CONSULTA DE COMPRA - CONCIERGE L'GANT*\n\n` +
      `Hola, deseo información sobre el seguimiento de mi orden *#${refCode}* realizada el ${new Date(ped.fechaCreacion || Date.now()).toLocaleDateString('es-PE')}.\n` +
      `Titular: ${user?.nombre || 'Cliente VIP'}`
    );
    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`, '_blank');
  };

  return (
    <div style={{
      minHeight: '85vh',
      backgroundColor: 'var(--bg-main)',
      paddingTop: '36px',
      paddingBottom: '80px',
      position: 'relative'
    }}>
      {/* Notificación Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          zIndex: 9999,
          backgroundColor: '#2e3135',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
          animation: 'slideUpToast 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <CheckCircle2 size={20} color="var(--c-gold)" />
          <span style={{ fontSize: '0.94rem', fontWeight: 500 }}>{toastMessage}</span>
          <style>{`
            @keyframes slideUpToast {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Barra superior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#ffffff', border: '1px solid rgba(59, 60, 65, 0.15)', padding: '10px 18px',
              borderRadius: '9999px', color: 'var(--c-deep-purple)', fontSize: '0.85rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={16} /> Volver a la boutique
          </button>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)',
            padding: '6px 14px', borderRadius: '9999px', fontSize: '0.74rem', color: 'var(--c-deep-purple)',
            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'
          }}>
            <Sparkles size={13} color="var(--c-indigo)" />
            Portal Exclusivo VIP
          </div>
        </div>

        {!user ? (
          /* ========================================================== */
          /* NO AUTENTICADO                                             */
          /* ========================================================== */
          <div style={{
            backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid rgba(59, 60, 65, 0.1)',
            padding: '60px 24px', textAlign: 'center', maxWidth: '500px', margin: '40px auto 0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
          }}>
            <User size={48} color="var(--c-taupe)" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
            <h3 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--c-deep-purple)', marginBottom: '12px' }}>
              Acceso a tu Cuenta VIP
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--c-taupe)', lineHeight: 1.6, marginBottom: '32px' }}>
              Para visualizar tu historial de compras, seguimiento y beneficios de la membresía VIP, por favor inicia sesión.
            </p>
            <button type="button" onClick={onRequireAuth} className="btn-indigo">
              Iniciar Sesión VIP
            </button>
          </div>
        ) : (
          /* ========================================================== */
          /* AUTENTICADO: LAYOUT SIDEBAR + CONTENIDO                    */
          /* ========================================================== */
          <div style={{
            display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap'
          }}>
            {/* --- SIDEBAR IZQUIERDO --- */}
            <aside style={{ width: '100%', maxWidth: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Resumen del Perfil */}
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '24px', padding: '36px 24px',
                border: '1px solid rgba(59, 60, 65, 0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
                textAlign: 'center', position: 'relative'
              }}>
                <div style={{
                  width: '76px', height: '76px', borderRadius: '50%', backgroundColor: 'var(--c-deep-purple)', color: '#fff',
                  margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                  fontFamily: 'Cinzel, serif', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 className="font-serif" style={{ margin: '0 0 6px', fontSize: '1.25rem', color: 'var(--c-obsidian)', fontWeight: 600 }}>
                  {user.nombre}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--c-taupe)' }}>{user.email}</p>
                <div style={{ marginTop: '16px', display: 'inline-block', backgroundColor: 'rgba(52, 199, 89, 0.12)', color: '#1f7a35', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                  VIP ACTIVO
                </div>
              </div>

              {/* Menú de Navegación */}
              <nav style={{
                backgroundColor: '#ffffff', borderRadius: '24px', padding: '20px',
                border: '1px solid rgba(59, 60, 65, 0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
                display: 'flex', flexDirection: 'column', gap: '6px'
              }}>
                <button
                  onClick={() => onNavigate && onNavigate('mis-compras')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '14px 20px',
                    borderRadius: '16px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left',
                    backgroundColor: activeTab === 'compras' ? '#f4f4f6' : 'transparent',
                    color: activeTab === 'compras' ? 'var(--c-obsidian)' : 'var(--c-taupe)',
                    fontWeight: activeTab === 'compras' ? 700 : 500
                  }}
                >
                  <Truck size={20} color={activeTab === 'compras' ? 'var(--c-obsidian)' : 'var(--c-taupe)'} />
                  <span style={{ flex: 1, fontSize: '0.96rem' }}>Mis Compras</span>
                  {pedidos.length > 0 && (
                    <span style={{ backgroundColor: 'var(--c-deep-purple)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                      {pedidos.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => onNavigate && onNavigate('cuenta')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '14px 20px',
                    borderRadius: '16px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left',
                    backgroundColor: activeTab === 'cuenta' ? '#f4f4f6' : 'transparent',
                    color: activeTab === 'cuenta' ? 'var(--c-obsidian)' : 'var(--c-taupe)',
                    fontWeight: activeTab === 'cuenta' ? 700 : 500
                  }}
                >
                  <User size={20} color={activeTab === 'cuenta' ? 'var(--c-obsidian)' : 'var(--c-taupe)'} />
                  <span style={{ flex: 1, fontSize: '0.96rem' }}>Mi Cuenta</span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'rgba(59,60,65,0.08)', margin: '12px 0' }} />

                <button
                  onClick={() => { if (onLogout) onLogout(); if (onBack) onBack(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '14px 20px',
                    borderRadius: '16px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left',
                    backgroundColor: 'transparent', color: 'var(--c-blush)', fontWeight: 600
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(219, 74, 43, 0.05)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={20} />
                  <span style={{ fontSize: '0.96rem' }}>Cerrar Sesión</span>
                </button>
              </nav>
            </aside>

            {/* --- CONTENIDO PRINCIPAL DERECHO --- */}
            <main style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Encabezado del área de contenido */}
              <div style={{ padding: '0 8px 12px' }}>
                <h1 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--c-obsidian)', margin: '0 0 10px', fontWeight: 600, letterSpacing: '-0.5px' }}>
                  {activeTab === 'compras' ? 'Historial de Compras' : 'Mi Cuenta VIP'}
                </h1>
                <p style={{ color: 'var(--c-taupe)', margin: 0, fontSize: '0.98rem', lineHeight: 1.5 }}>
                  {activeTab === 'compras' 
                    ? 'Supervisa tus recientes adquisiciones y consulta su estado de entrega blindada en tiempo real.' 
                    : 'Gestiona tu información personal, direcciones de despacho y aprovecha tus garantías exclusivas.'}
                </p>
              </div>

              {activeTab === 'compras' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Resumen de inversiones */}
                  <div style={{ display: 'flex', gap: '24px', backgroundColor: '#ffffff', padding: '24px 32px', borderRadius: '20px', border: '1px solid rgba(59,60,65,0.1)', boxShadow: '0 6px 16px rgba(0,0,0,0.02)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Total Adquisiciones
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-obsidian)' }}>
                        {pedidos.length} {pedidos.length === 1 ? 'Reloj' : 'Relojes'}
                      </span>
                    </div>
                    <div style={{ width: '1px', backgroundColor: 'rgba(59,60,65,0.1)' }} />
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Inversión Acumulada
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-indigo)' }}>
                        S/ {totalInvertido.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {cargandoPedidos ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(59, 60, 65, 0.1)' }}>
                      <div style={{ width: '36px', height: '36px', border: '3px solid rgba(212, 175, 55, 0.2)', borderTopColor: 'var(--c-gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                      <p style={{ color: 'var(--c-taupe)', fontSize: '0.92rem', margin: 0 }}>Consultando el libro de órdenes VIP...</p>
                    </div>
                  ) : pedidos.length === 0 ? (
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid rgba(59, 60, 65, 0.1)', padding: '64px 24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                      <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(212, 175, 55, 0.08)', color: 'var(--c-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                        <Truck size={34} />
                      </div>
                      <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--c-deep-purple)', marginBottom: '8px' }}>
                        Aún no registras compras online
                      </h3>
                      <p style={{ fontSize: '0.92rem', color: 'var(--c-taupe)', maxWidth: '460px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                        Descubre piezas exclusivas de alta relojería suiza y japonesa con garantía internacional de 5 años.
                      </p>
                      <button type="button" onClick={onBack} className="btn-indigo">Explorar la Colección</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {pedidos.map((ped, idx) => {
                        const refCode = ped.id ? String(ped.id).slice(-6).toUpperCase() : `ORD-${idx + 1}`;
                        const isPaid = ped.estadoPago === 'PAGADO' || ped.estadoPago === 'APROBADO';
                        
                        return (
                          <div key={ped.id || idx} style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(59, 60, 65, 0.1)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)', overflow: 'hidden' }}>
                            {/* Cabecera del pedido */}
                            <div style={{ padding: '20px 28px', backgroundColor: '#fbf9f6', borderBottom: '1px solid rgba(59, 60, 65, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--c-deep-purple)', fontFamily: 'monospace' }}>#{refCode}</span>
                                <span style={{ color: 'var(--c-taupe)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Calendar size={15} />
                                  {new Date(ped.fechaCreacion || Date.now()).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '6px 14px', borderRadius: '9999px', backgroundColor: isPaid ? 'rgba(52, 199, 89, 0.12)' : 'rgba(212, 175, 55, 0.12)', color: isPaid ? '#1f7a35' : 'var(--c-deep-purple)', letterSpacing: '0.04em' }}>
                                  {ped.estadoPago || 'REGISTRADO'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppOrderInquiry(ped)}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', border: '1px solid rgba(59, 60, 65, 0.15)', padding: '8px 14px', borderRadius: '10px', color: 'var(--c-deep-purple)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                >
                                  <ExternalLink size={14} />
                                  Rastreo Concierge
                                </button>
                              </div>
                            </div>
                            
                            {/* Detalles del pedido */}
                            <div style={{ padding: '24px 28px' }}>
                              {ped.detalles && ped.detalles.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                  {ped.detalles.map((item, itemIdx) => (
                                    <div key={item.id || itemIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: '#f4f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--c-indigo)', flexShrink: 0 }}>
                                          <Package size={24} />
                                        </div>
                                        <div>
                                          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--c-deep-purple)', margin: '0 0 4px' }}>{item.nombreProducto}</h4>
                                          <span style={{ fontSize: '0.82rem', color: 'var(--c-taupe)' }}>Cantidad: {item.cantidad} • Serie certificada</span>
                                        </div>
                                      </div>
                                      <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--c-deep-purple)' }}>
                                          S/ {Number(item.subtotal || item.precioUnitario * item.cantidad || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ fontSize: '0.9rem', color: 'var(--c-taupe)' }}>Compra en boutique física exclusiva</div>
                              )}
                              
                              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(59,60,65,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.88rem', color: 'var(--c-taupe)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <ShieldCheck size={16} color="var(--c-gold)" />
                                  Custodia y transporte con seguro incluido
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <span style={{ fontSize: '0.9rem', color: 'var(--c-taupe)', fontWeight: 500 }}>Total:</span>
                                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--c-indigo)', letterSpacing: '-0.01em' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Tarjeta: Información Personal */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid rgba(59, 60, 65, 0.1)', padding: '32px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', padding: '8px', borderRadius: '10px' }}>
                          <User size={22} color="var(--c-gold)" />
                        </div>
                        <h3 className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--c-deep-purple)', margin: 0, fontWeight: 600 }}>
                          Información Personal
                        </h3>
                      </div>
                      
                      {!isEditingProfile ? (
                        <button
                          onClick={handleEditClick}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px', background: '#f4f4f6', border: 'none',
                            padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', color: 'var(--c-obsidian)',
                            fontSize: '0.88rem', fontWeight: 600, transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e8e8eb'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f4f4f6'}
                        >
                          <Edit2 size={16} /> Editar Perfil
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => setIsEditingProfile(false)}
                            disabled={savingProfile}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid rgba(59,60,65,0.2)', 
                              borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', color: 'var(--c-taupe)', fontSize: '0.85rem', fontWeight: 500
                            }}
                          >
                            <X size={16} /> Cancelar
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--c-deep-purple)', border: 'none', 
                              borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', color: '#fff', fontSize: '0.85rem', fontWeight: 600
                            }}
                          >
                            <Save size={16} /> {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                      <div style={{ padding: '16px 20px', borderRadius: '14px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Nombres del Titular</span>
                        {!isEditingProfile ? (
                          <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>{user.nombres || user.nombre.split(' ')[0]}</span>
                        ) : (
                          <input type="text" value={profileFormData.nombres} onChange={e => setProfileFormData(p => ({ ...p, nombres: e.target.value }))}
                            style={{ width: '100%', padding: '4px 0', border: 'none', borderBottom: '2px solid var(--c-gold)', background: 'transparent', outline: 'none', fontSize: '1.05rem', color: 'var(--c-obsidian)', fontWeight: 600 }}
                          />
                        )}
                      </div>

                      <div style={{ padding: '16px 20px', borderRadius: '14px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Apellidos</span>
                        {!isEditingProfile ? (
                          <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>{user.apellidos || (user.nombre.split(' ').slice(1).join(' ') || '-')}</span>
                        ) : (
                          <input type="text" value={profileFormData.apellidos} onChange={e => setProfileFormData(p => ({ ...p, apellidos: e.target.value }))}
                            style={{ width: '100%', padding: '4px 0', border: 'none', borderBottom: '2px solid var(--c-gold)', background: 'transparent', outline: 'none', fontSize: '1.05rem', color: 'var(--c-obsidian)', fontWeight: 600 }}
                          />
                        )}
                      </div>

                      <div style={{ padding: '16px 20px', borderRadius: '14px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Correo Electrónico</span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>{user.email}</span>
                          {isEditingProfile && <span style={{ fontSize: '0.65rem', padding: '4px 8px', background: 'rgba(59,60,65,0.1)', borderRadius: '6px', fontWeight: 600, color: 'var(--c-taupe)' }}>No editable</span>}
                        </div>
                      </div>

                      <div style={{ padding: '16px 20px', borderRadius: '14px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Teléfono de Contacto</span>
                        {!isEditingProfile ? (
                          <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--c-obsidian)' }}>{user.telefono || 'No especificado'}</span>
                        ) : (
                          <input type="tel" value={profileFormData.telefono} onChange={e => setProfileFormData(p => ({ ...p, telefono: e.target.value }))}
                            style={{ width: '100%', padding: '4px 0', border: 'none', borderBottom: '2px solid var(--c-gold)', background: 'transparent', outline: 'none', fontSize: '1.05rem', color: 'var(--c-obsidian)', fontWeight: 600 }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta: Dirección y Entregas */}
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid rgba(59, 60, 65, 0.1)', padding: '32px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                      <div style={{ backgroundColor: 'rgba(212,175,55,0.1)', padding: '8px', borderRadius: '10px' }}>
                        <MapPin size={22} color="var(--c-gold)" />
                      </div>
                      <h3 className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--c-deep-purple)', margin: 0, fontWeight: 600 }}>
                        Preferencias de Entrega
                      </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Ciudad Base de Operaciones</span>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--c-obsidian)', margin: '0 0 6px' }}>{user.ciudad || 'Lima Metropolitana, Perú'}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--c-taupe)', margin: 0 }}>Transporte blindado de alta seguridad pre-habilitado para todas tus compras con despacho directo en esta localidad.</p>
                      </div>

                      <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: 'rgba(212, 175, 55, 0.06)', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                        <Award size={28} color="var(--c-indigo)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--c-deep-purple)', margin: '0 0 6px' }}>Garantía Internacional Activa</h4>
                          <p style={{ fontSize: '0.88rem', color: 'var(--c-taupe)', margin: 0, lineHeight: 1.6 }}>Tu cuenta VIP goza de 5 años de mantenimiento preventivo, ajuste de calibre y pulido sin cargo en nuestras boutiques oficiales de San Isidro y Surco.</p>
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
}
