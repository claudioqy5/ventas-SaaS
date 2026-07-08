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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item">📊 <span class="sidebar-text">Dashboard</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_negocio')" to="/business-history" class="nav-item active">📈 <span class="sidebar-text">Historial de Negocio</span></router-link>
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
      <header class="content-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
        <div>
          <h1 class="text-title">📈 Historial del Negocio</h1>
          <p class="text-subtitle">Resumen y análisis de ventas por periodo</p>
        </div>
        
        <!-- Filters & Period Tabs -->
        <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
          <div v-if="selectedPeriod === 'semanal'" class="date-picker-wrapper" style="display: flex; align-items: center; gap: 8px;">
            <label for="history-date" style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted);">Filtrar por Semana:</label>
            <input 
              type="date" 
              id="history-date" 
              v-model="selectedDate" 
              @change="fetchStats"
              class="form-input" 
              style="padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); max-width: 160px;" 
            />
          </div>
          <div v-if="selectedPeriod === 'mensual'" class="date-picker-wrapper" style="display: flex; align-items: center; gap: 8px;">
            <label for="history-month" style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted);">Filtrar por Mes:</label>
            <input 
              type="month" 
              id="history-month" 
              v-model="selectedMonth" 
              @change="onMonthChange"
              class="form-input" 
              style="padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); max-width: 160px;" 
            />
          </div>
          <div v-if="selectedPeriod === 'anual'" class="date-picker-wrapper" style="display: flex; align-items: center; gap: 8px;">
            <label for="history-year" style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted);">Filtrar por Año:</label>
            <select 
              id="history-year" 
              v-model="selectedYear" 
              @change="onYearChange"
              class="form-input" 
              style="padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); max-width: 120px;"
            >
              <option v-for="yr in availableYears" :key="yr" :value="yr">{{ yr }}</option>
            </select>
          </div>

          <div class="period-tabs">
            <button 
              :class="['tab-btn', { active: selectedPeriod === 'semanal' }]" 
              @click="setPeriod('semanal')"
            >
              📅 Semanal
            </button>
            <button 
              :class="['tab-btn', { active: selectedPeriod === 'mensual' }]" 
              @click="setPeriod('mensual')"
            >
              📊 Mensual
            </button>
            <button 
              :class="['tab-btn', { active: selectedPeriod === 'anual' }]" 
              @click="setPeriod('anual')"
            >
              📈 Anual
            </button>
          </div>
        </div>
      </header>

      <!-- Rango de fecha y Totales (Venta Bruta y Neta) -->
      <div class="summary-kpis-container" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 15px;">
        <div class="rango-badge" style="font-size: 1.1rem; font-weight: 600; color: var(--text-main); background: #ffffff; border: 1px solid var(--border-color); padding: 10px 18px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 8px;">
          📅 <span>Periodo:</span> <strong style="color: var(--primary-hover);">{{ stats.rangoTexto || 'Cargando...' }}</strong>
        </div>
        
        <div class="kpi-totals-row" style="display: flex; gap: 15px; flex-wrap: wrap;">
          <div class="kpi-total-card bruto" style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 12px 20px; border-radius: var(--radius-md); text-align: left; min-width: 180px; box-shadow: var(--shadow-sm);">
            <div style="font-size: 0.8rem; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.5px;">Venta Bruta (Con IGV)</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #1e1b4b; margin-top: 4px;">S/. {{ (stats.totalBruto || 0).toFixed(2) }}</div>
          </div>
          <div class="kpi-total-card neto" style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 20px; border-radius: var(--radius-md); text-align: left; min-width: 180px; box-shadow: var(--shadow-sm);">
            <div style="font-size: 0.8rem; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px;">Venta Neta (Sin IGV)</div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #14532d; margin-top: 4px;">S/. {{ (stats.totalNeto || 0).toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-2 charts-container">
        <!-- Periodic Sales Trend (Area Line Chart) -->
        <div class="card chart-card">
          <h2 class="section-title">
            📈 Tendencia de Ventas ({{ selectedPeriodText }})
          </h2>
          <div v-if="loading" class="empty-state">
            Cargando datos del historial...
          </div>
          <div v-else-if="!stats.ventasPeriodo || stats.ventasPeriodo.length === 0" class="empty-state">
            No hay datos de ventas registrados para este periodo.
          </div>
          <div v-else class="chart-wrapper">
            <svg class="line-chart-svg" viewBox="0 0 450 200">
              <defs>
                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="50" y1="30" x2="430" y2="30" stroke="#f1f2f5" stroke-dasharray="4" />
              <line x1="50" y1="95" x2="430" y2="95" stroke="#f1f2f5" stroke-dasharray="4" />
              <line x1="50" y1="160" x2="430" y2="160" stroke="#e2e8f0" stroke-width="1.5" />

              <text x="40" y="35" class="chart-axis-label text-right">S/.{{ (maxVenta).toFixed(0) }}</text>
              <text x="40" y="100" class="chart-axis-label text-right">S/.{{ (maxVenta / 2).toFixed(0) }}</text>
              <text x="40" y="165" class="chart-axis-label text-right">0</text>

              <path :d="lineChartAreaPath" fill="url(#area-grad)" />
              <path :d="lineChartPath" fill="none" stroke="var(--primary-hover)" stroke-width="3" stroke-linecap="round" />

              <g v-for="(point, idx) in chartPoints" :key="idx">
                <circle :cx="point.x" :cy="point.y" r="5.5" fill="#ffffff" stroke="var(--primary-hover)" stroke-width="2.5" class="chart-point">
                  <title>{{ point.etiqueta }}: S/.{{ point.val.toFixed(2) }} ({{ point.cantidad }} ventas)</title>
                </circle>
                
                <!-- Floating tooltip value (only for weekly/yearly or key monthly points to avoid overlap) -->
                <text v-if="chartPoints.length <= 12" :x="point.x" :y="point.y - 12" class="chart-tooltip-text" text-anchor="middle">S/.{{ point.val.toFixed(0) }}</text>
                
                <!-- X Axis Labels -->
                <text v-if="chartPoints.length <= 12 || idx % 5 === 0" :x="point.x" y="180" class="chart-axis-label" text-anchor="middle">{{ point.etiqueta }}</text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Payment Methods Donut Chart -->
        <div class="card chart-card">
          <h2 class="section-title">💳 Métodos de Pago (Filtrado)</h2>
          <div v-if="loading" class="empty-state">
            Cargando formas de pago...
          </div>
          <div v-else-if="!stats.metodosPago || stats.metodosPago.length === 0" class="empty-state">
            Sin ventas en este periodo.
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
                  <text x="60" y="74" text-anchor="middle" class="donut-subtitle">S/.{{ (stats.totalBruto || 0).toFixed(0) }}</text>
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
      <div class="grid grid-1 detail-container" style="margin-top: 24px;">
        <!-- Top Selling Products -->
        <div class="card font-card">
          <h2 class="section-title">🔥 Productos Más Vendidos en el Periodo</h2>
          <div v-if="loading" class="empty-state">
            Cargando productos...
          </div>
          <div v-else-if="!stats.productosMasVendidos || stats.productosMasVendidos.length === 0" class="empty-state">
            No hay registros de ventas para procesar en este periodo.
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

const selectedPeriod = ref('semanal')
const loading = ref(false)

const getTodayFormatted = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const selectedDate = ref(getTodayFormatted())
const selectedMonth = ref(new Date().toISOString().substring(0, 7)) // "YYYY-MM"
const selectedYear = ref(new Date().getFullYear())

const availableYears = computed(() => {
  const current = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, i) => current - i)
})

const stats = ref({
  totalBruto: 0,
  totalNeto: 0,
  rangoTexto: '',
  ventasPeriodo: [],
  metodosPago: [],
  productosMasVendidos: []
})

const selectedPeriodText = computed(() => {
  if (selectedPeriod.value === 'semanal') return 'Lunes a Domingo'
  if (selectedPeriod.value === 'anual') return 'Meses del Año'
  return 'Días del Mes'
})

const setPeriod = (period) => {
  selectedPeriod.value = period
  // Sincronizar fecha según periodo
  if (period === 'semanal') {
    selectedDate.value = getTodayFormatted()
  } else if (period === 'mensual') {
    const d = new Date()
    selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    selectedDate.value = `${selectedMonth.value}-01`
  } else if (period === 'anual') {
    selectedYear.value = new Date().getFullYear()
    selectedDate.value = `${selectedYear.value}-01-01`
  }
  fetchStats()
}

const onMonthChange = () => {
  if (selectedMonth.value) {
    selectedDate.value = `${selectedMonth.value}-01`
    fetchStats()
  }
}

const onYearChange = () => {
  if (selectedYear.value) {
    selectedDate.value = `${selectedYear.value}-01-01`
    fetchStats()
  }
}

const fetchStats = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/dashboard/history?period=${selectedPeriod.value}&fecha=${selectedDate.value}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    stats.value = {
      totalBruto: data.totalBruto || 0,
      totalNeto: data.totalNeto || 0,
      rangoTexto: data.rangoTexto || '',
      ventasPeriodo: data.ventasPeriodo || [],
      metodosPago: data.metodosPago || [],
      productosMasVendidos: data.productosMasVendidos || []
    }
  } catch (err) {
    console.error('Error fetching business history stats', err)
  } finally {
    loading.value = false
  }
}

// Line Chart Computed Helpers
const maxVenta = computed(() => {
  if (!stats.value.ventasPeriodo || stats.value.ventasPeriodo.length === 0) return 1000
  const max = Math.max(...stats.value.ventasPeriodo.map(v => v.total))
  return max === 0 ? 1000 : max * 1.15 // 15% headroom
})

const chartPoints = computed(() => {
  if (!stats.value.ventasPeriodo || stats.value.ventasPeriodo.length === 0) return []
  const count = stats.value.ventasPeriodo.length
  return stats.value.ventasPeriodo.map((v, index) => {
    const x = 50 + index * (380 / Math.max(1, count - 1))
    const y = 160 - (v.total / maxVenta.value) * 120
    return { x, y, val: v.total, cantidad: v.cantidad, etiqueta: v.etiqueta }
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
  r: 8.5;
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

.empty-state {
  color: var(--text-muted);
  padding: 30px;
  text-align: center;
}

/* Period Tabs */
.period-tabs {
  display: flex;
  background: #f1f2f5;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 4px;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover {
  color: var(--text-main);
}

.tab-btn.active {
  background: #ffffff;
  color: var(--primary-hover);
  box-shadow: var(--shadow-sm);
}
</style>
