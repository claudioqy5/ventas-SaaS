const fs = require('fs');
let content = fs.readFileSync('Frontend-Relojes/src/components/PaginaDetalleProducto.jsx', 'utf8');

const replaceAnyLineEndings = (text, search, replace) => {
    const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\n/g, '\\r?\\n'), 'g');
    return text.replace(searchRegex, replace);
};

const fichaTecnicaTarget = `            {/* Ficha Técnica y Especificaciones */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <h3 className="font-serif" style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '14px',
                color: 'var(--c-indigo)'
              }}>
                Especificaciones Técnicas y Manufactura
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.82rem', fontFamily: 'var(--font-serif)' }}>
                <div>
                  <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Calibre de Movimiento</span>
                  <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.calibre}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Cristal</span>
                  <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.cristal}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Hermeticidad</span>
                  <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.hermeticidad}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Diámetro de Caja</span>
                  <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.diametro || '42 mm'}</strong>
                </div>
              </div>
            </div>`;

const fichaTecnicaReplace = `            {/* Ficha Técnica y Especificaciones */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <h3 className="font-serif" style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '14px',
                color: 'var(--c-indigo)'
              }}>
                Especificaciones Técnicas y Manufactura
              </h3>

              {product.atributos && product.atributos.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.82rem', fontFamily: 'var(--font-serif)' }}>
                  {product.atributos.map((attr, idx) => (
                    <div key={idx}>
                      <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem', textTransform: 'capitalize' }}>{attr.nombre}</span>
                      <strong style={{ color: 'var(--c-deep-purple)' }}>{attr.valor}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.82rem', fontFamily: 'var(--font-serif)' }}>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Calibre de Movimiento</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.calibre}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Cristal</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.cristal}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Hermeticidad</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.hermeticidad}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-taupe)', display: 'block', fontSize: '0.74rem' }}>Diámetro de Caja</span>
                    <strong style={{ color: 'var(--c-deep-purple)' }}>{specs.diametro || '42 mm'}</strong>
                  </div>
                </div>
              )}
            </div>`;

content = replaceAnyLineEndings(content, fichaTecnicaTarget, fichaTecnicaReplace);

fs.writeFileSync('Frontend-Relojes/src/components/PaginaDetalleProducto.jsx', content);
console.log('PaginaDetalleProducto.jsx updated successfully.');
