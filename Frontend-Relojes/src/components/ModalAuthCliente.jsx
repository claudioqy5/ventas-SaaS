import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, ShieldCheck, Clock, Award, LogOut, CheckCircle2, ChevronRight, Sparkles, Key, Truck } from 'lucide-react';
import { loginCustomer, registerCustomer, getCustomerOrders } from '../services/api';

export default function ModalAuthCliente({ isOpen, onClose, user, token, onLogin, onLogout, initialTab = 'cuenta' }) {
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || 'cuenta');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  
  // Para historial de pedidos
  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(false);

  useEffect(() => {
    if (isOpen && user && token) {
      cargarPedidos();
    }
  }, [isOpen, user, token]);

  const cargarPedidos = async () => {
    if (!token) return; // Sin token, no intentar
    setCargandoPedidos(true);
    try {
      const data = await getCustomerOrders(token);
      setPedidos(data);
    } catch (err) {
      // Error silencioso — puede ser Mixed Content (HTTP vs HTTPS) o token expirado
      // No mostramos error al usuario, simplemente queda vacío
      console.warn('No se pudo cargar el historial de compras:', err.message);
    } finally {
      setCargandoPedidos(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }
    
    if (isRegister && (!nombres.trim() || !apellidos.trim())) {
      setError('Por favor ingrese sus nombres y apellidos');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      let data;
      if (isRegister) {
        const regRes = await registerCustomer(nombres.trim(), apellidos.trim(), email, password, telefono);
        if (regRes && regRes.requiresVerification) {
          setIsRegister(false);
          setError('');
          setSuccessMessage(regRes.message || '¡Cuenta creada! Hemos enviado un enlace de activación a tu correo. Por favor revísalo antes de ingresar.');
          setIsLoading(false);
          return;
        }
        data = regRes;
      } else {
        data = await loginCustomer(email, password);
      }
      
      const clientData = {
        id: data.client.id || data.client._id,
        nombre: data.client.nombre || `${data.client.nombres || nombres} ${data.client.apellidos || apellidos}`.trim(),
        nombres: data.client.nombres || nombres,
        apellidos: data.client.apellidos || apellidos,
        email: data.client.correo,
        correo: data.client.correo,
        nivel: 'Cliente',
        telefono: data.client.telefono || '',
        // Documento de identidad
        tipoDocumento: data.client.tipoDocumento || 'DNI',
        numeroDocumento: data.client.numeroDocumento || '',
        numDoc: data.client.numeroDocumento || '', // alias para compatibilidad con ProcesoPago
        // Dirección de entrega (última usada, precargada desde el perfil)
        direccion: data.client.direccion || '',
        departamento: data.client.departamento || '',
        provincia: data.client.provincia || '',
        distrito: data.client.distrito || '',
        referencia: data.client.referencia || '',
        ciudad: data.client.distrito || data.client.direccion || 'No especificada',
      };

      onLogin(clientData, data.token);
      onClose();
      
    } catch (err) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: 'rgba(11, 11, 12, 0.75)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        boxShadow: '0 25px 50px -12px rgba(11, 11, 12, 0.35)',
        position: 'relative'

      }}>
        {/* Botón de cerrar global */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            background: 'none',
            border: 'none',
            color: 'var(--c-taupe)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          ✕
        </button>



        {/* Contenido si el Usuario YA está autenticado */}
        {user ? (
          <div>
            <div style={{ padding: '32px 32px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 className="font-serif" style={{ fontSize: '1.45rem', color: 'var(--c-deep-purple)', fontWeight: 600 }}>
                  Panel de Cliente
                </h2>
              </div>

              {/* Selector de Pestañas: Mis Compras / Mi Cuenta */}
              <div style={{
                display: 'flex',
                gap: '8px',
                padding: '4px',
                backgroundColor: '#f4f4f6',
                borderRadius: '12px'
              }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('pedidos')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '9px',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: activeTab === 'pedidos' ? 700 : 500,
                    backgroundColor: activeTab === 'pedidos' ? '#ffffff' : 'transparent',
                    color: activeTab === 'pedidos' ? 'var(--c-gold)' : 'var(--c-taupe)',
                    boxShadow: activeTab === 'pedidos' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Truck size={17} color={activeTab === 'pedidos' ? 'var(--c-gold)' : 'var(--c-taupe)'} />
                  <span>Mis Compras ({pedidos.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('cuenta')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '9px',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: activeTab === 'cuenta' ? 700 : 500,
                    backgroundColor: activeTab === 'cuenta' ? '#ffffff' : 'transparent',
                    color: activeTab === 'cuenta' ? 'var(--c-gold)' : 'var(--c-taupe)',
                    boxShadow: activeTab === 'cuenta' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <User size={17} color={activeTab === 'cuenta' ? 'var(--c-gold)' : 'var(--c-taupe)'} />
                  <span>Mi Cuenta</span>
                </button>
              </div>
            </div>

            <div style={{ padding: '0 32px 32px' }}>
              {activeTab === 'pedidos' ? (
                /* TAB: HISTORIAL DE COMPRAS */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-taupe)', fontWeight: 600 }}>
                      Tus Órdenes Realizadas
                    </span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--c-gold)', fontWeight: 600 }}>
                      {pedidos.length} {pedidos.length === 1 ? 'Compra' : 'Compras'}
                    </span>
                  </div>

                  {cargandoPedidos ? (
                    <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--c-taupe)', padding: '24px 10px' }}>
                      Cargando compras...
                    </div>
                  ) : pedidos.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '36px 20px',
                      borderRadius: '16px',
                      backgroundColor: '#fbf9f6',
                      border: '1px dashed rgba(59, 60, 65, 0.2)',
                      marginBottom: '20px'
                    }}>
                      <Truck size={36} color="var(--c-taupe)" style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                      <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--c-deep-purple)', marginBottom: '4px' }}>
                        Aún no tienes compras online
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--c-taupe)', margin: 0 }}>
                        Tus pedidos confirmados aparecerán en este panel con estado y comprobante.
                      </p>
                    </div>
                  ) : (
                    <div style={{ maxHeight: '360px', overflowY: 'auto', paddingRight: '4px', marginBottom: '20px' }}>
                      {pedidos.map((ped, idx) => (
                        <div key={ped.id || idx} style={{
                          padding: '16px',
                          borderRadius: '14px',
                          border: '1px solid rgba(59, 60, 65, 0.12)',
                          backgroundColor: '#ffffff',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                          marginBottom: '10px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div>
                              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--c-deep-purple)' }}>
                                {ped.detalles && ped.detalles.length > 0 ? ped.detalles[0].nombreProducto : 'Compra en tienda'}
                                {ped.detalles && ped.detalles.length > 1 && ` (+${ped.detalles.length - 1} más)`}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: 'var(--c-taupe)', marginTop: '2px' }}>
                                Ref: #{ped.id ? String(ped.id).slice(-6).toUpperCase() : `ORD-${idx + 1}`} • {new Date(ped.fechaCreacion || Date.now()).toLocaleDateString('es-PE')}
                              </div>
                            </div>
                            <div style={{
                              fontSize: '0.72rem',
                              backgroundColor: ped.estadoPago === 'PAGADO' || ped.estadoPago === 'APROBADO' ? 'rgba(52, 199, 89, 0.12)' : 'rgba(212, 175, 55, 0.15)',
                              color: ped.estadoPago === 'PAGADO' || ped.estadoPago === 'APROBADO' ? '#248a3d' : 'var(--c-deep-purple)',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontWeight: 600
                            }}>
                              {ped.estadoPago || 'REGISTRADO'}
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f0f0f2' }}>
                            <span style={{ fontSize: '0.76rem', color: 'var(--c-taupe)' }}>
                              Total cancelado:
                            </span>
                            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--c-indigo)' }}>
                              S/ {Number(ped.total || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* TAB: MI CUENTA / DATOS DEL CLIENTE */
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                    padding: '20px',
                    borderRadius: '16px',
                    backgroundColor: '#fbf9f6',
                    border: '1px solid rgba(59, 60, 65, 0.15)',
                    marginBottom: '18px'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--c-deep-purple)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"Cinzel", serif',
                      fontSize: '1.4rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(11, 11, 12, 0.2)'
                    }}>
                      {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3 className="font-serif" style={{ fontSize: '1.18rem', color: 'var(--c-deep-purple)', fontWeight: 600 }}>
                        {user.nombre}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--c-gold)', fontWeight: 600 }}>
                        {user.nivel || 'Cliente Concierge'}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--c-taupe)', marginTop: '2px', fontWeight: 400 }}>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Campos de datos del usuario */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid rgba(59, 60, 65, 0.12)',
                    padding: '16px',
                    marginBottom: '18px'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                          Nombres
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--c-deep-purple)' }}>
                          {user.nombres || user.nombre.split(' ')[0]}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                          Apellidos
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--c-deep-purple)' }}>
                          {user.apellidos || (user.nombre.split(' ').slice(1).join(' ') || '-')}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                          Teléfono
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--c-deep-purple)' }}>
                          {user.telefono || 'No registrado'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                          Ciudad / Dirección
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--c-deep-purple)' }}>
                          {user.ciudad || 'No especificada'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Garantía */}
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(212, 175, 55, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                  }}>
                    <Award size={22} color="var(--c-indigo)" />
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--c-deep-purple)' }}>
                        Garantía Internacional 5 Años Activa en Perú
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--c-taupe)' }}>
                        Serie: VT-9080-PERU-004 (Cobertura total en showrooms San Isidro y Surco)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de Cerrar Sesión */}
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid var(--c-obsidian)',
                  backgroundColor: 'transparent',
                  color: 'var(--c-obsidian)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--c-obsidian)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--c-obsidian)';
                }}
              >
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          /* Formulario de Login / Registro Minimalista en Español */
          <form onSubmit={handleSubmit} style={{ padding: '48px 40px 40px' }}>
            {error && (
              <div style={{
                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                color: '#ff3b30',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '18px',
                fontWeight: 500
              }}>
                ⚠️ {error}
              </div>
            )}

            {successMessage && (
              <div style={{
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                border: '1px solid rgba(52, 199, 89, 0.3)',
                color: '#248a3d',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                marginBottom: '18px',
                fontWeight: 500,
                lineHeight: 1.5
              }}>
                ✉️ {successMessage}
              </div>
            )}

            <div style={{ marginBottom: '28px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <img
                  src="/logo-lgant-gold.png"
                  alt="L'gant"
                  style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <h2 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--c-deep-purple)', fontWeight: 600, marginBottom: '6px' }}>
                {isRegister ? 'Crear Cuenta' : 'Acceso Clientes'}
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--c-taupe)' }}>
                {isRegister 
                  ? 'Completa tus datos para disfrutar de piezas y beneficios exclusivos' 
                  : 'Ingresa a tu cuenta para gestionar tus pedidos y garantías'}
              </p>
            </div>

            {isRegister && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--c-deep-purple)', marginBottom: '8px' }}>
                    Nombres *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="var(--c-taupe)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input
                      type="text"
                      placeholder="Ej. Juan Carlos"
                      value={nombres}
                      onChange={(e) => setNombres(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: '8px',
                        border: '1px solid rgba(59, 60, 65, 0.2)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        color: 'var(--c-deep-purple)',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--c-indigo)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(59, 60, 65, 0.2)'}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--c-deep-purple)', marginBottom: '8px' }}>
                    Apellidos *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="var(--c-taupe)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                    <input
                      type="text"
                      placeholder="Ej. Pérez Gómez"
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: '8px',
                        border: '1px solid rgba(59, 60, 65, 0.2)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        color: 'var(--c-deep-purple)',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--c-indigo)'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(59, 60, 65, 0.2)'}
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--c-deep-purple)', marginBottom: '8px' }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '10px', color: 'var(--c-taupe)', fontFamily: 'sans-serif', fontSize: '1.2rem', fontWeight: 500 }}>@</span>
                <input
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 60, 65, 0.2)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    color: 'var(--c-deep-purple)',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--c-indigo)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(59, 60, 65, 0.2)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--c-deep-purple)', marginBottom: '8px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--c-taupe)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 60, 65, 0.2)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    color: 'var(--c-deep-purple)',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--c-indigo)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(59, 60, 65, 0.2)'}
                />
              </div>
            </div>

            {!isRegister && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--c-deep-purple)', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--c-indigo)', width: '14px', height: '14px', cursor: 'pointer' }} />
                  Recordarme
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '0.85rem', color: 'var(--c-indigo)', textDecoration: 'none', fontWeight: 500 }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--c-deep-purple)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(11, 11, 12, 0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-deep-purple)'}
            >
              {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--c-deep-purple)', marginBottom: '8px' }}>
              {isRegister ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
              <span 
                onClick={() => { setIsRegister(!isRegister); setError(''); }} 
                style={{ color: 'var(--c-indigo)', cursor: 'pointer', fontWeight: 500 }}
              >
                {isRegister ? 'Inicia Sesión' : 'Regístrate'}
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
