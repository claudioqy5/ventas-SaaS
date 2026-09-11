<template>
  <div class="dashboard-layout">
    <!-- Barra de navegacion lateral -->
    <aside class="sidebar">
      <div class="sidebar-brand"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"/></svg><span class="sidebar-brand-name">{{ authStore.user?.nombreEmpresa || 'VentasSaaS' }}</span></div>
      <div class="user-info">
        <p class="user-name">Hola, {{ authStore.user?.nombre }}</p>
        <span class="user-badge">{{ authStore.rolEnEspanol }}</span>
      </div>
            <nav class="nav-links">
        <!-- SECCIÓN: ANÁLISIS -->
        <div class="nav-section-title">Análisis</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3"/></svg> <span class="sidebar-text">Dashboard</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_negocio')" to="/business-history" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> <span class="sidebar-text">Historial de Negocio</span></router-link>

        <!-- SECCIÓN: VENTAS -->
        <div class="nav-section-title">Ventas</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('ventas')" to="/pos" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0"/></svg> <span class="sidebar-text">POS Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"/></svg> <span class="sidebar-text">Historial Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('pedidos_web')" to="/online-orders" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><circle cx="12" cy="12" r="10"/><path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> <span class="sidebar-text">Pedidos Web</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('cuentas_cobrar')" to="/credit-sales" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v2 M3 5v14a2 2 0 0 0 2 2h16v-5 M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg> <span class="sidebar-text">Cuentas por Cobrar</span></router-link>
        <router-link v-if="authStore.isSuperadmin || authStore.isEmpresaOwner || authStore.hasPermission('formas_pago')" to="/payment-methods" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M2 9V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4 M2 13v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4 M2 9h20 M2 13h20"/></svg> <span class="sidebar-text">Formas de Pago</span></router-link>

        <!-- SECCIÓN: LOGÍSTICA -->
        <div class="nav-section-title">Logística</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> <span class="sidebar-text">Inventario</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> <span class="sidebar-text">Categorías</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('movimientos')" to="/stock-movements" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M21 2v6h-6 M3 12a9 9 0 0 1 15-6.7L21 8 M3 22v-6h6 M21 12a9 9 0 0 1-15 6.7L3 16"/></svg> <span class="sidebar-text">Movimientos</span></router-link>

        <!-- SECCIÓN: COMPRAS -->
        <div class="nav-section-title">Compras</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"/></svg> <span class="sidebar-text">Proveedores</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('compras')" to="/purchases" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18"/></svg> <span class="sidebar-text">Compras</span></router-link>

        <!-- SECCIÓN: GESTIÓN -->
        <div class="nav-section-title">Gestión</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('clientes')" to="/clients" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> <span class="sidebar-text">Clientes</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('reminders')" to="/reminders" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg> <span class="sidebar-text">Recordatorios</span></router-link>
        <router-link v-if="authStore.isSuperadmin || authStore.isEmpresaOwner || authStore.hasPermission('colaboradores')" to="/users" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"/></svg> <span class="sidebar-text">Colaboradores</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9"/></svg> <span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Area de contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">✧ Abastecimiento y Compras</h1>
            <p class="text-subtitle">Registra compras a tus proveedores y consulta tu historial de costos</p>
          </div>
          <div class="header-actions">
            <button @click="showRegisterForm = !showRegisterForm" class="btn btn-primary">
              {{ showRegisterForm ? '≡ Ver Historial' : '➕ Registrar Compra' }}
            </button>
          </div>
        </div>
      </header>

      <!-- Seccion A: Formulario de ingreso de mercaderia -->
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

          <!-- Lista de productos añadidos al abastecimiento -->
          <div class="restock-items">
            <h3>⬦ Detalles de los Productos</h3>
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
                <label>Costo Unitario Compra (S/.)</label>
                <input v-model.number="item.precioCosto" type="number" step="0.01" min="0" required />
              </div>

              <div class="item-total-cell">
                <label>Subtotal</label>
                <span class="subtotal-val">S/. {{ (item.cantidad * item.precioCosto).toFixed(2) }}</span>
              </div>

              <button type="button" @click="removeItem(idx)" class="btn-remove-item">✕</button>
            </div>
          </div>

          <div class="form-footer">
            <div class="grand-total">
              Total Compra: <span>S/. {{ grandTotal.toFixed(2) }}</span>
            </div>
            <button type="submit" class="btn btn-success" :disabled="form.detalles.length === 0 || loading">
              {{ loading ? 'Procesando...' : '📥 Confirmar e Ingresar a Almacén' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Seccion B: Historial de facturas de compra -->
      <div v-else class="card font-card">
        <h2 class="section-title">≡ Historial de Compras Realizadas</h2>
        
        <!-- Seccion de filtros de busqueda -->
        <div class="table-filters" style="margin-bottom: 20px;">
          <input v-model="searchQuery" type="text" placeholder="Buscar por proveedor..." class="filter-input" />
          <div class="filter-date-group">
            <span>Desde:</span>
            <input v-model="startDate" type="date" class="filter-date" />
            <span>Hasta:</span>
            <input v-model="endDate" type="date" class="filter-date" />
          </div>
        </div>

        <div v-if="filteredPurchases.length === 0" class="empty-state">
          No se han encontrado compras que coincidan con los filtros.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">N°</th>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Productos Comprados</th>
              <th>Total de la Compra</th>
              <th>Registrado Por</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pur, index) in filteredPurchases" :key="pur.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td><code>{{ new Date(pur.fechaCreacion).toLocaleString('es-PE', { timeZone: 'America/Lima', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) }}</code></td>
              <td><strong>{{ pur.nombreProveedor }}</strong></td>
              <td>
                <ul class="items-list">
                  <li v-for="item in pur.detalles" :key="item.productoId">
                    {{ item.nombreProducto }} (x{{ item.cantidad }} uds)
                  </li>
                </ul>
              </td>
              <td><span class="total-badge">S/. {{ pur.total.toFixed(2) }}</span></td>
              <td>{{ /^[0-9a-fA-F]{24}$/.test(pur.creadoPorNombre) ? 'Administrador' : (pur.creadoPorNombre || 'Administrador') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
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

const searchQuery = ref('')
const getTodayDateString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const startDate = ref(getTodayDateString())
const endDate = ref(getTodayDateString())

// Parsear fecha en hora local para evitar problemas de zona horaria (UTC shifts)
const parseLocalDate = (dateStr) => {
  if (!dateStr) return null
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const filteredPurchases = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return purchases.value.filter(p => {
    const matchesSearch = p.nombreProveedor && p.nombreProveedor.toLowerCase().includes(q)
    
    let matchesDate = true
    if (p.fechaCreacion) {
      const pDate = new Date(p.fechaCreacion)
      pDate.setHours(0, 0, 0, 0)
      
      if (startDate.value) {
        const start = parseLocalDate(startDate.value)
        if (start) {
          start.setHours(0, 0, 0, 0)
          if (pDate < start) matchesDate = false
        }
      }
      if (endDate.value) {
        const end = parseLocalDate(endDate.value)
        if (end) {
          end.setHours(0, 0, 0, 0)
          if (pDate > end) matchesDate = false
        }
      }
    }
    return matchesSearch && matchesDate
  })
})

const grandTotal = computed(() => {
  return form.detalles.reduce((sum, item) => sum + (item.cantidad * item.precioCosto), 0)
})

const fetchPurchases = async () => {
  try {
    const res = await fetch(`${API_URL}/api/purchases`, {
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
    const res = await fetch(`${API_URL}/api/suppliers`, {
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
    const res = await fetch(`${API_URL}/api/products`, {
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
  selectedProductId.value = '' // Limpiar seleccion
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

    const res = await fetch(`${API_URL}/api/purchases`, {
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
  font-weight: 500;
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
  font-weight: 500;
  color: var(--text-muted);
}

.total-badge {
  font-weight: 500;
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

/* Estilos para formularios de registro */
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
  font-weight: 500;
  color: var(--text-muted);
}

.restock-items {
  margin-top: 24px;
  border-top: 1px dashed var(--border-color);
  padding-top: 20px;
}

.restock-items h3 {
  font-size: 1.1rem;
  font-weight: 500;
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
  font-weight: 500;
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
  font-weight: 500;
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
  font-weight: 500;
  color: var(--text-main);
  background-color: var(--warning);
  padding: 6px 16px;
  border-radius: 99px;
}
.table-filters {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  background-color: var(--bg-app);
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
  background-color: #ffffff;
}

.filter-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.filter-date-group {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-date {
  padding: 9px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  outline: none;
  font-weight: 500;
  background-color: #ffffff;
}
</style>
