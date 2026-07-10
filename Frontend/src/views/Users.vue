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
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/payment-methods" class="nav-item">💳 <span class="sidebar-text">Formas de Pago</span></router-link>
        <router-link v-if="!authStore.isSuperadmin" to="/reminders" class="nav-item">📅 <span class="sidebar-text">Recordatorios</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item active">👥 <span class="sidebar-text">Colaboradores</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 <span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Area de contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">👥 Colaboradores y Permisos</h1>
            <p class="text-subtitle">Gestiona las cuentas de tus trabajadores y restringe el acceso a datos sensibles</p>
          </div>
          <button @click="openCreateModal" class="btn btn-primary">➕ Agregar Trabajador</button>
        </div>
      </header>

      <!-- Lista de colaboradores -->
      <div class="card font-card">
        <div v-if="users.length === 0" class="empty-state">
          No tienes trabajadores registrados todavía.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">N°</th>
              <th>Nombre</th>
              <th v-if="authStore.isSuperadmin">Tienda / Negocio</th>
              <th>Correo Electrónico</th>
              <th>Rol</th>
              <th>Módulos Permitidos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td><strong>{{ user.nombre }}</strong></td>
              <td v-if="authStore.isSuperadmin">
                <span class="store-badge">{{ user.nombreEmpresa || 'Sin Tienda' }}</span>
              </td>
              <td>{{ user.correo }}</td>
              <td>
                <span :class="['role-badge', user.rol === 'Superadmin' ? 'superadmin' : (user.rol === 'EmpresaOwner' ? 'owner' : 'employee')]">
                  {{ user.rol === 'Superadmin' ? 'Súper Administrador' : (user.rol === 'EmpresaOwner' ? 'Administrador' : 'Empleado') }}
                </span>
              </td>
              <td>
                <div class="permissions-badges">
                  <span v-for="perm in user.permisos" :key="perm" class="perm-badge">
                    {{ formatPermissionName(perm) }}
                  </span>
                  <span v-if="!user.permisos || user.permisos.length === 0" class="perm-badge none">Ninguno</span>
                </div>
              </td>
              <td>
                <span :class="['status-dot', user.activo ? 'active' : 'inactive']">
                  {{ user.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>
                <div class="actions-cell">
                  <button @click="openEditModal(user)" class="btn-action edit" title="Editar">✏️</button>
                  <button @click="confirmDelete(user.id)" class="btn-action delete" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal para agregar/editar colaboradores -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title">{{ isEdit ? '✏️ Editar Colaborador' : '👥 Registrar Colaborador' }}</h2>
          <form @submit.prevent="saveUser" class="grid">
            <div class="grid grid-2">
              <div class="field">
                <label>Nombre Completo</label>
                <input v-model="form.nombre" type="text" placeholder="Ej. Carlos Mendoza" required />
              </div>
              <div class="field">
                <label>Correo Electrónico</label>
                <input v-model="form.correo" type="email" placeholder="carlos@mitienda.com" required />
              </div>
            </div>

            <div class="grid grid-2">
              <div class="field">
                <label>{{ isEdit ? 'Nueva Contraseña (Opcional)' : 'Contraseña Temporal' }}</label>
                <input v-model="form.clave" type="password" placeholder="••••••••" :required="!isEdit" />
              </div>
              <div class="field">
                <label>Rol del Usuario</label>
                <select v-model="form.rol">
                  <option value="Employee">Empleado (Permisos Restringidos)</option>
                  <option value="EmpresaOwner">Administrador del Negocio</option>
                </select>
              </div>
            </div>

            <!-- Nombre del negocio (Solo si el Superadmin crea un Administrador de Negocio) -->
            <div class="grid grid-1" v-if="!isEdit && form.rol === 'EmpresaOwner' && authStore.isSuperadmin" style="margin-bottom: 15px;">
              <div class="field">
                <label>Nombre de la Tienda / Negocio</label>
                <input v-model="form.nombreTienda" type="text" placeholder="Ej. Mi Tienda Pastel" required />
              </div>
            </div>

            <!-- Asociar a tienda (Solo aplicable para el Superadmin) -->
            <div class="grid grid-1" v-if="authStore.isSuperadmin" style="margin-bottom: 15px;">
              <div class="field">
                <label>Asociar a Tienda / Negocio</label>
                <select v-model="form.empresaId" :required="form.rol !== 'EmpresaOwner' || isEdit">
                  <option value="" disabled>Selecciona una tienda</option>
                  <option v-for="emp in empresas" :key="emp.id" :value="emp.id">
                    {{ emp.nombre }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Cambiar estado de cuenta activa (Solo al editar) -->
            <div class="grid grid-2" v-if="isEdit">
              <div class="field checkbox-wrapper">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="form.activo" />
                  <span>Cuenta Activa / Permitir ingreso</span>
                </label>
              </div>
            </div>

            <!-- Selector de permisos dinamicos segun el rol de empleado -->
            <div v-if="form.rol === 'Employee'" class="permissions-selector">
              <h3>🔒 Asignar Permisos del Trabajador</h3>
              <p class="text-subtitle">Selecciona los módulos a los que este empleado tendrá acceso:</p>
              
              <div class="checkbox-grid">
                <label class="checkbox-card">
                  <input type="checkbox" value="ventas" v-model="form.permisos" />
                  <span>🛒 Ventas (POS)</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="productos" v-model="form.permisos" />
                  <span>📦 Productos e Inventario</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="dashboard" v-model="form.permisos" />
                  <span>📊 Dashboard Estadísticas</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="historial_negocio" v-model="form.permisos" />
                  <span>📈 Historial de Negocio</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="clientes" v-model="form.permisos" />
                  <span>👤 Clientes</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="proveedores" v-model="form.permisos" />
                  <span>🏢 Proveedores</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="compras" v-model="form.permisos" />
                  <span>💵 Compras (Sensible)</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="categorias" v-model="form.permisos" />
                  <span>🏷️ Categorías</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="modificar_productos" v-model="form.permisos" />
                  <span>✏️ Editar/Eliminar Productos</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="historial_ventas" v-model="form.permisos" />
                  <span>📋 Historial de Ventas</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="reminders" v-model="form.permisos" />
                  <span>📅 Recordatorios</span>
                </label>
                <label class="checkbox-card">
                  <input type="checkbox" value="movimientos" v-model="form.permisos" />
                  <span>🔄 Movimientos de Inventario</span>
                </label>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Registrar Cuenta' }}</button>
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

const users = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentUserId = ref(null)

const form = reactive({
  nombre: '',
  correo: '',
  clave: '',
  rol: 'Employee',
  permisos: ['ventas', 'productos'],
  activo: true,
  nombreTienda: '',
  empresaId: ''
})

const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_URL}/api/auth/users`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    users.value = await res.json()
  } catch (err) {
    console.error('Error fetching workers list')
  }
}

const openCreateModal = () => {
  isEdit.value = false
  currentUserId.value = null
  form.nombre = ''
  form.correo = ''
  form.clave = ''
  form.rol = authStore.isSuperadmin ? 'EmpresaOwner' : 'Employee'
  form.permisos = ['ventas', 'productos']
  form.activo = true
  form.nombreTienda = ''
  form.empresaId = ''
  showModal.value = true
}

const openEditModal = (user) => {
  isEdit.value = true
  currentUserId.value = user.id
  form.nombre = user.nombre
  form.correo = user.correo
  form.clave = '' // Mantener en blanco para no modificar
  form.rol = user.rol
  form.permisos = [...(user.permisos || [])]
  form.activo = user.activo
  form.empresaId = user.empresaId || ''
  showModal.value = true
}

const formatPermissionName = (perm) => {
  const mapping = {
    'dashboard': '📊 Dashboard',
    'historial_negocio': '📈 Historial Negocio',
    'ventas': '🛒 POS Ventas',
    'productos': '📦 Productos',
    'categorias': '🏷️ Categorías',
    'clientes': '👥 Clientes',
    'proveedores': '🏢 Proveedores',
    'compras': '💵 Compras',
    'reminders': '📅 Recordatorios',
    'movimientos': '🔄 Movimientos',
    'modificar_productos': '✏️ Editar Prod.',
    'historial_ventas': '📋 Historial Ventas'
  }
  return mapping[perm] || perm
}

const saveUser = async () => {
  try {
    const url = isEdit.value 
      ? `${API_URL}/api/auth/users/${currentUserId.value}`
      : `${API_URL}/api/auth/create-user`
    
    const method = isEdit.value ? 'PUT' : 'POST'
    
    const payload = {
      empresaId: authStore.isSuperadmin ? (form.empresaId || null) : authStore.user.empresaId,
      nombre: form.nombre,
      correo: form.correo,
      clave: form.clave || null,
      rol: form.rol,
      permisos: form.rol === 'EmpresaOwner' ? ['dashboard', 'historial_negocio', 'ventas', 'productos', 'categorias', 'modificar_productos', 'clientes', 'proveedores', 'compras', 'movimientos', 'config', 'reminders'] : form.permisos,
      activo: form.activo,
      nombreTienda: form.nombreTienda || null
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
      const err = await res.json()
      throw new Error(err.message || 'Error al procesar la operación.')
    }

    showModal.value = false
    alert(isEdit.value ? '¡Colaborador actualizado con éxito!' : '¡Colaborador registrado con éxito!')
    fetchUsers()
  } catch (err) {
    alert(err.message)
  }
}

const confirmDelete = async (id) => {
  if (id === authStore.user.id) {
    alert('No puedes eliminar tu propia cuenta de administrador.')
    return
  }

  if (!confirm('¿Estás seguro de que deseas eliminar este colaborador permanentemente?')) return

  try {
    const res = await fetch(`${API_URL}/api/auth/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al eliminar el colaborador.')
    }

    alert('¡Colaborador eliminado con éxito!')
    fetchUsers()
  } catch (err) {
    alert(err.message)
  }
}

const empresas = ref([])
const fetchEmpresas = async () => {
  if (!authStore.isSuperadmin) return
  try {
    const res = await fetch(`${API_URL}/api/auth/empresas`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (res.ok) {
      empresas.value = await res.json()
    }
  } catch (err) {
    console.error('Error fetching businesses list')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchUsers()
  fetchEmpresas()
})
</script>

<style scoped>

.store-badge {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  background-color: var(--secondary);
  color: #5c2053;
  display: inline-block;
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

.role-badge {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
}

.role-badge.owner { background-color: var(--primary); color: #1e3a8a; }
.role-badge.employee { background-color: var(--secondary); color: #5c2053; }
.role-badge.superadmin { background-color: var(--success); color: #1b4d3e; }

.permissions-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.perm-badge {
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--border-color);
  color: var(--text-main);
  padding: 2px 8px;
  border-radius: 4px;
}

.perm-badge.none {
  background-color: transparent;
  color: var(--text-muted);
}

.status-dot {
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot.active::before {
  content: '';
  width: 8px;
  height: 8px;
  background-color: #48bb78;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.inactive::before {
  content: '';
  width: 8px;
  height: 8px;
  background-color: #e53e3e;
  border-radius: 50%;
  display: inline-block;
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

/* Estilos para el selector de permisos */
.permissions-selector {
  border-top: 1px dashed var(--border-color);
  padding-top: 20px;
  text-align: left;
}

.permissions-selector h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
}

.checkbox-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--bg-app);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
}

.checkbox-card:hover {
  border-color: var(--primary);
  background-color: #f0f7ff;
  transform: translateY(-1px);
}

.checkbox-card input[type="checkbox"] {
  width: 20px !important;
  height: 20px !important;
  margin: 0;
  cursor: pointer;
  accent-color: var(--primary);
}

.checkbox-card span {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-main);
}

.checkbox-wrapper {
  justify-content: flex-start;
  align-items: center;
  display: flex;
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
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
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
