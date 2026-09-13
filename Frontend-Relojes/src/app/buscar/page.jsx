import App from '../../App';
import '../../App.css';

export async function generateMetadata({ searchParams }) {
  const resolved = await searchParams;
  const q = resolved?.q ? decodeURIComponent(resolved.q) : '';
  return {
    title: q ? `Búsqueda: "${q}" | L'gant Boutique` : "Buscar Guardatiempos | L'gant Boutique",
    description: `Explora resultados de búsqueda para "${q || 'relojes de lujo'}" en L'gant Boutique. Guardatiempos originales y de alta precisión en Perú.`,
    robots: {
      index: false,
      follow: true,
    }
  };
}

export default async function BuscarPage({ searchParams }) {
  const resolved = await searchParams;
  const q = resolved?.q ? decodeURIComponent(resolved.q) : '';

  return (
    <App initialView="search" initialSearchQuery={q} />
  );
}
