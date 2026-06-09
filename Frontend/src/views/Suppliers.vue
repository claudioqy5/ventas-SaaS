<template>
  <div class="dashboard-layout">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="sidebar-brand">🍦 VentasSaaS</div>
      <div class="user-info">
        <p class="user-name">Hola, {{ authStore.user?.nombre }}</p>
        <span class="user-badge">{{ authStore.user?.rol }}</span>
      </div>
      <nav class="nav-links">
        <router-link to="/dashboard" class="nav-item">📊 Dashboard</router-link>
        <router-link to="/pos" class="nav-item">🛒 POS Ventas</router-link>
        <router-link to="/products" class="nav-item">📦 Productos</router-link>
        <router-link to="/categories" class="nav-item">🏷️ Categorías</router-link>
        <router-link v-if="authStore.hasPermission('clientes')" to="/clients" class="nav-item">👥 Clientes</router-link>
        <router-link v-if="authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item active">🏢 Proveedores</router-link>
        <router-link v-if="authStore.hasPermission('compras')" to="/purchases" class="nav-item">💵 Compras</router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item">👥 Colaboradores</router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 Cerrar Sesión</button>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">🏢 Gestión de Proveedores</h1>
            <p class="text-subtitle">Registra y administra tus proveedores comerciales</p>
          </div>
          <button @click="openCreateModal" class="btn btn-primary">➕ Agregar Proveedor</button>
        </div>
      </header>

      <!-- Table Card -->
      <div class="card font-card">
        <div v-if="suppliers.length === 0" class="empty-state">
          No hay proveedores registrados.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Nombre del Proveedor</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sup in suppliers" :key="sup.id">
              <td><strong>{{ sup.nombre }}</strong></td>
              <td>{{ sup.telefono || 'N/A' }}</td>
              <td>{{ sup.correo || 'N/A' }}</td>
              <td>{{ sup.direccion || 'N/A' }}</td>
              <td>
                <div class="actions-cell">
                  <button @click="openEditModal(sup)" class="btn-action edit" title="Editar">✏️</button>
                  <button @click="confirmDelete(sup.id)" class="btn-action delete" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title">{{ isEdit ? '✏️ Editar Proveedor' : '🏢 Registrar Proveedor' }}</h2>
          <form @submit.prevent="saveSupplier" class="grid">
            <div class="field">
              <label>Nombre Comercial / Razón Social</label>
              <input v-model="form.nombre" type="text" placeholder="Ej. Distribuidora Central" required />
            </div>

            <div class="grid grid-2">
              <div class="field">
                <label>Teléfono de Contacto</label>
                <input v-model="form.telefono" type="text" placeholder="987654321" />
              </div>
              <div class="field">
                <label>Correo Electrónico</label>
                <input v-model="form.correo" type="email" placeholder="ventas@distribuidora.com" />
              </div>
            </div>

            <div class="field">
              <label>Dirección</label>
              <input v-model="form.direccion" type="text" placeholder="Av. Principal 456" />
            </div>

            <div class="modal-actions">
              <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Registrar Proveedor' }}</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const suppliers = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const form = reactive({
  nombre: '',
  telefono: '',
  correo: '',
  direccion: ''
})

const fetchSuppliers = async () => {
  try {
    const res = await fetch('http://localhost:5246/api/suppliers', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    suppliers.value = await res.json()
  } catch (err) {
    console.error('Error fetching suppliers')
  }
}

const openCreateModal = () => {
  isEdit.value = false
  currentId.value = null
  form.nombre = ''
  form.telefono = ''
  form.correo = ''
  form.direccion = ''
  showModal.value = true
}

const openEditModal = (sup) => {
  isEdit.value = true
  currentId.value = sup.id
  form.nombre = sup.nombre
  form.telefono = sup.telefono
  form.correo = sup.correo
  form.direccion = sup.direccion
  showModal.value = true
}

const saveSupplier = async () => {
  try {
    const url = isEdit.value 
      ? `http://localhost:5246/api/suppliers/${currentId.value}`
      : 'http://localhost:5246/api/suppliers'
    
    const method = isEdit.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(form)
    })

    if (!res.ok) throw new Error('Error al guardar el proveedor.')

    showModal.value = false
    alert(isEdit.value ? '¡Proveedor actualizado!' : '¡Proveedor registrado!')
    fetchSuppliers()
  } catch (err) {
    alert(err.message)
  }
}

const confirmDelete = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este proveedor?')) return

  try {
    const res = await fetch(`http://localhost:5246/api/suppliers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!res.ok) throw new Error('Error al eliminar el proveedor.')

    alert('¡Proveedor eliminado!')
    fetchSuppliers()
  } catch (err) {
    alert(err.message)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchSuppliers()
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar Styling */
.sidebar {
  width: 280px;
  background-color: #ffffff;
  border-right: 1px solid var(--border-color);
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex-shrink: 0;
}

.sidebar-brand {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-main);
}

.user-info {
  background: var(--bg-app);
  padding: 16px;
  border-radius: var(--radius-md);
  text-align: left;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.user-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #1e3a8a;
  background: var(--primary);
  padding: 2px 8px;
  border-radius: 99px;
  display: inline-block;
  margin-top: 4px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.nav-item:hover, .nav-item.active {
  background-color: var(--border-color);
  color: var(--text-main);
}

.logout-btn {
  margin-top: auto;
}

/* Main Area */
.main-content {
  flex-grow: 1;
  padding: 40px;
  background-color: var(--bg-app);
  overflow-y: auto;
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

/* Modal overlays and dialog cards */
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
  max-width: 550px;
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
</style>
