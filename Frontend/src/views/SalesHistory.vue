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

    <!-- Area de contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div>
          <h1 class="text-title">≡ Historial de Ventas</h1>
          <p class="text-subtitle">Consulta todas las ventas registradas en el sistema, con sus respectivos cajeros, clientes y detalles.</p>
        </div>
      </header>

      <div class="card font-card">
        <!-- Barra de busqueda y filtros -->
        <div class="filters-container">
          <input v-model="searchQuery" type="text" placeholder="🔍 Buscar por cliente o cajero..." class="filter-input" />
          <input v-model="filterDate" type="date" class="filter-select" title="Filtrar por fecha" />
          <select v-model="filterPayment" class="filter-select">
            <option value="">✧ Todos los Métodos</option>
            <option value="Efectivo">✧ Efectivo</option>
            <option value="Tarjeta">▪ Tarjeta</option>
            <option value="Transferencia">🏦 Transferencia</option>
          </select>
        </div>

        <HamsterLoader v-if="loading" label="Cargando historial de ventas..." />

        <div v-else-if="filteredSales.length === 0" class="empty-state">
          No se encontraron ventas registradas que coincidan con los filtros.
        </div>

        <!-- Registro de ventas del historial -->
        <table v-else class="data-table">
          <thead>
            <tr>
              <th style="width: 50px;">N°</th>
              <th>Fecha y Hora</th>
              <th>Cliente</th>
              <th>Cajero / Responsable</th>
              <th>Método de Pago</th>
              <th>Total</th>
              <th style="text-align: center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sale, index) in filteredSales" :key="sale.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td>
                <span class="date-badge">{{ formatDateTime(sale.fechaCreacion) }}</span>
              </td>
              <td>
                <strong>{{ sale.nombreCliente || 'Cliente General' }}</strong>
              </td>
              <td>
                {{ formatCreatorName(sale.creadoPorNombre) }}
              </td>
              <td>
                <span :class="['payment-badge', sale.metodoPago.toLowerCase()]">
                  {{ sale.metodoPago }}
                </span>
              </td>
              <td>
                <span v-if="sale.revertida" class="total-badge" style="text-decoration: line-through; color: var(--text-muted);">
                  S/. {{ sale.total.toFixed(2) }}
                </span>
                <span v-else class="total-badge">S/. {{ sale.total.toFixed(2) }}</span>
                <span v-if="sale.revertida" class="reverted-badge" style="margin-left: 8px;">Revertido</span>
              </td>
              <td style="text-align: center; display: flex; gap: 8px; justify-content: center; align-items: center;">
                <button @click="openDetails(sale)" class="btn btn-primary btn-sm">👁️ Ver Detalles</button>
                <button 
                  v-if="!sale.revertida"
                  @click="confirmRevertSale(sale)" 
                  class="btn btn-danger btn-sm"
                  style="display: flex; align-items: center; gap: 4px; background: linear-gradient(135deg, #ef4444, #b91c1c); border: none;"
                >
                  ↩️ Revertir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal con los detalles de la venta -->
      <div v-if="selectedSale" class="modal-overlay" @click.self="selectedSale = null">
        <div class="modal-content card max-width-600">
          <header class="modal-header">
            <h3>≡ Detalles de la Venta</h3>
            <button @click="selectedSale = null" class="close-btn">×</button>
          </header>

          <div class="sale-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Fecha y Hora:</span>
              <span class="meta-val">{{ formatDateTime(selectedSale.fechaCreacion) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Cliente:</span>
              <span class="meta-val">{{ selectedSale.nombreCliente || 'Cliente General' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Cajero:</span>
              <span class="meta-val">{{ formatCreatorName(selectedSale.creadoPorNombre) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Método de Pago:</span>
              <span class="meta-val">{{ selectedSale.metodoPago }}</span>
            </div>
          </div>

          <div class="modal-details-table-wrapper">
            <table class="modal-details-table">
              <thead>
                <tr>
                  <th style="width: 40px;">N°</th>
                  <th>Producto</th>
                  <th style="text-align: center;">Cant.</th>
                  <th style="text-align: right;">Unit.</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in selectedSale.detalles" :key="item.productoId">
                  <td>{{ idx + 1 }}</td>
                  <td>{{ item.nombreProducto }}</td>
                  <td style="text-align: center;">{{ item.cantidad }}</td>
                  <td style="text-align: right;">S/. {{ item.precioUnitario.toFixed(2) }}</td>
                  <td style="text-align: right;">S/. {{ (item.cantidad * item.precioUnitario).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="modal-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>S/. {{ selectedSale.subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Impuestos (19%):</span>
              <span>S/. {{ selectedSale.impuesto.toFixed(2) }}</span>
            </div>
            <div class="summary-row total-row">
              <span>Total:</span>
              <span>S/. {{ selectedSale.total.toFixed(2) }}</span>
            </div>
          </div>

          <footer class="modal-actions" style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
            <a
              v-if="selectedSale?.clienteTelefono && !selectedSale?.revertida"
              :href="whatsappSaleUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-whatsapp"
            >
              📱 Enviar Comprobante por WhatsApp
            </a>

            <button 
              @click="printSaleTicket(selectedSale)" 
              class="btn btn-primary"
              style="background-color: #10b981; border: none; font-size: 0.95rem; font-weight: 500; padding: 12px 20px; border-radius: var(--radius-sm); color: white; display: flex; align-items: center; justify-content: center; gap: 8px;"
            >
              🖨️ Descargar Boleta (PDF)
            </button>
            
            <div v-if="selectedSale?.revertida" style="background: #fef2f2; border: 1px solid #fee2e2; padding: 12px; border-radius: var(--radius-sm); text-align: center; color: #b91c1c; font-weight: 500; font-size: 0.9rem;">
              🚫 Esta venta fue revertida por {{ selectedSale.revertidaPorNombre || 'el sistema' }} el {{ formatDateTime(selectedSale.fechaReversion) }}
            </div>
            
            <button @click="selectedSale = null" class="btn btn-secondary w-full">Cerrar</button>
          </footer>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import HamsterLoader from '../components/HamsterLoader.vue'

const router = useRouter()
const authStore = useAuthStore()

const sales = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterPayment = ref('')
const getTodayDateString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const filterDate = ref(getTodayDateString())
const selectedSale = ref(null)

const fetchSales = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/sales`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    sales.value = await res.json()
  } catch (err) {
    console.error('Error fetching sales history')
  } finally {
    loading.value = false
  }
}

const confirmRevertSale = async (sale) => {
  const confirmMsg = `¿Estás seguro de que deseas revertir esta venta?\n\n- Se devolverá el stock de los productos al inventario.\n- Se restará este ingreso de las estadísticas del negocio.\n\nEsta acción no se puede deshacer.`
  if (!confirm(confirmMsg)) return

  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/sales/${sale.id}/revert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || 'Error al revertir la venta.')
      return
    }
    alert('Venta revertida exitosamente. El stock ha sido restaurado.')
    selectedSale.value = null
    await fetchSales()
  } catch (err) {
    console.error('Error reverting sale:', err)
    alert('Ocurrió un error al intentar revertir la venta.')
  } finally {
    loading.value = false
  }
}

const printSaleTicket = (sale) => {
  const printWindow = window.open('', '_blank', 'width=600,height=600')
  const html = `
    <html>
      <head>
        <title>Boleta_${sale.id}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; padding: 20px; color: #000; font-size: 14px; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .header { margin-bottom: 20px; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 4px 0; }
          .total-row { font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="text-center header">
          <h2>◈ ${authStore.user?.nombreEmpresa || 'VentasSaaS'}</h2>
          <p>Punto de Venta - Boleta de Compra</p>
        </div>
        <div class="divider"></div>
        <p><strong>ID Venta:</strong> ${sale.id}</p>
        <p><strong>Fecha:</strong> ${formatDateTime(sale.fechaCreacion)}</p>
        <p><strong>Cliente:</strong> ${sale.nombreCliente || 'Cliente General'}</p>
        <p><strong>Vendedor:</strong> ${formatCreatorName(sale.creadoPorNombre)}</p>
        <p><strong>Método de Pago:</strong> ${sale.metodoPago}</p>
        <div class="divider"></div>
        <table>
          <thead>
            <tr>
              <th align="left">Prod</th>
              <th align="center">Cant</th>
              <th align="right">P.U</th>
              <th align="right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${sale.detalles.map(item => `
              <tr>
                <td>${item.nombreProducto}</td>
                <td align="center">${item.cantidad}</td>
                <td align="right">S/. ${item.precioUnitario.toFixed(2)}</td>
                <td align="right">S/. ${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="divider"></div>
        <table style="width: 200px; margin-left: auto;">
          <tr>
            <td>Subtotal:</td>
            <td align="right">S/. ${(sale.subtotal || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td>IGV (19%):</td>
            <td align="right">S/. ${(sale.impuesto || 0).toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td>TOTAL:</td>
            <td align="right">S/. ${(sale.total || 0).toFixed(2)}</td>
          </tr>
        </table>
        <div class="divider"></div>
        <div class="text-center" style="margin-top: 30px;">
          <p>¡Gracias por su preferencia!</p>
        </div>
        <${'script'}>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </${'script'}>
      </body>
    </html>
  `
  printWindow.document.write(html)
  printWindow.document.close()
}

const filteredSales = computed(() => {
  return sales.value.filter(s => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = 
      (s.nombreCliente && s.nombreCliente.toLowerCase().includes(q)) ||
      (s.creadoPorNombre && s.creadoPorNombre.toLowerCase().includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q))
    
    const matchesPayment = !filterPayment.value || s.metodoPago === filterPayment.value

    let matchesDate = true
    if (filterDate.value) {
      // Extraer fecha local (AAAA-MM-DD) para comparar sin problemas de zona horaria
      const localDate = new Date(s.fechaCreacion)
      const year = localDate.getFullYear()
      const month = String(localDate.getMonth() + 1).padStart(2, '0')
      const day = String(localDate.getDate()).padStart(2, '0')
      const localDateStr = `${year}-${month}-${day}`
      matchesDate = localDateStr === filterDate.value
    }

    return matchesSearch && matchesPayment && matchesDate
  })
})

const openDetails = (sale) => {
  selectedSale.value = sale
}

const formatCreatorName = (name) => {
  if (!name) return 'Empleado'
  // Verificar si el termino de busqueda es un ObjectId valido de MongoDB (24 caracteres hexadecimales)
  if (/^[0-9a-fA-F]{24}$/.test(name)) {
    return 'Administrador'
  }
  return name
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('es-PE', {
    timeZone: 'America/Lima',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const whatsappSaleUrl = computed(() => {
  if (!selectedSale.value?.clienteTelefono) return '#'
  const sale = selectedSale.value
  const store = authStore.user?.nombreEmpresa || 'Nuestra Tienda'
  const items = (sale.detalles || []).map(i => `  • ${i.nombreProducto} x${i.cantidad} = S/. ${(i.cantidad * i.precioUnitario).toFixed(2)}`).join('%0A')
  const msg = `¡Hola! Gracias por tu compra en *${store}* ❖%0A%0AComprobante: *${sale.id?.slice(-8).toUpperCase() || 'N/A'}*%0AFecha: ${new Date(sale.fechaCreacion).toLocaleDateString('es-PE', { timeZone: 'America/Lima' })}%0A%0A${items}%0A%0A*Total: S/. ${sale.total?.toFixed(2)}*%0A%0A¡Vuelve pronto! 😊`
  const phone = sale.clienteTelefono.replace(/[^0-9]/g, '')
  return `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`
})

onMounted(() => {
  fetchSales()
})
</script>

<style scoped>
.filters-container {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-input {
  flex-grow: 1;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  outline: none;
  font-size: 0.95rem;
}

.filter-select {
  width: 220px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: #ffffff;
  color: var(--text-main);
  outline: none;
  font-size: 0.95rem;
}

.date-badge {
  background-color: var(--bg-app);
  color: var(--text-main);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.9rem;
}

.payment-badge {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
}

.payment-badge.efectivo {
  background-color: #ecfdf5;
  color: #065f46;
}

.payment-badge.tarjeta {
  background-color: #e0f2fe;
  color: #075985;
}

.payment-badge.transferencia {
  background-color: #faf5ff;
  color: #6b21a8;
}

.total-badge {
  font-weight: 500;
  color: var(--text-main);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

/* Estilos de las ventanas modales */
.sale-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  background-color: var(--bg-app);
  padding: 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.meta-val {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-main);
}

.modal-details-table-wrapper {
  margin-bottom: 24px;
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.modal-details-table {
  width: 100%;
  border-collapse: collapse;
}

.modal-details-table th,
.modal-details-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.modal-details-table th {
  background-color: var(--bg-app);
  font-weight: 500;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.modal-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  margin-bottom: 24px;
  padding-right: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  width: 200px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.summary-row.total-row {
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--text-main);
  border-top: 1px solid var(--border-color);
  padding-top: 8px;
  margin-top: 4px;
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

/* Fondo oscuro y posicionamiento de modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  text-align: left;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 15px;
}

.modal-header h3 {
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--text-muted);
  line-height: 1;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.close-btn:hover {
  color: var(--text-main);
  transform: scale(1.15);
}

.max-width-600 {
  max-width: 600px;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── WhatsApp button ── */
.btn-whatsapp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #25d366, #128c7e);
  color: #ffffff;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: var(--transition);
  border: none;
  width: 100%;
  box-sizing: border-box;
}

.btn-whatsapp:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 211, 102, 0.4);
}

.reverted-badge {
  background-color: #fee2e2;
  color: #991b1b;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  display: inline-block;
  border: 1px solid #fca5a5;
}
</style>
