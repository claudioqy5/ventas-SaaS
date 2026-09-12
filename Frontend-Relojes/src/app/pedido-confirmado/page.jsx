import App from '../../App';
import '../../App.css';

export const metadata = {
  title: "Orden Confirmada | L'gant Boutique",
  description: "Confirmación de adquisición y detalles de tu pedido en L'gant Boutique.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function PedidoConfirmadoPage() {
  return <App initialView="pedido-confirmado" />;
}
