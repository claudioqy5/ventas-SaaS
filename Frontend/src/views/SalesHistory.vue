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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item active">📋 <span class="sidebar-text">Historial Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item">📦 <span class="sidebar-text">Productos</span></router-link>
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
        <div>
          <h1 class="text-title">📋 Historial de Ventas</h1>
          <p class="text-subtitle">Consulta todas las ventas registradas en el sistema, con sus respectivos cajeros, clientes y detalles.</p>
        </div>
      </header>

      <div class="card font-card">
        <!-- Search and Filters -->
        <div class="filters-container">
          <input v-model="searchQuery" type="text" placeholder="🔍 Buscar por cliente o cajero..." class="filter-input" />
          <select v-model="filterPayment" class="filter-select">
            <option value="">💵 Todos los Métodos</option>
            <option value="Efectivo">💵 Efectivo</option>
            <option value="Tarjeta">💳 Tarjeta</option>
            <option value="Transferencia">🏦 Transferencia</option>
          </select>
        </div>

        <div v-if="loading" class="empty-state">
          Cargando historial de ventas...
        </div>

        <div v-else-if="filteredSales.length === 0" class="empty-state">
          No se encontraron ventas registradas que coincidan con los filtros.
        </div>

        <!-- Sales Table -->
        <table v-else class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">N°</th>
              <th>Fecha y Hora</th>
              <th>Cliente</th>
              <th>Cajero / Responsable</th>
              <th>Método de Pago</th>
              <th>Total</th>
              <th style="text-align: center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sale, index) in filteredSales" :key="sale.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td>
                <span class="date-badge">{{ formatDateTime(sale.fechaCreacion) }}</span>
              </td>
              <td>
                <strong>{{ sale.nombreCliente || 'Cliente General' }}</strong>
              </td>
              <td>
                {{ formatCreatorName(sale.creadoPorNombre) }}
              </td>
              <td>
                <span :class="['payment-badge', sale.metodoPago.toLowerCase()]">
                  {{ sale.metodoPago }}
                </span>
              </td>
              <td>
                <span class="total-badge">S/. {{ sale.total.toFixed(2) }}</span>
              </td>
              <td style="text-align: center;">
                <button @click="openDetails(sale)" class="btn btn-primary btn-sm">👁️ Ver Detalles</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Details Modal -->
      <div v-if="selectedSale" class="modal-overlay" @click.self="selectedSale = null">
        <div class="modal-content card max-width-600">
          <header class="modal-header">
            <h3>📋 Detalles de la Venta</h3>
            <button @click="selectedSale = null" class="close-btn">×</button>
          </header>

          <div class="sale-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Fecha y Hora:</span>
              <span class="meta-val">{{ formatDateTime(selectedSale.fechaCreacion) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Cliente:</span>
              <span class="meta-val">{{ selectedSale.nombreCliente || 'Cliente General' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Cajero:</span>
              <span class="meta-val">{{ formatCreatorName(selectedSale.creadoPorNombre) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Método de Pago:</span>
              <span class="meta-val">{{ selectedSale.metodoPago }}</span>
            </div>
          </div>

          <div class="modal-details-table-wrapper">
            <table class="modal-details-table">
              <thead>
                <tr>
                  <th style="width: 40px;">N°</th>
                  <th>Producto</th>
                  <th style="text-align: center;">Cant.</th>
                  <th style="text-align: right;">Unit.</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in selectedSale.detalles" :key="item.productoId">
                  <td>{{ idx + 1 }}</td>
                  <td>{{ item.nombreProducto }}</td>
                  <td style="text-align: center;">{{ item.cantidad }}</td>
                  <td style="text-align: right;">S/. {{ item.precioUnitario.toFixed(2) }}</td>
                  <td style="text-align: right;">S/. {{ (item.cantidad * item.precioUnitario).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="modal-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>S/. {{ selectedSale.subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Impuestos (19%):</span>
              <span>S/. {{ selectedSale.impuesto.toFixed(2) }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span>S/. {{ selectedSale.total.toFixed(2) }}</span>
            </div>
          </div>

          <footer class="modal-actions">
            <button @click="selectedSale = null" class="btn btn-secondary w-full">Cerrar</button>
          </footer>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const sales = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterPayment = ref('')
const selectedSale = ref(null)

const fetchSales = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:5246/api/sales', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    sales.value = await res.json()
  } catch (err) {
    console.error('Error fetching sales history')
  } finally {
    loading.value = false
  }
}

const filteredSales = computed(() => {
  return sales.value.filter(s => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = 
      (s.nombreCliente && s.nombreCliente.toLowerCase().includes(q)) ||
      (s.creadoPorNombre && s.creadoPorNombre.toLowerCase().includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q))
    
    const matchesPayment = !filterPayment.value || s.metodoPago === filterPayment.value

    return matchesSearch && matchesPayment
  })
})

const openDetails = (sale) => {
  selectedSale.value = sale
}

const formatCreatorName = (name) => {
  if (!name) return 'Empleado'
  // If it matches 24 characters of hexadecimal, it is a Mongo ObjectId
  if (/^[0-9a-fA-F]{24}$/.test(name)) {
    return 'Administrador'
  }
  return name
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchSales()
})
</script>

<style scoped>
.filters-container {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-input {
  flex-grow: 1;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  outline: none;
  font-size: 0.95rem;
}

.filter-select {
  width: 220px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: #ffffff;
  color: var(--text-main);
  outline: none;
  font-size: 0.95rem;
}

.date-badge {
  background-color: var(--bg-app);
  color: var(--text-main);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.9rem;
}

.payment-badge {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
}

.payment-badge.efectivo {
  background-color: #ecfdf5;
  color: #065f46;
}

.payment-badge.tarjeta {
  background-color: #e0f2fe;
  color: #075985;
}

.payment-badge.transferencia {
  background-color: #faf5ff;
  color: #6b21a8;
}

.total-badge {
  font-weight: 700;
  color: var(--text-main);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

/* Modal Styling */
.sale-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  background-color: var(--bg-app);
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
}

.meta-val {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
}

.modal-details-table-wrapper {
  margin-bottom: 24px;
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.modal-details-table {
  width: 100%;
  border-collapse: collapse;
}

.modal-details-table th,
.modal-details-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.modal-details-table th {
  background-color: var(--bg-app);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.modal-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  margin-bottom: 24px;
  padding-right: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  width: 200px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.summary-row.total-row {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  border-top: 1px solid var(--border-color);
  padding-top: 8px;
  margin-top: 4px;
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
</style>
