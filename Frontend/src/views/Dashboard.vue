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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item active">📊 <span class="sidebar-text">Dashboard</span></router-link>
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
      <header class="content-header">
        <h1 class="text-title">📊 Resumen del Negocio</h1>
        <p class="text-subtitle">Monitorea tus ventas, inventario y alertas</p>
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
      <div class="grid grid-3 charts-container">
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

        <!-- Monthly Sales Trend (Area Line Chart) -->
        <div class="card chart-card">
          <h2 class="section-title">📈 Tendencia de Ingresos Mensuales</h2>
          <div v-if="!stats.ventasMensuales || stats.ventasMensuales.length === 0" class="empty-state">
            Cargando datos históricos...
          </div>
          <div v-else class="chart-wrapper">
            <svg class="line-chart-svg" viewBox="0 0 450 200">
              <defs>
                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line x1="50" y1="50" x2="430" y2="50" stroke="#f1f2f5" stroke-dasharray="4" />
              <line x1="50" y1="105" x2="430" y2="105" stroke="#f1f2f5" stroke-dasharray="4" />
              <line x1="50" y1="160" x2="430" y2="160" stroke="#e2e8f0" stroke-width="1.5" />

              <!-- Y Axis labels -->
              <text x="40" y="55" class="chart-axis-label text-right">S/.{{ (maxVenta).toFixed(0) }}</text>
              <text x="40" y="110" class="chart-axis-label text-right">S/.{{ (maxVenta / 2).toFixed(0) }}</text>
              <text x="40" y="165" class="chart-axis-label text-right">0</text>

              <!-- Filled Area -->
              <path :d="lineChartAreaPath" fill="url(#area-grad)" />

              <!-- Line path -->
              <path :d="lineChartPath" fill="none" stroke="var(--primary-hover)" stroke-width="3" stroke-linecap="round" />

              <!-- Data points & tooltips -->
              <g v-for="(point, idx) in chartPoints" :key="idx">
                <circle :cx="point.x" :cy="point.y" r="5" fill="#ffffff" stroke="var(--primary-hover)" stroke-width="2.5" class="chart-point" />
                <!-- Tooltip values above points -->
                <text :x="point.x" :y="point.y - 12" class="chart-tooltip-text" text-anchor="middle">S/.{{ point.val.toFixed(0) }}</text>
                <!-- X Axis Label -->
                <text :x="point.x" y="180" class="chart-axis-label" text-anchor="middle">{{ formatMonthName(point.mes) }}</text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Payment Methods Donut Chart -->
        <div class="card chart-card">
          <h2 class="section-title">💳 Métodos de Pago Preferidos</h2>
          <div v-if="!stats.metodosPago || stats.metodosPago.length === 0" class="empty-state">
            Cargando formas de pago...
          </div>
          <div v-else class="donut-chart-layout">
            <div class="donut-wrapper">
              <svg class="donut-chart-svg" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f2f5" stroke-width="10" />
                <circle v-for="(seg, idx) in donutSegments" :key="idx"
                        cx="60" cy="60" r="50" fill="none"
                        :stroke="seg.color" stroke-width="10"
                        :stroke-dasharray="seg.strokeDashArray"
                        :stroke-dashoffset="seg.strokeDashOffset"
                        transform="rotate(-90 60 60)"
                        class="donut-segment" />
                <g class="donut-center-text">
                  <text x="60" y="58" text-anchor="middle" class="donut-title">TOTAL</text>
                  <text x="60" y="74" text-anchor="middle" class="donut-subtitle">S/.{{ stats.totalIngresos.toFixed(0) }}</text>
                </g>
              </svg>
            </div>
            <!-- Legend -->
            <div class="donut-legend">
              <div v-for="(seg, idx) in donutSegments" :key="idx" class="legend-item">
                <span class="legend-dot" :style="{ backgroundColor: seg.color }"></span>
                <span class="legend-name">{{ seg.metodo }}:</span>
                <span class="legend-val">S/.{{ seg.total.toFixed(2) }} ({{ seg.percent }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail & Top Selling Products Grid -->
      <div class="grid grid-3 detail-container" style="margin-top: 24px;">
        <!-- Top Selling Products -->
        <div class="card font-card col-span-2">
          <h2 class="section-title">🔥 Productos Más Vendidos</h2>
          <div v-if="!stats.productosMasVendidos || stats.productosMasVendidos.length === 0" class="empty-state">
            No hay registros de ventas para procesar.
          </div>
          <div v-else class="top-products-list">
            <div v-for="(p, idx) in stats.productosMasVendidos" :key="idx" class="top-product-item">
              <div class="top-product-info">
                <div class="top-product-name-container">
                  <span class="product-rank">#{{ idx + 1 }}</span>
                  <span class="product-name font-bold">{{ p.producto }}</span>
                </div>
                <span class="product-quantity font-bold">{{ p.cantidad }} unidades</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" :style="{ width: getProductWidthPercent(p.cantidad) + '%', backgroundColor: getRankColor(idx) }"></div>
              </div>
            </div>
          </div>
        </div>

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
  ventasMensuales: [],
  metodosPago: [],
  productosMasVendidos: [],
  ventasHorarias: [],
  fechaDiaActual: ''
})

const fetchStats = async () => {
  try {
    const res = await fetch(`${API_URL}/api/dashboard`, {
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
      ventasMensuales: data.ventasMensuales || [],
      metodosPago: data.metodosPago || [],
      productosMasVendidos: data.productosMasVendidos || [],
      ventasHorarias: data.ventasHorarias || [],
      fechaDiaActual: data.fechaDiaActual || ''
    }
  } catch (err) {
    console.error('Error fetching dashboard stats', err)
  }
}

// Line Chart Computed Helpers
const maxVenta = computed(() => {
  if (!stats.value.ventasMensuales || stats.value.ventasMensuales.length === 0) return 1000
  const max = Math.max(...stats.value.ventasMensuales.map(v => v.total))
  return max === 0 ? 1000 : max * 1.15 // 15% headroom
})

const chartPoints = computed(() => {
  if (!stats.value.ventasMensuales || stats.value.ventasMensuales.length === 0) return []
  const count = stats.value.ventasMensuales.length
  return stats.value.ventasMensuales.map((v, index) => {
    const x = 50 + index * (380 / Math.max(1, count - 1))
    const y = 160 - (v.total / maxVenta.value) * 110
    return { x, y, val: v.total, mes: v.mes }
  })
})

const lineChartPath = computed(() => {
  const points = chartPoints.value
  if (points.length === 0) return ""
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const lineChartAreaPath = computed(() => {
  const points = chartPoints.value
  if (points.length === 0) return ""
  const startX = points[0].x
  const endX = points[points.length - 1].x
  return `${points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} L ${endX} 160 L ${startX} 160 Z`
})

// Donut Chart Computed Helpers
const donutSegments = computed(() => {
  if (!stats.value.metodosPago || stats.value.metodosPago.length === 0) return []
  const totalAmount = stats.value.metodosPago.reduce((acc, m) => acc + m.total, 0)
  if (totalAmount === 0) return []
  
  let cumulativePercent = 0
  const colors = ['#a3c4f3', '#f1c0e8', '#b9fbc0', '#fbf8cc']
  
  return stats.value.metodosPago.map((m, index) => {
    const percent = m.total / totalAmount
    const strokeDashArray = `${percent * 314.159} 314.159`
    const strokeDashOffset = -cumulativePercent * 314.159
    cumulativePercent += percent
    return {
      metodo: m.metodo,
      total: m.total,
      percent: (percent * 100).toFixed(1),
      strokeDashArray,
      strokeDashOffset,
      color: colors[index % colors.length]
    }
  })
})

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

// Formatting functions
const formatMonthName = (yearMonthStr) => {
  if (!yearMonthStr) return ''
  const parts = yearMonthStr.split('-')
  if (parts.length < 2) return yearMonthStr
  const month = parseInt(parts[1])
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic']
  return `${months[month - 1]} '${parts[0].substring(2)}`
}

const getProductWidthPercent = (qty) => {
  if (!stats.value.productosMasVendidos || stats.value.productosMasVendidos.length === 0) return 0
  const maxQty = Math.max(...stats.value.productosMasVendidos.map(p => p.cantidad))
  return maxQty === 0 ? 0 : (qty / maxQty) * 100
}

const getRankColor = (idx) => {
  const colors = ['var(--primary-hover)', 'var(--secondary)', 'var(--success)', 'var(--warning)', 'var(--danger)']
  return colors[idx % colors.length]
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

.chart-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.line-chart-svg {
  width: 100%;
  max-height: 220px;
}

.chart-axis-label {
  font-size: 10px;
  fill: var(--text-muted);
  font-weight: 500;
}

.chart-tooltip-text {
  font-size: 9px;
  fill: var(--text-main);
  font-weight: 700;
}

.chart-point {
  transition: r 0.2s ease;
  cursor: pointer;
}
.chart-point:hover {
  r: 7;
}

/* Donut Chart Styling */
.donut-chart-layout {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
  flex-wrap: wrap;
}

.donut-wrapper {
  position: relative;
  width: 150px;
  height: 150px;
}

.donut-chart-svg {
  width: 100%;
  height: 100%;
}

.donut-segment {
  transform-origin: center;
  transition: stroke-width 0.2s ease;
  cursor: pointer;
}

.donut-segment:hover {
  stroke-width: 12px;
}

.donut-center-text {
  user-select: none;
}

.donut-title {
  font-size: 8px;
  font-weight: 700;
  fill: var(--text-muted);
}

.donut-subtitle {
  font-size: 11px;
  font-weight: 700;
  fill: var(--text-main);
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-name {
  color: var(--text-muted);
  font-weight: 500;
}

.legend-val {
  color: var(--text-main);
  font-weight: 600;
}

/* Top Selling Products styling */
.top-products-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.top-product-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.top-product-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top-product-name-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-rank {
  background: var(--bg-app);
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.product-name {
  font-size: 0.95rem;
  color: var(--text-main);
}

.product-quantity {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.progress-bar-container {
  width: 100%;
  height: 10px;
  background: var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: var(--radius-sm);
  transition: width 1s ease-in-out;
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
