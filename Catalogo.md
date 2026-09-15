# Guía de Carga y Estandarización de Productos en el Catálogo

Este documento establece la metodología, reglas de negocio y estructura de datos utilizada para extraer información de catálogos (imágenes, PDFs o listas de proveedores) e ingresarla en el sistema **Ventas SaaS** (`/products`).

Cualquier agente de IA o colaborador debe seguir estas directrices para mantener la consistencia y calidad del catálogo.

---

## 1. Regla de Oro: Agrupación de Modelos y Variantes

En el sistema, los productos que corresponden al **mismo modelo físico** pero varían en color, acabado o material de correa deben mostrarse como variantes bajo un mismo producto.

* **Código de Barra / SKU:** Es el identificador **único** de la variante específica (incluye sufijos de color).
  * *Ejemplo:* `A140WE-2A`, `A140WE-8A`, `A140WEG-9A`.
* **Agrupador (Modelo):** Es el código base de la familia o serie. **Debe ser idéntico** para todas las variantes del mismo modelo.
  * *Ejemplo:* Todas las variantes anteriores llevan como agrupador `A140WE`.
* **Criterio de Subfamilias:**
  * Si un reloj cambia drásticamente el brazalete (por ejemplo, pasa de eslabones de acero a **malla milanesa** `A158WEM`), se agrupa bajo su propio submodelo (`A158WEM`).
  * Si pertenecen a una serie distinta (como `A158` vs `A159`), tienen agrupadores distintos (`A158WEA`, `A158WA`, `A159W`).

---

## 2. Estructura de Campos del Formulario (Paso a Paso)

### A. Información General
* **Nombre del Producto:** Formato estándar: `Reloj [Marca] [Colección] [Modelo/SKU] [Detalle distintivo opcional]`.
  * *Ejemplo:* `Reloj Casio Vintage A140WE-2A`, `Reloj Casio Vintage A158WEM-3 Malla Milanesa`.
* **Categorías \*:** Seleccionar según el catálogo origen. Si el catálogo indica "Caballero", asignar `Hombre` (y `Unisex` si aplica para modelos retro compactos).
* **Marca (Opcional):** Nombre de la marca (ej. `Casio`).
* **Código de Barra / SKU:** Código exacto que figura en el catálogo o código de barras.
* **Agrupador (Modelo):** Código raíz de la serie/modelo para vincular las variantes.
* **Tipo de Producto:** Por defecto en relojería es `Unidad`.

### B. Inventario y Precios
* **Stock inicial sugerido:** `10` (o el inventario físico real disponible).
* **Stock Mínimo (Unidad):** `2`.
* **Precio Costo (S/):** `0` (o el precio de costo del proveedor si se conoce).
* **Precio Venta Base (S/):** Precio de venta indicado en el catálogo (ej. `507.50`, `243.50`, `177.50`).
* **Precio Oferta (S/):** `0` (solo se ingresa si existe una promoción activa).

### C. Descripción del Producto
Debe ser persuasiva, orientada al cliente y optimizada para SEO. Debe incluir:
1. Nombre y estilo retro/clásico del reloj.
2. Materiales de construcción (acero inoxidable, caja cromada o dorada).
3. Funciones digitales clave (luz LED, cronómetro, alarma diaria, calendario automático).
4. Resistencia al agua recomendada para uso cotidiano.

> **Plantilla de Descripción:**
> `Reloj digital [Marca] [Colección] con diseño retro clásico. Cuenta con caja con acabado [cromado/dorado], brazalete de [acero inoxidable / malla de acero] en tono [color] y dial en color [color dial]. Incorpora luz LED, cronómetro de precisión, alarma diaria, señal horaria y calendario automático. Resistente al agua para uso diario.`

---

## 3. Especificaciones y Atributos (Panel Derecho)

Estos valores corresponden a las opciones configuradas en `/categories` > pestaña **Atributos / Otros**:

| Atributo | Opciones Típicas para Casio Vintage | Notas Importantes |
| :--- | :--- | :--- |
| **Estilo** | `Casual`, `Retro`, `Clásico`, `Elegante` | Usar `Elegante` para dorados y mallas milanesas; `Casual` / `Clásico` para modelos plateados estándar. |
| **Colección** | `Vintage` | Línea retro digital clásica. |
| **Material de Correa** | `Acero Inoxidable`, `Malla de Acero` | Usar `Malla de Acero` cuando el modelo tenga correa tipo mesh (ej. serie `A158WEM`). |
| **Color de correa** | `Plateado`, `Dorado`, `Negro` | Según el color del brazalete. |
| **Mecanismo** | `Digital` | Para toda la línea digital LCD. |
| **Color de cara** | `Azul`, `Negra`, `Blanca`, `Verde`, `Plomo`, `Dorado`, `Marrón` | Color del fondo/esfera (dial). |
| **Tipo de cristal** | `Mineral` o `Resina / Acrílico` | El estándar Casio Vintage es acrílico/resina; en el sistema seleccionar `Mineral` si no está disponible acrílico. |
| **Material de caja** | `Acero inoxidable` o `Resina cromada` | Seleccionar según las opciones activas del sistema. |
| **Resistencia al agua** | `Water Resistant (Salpicaduras)` o `No aplica / En blanco` | ⚠️ **Advertencia:** NUNCA seleccionar `10 bares / 100 metros` en relojes Vintage, ya que son únicamente resistentes a salpicaduras (30m / Water Resist). |

---

## 4. Ejemplos Prácticos de Registro

### Ejemplo 1: Serie A140WE (Variantes de Color)
* **Variante Azul:**
  * SKU: `A140WE-2A` | Agrupador: `A140WE` | Precio: `507.50` | Correa: `Plateado` | Cara: `Azul`
* **Variante Gris:**
  * SKU: `A140WE-8A` | Agrupador: `A140WE` | Precio: `507.50` | Correa: `Plateado` | Cara: `Plomo` *(o Gris)*
* **Variante Dorada:**
  * SKU: `A140WEG-9A` | Agrupador: `A140WE` | Precio: `657.50` | Correa: `Dorado` | Cara: `Dorado`

### Ejemplo 2: Serie A158WEM (Correa de Malla Milanesa)
* **Variante Verde:**
  * SKU: `A158WEM-3` | Agrupador: `A158WEM` | Precio: `350.00` | Material: `Malla de Acero` | Cara: `Verde`
* **Variante Plateada:**
  * SKU: `A158WEM-7` | Agrupador: `A158WEM` | Precio: `350.00` | Material: `Malla de Acero` | Cara: `Plomo` *(o Plateado)*

---

## 5. Carga de Imágenes
* Formato: Optimizado para web (JPG / WEBP / PNG).
* Peso máximo: 1 MB por imagen.
* Límite: Hasta 5 imágenes por producto.
* Imagen Principal: Foto frontal individual clara sobre fondo blanco o neutro del reloj específico.
* Imágenes Secundarias: Fotos de detalle, catálogo o foto grupal de la colección.
