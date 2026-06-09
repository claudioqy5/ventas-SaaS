<template>
  <div class="dashboard-layout">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-brand">🍦 VentasSaaS</div>
      <div class="user-info">
        <p class="user-name">Hola, {{ authStore.user?.nombre }}</p>
        <span class="user-badge">{{ authStore.user?.rol }}</span>
      </div>
      <nav class="nav-links">
        <router-link to="/dashboard" class="nav-item">📊 Dashboard</router-link>
        <router-link to="/pos" class="nav-item">🛒 POS Ventas</router-link>
        <router-link to="/products" class="nav-item active">📦 Productos</router-link>
        <router-link to="/categories" class="nav-item">🏷️ Categorías</router-link>
        <router-link v-if="authStore.hasPermission('clientes')" to="/clients" class="nav-item">👥 Clientes</router-link>
        <router-link v-if="authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item">🏢 Proveedores</router-link>
        <router-link v-if="authStore.hasPermission('compras')" to="/purchases" class="nav-item">💵 Compras</router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item">👥 Colaboradores</router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 Cerrar Sesión</button>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">📦 Gestión de Productos</h1>
            <p class="text-subtitle">Registra nuevos productos y ajusta el stock</p>
          </div>
          <button @click="openAddModal" class="btn btn-primary">➕ Agregar Producto</button>
        </div>
      </header>

      <!-- Products Inventory Table -->
      <div class="card font-card">
        <div v-if="products.length === 0" class="empty-state">
          No hay productos registrados en el inventario.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Costo</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in products" :key="prod.id">
              <td><code>{{ prod.codigoBarras }}</code></td>
              <td><strong>{{ prod.nombre }}</strong></td>
              <td>${{ prod.precioCosto.toFixed(2) }}</td>
              <td>${{ prod.precio.toFixed(2) }}</td>
              <td>
                <span :class="['stock-badge', prod.stock <= prod.stockMinimo ? 'low' : 'ok']">
                  {{ prod.stock }} unidades
                </span>
              </td>
              <td>
                <span v-if="prod.stock <= prod.stockMinimo" class="status-indicator low">⚠️ Reabastecer</span>
                <span v-else class="status-indicator ok">✅ Activo</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Product Modal Dialog -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title">📦 Registrar Producto</h2>
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
                <label>Precio Costo ($)</label>
                <input v-model.number="form.precioCosto" type="number" step="0.01" required />
              </div>
              <div class="field">
                <label>Precio Venta ($)</label>
                <input v-model.number="form.precio" type="number" step="0.01" required />
              </div>
              <div class="field">
                <label>Stock Inicial</label>
                <input v-model.number="form.stock" type="number" required />
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

            <div class="modal-actions">
              <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">Guardar Producto</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const products = ref([])
const categories = ref([])
const showModal = ref(false)

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
    const res = await fetch('http://localhost:5246/api/products', {
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
    const res = await fetch('http://localhost:5246/api/categories', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    categories.value = await res.json()
  } catch (err) {
    console.error('Error fetching categories')
  }
}

const openAddModal = () => {
  form.nombre = ''
  form.codigoBarras = ''
  form.precioCosto = 0
  form.precio = 0
  form.stock = 0
  form.stockMinimo = 5
  form.descripcion = ''
  form.categoriaId = ''
  showModal.value = true
}

const saveProduct = async () => {
  if (!form.categoriaId) {
    alert('Por favor seleccione una categoría.')
    return
  }

  try {
    const res = await fetch('http://localhost:5246/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(form)
    })
    if (!res.ok) throw new Error('Error al guardar el producto.')
    
    showModal.value = false
    alert('¡Producto agregado al inventario con éxito!')
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
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar Styling */
.sidebar {
  width: 280px;
  background-color: #ffffff;
  border-right: 1px solid var(--border-color);
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex-shrink: 0;
}

.sidebar-brand {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-main);
}

.user-info {
  background: var(--bg-app);
  padding: 16px;
  border-radius: var(--radius-md);
  text-align: left;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.user-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #1e3a8a;
  background: var(--primary);
  padding: 2px 8px;
  border-radius: 99px;
  display: inline-block;
  margin-top: 4px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.nav-item:hover, .nav-item.active {
  background-color: var(--border-color);
  color: var(--text-main);
}

.logout-btn {
  margin-top: auto;
}

/* Main Area */
.main-content {
  flex-grow: 1;
  padding: 40px;
  background-color: var(--bg-app);
  overflow-y: auto;
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
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  text-align: left;
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
