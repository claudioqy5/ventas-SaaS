import App from '../../App';
import '../../App.css';

export const metadata = {
  title: "Mi Cuenta | L'gant Boutique",
  description: 'Gestión de perfil, garantía internacional y beneficios exclusivos en L\'gant Boutique.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function MiCuentaPage() {
  return <App initialView="mi-cuenta" />;
}
