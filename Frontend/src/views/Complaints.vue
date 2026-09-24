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
        <!-- SECCIÓN: ANÁLISIS -->
        <div class="nav-section-title">Análisis</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3"/></svg> <span class="sidebar-text">Dashboard</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_negocio')" to="/business-history" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> <span class="sidebar-text">Historial de Negocio</span></router-link>

        <!-- SECCIÓN: VENTAS -->
        <div class="nav-section-title">Ventas</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('ventas')" to="/pos" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0"/></svg> <span class="sidebar-text">POS Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"/></svg> <span class="sidebar-text">Historial Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('pedidos_web')" to="/online-orders" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><circle cx="12" cy="12" r="10"/><path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span class="sidebar-text">Pedidos</span>
          <span v-if="authStore.pendingOrdersCount > 0" class="badge-count">{{ authStore.pendingOrdersCount }}</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('chats_bot')" to="/whatsapp-chats" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> <span class="sidebar-text">Chats WhatsApp</span></router-link>
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
              <div class="nav-section-title">Atención</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('libro_reclamaciones')" to="/complaints" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span class="sidebar-text">Reclamaciones</span>
        </router-link>

        <div class="nav-section-title" v-if="authStore.isSuperadmin || authStore.hasPermission('colaboradores')">Ajustes</div>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9"/></svg>
        <span class="sidebar-text">Cerrar Sesión</span>
      </button>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <header class="content-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div class="header-info">
          <h1 class="text-title" style="margin: 0;">Libro de Reclamaciones</h1>
          <p class="text-subtitle" style="margin: 0;">Gestiona las quejas y reclamos ingresados desde la tienda virtual.</p>
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
/* Estilos adicionales para esta vista */

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
.modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
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
