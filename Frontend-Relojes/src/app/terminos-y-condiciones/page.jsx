import App from '../../App';
import '../../App.css';

export const metadata = {
  title: 'Términos y Condiciones | Tempo Preciso Boutique',
  description: 'Términos y condiciones de uso y contratación regulados conforme al Código de Protección al Consumidor del Perú.',
  openGraph: {
    title: 'Términos y Condiciones - Tempo Preciso Boutique',
    description: 'Políticas de compra, garantías, envíos y marco legal de Tempo Preciso.'
  }
};

export default function TerminosCondicionesPage() {
  return <App initialView="terminos" />;
}
