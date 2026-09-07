const fs = require('fs');
let content = fs.readFileSync('Frontend/src/views/Products.vue', 'utf8');

// Helper for CRLF / LF replace
const replaceAnyLineEndings = (text, search, replace) => {
    const searchRegex = new RegExp(search.replace(/\n/g, '\\r?\\n'), 'g');
    return text.replace(searchRegex, replace);
};

// --- FIX MARCAID ---
// 1. Grid
content = replaceAnyLineEndings(content, 
`            <!-- FILA 1: Nombre (span 2) y Categoría (span 1) -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
              <div class="field">
                <label>Nombre del Producto</label>
                <input v-model="form.nombre" type="text" placeholder="Ej. Alimento Royal Canin" required />
              </div>
              <div class="field">
                <label>Categoría</label>
                <select v-model="form.categoriaId" required>
                  <option value="" disabled>Seleccione...</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
                </select>
              </div>
            </div>`,
`            <!-- FILA 1: Nombre (span 2), Categoría (span 1) y Marca (span 1) -->
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px;">
              <div class="field">
                <label>Nombre del Producto</label>
                <input v-model="form.nombre" type="text" placeholder="Ej. Alimento Royal Canin" required />
              </div>
              <div class="field">
                <label>Categoría</label>
                <select v-model="form.categoriaId" required>
                  <option value="" disabled>Seleccione...</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
                </select>
              </div>
              <div class="field">
                <label>Marca</label>
                <select v-model="form.marcaId">
                  <option value="" disabled>Seleccione...</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.nombre }}</option>
                </select>
              </div>
            </div>`
);

// 2. Refs
content = replaceAnyLineEndings(content, `const categories = ref([])\nconst showModal = ref(false);`, `const categories = ref([])\nconst brands = ref([])\nconst showModal = ref(false);`);

// 3. fetchBrands
const target4 = `const fetchCategories = async () => {
  try {
    const res = await fetch(\`\${API_URL}/api/categories\`, {
      headers: { 'Authorization': \`Bearer \${authStore.token}\` }
    })
    if (!res.ok) throw new Error()
    categories.value = await res.json()
  } catch (err) {
    console.error('Error fetching categories')
  }
}`;
if (!content.includes('fetchBrands')) {
    content = replaceAnyLineEndings(content, target4, target4 + `\n\nconst fetchBrands = async () => {
  try {
    const res = await fetch(\`\${API_URL}/api/brands\`, {
      headers: { 'Authorization': \`Bearer \${authStore.token}\` }
    })
    if (!res.ok) throw new Error()
    brands.value = await res.json()
  } catch (err) {
    console.error('Error fetching brands')
  }
}`);
}

// 7. onMounted
content = replaceAnyLineEndings(content, `fetchCategories()\n  fetchInventoryStats()`, `fetchCategories()\n  fetchBrands()\n  fetchInventoryStats()`);

// --- ATTRIBUTES ---

// Form reactive
content = replaceAnyLineEndings(content, `  categoriaId: '',\n  imagenUrl: '',`, `  categoriaId: '',\n  marcaId: '',\n  imagenUrl: '',\n  atributos: [],`);

// openAddModal
content = replaceAnyLineEndings(content, `  form.categoriaId = ''\n  form.imagenUrl = ''`, `  form.categoriaId = ''\n  form.marcaId = ''\n  form.imagenUrl = ''\n  form.atributos = []`);

// openEditModal
content = replaceAnyLineEndings(content, `  form.categoriaId = product.categoriaId\n  form.imagenUrl = product.imagenUrl || ''`, `  form.categoriaId = product.categoriaId\n  form.marcaId = product.marcaId || ''\n  form.imagenUrl = product.imagenUrl || ''\n  form.atributos = product.atributos ? JSON.parse(JSON.stringify(product.atributos)) : []`);

// UI for attributes before FILA 6
const fila6UI = `            <!-- FILA 6: Subida de imágenes múltiples -->`;
const attributesUI = `            <!-- ATRIBUTOS DINÁMICOS -->
            <div style="background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; margin-top: 12px; margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="font-size: 0.75rem; font-weight: 500; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
                  📋 Especificaciones (Opcional)
                </div>
                <button type="button" @click="form.atributos.push({nombre: '', valor: ''})" class="btn btn-secondary-compact" style="font-size: 0.75rem; padding: 4px 8px;">➕ Añadir Atributo</button>
              </div>
              <div v-if="form.atributos.length === 0" style="font-size: 0.8rem; color: var(--text-muted);">Sin atributos. Puedes agregar color, material, talla, etc.</div>
              <div v-for="(attr, idx) in form.atributos" :key="idx" style="display: grid; grid-template-columns: 1fr 1fr 30px; gap: 8px; margin-bottom: 8px; align-items: center;">
                <input v-model="attr.nombre" type="text" placeholder="Ej: Color" style="padding: 6px; font-size: 0.85rem; border-radius: 4px; border: 1px solid #cbd5e1;" required />
                <input v-model="attr.valor" type="text" placeholder="Ej: Negro" style="padding: 6px; font-size: 0.85rem; border-radius: 4px; border: 1px solid #cbd5e1;" required />
                <button type="button" @click="form.atributos.splice(idx, 1)" style="background: #ef4444; color: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer;">✕</button>
              </div>
            </div>

            <!-- FILA 6: Subida de imágenes múltiples -->`;
content = replaceAnyLineEndings(content, fila6UI, attributesUI);


fs.writeFileSync('Frontend/src/views/Products.vue', content);
console.log('Products.vue updated successfully with Marcas and Atributos.');
