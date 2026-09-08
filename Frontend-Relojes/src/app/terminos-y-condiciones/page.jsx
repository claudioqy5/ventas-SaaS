import App from '../../App';
import '../../App.css';

export const metadata = {
  title: "Términos y Condiciones | L'gant Boutique",
  description: 'Términos y condiciones de uso y contratación regulados conforme al Código de Protección al Consumidor del Perú.',
  openGraph: {
    title: "Términos y Condiciones - L'gant Boutique",
    description: "Políticas de compra, garantías, envíos y marco legal de L'gant."
  }
};

export default function TerminosCondicionesPage() {
  return <App initialView="terminos" />;
}
