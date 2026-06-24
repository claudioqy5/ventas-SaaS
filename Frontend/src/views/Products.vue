<template>
  <div class="dashboard-layout">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-brand">🍦 <span class="sidebar-text">{{ authStore.user?.nombreEmpresa || 'VentasSaaS' }}</span></div>
      <div class="user-info">
        <p class="user-name">Hola, {{ authStore.user?.nombre }}</p>
        <span class="user-badge">{{ authStore.user?.rol }}</span>
      </div>
      <nav class="nav-links">
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item">📊 <span class="sidebar-text">Dashboard</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('ventas')" to="/pos" class="nav-item">🛒 <span class="sidebar-text">POS Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item">📋 <span class="sidebar-text">Historial Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item active">📦 <span class="sidebar-text">Productos</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item">🏷️ <span class="sidebar-text">Categorías</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('clientes')" to="/clients" class="nav-item">👥 <span class="sidebar-text">Clientes</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item">🏢 <span class="sidebar-text">Proveedores</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('compras')" to="/purchases" class="nav-item">💵 <span class="sidebar-text">Compras</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item">👥 <span class="sidebar-text">Colaboradores</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 <span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">📦 Gestión de Productos</h1>
            <p class="text-subtitle">Registra nuevos productos y ajusta el stock</p>
          </div>
          <button v-if="authStore.hasPermission('modificar_productos')" @click="openAddModal" class="btn btn-primary">➕ Agregar Producto</button>
        </div>
      </header>

      <!-- Filters -->
      <div class="table-filters card">
        <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, código o descripción..." class="filter-input" />
        <select v-model="selectedCategory" class="filter-select">
          <option value="">🏷️ Todas las Categorías</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
        </select>
      </div>

      <!-- Products Inventory Table -->
      <div class="card font-card">
        <div v-if="filteredProducts.length === 0" class="empty-state">
          No hay productos que coincidan con la búsqueda.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">N°</th>
              <th>Código</th>
              <th>Producto</th>
              <th>Costo</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th>Estado</th>
              <th v-if="authStore.hasPermission('modificar_productos')">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(prod, index) in filteredProducts" :key="prod.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td><code>{{ prod.codigoBarras }}</code></td>
              <td>
                <div class="product-info-cell">
                  <img :src="prod.imagenUrl || defaultImage" class="product-thumbnail" alt="thumbnail" />
                  <strong>{{ prod.nombre }}</strong>
                </div>
              </td>
              <td>S/. {{ prod.precioCosto.toFixed(2) }}</td>
              <td>S/. {{ prod.precio.toFixed(2) }}</td>
              <td>
                <span :class="['stock-badge', prod.stock <= prod.stockMinimo ? 'low' : 'ok']">
                  {{ prod.stock }} unidades
                </span>
              </td>
              <td>
                <span v-if="prod.stock <= prod.stockMinimo" class="status-indicator low">⚠️ Reabastecer</span>
                <span v-else class="status-indicator ok">✅ Activo</span>
              </td>
              <td v-if="authStore.hasPermission('modificar_productos')">
                <div class="actions-cell">
                  <button @click="openEditModal(prod)" class="btn-action edit" title="Editar">✏️</button>
                  <button @click="confirmDelete(prod.id)" class="btn-action delete" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Product Modal Dialog -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title">{{ isEdit ? '✏️ Editar Producto' : '📦 Registrar Producto' }}</h2>
          <form @submit.prevent="saveProduct" class="grid">
            <div class="grid grid-2">
              <div class="field">
                <label>Nombre del Producto</label>
                <input v-model="form.nombre" type="text" placeholder="Ej. Pastel de Fresas" required />
              </div>
              <div class="field">
                <label>Código de Barra / SKU</label>
                <input v-model="form.codigoBarras" type="text" placeholder="7501234567" required />
              </div>
            </div>

            <div class="grid grid-3">
              <div class="field">
                <label>Precio Costo (S/.)</label>
                <input v-model.number="form.precioCosto" type="number" step="0.01" required />
              </div>
              <div class="field">
                <label>Precio Venta (S/.)</label>
                <input v-model.number="form.precio" type="number" step="0.01" required />
              </div>
              <div class="field">
                <label>{{ isEdit ? 'Stock Actual' : 'Stock Inicial' }}</label>
                <input v-model.number="form.stock" type="number" :disabled="isEdit" required />
              </div>
            </div>

            <div class="grid grid-2">
              <div class="field">
                <label>Categoría</label>
                <select v-model="form.categoriaId" required>
                  <option value="" disabled>Seleccione una categoría...</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
                </select>
              </div>
              <div class="field">
                <label>Stock Mínimo Alerta</label>
                <input v-model.number="form.stockMinimo" type="number" required />
              </div>
            </div>

            <div class="field">
              <label>Descripción</label>
              <input v-model="form.descripcion" type="text" placeholder="Ej. Pastel húmedo sabor fresa" />
            </div>

            <div class="grid grid-2">
              <div class="field">
                <label>URL de la Imagen</label>
                <input v-model="form.imagenUrl" type="url" placeholder="https://ejemplo.com/imagen.jpg" />
              </div>
              <div class="field">
                <label>Vista Previa</label>
                <div class="image-preview-box">
                  <img v-if="form.imagenUrl" :src="form.imagenUrl" class="preview-img" alt="Vista previa" />
                  <span v-else class="preview-placeholder">Sin imagen</span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Guardar Producto' }}</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const products = ref([])
const categories = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentProductId = ref(null)

const searchQuery = ref('')
const selectedCategory = ref('')

const defaultImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'><rect width='100%25' height='100%25' fill='%23f1f5f9'/><path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='M11 11.5L5 17h14l-4.5-6-3.5 4.5z'/></svg>"

const filteredProducts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => {
    const matchesSearch = (p.nombre && p.nombre.toLowerCase().includes(q)) || 
                          (p.codigoBarras && p.codigoBarras.toLowerCase().includes(q)) ||
                          (p.descripcion && p.descripcion.toLowerCase().includes(q))
    const matchesCategory = !selectedCategory.value || p.categoriaId === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const form = reactive({
  nombre: '',
  codigoBarras: '',
  precioCosto: 0,
  precio: 0,
  stock: 0,
  stockMinimo: 5,
  descripcion: '',
  categoriaId: '',
  imagenUrl: ''
})

const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    products.value = await res.json()
  } catch (err) {
    console.error('Error fetching inventory products')
  }
}

const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    categories.value = await res.json()
  } catch (err) {
    console.error('Error fetching categories')
  }
}

const openAddModal = () => {
  isEdit.value = false
  currentProductId.value = null
  form.nombre = ''
  form.codigoBarras = ''
  form.precioCosto = 0
  form.precio = 0
  form.stock = 0
  form.stockMinimo = 5
  form.descripcion = ''
  form.categoriaId = ''
  form.imagenUrl = ''
  showModal.value = true
}

const openEditModal = (product) => {
  isEdit.value = true
  currentProductId.value = product.id
  form.nombre = product.nombre
  form.codigoBarras = product.codigoBarras
  form.precioCosto = product.precioCosto
  form.precio = product.precio
  form.stock = product.stock
  form.stockMinimo = product.stockMinimo
  form.descripcion = product.descripcion
  form.categoriaId = product.categoriaId
  form.imagenUrl = product.imagenUrl || ''
  showModal.value = true
}

const saveProduct = async () => {
  if (!form.categoriaId) {
    alert('Por favor seleccione una categoría.')
    return
  }

  try {
    const url = isEdit.value
      ? `${API_URL}/api/products/${currentProductId.value}`
      : `${API_URL}/api/products`
    const method = isEdit.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(form)
    })
    if (!res.ok) throw new Error('Error al guardar el producto.')
    
    showModal.value = false
    alert(isEdit.value ? '¡Producto actualizado con éxito!' : '¡Producto agregado al inventario con éxito!')
    fetchProducts()
  } catch (err) {
    alert(err.message)
  }
}

const confirmDelete = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) return
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (!res.ok) throw new Error('Error al eliminar el producto.')
    alert('¡Producto eliminado con éxito!')
    fetchProducts()
  } catch (err) {
    alert(err.message)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<style scoped>

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-action {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: var(--transition);
}

.btn-action:hover {
  background-color: var(--border-color);
  transform: scale(1.15);
}

.content-header {
  margin-bottom: 30px;
  text-align: left;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  color: var(--text-muted);
  padding: 40px;
  text-align: center;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th, .data-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  font-weight: 600;
  color: var(--text-muted);
}

.stock-badge {
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
}

.stock-badge.ok {
  background-color: #d1fae5;
  color: #065f46;
}

.stock-badge.low {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-indicator {
  font-size: 0.85rem;
  font-weight: 600;
}

.status-indicator.ok {
  color: #059669;
}

.status-indicator.low {
  color: #dc2626;
}

/* Modal overlays and dialog cards */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  text-align: left;
}

.product-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-thumbnail {
  width: 45px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  background-color: var(--bg-app);
  transition: transform 0.2s;
}

.product-thumbnail:hover {
  transform: scale(1.1);
}

.table-filters {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  background-color: #ffffff;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  align-items: center;
}

.filter-input {
  flex-grow: 1;
  padding: 10px 16px 10px 40px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  font-size: 0.95rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
  background-size: 18px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filter-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.filter-select {
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: #ffffff;
  color: var(--text-main);
  font-weight: 500;
  outline: none;
}

.image-preview-box {
  width: 100%;
  height: 42px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--bg-app);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
