import App from '../../App';
import '../../App.css';

export const metadata = {
  title: "Mis Compras | L'gant Boutique",
  description: 'Historial de adquisiciones, certificados de autenticidad y seguimiento de pedidos en L\'gant Boutique.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function MisComprasPage() {
  return <App initialView="mis-compras" />;
}
