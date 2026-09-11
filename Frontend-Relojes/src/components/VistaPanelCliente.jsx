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
      paddingBottom: '80px'
    }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Barra superior de navegación interna */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              border: '1px solid rgba(59, 60, 65, 0.18)',
              padding: '10px 18px',
              borderRadius: '9999px',
              color: 'var(--c-deep-purple)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--c-blush)';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 60, 65, 0.18)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <ArrowLeft size={16} />
            Volver a la boutique
          </button>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            color: 'var(--c-deep-purple)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            <Sparkles size={13} color="var(--c-indigo)" />
            Portal Exclusivo VIP
          </div>
        </div>

        {/* Encabezado principal */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid rgba(59, 60, 65, 0.1)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
          padding: '36px 32px 28px',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '28px'
          }}>
            <div>
              <h1 className="font-serif" style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: 'var(--c-deep-purple)',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                {activeTab === 'compras' ? 'Mis Compras y Pedidos' : 'Detalles de Mi Cuenta VIP'}
              </h1>
              <p style={{
                fontSize: '0.92rem',
                color: 'var(--c-taupe)',
                marginTop: '6px',
                marginBottom: 0
              }}>
                {activeTab === 'compras' 
                  ? 'Seguimiento en tiempo real, comprobantes de pago y estado de entrega asegurada.'
                  : 'Gestión de tus datos de contacto, direcciones de custodia y beneficios exclusivos.'}
              </p>
            </div>

            {/* Pestañas de Navegación de Ruta */}
            <div style={{
              display: 'flex',
              backgroundColor: '#f4f4f6',
              padding: '4px',
              borderRadius: '14px',
              gap: '6px'
            }}>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('mis-compras')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTab === 'compras' ? '#ffffff' : 'transparent',
                  color: activeTab === 'compras' ? 'var(--c-obsidian)' : 'var(--c-taupe)',
                  boxShadow: activeTab === 'compras' ? '0 2px 10px rgba(0, 0, 0, 0.08)' : 'none',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === 'compras' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Truck size={18} color={activeTab === 'compras' ? 'var(--c-obsidian)' : 'var(--c-taupe)'} />
                Mis compras {pedidos.length > 0 && `(${pedidos.length})`}
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('cuenta')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: activeTab === 'cuenta' ? '#ffffff' : 'transparent',
                  color: activeTab === 'cuenta' ? 'var(--c-obsidian)' : 'var(--c-taupe)',
                  boxShadow: activeTab === 'cuenta' ? '0 2px 10px rgba(0, 0, 0, 0.08)' : 'none',
                  fontSize: '0.9rem',
                  fontWeight: activeTab === 'cuenta' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <User size={18} color={activeTab === 'cuenta' ? 'var(--c-obsidian)' : 'var(--c-taupe)'} />
                Mi cuenta
              </button>
            </div>
          </div>

          {/* Tarjeta de Resumen VIP si el usuario está autenticado */}
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderRadius: '16px',
              backgroundColor: '#fbf9f6',
              border: '1px solid rgba(59, 60, 65, 0.12)',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--c-deep-purple)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"Cinzel", serif',
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(11, 11, 12, 0.15)'
                }}>
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--c-deep-purple)', fontWeight: 600, margin: 0 }}>
                      {user.nombre}
                    </h3>
                    <span style={{
                      fontSize: '0.72rem',
                      backgroundColor: 'var(--c-blush-light)',
                      color: 'var(--c-obsidian)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontWeight: 700
                    }}>
                      VIP ACTIVO
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--c-taupe)', margin: '4px 0 0 0' }}>
                    {user.email} • {user.ciudad || 'Lima, Perú'}
                  </p>
                </div>
              </div>

              {activeTab === 'compras' && (
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                      Total Adquisiciones
                    </span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--c-deep-purple)' }}>
                      {pedidos.length} {pedidos.length === 1 ? 'Reloj' : 'Relojes'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                      Inversión en Piezas
                    </span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--c-indigo)' }}>
                      S/ {totalInvertido.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CONTENIDO CONDICIONAL: SI NO ESTÁ AUTENTICADO */}
        {!user ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid rgba(59, 60, 65, 0.12)',
            padding: '60px 24px',
            textAlign: 'center',
            maxWidth: '560px',
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card-alt)',
              color: 'var(--c-obsidian)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <User size={34} />
            </div>
            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--c-deep-purple)', marginBottom: '10px' }}>
              Acceso a tu Cuenta VIP Requerido
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--c-taupe)', lineHeight: 1.6, marginBottom: '28px' }}>
              Para visualizar tu historial de compras, seguimiento de entrega asegurada o detalles de membresía VIP, por favor inicia sesión.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={onRequireAuth}
                className="btn-indigo"
              >
                Iniciar Sesión VIP
              </button>
              <button
                type="button"
                onClick={onBack}
                className="btn-outline-luxury"
              >
                Ver Catálogo
              </button>
            </div>
          </div>
        ) : activeTab === 'compras' ? (
          /* ========================================================== */
          /* VISTA: MIS COMPRAS                                         */
          /* ========================================================== */
          <div>
            {cargandoPedidos ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                border: '1px solid rgba(59, 60, 65, 0.1)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  border: '3px solid rgba(212, 175, 55, 0.2)',
                  borderTopColor: 'var(--c-gold)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 16px'
                }} />
                <p style={{ color: 'var(--c-taupe)', fontSize: '0.92rem', margin: 0 }}>
                  Consultando el libro de órdenes VIP...
                </p>
              </div>
            ) : pedidos.length === 0 ? (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: '1px solid rgba(59, 60, 65, 0.1)',
                padding: '64px 24px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  color: 'var(--c-indigo)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px'
                }}>
                  <Truck size={34} />
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--c-deep-purple)', marginBottom: '8px' }}>
                  Aún no registras compras online
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--c-taupe)', maxWidth: '460px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                  Descubre piezas exclusivas de alta relojería suiza y japonesa con garantía internacional de 5 años y custodia blindada.
                </p>
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    backgroundColor: 'var(--c-deep-purple)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    letterSpacing: '0.04em'
                  }}
                >
                  Explorar la Colección
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {pedidos.map((ped, idx) => {
                  const refCode = ped.id ? String(ped.id).slice(-6).toUpperCase() : `ORD-${idx + 1}`;
                  const isPaid = ped.estadoPago === 'PAGADO' || ped.estadoPago === 'APROBADO';
                  
                  return (
                    <div
                      key={ped.id || idx}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        border: '1px solid rgba(59, 60, 65, 0.12)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
                        overflow: 'hidden',
                        transition: 'box-shadow 0.2s ease'
                      }}
                    >
                      {/* Cabecera del pedido */}
                      <div style={{
                        padding: '18px 24px',
                        backgroundColor: '#fbf9f6',
                        borderBottom: '1px solid rgba(59, 60, 65, 0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            color: 'var(--c-deep-purple)',
                            fontFamily: 'monospace'
                          }}>
                            #{refCode}
                          </span>
                          <span style={{ color: 'var(--c-taupe)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={14} />
                            {new Date(ped.fechaCreacion || Date.now()).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            backgroundColor: isPaid ? 'rgba(52, 199, 89, 0.14)' : 'rgba(212, 175, 55, 0.16)',
                            color: isPaid ? '#1f7a35' : 'var(--c-deep-purple)'
                          }}>
                            {ped.estadoPago || 'REGISTRADO'}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleWhatsAppOrderInquiry(ped)}
                            title="Consultar estado de este pedido por WhatsApp"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              backgroundColor: '#ffffff',
                              border: '1px solid rgba(59, 60, 65, 0.16)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              color: 'var(--c-deep-purple)',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <ExternalLink size={13} />
                            Rastreo Concierge
                          </button>
                        </div>
                      </div>

                      {/* Detalles de productos del pedido */}
                      <div style={{ padding: '20px 24px' }}>
                        {ped.detalles && ped.detalles.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {ped.detalles.map((item, itemIdx) => (
                              <div
                                key={item.id || itemIdx}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '16px'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                  <div style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '10px',
                                    backgroundColor: '#f6f4f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--c-indigo)',
                                    flexShrink: 0
                                  }}>
                                    <Package size={22} />
                                  </div>
                                  <div>
                                    <h4 style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--c-deep-purple)', margin: 0 }}>
                                      {item.nombreProducto}
                                    </h4>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--c-taupe)' }}>
                                      Cantidad: {item.cantidad} • Serie certificada
                                    </span>
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--c-deep-purple)' }}>
                                    S/ {Number(item.subtotal || item.precioUnitario * item.cantidad || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.88rem', color: 'var(--c-taupe)' }}>
                            Compra en boutique exclusiva L'gant
                          </div>
                        )}

                        {/* Pie del pedido con Total */}
                        <div style={{
                          marginTop: '18px',
                          paddingTop: '16px',
                          borderTop: '1px solid #f2f0ed',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--c-taupe)', fontWeight: 500 }}>
                            Custodia y transporte con seguro incluido
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.88rem', color: 'var(--c-taupe)', fontWeight: 500 }}>
                              Total Pagado:
                            </span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-indigo)', letterSpacing: '-0.01em' }}>
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
        ) : (
          /* ========================================================== */
          /* VISTA: MI CUENTA VIP                                       */
          /* ========================================================== */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Tarjeta: Datos de Identidad VIP */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(59, 60, 65, 0.12)',
              padding: '28px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={20} color="var(--c-gold)" />
                  <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--c-deep-purple)', margin: 0, fontWeight: 600 }}>
                    Información Personal
                  </h3>
                </div>
                {!isEditingProfile ? (
                  <button
                    onClick={handleEditClick}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--c-indigo)', fontSize: '0.85rem', fontWeight: 600
                    }}
                  >
                    <Edit2 size={14} /> Editar
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      disabled={savingProfile}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: 'none', border: '1px solid rgba(59,60,65,0.2)', 
                        borderRadius: '6px', padding: '4px 8px',
                        cursor: 'pointer', color: 'var(--c-taupe)', fontSize: '0.8rem'
                      }}
                    >
                      <X size={14} /> Cancelar
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '4px',
                        background: 'var(--c-deep-purple)', border: 'none', 
                        borderRadius: '6px', padding: '4px 10px',
                        cursor: 'pointer', color: '#fff', fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      <Save size={14} /> {savingProfile ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                    Nombres del Titular
                  </span>
                  {!isEditingProfile ? (
                    <span style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--c-deep-purple)' }}>
                      {user.nombres || user.nombre.split(' ')[0]}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={profileFormData.nombres}
                      onChange={e => setProfileFormData(p => ({ ...p, nombres: e.target.value }))}
                      style={{
                        width: '100%', padding: '6px 0', border: 'none', borderBottom: '1px solid var(--c-gold)',
                        background: 'transparent', outline: 'none', fontSize: '0.94rem',
                        color: 'var(--c-deep-purple)', fontWeight: 600
                      }}
                    />
                  )}
                </div>

                <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                    Apellidos
                  </span>
                  {!isEditingProfile ? (
                    <span style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--c-deep-purple)' }}>
                      {user.apellidos || (user.nombre.split(' ').slice(1).join(' ') || '-')}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={profileFormData.apellidos}
                      onChange={e => setProfileFormData(p => ({ ...p, apellidos: e.target.value }))}
                      style={{
                        width: '100%', padding: '6px 0', border: 'none', borderBottom: '1px solid var(--c-gold)',
                        background: 'transparent', outline: 'none', fontSize: '0.94rem',
                        color: 'var(--c-deep-purple)', fontWeight: 600
                      }}
                    />
                  )}
                </div>

                <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                    Correo Electrónico
                  </span>
                  <span style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--c-taupe)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {user.email}
                    {isEditingProfile && <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(59,60,65,0.1)', borderRadius: '4px' }}>No editable</span>}
                  </span>
                </div>

                <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                    Teléfono Registrado
                  </span>
                  {!isEditingProfile ? (
                    <span style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--c-deep-purple)' }}>
                      {user.telefono || 'No especificado'}
                    </span>
                  ) : (
                    <input
                      type="tel"
                      value={profileFormData.telefono}
                      onChange={e => setProfileFormData(p => ({ ...p, telefono: e.target.value }))}
                      style={{
                        width: '100%', padding: '6px 0', border: 'none', borderBottom: '1px solid var(--c-gold)',
                        background: 'transparent', outline: 'none', fontSize: '0.94rem',
                        color: 'var(--c-deep-purple)', fontWeight: 600
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Tarjeta: Dirección y Cobertura de Entrega */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(59, 60, 65, 0.12)',
              padding: '28px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <MapPin size={20} color="var(--c-gold)" />
                <h3 className="font-serif" style={{ fontSize: '1.15rem', color: 'var(--c-deep-purple)', margin: 0, fontWeight: 600 }}>
                  Dirección y Entrega
                </h3>
              </div>

              <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#fbf9f6', border: '1px solid rgba(59, 60, 65, 0.08)', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Ciudad / Domicilio Registrado
                </span>
                <p style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--c-deep-purple)', margin: 0 }}>
                  {user.ciudad || 'Lima Metropolitana, Perú'}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--c-taupe)', marginTop: '4px', marginBottom: 0 }}>
                  Transporte blindado de alta seguridad habilitado para todas tus compras.
                </p>
              </div>

              {/* Garantía */}
              <div style={{
                padding: '18px',
                borderRadius: '14px',
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                display: 'flex',
                gap: '14px',
                alignItems: 'flex-start',
                marginBottom: '24px'
              }}>
                <Award size={24} color="var(--c-indigo)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--c-deep-purple)', margin: '0 0 4px 0' }}>
                    Garantía Internacional de 5 Años Activa
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--c-taupe)', margin: 0, lineHeight: 1.5 }}>
                    Mantenimiento preventivo, ajuste de calibre y pulido sin cargo en boutiques oficiales de San Isidro y Surco.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onLogout) onLogout();
                  if (onBack) onBack();
                }}
                className="btn-outline-luxury"
                style={{ width: '100%', marginTop: '16px' }}
              >
                <LogOut size={16} />
                Cerrar Sesión VIP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
