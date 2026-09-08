import '../index.css';

export const metadata = {
  title: "L'gant | Boutique de Alta Relojería en Perú",
  description: "Descubre el catálogo privado de L'gant. Curaduría exclusiva de relojes de lujo, marcas suizas automáticas y obras maestras de precisión en Perú. 100% Originales y con garantía internacional.",
  keywords: "relojes de lujo en perú, alta relojería, relojes suizos, comprar relojes originales, boutique de relojes, relojes automáticos, relojes de inversión, rolex, omega, l'gant perú",
  openGraph: {
    title: "L'gant | Alta Relojería en Perú",
    description: 'Boutique exclusiva de relojes de lujo y colecciones privadas en Perú.',
    url: 'https://lgant.pe',
    siteName: "L'gant",
    locale: 'es_PE',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport = {
  themeColor: '#09090b',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "name": "L'gant",
  "image": "https://lgant.pe/logo.png",
  "description": "Boutique de Alta Relojería en Perú. Curaduría exclusiva de las mejores marcas internacionales de lujo.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lima",
    "addressCountry": "PE"
  },
  "telephone": "+51962956919",
  "priceRange": "$$$$"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" href="/logo-lgant-gold.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;600;700&family=Cinzel:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Loader + script como HTML crudo para evitar errores de hidratación */}
        <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
          <div id="tp-initial-loader" style="position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,#1A1B1F 0%,#0B0B0C 70%,#050506 100%);transition:opacity 0.65s cubic-bezier(0.16,1,0.3,1),transform 0.65s cubic-bezier(0.16,1,0.3,1)">
            <div style="position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,0.25) 0%,rgba(245,230,200,0.08) 45%,transparent 70%);filter:blur(60px);pointer-events:none"></div>
            <div style="position:relative;width:340px;height:340px">
              <svg viewBox="0 0 300 300" style="width:100%;height:100%;overflow:visible;filter:drop-shadow(0 20px 50px rgba(0,0,0,0.85))">
                <defs>
                  <linearGradient id="il-bezel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.45)"/>
                    <stop offset="50%" stop-color="rgba(212,175,55,0.7)"/>
                    <stop offset="100%" stop-color="rgba(245,230,200,0.35)"/>
                  </linearGradient>
                </defs>
                <circle cx="150" cy="150" r="144" fill="#0B0B0C" stroke="url(#il-bezel)" stroke-width="2.5"/>
                <circle cx="150" cy="150" r="136" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
                <line x1="150" y1="14" x2="150" y2="30" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="218" y1="42.72" x2="210" y2="53.86" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="257.28" y1="82" x2="246.14" y2="90" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="286" y1="150" x2="270" y2="150" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="257.28" y1="218" x2="246.14" y2="210" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="218" y1="257.28" x2="210" y2="246.14" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="150" y1="286" x2="150" y2="270" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="82" y1="257.28" x2="90" y2="246.14" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="42.72" y1="218" x2="53.86" y2="210" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="14" y1="150" x2="30" y2="150" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="42.72" y1="82" x2="53.86" y2="90" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <line x1="82" y1="42.72" x2="90" y2="53.86" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
                <image href="/logo-lgant-gold.png" x="137" y="38" width="26" height="34" />
                <text x="150" y="84" text-anchor="middle" fill="#ffffff" font-family="'Cinzel',serif" font-size="9" font-weight="700" letter-spacing="0.32em">L'GANT</text>
                <text x="150" y="93" text-anchor="middle" fill="#D4AF37" font-family="'Cinzel',serif" font-size="5.5" font-weight="700" letter-spacing="0.2em">BOUTIQUE DE ALTA RELOJERÍA · PERÚ</text>
                <g class="tp-hand">
                  <polygon points="148.4,150 148.8,35 150,18 151.2,35 151.6,150" fill="#ff3b30"/>
                  <polygon points="148.5,150 148.5,188 151.5,188 151.5,150" fill="#ff3b30"/>
                  <circle cx="150" cy="174" r="8" fill="#070c17" stroke="#ff3b30" stroke-width="2.8"/>
                </g>
                <circle cx="150" cy="150" r="9" fill="#182844" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
                <circle cx="150" cy="150" r="6" fill="#ff3b30"/>
                <circle cx="150" cy="150" r="2.2" fill="#ffffff"/>
              </svg>
            </div>
            <div style="margin-top:35px;display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0.95">
              <div style="display:flex;align-items:center;gap:14px">
                <img src="/logo-lgant-gold.png" alt="L'gant" style="height:44px;width:auto;object-fit:contain;filter:drop-shadow(0 4px 12px rgba(212,175,55,0.35))" />
                <div style="width:1.5px;height:32px;background:rgba(212,175,55,0.6)"></div>
                <div style="font-size:2.2rem;font-family:'Cinzel',serif;color:#D4AF37;line-height:1;letter-spacing:0.08em;font-weight:700">L'GANT</div>
              </div>
              <div style="font-size:0.62rem;letter-spacing:0.45em;font-family:'Cinzel',serif;color:rgba(255,255,255,0.75);text-transform:uppercase;margin-left:0.45em">BOUTIQUE DE ALTA RELOJERÍA</div>
            </div>
          </div>
          <style>
            @keyframes il-sweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
            .tp-hand{transform-origin:150px 150px;animation:il-sweep 2s linear infinite}
            #tp-initial-loader.tp-fade-out{opacity:0!important;transform:scale(1.04)!important;pointer-events:none!important}
          </style>
          <script>
            if(sessionStorage.getItem('tp_loaded')){
              var el=document.getElementById('tp-initial-loader');
              if(el)el.style.display='none';
            }
          </script>
        `}} />
        {children}
      </body>
    </html>
  );
}
