import App from '../../App';
import '../../App.css';

export const metadata = {
  title: "Verificación de Cuenta | L'gant Boutique",
  description: "Verifica tu cuenta de correo electrónico y actívala en L'gant Boutique.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function VerificarCorreoPage() {
  return <App initialView="verificar-correo" />;
}
