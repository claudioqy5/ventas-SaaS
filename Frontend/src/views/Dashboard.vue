<template>
  <div class="dashboard-layout">
    <!-- Barra de navegacion lateral -->
    <aside class="sidebar">
      <div class="sidebar-brand">🍦 <span class="sidebar-text">{{ authStore.user?.nombreEmpresa || 'VentasSaaS' }}</span></div>
      <div class="user-info">
        <p class="user-name">Hola, {{ authStore.user?.nombre }}</p>
        <span class="user-badge">{{ authStore.rolEnEspanol }}</span>
      </div>
      <nav class="nav-links">
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item active">📊 <span class="sidebar-text">Dashboard</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_negocio')" to="/business-history" class="nav-item">📈 <span class="sidebar-text">Historial de Negocio</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('ventas')" to="/pos" class="nav-item">🛒 <span class="sidebar-text">POS Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item">📋 <span class="sidebar-text">Historial Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item">📦 <span class="sidebar-text">Productos</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item">🏷️ <span class="sidebar-text">Categorías</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('clientes')" to="/clients" class="nav-item">👥 <span class="sidebar-text">Clientes</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item">🏢 <span class="sidebar-text">Proveedores</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('compras')" to="/purchases" class="nav-item">💵 <span class="sidebar-text">Compras</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item">👥 <span class="sidebar-text">Colaboradores</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 <span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <header class="content-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 class="text-title">📊 Resumen del Negocio</h1>
          <p class="text-subtitle">Monitorea tus ventas, inventario y alertas</p>
        </div>
        <div class="date-filter-container">
          <label for="dashboard-date" class="text-subtitle" style="margin-right: 10px; font-weight: 600;">Filtrar por Fecha:</label>
          <input type="date" id="dashboard-date" v-model="selectedDate" @change="fetchStats" class="form-input" style="padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" />
        </div>
      </header>

      <!-- Metric Grid -->
      <div class="grid grid-4 metrics-container">
        <div class="metric-card blue">
          <div class="metric-info">
            <span class="metric-icon">💰</span>
            <div>
              <p class="metric-value">S/. {{ (stats.totalIngresos || 0).toFixed(2) }}</p>
              <p class="text-subtitle">Ingresos Totales</p>
            </div>
          </div>
        </div>

        <div class="metric-card pink">
          <div class="metric-info">
            <span class="metric-icon">📈</span>
            <div>
              <p class="metric-value">{{ stats.totalVentas || 0 }}</p>
              <p class="text-subtitle">Ventas Realizadas</p>
            </div>
          </div>
        </div>

        <div class="metric-card green">
          <div class="metric-info">
            <span class="metric-icon">📦</span>
            <div>
              <p class="metric-value">{{ stats.totalProductos || 0 }}</p>
              <p class="text-subtitle">Productos Activos</p>
            </div>
          </div>
        </div>

        <div class="metric-card red">
          <div class="metric-info">
            <span class="metric-icon">⚠️</span>
            <div>
              <p class="metric-value">{{ stats.productosBajoStockCount || 0 }}</p>
              <p class="text-subtitle">Alertas de Stock</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section (New, beautiful SVG charts) -->
      <div class="grid grid-1 charts-container">
        <!-- Daily Sales Trend (Hourly Bar Chart) -->
        <div class="card chart-card">
          <h2 class="section-title">📉 Ventas del Día ({{ stats.fechaDiaActual || 'Hoy' }})</h2>
          <div v-if="!stats.ventasHorarias || stats.ventasHorarias.length === 0" class="empty-state">
            Cargando ventas del día...
          </div>
          <div v-else class="chart-wrapper">
            <div class="hourly-chart">
              <div v-for="item in stats.ventasHorarias" :key="item.hora" class="hourly-bar-wrapper">
                <div class="hourly-bar-container">
                  <div class="hourly-bar-fill" :style="{ height: getHourlyHeightPercent(item.total) + '%' }">
                    <span class="bar-tooltip">S/.{{ item.total.toFixed(2) }} ({{ item.cantidad }} vts)</span>
                  </div>
                </div>
                <span class="hourly-label">{{ formatHourLabel(item.hora) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Grid -->
      <div class="grid grid-1 detail-container" style="margin-top: 24px;">

        <!-- Low Stock Alerts -->
        <div class="card font-card">
          <h2 class="section-title">⚠️ Alertas de Stock</h2>
          <div v-if="!stats.productosBajoStock || stats.productosBajoStock.length === 0" class="empty-state" style="padding: 20px;">
            ¡Excelente! Todo el stock está correcto.
          </div>
          <div v-else class="stock-alerts-list">
            <div v-for="prod in stats.productosBajoStock" :key="prod.id" class="stock-alert-item">
              <div class="alert-product-info">
                <span class="alert-dot red"></span>
                <span class="alert-name">{{ prod.nombre }}</span>
              </div>
              <span class="alert-badge">{{ prod.stock }} de {{ prod.stockMinimo }} mín</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Movements Row -->
      <div class="card font-card" style="margin-top: 24px;">
        <h2 class="section-title">🕒 Últimos Movimientos de Inventario</h2>
        <div v-if="!stats.movimientosRecientes || stats.movimientosRecientes.length === 0" class="empty-state">
          No se han registrado movimientos de inventario aún.
        </div>
        <div v-else class="movements-grid">
          <div v-for="move in stats.movimientosRecientes" :key="move.id" class="movement-card-item">
            <div class="movement-header-row">
              <span :class="['movement-badge', move.tipo ? move.tipo.toLowerCase() : '']">{{ move.tipo }}</span>
              <span class="movement-date">{{ new Date(move.fechaCreacion).toLocaleDateString() }}</span>
            </div>
            <p class="movement-title"><strong>{{ move.nombreProducto }}</strong></p>
            <p class="movement-desc-txt">{{ move.motivo }} ({{ move.cantidad }} uds)</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref({
  totalProductos: 0,
  totalVentas: 0,
  totalIngresos: 0,
  totalGastosCompras: 0,
  productosBajoStockCount: 0,
  productosBajoStock: [],
  movimientosRecientes: [],
  ventasHorarias: [],
  fechaDiaActual: ''
})

const getTodayFormatted = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const selectedDate = ref(getTodayFormatted())

const fetchStats = async () => {
  try {
    const res = await fetch(`${API_URL}/api/dashboard?fecha=${selectedDate.value}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    stats.value = {
      totalProductos: data.totalProductos || 0,
      totalVentas: data.totalVentas || 0,
      totalIngresos: data.totalIngresos || 0,
      totalGastosCompras: data.totalGastosCompras || 0,
      productosBajoStockCount: data.productosBajoStockCount || 0,
      productosBajoStock: data.productosBajoStock || [],
      movimientosRecientes: data.movimientosRecientes || [],
      ventasHorarias: data.ventasHorarias || [],
      fechaDiaActual: data.fechaDiaActual || ''
    }
    // Sync the date in case the backend overrides it
    if (data.fechaDiaActual) {
      selectedDate.value = data.fechaDiaActual
    }
  } catch (err) {
    console.error('Error fetching dashboard stats', err)
  }
}

// Hourly Chart Helpers
const maxHourlyVenta = computed(() => {
  if (!stats.value.ventasHorarias || stats.value.ventasHorarias.length === 0) return 100
  const max = Math.max(...stats.value.ventasHorarias.map(h => h.total))
  return max === 0 ? 100 : max
})

const getHourlyHeightPercent = (total) => {
  return (total / maxHourlyVenta.value) * 100
}

const formatHourLabel = (hourStr) => {
  const hr = parseInt(hourStr.split(':')[0])
  if (hr % 2 === 0) {
    return `${hr}h`
  }
  return ''
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.content-header {
  margin-bottom: 25px;
  text-align: left;
}

.metrics-container {
  margin-bottom: 30px;
}

.metric-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.metric-icon {
  font-size: 2.2rem;
  background: var(--bg-app);
  padding: 10px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-value {
  font-size: 2.1rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.col-span-2 {
  grid-column: span 2 / span 2;
}

/* Charts Containers */
.charts-container {
  margin-bottom: 24px;
}

.chart-card {
  padding: 24px;
  background: #ffffff;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: left;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Stock Alerts Styling */
.stock-alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.stock-alert-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #fff8f8;
  border: 1px solid var(--danger);
  border-radius: var(--radius-sm);
}

.alert-product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.alert-dot.red {
  background-color: #c53030;
}

.alert-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
}

.alert-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: #c53030;
}

/* Movements Grid styling */
.movements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  text-align: left;
}

.movement-card-item {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.movement-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.movement-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  text-transform: uppercase;
}

.movement-badge.venta { background: var(--success); color: #1b4d3e; }
.movement-badge.ajuste { background: var(--warning); color: #744210; }
.movement-badge.compra { background: var(--primary); color: #1e3a8a; }

.movement-date {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.movement-title {
  font-size: 0.95rem;
  color: var(--text-main);
}

.movement-desc-txt {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.empty-state {
  color: var(--text-muted);
  padding: 30px;
  text-align: center;
}

/* Hourly Bar Chart styling */
.hourly-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 180px;
  padding-top: 10px;
  width: 100%;
}

.hourly-bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  height: 100%;
}

.hourly-bar-container {
  width: 8px;
  height: 80%;
  background-color: var(--border-color);
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.hourly-bar-fill {
  width: 100%;
  background: linear-gradient(180deg, var(--primary) 0%, var(--primary-hover) 100%);
  border-radius: 4px;
  position: relative;
  transition: height 0.6s ease;
  cursor: pointer;
}

.hourly-bar-fill:hover {
  background: var(--primary-hover);
}

.bar-tooltip {
  visibility: hidden;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--text-main);
  color: #fff;
  font-size: 0.75rem;
  padding: 4px 6px;
  border-radius: 4px;
  white-space: nowrap;
  margin-bottom: 5px;
  z-index: 10;
}

.hourly-bar-fill:hover .bar-tooltip {
  visibility: visible;
}

.hourly-label {
  font-size: 9px;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 6px;
  height: 15px;
}
</style>
