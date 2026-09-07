const fs = require('fs');
let content = fs.readFileSync('Frontend-Relojes/src/components/PanelFiltros.jsx', 'utf8');

const replaceAnyLineEndings = (text, search, replace) => {
    const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\r?\\n'), 'g');
    return text.replace(searchRegex, replace);
};

// 1. Update component signature
content = replaceAnyLineEndings(content, 
`export default function PanelFiltros({ filters, setFilters, isMobileOpen, onCloseMobile }) {`, 
`export default function PanelFiltros({ filters, setFilters, availableMaterials = [], availableColors = [], isMobileOpen, onCloseMobile }) {`);

// 2. Open sections
content = replaceAnyLineEndings(content, 
`  const [openSections, setOpenSections] = useState({
    precio: true,
    disponibilidad: true,
    material: true,
  });`,
`  const [openSections, setOpenSections] = useState({
    precio: true,
    disponibilidad: true,
    material: true,
    color: true,
  });`);

// 3. activeCount
content = replaceAnyLineEndings(content,
`  const activeCount = (filters.priceRange.min !== '' || filters.priceRange.max !== '' ? 1 : 0) +
                      (filters.inStockOnly ? 1 : 0) +
                      filters.materials.length;`,
`  const activeCount = (filters.priceRange.min !== '' || filters.priceRange.max !== '' ? 1 : 0) +
                      (filters.inStockOnly ? 1 : 0) +
                      filters.materials.length +
                      (filters.colors ? filters.colors.length : 0);`);

// 4. Update Material map and add Color section
const materialSectionTarget = `      {/* Material */}
      <SectionHeader title="Material" section="material" />
      {openSections.material && (
        <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Acero Inoxidable', 'Oro', 'Titanio', 'Piel', 'Diamantes'].map(mat => (`;

const materialSectionReplace = `      {/* Material */}
      {availableMaterials.length > 0 && (
        <>
          <SectionHeader title="Material" section="material" />
          {openSections.material && (
            <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {availableMaterials.map(mat => (`;

content = replaceAnyLineEndings(content, materialSectionTarget, materialSectionReplace);

const materialEndTarget = `            </label>
          ))}
        </div>
      )}`;

const materialEndReplace = `            </label>
          ))}
        </div>
      )}
      </>)}

      {/* Color */}
      {availableColors.length > 0 && (
        <>
          <SectionHeader title="Color" section="color" />
          {openSections.color && (
            <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {availableColors.map(col => (
                <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--c-deep-purple)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.colors?.includes(col)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setFilters(prev => {
                        const newCols = isChecked
                          ? [...(prev.colors || []), col]
                          : (prev.colors || []).filter(c => c !== col);
                        return { ...prev, colors: newCols };
                      });
                    }}
                    style={{ accentColor: 'var(--c-indigo)' }}
                  />
                  {col}
                </label>
              ))}
            </div>
          )}
        </>
      )}`;

content = replaceAnyLineEndings(content, materialEndTarget, materialEndReplace);

// 5. Update Limpiar Filtros button
content = replaceAnyLineEndings(content,
`        onClick={() => setFilters({ priceRange: { min: '', max: '' }, inStockOnly: false, materials: [] })}`,
`        onClick={() => setFilters({ priceRange: { min: '', max: '' }, inStockOnly: false, materials: [], colors: [] })}`);

fs.writeFileSync('Frontend-Relojes/src/components/PanelFiltros.jsx', content);
console.log('PanelFiltros.jsx updated successfully.');
