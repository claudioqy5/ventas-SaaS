<template>
  <div class="dashboard-layout">
    <!-- Sidebar Navigation -->
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

    <!-- POS Workspace -->
    <div class="pos-workspace">
      <!-- Products Selection Area -->
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
            <div class="product-info">
              <h3 class="product-name">{{ product.nombre }}</h3>
              <p class="product-barcode">{{ product.codigoBarras }}</p>
              <div class="product-footer">
                <span class="product-price">S/. {{ product.precio.toFixed(2) }}</span>
                <span :class="['product-stock', product.stock <= product.stockMinimo ? 'low' : 'ok']">
                  Stock: {{ product.stock }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Cart Checkout Side Panel -->
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

onMounted(() => {
  fetchProducts()
  fetchCategories()
  fetchClients()
  generarCodigoVenta()
})
</script>

<style scoped>

/* POS Workspace Styling */
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
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.product-barcode {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-price {
  font-weight: 700;
  color: var(--text-main);
  font-size: 1.2rem;
}

.product-stock {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
}

.product-stock.ok { background-color: var(--success); color: #1b4d3e; }
.product-stock.low { background-color: var(--danger); color: #7f1d1d; }

/* Cart Styling */
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

/* Cart Summary */
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
