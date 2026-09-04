import React, { useState } from 'react';
import { User, Lock, Mail, ShieldCheck, Clock, Award, LogOut, CheckCircle2, ChevronRight, Sparkles, Key } from 'lucide-react';

export default function ModalAuthCliente({ isOpen, onClose, user, onLogin, onLogout }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  // Cargar credenciales demo con 1 clic
  const handleFillDemoCredentials = () => {
    setEmail('cliente@tempopreciso.pe');
    setPassword('123456');
    setNombre('Aurelio de la Torre');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    const clientData = {
      nombre: nombre || 'Aurelio de la Torre',
      email: email,
      nivel: 'Cliente VIP Concierge',
      ciudad: 'San Isidro, Lima - Perú',
      pedidos: [
        {
          codigo: 'TP-2026-8891',
          producto: 'Vetruvius Chronograph Tourbillon',
          fecha: '02 Sep 2026',
          estado: 'En Tránsito a San Isidro',
          monto: 'S/ 14,850.00'
        }
      ],
      garantias: [
        {
          serie: 'VT-9080-PERU-004',
          modelo: 'Vetruvius Tourbillon',
          validoHasta: 'Sep 2031'
        }
      ]
    };

    onLogin(clientData);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 1200);
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
      backgroundColor: 'rgba(24, 18, 25, 0.75)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '520px',
        borderRadius: '24px',
        border: '1px solid rgba(208, 150, 131, 0.4)',
        boxShadow: '0 25px 50px -12px rgba(45, 66, 98, 0.35)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Encabezado del Modal */}
        <div style={{
          backgroundColor: '#363237',
          padding: '28px 32px 24px',
          color: '#ffffff',
          position: 'relative',
          borderBottom: '2px solid var(--c-blush)'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Sparkles size={20} color="var(--c-blush)" />
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--c-blush)',
              fontFamily: '"Cinzel", serif',
              fontWeight: 700
            }}>
              TEMPO PRECISO • PERÚ
            </span>
          </div>

          <h2 className="font-serif" style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 600 }}>
            {user ? 'Panel de Cliente VIP' : (isRegister ? 'Registro de Cliente VIP' : 'Iniciar Sesión')}
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 400 }}>
            {user ? 'Bienvenido a su espacio privado de alta relojería.' : 'Acceda a su historial de compras, certificados de garantía y lista de deseos.'}
          </p>
        </div>

        {/* Notificación de Éxito */}
        {showSuccessToast && (
          <div style={{
            backgroundColor: 'var(--c-indigo)',
            color: '#ffffff',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: 500
          }}>
            <CheckCircle2 size={18} color="var(--c-blush)" />
            Sesión iniciada correctamente. ¡Bienvenido a TEMPO PRECISO!
          </div>
        )}

        {/* Contenido si el Usuario YA está autenticado */}
        {user ? (
          <div style={{ padding: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: '#fbf9f6',
              border: '1px solid rgba(115, 96, 91, 0.15)',
              marginBottom: '24px'
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
                boxShadow: '0 4px 14px rgba(45, 66, 98, 0.2)'
              }}>
                {user.nombre.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif" style={{ fontSize: '1.18rem', color: 'var(--c-deep-purple)', fontWeight: 600 }}>
                  {user.nombre}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--c-indigo)', fontWeight: 500 }}>
                  ✦ {user.nivel || 'Cliente VIP Concierge'}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--c-taupe)', marginTop: '2px', fontWeight: 400 }}>
                  {user.email} • {user.ciudad}
                </p>
              </div>
            </div>

            {/* Pedidos Recientes */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-taupe)', fontWeight: 500 }}>
                  Última Adquisición
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--c-indigo)', fontWeight: 500 }}>1 Pedido Activo</span>
              </div>

              {user.pedidos && user.pedidos.map((ped, idx) => (
                <div key={idx} style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(45, 66, 98, 0.15)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--c-deep-purple)' }}>
                      {ped.producto}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--c-taupe)' }}>
                      {ped.codigo} • {ped.fecha}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', backgroundColor: 'rgba(208, 150, 131, 0.15)', color: 'var(--c-deep-purple)', padding: '3px 8px', borderRadius: '6px', fontWeight: 500 }}>
                      {ped.estado}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--c-indigo)', marginTop: '4px' }}>
                      {ped.monto}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Garantía */}
            <div style={{
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: 'rgba(45, 66, 98, 0.05)',
              border: '1px solid rgba(45, 66, 98, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '28px'
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

            <button
              onClick={onLogout}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid rgba(115, 96, 91, 0.25)',
                backgroundColor: '#ffffff',
                color: 'var(--c-deep-purple)',
                fontWeight: 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fdf2f2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <LogOut size={16} color="#ff3b30" />
              Cerrar Sesión VIP
            </button>
          </div>
        ) : (
          /* Formulario de Login / Registro */
          <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
            {/* Banner de Credenciales por Defecto */}
            <div style={{
              backgroundColor: 'rgba(208, 150, 131, 0.12)',
              border: '1px dashed var(--c-blush)',
              borderRadius: '14px',
              padding: '14px 18px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--c-deep-purple)' }}>
                  👤 Credenciales por Defecto (Modo Demo)
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--c-taupe)', marginTop: '2px' }}>
                  Usuario: <b>cliente@tempopreciso.pe</b> | Clave: <b>123456</b>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                style={{
                  backgroundColor: 'var(--c-indigo)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.74rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(45, 66, 98, 0.15)'
                }}
              >
                ⚡ Cargar Demo
              </button>
            </div>

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

            {isRegister && (
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-deep-purple)', marginBottom: '6px' }}>
                  Nombre Completo
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="var(--c-taupe)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                  <input
                    type="text"
                    placeholder="Ej. Carlos Mendoza"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      borderRadius: '10px',
                      border: '1px solid rgba(115, 96, 91, 0.25)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      color: 'var(--c-deep-purple)'
                    }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-deep-purple)', marginBottom: '6px' }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="var(--c-taupe)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input
                  type="email"
                  placeholder="cliente@tempopreciso.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(115, 96, 91, 0.25)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    color: 'var(--c-deep-purple)'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: 'var(--c-deep-purple)', marginBottom: '6px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--c-taupe)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 42px',
                    borderRadius: '10px',
                    border: '1px solid rgba(115, 96, 91, 0.25)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    color: 'var(--c-deep-purple)'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--c-indigo)',
                color: '#ffffff',
                fontFamily: 'var(--font-serif)',
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(45, 66, 98, 0.25)',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-indigo-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-indigo)'}
            >
              {isRegister ? 'Crear Cuenta VIP Concierge' : 'Ingresar a Mi Cuenta VIP'}
              <ChevronRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--c-taupe)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isRegister ? '¿Ya tiene cuenta? Inicie sesión aquí' : '¿No tiene cuenta? Regístrese como Cliente VIP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
