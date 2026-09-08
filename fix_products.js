const fs = require('fs');
let content = fs.readFileSync('Frontend/src/views/Products.vue', 'utf8');

const t1 = `            <!-- FILA 1: Nombre (span 2) y Categoría (span 1) -->
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
            </div>`;
const r1 = `            <!-- FILA 1: Nombre (span 2), Categoría (span 1) y Marca (span 1) -->
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
            </div>`;

const t2 = `            <!-- FILA 6: Subida de imágenes múltiples -->`;
const r2 = `            <!-- ATRIBUTOS DINÁMICOS -->
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

const t3 = `const categories = ref([])\r\nconst showModal = ref(false);`;
const r3 = `const categories = ref([])\nconst brands = ref([])\nconst showModal = ref(false);`;

const t3_fallback = `const categories = ref([])\nconst showModal = ref(false);`;

const t4 = `const fetchCategories = async () => {
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
const r4 = `const fetchCategories = async () => {
  try {
    const res = await fetch(\`\${API_URL}/api/categories\`, {
      headers: { 'Authorization': \`Bearer \${authStore.token}\` }
    })
    if (!res.ok) throw new Error()
    categories.value = await res.json()
  } catch (err) {
    console.error('Error fetching categories')
  }
}

const fetchBrands = async () => {
  try {
    const res = await fetch(\`\${API_URL}/api/brands\`, {
      headers: { 'Authorization': \`Bearer \${authStore.token}\` }
    })
    if (!res.ok) throw new Error()
    brands.value = await res.json()
  } catch (err) {
    console.error('Error fetching brands')
  }
}`;

const t5 = `  fetchCategories()\r\n  fetchInventoryStats()`;
const r5 = `  fetchCategories()\n  fetchBrands()\n  fetchInventoryStats()`;

const t5_fallback = `  fetchCategories()\n  fetchInventoryStats()`;

const t6 = `  categoriaId: '',\r\n  imagenUrl: '',`;
const r6 = `  categoriaId: '',\n  marcaId: '',\n  imagenUrl: '',\n  atributos: [],`;

const t6_fallback = `  categoriaId: '',\n  imagenUrl: '',`;

const t7 = `  form.categoriaId = ''\r\n  form.imagenUrl = ''`;
const r7 = `  form.categoriaId = ''\n  form.marcaId = ''\n  form.imagenUrl = ''\n  form.atributos = []`;

const t7_fallback = `  form.categoriaId = ''\n  form.imagenUrl = ''`;

const t8 = `  form.categoriaId = product.categoriaId\r\n  form.imagenUrl = product.imagenUrl || ''`;
const r8 = `  form.categoriaId = product.categoriaId\n  form.marcaId = product.marcaId || ''\n  form.imagenUrl = product.imagenUrl || ''\n  form.atributos = product.atributos ? JSON.parse(JSON.stringify(product.atributos)) : []`;

const t8_fallback = `  form.categoriaId = product.categoriaId\n  form.imagenUrl = product.imagenUrl || ''`;

// Safe literal replace by normalizing newlines first
const normalize = (str) => str.replace(/\\r\\n/g, '\\n');
content = normalize(content);

content = content.replace(normalize(t1), normalize(r1));
content = content.replace(normalize(t2), normalize(r2));
content = content.replace(normalize(t3_fallback), normalize(r3));
content = content.replace(normalize(t4), normalize(r4));
content = content.replace(normalize(t5_fallback), normalize(r5));
content = content.replace(normalize(t6_fallback), normalize(r6));
content = content.replace(normalize(t7_fallback), normalize(r7));
content = content.replace(normalize(t8_fallback), normalize(r8));

// Add payload to payload mapper in submit function (saveProduct)
const t9 = `    const payload = {
      ...form
    }`;
const r9 = `    const payload = {
      ...form,
      atributos: form.atributos
    }`;
content = content.replace(normalize(t9), normalize(r9));

fs.writeFileSync('Frontend/src/views/Products.vue', content);
console.log('Done replacement.');
