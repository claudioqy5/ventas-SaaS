import App from '../../App';
import '../../App.css';

export const metadata = {
  title: "Preguntas Frecuentes | L'gant Boutique",
  description: 'Respuestas a tus dudas sobre envíos a todo el Perú, métodos de pago, autenticidad y garantías de alta relojería.',
  openGraph: {
    title: "Preguntas Frecuentes - L'gant Boutique",
    description: 'Conoce todo sobre nuestros envíos garantizados a todo el Perú, políticas y formas de pago.'
  }
};

export default function PreguntasFrecuentesPage() {
  return <App initialView="faq" />;
}
