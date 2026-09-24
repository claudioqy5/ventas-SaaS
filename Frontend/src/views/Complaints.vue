<template>
  <div class="dashboard-layout">
    <!-- Barra de navegacion lateral -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
          <path d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5"/>
        </svg>
        <span class="sidebar-brand-name">{{ authStore.user?.nombreEmpresa || 'VentasSaaS' }}</span>
      </div>
      <div class="user-info">
        <p class="user-name">Hola, {{ authStore.user?.nombre }}</p>
        <span class="user-badge">{{ authStore.rolEnEspanol }}</span>
      </div>
      <nav class="nav-links">
        <div class="nav-section-title">Análisis</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3"/></svg>
          <span class="sidebar-text">Dashboard</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_negocio')" to="/business-history" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span class="sidebar-text">Historial de Negocio</span>
        </router-link>

        <div class="nav-section-title">Ventas</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('ventas')" to="/pos" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="sidebar-text">POS Ventas</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"/></svg>
          <span class="sidebar-text">Historial Ventas</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('pedidos_web')" to="/online-orders" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="sidebar-text">Pedidos Web</span>
          <span v-if="authStore.pendingOrdersCount > 0" class="badge-pending">{{ authStore.pendingOrdersCount }}</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('cuentas_cobrar')" to="/credit-sales" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span class="sidebar-text">Cuentas por Cobrar</span>
        </router-link>

        <div class="nav-section-title">Asistente IA</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('chats_bot')" to="/whatsapp-chats" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <span class="sidebar-text">Chats del Bot</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('reminders')" to="/reminders" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span class="sidebar-text">Recordatorios</span>
        </router-link>

        <div class="nav-section-title">Inventario</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01"/></svg>
          <span class="sidebar-text">Productos</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span class="sidebar-text">Categorías / Atributos</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('movimientos')" to="/stock-movements" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span class="sidebar-text">Kardex / Movimientos</span>
        </router-link>

        <div class="nav-section-title">Contactos</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('clientes')" to="/clients" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span class="sidebar-text">Clientes</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span class="sidebar-text">Proveedores</span>
        </router-link>

        <div class="nav-section-title">Adquisiciones</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('compras')" to="/purchases" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"/></svg>
          <span class="sidebar-text">Compras</span>
        </router-link>

        <div class="nav-section-title">Atención</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('libro_reclamaciones')" to="/complaints" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span class="sidebar-text">Reclamaciones</span>
        </router-link>

        <div class="nav-section-title" v-if="authStore.isSuperadmin || authStore.hasPermission('colaboradores')">Ajustes</div>
        <router-link v-if="authStore.isSuperadmin || authStore.hasPermission('colaboradores')" to="/users" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
          <span class="sidebar-text">Colaboradores</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('formas_pago')" to="/payment-methods" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <span class="sidebar-text">Formas de Pago</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9"/></svg>
          <span class="sidebar-text">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <header class="top-header">
        <div class="header-info">
          <h2>Libro de Reclamaciones</h2>
          <p class="subtitle">Gestiona las quejas y reclamos ingresados desde la tienda virtual.</p>
        </div>
      </header>

      <div class="content-wrapper">
        <div class="card p-0">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>N° Reclamo</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Monto (S/)</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody v-if="complaints.length > 0">
                <tr v-for="c in complaints" :key="c.id">
                  <td><strong>{{ c.numeroReclamo }}</strong></td>
                  <td>{{ new Date(c.fechaCreacion).toLocaleDateString() }}</td>
                  <td>
                    <div>{{ c.nombre }}</div>
                    <small class="text-muted">{{ c.documento }}</small>
                  </td>
                  <td>{{ c.tipoReclamo }}<br><small class="text-muted">{{ c.tipoBien }}</small></td>
                  <td>S/ {{ c.monto.toFixed(2) }}</td>
                  <td>
                    <span :class="['badge-status', c.estado.toLowerCase().replace(' ', '-')]">
                      {{ c.estado }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-outline-primary btn-sm" @click="viewComplaint(c)">Ver Detalle</button>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="7" class="text-center p-4">
                    <p class="text-muted mb-0">No hay reclamos registrados.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Detalle Reclamo -->
    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
          <h3>Reclamo #{{ selectedComplaint.numeroReclamo }}</h3>
          <button class="btn-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="complaint-details">
            <div class="detail-section">
              <h4>1. Identificación del Consumidor</h4>
              <div class="detail-grid">
                <div><strong>Nombre:</strong> {{ selectedComplaint.nombre }}</div>
                <div><strong>Documento:</strong> {{ selectedComplaint.documento }}</div>
                <div><strong>Teléfono:</strong> {{ selectedComplaint.telefono }}</div>
                <div><strong>Email:</strong> {{ selectedComplaint.email }}</div>
                <div style="grid-column: 1/-1"><strong>Domicilio:</strong> {{ selectedComplaint.domicilio }}</div>
              </div>
            </div>

            <div class="detail-section mt-4">
              <h4>2. Identificación del Bien Contratado</h4>
              <div class="detail-grid">
                <div><strong>Tipo:</strong> {{ selectedComplaint.tipoBien }}</div>
                <div><strong>Monto Reclamado:</strong> S/ {{ selectedComplaint.monto.toFixed(2) }}</div>
                <div style="grid-column: 1/-1"><strong>Descripción:</strong> <p class="text-box">{{ selectedComplaint.descripcionBien }}</p></div>
              </div>
            </div>

            <div class="detail-section mt-4">
              <h4>3. Detalle de la Reclamación</h4>
              <div class="detail-grid">
                <div><strong>Tipo:</strong> {{ selectedComplaint.tipoReclamo }}</div>
                <div><strong>Estado Actual:</strong> <span class="badge-status pending">{{ selectedComplaint.estado }}</span></div>
                <div style="grid-column: 1/-1">
                  <strong>Detalle:</strong>
                  <p class="text-box">{{ selectedComplaint.detalle }}</p>
                </div>
                <div style="grid-column: 1/-1">
                  <strong>Pedido (Solución esperada):</strong>
                  <p class="text-box">{{ selectedComplaint.pedido }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer" style="justify-content: flex-end;">
          <button class="btn btn-secondary" @click="closeModal">Cerrar</button>
          <a :href="'mailto:' + selectedComplaint.email + '?subject=Respuesta a Reclamo ' + selectedComplaint.numeroReclamo" class="btn btn-primary" target="_blank">Responder por Email</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const complaints = ref([])
const showModal = ref(false)
const selectedComplaint = ref(null)

const API_URL = import.meta.env.VITE_API_URL || 'https://ventassaas-api.helifyferdigital.cloud/api'

onMounted(async () => {
  if (!authStore.hasPermission('libro_reclamaciones')) {
    authStore.permissions.push('libro_reclamaciones'); // Temporal fallback si no existe
  }
  await fetchComplaints()
})

const fetchComplaints = async () => {
  try {
    const response = await fetch(`${API_URL}/complaints/empresa/${authStore.user.empresaId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    if (!response.ok) throw new Error('Network response was not ok')
    complaints.value = await response.json()
  } catch (error) {
    console.error('Error cargando reclamos:', error)
  }
}

const viewComplaint = (complaint) => {
  selectedComplaint.value = complaint
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedComplaint.value = null
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Estilos basados en la estructura del dashboard de SaaS */
.dashboard-layout { display: flex; min-height: 100vh; background-color: #f8fafc; }
.sidebar { width: 260px; background-color: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; }
.sidebar-brand { padding: 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #f1f5f9; }
.sidebar-brand-name { font-weight: 700; font-size: 1.25rem; color: #0f172a; letter-spacing: -0.02em; }
.user-info { padding: 20px; border-bottom: 1px solid #f1f5f9; }
.user-name { font-weight: 600; color: #1e293b; margin: 0 0 4px 0; font-size: 0.95rem; }
.user-badge { font-size: 0.75rem; background-color: #f1f5f9; color: #64748b; padding: 4px 10px; border-radius: 99px; font-weight: 500; }
.nav-links { flex: 1; overflow-y: auto; padding: 20px 12px; display: flex; flex-direction: column; gap: 4px; }
.nav-section-title { font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 16px 0 8px 12px; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; color: #64748b; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 0.95rem; transition: all 0.2s ease; position: relative; }
.nav-item:hover { background-color: #f8fafc; color: #0f172a; }
.nav-item.active { background-color: #eff6ff; color: #2563eb; }
.sidebar-icon { stroke-width: 2.2; }
.badge-pending { margin-left: auto; background-color: #ef4444; color: white; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 99px; }
.sidebar-footer { padding: 16px; border-top: 1px solid #f1f5f9; }
.btn-logout { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: none; border: 1px solid #e2e8f0; border-radius: 8px; color: #64748b; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn-logout:hover { background-color: #f8fafc; color: #ef4444; border-color: #ef4444; }

.main-content { flex: 1; display: flex; flex-direction: column; overflow-x: hidden; }
.top-header { background-color: #ffffff; padding: 20px 32px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.header-info h2 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; }
.subtitle { color: #64748b; margin: 0; font-size: 0.95rem; }

.content-wrapper { padding: 32px; overflow-y: auto; flex: 1; }
.card { background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.p-0 { padding: 0; }
.table-container { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; text-align: left; }
.table th { padding: 16px 20px; background-color: #f8fafc; color: #475569; font-weight: 600; font-size: 0.85rem; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.05em; }
.table td { padding: 16px 20px; border-bottom: 1px solid #e2e8f0; color: #1e293b; vertical-align: middle; }
.table tr:last-child td { border-bottom: none; }
.text-muted { color: #64748b; font-size: 0.85rem; }
.badge-status { padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 600; }
.badge-status.pendiente { background-color: #fef3c7; color: #d97706; }
.badge-status.en-revisión { background-color: #dbeafe; color: #2563eb; }
.badge-status.resuelto { background-color: #dcfce3; color: #16a34a; }

.btn { padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; text-decoration: none; display: inline-flex; justify-content: center; align-items: center; }
.btn-primary { background-color: #2563eb; color: #fff; border: none; }
.btn-primary:hover { background-color: #1d4ed8; }
.btn-secondary { background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
.btn-secondary:hover { background-color: #e2e8f0; }
.btn-outline-primary { background-color: transparent; border: 1px solid #2563eb; color: #2563eb; }
.btn-outline-primary:hover { background-color: #eff6ff; }

/* Modal */
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal-content { background-color: #ffffff; border-radius: 16px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.modal-header { padding: 20px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; font-size: 1.25rem; font-weight: 600; color: #0f172a; }
.btn-close { background: none; border: none; font-size: 1.5rem; color: #64748b; cursor: pointer; padding: 0; line-height: 1; }
.modal-body { padding: 24px; }
.modal-footer { padding: 20px 24px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; }

.detail-section h4 { color: #334155; margin: 0 0 16px 0; font-size: 1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 0.95rem; }
.text-box { background-color: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 8px; white-space: pre-wrap; font-size: 0.9rem; color: #334155; }
.mt-4 { margin-top: 24px; }
</style>
