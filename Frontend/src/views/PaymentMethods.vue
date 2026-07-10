<template>
  <div class="dashboard-layout">
    <!-- Barra lateral -->
    <aside class="sidebar">
      <div class="sidebar-brand"><span>🍦</span><span class="sidebar-brand-name">{{ authStore.user?.nombreEmpresa || 'VentasSaaS' }}</span></div>
      <div class="user-info">
        <p class="user-name">Hola, {{ authStore.user?.nombre }}</p>
        <span class="user-badge">{{ authStore.rolEnEspanol }}</span>
      </div>
      <nav class="nav-links">
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item">📊 <span class="sidebar-text">Dashboard</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_negocio')" to="/business-history" class="nav-item">📈 <span class="sidebar-text">Historial de Negocio</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('ventas')" to="/pos" class="nav-item">🛒 <span class="sidebar-text">POS Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item">📋 <span class="sidebar-text">Historial Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item">📦 <span class="sidebar-text">Inventario</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item">🏷️ <span class="sidebar-text">Categorías</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('clientes')" to="/clients" class="nav-item">👥 <span class="sidebar-text">Clientes</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item">🏢 <span class="sidebar-text">Proveedores</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('compras')" to="/purchases" class="nav-item">💵 <span class="sidebar-text">Compras</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('movimientos')" to="/stock-movements" class="nav-item">🔄 <span class="sidebar-text">Movimientos</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/credit-sales" class="nav-item">📒 <span class="sidebar-text">Cuentas por Cobrar</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/payment-methods" class="nav-item active">💳 <span class="sidebar-text">Formas de Pago</span></router-link>
        <router-link v-if="!authStore.isSuperadmin" to="/reminders" class="nav-item">📅 <span class="sidebar-text">Recordatorios</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item">👥 <span class="sidebar-text">Colaboradores</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 <span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">💳 Formas de Pago</h1>
            <p class="text-subtitle">Gestiona las opciones de pago (Efectivo, Tarjetas, Yape, etc.) para tu POS</p>
          </div>
          <button @click="openCreateModal" class="btn btn-primary">➕ Agregar Forma de Pago</button>
        </div>
      </header>

      <div class="card font-card">
        <div v-if="paymentMethods.length === 0" class="empty-state">
          No tienes formas de pago registradas.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">N°</th>
              <th>Nombre de la Forma de Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pm, index) in paymentMethods" :key="pm.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td><strong>{{ pm.nombre }}</strong></td>
              <td>
                <span :class="['status-badge', pm.activo ? 'ok' : 'disabled']">
                  {{ pm.activo ? '✅ Activo' : '❌ Inactivo' }}
                </span>
              </td>
              <td>
                <div class="actions-cell">
                  <button @click="openEditModal(pm)" class="btn-action edit" title="Editar">✏️</button>
                  <button @click="confirmDelete(pm.id)" class="btn-action delete" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Crear/Editar -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title">{{ isEdit ? '✏️ Editar Forma de Pago' : '💳 Nueva Forma de Pago' }}</h2>
          <form @submit.prevent="savePaymentMethod">
            <div class="field">
              <label>Nombre</label>
              <input v-model="form.nombre" type="text" placeholder="Ej. Yape, Plin, Efectivo, Tarjeta Visa" required />
            </div>
            
            <div v-if="isEdit" class="field switch-field">
              <label>
                <input type="checkbox" v-model="form.activo" />
                Esta forma de pago está activa
              </label>
            </div>

            <div class="modal-actions">
              <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Agregar' }}</button>
            </div>
          </form>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const paymentMethods = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const form = reactive({
  nombre: '',
  activo: true
})

const fetchPaymentMethods = async () => {
  try {
    const res = await fetch(`${API_URL}/api/paymentmethods`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    paymentMethods.value = await res.json()
  } catch (err) {
    console.error('Error fetching payment methods')
  }
}

const openCreateModal = () => {
  isEdit.value = false
  currentId.value = null
  form.nombre = ''
  form.activo = true
  showModal.value = true
}

const openEditModal = (pm) => {
  isEdit.value = true
  currentId.value = pm.id
  form.nombre = pm.nombre
  form.activo = pm.activo
  showModal.value = true
}

const savePaymentMethod = async () => {
  try {
    const url = isEdit.value
      ? `${API_URL}/api/paymentmethods/${currentId.value}`
      : `${API_URL}/api/paymentmethods`
    const method = isEdit.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(form)
    })

    if (!res.ok) throw new Error('Error al guardar la forma de pago.')
    showModal.value = false
    alert(isEdit.value ? 'Forma de pago actualizada.' : 'Forma de pago registrada.')
    fetchPaymentMethods()
  } catch (err) {
    alert(err.message)
  }
}

const confirmDelete = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta forma de pago permanentemente?')) return
  try {
    const res = await fetch(`${API_URL}/api/paymentmethods/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error('No se pudo eliminar. Si está en uso, contacte a soporte.')
    alert('Forma de pago eliminada.')
    fetchPaymentMethods()
  } catch (err) {
    alert(err.message)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchPaymentMethods()
})
</script>

<style scoped>
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
.switch-field {
  margin-top: 15px;
  display: flex;
  align-items: center;
}
.switch-field label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
}
.status-badge {
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
}
.status-badge.ok {
  background-color: #d1fae5;
  color: #065f46;
}
.status-badge.disabled {
  background-color: #fee2e2;
  color: #991b1b;
}
</style>
