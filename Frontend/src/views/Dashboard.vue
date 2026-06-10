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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item">📦 <span class="sidebar-text">Productos</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/categories" class="nav-item">🏷️ <span class="sidebar-text">Categorías</span></router-link>
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
          <div>
            <p class="metric-value">${{ (stats.totalIngresos || 0).toFixed(2) }}</p>
            <p class="text-subtitle">Ingresos Totales</p>
          </div>
        </div>

        <div class="metric-card pink">
          <div>
            <p class="metric-value">{{ stats.totalVentas || 0 }}</p>
            <p class="text-subtitle">Ventas Realizadas</p>
          </div>
        </div>

        <div class="metric-card green">
          <div>
            <p class="metric-value">{{ stats.totalProductos || 0 }}</p>
            <p class="text-subtitle">Productos Activos</p>
          </div>
        </div>

        <div class="metric-card red">
          <div>
            <p class="metric-value">{{ stats.productosBajoStockCount || 0 }}</p>
            <p class="text-subtitle">Alertas de Stock</p>
          </div>
        </div>
      </div>

      <!-- Detail Grid -->
      <div class="grid grid-2 detail-container">
        <!-- Low Stock Alerts -->
        <div class="card font-card">
          <h2 class="section-title">⚠️ Productos con Bajo Stock</h2>
          <div v-if="!stats.productosBajoStock || stats.productosBajoStock.length === 0" class="empty-state">
            ¡Buen trabajo! Todos tus productos tienen stock suficiente.
          </div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock Actual</th>
                <th>Mínimo Requerido</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prod in stats.productosBajoStock" :key="prod.id">
                <td>{{ prod.nombre }}</td>
                <td class="text-danger font-bold">{{ prod.stock }} unidades</td>
                <td>{{ prod.stockMinimo }} unidades</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Recent Movements Log -->
        <div class="card font-card">
          <h2 class="section-title">🕒 Últimos Movimientos</h2>
          <div v-if="!stats.movimientosRecientes || stats.movimientosRecientes.length === 0" class="empty-state">
            No se han registrado movimientos de inventario aún.
          </div>
          <div v-else class="timeline">
            <div v-for="move in stats.movimientosRecientes" :key="move.id" class="timeline-item">
              <div class="timeline-header">
                <span :class="['movement-badge', move.tipo ? move.tipo.toLowerCase() : '']">{{ move.tipo }}</span>
                <span class="timeline-time">{{ new Date(move.fechaCreacion).toLocaleDateString() }}</span>
              </div>
              <p class="movement-desc"><strong>{{ move.nombreProducto }}</strong>: {{ move.motivo }} ({{ move.cantidad }} uds)</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
  movimientosRecientes: []
})

const fetchStats = async () => {
  try {
    const res = await fetch('http://localhost:5246/api/dashboard', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    // Map camelCase response to our reactive stats object
    stats.value = {
      totalProductos: data.totalProductos,
      totalVentas: data.totalVentas,
      totalIngresos: data.totalIngresos,
      totalGastosCompras: data.totalGastosCompras,
      productosBajoStockCount: data.productosBajoStockCount,
      productosBajoStock: data.productosBajoStock || [],
      movimientosRecientes: data.movimientosRecientes || []
    }
  } catch (err) {
    console.error('Error fetching dashboard stats')
  }
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
  margin-bottom: 30px;
  text-align: left;
}

.metrics-container {
  margin-bottom: 40px;
}

.metric-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-main);
}

/* Detail Elements */
.section-title {
  font-size: 1.3rem;
  font-weight: 600;
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
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  font-weight: 600;
  color: var(--text-muted);
}

.font-bold {
  font-weight: 700;
}

.text-danger {
  color: #c53030;
}

/* Activity timeline styling */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.timeline-item {
  border-left: 3px solid var(--primary);
  padding-left: 16px;
  margin-left: 8px;
}

.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.movement-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  text-transform: uppercase;
}

.movement-badge.venta { background: var(--success); color: #1b4d3e; }
.movement-badge.ajuste { background: var(--warning); color: #744210; }
.movement-badge.compra { background: var(--primary); color: #1e3a8a; }

.timeline-time {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.movement-desc {
  font-size: 0.9rem;
  color: var(--text-main);
}
</style>
