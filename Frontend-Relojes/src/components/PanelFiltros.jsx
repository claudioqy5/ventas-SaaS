import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function PanelFiltros({ filters, setFilters }) {
  const [openSections, setOpenSections] = useState({
    precio: true,
    disponibilidad: true,
    material: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (e, type) => {
    const val = e.target.value === '' ? '' : Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: val },
    }));
  };

  const SectionHeader = ({ title, section }) => (
    <div
      onClick={() => toggleSection(section)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        cursor: 'pointer',
        borderTop: '1px solid #f0f0f0',
        marginTop: section === 'precio' ? 0 : '8px',
      }}
    >
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-deep-purple)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {title}
      </span>
      {openSections[section] ? <ChevronUp size={16} color="var(--c-taupe)" /> : <ChevronDown size={16} color="var(--c-taupe)" />}
    </div>
  );

  return (
    <aside style={{
      width: '260px',
      flexShrink: 0,
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid rgba(115, 96, 91, 0.15)',
      alignSelf: 'flex-start',
      position: 'sticky',
      top: '100px'
    }}>
      <h3 style={{ fontSize: '0.9rem', color: 'var(--c-taupe)', marginBottom: '20px', letterSpacing: '0.05em' }}>FILTRAR POR:</h3>

      {/* Rango de Precios */}
      <SectionHeader title="Precio" section="precio" />
      {openSections.precio && (
        <div style={{ paddingBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--c-taupe)' }}>Desde (S/)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange(e, 'min')}
              style={{
                width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.85rem',
                outline: 'none', marginTop: '4px'
              }}
            />
          </div>
          <span style={{ color: '#999', marginTop: '20px' }}>-</span>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--c-taupe)' }}>Hasta (S/)</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange(e, 'max')}
              style={{
                width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.85rem',
                outline: 'none', marginTop: '4px'
              }}
            />
          </div>
        </div>
      )}

      {/* Disponibilidad */}
      <SectionHeader title="Disponibilidad" section="disponibilidad" />
      {openSections.disponibilidad && (
        <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--c-deep-purple)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
              style={{ accentColor: 'var(--c-indigo)' }}
            />
            En stock
          </label>
        </div>
      )}

      {/* Material */}
      <SectionHeader title="Material" section="material" />
      {openSections.material && (
        <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Acero Inoxidable', 'Oro', 'Titanio', 'Piel', 'Diamantes'].map(mat => (
            <label key={mat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--c-deep-purple)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={filters.materials.includes(mat)}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setFilters(prev => {
                    const newMats = isChecked
                      ? [...prev.materials, mat]
                      : prev.materials.filter(m => m !== mat);
                    return { ...prev, materials: newMats };
                  });
                }}
                style={{ accentColor: 'var(--c-indigo)' }}
              />
              {mat}
            </label>
          ))}
        </div>
      )}
      
      {/* Botón de limpiar filtros */}
      <button 
        onClick={() => setFilters({ priceRange: { min: '', max: '' }, inStockOnly: false, materials: [] })}
        style={{
          width: '100%',
          marginTop: '16px',
          padding: '10px',
          backgroundColor: '#f8f8f8',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          fontSize: '0.8rem',
          color: 'var(--c-taupe)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f0'; e.currentTarget.style.color = '#333'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8f8f8'; e.currentTarget.style.color = 'var(--c-taupe)'; }}
      >
        Limpiar Filtros
      </button>

    </aside>
  );
}
