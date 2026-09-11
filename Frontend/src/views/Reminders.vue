<template>
  <div class="dashboard-layout">
    <!-- Barra de navegacion lateral -->
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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('pedidos_web')" to="/online-orders" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><circle cx="12" cy="12" r="10"/><path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> <span class="sidebar-text">Pedidos Web</span></router-link>
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

    <!-- Main Content -->
    <main class="main-content">
      <header class="content-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; margin-bottom: 25px;">
        <div>
          <h1 class="text-title">◦ Recordatorios e Historial de Cuentas por Pagar</h1>
          <p class="text-subtitle">Gestiona tus cuentas pendientes, vencimientos y recordatorios importantes</p>
        </div>
        <button @click="openAddModal" class="btn btn-primary">➕ Agregar Cuenta / Recordatorio</button>
      </header>

      <!-- KPI Summary -->
      <div class="summary-kpis-container" style="display: flex; gap: 20px; margin-bottom: 24px; flex-wrap: wrap;">
        <div class="kpi-total-card pending" style="background: #fffbeb; border: 1px solid #fef3c7; padding: 12px 20px; border-radius: var(--radius-md); text-align: left; min-width: 200px; box-shadow: var(--shadow-sm);">
          <div style="font-size: 0.8rem; font-weight: 500; color: #d97706; text-transform: uppercase; letter-spacing: 0.5px;">Cuentas Pendientes</div>
          <div style="font-size: 1.6rem; font-weight: 500; color: #78350f; margin-top: 4px;">S/. {{ totalPendiente.toFixed(2) }}</div>
        </div>
        <div class="kpi-total-card paid" style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 20px; border-radius: var(--radius-md); text-align: left; min-width: 200px; box-shadow: var(--shadow-sm);">
          <div style="font-size: 0.8rem; font-weight: 500; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px;">Cuentas Pagadas / Listas</div>
          <div style="font-size: 1.6rem; font-weight: 500; color: #14532d; margin-top: 4px;">S/. {{ totalPagado.toFixed(2) }}</div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="card font-card">
        <HamsterLoader v-if="loading" label="Cargando recordatorios..." />
        <div v-else-if="reminders.length === 0" class="empty-state">
          No tienes recordatorios o cuentas registradas. ¡Haz clic en "Agregar Cuenta / Recordatorio" para registrar uno!
        </div>
        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Monto (S/.)</th>
                <th>Fecha de Vencimiento</th>
                <th>Estado</th>
                <th style="width: 180px;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rem in reminders" :key="rem.id">
                <td>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <strong>{{ rem.titulo }}</strong>
                    <span v-if="rem.recurrente" title="Repetir mensualmente" style="font-size: 0.85rem; cursor: help;">🔁</span>
                  </div>
                </td>
                <td style="color: var(--text-muted);">{{ rem.descripcion || '-' }}</td>
                <td>
                  <strong v-if="rem.monto">S/. {{ rem.monto.toFixed(2) }}</strong>
                  <span v-else style="color: var(--text-muted); font-style: italic;">Sin monto</span>
                </td>
                <td>
                  <span :class="['date-badge', getDaysRemainingClass(rem)]">
                    {{ formatDate(rem.fechaVencimiento) }} ({{ getDaysRemainingText(rem) }})
                  </span>
                </td>
                <td>
                  <span :class="['status-badge', rem.estado.toLowerCase()]">
                    {{ rem.estado }}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button v-if="rem.estado === 'Pendiente'" @click="markAsPaid(rem)" class="btn-action check" title="Marcar como Pagado" style="color: #16a34a; font-size: 1.1rem; font-weight: 500;">✓</button>
                    <button @click="openEditModal(rem)" class="btn-action edit" title="Editar">✏️</button>
                    <button @click="deleteReminder(rem.id)" class="btn-action delete" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content card">
        <div class="modal-header">
          <h2>{{ editMode ? '✏️ Editar Cuenta / Recordatorio' : '➕ Agregar Cuenta / Recordatorio' }}</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="saveReminder">
          <div class="modal-body" style="text-align: left; display: flex; flex-direction: column; gap: 16px; padding: 20px 0;">
            <div class="form-group">
              <label for="titulo" class="font-bold">Título / Nombre de la Cuenta *</label>
              <input type="text" id="titulo" v-model="form.titulo" required placeholder="Ej: Pago de Alquiler de Local" class="form-input w-full" style="padding: 10px; margin-top: 6px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);" />
            </div>

            <div class="form-group">
              <label for="descripcion" class="font-bold">Descripción (Detalles de pago)</label>
              <textarea id="descripcion" v-model="form.descripcion" placeholder="Ej: Depositar a la cuenta corriente del arrendador BCP 191..." class="form-input w-full" style="padding: 10px; margin-top: 6px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); min-height: 80px;"></textarea>
            </div>

            <div class="grid grid-2" style="gap: 16px;">
              <div class="form-group">
                <label for="monto" class="font-bold">Monto (S/.) (Opcional)</label>
                <input type="number" step="0.01" id="monto" v-model="form.monto" placeholder="Ej: 1500.00" class="form-input w-full" style="padding: 10px; margin-top: 6px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);" />
              </div>

              <div class="form-group">
                <label for="fecha" class="font-bold">Fecha de Vencimiento *</label>
                <input type="date" id="fecha" v-model="form.fechaVencimiento" required class="form-input w-full" style="padding: 10px; margin-top: 6px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);" />
              </div>
            </div>

            <div class="form-group">
              <label for="estado" class="font-bold">Estado</label>
              <select id="estado" v-model="form.estado" class="form-input w-full" style="padding: 10px; margin-top: 6px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                <option value="Pendiente">⏳ Pendiente</option>
                <option value="Pagado">✧ Pagado</option>
                <option value="Completado">✓ Completado</option>
              </select>
            </div>

            <div class="form-group" style="display: flex; align-items: center; gap: 10px; margin-top: 6px;">
              <input type="checkbox" id="recurrente" v-model="form.recurrente" style="width: 18px; height: 18px; cursor: pointer;" />
              <label for="recurrente" class="font-bold" style="cursor: pointer; user-select: none;">🔁 Repetir mensualmente automáticamente</label>
            </div>
          </div>
          <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 15px;">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="loadingSaving">
              {{ loadingSaving ? 'Guardando...' : 'Guardar Recordatorio' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { API_URL } from '../config'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import HamsterLoader from '../components/HamsterLoader.vue'

const authStore = useAuthStore()
const router = useRouter()

const reminders = ref([])
const loading = ref(false)
const showModal = ref(false)
const editMode = ref(false)
const loadingSaving = ref(false)

const form = ref({
  id: '',
  titulo: '',
  descripcion: '',
  monto: null,
  fechaVencimiento: '',
  estado: 'Pendiente',
  recurrente: false
})

const totalPendiente = computed(() => {
  return reminders.value
    .filter(r => r.estado === 'Pendiente')
    .reduce((sum, r) => sum + (r.monto ? Number(r.monto) : 0), 0)
})

const totalPagado = computed(() => {
  return reminders.value
    .filter(r => r.estado === 'Pagado' || r.estado === 'Completado')
    .reduce((sum, r) => sum + (r.monto ? Number(r.monto) : 0), 0)
})

const getDaysRemainingClass = (rem) => {
  if (rem.estado !== 'Pendiente') return 'date-completed'
  const diffTime = new Date(rem.fechaVencimiento) - new Date()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'date-expired'
  if (diffDays <= 3) return 'date-urgent'
  return 'date-ok'
}

const getDaysRemainingText = (rem) => {
  if (rem.estado !== 'Pendiente') return 'Solventado'
  const diffTime = new Date(rem.fechaVencimiento) - new Date()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return `Vencido hace ${Math.abs(diffDays)} días`
  if (diffDays === 0) return 'Vence hoy'
  if (diffDays === 1) return 'Vence mañana'
  return `Vence en ${diffDays} días`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

const fetchReminders = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/reminders`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    reminders.value = await res.json()
  } catch (err) {
    console.error('Error fetching reminders', err)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  editMode.value = false
  form.value = {
    id: '',
    titulo: '',
    descripcion: '',
    monto: null,
    fechaVencimiento: new Date().toISOString().split('T')[0],
    estado: 'Pendiente',
    recurrente: false
  }
  showModal.value = true
}

const openEditModal = (rem) => {
  editMode.value = true
  form.value = {
    id: rem.id,
    titulo: rem.titulo,
    descripcion: rem.descripcion,
    monto: rem.monto,
    fechaVencimiento: new Date(rem.fechaVencimiento).toISOString().split('T')[0],
    estado: rem.estado,
    recurrente: rem.recurrente || false
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveReminder = async () => {
  loadingSaving.value = true
  try {
    const url = editMode.value ? `${API_URL}/api/reminders/${form.value.id}` : `${API_URL}/api/reminders`
    const method = editMode.value ? 'PUT' : 'POST'
    
    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        titulo: form.value.titulo,
        descripcion: form.value.descripcion,
        monto: form.value.monto,
        fechaVencimiento: new Date(form.value.fechaVencimiento).toISOString(),
        estado: form.value.estado,
        recurrente: form.value.recurrente
      })
    })

    if (!res.ok) throw new Error()
    showModal.value = false
    fetchReminders()
  } catch (err) {
    alert('Error al guardar el recordatorio')
  } finally {
    loadingSaving.value = false
  }
}

const markAsPaid = async (rem) => {
  try {
    const res = await fetch(`${API_URL}/api/reminders/${rem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        titulo: rem.titulo,
        descripcion: rem.descripcion,
        monto: rem.monto,
        fechaVencimiento: rem.fechaVencimiento,
        estado: 'Pagado',
        recurrente: rem.recurrente || false
      })
    })
    if (!res.ok) throw new Error()
    fetchReminders()
  } catch (err) {
    alert('Error al actualizar recordatorio')
  }
}

const deleteReminder = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este recordatorio?')) return
  try {
    const res = await fetch(`${API_URL}/api/reminders/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    fetchReminders()
  } catch (err) {
    alert('Error al eliminar recordatorio')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchReminders()
})
</script>

<style scoped>
.content-header {
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
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background-color: var(--bg-app);
  color: var(--text-muted);
  font-weight: 500;
}

.status-badge {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.pendiente {
  background-color: #fff3c7;
  color: #d97706;
}

.status-badge.pagado {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.completado {
  background-color: #e0f2fe;
  color: #0369a1;
}

.date-badge {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
}

.date-badge.date-ok {
  background-color: #f1f2f5;
  color: var(--text-main);
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

.date-badge.date-completed {
  background-color: #f0fdf4;
  color: #16a34a;
}

.empty-state {
  color: var(--text-muted);
  padding: 40px;
  text-align: center;
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
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--text-muted);
}

.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.btn-action {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action:hover {
  background-color: var(--border-color);
  transform: scale(1.15);
}
</style>
