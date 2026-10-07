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
        <div class="nav-section-title">Análisis</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item" active-class="active"><span class="sidebar-text">Dashboard</span></router-link>
        
        <div class="nav-section-title">Logística</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item" active-class="active"><span class="sidebar-text">Inventario</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item" active-class="active"><span class="sidebar-text">Características</span></router-link>
        
        <div class="nav-section-title">Marketing</div>
        <router-link to="/coupons" class="nav-item" active-class="active"><span class="sidebar-text">Cupones</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn"><span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Area de contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">Cupones de Descuento</h1>
            <p class="text-subtitle">Crea y administra códigos de descuento para tus clientes</p>
          </div>
        </div>
      </header>

      <div class="header-flex" style="margin-bottom: 16px;">
        <div class="table-filters" style="margin-bottom: 0; flex-grow: 1; max-width: 400px; padding: 10px;">
          <input v-model="searchQuery" type="text" placeholder="Buscar cupón..." class="filter-input" />
        </div>
        <button @click="openCreateModal" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px;">
          Agregar Cupón
        </button>
      </div>

      <!-- Lista de Datos -->
      <div v-if="!loading" class="card font-card">
        <div v-if="!loading && filteredItems.length === 0" class="empty-state">
          No se encontraron cupones.
        </div>
        <table v-if="!loading && filteredItems.length > 0" class="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descuento (%)</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td><strong>{{ item.code }}</strong></td>
              <td>{{ item.discountPercentage }}%</td>
              <td>
                <span :style="{ color: item.isActive ? '#16a34a' : '#dc2626', fontWeight: 'bold' }">
                  {{ item.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="actions-cell">
                  <button @click="openEditModal(item)" class="btn-action edit" title="Editar">Editar</button>
                  <button @click="confirmDelete(item.id)" class="btn-action delete" title="Eliminar">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title">{{ isEdit ? 'Editar Cupón' : 'Registrar Cupón' }}</h2>
          <form @submit.prevent="saveItem" class="grid">
            <div class="field">
              <label>Código del Cupón (Ej. VERANO20)</label>
              <input v-model="form.code" type="text" placeholder="Ej. DESCUENTO10" required />
            </div>
            
            <div class="field">
              <label>Porcentaje de Descuento (%)</label>
              <input v-model.number="form.discountPercentage" type="number" min="1" max="100" placeholder="Ej. 15" required />
            </div>

            <div class="field" style="flex-direction: row; align-items: center; gap: 8px;">
              <input v-model="form.isActive" type="checkbox" id="isActiveCheck" style="width: auto; margin: 0;" />
              <label for="isActiveCheck" style="margin: 0; cursor: pointer;">Cupón Activo</label>
            </div>

            <div class="modal-actions">
              <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Registrar' }}</button>
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

const items = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const searchQuery = ref('')

const filteredItems = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return items.value.filter(c => 
    (c.code && c.code.toLowerCase().includes(q))
  )
})

const form = reactive({
  code: '',
  discountPercentage: 10,
  isActive: true
})

const loading = ref(false)

const fetchItems = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/coupons`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    items.value = await res.json()
  } catch (err) {
    console.error('Error fetching coupons')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEdit.value = false
  currentId.value = null
  form.code = ''
  form.discountPercentage = 10
  form.isActive = true
  showModal.value = true
}

const openEditModal = (item) => {
  isEdit.value = true
  currentId.value = item.id
  form.code = item.code
  form.discountPercentage = item.discountPercentage
  form.isActive = item.isActive
  showModal.value = true
}

const saveItem = async () => {
  try {
    const url = isEdit.value 
      ? `${API_URL}/api/coupons/${currentId.value}`
      : `${API_URL}/api/coupons`
    
    const method = isEdit.value ? 'PUT' : 'POST'

    const payload = {
      code: form.code.toUpperCase(),
      discountPercentage: form.discountPercentage,
      isActive: form.isActive
    }

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errData = await res.json().catch(()=>({}))
      throw new Error(errData.message || 'Error al procesar la operación.')
    }

    showModal.value = false
    alert(isEdit.value ? '¡Actualizado!' : '¡Registrado!')
    fetchItems()
  } catch (err) {
    alert(err.message)
  }
}

const confirmDelete = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este cupón?')) return

  try {
    const res = await fetch(`${API_URL}/api/coupons/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!res.ok) throw new Error('Error al eliminar.')

    alert('¡Eliminado!')
    fetchItems()
  } catch (err) {
    alert(err.message)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
.content-header {
  margin-bottom: 20px;
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
  font-weight: 500;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2vh 2vw;
  box-sizing: border-box;
}

.modal-card {
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
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
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
