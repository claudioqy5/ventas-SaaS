import App from '../../../App';
import '../../../App.css';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  return {
    title: `Guardatiempo Exclusivo | L'gant Boutique`,
    description: `Detalles del guardatiempo exclusivo en L'gant Boutique. Envíos a todo el Perú y garantía oficial de alta relojería.`,
    openGraph: {
      title: `Guardatiempo Exclusivo - L'gant`,
      description: `Boutique de Alta Relojería en Perú. Pieza de manufactura suiza con garantía oficial.`
    }
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  return (
    <App initialProductId={productId} />
  );
}
