import App from '../../../App';
import '../../../App.css';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;
  return {
    title: `Guardatiempo Exclusivo | Tempo Preciso Boutique`,
    description: `Detalles del guardatiempo exclusivo en Tempo Preciso Boutique. Envíos a todo el Perú y garantía oficial de alta relojería.`,
    openGraph: {
      title: `Guardatiempo Exclusivo - Tempo Preciso`,
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
