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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('cuentas_cobrar')" to="/credit-sales" class="nav-item" active-class="active">📒 <span class="sidebar-text">Cuentas por Cobrar</span></router-link>
        <router-link v-if="authStore.isSuperadmin || authStore.isEmpresaOwner || authStore.hasPermission('formas_pago')" to="/payment-methods" class="nav-item" active-class="active">💳 <span class="sidebar-text">Formas de Pago</span></router-link>

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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('reminders')" to="/reminders" class="nav-item" active-class="active">📅 <span class="sidebar-text">Recordatorios</span></router-link>
        <router-link v-if="authStore.isSuperadmin || authStore.isEmpresaOwner || authStore.hasPermission('colaboradores')" to="/users" class="nav-item" active-class="active">👥 <span class="sidebar-text">Colaboradores</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 <span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Area de contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">📦 Inventario</h1>
            <p class="text-subtitle">Registra nuevos productos y ajusta el stock</p>
          </div>
          
          <div v-if="inventoryStats" class="inventory-stats-card">
            <div class="stat-item">
              <span class="stat-label">Valor del Inventario (Costo)</span>
              <span class="stat-value">S/. {{ inventoryStats.valorTotal?.toFixed(2) }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-label">Productos Activos</span>
              <span class="stat-value">{{ inventoryStats.cantidadProductos }}</span>
            </div>
          </div>

          <button v-if="authStore.hasPermission('modificar_productos')" @click="openAddModal" class="btn btn-primary">➕ Agregar Producto</button>
        </div>
      </header>

      <!-- Seccion de filtros de busqueda -->
      <div class="table-filters card">
        <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, código o descripción..." class="filter-input" />
        <select v-model="selectedCategory" class="filter-select">
          <option value="">🏷️ Todas las Categorías</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
        </select>
      </div>

      <!-- Tabla de inventario de productos -->
      <div class="card font-card">
        <div v-if="filteredProducts.length === 0" class="empty-state">
          No hay productos que coincidan con la búsqueda.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">N°</th>
              <th>Código</th>
              <th>Producto</th>
              <th>Costo</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Análisis 🧠</th>
              <th v-if="authStore.hasPermission('modificar_productos')">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(prod, index) in filteredProducts" :key="prod.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td><code>{{ prod.codigoBarras }}</code></td>
              <td>
                <div class="product-info-cell">
                  <img :src="prod.imagenUrl || defaultImage" class="product-thumbnail" alt="thumbnail" />
                  <strong>{{ prod.nombre }}</strong>
                </div>
              </td>
              <td>S/. {{ prod.precioCosto.toFixed(2) }}</td>
              <td>S/. {{ prod.precio.toFixed(2) }}</td>
              <td>
                <span :class="['stock-badge', prod.stock <= prod.stockMinimo ? 'low' : 'ok']">
                  <template v-if="prod.esServicio">— Servicio —</template>
                  <template v-else>{{ Number(prod.stock).toFixed(prod.tipoProducto === 'Costal' ? 2 : 0) }} {{ prod.unidadMedida }}</template>
                </span>
              </td>
              <td>
                <span v-if="prod.stock <= prod.stockMinimo" class="status-indicator low">⚠️ Reabastecer</span>
                <span v-else class="status-indicator ok">✅ Activo</span>
              </td>
              <td>
                <div v-if="productAnalysis[prod.id]" class="analysis-cell">
                  <span class="analysis-rate">⚡ {{ productAnalysis[prod.id].promedioDiario.toFixed(1) }}/día</span>
                  <span :class="['analysis-days', productAnalysis[prod.id].diasRestantes <= 7 ? 'danger' : productAnalysis[prod.id].diasRestantes <= 20 ? 'warning' : 'ok']">
                    {{ productAnalysis[prod.id].diasRestantes === Infinity ? '✅ Sin riesgo' : `🕒 ~${Math.ceil(productAnalysis[prod.id].diasRestantes)}d` }}
                  </span>
                  <span v-if="productAnalysis[prod.id].sugerido > 0" class="analysis-suggest">
                    🛒 Pedir +{{ productAnalysis[prod.id].sugerido }}u
                  </span>
                </div>
                <span v-else class="analysis-no-data">Sin ventas</span>
              </td>
              <td v-if="authStore.hasPermission('modificar_productos')">
                <div class="actions-cell">
                  <button @click="openEditModal(prod)" class="btn-action edit" title="Editar">✏️</button>
                  <button @click="confirmDelete(prod.id)" class="btn-action delete" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal para el registro/edicion de productos -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title">{{ isEdit ? '✏️ Editar Producto' : '📦 Registrar Producto' }}</h2>
          <form @submit.prevent="saveProduct" class="grid">

            <!-- FILA 1: Nombre y Código -->
            <div class="grid grid-2">
              <div class="field">
                <label>Nombre del Producto</label>
                <input v-model="form.nombre" type="text" placeholder="Ej. Alimento Royal Canin" required />
              </div>
              <div class="field">
                <label>Código de Barra / SKU</label>
                <input v-model="form.codigoBarras" type="text" placeholder="7501234567" required />
              </div>
            </div>

            <!-- FILA 2: Tipo de Producto -->
            <div class="field">
              <label>Tipo de Producto</label>
              <div class="tipo-selector">
                <button type="button"
                  v-for="tipo in tiposProducto" :key="tipo.valor"
                  :class="['tipo-btn', form.tipoProducto === tipo.valor ? 'active' : '']"
                  @click="selectTipo(tipo.valor)">
                  {{ tipo.icono }} {{ tipo.label }}
                  <small>{{ tipo.descripcion }}</small>
                </button>
              </div>
            </div>

            <!-- FILA 3: Precios y stock según tipo -->
            <div class="grid grid-3" v-if="form.tipoProducto !== 'Servicio' && form.tipoProducto !== 'Costal'">
              <div class="field">
                <label>Precio Costo (S/.)</label>
                <input v-model.number="form.precioCosto" type="number" step="0.01" min="0" required />
              </div>
              <div class="field">
                <label>Precio Venta (S/.)</label>
                <input v-model.number="form.precio" type="number" step="0.01" min="0" required />
              </div>
              <div class="field">
                <label>{{ isEdit ? 'Stock Actual' : 'Stock Inicial' }} ({{ form.unidadMedida }})</label>
                <input v-model.number="form.stock"
                  :type="'number'"
                  :step="'1'"
                  :min="0"
                  :disabled="isEdit"
                  required />
              </div>
            </div>

            <!-- Para Costales: Doble Precio y Doble Costo -->
            <div class="grid grid-3" v-if="form.tipoProducto === 'Costal'">
              <div class="field">
                <label>💰 Precio Costo del Costal (S/.)</label>
                <input v-model.number="form.precioCostoCostal" type="number" step="0.01" min="0" required />
              </div>
              <div class="field">
                <label>🏷️ Precio Venta del Costal (S/.)</label>
                <input v-model.number="form.precioCostal" type="number" step="0.01" min="0" required />
              </div>
              <div class="field">
                <label>⚖️ Kilos por Costal (Kg)</label>
                <input v-model.number="form.kilosPorCostal" type="number" step="0.01" min="0" required />
              </div>
            </div>

            <div class="grid grid-3" v-if="form.tipoProducto === 'Costal'">
              <div class="field">
                <label>🧠 Costo calculado por Kg (S/.)</label>
                <input :value="costoKgCalculado" type="text" disabled style="background-color: #f1f5f9;" />
              </div>
              <div class="field">
                <label>🏷️ Precio Venta por Kg suelto (S/.)</label>
                <input v-model.number="form.precio" type="number" step="0.01" min="0" required />
              </div>
              <div class="field">
                <label>{{ isEdit ? 'Stock Actual' : 'Stock Inicial' }} (Kg)</label>
                <input v-model.number="form.stock"
                  type="number"
                  step="0.01"
                  :min="0"
                  :disabled="isEdit"
                  required />
              </div>
            </div>

            <!-- Solo para Servicios: precio único -->
            <div class="grid grid-2" v-if="form.tipoProducto === 'Servicio'">
              <div class="field">
                <label>Precio del Servicio (S/.)</label>
                <input v-model.number="form.precio" type="number" step="0.01" min="0" required />
              </div>
              <div class="field">
                <label>Precio Costo / Insumos (S/.)</label>
                <input v-model.number="form.precioCosto" type="number" step="0.01" min="0" />
              </div>
            </div>

<!-- Campos extra de costal removidos de aqui porque los movimos arriba -->

            <!-- Stock mínimo: solo para productos físicos -->
            <div class="grid grid-2">
              <div class="field">
                <label>Categoría</label>
                <select v-model="form.categoriaId" required>
                  <option value="" disabled>Seleccione una categoría...</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
                </select>
              </div>
              <div class="field" v-if="form.tipoProducto !== 'Servicio'">
                <label>Stock Mínimo Alerta ({{ form.unidadMedida }})</label>
                <input v-model.number="form.stockMinimo"
                  type="number"
                  :step="form.tipoProducto === 'Costal' ? '0.01' : '1'"
                  min="0" required />
              </div>
            </div>

            <!-- Descripción e imagen -->
            <div class="field">
              <label>Descripción</label>
              <input v-model="form.descripcion" type="text" placeholder="Ej. Alimento húmedo para cachorros" />
            </div>

            <div class="grid grid-2">
              <div class="field">
                <label>URL de la Imagen</label>
                <input v-model="form.imagenUrl" type="url" placeholder="https://ejemplo.com/imagen.jpg" />
              </div>
              <div class="field">
                <label>Vista Previa</label>
                <div class="image-preview-box">
                  <img v-if="form.imagenUrl" :src="form.imagenUrl" class="preview-img" alt="Vista previa" />
                  <span v-else class="preview-placeholder">Sin imagen</span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Guardar Producto' }}</button>
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

const products = ref([])
const categories = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentProductId = ref(null)

const searchQuery = ref('')
const selectedCategory = ref('')
const productAnalysis = ref({})

const defaultImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'><rect width='100%25' height='100%25' fill='%23f1f5f9'/><path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='M11 11.5L5 17h14l-4.5-6-3.5 4.5z'/></svg>"

const filteredProducts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => {
    const matchesSearch = (p.nombre && p.nombre.toLowerCase().includes(q)) || 
                          (p.codigoBarras && p.codigoBarras.toLowerCase().includes(q)) ||
                          (p.descripcion && p.descripcion.toLowerCase().includes(q))
    const matchesCategory = !selectedCategory.value || p.categoriaId === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const form = reactive({
  nombre: '',
  codigoBarras: '',
  precioCosto: 0,
  precio: 0,
  stock: 0,
  stockMinimo: 5,
  descripcion: '',
  categoriaId: '',
  imagenUrl: '',
  tipoProducto: 'Unidad',
  unidadMedida: 'Unidad',
  esServicio: false,
  precioCostoCostal: 0,
  precioCostal: 0,
  kilosPorCostal: 0
})

// Calcula reactivamente el costo por kilogramo
const costoKgCalculado = computed(() => {
  if (form.tipoProducto === 'Costal' && form.kilosPorCostal > 0) {
    return (form.precioCostoCostal / form.kilosPorCostal).toFixed(2)
  }
  return '0.00'
})

// Definicion de los tipos de producto disponibles
const tiposProducto = [
  { valor: 'Unidad',   label: 'Unidad',   icono: '📦', descripcion: 'Se vende por unidades (ej: cama, ropa, pollo vivo)' },
  { valor: 'Costal',   label: 'Costal',   icono: '🎒', descripcion: 'Precio por kg suelto Y precio especial por costal completo' },
  { valor: 'Servicio', label: 'Servicio', icono: '🐾', descripcion: 'No descuenta inventario (ej: baño, grooming, consulta)' },
]

// Cuando el usuario selecciona un tipo, actualiza automaticamente la unidad de medida
const selectTipo = (tipo) => {
  form.tipoProducto = tipo
  form.esServicio = tipo === 'Servicio'
  const mapaUnidades = {
    'Unidad':   'Unidad',
    'Costal':   'Kg',
    'Servicio': 'Servicio'
  }
  form.unidadMedida = mapaUnidades[tipo] || 'Unidad'
  // Resetear campos especificos de costal al cambiar tipo
  if (tipo !== 'Costal') {
    form.precioCostal = 0
    form.kilosPorCostal = 0
  }
  if (tipo === 'Servicio') {
    form.stock = 0
    form.stockMinimo = 0
  }
}

const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    products.value = await res.json()
    computeStockAnalysis()
  } catch (err) {
    console.error('Error fetching inventory products')
  }
}

const computeStockAnalysis = async () => {
  try {
    const res = await fetch(`${API_URL}/api/sales`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) return
    const allSales = await res.json()

    // Filtrar ventas de los últimos 30 días
    const since = new Date()
    since.setDate(since.getDate() - 30)

    const unitsSold = {}
    for (const sale of allSales) {
      const saleDate = new Date(sale.fechaCreacion)
      if (saleDate < since) continue
      for (const item of (sale.detalles || [])) {
        unitsSold[item.productoId] = (unitsSold[item.productoId] || 0) + item.cantidad
      }
    }

    const analysis = {}
    for (const prod of products.value) {
      const totalVendido = unitsSold[prod.id] || 0
      const promedioDiario = totalVendido / 30
      const diasRestantes = promedioDiario > 0 ? prod.stock / promedioDiario : Infinity
      const sugerido = promedioDiario > 0 ? Math.max(0, Math.ceil(promedioDiario * 30) - prod.stock) : 0
      analysis[prod.id] = { promedioDiario, diasRestantes, sugerido }
    }
    productAnalysis.value = analysis
  } catch (e) {
    console.warn('No se pudo calcular análisis de stock', e)
  }
}

const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    categories.value = await res.json()
  } catch (err) {
    console.error('Error fetching categories')
  }
}

const openAddModal = () => {
  isEdit.value = false
  currentProductId.value = null
  form.nombre = ''
  form.codigoBarras = ''
  form.precioCosto = 0
  form.precio = 0
  form.stock = 0
  form.stockMinimo = 5
  form.descripcion = ''
  form.categoriaId = ''
  form.imagenUrl = ''
  form.tipoProducto = 'Unidad'
  form.unidadMedida = 'Unidad'
  form.esServicio = false
  form.precioCostoCostal = 0
  form.precioCostal = 0
  form.kilosPorCostal = 0
  showModal.value = true
}

const openEditModal = (product) => {
  isEdit.value = true
  currentProductId.value = product.id
  form.nombre = product.nombre
  form.codigoBarras = product.codigoBarras
  form.precioCosto = product.precioCosto
  form.precio = product.precio
  form.stock = product.stock
  form.stockMinimo = product.stockMinimo
  form.descripcion = product.descripcion
  form.categoriaId = product.categoriaId
  form.imagenUrl = product.imagenUrl || ''
  form.tipoProducto = product.tipoProducto || 'Unidad'
  form.unidadMedida = product.unidadMedida || 'Unidad'
  form.esServicio = product.esServicio || false
  form.precioCostoCostal = product.precioCostoCostal || 0
  form.precioCostal = product.precioCostal || 0
  form.kilosPorCostal = product.kilosPorCostal || 0
  showModal.value = true
}

const saveProduct = async () => {
  if (!form.categoriaId) {
    alert('Por favor seleccione una categoría.')
    return
  }

  try {
    // Si es Costal, asignamos el precio de costo unitario por kilo calculado automaticamente
    if (form.tipoProducto === 'Costal' && form.kilosPorCostal > 0) {
      form.precioCosto = Number((form.precioCostoCostal / form.kilosPorCostal).toFixed(4))
    }

    const url = isEdit.value
      ? `${API_URL}/api/products/${currentProductId.value}`
      : `${API_URL}/api/products`
    const method = isEdit.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(form)
    })
    if (!res.ok) throw new Error('Error al guardar el producto.')
    
    showModal.value = false
    alert(isEdit.value ? '¡Producto actualizado con éxito!' : '¡Producto agregado al inventario con éxito!')
    fetchProducts()
  } catch (err) {
    alert(err.message)
  }
}

const confirmDelete = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) return
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (!res.ok) throw new Error('Error al eliminar el producto.')
    alert('¡Producto eliminado con éxito!')
    fetchProducts()
  } catch (err) {
    alert(err.message)
  }
}

const inventoryStats = ref(null)

const fetchInventoryStats = async () => {
  try {
    const res = await fetch(`${API_URL}/api/clientanalytics/inventoryvalue`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    inventoryStats.value = await res.json()
  } catch (err) {
    console.error('Error fetching inventory stats', err)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
  fetchInventoryStats()
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
  gap: 20px;
}

.inventory-stats-card {
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
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary);
}

.stat-divider {
  width: 1px;
  background-color: var(--border-color);
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

.stock-badge {
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
}

.stock-badge.ok {
  background-color: #d1fae5;
  color: #065f46;
}

.stock-badge.low {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-indicator {
  font-size: 0.85rem;
  font-weight: 600;
}

.status-indicator.ok {
  color: #059669;
}

.status-indicator.low {
  color: #dc2626;
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
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  text-align: left;
}

.product-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-thumbnail {
  width: 45px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  background-color: var(--bg-app);
  transition: transform 0.2s;
}

.product-thumbnail:hover {
  transform: scale(1.1);
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

.filter-select {
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: #ffffff;
  color: var(--text-main);
  font-weight: 500;
  outline: none;
}

.image-preview-box {
  width: 100%;
  height: 42px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--bg-app);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
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

/* ── Análisis de stock por IA ── */
.analysis-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.analysis-rate {
  font-size: 0.78rem;
  font-weight: 600;
  color: #6366f1;
}

.analysis-days {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  display: inline-block;
}

.analysis-days.ok {
  background: #dcfce7;
  color: #166534;
}

.analysis-days.warning {
  background: #fef9c3;
  color: #854d0e;
}

.analysis-days.danger {
  background: #fee2e2;
  color: #991b1b;
}

.analysis-suggest {
  font-size: 0.75rem;
  font-weight: 600;
  color: #0369a1;
}

.analysis-no-data {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-style: italic;
}

/* ── Selector de tipo de producto ── */
.tipo-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.tipo-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: #ffffff;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
  transition: all 0.2s;
  text-align: center;
  line-height: 1.3;
}

.tipo-btn small {
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--text-muted);
  line-height: 1.2;
}

.tipo-btn:hover {
  border-color: var(--primary);
  background-color: #eff6ff;
}

.tipo-btn.active {
  border-color: var(--primary);
  background-color: #dbeafe;
  color: var(--primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.tipo-btn.active small {
  color: #3b82f6;
}
</style>
