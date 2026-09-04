import App from '../../../App';
import '../../../App.css';

// Función para capitalizar la primera letra (ej. "hombre" -> "Hombre")
function capitalizeCategory(slug) {
  if (!slug) return 'Todos';
  
  // Manejar casos especiales si los hay, o simplemente capitalizar
  const decoded = decodeURIComponent(slug);
  return decoded.charAt(0).toUpperCase() + decoded.slice(1).toLowerCase();
}

// Generación dinámica de metadatos para SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = capitalizeCategory(resolvedParams.slug);
  return {
    title: `Relojes para ${category} | Tempo Preciso Boutique`,
    description: `Descubre nuestra exclusiva selección de relojes de lujo para ${category}. Piezas originales, automáticas y con garantía internacional en Perú.`,
    openGraph: {
      title: `Catálogo Exclusivo: Relojes de ${category}`,
      description: `Boutique de Alta Relojería en Perú. Explora nuestra colección de relojes suizos de lujo para ${category}.`,
    }
  };
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const category = capitalizeCategory(resolvedParams.slug);

  return (
    <App initialCategory={category} />
  );
}
