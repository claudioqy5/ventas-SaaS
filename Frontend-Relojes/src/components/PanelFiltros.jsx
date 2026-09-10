import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';

export default function PanelFiltros({ filters, setFilters, dynamicAttributesMap, isMobileOpen, onCloseMobile }) {
  const [openSections, setOpenSections] = useState({
    precio: true,
    disponibilidad: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ 
      ...prev, 
      [section]: prev[section] === undefined ? false : !prev[section] 
    }));
  };

  const handlePriceChange = (e, type) => {
    const val = e.target.value === '' ? '' : Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: val },
    }));
  };

  const removePriceFilter = () => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min: '', max: '' }
    }));
  };

  const toggleDynamicAttr = (attrName, val) => {
    setFilters(prev => {
      const dynamic = { ...(prev.dynamic || {}) };
      const currentSelected = dynamic[attrName] || [];
      const isSelected = currentSelected.includes(val);
      
      const updated = isSelected
        ? currentSelected.filter(v => v !== val)
        : [...currentSelected, val];

      if (updated.length === 0) {
        delete dynamic[attrName];
      } else {
        dynamic[attrName] = updated;
      }
        
      return { ...prev, dynamic };
    });
  };

  const removeSpecificAttr = (attrName, val) => {
    toggleDynamicAttr(attrName, val);
  };

  const activeCount = (filters.priceRange.min !== '' || filters.priceRange.max !== '' ? 1 : 0) +
                      (filters.inStockOnly ? 1 : 0) +
                      (filters.dynamic ? Object.values(filters.dynamic).reduce((acc, val) => acc + (val ? val.length : 0), 0) : 0);

  const SectionHeader = ({ title, section }) => {
    const isOpen = openSections[section] !== false;
    return (
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
          userSelect: 'none'
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--c-obsidian)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {title}
        </span>
        {isOpen ? <ChevronUp size={16} color="var(--c-taupe)" /> : <ChevronDown size={16} color="var(--c-taupe)" />}
      </div>
    );
  };

  const filterBody = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={18} color="var(--c-obsidian)" />
          <h3 style={{ fontSize: '0.88rem', color: 'var(--c-obsidian)', letterSpacing: '0.06em', margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>
            FILTRAR POR {activeCount > 0 && <span style={{ color: 'var(--c-blush)', fontWeight: 800 }}>({activeCount})</span>}
          </h3>
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters({ priceRange: { min: '', max: '' }, inStockOnly: false, dynamic: {} })}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--c-taupe)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: 500,
              padding: '2px 4px'
            }}
          >
            Limpiar todo
          </button>
        )}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--c-obsidian)',
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

      {/* Píldoras de Filtros Activos (Fácil remoción con 1 clic) */}
      {activeCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f0ede8' }}>
          {(filters.priceRange.min !== '' || filters.priceRange.max !== '') && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid var(--c-blush)', borderRadius: '16px', padding: '3px 9px', fontSize: '0.72rem', color: 'var(--c-obsidian)', fontWeight: 600 }}>
              S/ {filters.priceRange.min || 0} - {filters.priceRange.max || 'Max'}
              <X size={12} style={{ cursor: 'pointer' }} onClick={removePriceFilter} />
            </span>
          )}
          {filters.inStockOnly && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid var(--c-blush)', borderRadius: '16px', padding: '3px 9px', fontSize: '0.72rem', color: 'var(--c-obsidian)', fontWeight: 600 }}>
              En stock
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilters(prev => ({ ...prev, inStockOnly: false }))} />
            </span>
          )}
          {filters.dynamic && Object.entries(filters.dynamic).flatMap(([attrName, vals]) => 
            (vals || []).map(val => (
              <span key={`${attrName}-${val}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f0ede8', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '3px 9px', fontSize: '0.72rem', color: 'var(--c-obsidian)', fontWeight: 600 }}>
                {val}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeSpecificAttr(attrName, val)} />
              </span>
            ))
          )}
        </div>
      )}

      {/* Rango de Precios */}
      <SectionHeader title="Precio" section="precio" />
      {openSections.precio !== false && (
        <div style={{ paddingBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', fontWeight: 500 }}>Desde (S/)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange(e, 'min')}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.85rem',
                outline: 'none', marginTop: '4px', background: '#fcfbf8', fontFamily: 'var(--font-main)'
              }}
            />
          </div>
          <span style={{ color: 'var(--c-taupe)', marginTop: '20px' }}>-</span>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.72rem', color: 'var(--c-taupe)', fontWeight: 500 }}>Hasta (S/)</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange(e, 'max')}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.85rem',
                outline: 'none', marginTop: '4px', background: '#fcfbf8', fontFamily: 'var(--font-main)'
              }}
            />
          </div>
        </div>
      )}

      {/* Disponibilidad */}
      <SectionHeader title="Disponibilidad" section="disponibilidad" />
      {openSections.disponibilidad !== false && (
        <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--c-obsidian)', cursor: 'pointer', width: '100%' }}>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
              style={{ accentColor: 'var(--c-obsidian)', width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
            />
            <span style={{ flex: 1, lineHeight: 1.4, wordBreak: 'break-word' }}>En stock</span>
          </label>
        </div>
      )}

      {/* FILTROS DINÁMICOS (Estilo, Colección, Material, etc.) */}
      {dynamicAttributesMap && Object.entries(dynamicAttributesMap).map(([attrName, options]) => {
        const isOpen = openSections[attrName] !== false;
        return options.length > 0 && (
          <div key={attrName} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
            <SectionHeader title={attrName} section={attrName} />
            {isOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px', marginBottom: '16px' }}>
                {options.map(val => {
                  const isChecked = (filters.dynamic?.[attrName] || []).includes(val);
                  return (
                    <label key={val} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: isChecked ? 'var(--c-obsidian)' : 'var(--c-taupe)', fontWeight: isChecked ? 600 : 400, textTransform: 'capitalize', width: '100%' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDynamicAttr(attrName, val)}
                        style={{ accentColor: 'var(--c-obsidian)', width: '16px', height: '16px', flexShrink: 0, marginTop: '2px', cursor: 'pointer' }}
                      />
                      <span style={{ flex: 1, lineHeight: 1.4, wordBreak: 'break-word' }}>{val}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Botón de limpiar filtros al fondo */}
      {activeCount > 0 && (
        <button 
          onClick={() => setFilters({ priceRange: { min: '', max: '' }, inStockOnly: false, dynamic: {} })}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--c-obsidian)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9f7f4'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
        >
          Limpiar Todos los Filtros
        </button>
      )}

      {/* Botón de Ver Resultados en Móvil */}
      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'var(--c-obsidian)',
            color: 'var(--text-light)',
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
