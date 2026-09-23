# BitÃ¡cora de Avances y DocumentaciÃ³n Oficial del Proyecto Ventas SaaS

> **Nota:** Este archivo contiene el historial estructurado de desarrollos, actualizaciones, endpoints e informaciÃ³n vital del negocio.

---

### Resumen de la Sesión Actual (E-commerce y Admin)

**¿Qué hicimos recién?**
1. **Agrupación Visual de Productos (Frontend Público):**
   - Modificamos el catálogo (`App.jsx`) para que los productos con el mismo `CodigoModelo` se agrupen y se muestre solo **1 tarjeta principal** por modelo.
   - En la `TarjetaProducto.jsx`, agregamos las **miniaturas (circulitos)** de cada variante de color en la parte inferior. Al hacer clic o pasar el mouse por ellas, la foto principal, el precio y el nombre cambian dinámicamente sin recargar la página.
   - Replicamos este mismo selector de variantes dentro de la vista individual del producto (`PaginaDetalleProducto.jsx`) bajo la sección *"Otras versiones disponibles"*.

2. **Mejoras en el Panel de Administración (Backend y Vue):**
   - **Autocompletado Mágico:** Añadimos lógica para que, al crear un producto nuevo, si escribes un "Agrupador (Modelo)" que ya existe en la base de datos, el formulario autocompleta instantáneamente la categoría, precio, descripción y atributos (dejando el color y fotos en blanco para la nueva variante).
   - **Desbloqueo de Inventario y Arreglo Backend:** Se eliminó la restricción del frontend que impedía editar el stock en productos ya creados, y se parchó el backend en C# (`ProductsController.cs`) para que acepte y guarde los cambios tanto del `Stock` como del `CodigoModelo` al editar.
   - **Rediseño del Modal a 2 Columnas:** Transformamos la interfaz de edición de productos para que los campos principales estén a la izquierda y las **Especificaciones** queden fijas y siempre visibles en una elegante columna derecha. Además, se añadió la opción "No aplica / En blanco" a los atributos para mayor flexibilidad.

**¿Dónde nos quedamos?**
Todo el flujo de agrupación y las mejoras en el panel de administrador están terminados y funcionales. El código ya fue "pusheado" al repositorio maestro (GitHub/Vercel). Quedamos a la espera de verificar en el entorno de producción que la experiencia del usuario y del administrador funcione tal y como fue diseñada.

---

### Resumen de la Nueva Sesión (Integración de Variantes, Acordeón de Inventario y WhatsApp)

**¿Qué avanzamos hoy?**

1. **Corrección Integral del Flujo de Agrupación de Modelos:**
   - **Diagnóstico del problema:** Aunque la base de datos ya admitía `CodigoModelo`, en el catálogo del e-commerce (`Frontend-Relojes`) las variantes seguían mostrándose como tarjetas separadas. Se descubrió que el backend en C# (`FrontendRelojesController.cs` y `PublicStoreController.cs`) omitía `CodigoModelo` y `Atributos` en la proyección anónima JSON, y el servicio `api.js` de la tienda tampoco lo mapeaba hacia el frontend.
   - **Solución Backend (C# / .NET 9):** Se modificaron `FrontendRelojesController.cs` y `PublicStoreController.cs` para incluir `p.CodigoModelo` y `p.Atributos`. Compilación verificada con 0 errores.
   - **Solución Tienda (`Frontend-Relojes`):** Se actualizó `api.js` para mapear `codigoModelo`, `codigoBarras` y `atributos`.
   - **Tooltips informativos:** Se implementó en `TarjetaProducto.jsx` y `PaginaDetalleProducto.jsx` la visualización del nombre del color al pasar el mouse por los circulitos de variantes.

2. **Efecto Visual Premium para el Botón de WhatsApp (`BotonWhatsApp.jsx`):**
   - Se renovó el botón flotante de WhatsApp global con efectos dinámicos sutiles y de alta gama:
     - **Halo de pulso concéntrico (`wp-pulse-halo`):** Onda expansiva suave cada 2.5s que destaca sin saturar.
     - **Flotación orgánica (`wp-gentle-float`):** Movimiento de respiro vertical para darle dinamismo.
     - **Indicador "En línea" (Live Dot):** Pequeña insignia superior con punto verde palpitante de atención activa.
     - **Píldora interactiva Concierge:** Burbuja flotante *"¿Dudas? Chatea con nosotros"* con fondo translúcido oscuro (`backdrop-filter`), tipografía moderna y borde dorado sutil.
     - **Micro-interacciones en botones de producto:** Se añadieron efectos de hover con elevación elástica y resplandor verde en `TarjetaProducto.jsx` y `PaginaDetalleProducto.jsx`.

3. **Vista Jerárquica en Acordeón para el Panel de Inventario (`Products.vue`):**
   - **Problema resuelto:** Los relojes con el mismo modelo ocupaban múltiples filas idénticas en la tabla de inventario del administrador.
   - **Implementación (Opción 1 - Acordeón Master-Detail):**
     - **Fila Cabecera de Modelo:** Agrupa los relojes con el mismo `codigoModelo` en una sola fila padre con flecha `▸`/`▾`, badge `📦 [Modelo]`, total consolidado de variantes, mini-galería de diales/colores, precio promedio o rango, stock total acumulado y botón de apertura.
     - **Subfilas de Variantes Indentadas:** Al desplegar el modelo, aparecen las variantes con sangría (`↳`), exhibiendo su SKU individual, miniatura específica, etiqueta de color (`🎨 Azul`, `🎨 Negro`, etc.), stock particular y botones individuales de edición [✏️] y eliminación [🗑️].
     - **Control de Vistas:** Se agregó un selector superior `[ 🗂️ Agrupado ]` / `[ 📋 Todo ]` para alternar entre acordeón y lista plana tradicional, junto al botón `[ ▾ Colapsar / Expandir Todo ]`.
     - **Búsqueda mejorada:** La barra de búsqueda ahora filtra en tiempo real por modelo y por atributo de color.
     - Compilación validada con Vite (0 errores).

4. **Ficha Técnica para Nuevos Registros (Serie Casio Edifice EFV-640D):**
   - Se documentaron y estructuraron los datos para el alta del modelo `EFV-640D-2AVUDF` (S/. 617.00) y sus 5 variantes de color, asegurando el uso del agrupador común `EFV-640D` para su vinculación automática en catálogo e inventario.

**¿Dónde nos quedamos?**
Todos los cambios están aplicados, probados y verificados en código. El repositorio local está listo con las nuevas funcionalidades operativas tanto en el panel administrativo de Vue como en el frontend Next.js de la tienda de relojes.

---

### Resumen de la Nueva Sesión (Refactorización UI Modal y Checkout Avanzado de 4 Pasos)

**¿Qué avanzamos hoy?**

1. **Refactorización de Interfaz del Panel Administrativo (`Products.vue`):**
   - **Corrección de botones ocultos:** Se desacopló el área de contenido del modal (`tbody`/formularios) de la botonera inferior. Se les aplicó `position: sticky; bottom: 0;` con control de `overflow`, asegurando que, sin importar cuán extenso sea el formulario de variantes, los botones "Cancelar" y "Guardar" permanezcan perpetuamente visibles en pantalla.
   - **Erradicación de Emojis:** Se eliminaron los emojis genéricos del código (por petición del cliente) y se integraron íconos vectoriales SVG profesionales (`lucide-vue-next` y `lucide-react`) para lograr una estética formal.
   - **Formulario Compacto de Especificaciones:** La sección de atributos del reloj, que antes requería mucho scroll, se reorganizó en una cuadrícula CSS lateral, colocando los selectores al costado de los títulos para optimizar drásticamente el espacio de la interfaz.

2. **Flujo de Pago Avanzado (Checkout de Alta Gama en `Frontend-Relojes`):**
   - **Interacción Inteligente del Botón WhatsApp:** Se corrigió el problema de solapamiento donde el botón flotante del Concierge tapaba la Bolsa de Compras al abrirla. Ahora el componente `BotonWhatsApp.jsx` recibe un prop `isVisible={!isCartOpen}`, ocultándose de forma dinámica cuando se despliega el carrito.
   - **Nuevo Sistema Stepper Multipaso (`ProcesoPago.jsx`):**
     - Se reemplazó el redireccionamiento vacío del botón "IR A COMPRAR" hacia la ruta principal, derivándolo a una nueva y elegante vista deCheckout en 4 etapas.
     - **Navegación Interactiva:** La barra superior visualiza el estado de la compra. Los íconos se iluminan con la paleta de la marca (dorado/obsidiana) y permiten dar click sobre pasos anteriores para regresar, corrigiendo o revisando el pedido sin perder la sesión.
     - **Paso 1 (Carrito):** Exhibe una tabla analítica con las imágenes del producto, nombre, y controles interactivos `[-]/[+]` para alterar las cantidades en tiempo real. Cuenta con un "Resumen de Compra" lateral persistente y campo para Cupones.
     - **Paso 2 (Datos Personales):** Se implementó un esquema *"Guest Checkout"* (compras como invitado). Facilita una alta tasa de conversión al no exigir la creación de una cuenta/contraseña, pidiendo únicamente Nombres, Correo, Celular/WhatsApp y el combo de Tipo/N° de Documento (DNI/CE/RUC/Pasaporte) crucial para la facturación electrónica peruana.
     - **Paso 3 (Datos de Entrega):** Contiene campos limpios para organizar un "Envío a Domicilio" (Se retiró la opción de recojo en tienda a petición). Se despliegan combos nativos para el ingreso del Departamento, Provincia, Distrito, Dirección exacta y Referencias.

3. **Decisiones Arquitectónicas (Backend):**
   - **Refactorización de Modelo `Client.cs`:** Se detectó que la tabla de clientes guardaba un único campo `Nombre`. Se tomó la decisión arquitectónica de refactorizar la base de datos a `Nombres` y `Apellidos` por separado. Esta separación será crucial más adelante para:
     - Facturación electrónica en SUNAT.
     - Email Marketing personalizado ("Hola [Nombre]").
     - Integración futura con APIs logísticas (Scharff, Olva, DHL).

**¿Dónde nos quedamos?**
Se consolidó la estructura del Checkout en 4 etapas y se definió la hoja de ruta para la autenticación de clientes y persistencia de ventas.

---

### Resumen de la Nueva Sesión (Soporte Multi-categoría, Autenticación E-commerce y Ventas Integradas al Admin)

**¿Qué avanzamos hoy?**

1. **Soporte de Múltiples Categorías por Producto:**
   - **Backend (`Product.cs`, `ProductsController.cs`):** Se adaptó el modelo y la API para permitir que un producto pertenezca a múltiples categorías simultáneamente (ejemplo: un reloj asignado a "Hombre", "Novedades" y/o "Unisex").
   - **Panel Administrativo (`Products.vue`):** Se actualizó el formulario para permitir la asignación y selección múltiple de categorías para cada producto.
   - **Frontend E-commerce (`PanelFiltros.jsx`, `App.jsx`):** El catálogo ahora filtra dinámicamente sobre la colección de categorías del producto, garantizando que el reloj aparezca tanto al filtrar por "Hombre" como por "Novedades".

2. **Mapa Interactivo de Entregas (`DeliveryMap.jsx`):**
   - Se integró un componente de mapa interactivo dentro del **Paso 3 (Datos de Entrega)** del checkout en `Frontend-Relojes`, permitiendo al cliente ubicar con precisión el punto de entrega y referencias geográficas.

3. **Módulo de Autenticación de Clientes E-commerce:**
   - **Modelo y Seguridad en Backend (`Client.cs`, `JwtProvider.cs`, `IJwtProvider.cs`):**
     - Se añadieron los campos `PasswordHash`, `IsEcommerceUser` y fecha de creación al modelo `Client`.
     - Se implementó la generación de tokens JWT dedicados para clientes con el rol/claim `ClienteEcommerce`.
   - **Controlador Público (`PublicStoreController.cs`):**
     - `POST /api/public/store/auth/register`: Registro de nuevos clientes con encriptación segura de contraseña.
     - `POST /api/public/store/auth/login`: Autenticación con validación de credenciales y retorno de token JWT.
     - `GET /api/public/store/my-orders`: Endpoint seguro para consultar el historial de compras del cliente autenticado.
   - **Frontend E-commerce (`ModalAuthCliente.jsx`, `App.jsx`, `api.js`):**
     - Se diseñó e implementó el modal flotante con pestañas de "Iniciar Sesión" y "Crear Cuenta".
     - Persistencia de sesión en el navegador (`localStorage` con `cliente_token` y `cliente_datos`).
     - Enlace y menú de usuario en la barra de navegación para consultar historial de pedidos o cerrar sesión.

4. **Integración Completa del Flujo de Venta (E-commerce ➔ Backend ➔ Panel Administrativo):**
   - **Checkout Conectado (`ProcesoPago.jsx`):**
     - Integración con el endpoint de órdenes (`POST /api/public/store/orders`).
     - Vinculación fluida: el cliente puede comprar autenticado o registrarse en el mismo proceso.
     - Pantalla de confirmación con código de pedido, desglose final y botón para volver a la tienda.
   - **Procesamiento de Venta y Kardex en Backend (`PublicStoreController.cs`):**
     - Se registra la orden directamente en la tabla de ventas `Sale` con `EstadoPago = "Pagado"`.
     - Generación de ítems de venta (`SaleItem`) respetando la regla de negocio de solo lectura en `Total = Cantidad * PrecioUnitario`.
     - Descuento automático de existencias en el inventario y creación del registro de auditoría en `StockMovement` (Kardex).
     - **Visualización en Panel Admin:** Al guardarse como ventas estándar del sistema, las compras realizadas desde la tienda online aparecen de inmediato en el historial de ventas, dashboards de ingresos y reportes del Panel Administrativo de Vue sin requerir cambios invasivos en el panel.

5. **Versionamiento y Despliegue Local:**
   - Todos los cambios fueron consolidados y versionados en Git con los commits correspondientes (`2b70d83`, `fbf68ec`, etc.) y el servidor de desarrollo de Vite se mantiene operativo.

**¿Dónde nos quedamos?**
- El flujo completo de catálogo, filtrado multi-categoría, autenticación de clientes, carrito, checkout y generación de ventas con descuento de inventario está 100% funcional e integrado con el backend y el panel de administración.
- **Pendientes para futuras fases:**
  1. Integración con pasarela de pagos real (MercadoPago / Niubiz / Stripe o pasarela de QR Yape/Plin automatizada) para el Paso 4 del Checkout.
  2. Refactorización a campos independientes `Nombres` y `Apellidos` en la tabla de clientes (prioritario cuando se integre facturación electrónica SUNAT o couriers como Olva/Scharff).

---

### Actualización - 10 de Septiembre de 2026

**1. Perfil del Cliente y Navegación:**
- Se implementó la vista `VistaPanelCliente.jsx` para que los clientes autenticados puedan ver su historial de compras y los detalles de su cuenta de manera elegante y alineada al diseño.
- Se incorporó en `BarraNavegacion.jsx` un menú desplegable en el perfil del usuario (al iniciar sesión) que redirige a las nuevas rutas (`/mis-compras` y `/mi-cuenta`), gestionadas con `window.history.pushState` y Next.js App Router para una navegación nativa sin recargar la página.
- Se eliminaron colores predeterminados (como rosas/fucsias) para mantener una paleta coherente con la identidad visual del e-commerce (uso de `--c-gold`, `--c-obsidian`, `--c-indigo`, etc.).

**2. Mejoras en la Interfaz de Productos y Filtros:**
- **Atributos y Categorías Múltiples:** Se actualizó `ModalProducto.jsx` y `PaginaDetalleProducto.jsx` para mostrar correctamente múltiples categorías asignadas a un producto separadas por puntos (•).
- **Estética del Botón de Pago:** El botón de Mercado Pago en la vista de detalle de producto se modificó de su clásico azul a un estilo lujoso (fondo blanco, texto oscuro y bordes tenues) para que conviva en perfecta armonía con el diseño global de la tienda.
- **Interactividad en Filtros:** Se corrigió un problema de deformación visual en `PanelFiltros.jsx` donde los nombres de atributos largos rompían el layout. Ahora toda la fila del atributo es un contenedor flexible, envolviendo texto correctamente y permitiendo seleccionar la opción al hacer clic en cualquier parte de la línea, no solo en la caja del checkbox.

**3. Soporte para el IDE (VS Code):**
- Se añadió un archivo `jsconfig.json` a la raíz de la carpeta `Frontend-Relojes`. Esto soluciona los problemas de falsos positivos (subrayados rojos) en la resolución de módulos (como `lucide-react` y rutas relativas a `../services/api`) cuando el editor se abre desde la carpeta contenedora (`ventas-saas`).

**4. Corrección de Crash en Modal de Autenticación:**
- Se corrigió un error de variable no definida (`ReferenceError: password is not defined`) en `ModalAuthCliente.jsx`. Este error provocaba que Next.js arrojara una pantalla de colapso ("This page couldn't load") cada vez que un usuario no autenticado intentaba abrir el modal de login/registro desde el ícono de perfil en el header.

**5. Eliminación Total de Colores Rosados/Fucsias (Paleta de Lujo):**
- Se realizó una auditoría y limpieza de estilos en `BarraNavegacion.jsx` y `ModalAuthCliente.jsx`:
  - **Íconos del dropdown de usuario:** Cambiados de `#ff007f` al tono corporativo `var(--c-deep-purple)`.
  - **Efectos Hover en botones:** Cambiados de rosa claro (`#fff0f7`) a un fondo neutro elegante (`#f5f5f7`).
  - **Botón "Cerrar sesión":** Se reemplazó el fucsia brillante por `var(--c-obsidian)` con hover en `var(--c-deep-purple)` y sombras sutiles.
  - **Modal de cuenta y login:** Se sustituyeron los elementos residuales en fucsia por el dorado oficial (`var(--c-gold)`) y negro obsidian, asegurando 100% de coherencia visual con la identidad de marca del e-commerce.

**Estado Actual:**
El sistema compila sin advertencias ni errores. La navegación de rutas entre el catálogo, `/mis-compras`, `/mi-cuenta`, detalle de producto y checkout opera fluidamente sin recargas de página, y la estética visual cumple con los estándares de diseño de lujo requeridos.

---

### Actualización - 11 de Septiembre de 2026

**1. Módulo de Pedidos Web (Panel de Administrador):**
- Se creó una sección completamente nueva llamada **"Pedidos Web"** dedicada exclusivamente a la gestión de las compras provenientes de la tienda online.
- Los pedidos online ahora tienen un **ciclo de vida definido**: *Pendiente de Pago, En Preparación, Enviado, Entregado y Cancelado*.
- **Contabilidad Inteligente**: Cuando un pedido web ingresa (Pendiente de Pago), **no distorsiona las métricas** (no suma al Dashboard ni al Historial de Ventas). El dinero solo se registra oficialmente en las finanzas cuando el administrador cambia el estado a *En Preparación* confirmando la recepción del pago.
- Si un pedido se cancela, el sistema **restaura automáticamente el stock** al inventario y genera un registro de movimiento correspondiente.

**2. Trazabilidad para el Cliente (Tienda Web):**
- Se diseñó e integró un **Stepper Interactivo (Línea de tiempo)** en el perfil web del cliente (`VistaPanelCliente.jsx`).
- Ahora los clientes pueden ver el progreso visual y elegante de su compra desde su panel (*Pendiente ➔ Preparación ➔ Enviado ➔ Entregado*).
- Se destacó el **Número de Seguimiento** (Tracking) en caso de que el pedido haya sido despachado, mejorando la experiencia post-venta.

**3. Sistema de Permisos Avanzado y Seguridad:**
- Se desacopló la gestión de pedidos web del módulo de ventas creando un nuevo permiso oficial llamado **`🌐 Pedidos Web`** (`pedidos_web`).
- Esto permite que el dueño del negocio asigne permisos exclusivamente de despachos y atención al cliente a ciertos empleados sin exponer las ganancias totales ni las ventas físicas.
- **Edición de Administradores de Negocio (SaaS):** Se modificó el Backend (`AuthController.cs`) y Frontend (`Users.vue`) para permitir que el **Súper Administrador** pueda editar completamente los perfiles de los dueños de negocios (`EmpresaOwner`). Ahora se puede modificar su nombre, correo, desactivar su acceso, y asignarle o retirarle módulos/funcionalidades específicas libremente.

**4. Visualización en Sidebar de Vistas Administrativas:**
- Se actualizó el menú lateral (`Sidebar`) en 14 vistas administrativas de la aplicación en Vue (`Frontend/src/views/*.vue`) para asegurar que el acceso a **"Pedidos Web"** esté siempre visible y disponible cuando el usuario tenga los permisos correspondientes.
- Se depuró la sincronización de permisos entre el Frontend (`auth.js`) y el Backend (`UserContext.cs`) garantizando que los dueños de negocio (`EmpresaOwner`) reciban correctamente el permiso de `pedidos_web` por defecto.

**5. Corrección Integral de Fallos (Checkout e Inventario):**
- **Solución al "Pantallazo Negro" (Frontend-Relojes):** Se diagnosticó y corrigió un fallo crítico en el checkout (`ProcesoPago.jsx`). Al finalizar exitosamente una orden, el sistema intentaba renderizar variables de estado no declaradas (`accountCreated`, `accountPassword`) para la sección de creación de cuenta post-compra, lo cual colapsaba la vista de React generando una pantalla negra de error. Se inicializaron correctamente, restaurando la pantalla de celebración (confeti y resumen de la orden). El vaciado automático del carrito ahora funciona a la perfección ya que el renderizado culmina con éxito.
- **Deducción Correcta de Inventario (Backend):** Se corrigió una vulnerabilidad lógica en el ciclo de vida del pedido online. Anteriormente el stock se descontaba prematuramente al momento de crear la orden en estado **Pendiente de Pago** (`PublicStoreController.cs`). Se eliminó esta lógica y se reubicó en `SalesController.cs`: ahora el sistema **solo descuenta el stock** cuando el administrador manipula el pedido y lo transiciona a un estado confirmado (ej. `En Preparación`). De igual forma, si un pedido se cancela, el stock solo se repone si el pedido provenía de un estado previamente confirmado.

---

### Actualización - 12 de Septiembre de 2026

**1. Integración del Código QR Oficial de Yape (Paso 4 - Pasarela de Pago):**
- **Activo Oficial Integrado:** Se importó e integró el flyer oficial de Yape a `Frontend-Relojes/public/qr-yape.png`.
- **Diseño de Pasarela de Pagos (`ProcesoPago.jsx`):**
  - Se sustituyó el marcador de posición SVG genérico (`LuxuryQRCode`) por la tarjeta oficial con la imagen del QR de Yape, optimizando el peso del código.
  - Presentación visual estilizada con el color institucional púrpura de Yape (`#742284`), bordes dorados tenues (`rgba(212, 175, 55, 0.35)`), insignia de verificación y sombras suaves.
  - **Titular Oficial Verificado:** Vinculado a **Grupo Sercal S.a.c.**
  - **Número por Defecto:** Configurado como **`999 999 999`** con botón interactivo de un clic para copiar al portapapeles (copia `999999999` y muestra check verde de confirmación).
  - **Flujo de Pago Transparente:** Monto dinámico en vivo en Soles (`S/.`), campo para ingresar el *Número de Operación o Referencia* del voucher y coordinación directa post-pago vía WhatsApp con el pedido generado.

**2. Refactorización de la Experiencia de Autenticación de Clientes (Login VIP):**
- **Diagnóstico y Corrección de UX:** Se identificó que al iniciar sesión, el modal `ModalAuthCliente.jsx` sufría una transición tosca donde se forzaba la visualización de la ficha de cliente VIP comprimida dentro del mismo modal, coronada por una franja negra fija (`backgroundColor: 'var(--c-indigo)'`) que tapaba la pantalla y estorbaba la navegación del comprador.
- **Cierre Instantáneo de Modal:** Al validar exitosamente las credenciales en `ModalAuthCliente.jsx`, el modal se cierra de forma inmediata (`onClose()`) y sin demoras artificiales, devolviendo al usuario al flujo de compra o navegación sin fricciones.
- **Eliminación Total de la Barra Negra:** Se retiró permanentemente el banner superior tosco que obstaculizaba la vista.
- **Nuevo Componente `ToastBienvenidaCliente.jsx`:**
  - Componente flotante de alta gama posicionado estratégicamente en la esquina superior derecha (`top: 85px, right: 30px`), alineado con la estética de alta relojería de L'GANT.
  - **Monograma VIP de Lujo:** Avatar circular obsidiana con tipografía serif dorada que exhibe la inicial del cliente, acompañado de un punto verde de verificación activa en tiempo real.
  - **Acentos Dorados y Glassmorphism:** Fondo blanco limpio con línea superior de acento dorado en gradiente (`#d4af37`), bordes sutiles y sombra difusa.
  - **Saludo Personalizado:** *"¡Bienvenido, [Nombre]! - Sesión VIP iniciada correctamente"*.
  - **Desvanecimiento Suave:** Temporizador automático de cierre a los 4.5 segundos o descarte manual mediante botón `✕`.
- **Integración Global (`App.jsx`):**
  - Control de estado reactivo mediante `welcomeUser`, disparándose de inmediato tras la respuesta exitosa del servidor.
  - Desacoplamiento de vistas: El acceso a la gestión de datos personales y seguimiento de pedidos queda 100% canalizado a través del menú de usuario en la barra de navegación hacia la vista completa dedicada `VistaPanelCliente.jsx` (`/mis-compras` y `/mi-cuenta`).

**3. Nueva Vista Completa y URL Dedicada para Pedido Confirmado (`/pedido-confirmado`):**
- **Eliminación Total de Modales / Cards Flotantes:** Se retiró por completo la ventana emergente flotante con fondo oscuro en el checkout que bloqueaba la pantalla del usuario.
- **Ruta Oficial en Next.js App Router (`src/app/pedido-confirmado/page.jsx`):** Ahora al culminar una compra, el navegador actualiza la URL a `/pedido-confirmado` de manera nativa y fluida como las demás secciones (`/mis-compras`, `/mi-cuenta`, etc.).
- **Nuevo Componente `VistaPedidoConfirmado.jsx`:**
  - **Experiencia de Alta Relojería a Pantalla Completa:** Vista amplia integrada con la barra de navegación superior y pie de página de L'gant.
  - **Hero Banner de Celebración:** Sello de garantía dorado con `CheckCircle2` y `Award`, saludo personalizado *"¡Gracias por tu compra, [Nombre]!"*, y código de pedido con botón interactivo de 1-clic para copiar al portapapeles.
  - **Desglose Exhaustivo de Productos Adquiridos:** Tabla de relojes con miniaturas, marca/modelo, color, cantidad, precio unitario y total, acompañada del desglose financiero (subtotal, envío asegurado gratis y total abonado).
  - **Bloques Detallados de Entrega y Pago:** Destinatario, DNI, dirección exacta, distrito/provincia/departamento, comprobante fiscal (Boleta o Factura con RUC), método de pago (Yape/Plin/Tarjeta/Transferencia) y referencia de voucher.
  - **Acciones y Trazabilidad:** Botón destacado de WhatsApp con mensaje automático enriquecido, acceso directo a "Ver Mis Compras" para tracking y "Volver a la Tienda".
  - **Garantías y Compromiso L'gant:** Bloque de valor con 100% Autenticidad Garantizada, Custodia y Empaque Blindado, y Atención Concierge.
  - **Persistencia de Sesión:** Soporta recargas (F5) recuperando la orden desde `sessionStorage` sin perder la información.
- **Compilación Validada:** Verificada con Next.js 16 (`npm run build`) generando la ruta estática `○ /pedido-confirmado` con 0 errores y 0 fallos de linting.

**4. Rediseño del Hero: Tipografía Gigante y Minimalista (Inspiración Editorial Eindhoven / "ELEGANTE EN CADA SEGUNDO"):**
- **Eliminación Total de Cajas, Bordes y Botones de Juego:** Se erradicaron por completo los bordes de celda, fondos de azulejo, botones de píldora y elementos de crucigrama tipo juego.
- **Estilo Editorial Suizo de Letras Gigantes:**
  - Letras masivas en peso ultra-bold 900 (`Montserrat` / `Plus Jakarta Sans`) en negro puro `#0b0b0c`, directamente sobre el lienzo blanco sin marcos ni cajas.
  - Tracking cerrado (`-0.04em`) y proporciones arquitectónicas de alto impacto visual inspiradas en el diseño de Eindhoven Design District.
- **Estructura Exacta del Diagrama del Cliente (7 filas x 8 columnas):**
  - Horizontal: `E - L - E - G - A - N - T - E`
  - Vertical 1 (en la 2da 'E'): `E` ➔ `N` formando `"EN"`
  - Vertical 2 (en la 'A'): `C` ➔ `A` ➔ `D` ➔ `A` formando `"CADA"`
  - Vertical 3 (en la última 'E'): `S` ➔ `E` ➔ `G` ➔ `U` ➔ `N` ➔ `D` ➔ `O` formando `"SEGUNDO"`
- **Aparición Secuencial Palabra por Palabra:**
  - Se revelan progresivamente en orden de lectura: *ELEGANTE* ➔ *EN* ➔ *CADA* ➔ *SEGUNDO*.
  - Al pasar el cursor por encima de cualquier letra, la palabra completa se resalta en tono dorado mientras las demás se atenúan con elegancia.
- **Escala Monumental y Reequilibrio de Posición (Hacia la Izquierda):**
  - Se aumentó drásticamente el tamaño de las letras a `clamp(3.1rem, 5.4vw, 5.2rem)` y celdas de hasta `68px x 74px`.
  - Se amplió el ancho del contenedor de texto al `60%` (`maxWidth: 780px`) y se ancló a la izquierda con padding fluido, separando la columna derecha (`SEGUNDO`) del borde del reloj.
  - Se aplicó una máscara difuminada suave (`maskImage`) en la galería de relojes para que el titanio del reloj emerja orgánicamente sin colisionar con la tipografía.
- **Compilación Validada:** `npm run build` en Next.js 16 completado con código 0 y 0 errores.

**5. Expansión Monumental del Crucigrama y Efecto Bicolor (*Split-Color* sobre Imagen):**
- **Ocupación Total de la Mitad Izquierda:**
  - Se configuró la cuadrícula a `repeat(8, 1fr)` con ancho al 100% (`maxWidth: 820px`), distribuyendo las 8 columnas uniformemente para que la palabra horizontal `ELEGANTE` ocupe generosamente todo el espacio disponible en su mitad izquierda.
  - Se calibraron los tamaños tipográficos a `clamp(2.4rem, 5.6vw, 5.8rem)` y alturas de fila hasta `84px`.
- **Restablecimiento de la Galería al 50% Exacto:**
  - En `Inicio.jsx`, la galería de relojes regresó a su proporción original de mitad de pantalla (`width: 50%`, anclada a la derecha).
  - Se retiró la máscara difuminada lechosa para recuperar el contraste fotográfico nítido y lujoso de los relojes.
- **Efecto de Tipografía Bicolor (*Split-Color* de Alta Gama):**
  - Implementación de un sistema de renderizado de doble capa con recorte vectorial matemático (`clipPath` con `inset` dinámico calculado al 50% del viewport).
  - **Zona Blanca (Izquierda):** Letras en negro obsidiana puro (`#09090b`).
  - **Zona de Imagen (Derecha):** En cuanto las letras cruzan la mitad de la pantalla y quedan encima del reloj oscuro, cambian a **blanco puro resplandeciente (`#ffffff`)** con sutil sombra de contraste (`text-shadow`), evitando que el fondo del reloj las opaque.
  - **Línea Divisoria Bicolor:** Las letras que quedan sobre la frontera exacta se dividen limpiamente en dos colores (mitad izquierda negra, mitad derecha blanca), siguiendo fielmente la referencia gráfica provista por el cliente.
  - **Hover Dinámico:** Resaltado coordinado en oro (`var(--c-gold)`) en el lado claro y oro champán luminoso (`#fbf4dc`) en el lado oscuro.
  - **Compatibilidad Móvil:** En resoluciones móviles (`<= 991px`), el sistema conmuta automáticamente para mostrar la tipografía completa en negro obsidiana sobre el fondo claro.
- **Compilación y Despliegue:** Verificado con `npm run build` (0 errores) y confirmado en Git (`origin/master`).

**6. Reconfiguración Arquitectónica a Matriz 7x9 y Letras Rotadas a 90° (Diseño Editorial Exacto):**
- **Estructura de Cuadrícula 7 Filas x 9 Columnas:**
  - **Fila 0:** Palabra horizontal `"ELEGANTE"` que abarca de Col 0 a Col 7 (orientación horizontal convencional en Col 0-6).
  - **Columna 7 (Dirección Vertical Rotada 90° Horario):**
    - `E` (Fila 0): Intersección con `ELEGANTE` y punto de partida de `EN`, con rotación a 90° en sentido horario.
    - `N` (Fila 1): Con rotación a 90°, completando `"EN"`.
    - **Fila 2:** Fila vacía de respiro arquitectónico y espaciado editorial.
    - `C` (Fila 3): Con rotación a 90°, inicio de `"CADA"`.
    - `A` (Fila 4): Con rotación a 90°.
    - `D` (Fila 5): Con rotación a 90°, intersección con `"SEGUNDO"`.
    - `A` (Fila 6): Con rotación a 90°, final de `"CADA"`.
  - **Fila 5 (Dirección Horizontal):**
    - Palabra `"SEGUNDO"` que se despliega horizontalmente de Col 2 a Col 8 (`S`, `E`, `G`, `U`, `N`, `D`, `O`), ubicando `S` alineado bajo la segunda `E` de `ELEGANTE`, intersectando en la `D` rotada de Col 7 y rematando con la `O` en Col 8.
- **Secuencia de Animación Orgánica:**
  - `ELEGANTE` (Fila 0) ➔ `EN` (Col 7) ➔ `CADA` (Col 7) ➔ `SEGUNDO` (Fila 5).
- **Integración con Split-Color:** La columna 7 y columna 8 que penetran en el 50% derecho continúan beneficiándose del efecto bicolor automático (negro sobre blanco, blanco luminoso sobre el reloj oscuro).
- **Compilación Validada:** `npm run build` completado exitosamente (código 0). Guardado y sincronizado en `origin/master`.

**7. Motor de Búsqueda Inteligente Multi-Término y Enrutamiento Dedicado (`/buscar?q=...`):**
- **Motor de Búsqueda Inteligente Agnóstico al Orden (`src/utils/searchEngine.js`):**
  - **Independencia del Orden de Palabras:** Si un producto se titula `"Reloj Rosado"`, la búsqueda de `"rosado reloj"` o cualquier combinación de palabras lo encuentra de inmediato mediante tokenización (`split(/\s+/)`) y evaluación conjuntiva (`tokens.every(...)`).
  - **Normalización Diacrítica y Fonética:** Uso de `normalizeText` con descomposición canónica (`normalize('NFD')`) para eliminar tildes y diacríticos (ejemplo: `"cronógrafo"` coincide con `"cronografo"`, `"automático"` con `"automatico"`).
  - **Tolerancia Morfológica Singular/Plural:** `getWordVariants` mapea automáticamente variantes en español (`"relojes"` ➔ `"reloj"`, `"correas"` ➔ `"correa"`).
  - **Indexación Profunda Multicampo:** El corpus de búsqueda de cada producto comprende: nombre del modelo, descripción detallada, marca, categoría principal, categorías secundarias, código SKU / modelo y atributos dinámicos (color, material, correa, calibre, resistencia al agua).
  - **Ranking de Relevancia Ponderado (`score`):** Los productos con coincidencias exactas o en el título/marca reciben una puntuación superior, priorizándolos en la presentación sobre coincidencias en atributos secundarios.
  - **Tolerancia a Errores Tipográficos (Fuzzy Search Levenshtein):** Capacidad de recuperación ante pequeños fallos tipográficos en palabras de más de 4 caracteres.
- **Ruta de Servidor Dedicada en Next.js App Router (`src/app/buscar/page.jsx`):**
  - Creación de la ruta independiente `ƒ /buscar?q=...` con metadatos dinámicos SEO y OpenGraph (`title: Búsqueda: ... | L'gant Haute Horlogerie`).
  - Permite acceso directo, enlaces compartibles y recarga de página (`F5`), renderizando el catálogo con el término pre-filtrado.
  - Sincronización bidireccional con el historial del navegador (`window.history.pushState` y evento `popstate`) para navegar con los botones "Atrás" y "Adelante" sin recargas innecesarias.
- **Barra de Navegación y Dropdown Predictivo Flotante (`BarraNavegacion.jsx`):**
  - **Dropdown de Autocompletado de Lujo:** Mientras el usuario escribe, se despliega una ventana flotante con las mejores 5 coincidencias inmediatas mostrando miniatura del reloj, marca, nombre y precio formateado en soles.
  - **Acción Rápida:** Clic en un resultado abre directamente la vista de detalle del producto (`/producto/[id]`), o presionar `Enter` / clic en la lupa / botón *"Ver todos los resultados"* navega a `/buscar?q=...`.
- **Integración en Catálogo General (`App.jsx`):**
  - El encabezado del catálogo conmuta a la insignia `<svg> BÚSQUEDA INTELIGENTE`, título `Resultados para: "{searchQuery}"` y contador de coincidencias exactas.
  - Ocultamiento automático del Hero durante la búsqueda para enfocar al cliente de inmediato en los productos encontrados.
  - Estado vacío enriquecido en caso de no hallar piezas, con sugerencias de términos y botón de restauración a la colección completa.
- **Validación y Compilación:** `npm run build` en Next.js 16 ejecutado con código 0 y 0 errores; ruta `ƒ /buscar` verificada y compilada. Guardado y sincronizado en `origin/master`.

---

**8. Integración Oficial de Pasarela de Pagos Mercado Pago Checkout Pro (Backend ASP.NET Core .NET 9 + Frontend-Relojes Next.js):**

- **Arquitectura de la Integración:**
  - **Requerimiento:** Integrar Mercado Pago Checkout Pro para que los clientes de la tienda de alta relojería puedan pagar sus compras online con tarjeta de crédito, débito (BCP, BBVA, Interbank, etc.), efectivo o saldo de Mercado Pago, y que los fondos ingresen directamente a la cuenta del titular del negocio.
  - **Esquema de Flujo:**
    1. El cliente arma su carrito y avanza en el checkout de 4 pasos.
    2. En el paso 4 (Métodos de Pago), se habilita la 5ta opción oficial: **Mercado Pago** (con distintivo visual azul `#009ee3` e iconografía oficial).
    3. Al hacer clic en *"Confirmar Compra"*, se registra primero la orden en MongoDB con estado `EstadoPago = "PENDIENTE_PAGO"` y `EstadoOrden = "PENDIENTE_PAGO"`.
    4. El frontend invoca al backend para crear la **Preferencia de Pago** en Mercado Pago (`createMercadoPagoPreference`).
    5. El backend responde con el `preferenceId` y los enlaces de checkout (`initPoint` y `sandboxInitPoint`).
    6. El navegador redirige al cliente a la pasarela segura de Mercado Pago.
    7. Al completarse el pago, el Webhook de Mercado Pago notifica al backend en tiempo real, actualizando la orden a `EstadoPago = "Pagado"` y `EstadoOrden = "EN_PREPARACION"`, mientras el cliente es redirigido a `/pedido-confirmado`.

- **Componentes Implementados en Backend (`Backend/`):**
  - **Instalación de Dependencia:** `mercadopago-sdk` v3.7.0 instalado vía NuGet en `Backend.csproj` (versión oficial compatible con .NET 9).
  - **Configuración Segura (`appsettings.json`):**
    ```json
    "MercadoPago": {
      "AccessToken": "APP_USR-4612024376801510-091318-0fc0afcc8f486444f6d6f4391ee4a8fb-3688279260",
      "PublicKey": "APP_USR-2715e18b-bd69-497c-bac4-11af7047a2b3"
    }
    ```
  - **Controlador API (`Backend/Controllers/MercadoPagoController.cs`):**
    - `POST /api/mercadopago/{empresaId}/preference`: Valida autenticación del cliente JWT, construye los ítems con moneda peruana (`CurrencyId = "PEN"`), URLs de retorno automáticas (`AutoReturn = "approved"`, `BackUrls.Success`, `BackUrls.Failure`, `BackUrls.Pending`), `NotificationUrl` para webhooks y `ExternalReference = orderId`.
    - `POST /api/mercadopago/{empresaId}/webhook` (anónimo con `[AllowAnonymous]`): Recibe las notificaciones IPN/Webhooks de Mercado Pago, consulta el estado del pago a la API de Mercado Pago (`PaymentClient.GetAsync(paymentId)`), y cuando `Status == "approved"`, actualiza la venta en MongoDB automáticamente.
  - **Compilación Exitosa:** `dotnet build Backend.csproj` completado con 0 errores.

- **Componentes Implementados en Frontend (`Frontend-Relojes/`):**
  - **Servicio API (`src/services/api.js`):**
    - Función exportada `createMercadoPagoPreference(token, { orderId, items })` que consume el endpoint `/api/mercadopago/{empresaId}/preference`.
  - **Flujo de Pago (`src/components/ProcesoPago.jsx`):**
    - Pestaña de pago número 5 integrada en la rejilla de métodos (después de Contra Entrega) con colores y badge MP.
    - Panel informativo detallado (Vista 5) mostrando tarjetas aceptadas (Visa, Mastercard, Amex, Billetera MP, cuotas) y sello de seguridad cifrada.
    - Manejador de compra `handleFinalizarCompra`: Detecta `paymentMethod === 'mercadopago'`, genera la preferencia y realiza la redirección.

- **Diagnóstico y Hallazgos Clave de las Pruebas de Sandbox:**
  - **Comportamiento del Sandbox en Checkout Pro:** Mercado Pago aplica restricciones sumamente estrictas en modo Sandbox (errores como *"Una de las partes con la que intentas hacer el pago es de prueba"*, bloqueo del botón Pagar al faltar o diferir el correo del pagador, y fallas internas en la API de Mercado Pago al crear usuarios de prueba).
  - **Determinación Técnica:** Mercado Pago **NO exige** completar pruebas en Sandbox para activar la pasarela o comenzar a operar. Las credenciales configuradas (`APP_USR-...`) ya son credenciales operativas de producción.
  - **Estrategia Acordada:** Pasar a **Producción Real**, eliminando todas las trabas artificiales del Sandbox y permitiendo pagos reales con cualquier tarjeta bancaria (BCP, BBVA, Interbank, etc.).

- **Hoja de Ruta para Continuar Mañana:**
  1. En `Backend/Controllers/MercadoPagoController.cs`: Asegurar que el objeto `Payer` envíe `Email = client.Correo` para que el cliente reciba su comprobante de pago oficial de Mercado Pago.
  2. En `Frontend-Relojes/src/components/ProcesoPago.jsx`: Configurar la redirección a `const checkoutUrl = mpRes.initPoint` (pasarela oficial `www.mercadopago.com.pe`).
  3. Realizar `git add .`, `git commit` y `git push origin master` para que el VPS despliegue la versión de producción.
  4. Realizar una prueba controlada en vivo de bajo monto (S/ 1.00 o S/ 2.00) con tarjeta real:
     - Comprobar que la pasarela abra limpiamente.
     - Confirmar que el pago se apruebe en segundos.
     - Verificar que el dinero ingrese a la cuenta de Mercado Pago del cliente.
     - Verificar que el webhook actualice la orden a *"En preparación"*.
     - Ejecutar el reembolso inmediato del S/ 1.00 desde el panel de Mercado Pago (*"Devolver dinero"*).

---

### Actualización - 15 de Septiembre de 2026

**1. Correcciones de Interfaz y UX (Dashboard y Panel Administrativo):**
- **Pedidos Web (`OnlineOrders.vue`):** Se resolvió el inconveniente de deformación donde los botones de filtro rápido de fechas (Hoy, 7D, Este Mes) y el buscador de clientes quedaban en filas separadas y con anchos desproporcionados. Se unificaron en una sola línea horizontal compacta (`flex`, `align-items: center`, `gap`) con anchos controlados y comportamiento responsivo.
- **Barra Lateral / Sidebar (`style.css`):** Se corrigió el desplazamiento visual involuntario (*layout shift*) que ocurría durante la transición de apertura y cierre del menú lateral. Se fijó un ancho y alineación permanente para que los íconos y textos mantengan su posición exacta sin brincos visuales.

**2. Sistema de Seguridad: Verificación de Cuentas por Correo Electrónico (Flujo Antifraude):**
- **Objetivo:** Evitar que se registren cuentas con correos falsos o inventados, impidiendo el inicio de sesión hasta que el usuario demuestre la titularidad de su correo haciendo clic en un enlace de activación (flujo estándar idéntico al de plataformas como `punto.pe`).
- **Backend (.NET 9 / C#):**
  - **Modelo `User.cs`:** Se agregaron los campos `CorreoVerificado` (`bool`) y `TokenVerificacion` (`string?`).
  - **Servicio `Backend/Services/EmailService.cs`:** Implementado con `System.Net.Mail.SmtpClient`. Despacha automáticamente correos con formato HTML corporativo, mensaje de bienvenida y botón de acción destacado: `[Verificar mi cuenta]` con enlace parametrizado (`?token=...`).
  - **Controlador `Backend/Controllers/AuthController.cs`:**
    - `POST /api/auth/registrar-empresa` y `POST /api/auth/create-user`: Crean las cuentas con `CorreoVerificado = false`, generan un token GUID seguro y disparan el correo de verificación al destinatario.
    - `POST /api/auth/login`: Control de acceso. Si un usuario intenta autenticarse con `CorreoVerificado == false`, se rechaza con error 401: *"Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada."*
    - `GET /api/auth/verify-email?token=...`: Endpoint que valida el token, marca `CorreoVerificado = true`, limpia el token de un solo uso y habilita la cuenta.
    - `POST /api/auth/seed-superadmin`: El Superadministrador queda pre-verificado (`CorreoVerificado = true`) para no bloquear el acceso maestro del sistema.
  - **Plantilla de configuración (`Backend/appsettings.example.json`):** Estructura documentada para la sección `SmtpSettings` (Host, Port, Email, Password, EnableSsl).
- **Frontend (Vue 3):**
  - **Vista `Frontend/src/views/VerifyEmail.vue`:** Pantalla dedicada que recibe el parámetro `token`, consulta la API de verificación y muestra retroalimentación visual (spinner de carga, estado de éxito con check verde y botón *"Ir a Iniciar Sesión"*, o mensaje de error en caso de token inválido/expirado).
  - **Rutas (`Frontend/src/router/index.js`):** Registro de la ruta pública `/verificar-correo`.
  - **Gestión de Usuarios (`Frontend/src/views/Users.vue`):** Se adecuaron los avisos para notificar al administrador que se ha enviado el correo de validación a la bandeja del colaborador recién creado.
- **DevOps y Despliegue Docker:**
  - **`docker-compose.yml`:** Se añadieron las variables de entorno en el contenedor `backend` (`SmtpSettings__Host`, `SmtpSettings__Port`, `SmtpSettings__Email`, `SmtpSettings__Password`, `FrontendUrl`) mapeadas a variables del archivo `.env` del VPS, facilitando su configuración sin intervenir archivos internos.
  - **Control de Versiones:** Todo el código fue probado, compilado, commiteado (`d5e8d63`, `4ba92ed`) y subido satisfactoriamente a GitHub (`origin/master`).

**3. Estado Actual y Dónde Nos Quedamos:**
- El código fuente está **100% completado, subido al repositorio y listo para producción**.
- **Configuración en Espera:** Se acordó **NO llenar aún el archivo `.env` en el VPS** debido a que todavía no se cuenta con el dominio final (`lgante.pe`) ni con el correo corporativo del negocio configurado.

**4. Tareas Pendientes / Próximos Pasos:**
1. **Adquisición y Configuración de Dominio / Correo:**
   - Adquirir el dominio en `punto.pe` (`lgante.pe`).
   - Configurar el buzón de correo emisor (ej. en Hostinger: `soporte@lgante.pe` / `contacto@lgante.pe`, o temporalmente una cuenta Gmail con contraseña de aplicación).
2. **Carga de Credenciales en el VPS (`.env`):**
   Completar las siguientes líneas en el archivo `.env` del servidor:
   ```env
   SMTP_HOST=smtp.hostinger.com (o smtp.gmail.com)
   SMTP_PORT=465 (o 587)
   SMTP_EMAIL=tu_correo@lgante.pe
   SMTP_PASSWORD=tu_contraseña_o_clave_de_aplicacion
   FRONTEND_URL=https://www.lgante.pe
   ```
3. **Reconstrucción y Reinicio de Contenedores en VPS:**
   Ejecutar en la consola de Hostinger:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```
4. **Validación en Vivo:**
   - Registrar o crear un usuario de prueba.
   - Confirmar recepción del correo en la bandeja de entrada.
   - Probar que el login esté bloqueado antes del clic.
   - Hacer clic en el enlace/botón de activación y confirmar inicio de sesión exitoso.

---

### Actualización - 15 de Septiembre de 2026 (Sesión Noche: Reubicación de Verificación de Correo al E-Commerce)

**1. Desbloqueo y Corrección en Panel Administrativo (`ventassaas.vercel.app`):**
- **Diagnóstico:** Se identificó que la verificación de correo por token se había acoplado al modelo general `User` (`AuthController.cs`), bloqueando el acceso al administrador del SaaS (`relojes@ventassaas.com`) en `ventassaas.vercel.app/login` con el mensaje *"Por favor, verifica tu correo antes de ingresar"*.
- **Corrección en Backend (`AuthController.cs` y `User.cs`):**
  - Se eliminó la validación obligatoria de verificación de correo en el endpoint `POST /api/auth/login`.
  - El campo `CorreoVerificado` en `User.cs` quedó predeterminado en `true`, garantizando acceso instantáneo y sin trabas a dueños de negocio, administradores y empleados.
  - Se eliminó el envío involuntario de correos de activación en `RegisterEmpresa` y `CreateUser`.

**2. Implementación Exclusiva para Clientes del E-Commerce (`Frontend-Relojes` / L'GANT):**
- **Modelo de Clientes (`Client.cs`):**
  - Se agregaron los campos `CorreoVerificado` (`bool`, por defecto `false` en nuevos registros) y `TokenVerificacion` (`string?`).
- **Lógica en Backend (`PublicStoreController.cs`):**
  - En `POST /api/public/store/{empresaId}/auth/register`:
    - Al registrarse un cliente nuevo (o convertir un cliente POS existente), se le genera un token GUID criptoseguro y se despacha en segundo plano el correo corporativo VIP de L'GANT.
    - Responde con `requiresVerification = true` y mensaje amigable de confirmación.
  - En `POST /api/public/store/{empresaId}/auth/login`:
    - Si un cliente intenta iniciar sesión sin haber activado su cuenta (`!CorreoVerificado && TokenVerificacion != null`), se le notifica amablemente revisar su bandeja de entrada o carpeta de spam.
    - Se respeta la retrocompatibilidad para clientes previos sin token.
  - En `GET /api/public/store/auth/verify-email?token=...`:
    - Endpoint público que valida el token recibido, marca `CorreoVerificado = true`, remueve el token y habilita la cuenta VIP.
- **Servicio de Correos L'GANT (`EmailService.cs`):**
  - Rediseño integral de la plantilla HTML con estética de alta relojería de L'GANT (fondos obsidiana `#0b0b0c`, acentos dorados `#d4af37`, tipografía formal y botón de acción: *"Activar mi Cuenta VIP"*).
  - El enlace apunta directamente a la tienda online (`/verificar-correo?token=...`), no al panel del SaaS.

**3. Frontend E-Commerce (`Frontend-Relojes`):**
- **Servicio API (`src/services/api.js`):**
  - Exportación de la función `verifyCustomerEmail(token)` consumiendo el endpoint público del backend.
- **Modal de Autenticación (`ModalAuthCliente.jsx`):**
  - Detección de `requiresVerification: true` al registrarse, conmutando automáticamente a la vista de login y exhibiendo un banner verde de confirmación con instrucciones claras para revisar el correo.
- **Nueva Vista de Verificación (`VistaVerificarCorreo.jsx`):**
  - Componente de alta gama L'GANT con 3 estados visuales interactivos:
    1. *Cargando*: Spinner dorado y mensaje de validación de credenciales.
    2. *Éxito*: Sello de membresía VIP activada, check verde, mensaje de felicitación y botón directo para *"Iniciar Sesión VIP"*.
    3. *Error*: Alerta estilizada en caso de token inválido o expirado con botón para volver a la tienda.
- **Enrutador Next.js App Router (`src/app/verificar-correo/page.jsx` y `App.jsx`):**
  - Ruta canónica `○ /verificar-correo` compilada estáticamente en Next.js 16 con código 0 y 0 errores.

**Estado Actual:**
- Backend (.NET 9) y ambos Frontends (Vue y Next.js) compilan con 0 errores y 100% de coherencia arquitectónica.

**4. Comportamiento del Sidebar en Panel Admin (`Frontend/src/style.css`):**
- **Diagnóstico:** Previamente se había aplicado `position: fixed` con `margin-left: 68px` en `.main-content`. Esto provocaba que al pasar el cursor sobre el menú lateral y expandirse a 250px, este flotaba por encima y tapaba los primeros 182px de la pantalla (títulos de sección, buscador y columnas de las tablas).
- **Ajuste de Empuje Dinámico (Layout Shift Intencional):**
  - Se configuró `.sidebar` como `position: sticky; top: 0;` como elemento en el flujo del contenedor flex (`.dashboard-layout`).
  - Se eliminó el `margin-left: 68px;` fijo de `.main-content` y se agregó `min-width: 0;`.
  - Se agregó `min-width 0.3s` a la transición CSS de la barra lateral.
- **Efecto Visual Obtenido:** Al hacer hover sobre el sidebar, este se expande suavemente y **empuja físicamente todo el contenido hacia la derecha** en tiempo real. Al retirar el mouse, el contenido regresa a su posición original sin solapamientos ni elementos ocultos.

**5. Compilación y Versionamiento:**
- **Backend (.NET 9):** `dotnet build Backend.csproj` completado con 0 errores.
- **Frontend Admin (Vue 3 / Vite):** `npm run build` completado exitosamente en 1.30s (código 0).

---

### Refactorización de Diseño Minimalista y Limpieza de Identidad Visual (Frontend Relojes)
**Fecha:** Septiembre 16-17, 2026

**1. Rediseño Total de la Sección Hero (`Inicio.jsx`):**
- **Fondo Minimalista:** Se reemplazó el fondo oscuro degradado radial (`var(--c-charcoal)` a `var(--c-obsidian)`) por un fondo blanco sólido y luminoso (`#ffffff`).
- **Limpieza de Elementos Gráficos:** Se eliminaron por completo la imagen renderizada del reloj flotante (Casio) y el recurso gráfico del "montículo de tierra" del código base para lograr un diseño más editorial.
- **Ajuste de Tipografía y Contraste:** 
  - El texto gigante de fondo ("L'GANT") cambió de blanco transparente a gris muy claro (`rgba(0,0,0, 0.04)`) para contrastar sin ser invasivo.
  - El trazado (stroke) del texto "EN CADA SEGUNDO" se cambió a gris (`rgba(0,0,0, 0.05)`).
  - El bloque de texto informativo de "LIMITED PRE-ORDERS" pasó de blanco a negro.
- **Eliminación de Rutas Inactivas:** Se removió por completo la tarjeta interactiva oscura ("ARMA TU RELOJ") del hero y se eliminó toda la lógica, importaciones y rutas (`/arma-tu-reloj`) relacionadas dentro del ruteador de `App.jsx`.

**2. Limpieza de Copywriting y Tono de Marca (Global):**
- **Eliminación del concepto "VIP":** Se ejecutó una refactorización de texto a lo largo de más de 10 archivos del frontend (BarraNavegacion, App, VistaPanelCliente, ModalAuthCliente, CajonCarrito, PaginaDetalleProducto, ToastBienvenidaCliente, VistaPedidoConfirmado, VistaVerificarCorreo, metadatos, etc.).
  - Las etiquetas como "Cliente VIP" pasaron a ser simplemente "Cliente" o "Cuenta".
  - "Ofertas VIP" pasó a ser "OFERTA".
  - Se eliminó la palabra "VIP" de notificaciones de WhatsApp (Concierge), estados de sesión, botones y garantías internacionales. Esto se hizo para darle a la marca un tono más serio, exclusivo y directo, eliminando el exceso de adjetivos.
- **Eliminación de Badges (Píldoras) en el Menú:**
  - En `BarraNavegacion.jsx`, se retiraron las etiquetas (badges) de `badge: 'Nuevo'` y `badge: 'OFERTA'` junto a los menús de "Novedades" y "Ofertas" para mantener un menú principal impecablemente limpio y de corte minimalista de lujo.
- **Frontend E-Commerce (Next.js 16):** `npm run build` completado exitosamente, generando la ruta canónica `○ /verificar-correo` sin errores ni advertencias de linting.
- **Sincronización Git:** Cambios consolidados y subidos a `origin/master` en los commits `50f91f9`, `188e92b` y `d1ea76d`.

---

### Actualización de Métodos de Pago, Compra como Invitado e Integración Pedidos Web
**Fecha:** Septiembre 17, 2026

**1. Gestión de Marcas en Panel Admin y Backend:**
- **Backend (.NET 9 / C#):** Creado modelo `Brand.cs` y controlador `BrandsController.cs` con soporte CRUD multi-tenant aislado por `EmpresaId`.
- **Panel Admin (Vue 3 / Vite):** Creada vista `Brands.vue` e integrada al router (`/brands`) y al menú de navegación lateral.

**2. Rediseño Limpio y Tipografía Refinada (Frontend Relojes):**
- **Panel de Cliente (`VistaPanelCliente.jsx`):** Rediseñado con pesos de fuente sutiles (`font-serif` para títulos), eliminando negritas pesadas y agregando el stepper horizontal de avance del pedido (*Pendiente de Pago*, *En Preparación*, *Enviado*, *Entregado*).
- **Tarjetas de Producto (`TarjetaProducto.jsx`):** Eliminados efectos 3D inclinados, destellos radiales y marcos dorados excesivos para lograr una presentación limpia y de alta relojería.

**3. Métodos de Pago Actualizados (`ProcesoPago.jsx` & `VistaPedidoConfirmado.jsx`):**
- **Retiro de Contra Entrega:** Removido por completo el método de pago "Contra Entrega" de las pestañas de selección, validaciones y vistas de confirmación.
- **Transferencia Bancaria:**
  - Titular oficial actualizado: **GRUPO SERCAL S.A.C.**
  - **BCP:** Cta. Corriente Soles `355-7216688-0-94` | CCI `002 355 007216688094 67`
  - **Interbank:** Cta. Corriente Soles `500-3007303149` | CCI `003-500-003007303149-61`
  - Actualizadas las funciones de copiado directo a portapapeles.

**4. Flujo de Compra como Invitado & Registro en Pedidos Web (`ProcesoPago.jsx` & `PublicStoreController.cs`):**
- **E-Commerce Checkout (`ProcesoPago.jsx`):**
  - Añadido enlace de acción limpia `Comprar como invitado ->` en el Paso 1 (Carrito), que salta directamente al Paso 4 (Métodos de Pago) desactivando las validaciones obligatorias de datos personales y dirección.
- **Backend (.NET 9 / C# - `PublicStoreController.cs`):**
  - Actualizado el endpoint `SubmitOrder` con atributo `[AllowAnonymous]` y soporte para `NombreCliente`.
  - Registra las ventas como invitado en MongoDB con `EstadoOrden = "PENDIENTE_PAGO"`, logrando que la compra **aparezca instantáneamente en la sección de Pedidos Web (`/online-orders`) del Panel Administrativo**.
- **Derivación Automática a WhatsApp:**
  - Al hacer clic en `FINALIZAR COMPRA` en modo invitado, se crea la orden en la BD y se genera una derivación automática a WhatsApp con la constancia del pedido (`#...`), método de pago, número de operación y lista de productos para coordinar la entrega.

**5. Verificación de Compilaciones:**
- **Frontend Relojes (Next.js 16):** `npm run build` ejecutado exitosamente con 0 errores y 0 advertencias de compilación.

---

### Actualización de Números de Atención y Carrusel Hero de Alta Relojería
**Fecha:** Septiembre 18, 2026

**1. Separación Categórica de Números Telefónicos (Yape vs. WhatsApp Concierge):**
- **Sección de Pago con Yape (`ProcesoPago.jsx`):** Configurado oficialmente en **`997 099 683`** (Titular: *Grupo Sercal S.a.c.*) con botón interactivo de copiado rápido (`997099683`).
- **Línea de Ventas y Concierge de WhatsApp Global:** Actualizado en todo el frontend de la tienda al número **`916 382 742`** (`51916382742` / `+51 916 382 742`).
  - **Archivos actualizados:** `App.jsx`, `BarraNavegacion.jsx` (cinta superior), `PieDePagina.jsx`, `Beneficios.jsx`, `CajonCarrito.jsx`, `ProcesoPago.jsx` (derivación de compras anónimas por WhatsApp), `VistaPanelCliente.jsx`, `VistaPedidoConfirmado.jsx`, `VistaTerminosCondiciones.jsx` y metadatos SEO JSON-LD en `layout.jsx`.

**2. Rediseño del Hero con Carrusel de Imágenes y Marca de Agua Vertical (`Inicio.jsx`):**
- **Galería de Alta Resolución:** Se agregaron 4 imágenes representativas (`hero1.jpg`, `hero2.jpg`, `hero3.jpg`, `hero4.jpg`) almacenadas en `public/hero/` y `src/assets/hero/`.
- **Efecto Pan/Zoom Suave (GPU Accelerated):** Animación CSS `@keyframes heroPanSmooth` que desplaza suavemente la imagen de izquierda a derecha a 60 FPS sin afectar la carga ni la CPU.
- **Transición Crossfade de 6s:** Fundido suave de opacidad (1.8s) entre diapositivas con controles laterales (`ChevronLeft`/`ChevronRight`) y barra de estado flotante (`01 / 04`).
- **Presentación Clara (Sin Filtros Oscuros):** Se eliminaron los overlays degradados oscuros para preservar el brillo, calidez y contraste fotográfico original de las piezas.
- **Marca de Agua Vertical `"L'GANT"`:** Reubicada en la franja izquierda en orientación de abajo hacia arriba (`rotate(-90deg)`), con tipografía de alta gama (*Cinzel*) y trazo translúcido.

**3. Verificación de Compilaciones y Despliegue:**
- **Compilación Next.js 16:** `npm run build` completado exitosamente con 0 errores.
- **Sincronización Git:** Cambios consolidados y pusheados a `origin/master`.

---

---

### ¿Dónde nos quedamos? (Sesión Anterior)

1. **Despliegue del Backend en el Servidor VPS (Hostinger):**
   Para aplicar las actualizaciones de marcas, compra anónima como invitado y corrección de auth en el servidor de producción:
   ```bash
   git pull origin master
   docker-compose down
   docker-compose up -d --build
   ```

2. **Pendientes de Producción para E-Commerce / Pagos:**
   - **Mercado Pago Checkout Pro:** Prueba en producción real de pago con tarjeta bancaria de bajo monto y verificación de la notificación de webhook.
   - **Pruebas de Pedidos Web:** Confirmar la recepción de pedidos web de invitados y clientes registrados en el panel admin `ventassaas.vercel.app/online-orders`.

---

### Integración de Bot Asesor & Vendedor WhatsApp con IA (Gemini + n8n) y Recepción de Comprobantes Yape/Plin
**Fecha:** Septiembre 21, 2026

**1. Arquitectura del Bot de WhatsApp Inteligente (`botn8n.md` / n8n):**
- **Cerebro Asesor con Google Gemini:**
  - Consulta en tiempo real al catálogo de MongoDB (`/api/relojes-store/productos/{empresaId}`) inyectando modelos, stock y características actualizadas.
  - Prompt especializado como asesor comercial de alta relojería de *L'gant* con tono profesional, conciso y directo (sin saludos reiterativos).
- **Cierre y Generación de Pedidos por Chat:**
  - Gemini detecta automáticamente la confirmación de compra y emite un payload estructurado JSON con la acción `CREAR_PEDIDO`.
  - n8n registra el pedido en el SaaS y devuelve al cliente las instrucciones de pago (Yape/Plin al `916 382 742`).
  - Almacena el `orderId` temporalmente en `$workflow.staticData.lastOrderId[from]` vinculándolo al número de WhatsApp del cliente.
- **Ruta de Imágenes / Recepción de Comprobantes:**
  - Al recibir una imagen por WhatsApp, n8n obtiene la URL segura desde los servidores de Meta Graph API v21.0, la descarga, la convierte a base64 y la sube al SaaS.
  - Si el cliente tiene un pedido activo reciente, adjunta el comprobante a la orden y responde con mensaje de confirmación y aviso de contacto. Si no tiene orden previa, solicita amablemente que confirme el reloj a comprar.

**2. Backend (.NET 9 / C# - `PublicStoreController.cs` & `Sale.cs`):**
- **Nuevos Campos en Modelo `Sale.cs`:**
  - `OrigenPedido` (string, por defecto "TiendaVirtual", "WhatsAppBot" para ventas por chat).
  - `WhatsAppCliente` (string opcional para guardar el teléfono con código de país).
  - `ComprobantePagoUrls` (`List<string>` para guardar las URLs de capturas de pago).
- **Nuevos Endpoints Anónimos `[AllowAnonymous]`:**
  - `POST /api/public/store/{empresaId}/bot/orders`: Registra la venta generada por el bot con `EstadoOrden = "PENDIENTE_PAGO"`. **No descuenta stock automáticamente** (se respeta la regla de validación humana previa por parte del administrador).
  - `POST /api/public/store/bot/upload-image`: Recibe la imagen en base64 desde n8n, la almacena físicamente en `/uploads/images/` del servidor y retorna la URL pública.
  - `POST /api/public/store/{empresaId}/bot/orders/{orderId}/voucher`: Adjunta la URL de la imagen del comprobante a la orden mediante operador `$push` en MongoDB.
- **Validación de Compilación:** Compilación exitosa con 0 errores y 0 advertencias (`dotnet build`).

**3. Panel Administrativo (`OnlineOrders.vue` - Vue 3 / Vite):**
- **Identificación de Origen:**
  - Nueva columna "Origen" en la tabla con insignia verde brillante (`#25d366`) para pedidos de `WhatsApp`.
  - Detalle del pedido con teléfono del cliente formateado y origen resaltado.
- **Visor de Comprobantes de Pago de WhatsApp:**
  - Sección interactiva en el modal de detalle con miniaturas de fotos (`140x140px`) con borde verde y zoom al pasar el cursor.
  - Clic directo para inspeccionar el comprobante o captura de Yape/Plin en alta resolución.
  - Mensaje informativo de advertencia si el cliente aún no adjunta su comprobante.

**4. Seguridad y Gestión de Repositorio:**
- Inclusión de `botn8n.md` en `.gitignore` para resguardar tokens de Meta y claves de API de Gemini ante la protección de secretos de GitHub (`GH013 - Secret Scanning & Push Protection`).
- Sincronización exitosa en la rama principal (`origin/master`).

---

### Control Total de Bot WhatsApp: Interruptor Admin, Silencio Inteligente, Notificaciones y Migración a Gemini 3.5
**Fecha:** Septiembre 21, 2026

#### 1. Resumen Ejecutivo
Se completó el ciclo integral de administración y gobernanza del Bot de WhatsApp para la tienda de alta relojería *L'gant*. El sistema ahora permite al administrador encender o apagar el asistente virtual directamente desde el panel de control (`Dashboard.vue`) sin tocar n8n ni la infraestructura del servidor. Además, se implementó la estrategia de **Silencio Total** para evitar costos o consumo innecesario de las 1,000 conversaciones gratuitas mensuales de Meta Cloud API, se migró el cerebro de IA al modelo ultrarrápido `gemini-3.5-flash-lite` con rotación de credenciales en Google AI Studio, y se consolidó toda la lógica en un único flujo maestro unificado en n8n (`Bot-Completo-LGant-n8n.json`).

---

#### 2. Arquitectura y Componentes Desarrollados

##### A. Capa de Base de Datos y Modelos (.NET 9 / MongoDB)
- **Modelo `Empresa.cs`:**
  - `BotWhatsAppActivo` (bool, default: `false`): Estado operativo del bot a nivel de empresa/tenant.
  - `NumeroWhatsAppBot` (string): Identificador o número oficial del bot configurado en Meta Cloud API (`1265104666693306` / `+51 916 382 742`).
  - `NumeroWhatsAppHumano` (string): Teléfono de respaldo del personal de atención humana en tienda (`51916382742`).

##### B. Backend (.NET 9 / C#): Control Administrativo y Endpoints
- **`DashboardController.cs`:**
  - `GetSummary`: Incluye en el DTO de respuesta `botWhatsAppActivo` y `numeroWhatsAppHumano` para que el panel administrativo cargue el estado en tiempo real.
  - `UpdateWhatsAppBotConfig` (`PUT /api/dashboard/whatsapp-bot/config`): Permite actualizar los números telefónicos y el estado del bot.
  - `ToggleWhatsAppBot` (`POST /api/dashboard/whatsapp-bot/toggle`):
    - Invierte o establece el estado `BotWhatsAppActivo` de la empresa.
    - **Disparador de Notificación Administrativa (Handoff Automático):** Si la acción es **APAGAR** el bot (`BotWhatsAppActivo = false`), el controlador consulta en MongoDB todas las ventas activas en estado `PENDIENTE_PAGO` que tengan registrado `WhatsAppCliente`.
    - Envía una petición `POST` al webhook administrativo de n8n (`https://n8nrelojes.helifyferdigital.cloud/webhook/bot-admin`) con el payload:
      ```json
      {
        "evento": "BOT_APAGADO",
        "empresaId": "6a9a503000746b35867cddaf",
        "numeroHumano": "51916382742",
        "numerosClientes": ["51987654321", "51912345678"],
        "fecha": "2026-09-21T..."
      }
      ```
- **`PublicStoreController.cs`:**
  - `GET /api/public/store/{empresaId}`: Expone públicamente los flags `botWhatsAppActivo`, `numeroWhatsAppBot` y `numeroWhatsAppHumano` de manera anónima y ultraligera para consumo tanto de la tienda web como de n8n.
  - `GET /api/public/store/{empresaId}/bot/products`: Entrega el inventario en vivo (modelos, stock > 0, características y precios con descuento) que alimenta el prompt de Gemini.
  - `POST /api/public/store/{empresaId}/bot/orders`: Registra la venta creada por chat en estado `PENDIENTE_PAGO` con `OrigenPedido = "WhatsAppBot"` sin descontar stock preventivamente.
  - `POST /api/public/store/bot/upload-image`: Recibe comprobantes en Base64, los guarda en disco físico y retorna la URL pública.
  - `POST /api/public/store/{empresaId}/bot/orders/{orderId}/voucher`: Vincula la captura de pago al pedido mediante `$push` en MongoDB.

##### C. Frontend Administrativo (Vue 3 / Vite)
- **`Dashboard.vue`:**
  - Incorporación de un interruptor toggle interactivo en el encabezado principal con microanimaciones CSS, badges de estado en vivo (Verde Esmeralda: *BOT ACTIVO* / Ámbar Atenuado: *BOT APAGADO*) y tooltip descriptivo.
  - Bloqueo preventivo de doble clic durante la sincronización asíncrona con el backend (`isTogglingBot`).
  - Notificaciones toast claras confirmando el encendido o apagado del servicio.
- **Tienda Pública / Storefront:**
  - El botón flotante de WhatsApp lee dinámicamente `botWhatsAppActivo`. Si el bot está activo, envía al cliente al chat de Valentina; si está apagado, redirige de forma transparente al WhatsApp del asesor humano.

---

#### 3. Flujo Maestro Unificado en n8n (`Bot-Completo-LGant-n8n.json`)
Se fusionaron todos los flujos independientes en una arquitectura limpia y robusta de **4 ramas coordinadas**:

1. **Filtro de Silencio Total (Ahorro de Conversaciones Meta):**
   - **Nodo `Webhook WhatsApp`:** Recibe eventos entrantes de Meta Cloud API (`POST /webhook/whatsapp-bot`).
   - **Nodo `Extraer Mensaje`:** Parsea textos, imágenes o respuestas interactivas.
   - **Nodo `Consultar Estado Bot` (`GET /api/public/store/{empresaId}`):** Consulta en tiempo real si el bot está encendido en el SaaS.
   - **Nodo `¿Bot Encendido?` (IF):**
     - **Si está en `false`:** El flujo se detiene inmediatamente a través de una salida vacía (**Silencio Total**). No responde nada a Meta, no llama a Gemini, no genera costos y no consume el saldo de las 1,000 conversaciones gratuitas mensuales de la cuenta de WhatsApp Business.
     - **Si está en `true`:** Pasa a la clasificación de mensaje (Imagen o Texto).

2. **Atención Comercial con IA (Valentina):**
   - **Nodo `Consultar Catalogo SaaS`:** Extrae stock en vivo.
   - **Nodo `Preparar Prompt`:** Inyecta inventario y reglas de negocio estrictas (cero revelar costos internos, métodos Yape/Plin al `916 382 742`, formato JSON para `CREAR_PEDIDO`).
   - **Nodo `Cerebro IA Gemini`:**
     - **Resolución de Incidencia:** La clave de API anterior fue revocada por expiración/política de Google (`API_KEY_INVALID 400`). Se generó una clave oficial y activa en Google AI Studio (`AQ.Ab8RN6...`).
     - **Actualización de Modelo:** Migrado de `gemini-2.0-flash` (obsoleto) a `models/gemini-3.5-flash-lite`, validado con tiempos de respuesta inferiores a 1 segundo y soporte para instrucciones del sistema y respuestas estructuradas.
   - **Nodo `Es un Pedido` (IF) & `Crear Pedido en SaaS`:** Si el cliente confirma la compra, se registra la orden en MongoDB y se guarda el `orderId` en `$workflow.staticData.lastOrderId[from]`.
   - **Nodo `Responder Pedido Creado`:** Devuelve mensaje WhatsApp con el resumen de la compra y solicitud de voucher Yape/Plin.

3. **Recepción y Validación de Comprobantes Yape/Plin:**
   - **Nodo `Obtener URL de Imagen Meta` & `Descargar Imagen`:** Descarga el archivo binario desde Meta Graph API v21.0 con el token de portador.
   - **Nodo `Subir Imagen al SaaS`:** Sube la imagen a la API pública de `ventas-saas`.
   - **Nodo `Tiene pedido activo` (IF):**
     - Con pedido activo: Adjunta la imagen vía endpoint `/voucher` y confirma recepción al cliente.
     - Sin pedido activo: Pide amablemente al cliente indicar qué reloj desea antes de procesar el comprobante.

4. **Notificador Administrativo de Apagado (Handoff Automático):**
   - **Nodo `Webhook Notificaciones` (`POST /webhook/bot-admin`):** Disparado por el backend al apagar el bot.
   - **Nodo `Generar Lista`:** Separa los números de clientes con compras pendientes.
   - **Nodo `Enviar Mensaje Despedida` (Nodo Oficial de WhatsApp):** Envía un mensaje cordial avisando que el bot pausó su turno y proporciona el enlace directo al asesor humano (`wa.me/{numeroHumano}`) para una transición impecable.

---

#### 4. Análisis de Costos y Políticas de WhatsApp Cloud API
- **1,000 Conversaciones de Servicio Gratuitas al Mes:** Meta renueva mensualmente este paquete por WABA (WhatsApp Business Account).
- **Ventana de 24 Horas:** Si el cliente escribe y el bot responde, se abre una ventana de 24 horas que cuenta como 1 sola conversación, sin importar cuántos mensajes se intercambien en ese lapso.
- **Efecto de Silencio Total:** Si el bot está apagado y no emite respuesta, **Meta no descuenta ninguna conversación de la cuota gratuita**, protegiendo el saldo del negocio.

---

#### 5. Despliegue y Pruebas Realizadas
1. **Compilación y Construcción:** Backend .NET compilado con 0 errores y 0 advertencias.
2. **Despliegue en VPS Hostinger:** Imagen Docker actualizada y contenedores reiniciados vía `docker-compose up -d --build`.
3. **Validación de API Gemini:** Peticiones HTTP a `gemini-3.5-flash-lite` ejecutadas con éxito en tiempo real mediante script de verificación Node.js / cURL.
4. **Validación de Sintaxis JSON n8n:** Archivo `Bot-Completo-LGant-n8n.json` verificado programáticamente (29 nodos y 24 conexiones válidas).

---

### ¿Dónde nos quedamos? (Estado Actual y Próximos Pasos)

1. **Estado del Sistema:**
   - Backend en VPS: **En ejecución y actualizado** con los endpoints de control del bot y webhook administrativo.
   - Frontend en VPS / Vercel: **En ejecución** con botón toggle en Dashboard y redirección dinámica en tienda.
   - n8n (`n8nrelojes.helifyferdigital.cloud`): Flujo unificado `Bot-Completo-LGant-n8n.json` listo y validado para su activación.
2. **Próximas Pruebas Recomendadas:**
   - Simular una conversación de venta completa desde un teléfono cliente con el bot encendido.
   - Apagar el bot desde el panel admin y verificar que los nuevos mensajes queden en silencio sin consumir saldo.
   - Probar el envío de un comprobante de pago de prueba (Yape/Plin) y verificar su visualización en el modal de Pedidos del administrador.


## Actualización Reciente - Módulo de Chatbot Inteligente (WhatsApp + n8n)
- **Backend (C# .NET)**: Creación de modelos y controladores para `WhatsAppChat`. Se implementaron los endpoints (`/api/public/store/{empresaId}/bot/chat` y `/bot/chat-history`) para almacenar todo el flujo de mensajes entre el cliente y el bot en la colección de MongoDB `whatsapp_chats`.
- **Frontend (Vue.js)**: Implementación de la vista `WhatsAppChats.vue` en el panel de administrador para monitorear conversaciones en tiempo real. 
  - Corrección de error crítico de enrutamiento (pantalla blanca) por importación faltante de `VerifyEmail` en `router/index.js`.
  - Inyección de `dashboard-layout` y `sidebar` en la vista de chats para unificar el diseño con el resto del SaaS.
  - Limpieza de código y remoción de dependencia externa `date-fns` por funciones nativas de JS.
- **Automatización (n8n)**: 
  - Reestructuración profunda del flujo de WhatsApp para dotar al bot de "Memoria de Corto Plazo".
  - Agregado de nodos: "Guardar Mensaje Cliente", "Obtener Historial", "Mapear Historial" y "Guardar Mensaje Bot".
  - Solución de errores de formato JSON (Bad control character) al enviar respuestas dinámicas de Gemini hacia el Backend usando `JSON.stringify()` directamente en las expresiones de n8n.

## Actualización - Optimización de Métodos de Pago en Checkout (Frontend Relojes)
- **Retiro de Opción "Tarjeta" Manual (`ProcesoPago.jsx`)**:
  - Se eliminó la pestaña y el formulario manual de tarjeta de crédito/débito (número, titular, fecha y CVV).
  - Toda la recaudación por tarjeta ahora se delega de forma segura, certificada y protegida a **Mercado Pago Checkout Pro**, evitando riesgos de seguridad o fricciones en la carga de datos.
  - La rejilla de métodos de pago en el Paso 4 queda configurada de manera armónica en 3 métodos claros:
    1. **Yape / Plin** (Billeteras Digitales con QR interactivo)
    2. **Transferencia Bancaria** (BCP / Interbank con copiado de número de cuenta y CCI)
    3. **Mercado Pago** (Tarjetas de crédito/débito, saldo y cuotas)
  - Compilación verificada exitosamente en Next.js (`npm run build`).

## Actualización - Mejoras de UX/UI en Tienda y Panel SaaS (22 de Septiembre)
- **Frontend-Relojes (Tienda)**:
  - Se cambió el botón de "PAGAR CON TARJETA" por **"COMPRAR AHORA"** en las vistas de detalle de producto (`PaginaDetalleProducto.jsx`) y en el modal del producto (`ModalProducto.jsx`).
  - Al hacer clic en "COMPRAR AHORA", ahora el flujo redirige directamente al proceso de pago (`/checkout`), mejorando la conversión.
- **Frontend (Administrador SaaS)**:
  - **Arreglo del Sidebar**: Se corrigió un problema de *layout shift* (desplazamiento visual) al hacer hover sobre el menú lateral. Ahora los bloques de `.user-info` y `.nav-section-title` mantienen su altura constante mediante CSS, garantizando que los iconos no se muevan de lugar al expandir el menú.
  - **Scroll en Modal de Producto**: Se agregó un control estricto de altura (`max-height: 90vh` y `min-height: 0`) junto con `overflow-y: auto` en las columnas del inspector de productos (`.studio-details-column`), asegurando que las listas de especificaciones muy largas no queden cortadas y puedan desplazarse verticalmente.
  - **Línea de Tiempo para Estados de Pedidos**: Se rediseñó el modal de *Actualizar Estado del Pedido* en `OnlineOrders.vue`. Se reemplazó la lista básica de botones por una elegante **Línea de Tiempo (Timeline)** vertical. Ahora el usuario puede visualizar claramente el flujo lógico del pedido (Pendiente de Pago > En Preparación > Enviado > Entregado), con indicadores visuales de pasos completados (verde) y el paso actual (azul). El botón de Cancelar se separó visualmente como una acción secundaria.

## Corrección Crítica - Error 500 en Creación de Pedidos desde Bot WhatsApp (n8n)
- **Causa Raíz**: En `PublicStoreController.cs` (`SubmitBotOrder`), se estaba asignando `ClienteId = "WHATSAPP_BOT"`. Dado que el modelo `Sale.cs` define `ClienteId` con el atributo `[BsonRepresentation(BsonType.ObjectId)]`, MongoDB rechazaba la inserción arrojando `FormatException: 'WHATSAPP_BOT' is not a valid 24 digit hex string`, resultando en un error HTTP 500 hacia n8n.
- **Solución Implementada**:
  - Se modificó `ClienteId` para que sea `null` (o el `ObjectId` del cliente si su número telefónico ya existe en la colección `Clients`).
  - Se corrigió de igual modo en `SubmitOrder` para compras como invitado (`client?.Id` en lugar de `"INVITADO"`).
  - Se envolvió el método en un bloque `try/catch` con logging detallado para prevenir caídas silenciosas.
  - Compilación validada en .NET 9 sin errores.

## Definición Oficial - Métodos de Pago Exclusivos para Cobro del Bot WhatsApp
- **Yape (Únicamente Yape, NO Plin)**:
  - Número: **997 099 683**
  - Titular: **GRUPO SERCAL S.A.C.**
  - Solicitud: Captura del comprobante (foto) O número de operación de Yape.
- **Transferencia Bancaria (Cuentas Corrientes)**:
  - Titular: **GRUPO SERCAL S.A.C.**
  - **BCP**: Cta. Corriente Soles `355-7216688-0-94` | CCI `002 355 007216688094 67`
  - **Interbank**: Cta. Corriente Soles `500-3007303149` | CCI `003-500-003007303149-61`
  - Solicitud: Captura de pantalla O número de constancia/operación.
- **Canal de Asistencia Humana / Concierge**: `916 382 742` (WhatsApp oficial de soporte, NO para recibir yapeos).



## Actualizaci�n - Integraci�n de Mercado Pago y Generaci�n de Tickets POS (22 de Septiembre)
- **Backend (C# .NET)**:
  - Implementaci�n del endpoint /api/sales/generate-ticket en SalesController para permitir al vendedor generar un link de pago r�pido directamente desde el POS sin necesidad de procesar la venta al instante.
  - El sistema registra la orden en MongoDB con estado PENDIENTE_PAGO y OrigenPedido = "POS_TICKET", reservando la intenci�n de venta y tipo de comprobante (Boleta/Factura), pero **sin descontar stock** y **sin generar el correlativo de SUNAT** para evitar comprobantes vac�os si el cliente no paga.
  - Correcci�n en el Webhook de Mercado Pago (MercadoPagoController.cs): Se solucion� un bug silencioso donde el pago online cambiaba el estado a Pagado y EN_PREPARACION pero no descontaba el stock. Ahora, el Webhook **descuenta el inventario autom�ticamente** y genera el registro en StockMovements en el momento en que Mercado Pago aprueba el pago, garantizando la exactitud del inventario a cualquier hora.
  - Configuraci�n de AllowAnonymous en los m�todos de Mercado Pago para procesar ventas de invitados enviando email: null en el request de preferencias.
- **Frontend (Vue.js & Next.js)**:
  - **POS.vue**: Agregado del bot�n **"Generar Link de Pago"** en el carrito de compras. Al presionarlo, se invoca a Mercado Pago, se despliega el *Success Modal* adaptado mostrando el estado "TICKET PENDIENTE" y se brinda un recuadro azul claro destacado con el enlace y un bot�n nativo de "Copiar" para envi�rselo r�pidamente al cliente v�a WhatsApp.
  - **Tienda Virtual (PanelFiltros.jsx)**: Se mejor� la UX colapsando (cerrando) todos los acordeones de filtros por defecto al cargar la p�gina para dar un aspecto m�s limpio.
  - **Tienda Virtual (index.css & Componentes)**: Se mejor� el aspecto visual aplicando fondo blanco y texto centrado a las secciones principales del Home ("Eternidad en cada segundo", "Los m�s Vendidos", "Nuevos Ingresos").
