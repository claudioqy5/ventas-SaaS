import React, { useState } from 'react';
import { FileText, Send, CheckCircle, Info } from 'lucide-react';

export default function VistaLibroReclamaciones({ storeName = "L'gant", empresaId }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // 1. Identificación del Consumidor
    nombre: '',
    documento: '',
    domicilio: '',
    telefono: '',
    email: '',
    apoderado: '',
    
    // 2. Identificación del Bien
    tipoBien: 'Producto',
    monto: '',
    descripcionBien: '',
    
    // 3. Detalle
    tipoReclamo: 'Reclamo',
    detalle: '',
    pedido: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('https://ventassaas-api.helifyferdigital.cloud/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monto: Number(formData.monto),
          empresaId: empresaId || "6a9a503000746b35867cddaf"
        })
      });
      if (response.ok) {
        setIsSubmitted(true);
        window.scrollTo(0, 0);
      } else {
        alert('Hubo un error al registrar el reclamo. Por favor intente nuevamente.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión al enviar el reclamo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#FAFAFA',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-sans)',
    color: 'var(--c-obsidian)',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--c-indigo)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const sectionStyle = {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    marginBottom: '24px'
  };

  const sectionTitleStyle = {
    fontSize: '1.1rem',
    fontWeight: 700,
    fontFamily: 'var(--font-serif)',
    color: 'var(--c-obsidian)',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid #F3F4F6',
    paddingBottom: '12px'
  };

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '80vh', backgroundColor: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', maxWidth: '500px', textAlign: 'center', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <CheckCircle size={64} color="var(--c-blush)" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--c-obsidian)', marginBottom: '16px' }}>Reclamo Registrado</h2>
          <p style={{ color: '#4B5563', lineHeight: '1.6', marginBottom: '32px' }}>
            Hemos recibido su solicitud en nuestro Libro de Reclamaciones Virtual. Se ha enviado una copia a su correo electrónico. Nos pondremos en contacto con usted en el plazo establecido por la ley.
          </p>
          <a href="/" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: 'var(--c-obsidian)', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}>Volver a la Tienda</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', padding: '60px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header de la Hoja */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <FileText size={40} color="var(--c-blush)" style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--c-obsidian)', marginBottom: '12px', fontWeight: 600 }}>Libro de Reclamaciones</h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Conforme a lo establecido en el Código de Protección y Defensa del Consumidor</p>
        </div>

        {/* Info Proveedor */}
        <div className="libro-header-grid" style={{ backgroundColor: 'var(--c-obsidian)', color: '#ffffff', padding: '24px', borderRadius: '12px', marginBottom: '32px', gap: '16px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '4px' }}>Razón Social</span>
            <strong style={{ fontSize: '0.95rem' }}>GRUPO SERCAL S.A.C.</strong>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '4px' }}>RUC</span>
            <strong style={{ fontSize: '0.95rem' }}>20614266750</strong>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: '4px' }}>Domicilio Fiscal</span>
            <strong style={{ fontSize: '0.95rem' }}>AV. ECHANDIA 182 MZA. C LOTE. 13 URB. SAN PABLO 2ETA, SAN LUIS, LIMA - PERÚ</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* 1. Identificación del Consumidor */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>
              <span style={{ backgroundColor: 'var(--c-blush)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>1</span>
              Identificación del Consumidor Reclamante
            </h3>
            
            <div className="libro-grid-2" style={{ gap: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nombres y Apellidos *</label>
                <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} style={inputStyle} placeholder="Ej. Juan Pérez" />
              </div>
              <div>
                <label style={labelStyle}>DNI / CE *</label>
                <input type="text" name="documento" required value={formData.documento} onChange={handleChange} style={inputStyle} placeholder="Número de documento" />
              </div>
              <div>
                <label style={labelStyle}>Teléfono *</label>
                <input type="tel" name="telefono" required value={formData.telefono} onChange={handleChange} style={inputStyle} placeholder="Celular o Fijo" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Domicilio *</label>
                <input type="text" name="domicilio" required value={formData.domicilio} onChange={handleChange} style={inputStyle} placeholder="Dirección completa" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>E-mail *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} style={inputStyle} placeholder="correo@ejemplo.com" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Si es menor de edad, nombre del padre, madre o apoderado</label>
                <input type="text" name="apoderado" value={formData.apoderado} onChange={handleChange} style={inputStyle} placeholder="Opcional" />
              </div>
            </div>
          </div>

          {/* 2. Identificación del Bien Contratado */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>
              <span style={{ backgroundColor: 'var(--c-blush)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>2</span>
              Identificación del Bien Contratado
            </h3>
            
            <div className="libro-grid-2" style={{ gap: '20px' }}>
              <div>
                <label style={labelStyle}>Tipo *</label>
                <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="tipoBien" value="Producto" checked={formData.tipoBien === 'Producto'} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--c-blush)' }} />
                    <span style={{ fontSize: '0.95rem' }}>Producto</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="tipoBien" value="Servicio" checked={formData.tipoBien === 'Servicio'} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--c-blush)' }} />
                    <span style={{ fontSize: '0.95rem' }}>Servicio</span>
                  </label>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Monto Reclamado (S/) *</label>
                <input type="number" step="0.01" name="monto" required value={formData.monto} onChange={handleChange} style={inputStyle} placeholder="0.00" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descripción del Producto o Servicio *</label>
                <textarea name="descripcionBien" required value={formData.descripcionBien} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Detalle el modelo del reloj o servicio adquirido..."></textarea>
              </div>
            </div>
          </div>

          {/* 3. Detalle de la reclamación y pedido */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>
              <span style={{ backgroundColor: 'var(--c-blush)', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>3</span>
              Detalle de la Reclamación y Pedido del Consumidor
            </h3>
            
            <div className="libro-flex-row" style={{ gap: '32px', marginBottom: '24px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', flex: 1 }}>
                <input type="radio" name="tipoReclamo" value="Reclamo" checked={formData.tipoReclamo === 'Reclamo'} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: 'var(--c-blush)', marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--c-obsidian)', marginBottom: '4px' }}>Reclamo</strong>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Disconformidad relacionada a los productos o servicios.</span>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', flex: 1 }}>
                <input type="radio" name="tipoReclamo" value="Queja" checked={formData.tipoReclamo === 'Queja'} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: 'var(--c-blush)', marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--c-obsidian)', marginBottom: '4px' }}>Queja</strong>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>Disconformidad no relacionada a los productos o servicios; o, malestar o descontento respecto a la atención al público.</span>
                </div>
              </label>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Detalle de la {formData.tipoReclamo} *</label>
                <textarea name="detalle" required value={formData.detalle} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Describa los hechos..."></textarea>
              </div>
              <div>
                <label style={labelStyle}>Pedido (Lo que solicita) *</label>
                <textarea name="pedido" required value={formData.pedido} onChange={handleChange} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="Qué espera como solución..."></textarea>
              </div>
            </div>
            
            <div style={{ marginTop: '20px', padding: '12px 16px', backgroundColor: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Info size={20} color="var(--c-blush)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--c-obsidian)', lineHeight: '1.5' }}>
                La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI. El proveedor deberá dar respuesta al reclamo en un plazo no mayor a quince (15) días hábiles improrrogables.
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '18px', 
              backgroundColor: 'var(--c-obsidian)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '1rem', 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--c-indigo)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--c-obsidian)'}
          >
            <Send size={20} />
            Enviar Libro de Reclamaciones
          </button>
        </form>
      </div>
    </div>
  );
}
