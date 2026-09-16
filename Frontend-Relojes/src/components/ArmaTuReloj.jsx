import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function ArmaTuReloj({ products, onBack, onAddToCart }) {
  const [material, setMaterial] = useState('');
  const [colorCorrea, setColorCorrea] = useState('');
  const [colorCara, setColorCara] = useState('');

  // Extract unique options from the real catalog data
  const options = useMemo(() => {
    const mat = new Set();
    const colCorrea = new Set();
    const colCara = new Set();
    
    products.forEach(p => {
      p.atributos?.forEach(attr => {
        const nom = attr.nombre?.toLowerCase() || '';
        const val = attr.valor;
        if (!val) return;
        
        if (nom.includes('material de correa') || nom.includes('material')) mat.add(val);
        if (nom.includes('color de correa') || nom === 'correa') colCorrea.add(val);
        if (nom.includes('color de cara') || nom.includes('fondo') || nom.includes('dial')) colCara.add(val);
      });
    });
    
    return {
      materiales: Array.from(mat).sort(),
      coloresCorrea: Array.from(colCorrea).sort(),
      coloresCara: Array.from(colCara).sort()
    };
  }, [products]);

  // Set default options if available
  useEffect(() => {
    if (options.materiales.length > 0 && !material) setMaterial(options.materiales[0]);
    if (options.coloresCorrea.length > 0 && !colorCorrea) setColorCorrea(options.coloresCorrea[0]);
    if (options.coloresCara.length > 0 && !colorCara) setColorCara(options.coloresCara[0]);
  }, [options]);

  // Find the closest matching product
  const matchedProduct = useMemo(() => {
    if (!material && !colorCorrea && !colorCara) return null;
    
    // Exact match
    const exact = products.find(p => {
      let mMatch = true, ccMatch = true, cfMatch = true;
      if (material) mMatch = p.atributos?.some(a => (a.nombre?.toLowerCase().includes('material') || a.nombre?.toLowerCase().includes('correa')) && a.valor === material);
      if (colorCorrea) ccMatch = p.atributos?.some(a => (a.nombre?.toLowerCase().includes('color de correa') || a.nombre?.toLowerCase() === 'correa') && a.valor === colorCorrea);
      if (colorCara) cfMatch = p.atributos?.some(a => (a.nombre?.toLowerCase().includes('cara') || a.nombre?.toLowerCase().includes('fondo') || a.nombre?.toLowerCase().includes('dial')) && a.valor === colorCara);
      return mMatch && ccMatch && cfMatch;
    });

    if (exact) return exact;

    // Partial match (at least 2 attributes)
    const partial = products.find(p => {
      let score = 0;
      if (material && p.atributos?.some(a => (a.nombre?.toLowerCase().includes('material') || a.nombre?.toLowerCase().includes('correa')) && a.valor === material)) score++;
      if (colorCorrea && p.atributos?.some(a => (a.nombre?.toLowerCase().includes('color de correa') || a.nombre?.toLowerCase() === 'correa') && a.valor === colorCorrea)) score++;
      if (colorCara && p.atributos?.some(a => (a.nombre?.toLowerCase().includes('cara') || a.nombre?.toLowerCase().includes('fondo') || a.nombre?.toLowerCase().includes('dial')) && a.valor === colorCara)) score++;
      return score >= 2;
    });

    return partial || null;
  }, [material, colorCorrea, colorCara, products]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--c-obsidian)', color: '#fff', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <button 
          onClick={onBack}
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px', 
            background: 'none', border: 'none', color: 'var(--c-gold)', 
            cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.9rem',
            marginBottom: '30px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em'
          }}
        >
          <ArrowLeft size={18} /> Volver al inicio
        </button>

        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, marginBottom: '10px' }}>
          Construye tu <span style={{ fontFamily: 'LeBistrotDesAmoureux, cursive', color: 'var(--c-gold)', display: 'block', fontSize: '1.2em', marginTop: '-10px' }}>Elegancia</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '500px', fontSize: '1rem', lineHeight: 1.6, marginBottom: '50px' }}>
          Combina los atributos de nuestras colecciones para descubrir el guardatiempo perfecto que se adapte a tu estilo personal.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
          {/* Configurador / Controles */}
          <div style={{ background: 'var(--c-charcoal)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            {/* Control Material */}
            {options.materiales.length > 0 && (
              <div style={{ marginBottom: '35px' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--c-gold)', marginBottom: '16px' }}>Material de Correa</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {options.materiales.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setMaterial(opt)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '50px',
                        background: material === opt ? 'var(--c-gold)' : 'transparent',
                        color: material === opt ? '#000' : '#fff',
                        border: `1px solid ${material === opt ? 'var(--c-gold)' : 'rgba(255,255,255,0.2)'}`,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Control Color Correa */}
            {options.coloresCorrea.length > 0 && (
              <div style={{ marginBottom: '35px' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--c-gold)', marginBottom: '16px' }}>Color de Correa</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {options.coloresCorrea.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setColorCorrea(opt)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '50px',
                        background: colorCorrea === opt ? 'var(--c-gold)' : 'transparent',
                        color: colorCorrea === opt ? '#000' : '#fff',
                        border: `1px solid ${colorCorrea === opt ? 'var(--c-gold)' : 'rgba(255,255,255,0.2)'}`,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Control Color Cara */}
            {options.coloresCara.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--c-gold)', marginBottom: '16px' }}>Color de Esfera (Cara)</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {options.coloresCara.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setColorCara(opt)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '50px',
                        background: colorCara === opt ? 'var(--c-gold)' : 'transparent',
                        color: colorCara === opt ? '#000' : '#fff',
                        border: `1px solid ${colorCara === opt ? 'var(--c-gold)' : 'rgba(255,255,255,0.2)'}`,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Resultado Visual */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {matchedProduct ? (
              <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px', aspectRatio: '1/1', marginBottom: '30px' }}>
                  {/* Glow effect */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '60%', background: 'var(--c-gold)', filter: 'blur(100px)', opacity: 0.15, zIndex: 0 }}></div>
                  
                  <img 
                    src={matchedProduct.imagenUrl} 
                    alt={matchedProduct.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
                  />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>{matchedProduct.nombre}</h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--c-gold)', marginBottom: '25px', fontFamily: 'var(--font-serif)' }}>S/ {Number(matchedProduct.precio).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                <button
                  onClick={() => onAddToCart(matchedProduct)}
                  style={{
                    background: 'var(--c-gold)', color: '#000', border: 'none', padding: '15px 30px',
                    borderRadius: '50px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.1em'
                  }}
                >
                  <ShoppingBag size={18} /> Agregar al Carrito
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', opacity: 0.5 }}>
                <div style={{ width: '250px', height: '250px', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                  <span style={{ fontSize: '3rem' }}>?</span>
                </div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '10px', fontWeight: 400 }}>Combinación no encontrada</h2>
                <p style={{ fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>Intenta seleccionar otra mezcla de atributos para descubrir tu modelo ideal.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
