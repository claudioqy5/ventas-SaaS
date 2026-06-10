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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item">📦 <span class="sidebar-text">Productos</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/categories" class="nav-item">🏷️ <span class="sidebar-text">Categorías</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('clientes')" to="/clients" class="nav-item">👥 <span class="sidebar-text">Clientes</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item">🏢 <span class="sidebar-text">Proveedores</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('compras')" to="/purchases" class="nav-item active">💵 <span class="sidebar-text">Compras</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item">👥 <span class="sidebar-text">Colaboradores</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 <span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">💵 Abastecimiento y Compras</h1>
            <p class="text-subtitle">Registra compras a tus proveedores y consulta tu historial de costos</p>
          </div>
          <div class="header-actions">
            <button @click="showRegisterForm = !showRegisterForm" class="btn btn-primary">
              {{ showRegisterForm ? '📋 Ver Historial' : '➕ Registrar Compra' }}
            </button>
          </div>
        </div>
      </header>

      <!-- Section A: Register Purchase Form -->
      <div v-if="showRegisterForm" class="card font-card form-container">
        <h2 class="section-title">➕ Nueva Compra / Ingreso de Almacén</h2>
        
        <form @submit.prevent="submitPurchase" class="grid">
          <div class="grid grid-2">
            <div class="field">
              <label>Seleccionar Proveedor</label>
              <select v-model="form.proveedorId" required>
                <option value="" disabled>Seleccione un proveedor...</option>
                <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.nombre }}</option>
              </select>
            </div>
            <div class="field">
              <label>Agregar Producto a Abastecer</label>
              <select @change="addProductToItems" v-model="selectedProductId">
                <option value="" disabled>Seleccione un producto para añadir...</option>
                <option v-for="prod in products" :key="prod.id" :value="prod.id">{{ prod.nombre }} (Stock: {{ prod.stock }})</option>
              </select>
            </div>
          </div>

          <!-- Restocked Items List -->
          <div class="restock-items">
            <h3>📦 Detalles de los Productos</h3>
            <div v-if="form.detalles.length === 0" class="empty-items">
              Añade al menos un producto de la lista desplegable de arriba.
            </div>
            
            <div v-else v-for="(item, idx) in form.detalles" :key="item.productoId" class="item-row">
              <div class="item-name-cell">
                <strong>{{ item.nombreProducto }}</strong>
              </div>
              
              <div class="field qty-cell">
                <label>Cantidad</label>
                <input v-model.number="item.cantidad" type="number" min="1" required />
              </div>
              
              <div class="field price-cell">
                <label>Costo Unitario Compra ($)</label>
                <input v-model.number="item.precioCosto" type="number" step="0.01" min="0" required />
              </div>

              <div class="item-total-cell">
                <label>Subtotal</label>
                <span class="subtotal-val">${{ (item.cantidad * item.precioCosto).toFixed(2) }}</span>
              </div>

              <button type="button" @click="removeItem(idx)" class="btn-remove-item">✕</button>
            </div>
          </div>

          <div class="form-footer">
            <div class="grand-total">
              Total Compra: <span>${{ grandTotal.toFixed(2) }}</span>
            </div>
            <button type="submit" class="btn btn-success" :disabled="form.detalles.length === 0 || loading">
              {{ loading ? 'Procesando...' : '📥 Confirmar e Ingresar a Almacén' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Section B: Purchase History Table -->
      <div v-else class="card font-card">
        <h2 class="section-title">📋 Historial de Compras Realizadas</h2>
        <div v-if="purchases.length === 0" class="empty-state">
          No se han registrado compras de inventario todavía.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Productos Comprados</th>
              <th>Total de la Compra</th>
              <th>Registrado Por</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pur in purchases" :key="pur.id">
              <td><code>{{ new Date(pur.fechaCreacion).toLocaleDateString() }}</code></td>
              <td><strong>{{ pur.nombreProveedor }}</strong></td>
              <td>
                <ul class="items-list">
                  <li v-for="item in pur.detalles" :key="item.productoId">
                    {{ item.nombreProducto }} (x{{ item.cantidad }} uds)
                  </li>
                </ul>
              </td>
              <td><span class="total-badge">${{ pur.total.toFixed(2) }}</span></td>
              <td>{{ pur.creadoPorNombre || 'Administrador' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const showRegisterForm = ref(false)
const loading = ref(false)
const selectedProductId = ref('')

const purchases = ref([])
const suppliers = ref([])
const products = ref([])

const form = reactive({
  proveedorId: '',
  detalles: []
})

const grandTotal = computed(() => {
  return form.detalles.reduce((sum, item) => sum + (item.cantidad * item.precioCosto), 0)
})

const fetchPurchases = async () => {
  try {
    const res = await fetch('http://localhost:5246/api/purchases', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    purchases.value = await res.json()
  } catch (err) {
    console.error('Error fetching purchases history')
  }
}

const fetchSuppliers = async () => {
  try {
    const res = await fetch('http://localhost:5246/api/suppliers', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    suppliers.value = await res.json()
  } catch (err) {
    console.error('Error fetching suppliers')
  }
}

const fetchProducts = async () => {
  try {
    const res = await fetch('http://localhost:5246/api/products', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    products.value = await res.json()
  } catch (err) {
    console.error('Error fetching products list')
  }
}

const addProductToItems = () => {
  if (!selectedProductId.value) return
  
  const existing = form.detalles.find(item => item.productoId === selectedProductId.value)
  if (existing) {
    existing.cantidad++
  } else {
    const prod = products.value.find(p => p.id === selectedProductId.value)
    form.detalles.push({
      productoId: prod.id,
      nombreProducto: prod.nombre,
      cantidad: 1,
      precioCosto: prod.precioCosto
    })
  }
  selectedProductId.value = '' // Reset selector
}

const removeItem = (idx) => {
  form.detalles.splice(idx, 1)
}

const submitPurchase = async () => {
  loading.value = true
  try {
    const selectedSup = suppliers.value.find(s => s.id === form.proveedorId)
    const payload = {
      proveedorId: form.proveedorId,
      nombreProveedor: selectedSup ? selectedSup.nombre : 'Proveedor',
      detalles: form.detalles
    }

    const res = await fetch('http://localhost:5246/api/purchases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al procesar el ingreso de almacén.')
    }

    alert('¡Compra registrada e inventario actualizado con éxito!')
    form.proveedorId = ''
    form.detalles = []
    showRegisterForm.value = false
    fetchPurchases()
    fetchProducts()
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchPurchases()
  fetchSuppliers()
  fetchProducts()
})
</script>

<style scoped>

.content-header {
  margin-bottom: 30px;
  text-align: left;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: left;
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

.total-badge {
  font-weight: 700;
  color: var(--text-main);
  background-color: var(--warning);
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.95rem;
}

.items-list {
  padding-left: 16px;
  margin: 0;
}

/* Form Styles */
.form-container {
  text-align: left;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.restock-items {
  margin-top: 24px;
  border-top: 1px dashed var(--border-color);
  padding-top: 20px;
}

.restock-items h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.empty-items {
  padding: 30px;
  background-color: var(--bg-app);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  text-align: center;
}

.item-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding: 14px;
  background-color: var(--bg-app);
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
}

.item-name-cell {
  flex-grow: 1;
  font-size: 1rem;
  margin-bottom: 8px;
}

.qty-cell {
  width: 100px;
}

.price-cell {
  width: 180px;
}

.item-total-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 120px;
}

.subtotal-val {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.btn-remove-item {
  background: var(--danger);
  color: #7f1d1d;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  transition: var(--transition);
}

.btn-remove-item:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(255, 207, 210, 0.4);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  border-top: 1px dashed var(--border-color);
  padding-top: 20px;
}

.grand-total {
  font-size: 1.3rem;
  font-weight: 500;
}

.grand-total span {
  font-weight: 700;
  color: var(--text-main);
  background-color: var(--warning);
  padding: 6px 16px;
  border-radius: 99px;
}
</style>
