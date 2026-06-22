// mongosh "mongodb://localhost:27017/VentasSaaS" seed-complete.js
/*
cd frontend
npm run seed
*/
// MongoDB Seeding Script for VentasSaaS (Self-contained / Complete environment)
// This script creates: Users, Empresas, Categories, Clients, Suppliers, Products, Sales, Purchases, and StockMovements.
// Database name: VentasSaaS

const dbName = "VentasSaaS";
const conn = new Mongo();
const db = conn.getDB(dbName);

print("--------------------------------------------------");
print("Starting complete database seeding for VentasSaaS...");
print("--------------------------------------------------");

// 1. Clean up entire database to avoid duplicates
db.dropDatabase();
print("Cleaned database 'VentasSaaS'.");

// 2. Predefined IDs for Businesses (Empresas)
const idEmpresaGlobal = ObjectId("6a281876da32cc14d9327270");
const idEmpresaChevere = ObjectId("6a297aca2e7ef220b17ac96c");
const idEmpresaMejor = ObjectId("6a297e7cd0136764058f1f8e");
const idEmpresaHeladeriva = ObjectId("6a2987a46f2cef91877179a7");

// Predefined IDs for Users
const idUserSuperadmin = ObjectId("6a281876da32cc14d9327271");
const idUserMarcelo = ObjectId("6a297aca2e7ef220b17ac96d");
const idUserHeraldo = ObjectId("6a297ba42e7ef220b17ac973");
const idUserAlicia = ObjectId("6a297e7cd0136764058f1f8f");
const idUserFelicita = ObjectId("6a297f0fd0136764058f1f96");
const idUserJuan = ObjectId("6a2987a46f2cef91877179a8");

// 3. Create Empresas
db.Empresas.insertMany([
  {
    _id: idEmpresaGlobal,
    Nombre: "SaaS Administración Global",
    PropietarioId: idUserSuperadmin.toString(),
    PlanSuscripcion: "System",
    Activo: true,
    FechaCreacion: new Date("2026-06-09T13:43:18.694Z")
  },
  {
    _id: idEmpresaChevere,
    Nombre: "TU TIENDA CHEVERE",
    PropietarioId: idUserMarcelo.toString(),
    PlanSuscripcion: "Premium",
    Activo: true,
    FechaCreacion: new Date("2026-06-10T14:55:06.654Z")
  },
  {
    _id: idEmpresaMejor,
    Nombre: "LA MEJOR",
    PropietarioId: idUserAlicia.toString(),
    PlanSuscripcion: "Premium",
    Activo: true,
    FechaCreacion: new Date("2026-06-10T15:10:52.573Z")
  },
  {
    _id: idEmpresaHeladeriva,
    Nombre: "Heladeria Antigravity",
    PropietarioId: idUserJuan.toString(),
    PlanSuscripcion: "Premium",
    Activo: true,
    FechaCreacion: new Date("2026-06-10T15:49:56.124Z")
  }
]);
print("Created Empresas.");

// 4. Create Users (with correct pre-hashed passwords for 'Password123!')
db.Users.insertMany([
  {
    _id: idUserSuperadmin,
    EmpresaId: idEmpresaGlobal,
    Nombre: "Súper Administrador",
    Correo: "admin@ventassaas.com",
    ClaveHash: "flWlRgqpA4IwKNipmIwBshTmoSvFiOJmbWDwj98sVcZxi8hG68hQqUc0QPNl8Wry", // Password123!
    Rol: "Superadmin",
    Permisos: ["empresas", "dashboard", "ventas", "productos", "clientes", "proveedores", "compras", "movimientos"],
    Activo: true,
    FechaCreacion: new Date("2026-06-09T13:43:18.779Z")
  },
  {
    _id: idUserMarcelo,
    EmpresaId: idEmpresaChevere,
    Nombre: "marcelo",
    Correo: "marcelo@ventassaas.com",
    ClaveHash: "KEUE1w7tED9m2+/QV1kqDypwIGldMWOY8/ZGjBBc/z73pL5xDsTHau4YUluk4mrf", // Password123!
    Rol: "EmpresaOwner",
    Permisos: ["dashboard", "ventas", "productos", "categorias", "modificar_productos", "clientes", "proveedores", "compras", "movimientos", "config"],
    Activo: true,
    FechaCreacion: new Date("2026-06-10T14:55:06.712Z")
  },
  {
    _id: idUserHeraldo,
    EmpresaId: idEmpresaChevere,
    Nombre: "heraldo",
    Correo: "heraldo@ventassaas.com",
    ClaveHash: "ic184N7r61B0n45aktSAWwW5Rs9AAa0xD6Wpu/PTcsEzTUxRUm2Tyc25LVME0Mua", // Password123!
    Rol: "Employee",
    Permisos: ["ventas", "productos"],
    Activo: true,
    FechaCreacion: new Date("2026-06-10T14:58:44.306Z")
  },
  {
    _id: idUserAlicia,
    EmpresaId: idEmpresaMejor,
    Nombre: "alicia",
    Correo: "alicia@ventassaas.com",
    ClaveHash: "JSeJ5hu6vQ4VitGehNGQjqdlk3aWe7OQwskSzLGg+9HPJdZCrRfCobknTjDktAzu", // Password123!
    Rol: "EmpresaOwner",
    Permisos: ["dashboard", "ventas", "productos", "clientes", "proveedores", "compras", "movimientos", "config"],
    Activo: true,
    FechaCreacion: new Date("2026-06-10T15:10:52.669Z")
  },
  {
    _id: idUserFelicita,
    EmpresaId: idEmpresaMejor,
    Nombre: "felicita",
    Correo: "felicita@ventassaas.com",
    ClaveHash: "DOms0ffd6f0WlKPXlW/IFA5s+blV/yCHC3l3TdAss2jl+DHBA5J/svtGQGwzrNUX", // Password123!
    Rol: "Employee",
    Permisos: ["ventas", "productos", "dashboard"],
    Activo: true,
    FechaCreacion: new Date("2026-06-10T15:13:19.474Z")
  },
  {
    _id: idUserJuan,
    EmpresaId: idEmpresaHeladeriva,
    Nombre: "Juan Perez",
    Correo: "juan@test.com",
    ClaveHash: "9L1FMTaMIUkTHrYcgurTfGzEKWDC1xznC4FCuwfQbFFM1fem+nwtxLuEt6F1Y586", // Password123!
    Rol: "EmpresaOwner",
    Permisos: ["dashboard", "ventas", "productos", "clientes", "proveedores", "compras", "movimientos", "config"],
    Activo: true,
    FechaCreacion: new Date("2026-06-10T15:49:56.130Z")
  }
]);
print("Created Users (Password is 'Password123!' for all users).");

const companies = [
  {
    id: idEmpresaChevere,
    name: "TU TIENDA CHEVERE",
    ownerId: idUserMarcelo,
    ownerName: "marcelo",
    type: "bakery"
  },
  {
    id: idEmpresaMejor,
    name: "LA MEJOR",
    ownerId: idUserAlicia,
    ownerName: "alicia",
    type: "boutique"
  },
  {
    id: idEmpresaHeladeriva,
    name: "Heladeria Antigravity",
    ownerId: idUserJuan,
    ownerName: "Juan Perez",
    type: "icecream"
  }
];

// Helper to generate dates distributed over the last 90 days (6 AM to 11 PM)
function getRandomDateInLast90Days(dayOffset) {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  d.setHours(Math.floor(Math.random() * 18) + 6); // between 6 AM and 11 PM
  d.setMinutes(Math.floor(Math.random() * 60));
  d.setSeconds(Math.floor(Math.random() * 60));
  return d;
}

companies.forEach(company => {
  print("Seeding transaction data for company: " + company.name);

  // 1. Seed Categories (6 per company)
  let categoryDefs = [];
  if (company.type === "bakery") {
    categoryDefs = [
      { name: "Tortas Especiales", desc: "Tortas para celebraciones y cumpleaños" },
      { name: "Pasteles de Porción", desc: "Porciones individuales de repostería fina" },
      { name: "Bebidas Calientes", desc: "Cafetería y infusiones de especialidad" },
      { name: "Bebidas Frías", desc: "Jugos, batidos y refrescos fríos" },
      { name: "Galletería y Bocaditos", desc: "Galletas, alfajores y bocados dulces" },
      { name: "Panes y Salados", desc: "Panadería artesanal y empanadas calientes" }
    ];
  } else if (company.type === "boutique") {
    categoryDefs = [
      { name: "Ropa de Cama", desc: "Frazadas, sábanas y edredones de alta gama" },
      { name: "Cortinas Modernas", desc: "Cortinas y persianas para sala y oficina" },
      { name: "Moda de Invierno", desc: "Casacas, abrigos y sweaters" },
      { name: "Moda de Verano", desc: "Polos, shorts y vestidos ligeros" },
      { name: "Calzado Cómodo", desc: "Zapatillas y calzado de casa" },
      { name: "Bolsos y Carteras", desc: "Accesorios de moda y cuero" }
    ];
  } else { // icecream
    categoryDefs = [
      { name: "Helados en Cono", desc: "Helados servidos en barquillos artesanales" },
      { name: "Helados en Vaso", desc: "Vasos de diferentes tamaños y sabores" },
      { name: "Copas Monumentales", desc: "Copas gigantes con frutas, cremas y jarabes" },
      { name: "Paletas Gourmet", desc: "Paletas rellenas de leche condensada o frutas" },
      { name: "Batidos y Milkshakes", desc: "Bebidas espesas a base de helado" },
      { name: "Waffles y Crepes", desc: "Postres calientes acompañados de helado" }
    ];
  }

  const categoryIds = [];
  categoryDefs.forEach(cat => {
    const id = new ObjectId();
    db.Categories.insertOne({
      _id: id,
      EmpresaId: company.id,
      Nombre: cat.name,
      Descripcion: cat.desc
    });
    categoryIds.push({ id: id, name: cat.name });
  });

  // 2. Seed Clients (25 per company)
  const firstNames = ["Juan", "Pedro", "Maria", "Ana", "Luis", "Carlos", "Sofia", "Jorge", "Lucia", "Elena", "Miguel", "David", "Laura", "Diego", "Carmen", "Jose", "Rocio", "Raul", "Gabriela", "Fernando", "Camila", "Andres", "Isabella", "Manuel", "Alejandra"];
  const lastNames = ["Gomez", "Rodriguez", "Perez", "Gonzalez", "Hernandez", "Lopez", "Martinez", "Sanchez", "Alvarez", "Diaz", "Torres", "Ruiz", "Ramirez", "Flores", "Benitez", "Acosta", "Medina", "Herrera", "Castro", "Vargas", "Guzman", "Salazar", "Rios", "Ortega", "Mendoza"];
  
  const clientIds = [];
  for (let i = 0; i < 25; i++) {
    const name = firstNames[i] + " " + lastNames[(i + 5) % lastNames.length];
    const doc = (10000000 + Math.floor(Math.random() * 89999999)).toString();
    const email = firstNames[i].toLowerCase() + "." + lastNames[(i + 5) % lastNames.length].toLowerCase() + "@gmail.com";
    const tel = "9" + (10000000 + Math.floor(Math.random() * 89999999)).toString();
    const dir = "Calle " + lastNames[i] + " Nro. " + (Math.floor(Math.random() * 800) + 100);

    const id = new ObjectId();
    db.Clients.insertOne({
      _id: id,
      EmpresaId: company.id,
      Nombre: name,
      Telefono: tel,
      Correo: email,
      NumeroDocumento: doc,
      Direccion: dir,
      FechaCreacion: getRandomDateInLast90Days(80)
    });
    clientIds.push({ id: id, name: name });
  }

  // 3. Seed Suppliers (8 per company)
  const supplierNames = [
    "Distribuidora Industrial Alianza", "Corporación Textil del Norte", "Lácteos y Cremas del Sur", 
    "Suministros Globales SA", "Importaciones Sol y Luna", "Proveedor Express Nacional", 
    "Distribuciones del Centro", "Almacenes Mayoristas Unidos"
  ];
  const supplierIds = [];
  for (let i = 0; i < 8; i++) {
    const id = new ObjectId();
    const name = supplierNames[i] + (company.type === "bakery" ? " Harinas/Azúcares" : company.type === "boutique" ? " Telas/Accesorios" : " Sabores/Maquinarias");
    db.Suppliers.insertOne({
      _id: id,
      EmpresaId: company.id,
      Nombre: name,
      Telefono: "01-" + (3000000 + Math.floor(Math.random() * 6000000)).toString(),
      Correo: "ventas@" + name.toLowerCase().replace(/[^a-z]/g, "") + ".com",
      Direccion: "Av. Principal Nro. " + (200 + i * 50),
      FechaCreacion: getRandomDateInLast90Days(85)
    });
    supplierIds.push({ id: id, name: name });
  }

  // 4. Seed Products (15 per company)
  let productDefs = [];
  if (company.type === "bakery") {
    productDefs = [
      { name: "Torta Selva Negra", price: 55.0, cost: 30.0, min: 3, code: "BAK001", catIdx: 0, desc: "Bizcocho de chocolate con cerezas y crema" },
      { name: "Torta Red Velvet", price: 60.0, cost: 35.0, min: 2, code: "BAK002", catIdx: 0, desc: "Color rojo aterciopelado con frosting de queso" },
      { name: "Torta de Piña Especial", price: 45.0, cost: 22.0, min: 3, code: "BAK003", catIdx: 0, desc: "Bizcocho húmedo con rodajas de piña" },
      { name: "Porción de Tiramisú", price: 10.0, cost: 4.5, min: 10, code: "BAK004", catIdx: 1, desc: "Postre italiano con café y mascarpone" },
      { name: "Porción de Pie de Limón", price: 9.0, cost: 4.0, min: 10, code: "BAK005", catIdx: 1, desc: "Masa quebrada con crema de limón y merengue" },
      { name: "Espresso Sencillo", price: 7.0, cost: 2.0, min: 15, code: "BAK006", catIdx: 2, desc: "Shot concentrado de café arábica" },
      { name: "Café Latte Vainilla", price: 12.0, cost: 4.0, min: 12, code: "BAK007", catIdx: 2, desc: "Café con leche y un toque de vainilla" },
      { name: "Batido de Fresa con Leche", price: 11.5, cost: 3.8, min: 8, code: "BAK008", catIdx: 3, desc: "Fresa natural licuada con leche entera" },
      { name: "Limonada Frosted", price: 10.0, cost: 3.0, min: 8, code: "BAK009", catIdx: 3, desc: "Limonada frozen batida con crema" },
      { name: "Alfajores de Maicena x12", price: 18.0, cost: 8.0, min: 6, code: "BAK010", catIdx: 4, desc: "Caja de alfajores rellenos con manjarblanco" },
      { name: "Brownie con Nueces", price: 6.0, cost: 2.5, min: 15, code: "BAK011", catIdx: 4, desc: "Bizcocho denso de chocolate con trozos de nuez" },
      { name: "Empanada de Pollo", price: 8.0, cost: 3.5, min: 15, code: "BAK012", catIdx: 5, desc: "Rellena de pollo deshilachado con especias" },
      { name: "Pan de Jamón y Queso", price: 5.5, cost: 2.2, min: 20, code: "BAK013", catIdx: 5, desc: "Pan suave relleno para comer caliente" },
      { name: "Pan Baguette Crujiente", price: 4.0, cost: 1.5, min: 30, code: "BAK014", catIdx: 5, desc: "Pan de estilo francés recién salido del horno" },
      { name: "Tarta de Manzana", price: 38.0, cost: 18.0, min: 3, code: "BAK015", catIdx: 0, desc: "Clásica tarta con manzanas horneadas y canela" }
    ];
  } else if (company.type === "boutique") {
    productDefs = [
      { name: "Manta Polar Estampada", price: 85.0, cost: 45.0, min: 8, code: "BOU001", catIdx: 0, desc: "Manta suave ideal para ver televisión" },
      { name: "Sábanas de Algodón 400 Hilos", price: 140.0, cost: 75.0, min: 5, code: "BOU002", catIdx: 0, desc: "Juego completo de sábanas ultra suaves" },
      { name: "Juego de Toallas 3 piezas", price: 70.0, cost: 35.0, min: 10, code: "BOU003", catIdx: 0, desc: "Toalla de ducha, de mano y de rostro de algodón" },
      { name: "Cortina Roller Traslúcida", price: 110.0, cost: 60.0, min: 4, code: "BOU004", catIdx: 1, desc: "Filtra la luz suavemente y da privacidad" },
      { name: "Visillo Elegante Gasa", price: 45.0, cost: 20.0, min: 12, code: "BOU005", catIdx: 1, desc: "Cortina ligera decorativa de gasa blanca" },
      { name: "Abrigo de Paño Caballero", price: 320.0, cost: 170.0, min: 3, code: "BOU006", catIdx: 2, desc: "Abrigo formal largo con forro interior" },
      { name: "Casaca de Pluma Ligera", price: 210.0, cost: 110.0, min: 5, code: "BOU007", catIdx: 2, desc: "Plegable y muy térmica para viajes" },
      { name: "Polera con Capucha Algodón", price: 115.0, cost: 55.0, min: 8, code: "BOU008", catIdx: 2, desc: "Polera deportiva abrigadora unisex" },
      { name: "Vestido de Gasa Verano", price: 125.0, cost: 65.0, min: 6, code: "BOU009", catIdx: 3, desc: "Estampado floral con caída ligera" },
      { name: "Short Denim Dama", price: 80.0, cost: 40.0, min: 10, code: "BOU010", catIdx: 3, desc: "Jean corto clásico con bolsillos" },
      { name: "Sandalias de Playa Unisex", price: 40.0, cost: 18.0, min: 15, code: "BOU011", catIdx: 4, desc: "Sandalias de goma resistentes al agua" },
      { name: "Mocasines de Cuero Casual", price: 240.0, cost: 120.0, min: 4, code: "BOU012", catIdx: 4, desc: "Calzado elegante sin pasadores" },
      { name: "Bolso Tote de Lona", price: 90.0, cost: 42.0, min: 8, code: "BOU013", catIdx: 5, desc: "Espacioso bolso para el diario o compras" },
      { name: "Billetera Cuero con Cierre", price: 75.0, cost: 35.0, min: 10, code: "BOU014", catIdx: 5, desc: "Compartimentos para tarjetas y monedas" },
      { name: "Sombrero de Paja Fedora", price: 65.0, cost: 28.0, min: 5, code: "BOU015", catIdx: 5, desc: "Ideal para protección solar en verano" }
    ];
  } else { // icecream
    productDefs = [
      { name: "Cono Simple Fresa de Canasta", price: 6.0, cost: 2.0, min: 25, code: "ICE001", catIdx: 0, desc: "1 bola de crema de fresa natural" },
      { name: "Cono Doble Menta y Vainilla", price: 10.0, cost: 3.5, min: 20, code: "ICE002", catIdx: 0, desc: "Frescura y cremosidad en un solo cono" },
      { name: "Vaso Personal lúcuma", price: 7.5, cost: 2.5, min: 25, code: "ICE003", catIdx: 1, desc: "Delicioso sabor andino en vaso individual" },
      { name: "Vaso Grande 3 Sabores", price: 16.0, cost: 5.8, min: 15, code: "ICE004", catIdx: 1, desc: "Para compartir con la familia o amigos" },
      { name: "Copa Nutella Fudge", price: 24.0, cost: 10.0, min: 5, code: "ICE005", catIdx: 2, desc: "Helado de chocolate, Nutella y galleta triturada" },
      { name: "Copa Tropical de Mango", price: 20.0, cost: 8.5, min: 6, code: "ICE006", catIdx: 2, desc: "Helado de mango, trozos de fruta y jarabe de maracuyá" },
      { name: "Paleta Rellena de Coco y Chocolate", price: 9.0, cost: 3.2, min: 30, code: "ICE007", catIdx: 3, desc: "Crema de coco cubierta de chocolate crujiente" },
      { name: "Paleta Frutal de Limón y Menta", price: 7.0, cost: 2.2, min: 30, code: "ICE008", catIdx: 3, desc: "100% fruta natural refrescante" },
      { name: "Milkshake Frutos Rojos", price: 16.0, cost: 6.0, min: 10, code: "ICE009", catIdx: 4, desc: "Batido espeso de arándanos, fresas y frambuesas" },
      { name: "Milkshake Chocolate Vainilla", price: 15.0, cost: 5.5, min: 10, code: "ICE010", catIdx: 4, desc: "Mezcla clásica cremosa e irresistible" },
      { name: "Waffle de Frutas de la Estación", price: 21.0, cost: 8.5, min: 8, code: "ICE011", catIdx: 5, desc: "Con fresa, plátano, miel de abeja y helado" },
      { name: "Crepe Dulce de Dulce de Leche", price: 19.5, cost: 7.8, min: 8, code: "ICE012", catIdx: 5, desc: "Fino crepe relleno con manjar y helado" },
      { name: "Helado Familiar 1 Litro", price: 42.0, cost: 18.0, min: 10, code: "ICE013", catIdx: 1, desc: "Pack ideal para llevar a casa" },
      { name: "Paleta Rellena de Nutella", price: 9.5, cost: 3.5, min: 25, code: "ICE014", catIdx: 3, desc: "Helado de leche con relleno de pura Nutella" },
      { name: "Copa Banana Split Gourmet", price: 25.0, cost: 11.0, min: 4, code: "ICE015", catIdx: 2, desc: "Especial con múltiples coberturas y barquillos" }
    ];
  }

  const products = [];
  productDefs.forEach(p => {
    const id = new ObjectId();
    const cat = categoryIds[p.catIdx];
    
    // Set initial stock random value between 50 and 150
    const initialStock = Math.floor(Math.random() * 100) + 50;

    const prodObj = {
      _id: id,
      EmpresaId: company.id,
      CategoriaId: cat.id,
      CodigoBarras: p.code,
      Nombre: p.name,
      Descripcion: p.desc,
      Precio: NumberDecimal(p.price.toString()),
      PrecioCosto: NumberDecimal(p.cost.toString()),
      Stock: initialStock,
      StockMinimo: p.min,
      ImagenUrl: "",
      FechaCreacion: getRandomDateInLast90Days(80)
    };

    db.Products.insertOne(prodObj);
    products.push({
      id: id,
      nombre: p.name,
      precio: p.price,
      costo: p.cost,
      stock: initialStock
    });

    // Create initial stock movement
    db.StockMovements.insertOne({
      EmpresaId: company.id,
      ProductoId: id,
      NombreProducto: p.name,
      Tipo: "Ajuste",
      Cantidad: initialStock,
      StockAnterior: 0,
      StockNuevo: initialStock,
      ReferenciaId: "SEED-INIT-MASSIVE",
      Motivo: "Carga inicial de inventario masiva",
      CreadoPor: company.ownerId,
      CreadoPorNombre: company.ownerName,
      FechaCreacion: getRandomDateInLast90Days(79)
    });
  });

  // 5. Seed Purchases (40 purchases per company over last 80 days)
  for (let i = 1; i <= 40; i++) {
    const date = getRandomDateInLast90Days(80 - i * 1.8);
    const supplier = supplierIds[Math.floor(Math.random() * supplierIds.length)];
    
    // Pick 2 to 4 random products to buy
    const numItems = Math.floor(Math.random() * 3) + 2; // 2, 3 or 4 products
    const details = [];
    let total = 0;
    
    const usedIdx = new Set();
    for (let k = 0; k < numItems; k++) {
      let pIdx = Math.floor(Math.random() * products.length);
      while (usedIdx.has(pIdx)) {
        pIdx = Math.floor(Math.random() * products.length);
      }
      usedIdx.add(pIdx);
      
      const pObj = products[pIdx];
      const qty = Math.floor(Math.random() * 15) + 10; // buy 10 to 24 units
      const itemTotal = qty * pObj.costo;
      total += itemTotal;

      details.push({
        ProductoId: pObj.id,
        NombreProducto: pObj.nombre,
        Cantidad: qty,
        PrecioCosto: NumberDecimal(pObj.costo.toString())
      });
    }

    const purchaseId = new ObjectId();
    db.Purchases.insertOne({
      _id: purchaseId,
      EmpresaId: company.id,
      ProveedorId: supplier.id,
      NombreProveedor: supplier.name,
      Detalles: details,
      Total: NumberDecimal(total.toString()),
      CreadoPor: company.ownerId,
      CreadoPorNombre: company.ownerName,
      FechaCreacion: date
    });

    // Record Stock movements & update stock values
    details.forEach(item => {
      const dbProd = db.Products.findOne({ _id: item.ProductoId });
      const currentStock = dbProd.Stock;
      const newStock = currentStock + item.Cantidad;

      db.Products.updateOne({ _id: item.ProductoId }, { $set: { Stock: newStock } });

      db.StockMovements.insertOne({
        EmpresaId: company.id,
        ProductoId: item.ProductoId,
        NombreProducto: item.NombreProducto,
        Tipo: "Compra",
        Cantidad: item.Cantidad,
        StockAnterior: currentStock,
        StockNuevo: newStock,
        ReferenciaId: purchaseId.toString(),
        Motivo: "Compra masiva Nro: " + purchaseId.toString().substring(18),
        CreadoPor: company.ownerId,
        CreadoPorNombre: company.ownerName,
        FechaCreacion: date
      });
    });
  }

  // 6. Seed Sales (abundant, every single day, between 6am and 11pm)
  for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
    const numSalesThisDay = Math.floor(Math.random() * 4) + 3; // 3 to 6 sales per day
    for (let s = 0; s < numSalesThisDay; s++) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      date.setHours(Math.floor(Math.random() * 18) + 6); // between 6 AM and 11 PM
      date.setMinutes(Math.floor(Math.random() * 60));
      date.setSeconds(Math.floor(Math.random() * 60));

      const client = clientIds[Math.floor(Math.random() * clientIds.length)];
      const paymentMethods = ["Efectivo", "Tarjeta", "Transferencia"];
      const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      // Pick 1 to 4 random products to sell
      const numItems = Math.floor(Math.random() * 4) + 1; // 1, 2, 3 or 4 products
      const saleDetails = [];
      let runningTotal = 0;

      const usedIndices = new Set();
      for (let k = 0; k < numItems; k++) {
        let idx = Math.floor(Math.random() * products.length);
        while (usedIndices.has(idx)) {
          idx = Math.floor(Math.random() * products.length);
        }
        usedIndices.add(idx);

        const prod = products[idx];
        const qty = Math.floor(Math.random() * 4) + 1; // sell 1 to 4 units

        saleDetails.push({
          ProductoId: prod.id,
          NombreProducto: prod.nombre,
          Cantidad: qty,
          PrecioUnitario: NumberDecimal(prod.precio.toString())
        });

        runningTotal += qty * prod.precio;
      }

      const subtotal = runningTotal / 1.18;
      const tax = runningTotal - subtotal;

      const saleId = new ObjectId();

      db.Sales.insertOne({
        _id: saleId,
        EmpresaId: company.id,
        ClienteId: client.id,
        NombreCliente: client.name,
        Detalles: saleDetails,
        Subtotal: NumberDecimal(subtotal.toFixed(2)),
        Impuesto: NumberDecimal(tax.toFixed(2)),
        Total: NumberDecimal(runningTotal.toFixed(2)),
        MetodoPago: method,
        CreadoPor: company.ownerId,
        CreadoPorNombre: company.ownerName,
        FechaCreacion: date
      });

      // Record stock decrement
      saleDetails.forEach(item => {
        const dbProd = db.Products.findOne({ _id: item.ProductoId });
        const currentStock = dbProd.Stock;
        const newStock = Math.max(0, currentStock - item.Cantidad);

        db.Products.updateOne({ _id: item.ProductoId }, { $set: { Stock: newStock } });

        db.StockMovements.insertOne({
          EmpresaId: company.id,
          ProductoId: item.ProductoId,
          NombreProducto: item.NombreProducto,
          Tipo: "Venta",
          Cantidad: item.Cantidad,
          StockAnterior: currentStock,
          StockNuevo: newStock,
          ReferenciaId: saleId.toString(),
          Motivo: "Venta masiva Nro: " + saleId.toString().substring(18),
          CreadoPor: company.ownerId,
          CreadoPorNombre: company.ownerName,
          FechaCreacion: date
        });
      });
    }
  }

  print("Completed transaction seeding for: " + company.name);
});

print("--------------------------------------------------");
print("Massive seeding complete! All tables populated!");
print("Database is ready to be used on the new computer.");
print("--------------------------------------------------");
