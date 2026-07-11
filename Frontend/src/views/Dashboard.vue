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
        <!-- SECCIÓN: ANÁLISIS -->
        <div class="nav-section-title">Análisis</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item" active-class="active">📊 <span class="sidebar-text">Dashboard</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_negocio')" to="/business-history" class="nav-item" active-class="active">📈 <span class="sidebar-text">Historial de Negocio</span></router-link>

        <!-- SECCIÓN: VENTAS -->
        <div class="nav-section-title">Ventas</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('ventas')" to="/pos" class="nav-item" active-class="active">🛒 <span class="sidebar-text">POS Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item" active-class="active">📋 <span class="sidebar-text">Historial Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/credit-sales" class="nav-item" active-class="active">📒 <span class="sidebar-text">Cuentas por Cobrar</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/payment-methods" class="nav-item" active-class="active">💳 <span class="sidebar-text">Formas de Pago</span></router-link>

        <!-- SECCIÓN: LOGÍSTICA -->
        <div class="nav-section-title">Logística</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item" active-class="active">📦 <span class="sidebar-text">Inventario</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item" active-class="active">🏷️ <span class="sidebar-text">Categorías</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('movimientos')" to="/stock-movements" class="nav-item" active-class="active">🔄 <span class="sidebar-text">Movimientos</span></router-link>

        <!-- SECCIÓN: COMPRAS -->
        <div class="nav-section-title">Compras</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item" active-class="active">🏢 <span class="sidebar-text">Proveedores</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('compras')" to="/purchases" class="nav-item" active-class="active">💵 <span class="sidebar-text">Compras</span></router-link>

        <!-- SECCIÓN: GESTIÓN -->
        <div class="nav-section-title">Gestión</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('clientes')" to="/clients" class="nav-item" active-class="active">👥 <span class="sidebar-text">Clientes</span></router-link>
        <router-link v-if="!authStore.isSuperadmin" to="/reminders" class="nav-item" active-class="active">📅 <span class="sidebar-text">Recordatorios</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item" active-class="active">👥 <span class="sidebar-text">Colaboradores</span></router-link>
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
        <div class="kpi-total-card bruto" style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 20px 24px; border-radius: var(--radius-md); text-align: left; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.5px;">Venta Total (Con IGV)</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #1e1b4b; margin-top: 4px;">S/. {{ (stats.totalIngresos || 0).toFixed(2) }}</div>
        </div>

        <div class="kpi-total-card neto" style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px 24px; border-radius: var(--radius-md); text-align: left; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px;">Ganancia Bruta (Pre-Impuesto)</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #14532d; margin-top: 4px;">S/. {{ (stats.gananciaBruta || 0).toFixed(2) }}</div>
        </div>

        <div class="kpi-total-card realizadas" style="background: #fff0f6; border: 1px solid #ffd8e8; padding: 20px 24px; border-radius: var(--radius-md); text-align: left; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #d01c68; text-transform: uppercase; letter-spacing: 0.5px;">Ventas Realizadas</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #500e2e; margin-top: 4px;">{{ stats.totalVentas || 0 }}</div>
        </div>

        <div class="kpi-total-card activas" style="background: #fffbeb; border: 1px solid #fef3c7; padding: 20px 24px; border-radius: var(--radius-md); text-align: left; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #d97706; text-transform: uppercase; letter-spacing: 0.5px;">Productos Activos</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #451a03; margin-top: 4px;">{{ stats.totalProductos || 0 }}</div>
        </div>
      </div>

      <!-- Charts Section (New, beautiful SVG charts) -->
      <div class="charts-layout">
        <!-- Daily Sales Trend (Hourly Bar Chart) -->
        <div class="card chart-card">
          <h2 class="section-title">📉 Ventas del Día ({{ stats.fechaDiaActual || 'Hoy' }})</h2>
          <div v-if="!stats.ventasHorarias || stats.ventasHorarias.length === 0" class="empty-state">
            Cargando ventas del día...
          </div>
          <div v-else class="chart-wrapper" style="padding-top: 15px;">
            <svg class="line-chart-svg" viewBox="0 0 800 250">
              <defs>
                <linearGradient id="area-grad-hourly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.5" />
                  <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="50" y1="30" x2="780" y2="30" stroke="#f1f2f5" stroke-dasharray="4" />
              <line x1="50" y1="110" x2="780" y2="110" stroke="#f1f2f5" stroke-dasharray="4" />
              <line x1="50" y1="190" x2="780" y2="190" stroke="#e2e8f0" stroke-width="1.5" />

              <text x="40" y="35" class="chart-axis-label" text-anchor="end">S/.{{ (maxHourlyVenta).toFixed(0) }}</text>
              <text x="40" y="115" class="chart-axis-label" text-anchor="end">S/.{{ (maxHourlyVenta / 2).toFixed(0) }}</text>
              <text x="40" y="195" class="chart-axis-label" text-anchor="end">0</text>

              <path :d="hourlyAreaPath" fill="url(#area-grad-hourly)" />
              <path :d="hourlyLinePath" fill="none" stroke="var(--primary-hover)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />

              <g v-for="(point, idx) in hourlyChartPoints" :key="idx" class="chart-point-group">
                <circle :cx="point.x" :cy="point.y" r="4.5" fill="#ffffff" stroke="var(--primary-hover)" stroke-width="2.5" class="chart-point" />
                <text :x="point.x" :y="point.y - 12" class="chart-tooltip-text" text-anchor="middle">S/.{{ point.val.toFixed(0) }}</text>
                <text :x="point.x" y="215" class="chart-axis-label" text-anchor="middle">{{ point.label }}</text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Payment Methods Donut Chart -->
        <div class="card chart-card">
          <h2 class="section-title">💳 Formas de Pago del Día</h2>
          <div v-if="!stats.metodosPagoDia || stats.metodosPagoDia.length === 0" class="empty-state">
            Sin ventas aún...
          </div>
          <div v-else class="donut-chart-layout">
            <div class="pie-wrapper">
              <svg class="pie-chart-svg" viewBox="-10 -10 140 140">
                <defs>
                  <filter id="pie-center-shadow-dia" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-opacity="0.15"/>
                  </filter>
                </defs>
                <g v-for="(seg, idx) in pieSegmentsDia" :key="idx" 
                   class="pie-slice-group"
                   :style="{ '--dx': seg.dx + 'px', '--dy': seg.dy + 'px' }"
                   @mouseenter="hoveredSegmentDia = seg"
                   @mouseleave="hoveredSegmentDia = null">
                  <path :d="seg.d"
                        :fill="seg.color"
                        stroke="#ffffff"
                        stroke-width="1"
                        stroke-linejoin="round"
                        class="pie-segment" />
                  <text v-if="parseFloat(seg.percent) > 4"
                        :x="seg.tx"
                        :y="seg.ty"
                        class="pie-label"
                        text-anchor="middle">
                    {{ seg.percent }}%
                  </text>
                </g>
                
                <!-- Central White Circle (Donut) -->
                <circle cx="60" cy="60" r="23" fill="#ffffff" filter="url(#pie-center-shadow-dia)" />
                
                <!-- Central Text (Hover & Total Info) -->
                <g v-if="hoveredSegmentDia">
                  <text x="60" y="49" font-size="7" font-weight="800" fill="#1e1b4b" text-anchor="middle">
                    {{ hoveredSegmentDia.metodo }}
                  </text>
                  <text x="60" y="60" font-size="6.5" font-weight="700" fill="#4f46e5" text-anchor="middle">
                    S/.{{ hoveredSegmentDia.total.toFixed(0) }}
                  </text>
                  <text x="60" y="71" font-size="7" font-weight="800" :fill="hoveredSegmentDia.color" text-anchor="middle">
                    {{ hoveredSegmentDia.percent }}%
                  </text>
                </g>
                <g v-else>
                  <text x="60" y="52" font-size="6.5" font-weight="700" fill="#4f46e5" text-anchor="middle" style="letter-spacing: 0.2px;">
                    PAGOS
                  </text>
                  <text x="60" y="63" font-size="7" font-weight="800" fill="#1e1b4b" text-anchor="middle">
                    S/.{{ totalPagoDia.toFixed(0) }}
                  </text>
                  <text x="60" y="72" font-size="5" font-weight="600" fill="#94a3b8" text-anchor="middle">
                    HOY
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products Row -->
      <div class="card font-card" style="margin-top: 24px;">
        <h2 class="section-title">🏆 Top 5 Productos del Día</h2>
        <div v-if="!stats.productosMasVendidosDia || stats.productosMasVendidosDia.length === 0" class="empty-state">
          No se han registrado ventas de productos hoy.
        </div>
        <div v-else class="movements-grid">
          <div v-for="prod in stats.productosMasVendidosDia" :key="prod.producto" class="movement-card-item">
            <div class="movement-header-row">
              <span class="movement-badge venta">TOP</span>
              <span class="movement-date">{{ prod.cantidad }} unds vendidas</span>
            </div>
            <p class="movement-title" style="margin-top: 8px;"><strong>{{ prod.producto }}</strong></p>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Alerta de Recordatorios Vencidos / Por Vencer -->
    <div v-if="showReminderAlert" class="modal-overlay">
      <div class="modal-content card" style="max-width: 550px; border-left: 5px solid var(--warning);">
        <div class="modal-header">
          <h2 style="display: flex; align-items: center; gap: 10px;">📅 Alertas de Cuentas por Pagar</h2>
          <button @click="showReminderAlert = false" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body" style="text-align: left; padding: 15px 0;">
          <p style="margin-bottom: 15px; color: var(--text-muted); font-size: 0.95rem;">
            Tienes las siguientes cuentas pendientes que requieren atención hoy, mañana o en el transcurso de la semana:
          </p>

          <div style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 6px;">
            <div v-for="rem in urgentReminders" :key="rem.id" 
                 style="background: var(--bg-app); border: 1px solid var(--border-color); padding: 14px; border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <strong style="font-size: 1rem; color: var(--text-main);">{{ rem.titulo }}</strong>
                <span :class="['date-badge', getDaysRemainingClass(rem)]" style="font-size: 0.75rem; padding: 3px 8px; border-radius: 99px; font-weight: 700;">
                  {{ getDaysRemainingText(rem) }}
                </span>
              </div>
              <p v-if="rem.descripcion" style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">{{ rem.descripcion }}</p>
              <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-top: 4px;">
                Monto: <span style="color: var(--danger-hover);">S/. {{ rem.monto ? rem.monto.toFixed(2) : '0.00' }}</span>
              </div>
            </div>
          </div>
        </div>

        <footer class="modal-actions" style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
          <router-link to="/reminders" @click="showReminderAlert = false" class="btn btn-primary" style="text-decoration: none; display: flex; align-items: center; justify-content: center;">
            ⚙️ Ir a Recordatorios
          </router-link>
          <button @click="showReminderAlert = false" class="btn btn-secondary">Entendido</button>
        </footer>
      </div>
    </div>
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
  totalNetoDia: 0,
  totalGastosCompras: 0,
  productosBajoStockCount: 0,
  productosBajoStock: [],
  movimientosRecientes: [],
  ventasHorarias: [],
  metodosPagoDia: [],
  productosMasVendidosDia: [],
  fechaDiaActual: ''
})

const hoveredSegmentDia = ref(null)

const totalPagoDia = computed(() => {
  if (!stats.value.metodosPagoDia || stats.value.metodosPagoDia.length === 0) return 0
  return stats.value.metodosPagoDia.reduce((acc, m) => acc + m.total, 0)
})

// Variables para el sistema de alertas de Recordatorios
const showReminderAlert = ref(false)
const urgentReminders = ref([])

const getDaysRemainingClass = (rem) => {
  const diffTime = new Date(rem.fechaVencimiento) - new Date()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'date-expired'
  if (diffDays <= 3) return 'date-urgent'
  return 'date-ok'
}

const getDaysRemainingText = (rem) => {
  const diffTime = new Date(rem.fechaVencimiento) - new Date()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return `Vencido`
  if (diffDays === 0) return 'Vence hoy'
  if (diffDays === 1) return 'Vence mañana'
  return `Vence en ${diffDays} días`
}

const checkUrgentReminders = async () => {
  try {
    const todayStr = new Date().toDateString()
    const lastCheck = localStorage.getItem('last_reminder_check_date')
    
    // Si ya se hizo el chequeo diario hoy, no volvemos a molestar
    if (lastCheck === todayStr) return

    const res = await fetch(`${API_URL}/api/reminders`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    const allReminders = await res.json()

    // Filtrar los que estén Pendientes y expiren en: hoy (0), mañana (1) o 1 semana (7) o ya estén vencidos
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const urgent = allReminders.filter(rem => {
      if (rem.estado !== 'Pendiente') return false
      
      const targetDate = new Date(rem.fechaVencimiento)
      targetDate.setHours(0, 0, 0, 0)
      
      const diffTime = targetDate - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      // Coincide si está vencido, vence hoy (0), mañana (1), o exactamente en 7 días (o en el rango de la semana)
      return diffDays <= 7
    })

    if (urgent.length > 0) {
      urgentReminders.value = urgent
      showReminderAlert.value = true
    }

    // Marcar como chequeado para el día de hoy
    localStorage.setItem('last_reminder_check_date', todayStr)
  } catch (err) {
    console.error('Error checking urgent reminders:', err)
  }
}

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
      totalNetoDia: data.totalNetoDia || 0,
      totalGastosCompras: data.totalGastosCompras || 0,
      productosBajoStockCount: data.productosBajoStockCount || 0,
      productosBajoStock: data.productosBajoStock || [],
      movimientosRecientes: data.movimientosRecientes || [],
      ventasHorarias: data.ventasHorarias || [],
      metodosPagoDia: data.metodosPagoDia || [],
      productosMasVendidosDia: data.productosMasVendidosDia || [],
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
  return max === 0 ? 100 : max * 1.15
})

const hourlyChartPoints = computed(() => {
  if (!stats.value.ventasHorarias || stats.value.ventasHorarias.length === 0) return []
  const count = stats.value.ventasHorarias.length
  return stats.value.ventasHorarias.map((v, index) => {
    const x = 50 + index * (730 / Math.max(1, count - 1))
    const y = 190 - (v.total / maxHourlyVenta.value) * 160
    return { x, y, val: v.total, label: v.hora.substring(0, 5) }
  })
})

const hourlyLinePath = computed(() => {
  const points = hourlyChartPoints.value
  if (points.length === 0) return ""
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
})

const hourlyAreaPath = computed(() => {
  const points = hourlyChartPoints.value
  if (points.length === 0) return ""
  const startX = points[0].x
  const endX = points[points.length - 1].x
  return `${points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} L ${endX} 190 L ${startX} 190 Z`
})

// Pie Chart Helpers
const pieSegmentsDia = computed(() => {
  if (!stats.value.metodosPagoDia || stats.value.metodosPagoDia.length === 0) return []
  const totalAmount = stats.value.metodosPagoDia.reduce((acc, m) => acc + m.total, 0)
  if (totalAmount === 0) return []
  
  let cumulativePercent = 0
  const colors = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4']
  
  return stats.value.metodosPagoDia.map((m, index) => {
    const percent = m.total / totalAmount
    const startAngle = cumulativePercent * 360
    const endAngle = (cumulativePercent + percent) * 360
    const midAngle = startAngle + (percent * 360) / 2
    
    cumulativePercent += percent
    
    const startRad = (startAngle - 90) * Math.PI / 180
    const endRad = (endAngle - 90) * Math.PI / 180
    const midRad = (midAngle - 90) * Math.PI / 180
    
    const x1 = 60 + 50 * Math.cos(startRad)
    const y1 = 60 + 50 * Math.sin(startRad)
    const x2 = 60 + 50 * Math.cos(endRad)
    const y2 = 60 + 50 * Math.sin(endRad)
    
    const largeArcFlag = percent > 0.5 ? 1 : 0
    
    let d = ""
    if (percent === 1) {
      d = `M 60 10 A 50 50 0 1 1 59.9 10 Z`
    } else {
      d = `M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
    }
    
    const explodeDist = 6
    const dx = Math.cos(midRad) * explodeDist
    const dy = Math.sin(midRad) * explodeDist

    // Coordenadas para el texto del porcentaje (centroide del segmento)
    const tx = 60 + 35 * Math.cos(midRad)
    const ty = 60 + 35 * Math.sin(midRad) + 2 // Pequeño ajuste vertical

    return {
      metodo: m.metodo,
      total: m.total,
      percent: (percent * 100).toFixed(1),
      d,
      dx,
      dy,
      tx,
      ty,
      color: colors[index % colors.length]
    }
  })
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchStats()
  checkUrgentReminders()
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

.kpi-total-card {
  transition: var(--transition);
}

.kpi-total-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
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

/* Custom Charts Layout */
.charts-layout {
  display: grid;
  grid-template-columns: 2.3fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .charts-layout {
    grid-template-columns: 1fr;
  }
}

/* Hourly Bar Chart styling */
.line-chart-svg {
  width: 100%;
  max-height: 35vh;      /* ~320px en 900px de altura */
}

.chart-axis-label {
  font-size: 11px;
  fill: var(--text-muted);
  font-weight: 500;
}

.chart-tooltip-text {
  font-size: 10px;
  fill: var(--text-main);
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chart-point {
  transition: all 0.2s ease;
  cursor: pointer;
}

.chart-point-group:hover .chart-tooltip-text {
  opacity: 1;
}

.chart-point-group:hover .chart-point {
  r: 6.5;
  fill: var(--primary-hover);
}

/* Pie Chart Styling */
.donut-chart-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.pie-wrapper {
  position: relative;
  width: 25vh;
  height: 25vh;
  min-width: 170px;
  min-height: 170px;
}

.pie-chart-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.pie-slice-group {
  transform-origin: 60px 60px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.pie-slice-group:hover {
  transform: translate(var(--dx), var(--dy)) scale(1.05);
}

.pie-segment {
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.pie-slice-group:hover .pie-segment {
  filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.2));
  opacity: 0.95;
}

.pie-label {
  font-size: 7.5px;
  font-weight: 800;
  fill: #ffffff;
  pointer-events: none;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.4);
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  padding: 24px;
  position: relative;
  background: #ffffff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--text-muted);
}

.date-badge {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

.date-badge.date-ok {
  background-color: #e0f2fe;
  color: #0369a1;
}

.date-badge.date-urgent {
  background-color: #fffbeb;
  color: #d97706;
  border: 1px solid #fef3c7;
}

.date-badge.date-expired {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fee2e2;
}
</style>
