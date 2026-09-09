import App from '../../App';
import '../../App.css';

export const metadata = {
  title: "Finalizar Compra | L'gant Boutique",
  description: 'Proceso de pago seguro con custodia y transporte asegurado a todo el Perú en L\'gant Boutique.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function CheckoutPage() {
  return <App initialView="checkout" />;
}
