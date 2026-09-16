import App from '../../App';
import '../../App.css';

export const metadata = {
  title: "Verificación de Cuenta VIP | L'gant Boutique",
  description: "Verifica tu cuenta de correo electrónico y activa tu membresía VIP en L'gant Boutique.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function VerificarCorreoPage() {
  return <App initialView="verificar-correo" />;
}
