import '../index.css';

export const metadata = {
  title: 'Tempo Preciso | Boutique de Alta Relojería en Perú',
  description: 'Descubre el catálogo privado de Tempo Preciso. Curaduría exclusiva de relojes de lujo, marcas suizas automáticas y obras maestras de precisión en Perú. 100% Originales y con garantía internacional.',
  keywords: 'relojes de lujo en perú, alta relojería, relojes suizos, comprar relojes originales, boutique de relojes, relojes automáticos, relojes de inversión, rolex, omega, tempo preciso perú',
  openGraph: {
    title: 'Tempo Preciso | Alta Relojería en Perú',
    description: 'Boutique exclusiva de relojes de lujo y colecciones privadas en Perú.',
    url: 'https://tempopreciso.pe',
    siteName: 'Tempo Preciso',
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
  "name": "Tempo Preciso",
  "image": "https://tempopreciso.pe/logo.png",
  "description": "Boutique de Alta Relojería en Perú. Curaduría exclusiva de las mejores marcas internacionales de lujo.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lima",
    "addressCountry": "PE"
  },
  "telephone": "+51998788599",
  "priceRange": "$$$$"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='7'/><polyline points='12 9 12 12 13.5 13.5'/><path d='M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83'/></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;600;700&family=Cinzel:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
