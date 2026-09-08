const fs = require('fs');
let content = fs.readFileSync('Frontend/src/views/Products.vue', 'utf8');

// 1. Add fetchAttributeTypes to script setup
const targetFetch = `const fetchCategories = async () => {`;
const replaceFetch = `const attributeTypes = ref([])
const fetchAttributeTypes = async () => {
  try {
    const res = await fetch(\`\${API_URL}/api/attributes\`, {
      headers: { 'Authorization': \`Bearer \${authStore.token}\` }
    })
    if (!res.ok) throw new Error()
    attributeTypes.value = await res.json()
  } catch (err) {
    console.error('Error fetching attributes')
  }
}
const fetchCategories = async () => {`;
if (!content.includes('fetchAttributeTypes')) {
    content = content.replace(targetFetch, replaceFetch);
}

// 2. Call fetchAttributeTypes in onMounted
const targetMounted = `  fetchCategories()\n  fetchBrands()\n  fetchInventoryStats()`;
const replaceMounted = `  fetchCategories()\n  fetchBrands()\n  fetchAttributeTypes()\n  fetchInventoryStats()`;
if (!content.includes('fetchAttributeTypes()')) {
    content = content.replace(targetMounted, replaceMounted);
}

// 3. Update the template where attributes are added
const targetTemplate = `              <div v-for="(attr, idx) in form.atributos" :key="idx" style="display: grid; grid-template-columns: 1fr 1fr 30px; gap: 8px; margin-bottom: 8px; align-items: center;">
                <input v-model="attr.nombre" type="text" placeholder="Ej: Color" style="padding: 6px; font-size: 0.85rem; border-radius: 4px; border: 1px solid #cbd5e1;" required />
                <input v-model="attr.valor" type="text" placeholder="Ej: Negro" style="padding: 6px; font-size: 0.85rem; border-radius: 4px; border: 1px solid #cbd5e1;" required />
                <button type="button" @click="form.atributos.splice(idx, 1)" style="background: #ef4444; color: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer;">✕</button>
              </div>`;
const replaceTemplate = `              <div v-for="(attr, idx) in form.atributos" :key="idx" style="display: grid; grid-template-columns: 1fr 1fr 30px; gap: 8px; margin-bottom: 8px; align-items: center;">
                <select v-model="attr.nombre" style="padding: 6px; font-size: 0.85rem; border-radius: 4px; border: 1px solid #cbd5e1;" required>
                  <option value="" disabled>Seleccionar Atributo</option>
                  <option v-for="type in attributeTypes" :key="type.id" :value="type.nombre">{{ type.nombre }}</option>
                </select>
                <select v-model="attr.valor" style="padding: 6px; font-size: 0.85rem; border-radius: 4px; border: 1px solid #cbd5e1;" required>
                  <option value="" disabled>Seleccionar Valor</option>
                  <template v-for="type in attributeTypes" :key="'opt-'+type.id">
                    <template v-if="type.nombre === attr.nombre">
                      <option v-for="opt in type.opciones" :key="opt" :value="opt">{{ opt }}</option>
                    </template>
                  </template>
                </select>
                <button type="button" @click="form.atributos.splice(idx, 1)" style="background: #ef4444; color: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer;">✕</button>
              </div>`;
if (!content.includes('attributeTypes')) {
    content = content.replace(targetTemplate, replaceTemplate);
}

fs.writeFileSync('Frontend/src/views/Products.vue', content);
console.log('Fixed Products.vue attributes UI');
