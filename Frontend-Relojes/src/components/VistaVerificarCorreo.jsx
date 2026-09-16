"use client";
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { verifyCustomerEmail } from '../services/api';

export default function VistaVerificarCorreo({ onOpenAuth, onNavigateHome }) {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No se encontró el código de verificación en el enlace proporcionado.');
      return;
    }

    const verificar = async () => {
      try {
        const res = await verifyCustomerEmail(token);
        setStatus('success');
        setMessage(res.message || '¡Tu correo electrónico ha sido verificado con éxito!');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'El enlace de verificación no es válido o ya ha expirado.');
      }
    };

    verificar();
  }, []);

  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      backgroundColor: '#fbf9f6'
    }}>
      <div style={{
        maxWidth: '540px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid rgba(59, 60, 65, 0.12)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)',
        padding: '48px 36px',
        textAlign: 'center'
      }}>
        {/* Logo L'gant */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <img
            src="/logo-lgant-gold.png"
            alt="L'gant"
            style={{ height: '46px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {status === 'loading' && (
          <div>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <Loader2 size={36} color="var(--c-gold)" style={{ animation: 'spin 1.2s linear infinite' }} />
            </div>
            <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--c-deep-purple)', marginBottom: '10px', fontWeight: 600 }}>
              Verificando tu cuenta VIP
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--c-taupe)', margin: 0 }}>
              Por favor espera unos instantes mientras confirmamos tus credenciales...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              backgroundColor: 'rgba(52, 199, 89, 0.12)',
              border: '2px solid rgba(52, 199, 89, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <CheckCircle2 size={42} color="#248a3d" />
            </div>

            <span style={{
              display: 'inline-block',
              fontSize: '0.74rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: 'var(--c-gold)',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              padding: '6px 14px',
              borderRadius: '20px',
              marginBottom: '14px'
            }}>
              Membresía VIP Activada
            </span>

            <h2 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--c-deep-purple)', marginBottom: '12px', fontWeight: 600 }}>
              ¡Correo Verificado con Éxito!
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--c-taupe)', lineHeight: 1.6, marginBottom: '32px' }}>
              {message} Ahora puedes iniciar sesión con tus credenciales y acceder a la colección exclusiva de alta relojería.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                onClick={onOpenAuth}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--c-deep-purple)',
                  color: '#ffffff',
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(11, 11, 12, 0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-deep-purple)'}
              >
                Iniciar Sesión VIP
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={onNavigateHome}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(59, 60, 65, 0.2)',
                  backgroundColor: 'transparent',
                  color: 'var(--c-deep-purple)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 59, 48, 0.1)',
              border: '2px solid rgba(255, 59, 48, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <XCircle size={42} color="#ff3b30" />
            </div>

            <h2 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--c-deep-purple)', marginBottom: '12px', fontWeight: 600 }}>
              No se pudo verificar el correo
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--c-taupe)', lineHeight: 1.6, marginBottom: '32px' }}>
              {message}
            </p>

            <button
              type="button"
              onClick={onNavigateHome}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--c-deep-purple)',
                color: '#ffffff',
                fontSize: '0.96rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Volver a la Colección Principal
            </button>
          </div>
        )}

        {/* Sello de Garantía Inferior */}
        <div style={{
          marginTop: '36px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(59, 60, 65, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'var(--c-taupe)',
          fontSize: '0.78rem'
        }}>
          <ShieldCheck size={16} color="var(--c-gold)" />
          L'GANT • Protocolo de Seguridad y Autenticidad Garantizada
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
