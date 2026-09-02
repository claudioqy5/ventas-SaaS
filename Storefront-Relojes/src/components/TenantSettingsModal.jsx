import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, Key } from 'lucide-react';

export default function TenantSettingsModal({
  isOpen,
  onClose,
  empresaId,
  onSaveEmpresaId,
  apiUrl,
  onSaveApiUrl,
  onReload
}) {
  const [tempEmpresaId, setTempEmpresaId] = useState(empresaId || '');
  const [tempApiUrl, setTempApiUrl] = useState(apiUrl || 'http://localhost:5000/api/public/store');
  const [testStatus, setTestStatus] = useState(null);
  const [testMessage, setTestMessage] = useState('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!tempEmpresaId) {
      setTestStatus('error');
      setTestMessage('Por favor ingresa el EmpresaId de MongoDB.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Conectando con el Backend SaaS...');

    try {
      const res = await fetch(`${tempApiUrl}/${tempEmpresaId}`);
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}: Empresa no encontrada o endpoint inactivo.`);
      }
      const data = await res.json();
      setTestStatus('success');
      setTestMessage(`¡Conexión exitosa! Tienda: "${data.nombre}" (${data.planSuscripcion}).`);
    } catch (err) {
      setTestStatus('error');
      setTestMessage(`No se pudo conectar: ${err.message}. Asegúrate de que el backend .NET esté corriendo en el puerto 5000.`);
    }
  };

  const handleSave = () => {
    onSaveEmpresaId(tempEmpresaId);
    onSaveApiUrl(tempApiUrl);
    onReload();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(45, 66, 98, 0.45)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 110,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid rgba(115, 96, 91, 0.25)',
          borderRadius: '20px',
          maxWidth: '520px',
          width: '100%',
          padding: '28px',
          boxShadow: '0 25px 70px rgba(45, 66, 98, 0.25)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={20} color="var(--c-indigo)" />
            <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--c-deep-purple)', letterSpacing: '0.04em', fontWeight: 800 }}>
              Vinculación SaaS Multi-Tenant
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--c-taupe)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--c-taupe)', lineHeight: 1.5, marginBottom: '20px' }}>
          Para que este frontend muestre <strong>únicamente los productos de un cliente específico</strong>, ingresa su <code style={{ color: 'var(--c-indigo)', fontWeight: 700 }}>EmpresaId</code> de la base de datos MongoDB.
        </p>

        {/* Formulario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--c-taupe)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              EmpresaId del Cliente (MongoDB ObjectId):
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={16} color="var(--c-indigo)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input
                type="text"
                value={tempEmpresaId}
                onChange={(e) => setTempEmpresaId(e.target.value.trim())}
                placeholder="Ej: 65e3b9781a2f9c0012345678"
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(115, 96, 91, 0.25)',
                  borderRadius: '8px',
                  padding: '10px 12px 10px 38px',
                  color: 'var(--c-deep-purple)',
                  fontSize: '0.86rem',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontWeight: 600
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: 'var(--c-taupe)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              URL de la API Pública del SaaS:
            </label>
            <input
              type="text"
              value={tempApiUrl}
              onChange={(e) => setTempApiUrl(e.target.value.trim())}
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(115, 96, 91, 0.25)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--c-deep-purple)',
                fontSize: '0.86rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Estado del Test */}
        {testStatus && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: testStatus === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: `1px solid ${testStatus === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: testStatus === 'success' ? '#047857' : '#be123c',
            fontWeight: 600
          }}>
            {testStatus === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{testMessage}</span>
          </div>
        )}

        {/* Acciones */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleTestConnection}
            className="btn-outline-luxury"
            style={{ padding: '10px 16px', fontSize: '0.76rem' }}
          >
            <RefreshCw size={14} />
            Probar API
          </button>
          <button
            onClick={handleSave}
            className="btn-indigo"
            style={{ padding: '10px 20px', fontSize: '0.76rem' }}
          >
            Guardar y Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
