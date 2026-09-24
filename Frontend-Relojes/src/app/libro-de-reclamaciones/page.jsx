import App from '../../App';
import '../../App.css';

export const metadata = {
  title: "Libro de Reclamaciones | L'gant Boutique",
  description: 'Libro de reclamaciones virtual para el registro de quejas y reclamos según las normas de INDECOPI en Perú.',
  openGraph: {
    title: "Libro de Reclamaciones - L'gant Boutique",
    description: "Libro de reclamaciones virtual de L'gant."
  }
};

export default function LibroReclamacionesPage() {
  return <App initialView="reclamaciones" />;
}
