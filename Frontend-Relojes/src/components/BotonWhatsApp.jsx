import React, { useState } from 'react';

export default function BotonWhatsApp({ phoneNumber, message = "Hola, me gustaría recibir más información." }) {
  const [showPill, setShowPill] = useState(true);

  const handleClick = () => {
    const text = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, '_blank');
  };

  return (
    <div className="wp-floating-wrapper">
      <style>{`
        .wp-floating-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-direction: row-reverse;
          pointer-events: none;
        }

        .wp-floating-wrapper * {
          pointer-events: auto;
        }

        /* Halo de pulso continuo y suave (no invasivo pero llamativo) */
        @keyframes wp-pulse-halo {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6), 0 4px 14px rgba(37, 211, 102, 0.35);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0), 0 6px 18px rgba(37, 211, 102, 0.45);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0), 0 4px 14px rgba(37, 211, 102, 0.35);
          }
        }

        /* Suave flotación */
        @keyframes wp-gentle-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        /* Animación suave para el punto de estado en vivo */
        @keyframes wp-live-dot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.7;
          }
        }

        .btn-whatsapp-flotante {
          position: relative;
          width: 58px;
          height: 58px;
          background: linear-gradient(135deg, #25D366 0%, #1da851 100%);
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          animation: wp-pulse-halo 2.5s infinite cubic-bezier(0.25, 0.8, 0.25, 1), wp-gentle-float 4s infinite ease-in-out;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .btn-whatsapp-flotante:hover {
          animation: none;
          transform: scale(1.1) translateY(-3px);
          box-shadow: 0 10px 25px rgba(37, 211, 102, 0.6), 0 4px 10px rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.6);
        }

        .btn-whatsapp-flotante:active {
          transform: scale(0.95);
        }

        .wp-icon {
          width: 32px;
          height: 32px;
          transition: transform 0.3s ease;
        }

        .btn-whatsapp-flotante:hover .wp-icon {
          transform: scale(1.08) rotate(-4deg);
        }

        /* Insignia "En línea" */
        .wp-badge-online {
          position: absolute;
          top: 1px;
          right: 1px;
          width: 14px;
          height: 14px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }

        .wp-badge-online-inner {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: wp-live-dot 2s infinite ease-in-out;
        }

        /* Píldora elegante "Asesoría en línea" */
        .wp-pill-tooltip {
          background: rgba(11, 11, 12, 0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          user-select: none;
        }

        .wp-pill-tooltip:hover {
          background: rgba(11, 11, 12, 0.98);
          border-color: rgba(212, 175, 55, 0.6);
          transform: translateX(-4px);
        }

        .wp-pill-dot {
          width: 6px;
          height: 6px;
          background: #25D366;
          border-radius: 50%;
          box-shadow: 0 0 6px #25D366;
        }

        @media (max-width: 640px) {
          .wp-pill-tooltip {
            display: none;
          }
          .wp-floating-wrapper {
            bottom: 18px;
            right: 18px;
          }
          .btn-whatsapp-flotante {
            width: 52px;
            height: 52px;
          }
          .wp-icon {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>

      <button
        onClick={handleClick}
        className="btn-whatsapp-flotante"
        aria-label="Contactar por WhatsApp"
        title="¿Deseas asesoría? Chatea con nuestro Concierge por WhatsApp"
      >
        <span className="wp-badge-online">
          <span className="wp-badge-online-inner" />
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="wp-icon"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>

      <div className="wp-pill-tooltip" onClick={handleClick}>
        <span className="wp-pill-dot" />
        <span>¿Dudas? Chatea con nosotros</span>
      </div>
    </div>
  );
}
