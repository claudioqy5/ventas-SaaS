const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/FAMHURP/Desktop/CFQY/VENTASSAAS/ventas-SaaS/Frontend/src/views';

const files = fs.readdirSync(directory).filter(f => f.endsWith('.vue'));

const svgIcon = (pathData) => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="${pathData}"/></svg>`;

const ICONS = {
  'Dashboard': svgIcon('M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3'),
  'Historial de Negocio': svgIcon('M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'),
  'POS Ventas': svgIcon('M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0'),
  'Historial Ventas': svgIcon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8'),
  'Cuentas por Cobrar': svgIcon('M2 7v10 M6 5v14 M10 3v18 M14 5v14 M18 7v10 M22 9v6'), // Actually let's use a standard wallet
  'Cuentas por Cobrar2': svgIcon('M21 12V7H5a2 2 0 0 1 0-4h14v2 M3 5v14a2 2 0 0 0 2 2h16v-5 M18 12a2 2 0 0 0 0 4h4v-4Z'),
  'Formas de Pago': svgIcon('M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4 M2 13v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4 M2 9h20 M2 13h20'),
  'Inventario': svgIcon('M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'),
  'Categorías': svgIcon('M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'),
  'Movimientos': svgIcon('M21 2v6h-6 M3 12a9 9 0 0 1 15-6.7L21 8 M3 22v-6h6 M21 12a9 9 0 0 1-15 6.7L3 16'),
  'Proveedores': svgIcon('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75'),
  'Compras': svgIcon('M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18'),
  'Clientes': svgIcon('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'),
  'Recordatorios': svgIcon('M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0'),
  'Colaboradores': svgIcon('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75'),
  'Cerrar Sesión': svgIcon('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9')
};

for (const file of files) {
  const filePath = path.join(directory, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match router-links and replace the icon character with SVG
  content = content.replace(/<router-link[^>]+>\s*(?:[◫▸❖≡▫▪⬦⟳⌂✧⚇◦↪]?)\s*<span class="sidebar-text">([^<]+)<\/span><\/router-link>/g, (match, text) => {
    let svg = '';
    if (text === 'Dashboard') svg = ICONS['Dashboard'];
    else if (text === 'Historial de Negocio') svg = ICONS['Historial de Negocio'];
    else if (text === 'POS Ventas') svg = ICONS['POS Ventas'];
    else if (text === 'Historial Ventas') svg = ICONS['Historial Ventas'];
    else if (text === 'Cuentas por Cobrar') svg = ICONS['Cuentas por Cobrar2'];
    else if (text === 'Formas de Pago') svg = ICONS['Formas de Pago'];
    else if (text === 'Inventario') svg = ICONS['Inventario'];
    else if (text === 'Categorías') svg = ICONS['Categorías'];
    else if (text === 'Movimientos') svg = ICONS['Movimientos'];
    else if (text === 'Proveedores') svg = ICONS['Proveedores'];
    else if (text === 'Compras') svg = ICONS['Compras'];
    else if (text === 'Clientes') svg = ICONS['Clientes'];
    else if (text === 'Recordatorios') svg = ICONS['Recordatorios'];
    else if (text === 'Colaboradores') svg = ICONS['Colaboradores'];

    if (svg) {
      return match.replace(/(?:[◫▸❖≡▫▪⬦⟳⌂✧⚇◦↪]?)\s*<span/, `${svg} <span`);
    }
    return match;
  });
  
  // also replace button for logout
  content = content.replace(/<button[^>]+>\s*↪\s*<span class="sidebar-text">Cerrar Sesión<\/span><\/button>/g, (match) => {
     return match.replace(/↪\s*<span/, `${ICONS['Cerrar Sesión']} <span`);
  });
  
  // Replace the brand icon
  content = content.replace(/<div class="sidebar-brand"><span>◈<\/span>/g, `<div class="sidebar-brand">${svgIcon('M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5')}`);

  fs.writeFileSync(filePath, content);
}
console.log('Sidebar icons replaced');
