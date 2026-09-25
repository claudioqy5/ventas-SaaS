# BitÃƒÂ¡cora de Avances y DocumentaciÃƒÂ³n Oficial del Proyecto Ventas SaaS

> **Nota:** Este archivo contiene el historial estructurado de desarrollos, actualizaciones, endpoints e informaciÃƒÂ³n vital del negocio.

---

### Resumen de la SesiÃ³n Actual (E-commerce y Admin)

**Â¿QuÃ© hicimos reciÃ©n?**
1. **AgrupaciÃ³n Visual de Productos (Frontend PÃºblico):**
   - Modificamos el catÃ¡logo (`App.jsx`) para que los productos con el mismo `CodigoModelo` se agrupen y se muestre solo **1 tarjeta principal** por modelo.
   - En la `TarjetaProducto.jsx`, agregamos las **miniaturas (circulitos)** de cada variante de color en la parte inferior. Al hacer clic o pasar el mouse por ellas, la foto principal, el precio y el nombre cambian dinÃ¡micamente sin recargar la pÃ¡gina.
   - Replicamos este mismo selector de variantes dentro de la vista individual del producto (`PaginaDetalleProducto.jsx`) bajo la secciÃ³n *"Otras versiones disponibles"*.

2. **Mejoras en el Panel de AdministraciÃ³n (Backend y Vue):**
   - **Autocompletado MÃ¡gico:** AÃ±adimos lÃ³gica para que, al crear un producto nuevo, si escribes un "Agrupador (Modelo)" que ya existe en la base de datos, el formulario autocompleta instantÃ¡neamente la categorÃ­a, precio, descripciÃ³n y atributos (dejando el color y fotos en blanco para la nueva variante).
   - **Desbloqueo de Inventario y Arreglo Backend:** Se eliminÃ³ la restricciÃ³n del frontend que impedÃ­a editar el stock en productos ya creados, y se parchÃ³ el backend en C# (`ProductsController.cs`) para que acepte y guarde los cambios tanto del `Stock` como del `CodigoModelo` al editar.
   - **RediseÃ±o del Modal a 2 Columnas:** Transformamos la interfaz de ediciÃ³n de productos para que los campos principales estÃ©n a la izquierda y las **Especificaciones** queden fijas y siempre visibles en una elegante columna derecha. AdemÃ¡s, se aÃ±adiÃ³ la opciÃ³n "No aplica / En blanco" a los atributos para mayor flexibilidad.

**Â¿DÃ³nde nos quedamos?**
Todo el flujo de agrupaciÃ³n y las mejoras en el panel de administrador estÃ¡n terminados y funcionales. El cÃ³digo ya fue "pusheado" al repositorio maestro (GitHub/Vercel). Quedamos a la espera de verificar en el entorno de producciÃ³n que la experiencia del usuario y del administrador funcione tal y como fue diseÃ±ada.

---

### Resumen de la Nueva SesiÃ³n (IntegraciÃ³n de Variantes, AcordeÃ³n de Inventario y WhatsApp)

**Â¿QuÃ© avanzamos hoy?**

1. **CorrecciÃ³n Integral del Flujo de AgrupaciÃ³n de Modelos:**
   - **DiagnÃ³stico del problema:** Aunque la base de datos ya admitÃ­a `CodigoModelo`, en el catÃ¡logo del e-commerce (`Frontend-Relojes`) las variantes seguÃ­an mostrÃ¡ndose como tarjetas separadas. Se descubriÃ³ que el backend en C# (`FrontendRelojesController.cs` y `PublicStoreController.cs`) omitÃ­a `CodigoModelo` y `Atributos` en la proyecciÃ³n anÃ³nima JSON, y el servicio `api.js` de la tienda tampoco lo mapeaba hacia el frontend.
   - **SoluciÃ³n Backend (C# / .NET 9):** Se modificaron `FrontendRelojesController.cs` y `PublicStoreController.cs` para incluir `p.CodigoModelo` y `p.Atributos`. CompilaciÃ³n verificada con 0 errores.
   - **SoluciÃ³n Tienda (`Frontend-Relojes`):** Se actualizÃ³ `api.js` para mapear `codigoModelo`, `codigoBarras` y `atributos`.
   - **Tooltips informativos:** Se implementÃ³ en `TarjetaProducto.jsx` y `PaginaDetalleProducto.jsx` la visualizaciÃ³n del nombre del color al pasar el mouse por los circulitos de variantes.

2. **Efecto Visual Premium para el BotÃ³n de WhatsApp (`BotonWhatsApp.jsx`):**
   - Se renovÃ³ el botÃ³n flotante de WhatsApp global con efectos dinÃ¡micos sutiles y de alta gama:
     - **Halo de pulso concÃ©ntrico (`wp-pulse-halo`):** Onda expansiva suave cada 2.5s que destaca sin saturar.
     - **FlotaciÃ³n orgÃ¡nica (`wp-gentle-float`):** Movimiento de respiro vertical para darle dinamismo.
     - **Indicador "En lÃ­nea" (Live Dot):** PequeÃ±a insignia superior con punto verde palpitante de atenciÃ³n activa.
     - **PÃ­ldora interactiva Concierge:** Burbuja flotante *"Â¿Dudas? Chatea con nosotros"* con fondo translÃºcido oscuro (`backdrop-filter`), tipografÃ­a moderna y borde dorado sutil.
     - **Micro-interacciones en botones de producto:** Se aÃ±adieron efectos de hover con elevaciÃ³n elÃ¡stica y resplandor verde en `TarjetaProducto.jsx` y `PaginaDetalleProducto.jsx`.

3. **Vista JerÃ¡rquica en AcordeÃ³n para el Panel de Inventario (`Products.vue`):**
   - **Problema resuelto:** Los relojes con el mismo modelo ocupaban mÃºltiples filas idÃ©nticas en la tabla de inventario del administrador.
   - **ImplementaciÃ³n (OpciÃ³n 1 - AcordeÃ³n Master-Detail):**
     - **Fila Cabecera de Modelo:** Agrupa los relojes con el mismo `codigoModelo` en una sola fila padre con flecha `â–¸`/`â–¾`, badge `ðŸ“¦ [Modelo]`, total consolidado de variantes, mini-galerÃ­a de diales/colores, precio promedio o rango, stock total acumulado y botÃ³n de apertura.
     - **Subfilas de Variantes Indentadas:** Al desplegar el modelo, aparecen las variantes con sangrÃ­a (`â†³`), exhibiendo su SKU individual, miniatura especÃ­fica, etiqueta de color (`ðŸŽ¨ Azul`, `ðŸŽ¨ Negro`, etc.), stock particular y botones individuales de ediciÃ³n [âœ�ï¸�] y eliminaciÃ³n [ðŸ—‘ï¸�].
     - **Control de Vistas:** Se agregÃ³ un selector superior `[ ðŸ—‚ï¸� Agrupado ]` / `[ ðŸ“‹ Todo ]` para alternar entre acordeÃ³n y lista plana tradicional, junto al botÃ³n `[ â–¾ Colapsar / Expandir Todo ]`.
     - **BÃºsqueda mejorada:** La barra de bÃºsqueda ahora filtra en tiempo real por modelo y por atributo de color.
     - CompilaciÃ³n validada con Vite (0 errores).

4. **Ficha TÃ©cnica para Nuevos Registros (Serie Casio Edifice EFV-640D):**
   - Se documentaron y estructuraron los datos para el alta del modelo `EFV-640D-2AVUDF` (S/. 617.00) y sus 5 variantes de color, asegurando el uso del agrupador comÃºn `EFV-640D` para su vinculaciÃ³n automÃ¡tica en catÃ¡logo e inventario.

**Â¿DÃ³nde nos quedamos?**
Todos los cambios estÃ¡n aplicados, probados y verificados en cÃ³digo. El repositorio local estÃ¡ listo con las nuevas funcionalidades operativas tanto en el panel administrativo de Vue como en el frontend Next.js de la tienda de relojes.

---

### Resumen de la Nueva SesiÃ³n (RefactorizaciÃ³n UI Modal y Checkout Avanzado de 4 Pasos)

**Â¿QuÃ© avanzamos hoy?**

1. **RefactorizaciÃ³n de Interfaz del Panel Administrativo (`Products.vue`):**
   - **CorrecciÃ³n de botones ocultos:** Se desacoplÃ³ el Ã¡rea de contenido del modal (`tbody`/formularios) de la botonera inferior. Se les aplicÃ³ `position: sticky; bottom: 0;` con control de `overflow`, asegurando que, sin importar cuÃ¡n extenso sea el formulario de variantes, los botones "Cancelar" y "Guardar" permanezcan perpetuamente visibles en pantalla.
   - **ErradicaciÃ³n de Emojis:** Se eliminaron los emojis genÃ©ricos del cÃ³digo (por peticiÃ³n del cliente) y se integraron Ã­conos vectoriales SVG profesionales (`lucide-vue-next` y `lucide-react`) para lograr una estÃ©tica formal.
   - **Formulario Compacto de Especificaciones:** La secciÃ³n de atributos del reloj, que antes requerÃ­a mucho scroll, se reorganizÃ³ en una cuadrÃ­cula CSS lateral, colocando los selectores al costado de los tÃ­tulos para optimizar drÃ¡sticamente el espacio de la interfaz.

2. **Flujo de Pago Avanzado (Checkout de Alta Gama en `Frontend-Relojes`):**
   - **InteracciÃ³n Inteligente del BotÃ³n WhatsApp:** Se corrigiÃ³ el problema de solapamiento donde el botÃ³n flotante del Concierge tapaba la Bolsa de Compras al abrirla. Ahora el componente `BotonWhatsApp.jsx` recibe un prop `isVisible={!isCartOpen}`, ocultÃ¡ndose de forma dinÃ¡mica cuando se despliega el carrito.
   - **Nuevo Sistema Stepper Multipaso (`ProcesoPago.jsx`):**
     - Se reemplazÃ³ el redireccionamiento vacÃ­o del botÃ³n "IR A COMPRAR" hacia la ruta principal, derivÃ¡ndolo a una nueva y elegante vista deCheckout en 4 etapas.
     - **NavegaciÃ³n Interactiva:** La barra superior visualiza el estado de la compra. Los Ã­conos se iluminan con la paleta de la marca (dorado/obsidiana) y permiten dar click sobre pasos anteriores para regresar, corrigiendo o revisando el pedido sin perder la sesiÃ³n.
     - **Paso 1 (Carrito):** Exhibe una tabla analÃ­tica con las imÃ¡genes del producto, nombre, y controles interactivos `[-]/[+]` para alterar las cantidades en tiempo real. Cuenta con un "Resumen de Compra" lateral persistente y campo para Cupones.
     - **Paso 2 (Datos Personales):** Se implementÃ³ un esquema *"Guest Checkout"* (compras como invitado). Facilita una alta tasa de conversiÃ³n al no exigir la creaciÃ³n de una cuenta/contraseÃ±a, pidiendo Ãºnicamente Nombres, Correo, Celular/WhatsApp y el combo de Tipo/NÂ° de Documento (DNI/CE/RUC/Pasaporte) crucial para la facturaciÃ³n electrÃ³nica peruana.
     - **Paso 3 (Datos de Entrega):** Contiene campos limpios para organizar un "EnvÃ­o a Domicilio" (Se retirÃ³ la opciÃ³n de recojo en tienda a peticiÃ³n). Se despliegan combos nativos para el ingreso del Departamento, Provincia, Distrito, DirecciÃ³n exacta y Referencias.

3. **Decisiones ArquitectÃ³nicas (Backend):**
   - **RefactorizaciÃ³n de Modelo `Client.cs`:** Se detectÃ³ que la tabla de clientes guardaba un Ãºnico campo `Nombre`. Se tomÃ³ la decisiÃ³n arquitectÃ³nica de refactorizar la base de datos a `Nombres` y `Apellidos` por separado. Esta separaciÃ³n serÃ¡ crucial mÃ¡s adelante para:
     - FacturaciÃ³n electrÃ³nica en SUNAT.
     - Email Marketing personalizado ("Hola [Nombre]").
     - IntegraciÃ³n futura con APIs logÃ­sticas (Scharff, Olva, DHL).

**Â¿DÃ³nde nos quedamos?**
Se consolidÃ³ la estructura del Checkout en 4 etapas y se definiÃ³ la hoja de ruta para la autenticaciÃ³n de clientes y persistencia de ventas.

---

### Resumen de la Nueva SesiÃ³n (Soporte Multi-categorÃ­a, AutenticaciÃ³n E-commerce y Ventas Integradas al Admin)

**Â¿QuÃ© avanzamos hoy?**

1. **Soporte de MÃºltiples CategorÃ­as por Producto:**
   - **Backend (`Product.cs`, `ProductsController.cs`):** Se adaptÃ³ el modelo y la API para permitir que un producto pertenezca a mÃºltiples categorÃ­as simultÃ¡neamente (ejemplo: un reloj asignado a "Hombre", "Novedades" y/o "Unisex").
   - **Panel Administrativo (`Products.vue`):** Se actualizÃ³ el formulario para permitir la asignaciÃ³n y selecciÃ³n mÃºltiple de categorÃ­as para cada producto.
   - **Frontend E-commerce (`PanelFiltros.jsx`, `App.jsx`):** El catÃ¡logo ahora filtra dinÃ¡micamente sobre la colecciÃ³n de categorÃ­as del producto, garantizando que el reloj aparezca tanto al filtrar por "Hombre" como por "Novedades".

2. **Mapa Interactivo de Entregas (`DeliveryMap.jsx`):**
   - Se integrÃ³ un componente de mapa interactivo dentro del **Paso 3 (Datos de Entrega)** del checkout en `Frontend-Relojes`, permitiendo al cliente ubicar con precisiÃ³n el punto de entrega y referencias geogrÃ¡ficas.

3. **MÃ³dulo de AutenticaciÃ³n de Clientes E-commerce:**
   - **Modelo y Seguridad en Backend (`Client.cs`, `JwtProvider.cs`, `IJwtProvider.cs`):**
     - Se aÃ±adieron los campos `PasswordHash`, `IsEcommerceUser` y fecha de creaciÃ³n al modelo `Client`.
     - Se implementÃ³ la generaciÃ³n de tokens JWT dedicados para clientes con el rol/claim `ClienteEcommerce`.
   - **Controlador PÃºblico (`PublicStoreController.cs`):**
     - `POST /api/public/store/auth/register`: Registro de nuevos clientes con encriptaciÃ³n segura de contraseÃ±a.
     - `POST /api/public/store/auth/login`: AutenticaciÃ³n con validaciÃ³n de credenciales y retorno de token JWT.
     - `GET /api/public/store/my-orders`: Endpoint seguro para consultar el historial de compras del cliente autenticado.
   - **Frontend E-commerce (`ModalAuthCliente.jsx`, `App.jsx`, `api.js`):**
     - Se diseÃ±Ã³ e implementÃ³ el modal flotante con pestaÃ±as de "Iniciar SesiÃ³n" y "Crear Cuenta".
     - Persistencia de sesiÃ³n en el navegador (`localStorage` con `cliente_token` y `cliente_datos`).
     - Enlace y menÃº de usuario en la barra de navegaciÃ³n para consultar historial de pedidos o cerrar sesiÃ³n.

4. **IntegraciÃ³n Completa del Flujo de Venta (E-commerce âž” Backend âž” Panel Administrativo):**
   - **Checkout Conectado (`ProcesoPago.jsx`):**
     - IntegraciÃ³n con el endpoint de Ã³rdenes (`POST /api/public/store/orders`).
     - VinculaciÃ³n fluida: el cliente puede comprar autenticado o registrarse en el mismo proceso.
     - Pantalla de confirmaciÃ³n con cÃ³digo de pedido, desglose final y botÃ³n para volver a la tienda.
   - **Procesamiento de Venta y Kardex en Backend (`PublicStoreController.cs`):**
     - Se registra la orden directamente en la tabla de ventas `Sale` con `EstadoPago = "Pagado"`.
     - GeneraciÃ³n de Ã­tems de venta (`SaleItem`) respetando la regla de negocio de solo lectura en `Total = Cantidad * PrecioUnitario`.
     - Descuento automÃ¡tico de existencias en el inventario y creaciÃ³n del registro de auditorÃ­a en `StockMovement` (Kardex).
     - **VisualizaciÃ³n en Panel Admin:** Al guardarse como ventas estÃ¡ndar del sistema, las compras realizadas desde la tienda online aparecen de inmediato en el historial de ventas, dashboards de ingresos y reportes del Panel Administrativo de Vue sin requerir cambios invasivos en el panel.

5. **Versionamiento y Despliegue Local:**
   - Todos los cambios fueron consolidados y versionados en Git con los commits correspondientes (`2b70d83`, `fbf68ec`, etc.) y el servidor de desarrollo de Vite se mantiene operativo.

**Â¿DÃ³nde nos quedamos?**
- El flujo completo de catÃ¡logo, filtrado multi-categorÃ­a, autenticaciÃ³n de clientes, carrito, checkout y generaciÃ³n de ventas con descuento de inventario estÃ¡ 100% funcional e integrado con el backend y el panel de administraciÃ³n.
- **Pendientes para futuras fases:**
  1. IntegraciÃ³n con pasarela de pagos real (MercadoPago / Niubiz / Stripe o pasarela de QR Yape/Plin automatizada) para el Paso 4 del Checkout.
  2. RefactorizaciÃ³n a campos independientes `Nombres` y `Apellidos` en la tabla de clientes (prioritario cuando se integre facturaciÃ³n electrÃ³nica SUNAT o couriers como Olva/Scharff).

---

### ActualizaciÃ³n - 10 de Septiembre de 2026

**1. Perfil del Cliente y NavegaciÃ³n:**
- Se implementÃ³ la vista `VistaPanelCliente.jsx` para que los clientes autenticados puedan ver su historial de compras y los detalles de su cuenta de manera elegante y alineada al diseÃ±o.
- Se incorporÃ³ en `BarraNavegacion.jsx` un menÃº desplegable en el perfil del usuario (al iniciar sesiÃ³n) que redirige a las nuevas rutas (`/mis-compras` y `/mi-cuenta`), gestionadas con `window.history.pushState` y Next.js App Router para una navegaciÃ³n nativa sin recargar la pÃ¡gina.
- Se eliminaron colores predeterminados (como rosas/fucsias) para mantener una paleta coherente con la identidad visual del e-commerce (uso de `--c-gold`, `--c-obsidian`, `--c-indigo`, etc.).

**2. Mejoras en la Interfaz de Productos y Filtros:**
- **Atributos y CategorÃ­as MÃºltiples:** Se actualizÃ³ `ModalProducto.jsx` y `PaginaDetalleProducto.jsx` para mostrar correctamente mÃºltiples categorÃ­as asignadas a un producto separadas por puntos (â€¢).
- **EstÃ©tica del BotÃ³n de Pago:** El botÃ³n de Mercado Pago en la vista de detalle de producto se modificÃ³ de su clÃ¡sico azul a un estilo lujoso (fondo blanco, texto oscuro y bordes tenues) para que conviva en perfecta armonÃ­a con el diseÃ±o global de la tienda.
- **Interactividad en Filtros:** Se corrigiÃ³ un problema de deformaciÃ³n visual en `PanelFiltros.jsx` donde los nombres de atributos largos rompÃ­an el layout. Ahora toda la fila del atributo es un contenedor flexible, envolviendo texto correctamente y permitiendo seleccionar la opciÃ³n al hacer clic en cualquier parte de la lÃ­nea, no solo en la caja del checkbox.

**3. Soporte para el IDE (VS Code):**
- Se aÃ±adiÃ³ un archivo `jsconfig.json` a la raÃ­z de la carpeta `Frontend-Relojes`. Esto soluciona los problemas de falsos positivos (subrayados rojos) en la resoluciÃ³n de mÃ³dulos (como `lucide-react` y rutas relativas a `../services/api`) cuando el editor se abre desde la carpeta contenedora (`ventas-saas`).

**4. CorrecciÃ³n de Crash en Modal de AutenticaciÃ³n:**
- Se corrigiÃ³ un error de variable no definida (`ReferenceError: password is not defined`) en `ModalAuthCliente.jsx`. Este error provocaba que Next.js arrojara una pantalla de colapso ("This page couldn't load") cada vez que un usuario no autenticado intentaba abrir el modal de login/registro desde el Ã­cono de perfil en el header.

**5. EliminaciÃ³n Total de Colores Rosados/Fucsias (Paleta de Lujo):**
- Se realizÃ³ una auditorÃ­a y limpieza de estilos en `BarraNavegacion.jsx` y `ModalAuthCliente.jsx`:
  - **Ã�conos del dropdown de usuario:** Cambiados de `#ff007f` al tono corporativo `var(--c-deep-purple)`.
  - **Efectos Hover en botones:** Cambiados de rosa claro (`#fff0f7`) a un fondo neutro elegante (`#f5f5f7`).
  - **BotÃ³n "Cerrar sesiÃ³n":** Se reemplazÃ³ el fucsia brillante por `var(--c-obsidian)` con hover en `var(--c-deep-purple)` y sombras sutiles.
  - **Modal de cuenta y login:** Se sustituyeron los elementos residuales en fucsia por el dorado oficial (`var(--c-gold)`) y negro obsidian, asegurando 100% de coherencia visual con la identidad de marca del e-commerce.

**Estado Actual:**
El sistema compila sin advertencias ni errores. La navegaciÃ³n de rutas entre el catÃ¡logo, `/mis-compras`, `/mi-cuenta`, detalle de producto y checkout opera fluidamente sin recargas de pÃ¡gina, y la estÃ©tica visual cumple con los estÃ¡ndares de diseÃ±o de lujo requeridos.

---

### ActualizaciÃ³n - 11 de Septiembre de 2026

**1. MÃ³dulo de Pedidos Web (Panel de Administrador):**
- Se creÃ³ una secciÃ³n completamente nueva llamada **"Pedidos Web"** dedicada exclusivamente a la gestiÃ³n de las compras provenientes de la tienda online.
- Los pedidos online ahora tienen un **ciclo de vida definido**: *Pendiente de Pago, En PreparaciÃ³n, Enviado, Entregado y Cancelado*.
- **Contabilidad Inteligente**: Cuando un pedido web ingresa (Pendiente de Pago), **no distorsiona las mÃ©tricas** (no suma al Dashboard ni al Historial de Ventas). El dinero solo se registra oficialmente en las finanzas cuando el administrador cambia el estado a *En PreparaciÃ³n* confirmando la recepciÃ³n del pago.
- Si un pedido se cancela, el sistema **restaura automÃ¡ticamente el stock** al inventario y genera un registro de movimiento correspondiente.

**2. Trazabilidad para el Cliente (Tienda Web):**
- Se diseÃ±Ã³ e integrÃ³ un **Stepper Interactivo (LÃ­nea de tiempo)** en el perfil web del cliente (`VistaPanelCliente.jsx`).
- Ahora los clientes pueden ver el progreso visual y elegante de su compra desde su panel (*Pendiente âž” PreparaciÃ³n âž” Enviado âž” Entregado*).
- Se destacÃ³ el **NÃºmero de Seguimiento** (Tracking) en caso de que el pedido haya sido despachado, mejorando la experiencia post-venta.

**3. Sistema de Permisos Avanzado y Seguridad:**
- Se desacoplÃ³ la gestiÃ³n de pedidos web del mÃ³dulo de ventas creando un nuevo permiso oficial llamado **`ðŸŒ� Pedidos Web`** (`pedidos_web`).
- Esto permite que el dueÃ±o del negocio asigne permisos exclusivamente de despachos y atenciÃ³n al cliente a ciertos empleados sin exponer las ganancias totales ni las ventas fÃ­sicas.
- **EdiciÃ³n de Administradores de Negocio (SaaS):** Se modificÃ³ el Backend (`AuthController.cs`) y Frontend (`Users.vue`) para permitir que el **SÃºper Administrador** pueda editar completamente los perfiles de los dueÃ±os de negocios (`EmpresaOwner`). Ahora se puede modificar su nombre, correo, desactivar su acceso, y asignarle o retirarle mÃ³dulos/funcionalidades especÃ­ficas libremente.

**4. VisualizaciÃ³n en Sidebar de Vistas Administrativas:**
- Se actualizÃ³ el menÃº lateral (`Sidebar`) en 14 vistas administrativas de la aplicaciÃ³n en Vue (`Frontend/src/views/*.vue`) para asegurar que el acceso a **"Pedidos Web"** estÃ© siempre visible y disponible cuando el usuario tenga los permisos correspondientes.
- Se depurÃ³ la sincronizaciÃ³n de permisos entre el Frontend (`auth.js`) y el Backend (`UserContext.cs`) garantizando que los dueÃ±os de negocio (`EmpresaOwner`) reciban correctamente el permiso de `pedidos_web` por defecto.

**5. CorrecciÃ³n Integral de Fallos (Checkout e Inventario):**
- **SoluciÃ³n al "Pantallazo Negro" (Frontend-Relojes):** Se diagnosticÃ³ y corrigiÃ³ un fallo crÃ­tico en el checkout (`ProcesoPago.jsx`). Al finalizar exitosamente una orden, el sistema intentaba renderizar variables de estado no declaradas (`accountCreated`, `accountPassword`) para la secciÃ³n de creaciÃ³n de cuenta post-compra, lo cual colapsaba la vista de React generando una pantalla negra de error. Se inicializaron correctamente, restaurando la pantalla de celebraciÃ³n (confeti y resumen de la orden). El vaciado automÃ¡tico del carrito ahora funciona a la perfecciÃ³n ya que el renderizado culmina con Ã©xito.
- **DeducciÃ³n Correcta de Inventario (Backend):** Se corrigiÃ³ una vulnerabilidad lÃ³gica en el ciclo de vida del pedido online. Anteriormente el stock se descontaba prematuramente al momento de crear la orden en estado **Pendiente de Pago** (`PublicStoreController.cs`). Se eliminÃ³ esta lÃ³gica y se reubicÃ³ en `SalesController.cs`: ahora el sistema **solo descuenta el stock** cuando el administrador manipula el pedido y lo transiciona a un estado confirmado (ej. `En PreparaciÃ³n`). De igual forma, si un pedido se cancela, el stock solo se repone si el pedido provenÃ­a de un estado previamente confirmado.

---

### ActualizaciÃ³n - 12 de Septiembre de 2026

**1. IntegraciÃ³n del CÃ³digo QR Oficial de Yape (Paso 4 - Pasarela de Pago):**
- **Activo Oficial Integrado:** Se importÃ³ e integrÃ³ el flyer oficial de Yape a `Frontend-Relojes/public/qr-yape.png`.
- **DiseÃ±o de Pasarela de Pagos (`ProcesoPago.jsx`):**
  - Se sustituyÃ³ el marcador de posiciÃ³n SVG genÃ©rico (`LuxuryQRCode`) por la tarjeta oficial con la imagen del QR de Yape, optimizando el peso del cÃ³digo.
  - PresentaciÃ³n visual estilizada con el color institucional pÃºrpura de Yape (`#742284`), bordes dorados tenues (`rgba(212, 175, 55, 0.35)`), insignia de verificaciÃ³n y sombras suaves.
  - **Titular Oficial Verificado:** Vinculado a **Grupo Sercal S.a.c.**
  - **NÃºmero por Defecto:** Configurado como **`999 999 999`** con botÃ³n interactivo de un clic para copiar al portapapeles (copia `999999999` y muestra check verde de confirmaciÃ³n).
  - **Flujo de Pago Transparente:** Monto dinÃ¡mico en vivo en Soles (`S/.`), campo para ingresar el *NÃºmero de OperaciÃ³n o Referencia* del voucher y coordinaciÃ³n directa post-pago vÃ­a WhatsApp con el pedido generado.

**2. RefactorizaciÃ³n de la Experiencia de AutenticaciÃ³n de Clientes (Login VIP):**
- **DiagnÃ³stico y CorrecciÃ³n de UX:** Se identificÃ³ que al iniciar sesiÃ³n, el modal `ModalAuthCliente.jsx` sufrÃ­a una transiciÃ³n tosca donde se forzaba la visualizaciÃ³n de la ficha de cliente VIP comprimida dentro del mismo modal, coronada por una franja negra fija (`backgroundColor: 'var(--c-indigo)'`) que tapaba la pantalla y estorbaba la navegaciÃ³n del comprador.
- **Cierre InstantÃ¡neo de Modal:** Al validar exitosamente las credenciales en `ModalAuthCliente.jsx`, el modal se cierra de forma inmediata (`onClose()`) y sin demoras artificiales, devolviendo al usuario al flujo de compra o navegaciÃ³n sin fricciones.
- **EliminaciÃ³n Total de la Barra Negra:** Se retirÃ³ permanentemente el banner superior tosco que obstaculizaba la vista.
- **Nuevo Componente `ToastBienvenidaCliente.jsx`:**
  - Componente flotante de alta gama posicionado estratÃ©gicamente en la esquina superior derecha (`top: 85px, right: 30px`), alineado con la estÃ©tica de alta relojerÃ­a de L'GANT.
  - **Monograma VIP de Lujo:** Avatar circular obsidiana con tipografÃ­a serif dorada que exhibe la inicial del cliente, acompaÃ±ado de un punto verde de verificaciÃ³n activa en tiempo real.
  - **Acentos Dorados y Glassmorphism:** Fondo blanco limpio con lÃ­nea superior de acento dorado en gradiente (`#d4af37`), bordes sutiles y sombra difusa.
  - **Saludo Personalizado:** *"Â¡Bienvenido, [Nombre]! - SesiÃ³n VIP iniciada correctamente"*.
  - **Desvanecimiento Suave:** Temporizador automÃ¡tico de cierre a los 4.5 segundos o descarte manual mediante botÃ³n `âœ•`.
- **IntegraciÃ³n Global (`App.jsx`):**
  - Control de estado reactivo mediante `welcomeUser`, disparÃ¡ndose de inmediato tras la respuesta exitosa del servidor.
  - Desacoplamiento de vistas: El acceso a la gestiÃ³n de datos personales y seguimiento de pedidos queda 100% canalizado a travÃ©s del menÃº de usuario en la barra de navegaciÃ³n hacia la vista completa dedicada `VistaPanelCliente.jsx` (`/mis-compras` y `/mi-cuenta`).

**3. Nueva Vista Completa y URL Dedicada para Pedido Confirmado (`/pedido-confirmado`):**
- **EliminaciÃ³n Total de Modales / Cards Flotantes:** Se retirÃ³ por completo la ventana emergente flotante con fondo oscuro en el checkout que bloqueaba la pantalla del usuario.
- **Ruta Oficial en Next.js App Router (`src/app/pedido-confirmado/page.jsx`):** Ahora al culminar una compra, el navegador actualiza la URL a `/pedido-confirmado` de manera nativa y fluida como las demÃ¡s secciones (`/mis-compras`, `/mi-cuenta`, etc.).
- **Nuevo Componente `VistaPedidoConfirmado.jsx`:**
  - **Experiencia de Alta RelojerÃ­a a Pantalla Completa:** Vista amplia integrada con la barra de navegaciÃ³n superior y pie de pÃ¡gina de L'gant.
  - **Hero Banner de CelebraciÃ³n:** Sello de garantÃ­a dorado con `CheckCircle2` y `Award`, saludo personalizado *"Â¡Gracias por tu compra, [Nombre]!"*, y cÃ³digo de pedido con botÃ³n interactivo de 1-clic para copiar al portapapeles.
  - **Desglose Exhaustivo de Productos Adquiridos:** Tabla de relojes con miniaturas, marca/modelo, color, cantidad, precio unitario y total, acompaÃ±ada del desglose financiero (subtotal, envÃ­o asegurado gratis y total abonado).
  - **Bloques Detallados de Entrega y Pago:** Destinatario, DNI, direcciÃ³n exacta, distrito/provincia/departamento, comprobante fiscal (Boleta o Factura con RUC), mÃ©todo de pago (Yape/Plin/Tarjeta/Transferencia) y referencia de voucher.
  - **Acciones y Trazabilidad:** BotÃ³n destacado de WhatsApp con mensaje automÃ¡tico enriquecido, acceso directo a "Ver Mis Compras" para tracking y "Volver a la Tienda".
  - **GarantÃ­as y Compromiso L'gant:** Bloque de valor con 100% Autenticidad Garantizada, Custodia y Empaque Blindado, y AtenciÃ³n Concierge.
  - **Persistencia de SesiÃ³n:** Soporta recargas (F5) recuperando la orden desde `sessionStorage` sin perder la informaciÃ³n.
- **CompilaciÃ³n Validada:** Verificada con Next.js 16 (`npm run build`) generando la ruta estÃ¡tica `â—‹ /pedido-confirmado` con 0 errores y 0 fallos de linting.

**4. RediseÃ±o del Hero: TipografÃ­a Gigante y Minimalista (InspiraciÃ³n Editorial Eindhoven / "ELEGANTE EN CADA SEGUNDO"):**
- **EliminaciÃ³n Total de Cajas, Bordes y Botones de Juego:** Se erradicaron por completo los bordes de celda, fondos de azulejo, botones de pÃ­ldora y elementos de crucigrama tipo juego.
- **Estilo Editorial Suizo de Letras Gigantes:**
  - Letras masivas en peso ultra-bold 900 (`Montserrat` / `Plus Jakarta Sans`) en negro puro `#0b0b0c`, directamente sobre el lienzo blanco sin marcos ni cajas.
  - Tracking cerrado (`-0.04em`) y proporciones arquitectÃ³nicas de alto impacto visual inspiradas en el diseÃ±o de Eindhoven Design District.
- **Estructura Exacta del Diagrama del Cliente (7 filas x 8 columnas):**
  - Horizontal: `E - L - E - G - A - N - T - E`
  - Vertical 1 (en la 2da 'E'): `E` âž” `N` formando `"EN"`
  - Vertical 2 (en la 'A'): `C` âž” `A` âž” `D` âž” `A` formando `"CADA"`
  - Vertical 3 (en la Ãºltima 'E'): `S` âž” `E` âž” `G` âž” `U` âž” `N` âž” `D` âž” `O` formando `"SEGUNDO"`
- **ApariciÃ³n Secuencial Palabra por Palabra:**
  - Se revelan progresivamente en orden de lectura: *ELEGANTE* âž” *EN* âž” *CADA* âž” *SEGUNDO*.
  - Al pasar el cursor por encima de cualquier letra, la palabra completa se resalta en tono dorado mientras las demÃ¡s se atenÃºan con elegancia.
- **Escala Monumental y Reequilibrio de PosiciÃ³n (Hacia la Izquierda):**
  - Se aumentÃ³ drÃ¡sticamente el tamaÃ±o de las letras a `clamp(3.1rem, 5.4vw, 5.2rem)` y celdas de hasta `68px x 74px`.
  - Se ampliÃ³ el ancho del contenedor de texto al `60%` (`maxWidth: 780px`) y se anclÃ³ a la izquierda con padding fluido, separando la columna derecha (`SEGUNDO`) del borde del reloj.
  - Se aplicÃ³ una mÃ¡scara difuminada suave (`maskImage`) en la galerÃ­a de relojes para que el titanio del reloj emerja orgÃ¡nicamente sin colisionar con la tipografÃ­a.
- **CompilaciÃ³n Validada:** `npm run build` en Next.js 16 completado con cÃ³digo 0 y 0 errores.

**5. ExpansiÃ³n Monumental del Crucigrama y Efecto Bicolor (*Split-Color* sobre Imagen):**
- **OcupaciÃ³n Total de la Mitad Izquierda:**
  - Se configurÃ³ la cuadrÃ­cula a `repeat(8, 1fr)` con ancho al 100% (`maxWidth: 820px`), distribuyendo las 8 columnas uniformemente para que la palabra horizontal `ELEGANTE` ocupe generosamente todo el espacio disponible en su mitad izquierda.
  - Se calibraron los tamaÃ±os tipogrÃ¡ficos a `clamp(2.4rem, 5.6vw, 5.8rem)` y alturas de fila hasta `84px`.
- **Restablecimiento de la GalerÃ­a al 50% Exacto:**
  - En `Inicio.jsx`, la galerÃ­a de relojes regresÃ³ a su proporciÃ³n original de mitad de pantalla (`width: 50%`, anclada a la derecha).
  - Se retirÃ³ la mÃ¡scara difuminada lechosa para recuperar el contraste fotogrÃ¡fico nÃ­tido y lujoso de los relojes.
- **Efecto de TipografÃ­a Bicolor (*Split-Color* de Alta Gama):**
  - ImplementaciÃ³n de un sistema de renderizado de doble capa con recorte vectorial matemÃ¡tico (`clipPath` con `inset` dinÃ¡mico calculado al 50% del viewport).
  - **Zona Blanca (Izquierda):** Letras en negro obsidiana puro (`#09090b`).
  - **Zona de Imagen (Derecha):** En cuanto las letras cruzan la mitad de la pantalla y quedan encima del reloj oscuro, cambian a **blanco puro resplandeciente (`#ffffff`)** con sutil sombra de contraste (`text-shadow`), evitando que el fondo del reloj las opaque.
  - **LÃ­nea Divisoria Bicolor:** Las letras que quedan sobre la frontera exacta se dividen limpiamente en dos colores (mitad izquierda negra, mitad derecha blanca), siguiendo fielmente la referencia grÃ¡fica provista por el cliente.
  - **Hover DinÃ¡mico:** Resaltado coordinado en oro (`var(--c-gold)`) en el lado claro y oro champÃ¡n luminoso (`#fbf4dc`) en el lado oscuro.
  - **Compatibilidad MÃ³vil:** En resoluciones mÃ³viles (`<= 991px`), el sistema conmuta automÃ¡ticamente para mostrar la tipografÃ­a completa en negro obsidiana sobre el fondo claro.
- **CompilaciÃ³n y Despliegue:** Verificado con `npm run build` (0 errores) y confirmado en Git (`origin/master`).

**6. ReconfiguraciÃ³n ArquitectÃ³nica a Matriz 7x9 y Letras Rotadas a 90Â° (DiseÃ±o Editorial Exacto):**
- **Estructura de CuadrÃ­cula 7 Filas x 9 Columnas:**
  - **Fila 0:** Palabra horizontal `"ELEGANTE"` que abarca de Col 0 a Col 7 (orientaciÃ³n horizontal convencional en Col 0-6).
  - **Columna 7 (DirecciÃ³n Vertical Rotada 90Â° Horario):**
    - `E` (Fila 0): IntersecciÃ³n con `ELEGANTE` y punto de partida de `EN`, con rotaciÃ³n a 90Â° en sentido horario.
    - `N` (Fila 1): Con rotaciÃ³n a 90Â°, completando `"EN"`.
    - **Fila 2:** Fila vacÃ­a de respiro arquitectÃ³nico y espaciado editorial.
    - `C` (Fila 3): Con rotaciÃ³n a 90Â°, inicio de `"CADA"`.
    - `A` (Fila 4): Con rotaciÃ³n a 90Â°.
    - `D` (Fila 5): Con rotaciÃ³n a 90Â°, intersecciÃ³n con `"SEGUNDO"`.
    - `A` (Fila 6): Con rotaciÃ³n a 90Â°, final de `"CADA"`.
  - **Fila 5 (DirecciÃ³n Horizontal):**
    - Palabra `"SEGUNDO"` que se despliega horizontalmente de Col 2 a Col 8 (`S`, `E`, `G`, `U`, `N`, `D`, `O`), ubicando `S` alineado bajo la segunda `E` de `ELEGANTE`, intersectando en la `D` rotada de Col 7 y rematando con la `O` en Col 8.
- **Secuencia de AnimaciÃ³n OrgÃ¡nica:**
  - `ELEGANTE` (Fila 0) âž” `EN` (Col 7) âž” `CADA` (Col 7) âž” `SEGUNDO` (Fila 5).
- **IntegraciÃ³n con Split-Color:** La columna 7 y columna 8 que penetran en el 50% derecho continÃºan beneficiÃ¡ndose del efecto bicolor automÃ¡tico (negro sobre blanco, blanco luminoso sobre el reloj oscuro).
- **CompilaciÃ³n Validada:** `npm run build` completado exitosamente (cÃ³digo 0). Guardado y sincronizado en `origin/master`.

**7. Motor de BÃºsqueda Inteligente Multi-TÃ©rmino y Enrutamiento Dedicado (`/buscar?q=...`):**
- **Motor de BÃºsqueda Inteligente AgnÃ³stico al Orden (`src/utils/searchEngine.js`):**
  - **Independencia del Orden de Palabras:** Si un producto se titula `"Reloj Rosado"`, la bÃºsqueda de `"rosado reloj"` o cualquier combinaciÃ³n de palabras lo encuentra de inmediato mediante tokenizaciÃ³n (`split(/\s+/)`) y evaluaciÃ³n conjuntiva (`tokens.every(...)`).
  - **NormalizaciÃ³n DiacrÃ­tica y FonÃ©tica:** Uso de `normalizeText` con descomposiciÃ³n canÃ³nica (`normalize('NFD')`) para eliminar tildes y diacrÃ­ticos (ejemplo: `"cronÃ³grafo"` coincide con `"cronografo"`, `"automÃ¡tico"` con `"automatico"`).
  - **Tolerancia MorfolÃ³gica Singular/Plural:** `getWordVariants` mapea automÃ¡ticamente variantes en espaÃ±ol (`"relojes"` âž” `"reloj"`, `"correas"` âž” `"correa"`).
  - **IndexaciÃ³n Profunda Multicampo:** El corpus de bÃºsqueda de cada producto comprende: nombre del modelo, descripciÃ³n detallada, marca, categorÃ­a principal, categorÃ­as secundarias, cÃ³digo SKU / modelo y atributos dinÃ¡micos (color, material, correa, calibre, resistencia al agua).
  - **Ranking de Relevancia Ponderado (`score`):** Los productos con coincidencias exactas o en el tÃ­tulo/marca reciben una puntuaciÃ³n superior, priorizÃ¡ndolos en la presentaciÃ³n sobre coincidencias en atributos secundarios.
  - **Tolerancia a Errores TipogrÃ¡ficos (Fuzzy Search Levenshtein):** Capacidad de recuperaciÃ³n ante pequeÃ±os fallos tipogrÃ¡ficos en palabras de mÃ¡s de 4 caracteres.
- **Ruta de Servidor Dedicada en Next.js App Router (`src/app/buscar/page.jsx`):**
  - CreaciÃ³n de la ruta independiente `Æ’ /buscar?q=...` con metadatos dinÃ¡micos SEO y OpenGraph (`title: BÃºsqueda: ... | L'gant Haute Horlogerie`).
  - Permite acceso directo, enlaces compartibles y recarga de pÃ¡gina (`F5`), renderizando el catÃ¡logo con el tÃ©rmino pre-filtrado.
  - SincronizaciÃ³n bidireccional con el historial del navegador (`window.history.pushState` y evento `popstate`) para navegar con los botones "AtrÃ¡s" y "Adelante" sin recargas innecesarias.
- **Barra de NavegaciÃ³n y Dropdown Predictivo Flotante (`BarraNavegacion.jsx`):**
  - **Dropdown de Autocompletado de Lujo:** Mientras el usuario escribe, se despliega una ventana flotante con las mejores 5 coincidencias inmediatas mostrando miniatura del reloj, marca, nombre y precio formateado en soles.
  - **AcciÃ³n RÃ¡pida:** Clic en un resultado abre directamente la vista de detalle del producto (`/producto/[id]`), o presionar `Enter` / clic en la lupa / botÃ³n *"Ver todos los resultados"* navega a `/buscar?q=...`.
- **IntegraciÃ³n en CatÃ¡logo General (`App.jsx`):**
  - El encabezado del catÃ¡logo conmuta a la insignia `<svg> BÃšSQUEDA INTELIGENTE`, tÃ­tulo `Resultados para: "{searchQuery}"` y contador de coincidencias exactas.
  - Ocultamiento automÃ¡tico del Hero durante la bÃºsqueda para enfocar al cliente de inmediato en los productos encontrados.
  - Estado vacÃ­o enriquecido en caso de no hallar piezas, con sugerencias de tÃ©rminos y botÃ³n de restauraciÃ³n a la colecciÃ³n completa.
- **ValidaciÃ³n y CompilaciÃ³n:** `npm run build` en Next.js 16 ejecutado con cÃ³digo 0 y 0 errores; ruta `Æ’ /buscar` verificada y compilada. Guardado y sincronizado en `origin/master`.

---

**8. IntegraciÃ³n Oficial de Pasarela de Pagos Mercado Pago Checkout Pro (Backend ASP.NET Core .NET 9 + Frontend-Relojes Next.js):**

- **Arquitectura de la IntegraciÃ³n:**
  - **Requerimiento:** Integrar Mercado Pago Checkout Pro para que los clientes de la tienda de alta relojerÃ­a puedan pagar sus compras online con tarjeta de crÃ©dito, dÃ©bito (BCP, BBVA, Interbank, etc.), efectivo o saldo de Mercado Pago, y que los fondos ingresen directamente a la cuenta del titular del negocio.
  - **Esquema de Flujo:**
    1. El cliente arma su carrito y avanza en el checkout de 4 pasos.
    2. En el paso 4 (MÃ©todos de Pago), se habilita la 5ta opciÃ³n oficial: **Mercado Pago** (con distintivo visual azul `#009ee3` e iconografÃ­a oficial).
    3. Al hacer clic en *"Confirmar Compra"*, se registra primero la orden en MongoDB con estado `EstadoPago = "PENDIENTE_PAGO"` y `EstadoOrden = "PENDIENTE_PAGO"`.
    4. El frontend invoca al backend para crear la **Preferencia de Pago** en Mercado Pago (`createMercadoPagoPreference`).
    5. El backend responde con el `preferenceId` y los enlaces de checkout (`initPoint` y `sandboxInitPoint`).
    6. El navegador redirige al cliente a la pasarela segura de Mercado Pago.
    7. Al completarse el pago, el Webhook de Mercado Pago notifica al backend en tiempo real, actualizando la orden a `EstadoPago = "Pagado"` y `EstadoOrden = "EN_PREPARACION"`, mientras el cliente es redirigido a `/pedido-confirmado`.

- **Componentes Implementados en Backend (`Backend/`):**
  - **InstalaciÃ³n de Dependencia:** `mercadopago-sdk` v3.7.0 instalado vÃ­a NuGet en `Backend.csproj` (versiÃ³n oficial compatible con .NET 9).
  - **ConfiguraciÃ³n Segura (`appsettings.json`):**
    ```json
    "MercadoPago": {
      "AccessToken": "APP_USR-4612024376801510-091318-0fc0afcc8f486444f6d6f4391ee4a8fb-3688279260",
      "PublicKey": "APP_USR-2715e18b-bd69-497c-bac4-11af7047a2b3"
    }
    ```
  - **Controlador API (`Backend/Controllers/MercadoPagoController.cs`):**
    - `POST /api/mercadopago/{empresaId}/preference`: Valida autenticaciÃ³n del cliente JWT, construye los Ã­tems con moneda peruana (`CurrencyId = "PEN"`), URLs de retorno automÃ¡ticas (`AutoReturn = "approved"`, `BackUrls.Success`, `BackUrls.Failure`, `BackUrls.Pending`), `NotificationUrl` para webhooks y `ExternalReference = orderId`.
    - `POST /api/mercadopago/{empresaId}/webhook` (anÃ³nimo con `[AllowAnonymous]`): Recibe las notificaciones IPN/Webhooks de Mercado Pago, consulta el estado del pago a la API de Mercado Pago (`PaymentClient.GetAsync(paymentId)`), y cuando `Status == "approved"`, actualiza la venta en MongoDB automÃ¡ticamente.
  - **CompilaciÃ³n Exitosa:** `dotnet build Backend.csproj` completado con 0 errores.

- **Componentes Implementados en Frontend (`Frontend-Relojes/`):**
  - **Servicio API (`src/services/api.js`):**
    - FunciÃ³n exportada `createMercadoPagoPreference(token, { orderId, items })` que consume el endpoint `/api/mercadopago/{empresaId}/preference`.
  - **Flujo de Pago (`src/components/ProcesoPago.jsx`):**
    - PestaÃ±a de pago nÃºmero 5 integrada en la rejilla de mÃ©todos (despuÃ©s de Contra Entrega) con colores y badge MP.
    - Panel informativo detallado (Vista 5) mostrando tarjetas aceptadas (Visa, Mastercard, Amex, Billetera MP, cuotas) y sello de seguridad cifrada.
    - Manejador de compra `handleFinalizarCompra`: Detecta `paymentMethod === 'mercadopago'`, genera la preferencia y realiza la redirecciÃ³n.

- **DiagnÃ³stico y Hallazgos Clave de las Pruebas de Sandbox:**
  - **Comportamiento del Sandbox en Checkout Pro:** Mercado Pago aplica restricciones sumamente estrictas en modo Sandbox (errores como *"Una de las partes con la que intentas hacer el pago es de prueba"*, bloqueo del botÃ³n Pagar al faltar o diferir el correo del pagador, y fallas internas en la API de Mercado Pago al crear usuarios de prueba).
  - **DeterminaciÃ³n TÃ©cnica:** Mercado Pago **NO exige** completar pruebas en Sandbox para activar la pasarela o comenzar a operar. Las credenciales configuradas (`APP_USR-...`) ya son credenciales operativas de producciÃ³n.
  - **Estrategia Acordada:** Pasar a **ProducciÃ³n Real**, eliminando todas las trabas artificiales del Sandbox y permitiendo pagos reales con cualquier tarjeta bancaria (BCP, BBVA, Interbank, etc.).

- **Hoja de Ruta para Continuar MaÃ±ana:**
  1. En `Backend/Controllers/MercadoPagoController.cs`: Asegurar que el objeto `Payer` envÃ­e `Email = client.Correo` para que el cliente reciba su comprobante de pago oficial de Mercado Pago.
  2. En `Frontend-Relojes/src/components/ProcesoPago.jsx`: Configurar la redirecciÃ³n a `const checkoutUrl = mpRes.initPoint` (pasarela oficial `www.mercadopago.com.pe`).
  3. Realizar `git add .`, `git commit` y `git push origin master` para que el VPS despliegue la versiÃ³n de producciÃ³n.
  4. Realizar una prueba controlada en vivo de bajo monto (S/ 1.00 o S/ 2.00) con tarjeta real:
     - Comprobar que la pasarela abra limpiamente.
     - Confirmar que el pago se apruebe en segundos.
     - Verificar que el dinero ingrese a la cuenta de Mercado Pago del cliente.
     - Verificar que el webhook actualice la orden a *"En preparaciÃ³n"*.
     - Ejecutar el reembolso inmediato del S/ 1.00 desde el panel de Mercado Pago (*"Devolver dinero"*).

---

### ActualizaciÃ³n - 15 de Septiembre de 2026

**1. Correcciones de Interfaz y UX (Dashboard y Panel Administrativo):**
- **Pedidos Web (`OnlineOrders.vue`):** Se resolviÃ³ el inconveniente de deformaciÃ³n donde los botones de filtro rÃ¡pido de fechas (Hoy, 7D, Este Mes) y el buscador de clientes quedaban en filas separadas y con anchos desproporcionados. Se unificaron en una sola lÃ­nea horizontal compacta (`flex`, `align-items: center`, `gap`) con anchos controlados y comportamiento responsivo.
- **Barra Lateral / Sidebar (`style.css`):** Se corrigiÃ³ el desplazamiento visual involuntario (*layout shift*) que ocurrÃ­a durante la transiciÃ³n de apertura y cierre del menÃº lateral. Se fijÃ³ un ancho y alineaciÃ³n permanente para que los Ã­conos y textos mantengan su posiciÃ³n exacta sin brincos visuales.

**2. Sistema de Seguridad: VerificaciÃ³n de Cuentas por Correo ElectrÃ³nico (Flujo Antifraude):**
- **Objetivo:** Evitar que se registren cuentas con correos falsos o inventados, impidiendo el inicio de sesiÃ³n hasta que el usuario demuestre la titularidad de su correo haciendo clic en un enlace de activaciÃ³n (flujo estÃ¡ndar idÃ©ntico al de plataformas como `punto.pe`).
- **Backend (.NET 9 / C#):**
  - **Modelo `User.cs`:** Se agregaron los campos `CorreoVerificado` (`bool`) y `TokenVerificacion` (`string?`).
  - **Servicio `Backend/Services/EmailService.cs`:** Implementado con `System.Net.Mail.SmtpClient`. Despacha automÃ¡ticamente correos con formato HTML corporativo, mensaje de bienvenida y botÃ³n de acciÃ³n destacado: `[Verificar mi cuenta]` con enlace parametrizado (`?token=...`).
  - **Controlador `Backend/Controllers/AuthController.cs`:**
    - `POST /api/auth/registrar-empresa` y `POST /api/auth/create-user`: Crean las cuentas con `CorreoVerificado = false`, generan un token GUID seguro y disparan el correo de verificaciÃ³n al destinatario.
    - `POST /api/auth/login`: Control de acceso. Si un usuario intenta autenticarse con `CorreoVerificado == false`, se rechaza con error 401: *"Debes verificar tu correo electrÃ³nico antes de iniciar sesiÃ³n. Revisa tu bandeja de entrada."*
    - `GET /api/auth/verify-email?token=...`: Endpoint que valida el token, marca `CorreoVerificado = true`, limpia el token de un solo uso y habilita la cuenta.
    - `POST /api/auth/seed-superadmin`: El Superadministrador queda pre-verificado (`CorreoVerificado = true`) para no bloquear el acceso maestro del sistema.
  - **Plantilla de configuraciÃ³n (`Backend/appsettings.example.json`):** Estructura documentada para la secciÃ³n `SmtpSettings` (Host, Port, Email, Password, EnableSsl).
- **Frontend (Vue 3):**
  - **Vista `Frontend/src/views/VerifyEmail.vue`:** Pantalla dedicada que recibe el parÃ¡metro `token`, consulta la API de verificaciÃ³n y muestra retroalimentaciÃ³n visual (spinner de carga, estado de Ã©xito con check verde y botÃ³n *"Ir a Iniciar SesiÃ³n"*, o mensaje de error en caso de token invÃ¡lido/expirado).
  - **Rutas (`Frontend/src/router/index.js`):** Registro de la ruta pÃºblica `/verificar-correo`.
  - **GestiÃ³n de Usuarios (`Frontend/src/views/Users.vue`):** Se adecuaron los avisos para notificar al administrador que se ha enviado el correo de validaciÃ³n a la bandeja del colaborador reciÃ©n creado.
- **DevOps y Despliegue Docker:**
  - **`docker-compose.yml`:** Se aÃ±adieron las variables de entorno en el contenedor `backend` (`SmtpSettings__Host`, `SmtpSettings__Port`, `SmtpSettings__Email`, `SmtpSettings__Password`, `FrontendUrl`) mapeadas a variables del archivo `.env` del VPS, facilitando su configuraciÃ³n sin intervenir archivos internos.
  - **Control de Versiones:** Todo el cÃ³digo fue probado, compilado, commiteado (`d5e8d63`, `4ba92ed`) y subido satisfactoriamente a GitHub (`origin/master`).

**3. Estado Actual y DÃ³nde Nos Quedamos:**
- El cÃ³digo fuente estÃ¡ **100% completado, subido al repositorio y listo para producciÃ³n**.
- **ConfiguraciÃ³n en Espera:** Se acordÃ³ **NO llenar aÃºn el archivo `.env` en el VPS** debido a que todavÃ­a no se cuenta con el dominio final (`lgante.pe`) ni con el correo corporativo del negocio configurado.

**4. Tareas Pendientes / PrÃ³ximos Pasos:**
1. **AdquisiciÃ³n y ConfiguraciÃ³n de Dominio / Correo:**
   - Adquirir el dominio en `punto.pe` (`lgante.pe`).
   - Configurar el buzÃ³n de correo emisor (ej. en Hostinger: `soporte@lgante.pe` / `contacto@lgante.pe`, o temporalmente una cuenta Gmail con contraseÃ±a de aplicaciÃ³n).
2. **Carga de Credenciales en el VPS (`.env`):**
   Completar las siguientes lÃ­neas en el archivo `.env` del servidor:
   ```env
   SMTP_HOST=smtp.hostinger.com (o smtp.gmail.com)
   SMTP_PORT=465 (o 587)
   SMTP_EMAIL=tu_correo@lgante.pe
   SMTP_PASSWORD=tu_contraseÃ±a_o_clave_de_aplicacion
   FRONTEND_URL=https://www.lgante.pe
   ```
3. **ReconstrucciÃ³n y Reinicio de Contenedores en VPS:**
   Ejecutar en la consola de Hostinger:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```
4. **ValidaciÃ³n en Vivo:**
   - Registrar o crear un usuario de prueba.
   - Confirmar recepciÃ³n del correo en la bandeja de entrada.
   - Probar que el login estÃ© bloqueado antes del clic.
   - Hacer clic en el enlace/botÃ³n de activaciÃ³n y confirmar inicio de sesiÃ³n exitoso.

---

### ActualizaciÃ³n - 15 de Septiembre de 2026 (SesiÃ³n Noche: ReubicaciÃ³n de VerificaciÃ³n de Correo al E-Commerce)

**1. Desbloqueo y CorrecciÃ³n en Panel Administrativo (`ventassaas.vercel.app`):**
- **DiagnÃ³stico:** Se identificÃ³ que la verificaciÃ³n de correo por token se habÃ­a acoplado al modelo general `User` (`AuthController.cs`), bloqueando el acceso al administrador del SaaS (`relojes@ventassaas.com`) en `ventassaas.vercel.app/login` con el mensaje *"Por favor, verifica tu correo antes de ingresar"*.
- **CorrecciÃ³n en Backend (`AuthController.cs` y `User.cs`):**
  - Se eliminÃ³ la validaciÃ³n obligatoria de verificaciÃ³n de correo en el endpoint `POST /api/auth/login`.
  - El campo `CorreoVerificado` en `User.cs` quedÃ³ predeterminado en `true`, garantizando acceso instantÃ¡neo y sin trabas a dueÃ±os de negocio, administradores y empleados.
  - Se eliminÃ³ el envÃ­o involuntario de correos de activaciÃ³n en `RegisterEmpresa` y `CreateUser`.

**2. ImplementaciÃ³n Exclusiva para Clientes del E-Commerce (`Frontend-Relojes` / L'GANT):**
- **Modelo de Clientes (`Client.cs`):**
  - Se agregaron los campos `CorreoVerificado` (`bool`, por defecto `false` en nuevos registros) y `TokenVerificacion` (`string?`).
- **LÃ³gica en Backend (`PublicStoreController.cs`):**
  - En `POST /api/public/store/{empresaId}/auth/register`:
    - Al registrarse un cliente nuevo (o convertir un cliente POS existente), se le genera un token GUID criptoseguro y se despacha en segundo plano el correo corporativo VIP de L'GANT.
    - Responde con `requiresVerification = true` y mensaje amigable de confirmaciÃ³n.
  - En `POST /api/public/store/{empresaId}/auth/login`:
    - Si un cliente intenta iniciar sesiÃ³n sin haber activado su cuenta (`!CorreoVerificado && TokenVerificacion != null`), se le notifica amablemente revisar su bandeja de entrada o carpeta de spam.
    - Se respeta la retrocompatibilidad para clientes previos sin token.
  - En `GET /api/public/store/auth/verify-email?token=...`:
    - Endpoint pÃºblico que valida el token recibido, marca `CorreoVerificado = true`, remueve el token y habilita la cuenta VIP.
- **Servicio de Correos L'GANT (`EmailService.cs`):**
  - RediseÃ±o integral de la plantilla HTML con estÃ©tica de alta relojerÃ­a de L'GANT (fondos obsidiana `#0b0b0c`, acentos dorados `#d4af37`, tipografÃ­a formal y botÃ³n de acciÃ³n: *"Activar mi Cuenta VIP"*).
  - El enlace apunta directamente a la tienda online (`/verificar-correo?token=...`), no al panel del SaaS.

**3. Frontend E-Commerce (`Frontend-Relojes`):**
- **Servicio API (`src/services/api.js`):**
  - ExportaciÃ³n de la funciÃ³n `verifyCustomerEmail(token)` consumiendo el endpoint pÃºblico del backend.
- **Modal de AutenticaciÃ³n (`ModalAuthCliente.jsx`):**
  - DetecciÃ³n de `requiresVerification: true` al registrarse, conmutando automÃ¡ticamente a la vista de login y exhibiendo un banner verde de confirmaciÃ³n con instrucciones claras para revisar el correo.
- **Nueva Vista de VerificaciÃ³n (`VistaVerificarCorreo.jsx`):**
  - Componente de alta gama L'GANT con 3 estados visuales interactivos:
    1. *Cargando*: Spinner dorado y mensaje de validaciÃ³n de credenciales.
    2. *Ã‰xito*: Sello de membresÃ­a VIP activada, check verde, mensaje de felicitaciÃ³n y botÃ³n directo para *"Iniciar SesiÃ³n VIP"*.
    3. *Error*: Alerta estilizada en caso de token invÃ¡lido o expirado con botÃ³n para volver a la tienda.
- **Enrutador Next.js App Router (`src/app/verificar-correo/page.jsx` y `App.jsx`):**
  - Ruta canÃ³nica `â—‹ /verificar-correo` compilada estÃ¡ticamente en Next.js 16 con cÃ³digo 0 y 0 errores.

**Estado Actual:**
- Backend (.NET 9) y ambos Frontends (Vue y Next.js) compilan con 0 errores y 100% de coherencia arquitectÃ³nica.

**4. Comportamiento del Sidebar en Panel Admin (`Frontend/src/style.css`):**
- **DiagnÃ³stico:** Previamente se habÃ­a aplicado `position: fixed` con `margin-left: 68px` en `.main-content`. Esto provocaba que al pasar el cursor sobre el menÃº lateral y expandirse a 250px, este flotaba por encima y tapaba los primeros 182px de la pantalla (tÃ­tulos de secciÃ³n, buscador y columnas de las tablas).
- **Ajuste de Empuje DinÃ¡mico (Layout Shift Intencional):**
  - Se configurÃ³ `.sidebar` como `position: sticky; top: 0;` como elemento en el flujo del contenedor flex (`.dashboard-layout`).
  - Se eliminÃ³ el `margin-left: 68px;` fijo de `.main-content` y se agregÃ³ `min-width: 0;`.
  - Se agregÃ³ `min-width 0.3s` a la transiciÃ³n CSS de la barra lateral.
- **Efecto Visual Obtenido:** Al hacer hover sobre el sidebar, este se expande suavemente y **empuja fÃ­sicamente todo el contenido hacia la derecha** en tiempo real. Al retirar el mouse, el contenido regresa a su posiciÃ³n original sin solapamientos ni elementos ocultos.

**5. CompilaciÃ³n y Versionamiento:**
- **Backend (.NET 9):** `dotnet build Backend.csproj` completado con 0 errores.
- **Frontend Admin (Vue 3 / Vite):** `npm run build` completado exitosamente en 1.30s (cÃ³digo 0).

---

### RefactorizaciÃ³n de DiseÃ±o Minimalista y Limpieza de Identidad Visual (Frontend Relojes)
**Fecha:** Septiembre 16-17, 2026

**1. RediseÃ±o Total de la SecciÃ³n Hero (`Inicio.jsx`):**
- **Fondo Minimalista:** Se reemplazÃ³ el fondo oscuro degradado radial (`var(--c-charcoal)` a `var(--c-obsidian)`) por un fondo blanco sÃ³lido y luminoso (`#ffffff`).
- **Limpieza de Elementos GrÃ¡ficos:** Se eliminaron por completo la imagen renderizada del reloj flotante (Casio) y el recurso grÃ¡fico del "montÃ­culo de tierra" del cÃ³digo base para lograr un diseÃ±o mÃ¡s editorial.
- **Ajuste de TipografÃ­a y Contraste:** 
  - El texto gigante de fondo ("L'GANT") cambiÃ³ de blanco transparente a gris muy claro (`rgba(0,0,0, 0.04)`) para contrastar sin ser invasivo.
  - El trazado (stroke) del texto "EN CADA SEGUNDO" se cambiÃ³ a gris (`rgba(0,0,0, 0.05)`).
  - El bloque de texto informativo de "LIMITED PRE-ORDERS" pasÃ³ de blanco a negro.
- **EliminaciÃ³n de Rutas Inactivas:** Se removiÃ³ por completo la tarjeta interactiva oscura ("ARMA TU RELOJ") del hero y se eliminÃ³ toda la lÃ³gica, importaciones y rutas (`/arma-tu-reloj`) relacionadas dentro del ruteador de `App.jsx`.

**2. Limpieza de Copywriting y Tono de Marca (Global):**
- **EliminaciÃ³n del concepto "VIP":** Se ejecutÃ³ una refactorizaciÃ³n de texto a lo largo de mÃ¡s de 10 archivos del frontend (BarraNavegacion, App, VistaPanelCliente, ModalAuthCliente, CajonCarrito, PaginaDetalleProducto, ToastBienvenidaCliente, VistaPedidoConfirmado, VistaVerificarCorreo, metadatos, etc.).
  - Las etiquetas como "Cliente VIP" pasaron a ser simplemente "Cliente" o "Cuenta".
  - "Ofertas VIP" pasÃ³ a ser "OFERTA".
  - Se eliminÃ³ la palabra "VIP" de notificaciones de WhatsApp (Concierge), estados de sesiÃ³n, botones y garantÃ­as internacionales. Esto se hizo para darle a la marca un tono mÃ¡s serio, exclusivo y directo, eliminando el exceso de adjetivos.
- **EliminaciÃ³n de Badges (PÃ­ldoras) en el MenÃº:**
  - En `BarraNavegacion.jsx`, se retiraron las etiquetas (badges) de `badge: 'Nuevo'` y `badge: 'OFERTA'` junto a los menÃºs de "Novedades" y "Ofertas" para mantener un menÃº principal impecablemente limpio y de corte minimalista de lujo.
- **Frontend E-Commerce (Next.js 16):** `npm run build` completado exitosamente, generando la ruta canÃ³nica `â—‹ /verificar-correo` sin errores ni advertencias de linting.
- **SincronizaciÃ³n Git:** Cambios consolidados y subidos a `origin/master` en los commits `50f91f9`, `188e92b` y `d1ea76d`.

---

### ActualizaciÃ³n de MÃ©todos de Pago, Compra como Invitado e IntegraciÃ³n Pedidos Web
**Fecha:** Septiembre 17, 2026

**1. GestiÃ³n de Marcas en Panel Admin y Backend:**
- **Backend (.NET 9 / C#):** Creado modelo `Brand.cs` y controlador `BrandsController.cs` con soporte CRUD multi-tenant aislado por `EmpresaId`.
- **Panel Admin (Vue 3 / Vite):** Creada vista `Brands.vue` e integrada al router (`/brands`) y al menÃº de navegaciÃ³n lateral.

**2. RediseÃ±o Limpio y TipografÃ­a Refinada (Frontend Relojes):**
- **Panel de Cliente (`VistaPanelCliente.jsx`):** RediseÃ±ado con pesos de fuente sutiles (`font-serif` para tÃ­tulos), eliminando negritas pesadas y agregando el stepper horizontal de avance del pedido (*Pendiente de Pago*, *En PreparaciÃ³n*, *Enviado*, *Entregado*).
- **Tarjetas de Producto (`TarjetaProducto.jsx`):** Eliminados efectos 3D inclinados, destellos radiales y marcos dorados excesivos para lograr una presentaciÃ³n limpia y de alta relojerÃ­a.

**3. MÃ©todos de Pago Actualizados (`ProcesoPago.jsx` & `VistaPedidoConfirmado.jsx`):**
- **Retiro de Contra Entrega:** Removido por completo el mÃ©todo de pago "Contra Entrega" de las pestaÃ±as de selecciÃ³n, validaciones y vistas de confirmaciÃ³n.
- **Transferencia Bancaria:**
  - Titular oficial actualizado: **GRUPO SERCAL S.A.C.**
  - **BCP:** Cta. Corriente Soles `355-7216688-0-94` | CCI `002 355 007216688094 67`
  - **Interbank:** Cta. Corriente Soles `500-3007303149` | CCI `003-500-003007303149-61`
  - Actualizadas las funciones de copiado directo a portapapeles.

**4. Flujo de Compra como Invitado & Registro en Pedidos Web (`ProcesoPago.jsx` & `PublicStoreController.cs`):**
- **E-Commerce Checkout (`ProcesoPago.jsx`):**
  - AÃ±adido enlace de acciÃ³n limpia `Comprar como invitado ->` en el Paso 1 (Carrito), que salta directamente al Paso 4 (MÃ©todos de Pago) desactivando las validaciones obligatorias de datos personales y direcciÃ³n.
- **Backend (.NET 9 / C# - `PublicStoreController.cs`):**
  - Actualizado el endpoint `SubmitOrder` con atributo `[AllowAnonymous]` y soporte para `NombreCliente`.
  - Registra las ventas como invitado en MongoDB con `EstadoOrden = "PENDIENTE_PAGO"`, logrando que la compra **aparezca instantÃ¡neamente en la secciÃ³n de Pedidos Web (`/online-orders`) del Panel Administrativo**.
- **DerivaciÃ³n AutomÃ¡tica a WhatsApp:**
  - Al hacer clic en `FINALIZAR COMPRA` en modo invitado, se crea la orden en la BD y se genera una derivaciÃ³n automÃ¡tica a WhatsApp con la constancia del pedido (`#...`), mÃ©todo de pago, nÃºmero de operaciÃ³n y lista de productos para coordinar la entrega.

**5. VerificaciÃ³n de Compilaciones:**
- **Frontend Relojes (Next.js 16):** `npm run build` ejecutado exitosamente con 0 errores y 0 advertencias de compilaciÃ³n.

---

### ActualizaciÃ³n de NÃºmeros de AtenciÃ³n y Carrusel Hero de Alta RelojerÃ­a
**Fecha:** Septiembre 18, 2026

**1. SeparaciÃ³n CategÃ³rica de NÃºmeros TelefÃ³nicos (Yape vs. WhatsApp Concierge):**
- **SecciÃ³n de Pago con Yape (`ProcesoPago.jsx`):** Configurado oficialmente en **`997 099 683`** (Titular: *Grupo Sercal S.a.c.*) con botÃ³n interactivo de copiado rÃ¡pido (`997099683`).
- **LÃ­nea de Ventas y Concierge de WhatsApp Global:** Actualizado en todo el frontend de la tienda al nÃºmero **`916 382 742`** (`51916382742` / `+51 916 382 742`).
  - **Archivos actualizados:** `App.jsx`, `BarraNavegacion.jsx` (cinta superior), `PieDePagina.jsx`, `Beneficios.jsx`, `CajonCarrito.jsx`, `ProcesoPago.jsx` (derivaciÃ³n de compras anÃ³nimas por WhatsApp), `VistaPanelCliente.jsx`, `VistaPedidoConfirmado.jsx`, `VistaTerminosCondiciones.jsx` y metadatos SEO JSON-LD en `layout.jsx`.

**2. RediseÃ±o del Hero con Carrusel de ImÃ¡genes y Marca de Agua Vertical (`Inicio.jsx`):**
- **GalerÃ­a de Alta ResoluciÃ³n:** Se agregaron 4 imÃ¡genes representativas (`hero1.jpg`, `hero2.jpg`, `hero3.jpg`, `hero4.jpg`) almacenadas en `public/hero/` y `src/assets/hero/`.
- **Efecto Pan/Zoom Suave (GPU Accelerated):** AnimaciÃ³n CSS `@keyframes heroPanSmooth` que desplaza suavemente la imagen de izquierda a derecha a 60 FPS sin afectar la carga ni la CPU.
- **TransiciÃ³n Crossfade de 6s:** Fundido suave de opacidad (1.8s) entre diapositivas con controles laterales (`ChevronLeft`/`ChevronRight`) y barra de estado flotante (`01 / 04`).
- **PresentaciÃ³n Clara (Sin Filtros Oscuros):** Se eliminaron los overlays degradados oscuros para preservar el brillo, calidez y contraste fotogrÃ¡fico original de las piezas.
- **Marca de Agua Vertical `"L'GANT"`:** Reubicada en la franja izquierda en orientaciÃ³n de abajo hacia arriba (`rotate(-90deg)`), con tipografÃ­a de alta gama (*Cinzel*) y trazo translÃºcido.

**3. VerificaciÃ³n de Compilaciones y Despliegue:**
- **CompilaciÃ³n Next.js 16:** `npm run build` completado exitosamente con 0 errores.
- **SincronizaciÃ³n Git:** Cambios consolidados y pusheados a `origin/master`.

---

---

### Â¿DÃ³nde nos quedamos? (SesiÃ³n Anterior)

1. **Despliegue del Backend en el Servidor VPS (Hostinger):**
   Para aplicar las actualizaciones de marcas, compra anÃ³nima como invitado y correcciÃ³n de auth en el servidor de producciÃ³n:
   ```bash
   git pull origin master
   docker-compose down
   docker-compose up -d --build
   ```

2. **Pendientes de ProducciÃ³n para E-Commerce / Pagos:**
   - **Mercado Pago Checkout Pro:** Prueba en producciÃ³n real de pago con tarjeta bancaria de bajo monto y verificaciÃ³n de la notificaciÃ³n de webhook.
   - **Pruebas de Pedidos Web:** Confirmar la recepciÃ³n de pedidos web de invitados y clientes registrados en el panel admin `ventassaas.vercel.app/online-orders`.

---

### IntegraciÃ³n de Bot Asesor & Vendedor WhatsApp con IA (Gemini + n8n) y RecepciÃ³n de Comprobantes Yape/Plin
**Fecha:** Septiembre 21, 2026

**1. Arquitectura del Bot de WhatsApp Inteligente (`botn8n.md` / n8n):**
- **Cerebro Asesor con Google Gemini:**
  - Consulta en tiempo real al catÃ¡logo de MongoDB (`/api/relojes-store/productos/{empresaId}`) inyectando modelos, stock y caracterÃ­sticas actualizadas.
  - Prompt especializado como asesor comercial de alta relojerÃ­a de *L'gant* con tono profesional, conciso y directo (sin saludos reiterativos).
- **Cierre y GeneraciÃ³n de Pedidos por Chat:**
  - Gemini detecta automÃ¡ticamente la confirmaciÃ³n de compra y emite un payload estructurado JSON con la acciÃ³n `CREAR_PEDIDO`.
  - n8n registra el pedido en el SaaS y devuelve al cliente las instrucciones de pago (Yape/Plin al `916 382 742`).
  - Almacena el `orderId` temporalmente en `$workflow.staticData.lastOrderId[from]` vinculÃ¡ndolo al nÃºmero de WhatsApp del cliente.
- **Ruta de ImÃ¡genes / RecepciÃ³n de Comprobantes:**
  - Al recibir una imagen por WhatsApp, n8n obtiene la URL segura desde los servidores de Meta Graph API v21.0, la descarga, la convierte a base64 y la sube al SaaS.
  - Si el cliente tiene un pedido activo reciente, adjunta el comprobante a la orden y responde con mensaje de confirmaciÃ³n y aviso de contacto. Si no tiene orden previa, solicita amablemente que confirme el reloj a comprar.

**2. Backend (.NET 9 / C# - `PublicStoreController.cs` & `Sale.cs`):**
- **Nuevos Campos en Modelo `Sale.cs`:**
  - `OrigenPedido` (string, por defecto "TiendaVirtual", "WhatsAppBot" para ventas por chat).
  - `WhatsAppCliente` (string opcional para guardar el telÃ©fono con cÃ³digo de paÃ­s).
  - `ComprobantePagoUrls` (`List<string>` para guardar las URLs de capturas de pago).
- **Nuevos Endpoints AnÃ³nimos `[AllowAnonymous]`:**
  - `POST /api/public/store/{empresaId}/bot/orders`: Registra la venta generada por el bot con `EstadoOrden = "PENDIENTE_PAGO"`. **No descuenta stock automÃ¡ticamente** (se respeta la regla de validaciÃ³n humana previa por parte del administrador).
  - `POST /api/public/store/bot/upload-image`: Recibe la imagen en base64 desde n8n, la almacena fÃ­sicamente en `/uploads/images/` del servidor y retorna la URL pÃºblica.
  - `POST /api/public/store/{empresaId}/bot/orders/{orderId}/voucher`: Adjunta la URL de la imagen del comprobante a la orden mediante operador `$push` en MongoDB.
- **ValidaciÃ³n de CompilaciÃ³n:** CompilaciÃ³n exitosa con 0 errores y 0 advertencias (`dotnet build`).

**3. Panel Administrativo (`OnlineOrders.vue` - Vue 3 / Vite):**
- **IdentificaciÃ³n de Origen:**
  - Nueva columna "Origen" en la tabla con insignia verde brillante (`#25d366`) para pedidos de `WhatsApp`.
  - Detalle del pedido con telÃ©fono del cliente formateado y origen resaltado.
- **Visor de Comprobantes de Pago de WhatsApp:**
  - SecciÃ³n interactiva en el modal de detalle con miniaturas de fotos (`140x140px`) con borde verde y zoom al pasar el cursor.
  - Clic directo para inspeccionar el comprobante o captura de Yape/Plin en alta resoluciÃ³n.
  - Mensaje informativo de advertencia si el cliente aÃºn no adjunta su comprobante.

**4. Seguridad y GestiÃ³n de Repositorio:**
- InclusiÃ³n de `botn8n.md` en `.gitignore` para resguardar tokens de Meta y claves de API de Gemini ante la protecciÃ³n de secretos de GitHub (`GH013 - Secret Scanning & Push Protection`).
- SincronizaciÃ³n exitosa en la rama principal (`origin/master`).

---

### Control Total de Bot WhatsApp: Interruptor Admin, Silencio Inteligente, Notificaciones y MigraciÃ³n a Gemini 3.5
**Fecha:** Septiembre 21, 2026

#### 1. Resumen Ejecutivo
Se completÃ³ el ciclo integral de administraciÃ³n y gobernanza del Bot de WhatsApp para la tienda de alta relojerÃ­a *L'gant*. El sistema ahora permite al administrador encender o apagar el asistente virtual directamente desde el panel de control (`Dashboard.vue`) sin tocar n8n ni la infraestructura del servidor. AdemÃ¡s, se implementÃ³ la estrategia de **Silencio Total** para evitar costos o consumo innecesario de las 1,000 conversaciones gratuitas mensuales de Meta Cloud API, se migrÃ³ el cerebro de IA al modelo ultrarrÃ¡pido `gemini-3.5-flash-lite` con rotaciÃ³n de credenciales en Google AI Studio, y se consolidÃ³ toda la lÃ³gica en un Ãºnico flujo maestro unificado en n8n (`Bot-Completo-LGant-n8n.json`).

---

#### 2. Arquitectura y Componentes Desarrollados

##### A. Capa de Base de Datos y Modelos (.NET 9 / MongoDB)
- **Modelo `Empresa.cs`:**
  - `BotWhatsAppActivo` (bool, default: `false`): Estado operativo del bot a nivel de empresa/tenant.
  - `NumeroWhatsAppBot` (string): Identificador o nÃºmero oficial del bot configurado en Meta Cloud API (`1265104666693306` / `+51 916 382 742`).
  - `NumeroWhatsAppHumano` (string): TelÃ©fono de respaldo del personal de atenciÃ³n humana en tienda (`51916382742`).

##### B. Backend (.NET 9 / C#): Control Administrativo y Endpoints
- **`DashboardController.cs`:**
  - `GetSummary`: Incluye en el DTO de respuesta `botWhatsAppActivo` y `numeroWhatsAppHumano` para que el panel administrativo cargue el estado en tiempo real.
  - `UpdateWhatsAppBotConfig` (`PUT /api/dashboard/whatsapp-bot/config`): Permite actualizar los nÃºmeros telefÃ³nicos y el estado del bot.
  - `ToggleWhatsAppBot` (`POST /api/dashboard/whatsapp-bot/toggle`):
    - Invierte o establece el estado `BotWhatsAppActivo` de la empresa.
    - **Disparador de NotificaciÃ³n Administrativa (Handoff AutomÃ¡tico):** Si la acciÃ³n es **APAGAR** el bot (`BotWhatsAppActivo = false`), el controlador consulta en MongoDB todas las ventas activas en estado `PENDIENTE_PAGO` que tengan registrado `WhatsAppCliente`.
    - EnvÃ­a una peticiÃ³n `POST` al webhook administrativo de n8n (`https://n8nrelojes.helifyferdigital.cloud/webhook/bot-admin`) con el payload:
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
  - `GET /api/public/store/{empresaId}`: Expone pÃºblicamente los flags `botWhatsAppActivo`, `numeroWhatsAppBot` y `numeroWhatsAppHumano` de manera anÃ³nima y ultraligera para consumo tanto de la tienda web como de n8n.
  - `GET /api/public/store/{empresaId}/bot/products`: Entrega el inventario en vivo (modelos, stock > 0, caracterÃ­sticas y precios con descuento) que alimenta el prompt de Gemini.
  - `POST /api/public/store/{empresaId}/bot/orders`: Registra la venta creada por chat en estado `PENDIENTE_PAGO` con `OrigenPedido = "WhatsAppBot"` sin descontar stock preventivamente.
  - `POST /api/public/store/bot/upload-image`: Recibe comprobantes en Base64, los guarda en disco fÃ­sico y retorna la URL pÃºblica.
  - `POST /api/public/store/{empresaId}/bot/orders/{orderId}/voucher`: Vincula la captura de pago al pedido mediante `$push` en MongoDB.

##### C. Frontend Administrativo (Vue 3 / Vite)
- **`Dashboard.vue`:**
  - IncorporaciÃ³n de un interruptor toggle interactivo en el encabezado principal con microanimaciones CSS, badges de estado en vivo (Verde Esmeralda: *BOT ACTIVO* / Ã�mbar Atenuado: *BOT APAGADO*) y tooltip descriptivo.
  - Bloqueo preventivo de doble clic durante la sincronizaciÃ³n asÃ­ncrona con el backend (`isTogglingBot`).
  - Notificaciones toast claras confirmando el encendido o apagado del servicio.
- **Tienda PÃºblica / Storefront:**
  - El botÃ³n flotante de WhatsApp lee dinÃ¡micamente `botWhatsAppActivo`. Si el bot estÃ¡ activo, envÃ­a al cliente al chat de Valentina; si estÃ¡ apagado, redirige de forma transparente al WhatsApp del asesor humano.

---

#### 3. Flujo Maestro Unificado en n8n (`Bot-Completo-LGant-n8n.json`)
Se fusionaron todos los flujos independientes en una arquitectura limpia y robusta de **4 ramas coordinadas**:

1. **Filtro de Silencio Total (Ahorro de Conversaciones Meta):**
   - **Nodo `Webhook WhatsApp`:** Recibe eventos entrantes de Meta Cloud API (`POST /webhook/whatsapp-bot`).
   - **Nodo `Extraer Mensaje`:** Parsea textos, imÃ¡genes o respuestas interactivas.
   - **Nodo `Consultar Estado Bot` (`GET /api/public/store/{empresaId}`):** Consulta en tiempo real si el bot estÃ¡ encendido en el SaaS.
   - **Nodo `Â¿Bot Encendido?` (IF):**
     - **Si estÃ¡ en `false`:** El flujo se detiene inmediatamente a travÃ©s de una salida vacÃ­a (**Silencio Total**). No responde nada a Meta, no llama a Gemini, no genera costos y no consume el saldo de las 1,000 conversaciones gratuitas mensuales de la cuenta de WhatsApp Business.
     - **Si estÃ¡ en `true`:** Pasa a la clasificaciÃ³n de mensaje (Imagen o Texto).

2. **AtenciÃ³n Comercial con IA (Valentina):**
   - **Nodo `Consultar Catalogo SaaS`:** Extrae stock en vivo.
   - **Nodo `Preparar Prompt`:** Inyecta inventario y reglas de negocio estrictas (cero revelar costos internos, mÃ©todos Yape/Plin al `916 382 742`, formato JSON para `CREAR_PEDIDO`).
   - **Nodo `Cerebro IA Gemini`:**
     - **ResoluciÃ³n de Incidencia:** La clave de API anterior fue revocada por expiraciÃ³n/polÃ­tica de Google (`API_KEY_INVALID 400`). Se generÃ³ una clave oficial y activa en Google AI Studio (`AQ.Ab8RN6...`).
     - **ActualizaciÃ³n de Modelo:** Migrado de `gemini-2.0-flash` (obsoleto) a `models/gemini-3.5-flash-lite`, validado con tiempos de respuesta inferiores a 1 segundo y soporte para instrucciones del sistema y respuestas estructuradas.
   - **Nodo `Es un Pedido` (IF) & `Crear Pedido en SaaS`:** Si el cliente confirma la compra, se registra la orden en MongoDB y se guarda el `orderId` en `$workflow.staticData.lastOrderId[from]`.
   - **Nodo `Responder Pedido Creado`:** Devuelve mensaje WhatsApp con el resumen de la compra y solicitud de voucher Yape/Plin.

3. **RecepciÃ³n y ValidaciÃ³n de Comprobantes Yape/Plin:**
   - **Nodo `Obtener URL de Imagen Meta` & `Descargar Imagen`:** Descarga el archivo binario desde Meta Graph API v21.0 con el token de portador.
   - **Nodo `Subir Imagen al SaaS`:** Sube la imagen a la API pÃºblica de `ventas-saas`.
   - **Nodo `Tiene pedido activo` (IF):**
     - Con pedido activo: Adjunta la imagen vÃ­a endpoint `/voucher` y confirma recepciÃ³n al cliente.
     - Sin pedido activo: Pide amablemente al cliente indicar quÃ© reloj desea antes de procesar el comprobante.

4. **Notificador Administrativo de Apagado (Handoff AutomÃ¡tico):**
   - **Nodo `Webhook Notificaciones` (`POST /webhook/bot-admin`):** Disparado por el backend al apagar el bot.
   - **Nodo `Generar Lista`:** Separa los nÃºmeros de clientes con compras pendientes.
   - **Nodo `Enviar Mensaje Despedida` (Nodo Oficial de WhatsApp):** EnvÃ­a un mensaje cordial avisando que el bot pausÃ³ su turno y proporciona el enlace directo al asesor humano (`wa.me/{numeroHumano}`) para una transiciÃ³n impecable.

---

#### 4. AnÃ¡lisis de Costos y PolÃ­ticas de WhatsApp Cloud API
- **1,000 Conversaciones de Servicio Gratuitas al Mes:** Meta renueva mensualmente este paquete por WABA (WhatsApp Business Account).
- **Ventana de 24 Horas:** Si el cliente escribe y el bot responde, se abre una ventana de 24 horas que cuenta como 1 sola conversaciÃ³n, sin importar cuÃ¡ntos mensajes se intercambien en ese lapso.
- **Efecto de Silencio Total:** Si el bot estÃ¡ apagado y no emite respuesta, **Meta no descuenta ninguna conversaciÃ³n de la cuota gratuita**, protegiendo el saldo del negocio.

---

#### 5. Despliegue y Pruebas Realizadas
1. **CompilaciÃ³n y ConstrucciÃ³n:** Backend .NET compilado con 0 errores y 0 advertencias.
2. **Despliegue en VPS Hostinger:** Imagen Docker actualizada y contenedores reiniciados vÃ­a `docker-compose up -d --build`.
3. **ValidaciÃ³n de API Gemini:** Peticiones HTTP a `gemini-3.5-flash-lite` ejecutadas con Ã©xito en tiempo real mediante script de verificaciÃ³n Node.js / cURL.
4. **ValidaciÃ³n de Sintaxis JSON n8n:** Archivo `Bot-Completo-LGant-n8n.json` verificado programÃ¡ticamente (29 nodos y 24 conexiones vÃ¡lidas).

---

### Â¿DÃ³nde nos quedamos? (Estado Actual y PrÃ³ximos Pasos)

1. **Estado del Sistema:**
   - Backend en VPS: **En ejecuciÃ³n y actualizado** con los endpoints de control del bot y webhook administrativo.
   - Frontend en VPS / Vercel: **En ejecuciÃ³n** con botÃ³n toggle en Dashboard y redirecciÃ³n dinÃ¡mica en tienda.
   - n8n (`n8nrelojes.helifyferdigital.cloud`): Flujo unificado `Bot-Completo-LGant-n8n.json` listo y validado para su activaciÃ³n.
2. **PrÃ³ximas Pruebas Recomendadas:**
   - Simular una conversaciÃ³n de venta completa desde un telÃ©fono cliente con el bot encendido.
   - Apagar el bot desde el panel admin y verificar que los nuevos mensajes queden en silencio sin consumir saldo.
   - Probar el envÃ­o de un comprobante de pago de prueba (Yape/Plin) y verificar su visualizaciÃ³n en el modal de Pedidos del administrador.


## ActualizaciÃ³n Reciente - MÃ³dulo de Chatbot Inteligente (WhatsApp + n8n)
- **Backend (C# .NET)**: CreaciÃ³n de modelos y controladores para `WhatsAppChat`. Se implementaron los endpoints (`/api/public/store/{empresaId}/bot/chat` y `/bot/chat-history`) para almacenar todo el flujo de mensajes entre el cliente y el bot en la colecciÃ³n de MongoDB `whatsapp_chats`.
- **Frontend (Vue.js)**: ImplementaciÃ³n de la vista `WhatsAppChats.vue` en el panel de administrador para monitorear conversaciones en tiempo real. 
  - CorrecciÃ³n de error crÃ­tico de enrutamiento (pantalla blanca) por importaciÃ³n faltante de `VerifyEmail` en `router/index.js`.
  - InyecciÃ³n de `dashboard-layout` y `sidebar` en la vista de chats para unificar el diseÃ±o con el resto del SaaS.
  - Limpieza de cÃ³digo y remociÃ³n de dependencia externa `date-fns` por funciones nativas de JS.
- **AutomatizaciÃ³n (n8n)**: 
  - ReestructuraciÃ³n profunda del flujo de WhatsApp para dotar al bot de "Memoria de Corto Plazo".
  - Agregado de nodos: "Guardar Mensaje Cliente", "Obtener Historial", "Mapear Historial" y "Guardar Mensaje Bot".
  - SoluciÃ³n de errores de formato JSON (Bad control character) al enviar respuestas dinÃ¡micas de Gemini hacia el Backend usando `JSON.stringify()` directamente en las expresiones de n8n.

## ActualizaciÃ³n - OptimizaciÃ³n de MÃ©todos de Pago en Checkout (Frontend Relojes)
- **Retiro de OpciÃ³n "Tarjeta" Manual (`ProcesoPago.jsx`)**:
  - Se eliminÃ³ la pestaÃ±a y el formulario manual de tarjeta de crÃ©dito/dÃ©bito (nÃºmero, titular, fecha y CVV).
  - Toda la recaudaciÃ³n por tarjeta ahora se delega de forma segura, certificada y protegida a **Mercado Pago Checkout Pro**, evitando riesgos de seguridad o fricciones en la carga de datos.
  - La rejilla de mÃ©todos de pago en el Paso 4 queda configurada de manera armÃ³nica en 3 mÃ©todos claros:
    1. **Yape / Plin** (Billeteras Digitales con QR interactivo)
    2. **Transferencia Bancaria** (BCP / Interbank con copiado de nÃºmero de cuenta y CCI)
    3. **Mercado Pago** (Tarjetas de crÃ©dito/dÃ©bito, saldo y cuotas)
  - CompilaciÃ³n verificada exitosamente en Next.js (`npm run build`).

## ActualizaciÃ³n - Mejoras de UX/UI en Tienda y Panel SaaS (22 de Septiembre)
- **Frontend-Relojes (Tienda)**:
  - Se cambiÃ³ el botÃ³n de "PAGAR CON TARJETA" por **"COMPRAR AHORA"** en las vistas de detalle de producto (`PaginaDetalleProducto.jsx`) y en el modal del producto (`ModalProducto.jsx`).
  - Al hacer clic en "COMPRAR AHORA", ahora el flujo redirige directamente al proceso de pago (`/checkout`), mejorando la conversiÃ³n.
- **Frontend (Administrador SaaS)**:
  - **Arreglo del Sidebar**: Se corrigiÃ³ un problema de *layout shift* (desplazamiento visual) al hacer hover sobre el menÃº lateral. Ahora los bloques de `.user-info` y `.nav-section-title` mantienen su altura constante mediante CSS, garantizando que los iconos no se muevan de lugar al expandir el menÃº.
  - **Scroll en Modal de Producto**: Se agregÃ³ un control estricto de altura (`max-height: 90vh` y `min-height: 0`) junto con `overflow-y: auto` en las columnas del inspector de productos (`.studio-details-column`), asegurando que las listas de especificaciones muy largas no queden cortadas y puedan desplazarse verticalmente.
  - **LÃ­nea de Tiempo para Estados de Pedidos**: Se rediseÃ±Ã³ el modal de *Actualizar Estado del Pedido* en `OnlineOrders.vue`. Se reemplazÃ³ la lista bÃ¡sica de botones por una elegante **LÃ­nea de Tiempo (Timeline)** vertical. Ahora el usuario puede visualizar claramente el flujo lÃ³gico del pedido (Pendiente de Pago > En PreparaciÃ³n > Enviado > Entregado), con indicadores visuales de pasos completados (verde) y el paso actual (azul). El botÃ³n de Cancelar se separÃ³ visualmente como una acciÃ³n secundaria.

## CorrecciÃ³n CrÃ­tica - Error 500 en CreaciÃ³n de Pedidos desde Bot WhatsApp (n8n)
- **Causa RaÃ­z**: En `PublicStoreController.cs` (`SubmitBotOrder`), se estaba asignando `ClienteId = "WHATSAPP_BOT"`. Dado que el modelo `Sale.cs` define `ClienteId` con el atributo `[BsonRepresentation(BsonType.ObjectId)]`, MongoDB rechazaba la inserciÃ³n arrojando `FormatException: 'WHATSAPP_BOT' is not a valid 24 digit hex string`, resultando en un error HTTP 500 hacia n8n.
- **SoluciÃ³n Implementada**:
  - Se modificÃ³ `ClienteId` para que sea `null` (o el `ObjectId` del cliente si su nÃºmero telefÃ³nico ya existe en la colecciÃ³n `Clients`).
  - Se corrigiÃ³ de igual modo en `SubmitOrder` para compras como invitado (`client?.Id` en lugar de `"INVITADO"`).
  - Se envolviÃ³ el mÃ©todo en un bloque `try/catch` con logging detallado para prevenir caÃ­das silenciosas.
  - CompilaciÃ³n validada en .NET 9 sin errores.

## DefiniciÃ³n Oficial - MÃ©todos de Pago Exclusivos para Cobro del Bot WhatsApp
- **Yape (Ãšnicamente Yape, NO Plin)**:
  - NÃºmero: **997 099 683**
  - Titular: **GRUPO SERCAL S.A.C.**
  - Solicitud: Captura del comprobante (foto) O nÃºmero de operaciÃ³n de Yape.
- **Transferencia Bancaria (Cuentas Corrientes)**:
  - Titular: **GRUPO SERCAL S.A.C.**
  - **BCP**: Cta. Corriente Soles `355-7216688-0-94` | CCI `002 355 007216688094 67`
  - **Interbank**: Cta. Corriente Soles `500-3007303149` | CCI `003-500-003007303149-61`
  - Solicitud: Captura de pantalla O nÃºmero de constancia/operaciÃ³n.
- **Canal de Asistencia Humana / Concierge**: `916 382 742` (WhatsApp oficial de soporte, NO para recibir yapeos).



## Actualizaciï¿½n - Integraciï¿½n de Mercado Pago y Generaciï¿½n de Tickets POS (22 de Septiembre)
- **Backend (C# .NET)**:
  - Implementaciï¿½n del endpoint /api/sales/generate-ticket en SalesController para permitir al vendedor generar un link de pago rï¿½pido directamente desde el POS sin necesidad de procesar la venta al instante.
  - El sistema registra la orden en MongoDB con estado PENDIENTE_PAGO y OrigenPedido = "POS_TICKET", reservando la intenciï¿½n de venta y tipo de comprobante (Boleta/Factura), pero **sin descontar stock** y **sin generar el correlativo de SUNAT** para evitar comprobantes vacï¿½os si el cliente no paga.
  - Correcciï¿½n en el Webhook de Mercado Pago (MercadoPagoController.cs): Se solucionï¿½ un bug silencioso donde el pago online cambiaba el estado a Pagado y EN_PREPARACION pero no descontaba el stock. Ahora, el Webhook **descuenta el inventario automï¿½ticamente** y genera el registro en StockMovements en el momento en que Mercado Pago aprueba el pago, garantizando la exactitud del inventario a cualquier hora.
  - Configuraciï¿½n de AllowAnonymous en los mï¿½todos de Mercado Pago para procesar ventas de invitados enviando email: null en el request de preferencias.
- **Frontend (Vue.js & Next.js)**:
  - **POS.vue**: Agregado del botï¿½n **"Generar Link de Pago"** en el carrito de compras. Al presionarlo, se invoca a Mercado Pago, se despliega el *Success Modal* adaptado mostrando el estado "TICKET PENDIENTE" y se brinda un recuadro azul claro destacado con el enlace y un botï¿½n nativo de "Copiar" para enviï¿½rselo rï¿½pidamente al cliente vï¿½a WhatsApp.
  - **Tienda Virtual (PanelFiltros.jsx)**: Se mejorï¿½ la UX colapsando (cerrando) todos los acordeones de filtros por defecto al cargar la pï¿½gina para dar un aspecto mï¿½s limpio.
  - **Tienda Virtual (index.css & Componentes)**: Se mejorï¿½ el aspecto visual aplicando fondo blanco y texto centrado a las secciones principales del Home ("Eternidad en cada segundo", "Los mï¿½s Vendidos", "Nuevos Ingresos").

## ActualizaciÃ³n - 23 de Septiembre
- **Correcciones y Optimizaciones UI Frontend**:
  - **Filtros Multi-select en POS e Inventario:** Se implementÃ³ y corrigiÃ³ el funcionamiento del filtro de Especificaciones por selecciÃ³n mÃºltiple (Products.vue y POS.vue). Se ajustÃ³ la propagaciÃ³n del evento click y el ancho del menÃº desplegable para que no recorte el texto.
  - **Filtros en Historial de Ventas (SalesHistory.vue)**: ImplementaciÃ³n completa de filtros por "Tipo de Comprobante", "Rango de Fecha Desde-Hasta" y despliegue dinÃ¡mico de "MÃ©todos de Pago" sincronizado con la base de datos.
  - **Identidad Visual de Comprobantes**: IncorporaciÃ³n de iconos SVG formales en el listado de ventas para diferenciar de un solo vistazo Boletas, Facturas y Notas de Venta (evitando el uso de emojis informales).
  - **Soporte XML y CDR para Sunat Beta**: Se habilitaron los botones de "Descargar XML" y "Descargar CDR" directamente en el modal de detalles de venta. Los documentos de prueba autogenerados por APIs PerÃº pueden descargarse libremente para revisar la estructura en Beta antes de pasar a producciÃ³n oficial.
  - **Layout del Dashboard y Emojis**: RefactorizaciÃ³n del dashboard de KPI para mostrar las tarjetas en una lÃ­nea horizontal (sin deformar el menÃº lateral) e integraciÃ³n correcta del Loader encapsulado solo en los contenedores de carga. Reemplazo general de emojis informales por iconos SVG nativos.

## ActualizaciÃ³n - ImplementaciÃ³n del Libro de Reclamaciones (23/24 de Septiembre)
- **Desarrollo del Backend**: IntegraciÃ³n con el sistema para guardar las reclamaciones emitidas desde el Frontend Tienda.
- **Frontend Administrador (Complaints.vue)**:
  - Se creÃ³ el mÃ³dulo y la vista `Complaints.vue` para que el administrador pueda revisar el listado de reclamaciones filtradas por `empresaId`.
  - Se adaptÃ³ la interfaz para listar reclamaciones y visualizar en un Modal el detalle individual del reclamo (datos del cliente, producto reclamado, detalle y pedido solicitado).
  - Se sustituyÃ³ el uso de la librerÃ­a `axios` por la funciÃ³n nativa `fetch` para evitar fallos de compilaciÃ³n en el despliegue del Dashboard.
- **GestiÃ³n de Permisos (Users.vue)**: 
  - Se inyectÃ³ el permiso `'libro_reclamaciones'` en el sistema de gestiÃ³n de colaboradores.
  - Ahora es posible habilitar y deshabilitar el acceso de forma individual para cada cuenta mediante el panel de Colaboradores.
- **EstandarizaciÃ³n de UX/UI**:
  - **Estructura Global del Sidebar**: Se homologÃ³ quirÃºrgicamente el componente Sidebar (`nav-links`) en `Complaints.vue` basÃ¡ndose en el estÃ¡ndar usado en `Dashboard.vue`, garantizando que el orden y comportamiento de las secciones no varÃ­e al navegar entre vistas.
  - **Desenfoque (Blur) Modal Global**: Se aumentÃ³ la jerarquÃ­a visual (`z-index: 1000`) de la clase `.modal-backdrop` en `Complaints.vue` para asegurar que, al abrir los detalles de una reclamaciÃ³n, el oscurecimiento abarque Ã­ntegramente la pantalla, bloqueando la visibilidad y clics sobre el Sidebar, logrando total sincronÃ­a visual con el resto de la plataforma.
- **Limpieza del Repositorio**: Se eliminaron los scripts temporales (`fix-users.js`, `fix-sidebar-complaints.js`, etc.) que ya cumplieron su propÃ³sito, evitando cargar archivos basura al entorno de producciÃ³n.

## ActualizaciÃ³n - Mejoras en la Portada (Hero) y Rebranding Visual (24 de Septiembre)
- **Frontend-Relojes (Tienda)**:
  - **Rebranding y Consistencia de Marca**:
    - En `BarraNavegacion.jsx` se reemplazÃ³ el texto del logo de "L'G - HAUTE HORLOGERIE" a "L'GANT - en cada segundo".
    - En `PieDePagina.jsx` se actualizÃ³ el texto del logotipo y slogan a "L'GANT - En cada segundo â€¢ Boutique PerÃº".
  - **Nuevo Carrusel DinÃ¡mico (Hero)**:
    - Se eliminÃ³ la caja blanca estÃ¡tica de "Boutique de Alta RelojerÃ­a" de la portada inicial (`Inicio.jsx`).
    - Se implementÃ³ un carrusel dinÃ¡mico de fondo completo (Full Width) con reproducciÃ³n automÃ¡tica cada 5 segundos.
    - Se importaron 3 imÃ¡genes de alta resoluciÃ³n (`coleccion edifice.jpg`, `dorados.jpg`, `mujeres.jpg`) desde la carpeta `assets/hero/`.
    - Cada imagen se acompaÃ±a de textos especÃ­ficos ("ColecciÃ³n Edifice", "Elegancia Dorada", "Alta RelojerÃ­a Femenina") con efectos suaves de transiciÃ³n (fade & slide-up) y un degradado oscuro superpuesto para garantizar la perfecta legibilidad del texto blanco.
    - **PaginaciÃ³n (Dots)**: Se implementÃ³ un sistema de indicadores (puntitos) en la parte inferior de la pantalla para permitir a los usuarios identificar visualmente la cantidad de imÃ¡genes y navegar manualmente entre las diapositivas al hacer clic en ellas.

## ActualizaciÃ³n - 24 de Septiembre (Nuevos Ingresos, Los MÃ¡s Vendidos y Bugfix Panel)
- **Frontend E-Commerce (Tienda)**:
  - **ReorganizaciÃ³n del CatÃ¡logo y CategorÃ­as Destacadas (`App.jsx` y `CategoriasDestacadas.jsx`)**:
    - Se adaptÃ³ la vista principal para mostrar dinÃ¡micamente dos vitrinas separadas: **"Nuevos Ingresos"** (tÃ­tulo: "DESCUBRE LO ÃšLTIMO") y **"Los mÃ¡s Vendidos"**. 
    - Las secciones detectan automÃ¡ticamente a los productos que pertenecen a sus respectivas categorÃ­as ("nuevos ingresos", "lo mas vendido") usando comprobaciÃ³n transversal en `categoria`, `categorias` y `etiqueta`.
    - En caso de que no haya productos especÃ­ficamente etiquetados en alguna secciÃ³n, se aplica un mecanismo de "fallback" inteligente que muestra los primeros o Ãºltimos productos del catÃ¡logo general, asegurando que las cuadrÃ­culas nunca queden vacÃ­as.
    - Se modificaron las tarjetas de "CategorÃ­as Destacadas" para abarcar completamente el ancho del contenedor, mejorando la distribuciÃ³n de la UI, y se les dio dimensiones en porcentajes para adaptabilidad fluida (responsive).
  - **Mejora del Carrusel**: 
    - Se ajustaron los temporizadores del carrusel automÃ¡tico para asegurar una transiciÃ³n fluida cada 5 segundos de forma circular y perpetua.
    - Cuando el usuario interactÃºa manualmente con las fotos o los indicadores (dots), el contador de 5 segundos se resetea internamente para evitar saltos prematuros de diapositivas justo despuÃ©s de una interacciÃ³n.
- **Frontend Panel de Administrador (Vue.js)**:
  - **CorrecciÃ³n de Bug en Cierre de SesiÃ³n (`WhatsAppChats.vue`)**: Se detectÃ³ y resolviÃ³ un error donde el botÃ³n "Cerrar SesiÃ³n" de la vista de chats de inteligencia artificial no tenÃ­a respuesta. Se importÃ³ y definiÃ³ el manejador `handleLogout` junto con `useRouter`, sincronizando el comportamiento de cierre de sesiÃ³n con el resto del dashboard de administrador.
  - **Corrección Estructural y Estética (Layout de Catálogo)**:
    - Se resolvió la duplicidad visual de "Nuevos Ingresos" garantizando que solo "Los más Vendidos" se visualicen en la cabecera principal del catálogo, mientras que "Nuevos Ingresos" se posicionó de manera exclusiva debajo de la animación *Eternidad en cada Segundo*.
    - Se modificó la cuadrícula pasando el renderizado dinámico de 4 tarjetas a 5 por fila, sacando el máximo provecho de la estructura fluida configurada previamente en el CSS.
    - Se rectificó el contenedor (wrapper) de la sección "Nuevos Ingresos" retirando el límite rígido de 1360px de ancho e igualando sus dimensiones a 100% con los paddings exactos del catálogo (50px 2% 90px), logrando que todas las colecciones se extiendan a los costados de manera uniforme y simétrica en monitores anchos.

## Actualización - 25 de Septiembre
- **Mejoras UX/UI Frontend (Tienda y Panel)**:
  - **Banner de Cookies**: Se implementó un elegante componente flotante (`CookieBanner.jsx`) para solicitar y registrar en el navegador (localStorage) el consentimiento de uso de cookies, cumpliendo con estándares básicos de privacidad y adaptado a la paleta oscura de la boutique.
  - **Refactorización del Footer (`PieDePagina.jsx`)**: Se retiró completamente la columna de texto de "MARCAS", permitiendo que el pie de página redistribuya automáticamente su cuadrícula (grid) para lograr mayor limpieza visual y simetría.
  - **Rebranding Terminológico**: Se reemplazó el término "Bolsa" por "Carrito" o "Carrito de compras" transversalmente en el proyecto (`TarjetaProducto.jsx`, `ToastNotificacion.jsx`, `CajonCarrito.jsx`, `ModalProducto.jsx`, `PaginaDetalleProducto.jsx`) para mayor claridad regional.
  - **Fondo de Catálogo (`App.jsx`)**: Se fijó el color de fondo del contenedor principal del catálogo (`#catalogo`) a blanco puro (`#ffffff`) de forma incondicional, removiendo el comportamiento heredado y homologando la vista del catálogo completo con las vitrinas de inicio.
  - **Scroll en Modales de Admin (`OnlineOrders.vue`)**: Se corrigió un problema de desbordamiento en el panel de administrador inyectando reglas CSS (`max-height: 90vh`, `overflow-y: auto`) a la clase global `.modal-content`. Ahora el modal de actualización de estado de pedido genera una barra de desplazamiento automática en pantallas pequeñas, previniendo que los botones de acción queden ocultos.
- **Optimización de Bot IA (Flujo de automatización n8n)**:
  - **Corrección de Error 429 de Gemini API**: Se diagnosticó el motivo del límite de tokens excedido (el bot inyectaba todas las especificaciones detalladas de cada producto en la memoria del sistema).
  - **Filtro de Atributos**: Se desarrolló un script JS para el nodo "Preparar Prompt" que filtra los atributos de la base de datos y solo extrae datos cruciales para la venta basándose en palabras clave (`['color', 'material', 'cristal']`). Esto redujo drásticamente el peso del payload hacia Gemini, manteniendo respuestas técnicas inteligentes sin saturar la capa gratuita de la API.
