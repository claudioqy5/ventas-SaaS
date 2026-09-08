const fs = require('fs');

// 1. UPDATE App.jsx
let app = fs.readFileSync('Frontend-Relojes/src/App.jsx', 'utf8');

const tAdvancedFilters = `  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: { min: '', max: '' },
    inStockOnly: false,
    materials: [],
    colors: []
  });`;
const rAdvancedFilters = `  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: { min: '', max: '' },
    inStockOnly: false,
    dynamic: {} // Store selected attributes like { "Color": ["Negro"], "Correa": ["Goma"] }
  });`;
app = app.replace(tAdvancedFilters, rAdvancedFilters);

const tExtraction = `  const { availableCategories, availableMaterials, availableColors } = useMemo(() => {
    const catMap = new Map();
    const matSet = new Set();
    const colSet = new Set();

    products.forEach(p => {
      // Categorías
      if (p.categoriaId && categories.find(c => c.id === p.categoriaId)) {
        const cat = categories.find(c => c.id === p.categoriaId);
        catMap.set(cat.id, cat.nombre);
      }
      
      // Atributos dinámicos
      if (p.atributos && Array.isArray(p.atributos)) {
        p.atributos.forEach(attr => {
          if (attr.nombre && attr.valor) {
            const nameLower = attr.nombre.toLowerCase();
            if (nameLower.includes('material')) {
              matSet.add(attr.valor);
            } else if (nameLower.includes('color')) {
              colSet.add(attr.valor);
            }
          }
        });
      }
    });

    return {
      availableCategories: Array.from(catMap.entries()).map(([id, nombre]) => ({ id, nombre })),
      availableMaterials: Array.from(matSet).sort(),
      availableColors: Array.from(colSet).sort()
    };
  }, [products, categories]);`;

const rExtraction = `  const { availableCategories, dynamicAttributesMap } = useMemo(() => {
    const catMap = new Map();
    const attrMap = new Map();

    products.forEach(p => {
      // Categorías
      if (p.categoriaId && categories.find(c => c.id === p.categoriaId)) {
        const cat = categories.find(c => c.id === p.categoriaId);
        catMap.set(cat.id, cat.nombre);
      }
      
      // Todos los atributos dinámicos
      if (p.atributos && Array.isArray(p.atributos)) {
        p.atributos.forEach(attr => {
          if (attr.nombre && attr.valor) {
            const attrName = attr.nombre.trim();
            if (!attrMap.has(attrName)) {
              attrMap.set(attrName, new Set());
            }
            attrMap.get(attrName).add(attr.valor.trim());
          }
        });
      }
    });

    const finalDynamicAttr = {};
    for (const [key, valueSet] of attrMap.entries()) {
      finalDynamicAttr[key] = Array.from(valueSet).sort();
    }

    return {
      availableCategories: Array.from(catMap.entries()).map(([id, nombre]) => ({ id, nombre })),
      dynamicAttributesMap: finalDynamicAttr
    };
  }, [products, categories]);`;
app = app.replace(tExtraction, rExtraction);

const tFilterLogic = `        let matchesMaterial = true;
        if (advancedFilters.materials.length > 0) {
           const pMatAttr = p.atributos?.find(a => a.nombre.toLowerCase().includes('material'));
           const pMat = pMatAttr ? pMatAttr.valor.toLowerCase() : '';
           matchesMaterial = advancedFilters.materials.some(mat => pMat.includes(mat.toLowerCase()));
        }

        let matchesColor = true;
        if (advancedFilters.colors && advancedFilters.colors.length > 0) {
           const pColAttr = p.atributos?.find(a => a.nombre.toLowerCase().includes('color'));
           const pCol = pColAttr ? pColAttr.valor.toLowerCase() : '';
           matchesColor = advancedFilters.colors.some(col => pCol.includes(col.toLowerCase()));
        }

        return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStock && matchesMaterial && matchesColor;`;

const rFilterLogic = `        let matchesDynamic = true;
        if (advancedFilters.dynamic && Object.keys(advancedFilters.dynamic).length > 0) {
          for (const [attrName, selectedValues] of Object.entries(advancedFilters.dynamic)) {
            if (selectedValues && selectedValues.length > 0) {
              const pAttr = p.atributos?.find(a => a.nombre.toLowerCase() === attrName.toLowerCase());
              if (!pAttr || !selectedValues.some(val => pAttr.valor.toLowerCase().includes(val.toLowerCase()))) {
                matchesDynamic = false;
                break;
              }
            }
          }
        }

        return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStock && matchesDynamic;`;
app = app.replace(tFilterLogic, rFilterLogic);

const tProps = `                  availableMaterials={availableMaterials}
                  availableColors={availableColors}`;
const rProps = `                  dynamicAttributesMap={dynamicAttributesMap}`;
app = app.replace(tProps, rProps);

fs.writeFileSync('Frontend-Relojes/src/App.jsx', app);

// 2. UPDATE PanelFiltros.jsx
let panel = fs.readFileSync('Frontend-Relojes/src/components/PanelFiltros.jsx', 'utf8');

const tPanelProps = `({ filters, setFilters, availableMaterials, availableColors, isMobileOpen, onCloseMobile })`;
const rPanelProps = `({ filters, setFilters, dynamicAttributesMap, isMobileOpen, onCloseMobile })`;
panel = panel.replace(tPanelProps, rPanelProps);

const tPanelClear = `    setFilters({
      priceRange: { min: '', max: '' },
      inStockOnly: false,
      materials: [],
      colors: []
    });`;
const rPanelClear = `    setFilters({
      priceRange: { min: '', max: '' },
      inStockOnly: false,
      dynamic: {}
    });`;
panel = panel.replace(tPanelClear, rPanelClear);

const tPanelToggle1 = `  const toggleMaterial = (mat) => {
    setFilters(prev => {
      const isSelected = prev.materials.includes(mat);
      return {
        ...prev,
        materials: isSelected
          ? prev.materials.filter(m => m !== mat)
          : [...prev.materials, mat]
      };
    });
  };`;
const rPanelToggle1 = `  const toggleDynamicAttr = (attrName, val) => {
    setFilters(prev => {
      const dynamic = { ...(prev.dynamic || {}) };
      const currentSelected = dynamic[attrName] || [];
      const isSelected = currentSelected.includes(val);
      
      dynamic[attrName] = isSelected
        ? currentSelected.filter(v => v !== val)
        : [...currentSelected, val];
        
      return { ...prev, dynamic };
    });
  };`;
panel = panel.replace(tPanelToggle1, rPanelToggle1);

const tPanelToggle2 = `  const toggleColor = (col) => {
    setFilters(prev => {
      const isSelected = prev.colors.includes(col);
      return {
        ...prev,
        colors: isSelected
          ? prev.colors.filter(c => c !== col)
          : [...prev.colors, col]
      };
    });
  };`;
panel = panel.replace(tPanelToggle2, '');

const tPanelRender = `        {/* FILTRO DE MATERIAL */}
        {availableMaterials && availableMaterials.length > 0 && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
            <SectionHeader title="Material" isOpen={true} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              {availableMaterials.map(mat => (
                <label key={mat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--c-deep-purple)' }}>
                  <input
                    type="checkbox"
                    checked={filters.materials.includes(mat)}
                    onChange={() => toggleMaterial(mat)}
                    style={{ accentColor: 'var(--c-primary)', width: '16px', height: '16px' }}
                  />
                  <span>{mat}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* FILTRO DE COLOR */}
        {availableColors && availableColors.length > 0 && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
            <SectionHeader title="Color" isOpen={true} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              {availableColors.map(col => (
                <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--c-deep-purple)' }}>
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(col)}
                    onChange={() => toggleColor(col)}
                    style={{ accentColor: 'var(--c-primary)', width: '16px', height: '16px' }}
                  />
                  <span>{col}</span>
                </label>
              ))}
            </div>
          </div>
        )}`;

const rPanelRender = `        {/* FILTROS DINÁMICOS (Material, Color, Correa, etc.) */}
        {dynamicAttributesMap && Object.entries(dynamicAttributesMap).map(([attrName, options]) => (
          options.length > 0 && (
            <div key={attrName} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
              <SectionHeader title={attrName} isOpen={true} />
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
        ))}`;
panel = panel.replace(tPanelRender, rPanelRender);

fs.writeFileSync('Frontend-Relojes/src/components/PanelFiltros.jsx', panel);

console.log('Fixed Storefront scalable filters');
