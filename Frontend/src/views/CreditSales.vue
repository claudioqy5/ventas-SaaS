<template>
  <div class="dashboard-layout">
    <!-- Barra lateral -->
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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('pedidos_web')" to="/online-orders" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><circle cx="12" cy="12" r="10"/><path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> <span class="sidebar-text">Pedidos Web</span></router-link>
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

    <!-- Contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">▫ Cuentas por Cobrar (Fiados)</h1>
            <p class="text-subtitle">Gestiona las deudas de tus clientes y registra los pagos</p>
          </div>
          <div v-if="metrics" class="credit-stats-card">
            <div class="stat-item">
              <span class="stat-label">Total Pendiente</span>
              <span class="stat-value danger">S/. {{ metrics.totalPendiente.toFixed(2) }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-label">Total Recuperado</span>
              <span class="stat-value ok">S/. {{ metrics.totalRecuperado.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Pestañas -->
      <div class="tabs-nav">
        <button :class="['tab-btn', activeTab === 'pendientes' ? 'active' : '']" @click="activeTab = 'pendientes'">⏳ Deudas Pendientes</button>
        <button :class="['tab-btn', activeTab === 'historico' ? 'active' : '']" @click="switchToHistory">✓ Histórico de Pagados</button>
      </div>

      <!-- TAB: Pendientes -->
      <template v-if="activeTab === 'pendientes'">
        <div class="card font-card">
          <div v-if="pendingSales.length === 0" class="empty-state">
            🎉 ¡Excelente! No tienes cuentas por cobrar pendientes.
          </div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th>Fecha de Fiado</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Total a Pagar</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in pendingSales" :key="sale.id">
                <td>{{ formatDate(sale.fechaCreacion) }}</td>
                <td><strong>{{ sale.nombreCliente || 'Cliente no registrado' }}</strong></td>
                <td>{{ sale.creadoPorNombre }}</td>
                <td class="total-cell">S/. {{ sale.total.toFixed(2) }}</td>
                <td>
                  <button @click="openPayModal(sale)" class="btn btn-primary btn-sm">💰 Registrar Pago</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- TAB: Histórico -->
      <template v-if="activeTab === 'historico'">
        <div class="card font-card">
          <div v-if="historySales.length === 0" class="empty-state">
            Aún no hay registros de fiados que hayan sido pagados.
          </div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th>Fecha de Cobro</th>
                <th>Cliente</th>
                <th>Forma de Pago</th>
                <th>Monto Recuperado</th>
                <th>Vendedor Original</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in historySales" :key="sale.id">
                <td><strong>{{ formatDate(sale.fechaPago) }}</strong><br><small class="text-muted">Fiado el: {{ formatDate(sale.fechaCreacion) }}</small></td>
                <td><strong>{{ sale.nombreCliente }}</strong></td>
                <td><span class="badge badge-info">{{ sale.metodoPago }}</span></td>
                <td class="total-cell ok">S/. {{ sale.total.toFixed(2) }}</td>
                <td>{{ sale.creadoPorNombre }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Modal para registrar pago -->
      <div v-if="showPayModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title">💰 Registrar Pago de Fiado</h2>
          <p class="modal-desc">Cliente: <strong>{{ currentSale?.nombreCliente }}</strong><br>Monto a cobrar: <strong>S/. {{ currentSale?.total.toFixed(2) }}</strong></p>
          
          <form @submit.prevent="submitPayment">
            <div class="field">
              <label>Forma de Pago del Cliente</label>
              <select v-model="selectedMethod" required>
                <option value="" disabled>Seleccione método de pago...</option>
                <option v-for="pm in activePaymentMethods" :key="pm.id" :value="pm.nombre">{{ pm.nombre }}</option>
              </select>
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="showPayModal = false" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">Confirmar Pago</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('pendientes')
const pendingSales = ref([])
const historySales = ref([])
const metrics = ref(null)
const paymentMethods = ref([])

const showPayModal = ref(false)
const currentSale = ref(null)
const selectedMethod = ref('')

const activePaymentMethods = computed(() => {
  return paymentMethods.value.filter(m => m.activo)
})

const fetchMetrics = async () => {
  try {
    const res = await fetch(`${API_URL}/api/creditsales/metrics`, { headers: { 'Authorization': `Bearer ${authStore.token}` }})
    if (res.ok) metrics.value = await res.json()
  } catch(e) {}
}

const fetchPending = async () => {
  try {
    const res = await fetch(`${API_URL}/api/creditsales/pending`, { headers: { 'Authorization': `Bearer ${authStore.token}` }})
    if (res.ok) pendingSales.value = await res.json()
  } catch(e) {}
}

const fetchHistory = async () => {
  try {
    const res = await fetch(`${API_URL}/api/creditsales/history`, { headers: { 'Authorization': `Bearer ${authStore.token}` }})
    if (res.ok) historySales.value = await res.json()
  } catch(e) {}
}

const fetchPaymentMethods = async () => {
  try {
    const res = await fetch(`${API_URL}/api/paymentmethods`, { headers: { 'Authorization': `Bearer ${authStore.token}` }})
    if (res.ok) paymentMethods.value = await res.json()
  } catch(e) {}
}

const switchToHistory = () => {
  activeTab.value = 'historico'
  if (historySales.value.length === 0) fetchHistory()
}

const openPayModal = (sale) => {
  currentSale.value = sale
  selectedMethod.value = ''
  showPayModal.value = true
}

const submitPayment = async () => {
  if (!selectedMethod.value) return
  
  try {
    const res = await fetch(`${API_URL}/api/creditsales/${currentSale.value.id}/pay`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ metodoPago: selectedMethod.value })
    })

    if (!res.ok) throw new Error('Error al registrar el pago')
    
    showPayModal.value = false
    alert('Pago registrado correctamente. ¡El dinero ya cuenta en las estadísticas!')
    
    fetchPending()
    fetchMetrics()
    if (historySales.value.length > 0) fetchHistory()
  } catch(e) {
    alert(e.message)
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString('es-PE', {
    timeZone: 'America/Lima',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchPending()
  fetchMetrics()
  fetchPaymentMethods()
})
</script>

<style scoped>
.content-header {
  margin-bottom: 30px;
}
.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.credit-stats-card {
  display: flex;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 12px 24px;
  gap: 24px;
  box-shadow: var(--shadow-sm);
}
.stat-item {
  display: flex;
  flex-direction: column;
}
.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
}
.stat-value {
  font-size: 1.25rem;
  font-weight: 500;
}
.stat-value.danger { color: #dc2626; }
.stat-value.ok { color: #16a34a; }
.stat-divider {
  width: 1px;
  background-color: var(--border-color);
}

.tabs-nav {
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
}
.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}
.tab-btn:hover {
  color: var(--primary);
  background: var(--bg-app);
}
.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
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
.total-cell {
  font-weight: 500;
  color: var(--text-main);
}
.total-cell.ok { color: #16a34a; }
.empty-state {
  color: var(--text-muted);
  padding: 40px;
  text-align: center;
}
.modal-desc {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}
.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}
.badge-info {
  background-color: #e0f2fe;
  color: #0369a1;
}

/* Estilos para ventanas modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  background: white;
  text-align: left;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.field label {
  font-weight: 500;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
