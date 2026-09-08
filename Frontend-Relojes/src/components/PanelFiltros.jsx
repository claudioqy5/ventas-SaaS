import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';

export default function PanelFiltros({ filters, setFilters, dynamicAttributesMap, isMobileOpen, onCloseMobile }) {
  const [openSections, setOpenSections] = useState({
    precio: true,
    disponibilidad: true,
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

  const activeCount = (filters.priceRange.min !== '' || filters.priceRange.max !== '' ? 1 : 0) +
                      (filters.inStockOnly ? 1 : 0) +
                      (filters.dynamic ? Object.values(filters.dynamic).reduce((acc, val) => acc + (val ? val.length : 0), 0) : 0);

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

  const toggleDynamicAttr = (attrName, val) => {
    setFilters(prev => {
      const dynamic = { ...(prev.dynamic || {}) };
      const currentSelected = dynamic[attrName] || [];
      const isSelected = currentSelected.includes(val);
      
      dynamic[attrName] = isSelected
        ? currentSelected.filter(v => v !== val)
        : [...currentSelected, val];
        
      return { ...prev, dynamic };
    });
  };

  const filterBody = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={18} color="var(--c-indigo)" />
          <h3 style={{ fontSize: '0.9rem', color: 'var(--c-deep-purple)', letterSpacing: '0.05em', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>
            FILTRAR POR {activeCount > 0 && <span style={{ color: 'var(--c-indigo)', fontWeight: 800 }}>({activeCount})</span>}
          </h3>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--c-deep-purple)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={22} />
          </button>
        )}
      </div>

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

      {/* FILTROS DINÁMICOS (Material, Color, Correa, etc.) */}
      {dynamicAttributesMap && Object.entries(dynamicAttributesMap).map(([attrName, options]) => (
        options.length > 0 && (
          <div key={attrName} style={{ padding: '16px 0px', borderBottom: '1px solid var(--border-light)' }}>
            <SectionHeader title={attrName} section={attrName} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              {options.map(val => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--c-deep-purple)', textTransform: 'capitalize' }}>
                  <input
                    type="checkbox"
                    checked={(filters.dynamic?.[attrName] || []).includes(val)}
                    onChange={() => toggleDynamicAttr(attrName, val)}
                    style={{ accentColor: 'var(--c-primary)', width: '16px', height: '16px' }}
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
          </div>
        )
      ))}
      
      {/* Botón de limpiar filtros */}
      <button 
        onClick={() => setFilters({ priceRange: { min: '', max: '' }, inStockOnly: false, dynamic: {} })}
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

      {/* Botón de Ver Resultados en Móvil */}
      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'var(--c-indigo)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 14px rgba(11, 11, 12, 0.25)'
          }}
        >
          Ver Resultados
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (visible on desktop) */}
      <aside className="panel-filtros-desktop">
        {filterBody}
      </aside>

      {/* Mobile Drawer (visible when isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="panel-filtros-mobile-overlay" onClick={onCloseMobile}>
          <div className="panel-filtros-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            {filterBody}
          </div>
        </div>
      )}
    </>
  );
}
