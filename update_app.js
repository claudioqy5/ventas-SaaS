const fs = require('fs');
let content = fs.readFileSync('Frontend-Relojes/src/App.jsx', 'utf8');

// Helper for CRLF / LF replace
const replaceAnyLineEndings = (text, search, replace) => {
    const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\r?\\n'), 'g');
    return text.replace(searchRegex, replace);
};

// 1. Add colors to advancedFilters state
const initialFiltersTarget = `  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: { min: '', max: '' },
    inStockOnly: false,
    materials: []
  });`;
const initialFiltersReplace = `  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: { min: '', max: '' },
    inStockOnly: false,
    materials: [],
    colors: []
  });`;
content = replaceAnyLineEndings(content, initialFiltersTarget, initialFiltersReplace);

// 2. Extract dynamic lists
const useMemoTarget = `  // Categorías
  const categories = useMemo(() => {`;
const useMemoReplace = `  // Opciones dinámicas para filtros
  const { availableMaterials, availableColors } = useMemo(() => {
    const matSet = new Set();
    const colSet = new Set();
    products.forEach(p => {
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
      availableMaterials: Array.from(matSet).sort(),
      availableColors: Array.from(colSet).sort()
    };
  }, [products]);

  // Categorías
  const categories = useMemo(() => {`;
content = replaceAnyLineEndings(content, useMemoTarget, useMemoReplace);

// 3. Update filtering logic
const filterLogicTarget = `        let matchesMaterial = true;
        if (advancedFilters.materials.length > 0) {
           const pMat = p.specs?.material?.toLowerCase() || '';
           matchesMaterial = advancedFilters.materials.some(mat => pMat.includes(mat.toLowerCase()));
        }

        return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice && matchesStock && matchesMaterial;`;
const filterLogicReplace = `        let matchesMaterial = true;
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
content = replaceAnyLineEndings(content, filterLogicTarget, filterLogicReplace);

// 4. Pass props to PanelFiltros
const panelFiltrosTarget = `                <PanelFiltros
                  filters={advancedFilters}
                  setFilters={setAdvancedFilters}
                  isMobileOpen={isMobileFilterOpen}
                  onCloseMobile={() => setIsMobileFilterOpen(false)}
                />`;
const panelFiltrosReplace = `                <PanelFiltros
                  filters={advancedFilters}
                  setFilters={setAdvancedFilters}
                  availableMaterials={availableMaterials}
                  availableColors={availableColors}
                  isMobileOpen={isMobileFilterOpen}
                  onCloseMobile={() => setIsMobileFilterOpen(false)}
                />`;
content = replaceAnyLineEndings(content, panelFiltrosTarget, panelFiltrosReplace);

fs.writeFileSync('Frontend-Relojes/src/App.jsx', content);
console.log('App.jsx updated successfully.');
