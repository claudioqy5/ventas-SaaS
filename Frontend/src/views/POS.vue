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
        <router-link to="/pos" class="nav-item active">🛒 POS Ventas</router-link>
        <router-link to="/products" class="nav-item">📦 Productos</router-link>
        <router-link to="/categories" class="nav-item">🏷️ Categorías</router-link>
        <router-link v-if="authStore.hasPermission('clientes')" to="/clients" class="nav-item">👥 Clientes</router-link>
        <router-link v-if="authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item">🏢 Proveedores</router-link>
        <router-link v-if="authStore.hasPermission('compras')" to="/purchases" class="nav-item">💵 Compras</router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item">👥 Colaboradores</router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 Cerrar Sesión</button>
    </aside>

    <!-- POS Workspace -->
    <div class="pos-workspace">
      <!-- Products Selection Area -->
      <main class="products-area">
        <header class="search-header">
          <input v-model="searchQuery" type="text" placeholder="🔍 Buscar por nombre o código de barra..." class="search-input" />
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
                <span class="product-price">${{ product.precio.toFixed(2) }}</span>
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
        <h2 class="cart-title">🛒 Carrito de Compra</h2>

        <div v-if="cart.length === 0" class="empty-cart">
          <p>El carrito está vacío.</p>
          <p class="text-subtitle">Haz clic en los productos para agregarlos.</p>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cart" :key="item.productoId" class="cart-item">
            <div class="item-details">
              <p class="item-name">{{ item.nombreProducto }}</p>
              <p class="item-sub">${{ (item.precioUnitario * item.cantidad).toFixed(2) }}</p>
            </div>
            <div class="item-controls">
              <button @click="updateQty(item, -1)" class="btn-qty">-</button>
              <span class="item-qty">{{ item.cantidad }}</span>
              <button @click="updateQty(item, 1)" class="btn-qty">+</button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${{ cartSubtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Impuestos (19%)</span>
            <span>${{ cartTax.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total a Pagar</span>
            <span>${{ cartTotal.toFixed(2) }}</span>
          </div>

          <div class="payment-method">
            <label>Método de Pago</label>
            <select v-model="paymentMethod">
              <option value="Efectivo">💵 Efectivo</option>
              <option value="Tarjeta">💳 Tarjeta</option>
              <option value="Transferencia">🏦 Transferencia</option>
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

const fetchProducts = async () => {
  try {
    const res = await fetch('http://localhost:5246/api/products', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    products.value = await res.json()
  } catch (err) {
    console.error('Error fetching products for POS')
  }
}

const filteredProducts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => 
    (p.nombre && p.nombre.toLowerCase().includes(q)) || 
    (p.codigoBarras && p.codigoBarras.includes(q))
  )
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

const cartSubtotal = computed(() => cart.value.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0) / 1.19)
const cartTax = computed(() => cartTotal.value - cartSubtotal.value)
const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0))

const checkout = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:5246/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        detalles: cart.value,
        metodoPago: paymentMethod.value
      })
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al procesar la venta.')
    }

    alert('¡Venta realizada con éxito!')
    cart.value = []
    fetchProducts()
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
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

.search-input {
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
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
  width: 400px;
  background-color: #ffffff;
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 30px 24px;
  flex-shrink: 0;
  text-align: left;
}

.cart-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 24px;
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

.item-controls {
  display: flex;
  align-items: center;
  gap: 12px;
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
  margin-bottom: 10px;
}

.payment-method label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-muted);
}

.checkout-btn {
  padding: 14px;
  font-size: 1.05rem;
}
</style>
