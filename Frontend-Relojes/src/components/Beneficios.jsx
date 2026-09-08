import React from 'react';
import { Truck, MonitorSmartphone, Headset, ShieldCheck } from 'lucide-react';

export default function Beneficios() {
  const beneficios = [
    {
      icon: <Truck size={40} strokeWidth={1.5} color="var(--c-indigo)" />,
      title: 'ENVÍO SEGURO',
      description: 'Para todas las ciudades del país.',
    },
    {
      icon: <MonitorSmartphone size={40} strokeWidth={1.5} color="var(--c-indigo)" />,
      title: 'COMPRA ONLINE',
      description: '6 meses de garantia en todos los productos',
    },
    {
      icon: <Headset size={40} strokeWidth={1.5} color="var(--c-indigo)" />,
      title: 'ATENCIÓN 24 HORAS',
      description: 'Escríbenos al 962956919 por whatsapp',
    },
    {
      icon: <ShieldCheck size={40} strokeWidth={1.5} color="var(--c-indigo)" />,
      title: 'PAGO SEGURO',
      description: 'Su información de pago se procesa de forma segura',
    }
  ];

  return (
    <section style={{
      padding: '70px 24px',
      backgroundColor: 'var(--bg-main)', // Fondo igual al de la página principal
      borderTop: '1px solid rgba(59, 60, 65, 0.15)',
      borderBottom: '1px solid rgba(59, 60, 65, 0.15)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        textAlign: 'center'
      }}>
        {beneficios.map((beneficio, index) => (
          <div key={index} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              {beneficio.icon}
            </div>
            <h4 style={{
              fontFamily: 'var(--font-sans, "Inter", sans-serif)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--c-indigo)',
              letterSpacing: '0.02em',
              marginBottom: '12px',
              textTransform: 'uppercase'
            }}>
              {beneficio.title}
            </h4>
            <p style={{
              color: 'var(--c-taupe)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              margin: 0
            }}>
              {beneficio.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
