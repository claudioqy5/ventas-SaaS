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

    <!-- Area de contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">👥 Gestión de Clientes</h1>
            <p class="text-subtitle">Registra, edita y analiza el comportamiento de tus clientes</p>
          </div>
          <button v-if="activeTab === 'directorio'" @click="openCreateModal" class="btn btn-primary">➕ Agregar Cliente</button>
        </div>
      </header>

      <!-- Sistema de Tabs -->
      <div class="tabs-nav">
        <button :class="['tab-btn', activeTab === 'directorio' ? 'active' : '']" @click="activeTab = 'directorio'">📝 Directorio</button>
        <button :class="['tab-btn', activeTab === 'top' ? 'active' : '']" @click="switchToTop">🏆 Top Clientes</button>
      </div>

      <!-- ══════════ TAB: DIRECTORIO ══════════ -->
      <template v-if="activeTab === 'directorio'">
        <!-- Seccion de filtros de busqueda -->
        <div class="table-filters card">
          <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, documento, correo o teléfono..." class="filter-input" />
        </div>

        <!-- Tabla de datos principal -->
        <div class="card font-card">
          <div v-if="filteredClients.length === 0" class="empty-state">
            No se encontraron clientes que coincidan con la búsqueda.
          </div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th style="width: 50px;">N°</th>
                <th>Nombre</th>
                <th>Documento (DNI/RUC)</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(client, index) in filteredClients" :key="client.id">
                <td><strong>{{ index + 1 }}</strong></td>
                <td><strong>{{ client.nombre }}</strong></td>
                <td><code>{{ client.numeroDocumento || 'N/A' }}</code></td>
                <td>{{ client.telefono || 'N/A' }}</td>
                <td>{{ client.correo || 'N/A' }}</td>
                <td>{{ client.direccion || 'N/A' }}</td>
                <td>
                  <div class="actions-cell">
                    <button @click="openEditModal(client)" class="btn-action edit" title="Editar">✏️</button>
                    <button @click="confirmDelete(client.id)" class="btn-action delete" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ══════════ TAB: TOP CLIENTES ══════════ -->
      <template v-else-if="activeTab === 'top'">

        <!-- Alerta de clientes inactivos -->
        <div v-if="clientesInactivos.length > 0" class="inactivos-alert card">
          <div class="inactivos-header">
            <span class="inactivos-icon">🔔</span>
            <div>
              <h3 class="inactivos-title">¡Clientes Inactivos Detectados!</h3>
              <p class="inactivos-sub">{{ clientesInactivos.length }} cliente(s) no han comprado en más de 30 días. Envíales un mensaje de reactivación.</p>
            </div>
          </div>
          <div class="inactivos-list">
            <div v-for="cli in clientesInactivos" :key="cli.clienteId" class="inactivo-chip">
              <div class="inactivo-avatar">{{ cli.nombre?.charAt(0).toUpperCase() }}</div>
              <div class="inactivo-info">
                <span class="inactivo-name">{{ cli.nombre }}</span>
                <span class="inactivo-days">🕒 Hace {{ cli.diasDesdeUltimaCompra }} días</span>
              </div>
              <a v-if="cli.telefono" :href="buildWhatsappReactivacion(cli)" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-sm">📱 Reactivar</a>
            </div>
          </div>
        </div>

        <!-- Estado cargando o sin datos -->
        <div v-if="loadingTop" class="empty-state card">Calculando estadísticas…</div>
        <div v-else-if="topClientes.length === 0" class="empty-state card">
          📊 Aún no hay suficientes datos de compras vinculadas a clientes. Selecciona un cliente en el POS al registrar ventas.
        </div>

        <!-- Grid de Top Clientes -->
        <div v-else class="top-grid">
          <div v-for="(cli, idx) in topClientes" :key="cli.clienteId" class="top-card card">

            <!-- Cabecera de la card -->
            <div class="top-card-header">
              <div class="top-rank" :class="['rank-' + (idx + 1)]">{{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '#' + (idx + 1) }}</div>
              <div class="top-avatar">{{ cli.nombre?.charAt(0).toUpperCase() }}</div>
              <div class="top-info">
                <h3 class="top-name">{{ cli.nombre }}</h3>
                <span class="top-doc">{{ cli.numeroDocumento || cli.correo || 'Sin documento' }}</span>
              </div>
              <a v-if="cli.telefono" :href="buildWhatsappPromo(cli)" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-sm">📱 WhatsApp</a>
            </div>

            <!-- Métricas clave -->
            <div class="top-metrics">
              <div class="metric">
                <span class="metric-val">S/. {{ cli.totalGastado?.toFixed(2) }}</span>
                <span class="metric-lbl">Total Gastado</span>
              </div>
              <div class="metric">
                <span class="metric-val">{{ cli.numCompras }}</span>
                <span class="metric-lbl">Compras</span>
              </div>
              <div class="metric">
                <span class="metric-val" :class="cli.inactivo ? 'val-danger' : 'val-ok'">{{ cli.diasDesdeUltimaCompra }}d</span>
                <span class="metric-lbl">Desde última compra</span>
              </div>
            </div>

            <!-- Sparkline SVG de tendencia de los últimos 6 meses -->
            <div class="sparkline-wrapper">
              <span class="sparkline-label">📈 Tendencia 6 meses</span>
              <svg class="sparkline" viewBox="0 0 200 50" preserveAspectRatio="none">
                <polyline
                  :points="buildSparkline(cli.tendenciaMensual)"
                  fill="none"
                  stroke="#6366f1"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <!-- Puntos de datos -->
                <circle
                  v-for="(pt, i) in sparklinePoints(cli.tendenciaMensual)"
                  :key="i"
                  :cx="pt.x"
                  :cy="pt.y"
                  r="3"
                  fill="#6366f1"
                />
              </svg>
              <div class="sparkline-months">
                <span v-for="m in cli.tendenciaMensual" :key="m.mes">{{ m.mes }}</span>
              </div>
            </div>

            <!-- Top productos de este cliente -->
            <div v-if="cli.topProductos?.length > 0" class="top-products">
              <p class="top-products-title">🛒 Productos más comprados:</p>
              <div class="top-products-list">
                <span v-for="(p, pi) in cli.topProductos.slice(0, 3)" :key="pi" class="product-chip">
                  {{ p.producto }} <strong>x{{ p.cantidad }}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Formulario modal de creacion/edicion -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title">{{ isEdit ? '✏️ Editar Cliente' : '👥 Registrar Cliente' }}</h2>
          <form @submit.prevent="saveClient" class="grid">
            <div class="grid grid-2">
              <div class="field">
                <label>Nombre Completo</label>
                <input v-model="form.nombre" type="text" placeholder="Ej. Juan Pérez" required />
              </div>
              <div class="field">
                <label>Documento de Identidad</label>
                <input v-model="form.numeroDocumento" type="text" placeholder="DNI, RUC, RUT, etc." />
              </div>
            </div>

            <div class="grid grid-2">
              <div class="field">
                <label>Teléfono de Contacto</label>
                <input v-model="form.telefono" type="text" placeholder="987654321" />
              </div>
              <div class="field">
                <label>Correo Electrónico</label>
                <input v-model="form.correo" type="email" placeholder="juan@correo.com" />
              </div>
            </div>

            <div class="field">
              <label>Dirección</label>
              <input v-model="form.direccion" type="text" placeholder="Calle Las Flores 123" />
            </div>

            <div class="modal-actions">
              <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Registrar Cliente' }}</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const clients = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const searchQuery = ref('')

const filteredClients = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return clients.value.filter(c => 
    (c.nombre && c.nombre.toLowerCase().includes(q)) ||
    (c.numeroDocumento && c.numeroDocumento.toLowerCase().includes(q)) ||
    (c.telefono && c.telefono.toLowerCase().includes(q)) ||
    (c.correo && c.correo.toLowerCase().includes(q))
  )
})

const form = reactive({
  nombre: '',
  numeroDocumento: '',
  telefono: '',
  correo: '',
  direccion: ''
})

const fetchClients = async () => {
  try {
    const res = await fetch(`${API_URL}/api/clients`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    clients.value = await res.json()
  } catch (err) {
    console.error('Error fetching clients')
  }
}

const openCreateModal = () => {
  isEdit.value = false
  currentId.value = null
  form.nombre = ''
  form.numeroDocumento = ''
  form.telefono = ''
  form.correo = ''
  form.direccion = ''
  showModal.value = true
}

const openEditModal = (client) => {
  isEdit.value = true
  currentId.value = client.id
  form.nombre = client.nombre
  form.numeroDocumento = client.numeroDocumento
  form.telefono = client.telefono
  form.correo = client.correo
  form.direccion = client.direccion
  showModal.value = true
}

const saveClient = async () => {
  try {
    const url = isEdit.value 
      ? `${API_URL}/api/clients/${currentId.value}`
      : `${API_URL}/api/clients`
    
    const method = isEdit.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(form)
    })

    if (!res.ok) throw new Error('Error al guardar el cliente.')

    showModal.value = false
    alert(isEdit.value ? '¡Cliente actualizado!' : '¡Cliente registrado!')
    fetchClients()
  } catch (err) {
    alert(err.message)
  }
}

const confirmDelete = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return

  try {
    const res = await fetch(`${API_URL}/api/clients/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!res.ok) throw new Error('Error al eliminar el cliente.')

    alert('¡Cliente eliminado!')
    fetchClients()
  } catch (err) {
    alert(err.message)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const activeTab = ref('directorio')
const topClientes = ref([])
const loadingTop = ref(false)

const clientesInactivos = computed(() => topClientes.value.filter(c => c.inactivo))

const switchToTop = () => {
  activeTab.value = 'top'
  if (topClientes.value.length === 0) fetchTopClients()
}

const fetchTopClients = async () => {
  loadingTop.value = true
  try {
    const res = await fetch(`${API_URL}/api/clientanalytics/top`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    topClientes.value = await res.json()
  } catch (err) {
    console.error('Error fetching top clients analytics')
  } finally {
    loadingTop.value = false
  }
}

// Construye los puntos de la línea de tendencia SVG (sparkline)
const sparklinePoints = (tendencia) => {
  if (!tendencia || tendencia.length === 0) return []
  const maxVal = Math.max(...tendencia.map(t => t.total), 1)
  const width = 200
  const height = 50
  const pad = 5
  return tendencia.map((t, i) => ({
    x: pad + (i / (tendencia.length - 1 || 1)) * (width - pad * 2),
    y: height - pad - ((t.total / maxVal) * (height - pad * 2))
  }))
}

const buildSparkline = (tendencia) => {
  return sparklinePoints(tendencia).map(p => `${p.x},${p.y}`).join(' ')
}

// Mensaje de WhatsApp para clientes inactivos (reactivación con oferta)
const buildWhatsappReactivacion = (cli) => {
  const store = authStore.user?.nombreEmpresa || 'Nuestra Tienda'
  const productos = (cli.topProductos || []).slice(0, 2).map(p => p.producto).join(' y ')
  const msg = `¡Hola ${cli.nombre}! 👋 Somos *${store}* y te echamos de menos. Tus productos favoritos (${productos || 'nuestros mejores productos'}) te esperan ✨ ¡Ven a visitarnos! 🛒`
  const phone = (cli.telefono || '').replace(/[^0-9]/g, '')
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`
}

// Mensaje de WhatsApp promocional para un cliente top
const buildWhatsappPromo = (cli) => {
  const store = authStore.user?.nombreEmpresa || 'Nuestra Tienda'
  const productos = (cli.topProductos || []).slice(0, 2).map(p => p.producto).join(', ')
  const msg = `¡Hola ${cli.nombre}! 🔶 Tenemos novedades y ofertas especiales en *${store}*. ${productos ? `Recordamos que acostumbras llevar: ${productos}.` : ''} ¡Te esperamos! 🛒`
  const phone = (cli.telefono || '').replace(/[^0-9]/g, '')
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`
}

onMounted(() => {
  fetchClients()
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

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-action {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: var(--transition);
}

.btn-action:hover {
  background-color: var(--border-color);
  transform: scale(1.15);
}

/* Estilos para las ventanas modales y tarjetas de dialogo */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  width: 100%;
  max-width: 600px;
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  text-align: left;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
.table-filters {
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  background-color: #ffffff;
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
}

.filter-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

/* ── Tabs ── */
.tabs-nav {
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0;
}

.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  font-size: 0.95rem;
  font-weight: 600;
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

/* ── Alerta de inactivos ── */
.inactivos-alert {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  border: 1px solid #fed7aa;
}

.inactivos-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
}

.inactivos-icon {
  font-size: 2rem;
}

.inactivos-title {
  font-size: 1rem;
  font-weight: 700;
  color: #c2410c;
  margin: 0 0 4px 0;
}

.inactivos-sub {
  font-size: 0.85rem;
  color: #92400e;
  margin: 0;
}

.inactivos-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.inactivo-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid #fed7aa;
  box-shadow: var(--shadow-sm);
}

.inactivo-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.inactivo-info {
  display: flex;
  flex-direction: column;
}

.inactivo-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}

.inactivo-days {
  font-size: 0.78rem;
  color: #c2410c;
  font-weight: 600;
}

/* ── Grid de top clientes ── */
.top-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.top-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: var(--transition);
}

.top-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.10);
}

.top-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.top-rank {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.top-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: #fff;
  font-weight: 800;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.top-info {
  flex-grow: 1;
  overflow: hidden;
}

.top-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-doc {
  font-size: 0.78rem;
  color: var(--text-muted);
}

/* ── Métricas ── */
.top-metrics {
  display: flex;
  gap: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.metric {
  flex: 1;
  text-align: center;
  padding: 10px 6px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric:last-child {
  border-right: none;
}

.metric-val {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
}

.metric-lbl {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 600;
}

.val-ok { color: #16a34a; }
.val-danger { color: #dc2626; }

/* ── Sparkline ── */
.sparkline-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sparkline-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
}

.sparkline {
  width: 100%;
  height: 50px;
  border-radius: var(--radius-sm);
  background: var(--bg-app);
  border: 1px solid var(--border-color);
  padding: 4px;
  box-sizing: border-box;
}

.sparkline-months {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
  padding: 0 2px;
}

/* ── Productos top del cliente ── */
.top-products {
  border-top: 1px dashed var(--border-color);
  padding-top: 12px;
}

.top-products-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
  margin: 0 0 8px 0;
}

.top-products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.product-chip {
  font-size: 0.78rem;
  padding: 3px 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 99px;
  color: #1e40af;
}

/* ── Botón WhatsApp pequeño ── */
.btn-whatsapp-sm {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #25d366, #128c7e);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.78rem;
  border-radius: 99px;
  text-decoration: none;
  white-space: nowrap;
  transition: var(--transition);
  flex-shrink: 0;
}

.btn-whatsapp-sm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(37, 211, 102, 0.35);
}
</style>
