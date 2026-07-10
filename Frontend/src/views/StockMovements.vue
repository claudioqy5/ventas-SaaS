<template>
  <div class="dashboard-layout">
    <!-- Barra de navegacion lateral -->
    <aside class="sidebar">
      <div class="sidebar-brand"><span>🍦</span><span class="sidebar-brand-name">{{ authStore.user?.nombreEmpresa || 'VentasSaaS' }}</span></div>
      <div class="user-info">
        <p class="user-name">Hola, {{ authStore.user?.nombre }}</p>
        <span class="user-badge">{{ authStore.rolEnEspanol }}</span>
      </div>
      <nav class="nav-links">
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item">📊 <span class="sidebar-text">Dashboard</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_negocio')" to="/business-history" class="nav-item">📈 <span class="sidebar-text">Historial de Negocio</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('ventas')" to="/pos" class="nav-item">🛒 <span class="sidebar-text">POS Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item">📋 <span class="sidebar-text">Historial Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item">📦 <span class="sidebar-text">Inventario</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item">🏷️ <span class="sidebar-text">Categorías</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('clientes')" to="/clients" class="nav-item">👥 <span class="sidebar-text">Clientes</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item">🏢 <span class="sidebar-text">Proveedores</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('compras')" to="/purchases" class="nav-item">💵 <span class="sidebar-text">Compras</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('movimientos')" to="/stock-movements" class="nav-item active">🔄 <span class="sidebar-text">Movimientos</span></router-link>
        <router-link v-if="!authStore.isSuperadmin" to="/reminders" class="nav-item">📅 <span class="sidebar-text">Recordatorios</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item">👥 <span class="sidebar-text">Colaboradores</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 <span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Area de contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div>
          <h1 class="text-title">🔄 Auditoría de Movimientos</h1>
          <p class="text-subtitle">Monitorea las entradas, salidas y ajustes del stock de tu inventario en tiempo real.</p>
        </div>
      </header>

      <!-- Tabla de datos principal -->
      <div class="card font-card">
        <!-- Seccion de filtros de busqueda -->
        <div class="table-filters" style="margin-bottom: 20px;">
          <input v-model="searchQuery" @input="debouncedFetch" type="text" placeholder="🔍 Buscar por producto..." class="filter-input" />
          <div class="filter-date-group">
            <span>Desde:</span>
            <input v-model="startDate" @change="fetchMovements" type="date" class="filter-date" />
            <span>Hasta:</span>
            <input v-model="endDate" @change="fetchMovements" type="date" class="filter-date" />
          </div>
        </div>

        <HamsterLoader v-if="loading" label="Cargando historial de movimientos..." />

        <div v-else-if="movements.length === 0" class="empty-state">
          No se encontraron movimientos registrados en este rango de fechas.
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 50px;">N°</th>
                <th>Fecha y Hora</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th style="text-align: right;">Cantidad</th>
                <th style="text-align: center;">Trazabilidad Stock</th>
                <th>Responsable</th>
                <th>Motivo / Referencia</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(mov, index) in movements" :key="mov.id">
                <td><strong>{{ index + 1 }}</strong></td>
                <td><code>{{ formatDateTime(mov.fechaCreacion) }}</code></td>
                <td><strong>{{ mov.nombreProducto }}</strong></td>
                <td>
                  <span :class="['type-badge', getTypeClass(mov.tipo)]">
                    {{ formatType(mov.tipo) }}
                  </span>
                </td>
                <td style="text-align: right; font-weight: 800;" :style="{ color: getQuantityColor(mov.tipo) }">
                  {{ getQuantityPrefix(mov.tipo) }}{{ mov.cantidad }}
                </td>
                <td style="text-align: center; color: var(--text-muted);">
                  <code>{{ mov.stockAnterior }}</code> ➔ <strong><code>{{ mov.stockNuevo }}</code></strong>
                </td>
                <td>{{ formatCreatorName(mov.creadoPorNombre) }}</td>
                <td style="font-style: italic; color: var(--text-muted);">
                  {{ mov.motivo || mov.referenciaId || 'Sin detalles' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HamsterLoader from '../components/HamsterLoader.vue'

const router = useRouter()
const authStore = useAuthStore()

const movements = ref([])
const loading = ref(false)
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

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fetchMovements()
  }, 350)
}

const fetchMovements = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/stockmovements?search=${searchQuery.value}&startDate=${startDate.value}&endDate=${endDate.value}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    movements.value = await res.json()
  } catch (err) {
    console.error('Error fetching inventory movements')
  } finally {
    loading.value = false
  }
}

const formatCreatorName = (name) => {
  if (!name) return 'Sistema'
  if (/^[0-9a-fA-F]{24}$/.test(name)) {
    return 'Administrador'
  }
  return name
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('es-PE', {
    timeZone: 'America/Lima',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const getTypeClass = (type) => {
  const lower = type.toLowerCase()
  if (lower === 'entrada' || lower === 'compra') return 'type-in'
  if (lower === 'salida' || lower === 'venta') return 'type-out'
  return 'type-adjust'
}

const formatType = (type) => {
  const mapping = {
    'entrada': '📥 Entrada',
    'compra': '💵 Compra',
    'salida': '📤 Salida',
    'venta': '🛒 Venta',
    'ajuste': '🔧 Ajuste'
  }
  return mapping[type.toLowerCase()] || type
}

const getQuantityPrefix = (type) => {
  const lower = type.toLowerCase()
  if (lower === 'entrada' || lower === 'compra') return '+'
  if (lower === 'salida' || lower === 'venta') return '-'
  return ''
}

const getQuantityColor = (type) => {
  const lower = type.toLowerCase()
  if (lower === 'entrada' || lower === 'compra') return '#16a34a' // Green
  if (lower === 'salida' || lower === 'venta') return '#dc2626' // Red
  return '#d97706' // Orange for adjusts
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchMovements()
})
</script>

<style scoped>
.content-header {
  margin-bottom: 30px;
  text-align: left;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
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

.table-filters {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
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
  font-weight: 600;
}

.filter-date {
  padding: 9px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  outline: none;
  font-weight: 500;
  background-color: #ffffff;
}

.type-badge {
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-block;
}

.type-badge.type-in {
  background-color: #d1fae5;
  color: #065f46;
}

.type-badge.type-out {
  background-color: #fee2e2;
  color: #991b1b;
}

.type-badge.type-adjust {
  background-color: #fffbeb;
  color: #9a3412;
}

.empty-state {
  color: var(--text-muted);
  padding: 40px;
  text-align: center;
}
</style>
