<template>
  <div class="dashboard-layout">
    <!-- Barra de navegacion lateral -->
    <aside class="sidebar">
      <div class="sidebar-brand">🍦 <span class="sidebar-text">{{ authStore.user?.nombreEmpresa || 'VentasSaaS' }}</span></div>
      <div class="user-info">
        <p class="user-name">Hola, {{ authStore.user?.nombre }}</p>
        <span class="user-badge">{{ authStore.user?.rol }}</span>
      </div>
      <nav class="nav-links">
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item">📊 <span class="sidebar-text">Dashboard</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('ventas')" to="/pos" class="nav-item active">🛒 <span class="sidebar-text">POS Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item">📋 <span class="sidebar-text">Historial Ventas</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item">📦 <span class="sidebar-text">Productos</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item">🏷️ <span class="sidebar-text">Categorías</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('clientes')" to="/clients" class="nav-item">👥 <span class="sidebar-text">Clientes</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item">🏢 <span class="sidebar-text">Proveedores</span></router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('compras')" to="/purchases" class="nav-item">💵 <span class="sidebar-text">Compras</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item">👥 <span class="sidebar-text">Colaboradores</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 <span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Espacio de trabajo del punto de venta (POS) -->
    <div class="pos-workspace">
      <!-- Panel de seleccion de productos disponibles -->
      <main class="products-area">
        <header class="search-header">
          <div class="search-filters">
            <input v-model="searchQuery" type="text" placeholder="🔍 Buscar por nombre o código de barra..." class="search-input" />
            <select v-model="selectedCategory" class="category-select">
              <option value="">🏷️ Todas las Categorías</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
            </select>
          </div>
        </header>

        <div v-if="filteredProducts.length === 0" class="empty-state">
          No se encontraron productos disponibles.
        </div>

        <div v-else class="products-grid">
          <div v-for="product in filteredProducts" :key="product.id" @click="addToCart(product)" class="product-card card">
            <div class="product-image-container">
              <img :src="product.imagenUrl || defaultImage" class="product-card-img" alt="product image" />
              <span :class="['product-card-stock', product.stock <= product.stockMinimo ? 'low' : 'ok']">
                Stock: {{ product.stock }}
              </span>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.nombre }}</h3>
              <p class="product-barcode">Cod: {{ product.codigoBarras }}</p>
              <span class="product-price">S/. {{ product.precio.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </main>

      <!-- Panel lateral para el resumen de compra y pago -->
      <aside class="cart-panel">
        <div class="cart-header">
          <h2 class="cart-title">🛒 Carrito de Compra</h2>
          <span class="sale-code-badge">{{ codigoVenta }}</span>
        </div>

        <div v-if="cart.length === 0" class="empty-cart">
          <p>El carrito está vacío.</p>
          <p class="text-subtitle">Haz clic en los productos para agregarlos.</p>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cart" :key="item.productoId" class="cart-item">
            <div class="item-details">
              <p class="item-name">{{ item.nombreProducto }}</p>
              <p class="item-sub">S/. {{ (item.precioUnitario * item.cantidad).toFixed(2) }}</p>
            </div>
            <div class="item-controls-wrapper">
              <div class="item-controls">
                <button @click="updateQty(item, -1)" class="btn-qty">-</button>
                <span class="item-qty">{{ item.cantidad }}</span>
                <button @click="updateQty(item, 1)" class="btn-qty">+</button>
              </div>
              <button @click="removeFromCart(item.productoId)" class="btn-remove" title="Quitar producto">×</button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>S/. {{ cartSubtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Impuestos (19%)</span>
            <span>S/. {{ cartTax.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total a Pagar</span>
            <span>S/. {{ cartTotal.toFixed(2) }}</span>
          </div>

          <div class="payment-method">
            <label>Método de Pago</label>
            <select v-model="paymentMethod">
              <option value="Efectivo">💵 Efectivo</option>
              <option value="Tarjeta">💳 Tarjeta</option>
              <option value="Transferencia">🏦 Transferencia</option>
            </select>
          </div>

          <div class="client-selection">
            <label>Cliente (Opcional)</label>
            <select v-model="selectedClientId">
              <option value="">👤 Cliente General</option>
              <option v-for="cli in clients" :key="cli.id" :value="cli.id">👤 {{ cli.nombre }}</option>
            </select>
          </div>

          <button @click="checkout" class="btn btn-success w-full checkout-btn" :disabled="cart.length === 0 || loading">
            {{ loading ? 'Procesando Venta...' : '💵 Confirmar Venta' }}
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const products = ref([])
const cart = ref([])
const searchQuery = ref('')
const paymentMethod = ref('Efectivo')
const loading = ref(false)

const defaultImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'><rect width='100%25' height='100%25' fill='%23f1f5f9'/><path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='M11 11.5L5 17h14l-4.5-6-3.5 4.5z'/></svg>"

const selectedCategory = ref('')
const categories = ref([])
const selectedClientId = ref('')
const clients = ref([])
const codigoVenta = ref('')

const generarCodigoVenta = () => {
  const num = Math.floor(10000 + Math.random() * 90000)
  codigoVenta.value = `VTA-${num}`
}

const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    products.value = await res.json()
  } catch (err) {
    console.error('Error fetching products for POS')
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
    console.error('Error fetching categories for POS')
  }
}

const fetchClients = async () => {
  try {
    const res = await fetch(`${API_URL}/api/clients`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    clients.value = await res.json()
  } catch (err) {
    console.error('Error fetching clients for POS')
  }
}

const filteredProducts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => {
    const matchesSearch = (p.nombre && p.nombre.toLowerCase().includes(q)) || 
                          (p.codigoBarras && p.codigoBarras.includes(q))
    const matchesCategory = !selectedCategory.value || p.categoriaId === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const addToCart = (product) => {
  if (product.stock <= 0) {
    alert('¡Este producto no tiene stock disponible!')
    return
  }

  const existing = cart.value.find(item => item.productoId === product.id)
  if (existing) {
    if (existing.cantidad >= product.stock) {
      alert(`No puedes vender más de ${product.stock} unidades de este producto.`)
      return
    }
    existing.cantidad++
  } else {
    cart.value.push({
      productoId: product.id,
      nombreProducto: product.nombre,
      cantidad: 1,
      precioUnitario: product.precio
    })
  }
}

const updateQty = (item, amount) => {
  const prod = products.value.find(p => p.id === item.productoId)
  if (amount > 0 && item.cantidad >= prod.stock) {
    alert('Stock máximo alcanzado.')
    return
  }

  item.cantidad += amount
  if (item.cantidad <= 0) {
    cart.value = cart.value.filter(i => i.productoId !== item.productoId)
  }
}

const removeFromCart = (productoId) => {
  cart.value = cart.value.filter(item => item.productoId !== productoId)
}

const cartSubtotal = computed(() => cart.value.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0) / 1.19)
const cartTax = computed(() => cartTotal.value - cartSubtotal.value)
const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0))

const checkout = async () => {
  loading.value = true
  try {
    const client = clients.value.find(c => c.id === selectedClientId.value)
    const clienteId = client ? client.id : null
    const nombreCliente = client ? client.nombre : 'Cliente General'

    const res = await fetch(`${API_URL}/api/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        detalles: cart.value,
        metodoPago: paymentMethod.value,
        clienteId: clienteId,
        nombreCliente: nombreCliente
      })
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al procesar la venta.')
    }

    alert(`¡Venta realizada con éxito! Código: ${codigoVenta.value}`)
    cart.value = []
    selectedClientId.value = ''
    generarCodigoVenta()
    fetchProducts()
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
  fetchClients()
  generarCodigoVenta()
})
</script>

<style scoped>

/* Estilos de la interfaz principal del POS */
.pos-workspace {
  display: flex;
  flex-grow: 1;
  background-color: var(--bg-app);
}

.products-area {
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;
}

.search-header {
  margin-bottom: 30px;
}

.search-filters {
  display: flex;
  gap: 16px;
}

.search-input {
  flex-grow: 1;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.category-select {
  width: 240px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: #ffffff;
  color: var(--text-main);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  outline: none;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.product-image-container {
  width: 100%;
  height: 140px;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-app);
}

.product-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-card-stock {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  color: #ffffff;
}

.product-card-stock.ok { background-color: #48bb78; }
.product-card-stock.low { background-color: #f56565; }

.product-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 2px;
  min-height: 38px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-barcode {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.product-price {
  font-weight: 700;
  color: var(--primary);
  font-size: 1.1rem;
  margin-top: auto;
}

/* Estilos del panel de carrito de compras */
.cart-panel {
  width: 30%;
  background-color: #ffffff;
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 30px 24px;
  flex-shrink: 0;
  text-align: left;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.cart-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}

.sale-code-badge {
  background-color: #eff6ff;
  color: #1e40af;
  padding: 4px 10px;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  border: 1px solid #bfdbfe;
}

.empty-cart {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  text-align: center;
}

.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.item-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.item-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.item-controls-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-remove {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  transition: transform 0.2s, color 0.2s;
}

.btn-remove:hover {
  color: #b91c1c;
  transform: scale(1.15);
}

.btn-qty {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background-color: var(--bg-app);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-qty {
  font-weight: 600;
  font-size: 0.95rem;
}

/* Estilos del resumen de pago */
.cart-summary {
  border-top: 1px dashed var(--border-color);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.summary-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 10px;
}

.payment-method {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.payment-method label,
.client-selection label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.client-selection {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.client-selection select {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background-color: #ffffff;
  outline: none;
}

.checkout-btn {
  padding: 14px;
  font-size: 1.05rem;
}
</style>
