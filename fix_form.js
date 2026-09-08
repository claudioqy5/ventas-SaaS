const fs = require('fs');
let content = fs.readFileSync('Frontend/src/views/Products.vue', 'utf8');

const normalize = (str) => str.replace(/\r\n/g, '\n');
content = normalize(content);

// Fix form reactive object
const t6 = `  categoriaId: '',\n  imagenUrl: '',\n  imagenes: [],`;
const r6 = `  categoriaId: '',\n  marcaId: '',\n  imagenUrl: '',\n  atributos: [],\n  imagenes: [],`;
if (!content.includes('atributos: [],\n  imagenes: [],')) {
    content = content.replace(t6, r6);
}

// Fix openAddModal
const t7 = `  form.categoriaId = ''\n  form.imagenUrl = ''\n  form.imagenes = []`;
const r7 = `  form.categoriaId = ''\n  form.marcaId = ''\n  form.imagenUrl = ''\n  form.atributos = []\n  form.imagenes = []`;
if (!content.includes('form.atributos = []\n  form.imagenes = []')) {
    content = content.replace(t7, r7);
}

// Fix openEditModal
const t8 = `  form.categoriaId = product.categoriaId\n  form.imagenUrl = product.imagenUrl || ''\n  form.imagenes = product.imagenes || []`;
const r8 = `  form.categoriaId = product.categoriaId\n  form.marcaId = product.marcaId || ''\n  form.imagenUrl = product.imagenUrl || ''\n  form.atributos = product.atributos ? JSON.parse(JSON.stringify(product.atributos)) : []\n  form.imagenes = product.imagenes || []`;
if (!content.includes('form.atributos = product.atributos')) {
    content = content.replace(t8, r8);
}

fs.writeFileSync('Frontend/src/views/Products.vue', content);
console.log('Fixed missing form attributes.');
