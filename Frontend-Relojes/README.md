# L'GANT • Haute Horlogerie & Tienda de Lujo Multi-Tenant

Frontend exclusivo y de ultra-alta gama diseñado para clientes de tu SaaS de ventas que comercializan relojes, joyería o productos exclusivos.

---

## Características de la Web

1. **Estética y Tipografía de Lujo:**
   * Tipografías de alta joyería: **Cinzel**, **Cormorant Garamond** y **Plus Jakarta Sans**.
   * Paleta Obsidian Dark con acentos en **Oro de 18k cepillado** y reflejos metálicos.
   * Efecto Glassmorphism con desenfoque de fondo profundo (`backdrop-filter`).

2. **Efectos Visuales Interactivos:**
   * **Inclinación 3D (Tilt Effect):** Las tarjetas de producto reaccionan al movimiento del cursor en perspectiva 3D.
   * **Reflejo de Luz Especular:** Un haz de luz dinámico ilumina el cristal y la esfera del reloj siguiendo el puntero.
   * **Efecto de Confeti Dorado:** Micro-animación de partículas al añadir piezas a la bolsa VIP.
   * **Modal de Manufactura:** Ficha técnica completa de calibres, rubíes, cristal de zafiro y hermeticidad.

3. **Flujo de Checkout Avanzado:**
   * Bolsa de compra deslizante (Drawer) con cálculo de totales y ocultamiento inteligente del botón flotante de WhatsApp.
   * **Stepper Interactivo de 4 Pasos** (`ProcesoPago.jsx`):
     * **Paso 1 - Carrito:** Resumen tabular con edición de cantidades y eliminación de ítems.
     * **Paso 2 - Datos Personales:** Formulario de invitado optimizado para alta conversión (Nombres, Correo, Documento y Teléfono).
     * **Paso 3 - Datos de Entrega:** Opciones para 'Envío a Domicilio' o 'Recojo en Tienda' con selectores de destino.
     * **Paso 4 - Método de Pago:** (En desarrollo).

4. **Multi-Tenancy y Seguridad:**
   * Consume el endpoint público `GET /api/public/store/{empresaId}/products` del Backend.
   * **Filtrado estricto:** Solo muestra los productos del cliente especificado.
   * **Seguridad comercial:** Los precios de costo (`PrecioCosto`) permanecen 100% protegidos y ocultos.

---

## Cómo Ejecutar Localmente

1. Entra a la carpeta del proyecto:
   ```bash
   cd Storefront-Relojes
   ```

2. Instala dependencias (si aún no están instaladas):
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

## Cómo Vincular un Cliente Específico

### Opción A: Desde la interfaz web (En caliente)
Haz clic en el botón superior **"Modo Demostración / Conectar SaaS"** en la barra de navegación. Ingresa el `EmpresaId` de MongoDB y haz clic en **"Probar API"** y **"Guardar"**.

### Opción B: Mediante archivo `.env`
Crea un archivo `.env` en la raíz de `Storefront-Relojes`:
```env
VITE_API_URL=http://localhost:5000/api/public/store
VITE_EMPRESA_ID=65e3b9781a2f9c0012345678
```
Al hacer `npm run build` o `npm run dev`, la web cargará de forma automática y permanente los productos de esa tienda.
