<template>
  <div class="dashboard-layout">
    <!-- Barra de navegacion lateral -->
    <aside class="sidebar" @mouseenter="isSidebarHovered = true" @mouseleave="isSidebarHovered = false">
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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('pedidos_web')" to="/online-orders" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><circle cx="12" cy="12" r="10"/><path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span class="sidebar-text">Pedidos</span>
          <span v-if="authStore.pendingOrdersCount > 0" class="badge-count">{{ authStore.pendingOrdersCount }}</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('chats_bot')" to="/whatsapp-chats" class="nav-item" active-class="active"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> <span class="sidebar-text">Chats WhatsApp</span></router-link>
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

    <!-- Main Content Area with Header (matching other views) -->
    <main class="main-content" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden; padding-bottom: 20px; padding-right: 0;">
      <header class="content-header" style="margin-bottom: 15px; flex-shrink: 0;">
        <h1 class="text-title">❖ Punto de Venta (POS)</h1>
        <p class="text-subtitle">Registra nuevas ventas de forma rápida y sencilla</p>
      </header>

      <!-- Espacio de trabajo del punto de venta (POS) - Independent Scroll Layout -->
      <div class="pos-workspace" style="display: flex; flex-grow: 1; overflow: hidden; min-height: 0; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: #ffffff;">
        <!-- Panel de seleccion de productos disponibles -->
        <div class="products-area" style="flex-grow: 1; display: flex; flex-direction: column; padding: 20px; overflow: hidden; min-height: 0; background: var(--bg-app);">
          <header class="search-header" style="margin-bottom: 20px; flex-shrink: 0;">
            <div class="search-filters">
              <input v-model="searchQuery" type="text" placeholder="🔍 Buscar por nombre o código de barra..." class="search-input" />
              <select v-model="selectedCategory" class="category-select">
                <option value="">Todas las Categorías</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
              </select>
            </div>
            <!-- Indicador de modo lector de código de barra -->
            <div v-if="barcodeBuffer" class="barcode-indicator">
              🔍 Escaneando: <strong>{{ barcodeBuffer }}</strong>
            </div>
          </header>

          <div v-if="filteredProducts.length === 0" class="empty-state" style="flex-grow: 1; display: flex; align-items: center; justify-content: center;">
            No se encontraron productos disponibles.
          </div>

          <div v-else style="display: flex; flex-direction: column; flex-grow: 1; min-height: 0;">
            <div class="products-grid" :class="{ 'sidebar-hovered': isSidebarHovered }" style="overflow-y: auto; flex-grow: 1; min-height: 0; padding-bottom: 10px;">
              <div v-for="product in paginatedProducts" :key="product.id" @click="addToCart(product)" class="product-card card">
                <div class="product-image-container">
                  <img :src="product.imagenUrl || defaultImage" class="product-card-img" alt="product image" />
                  <span :class="['product-card-stock', product.stock <= product.stockMinimo ? 'low' : 'ok']">
                    Stock: {{ product.esServicio ? '∞' : `${Number(product.stock).toFixed(product.tipoProducto === 'Costal' ? 1 : 0)} ${product.unidadMedida}` }}
                  </span>
                </div>
                <div class="product-info">
                  <h3 class="product-name">{{ product.nombre }}</h3>
                  <p class="product-barcode">Cod: {{ product.codigoBarras }}</p>
                  <span class="product-price">
                    S/. {{ product.precio.toFixed(2) }}<span v-if="product.tipoProducto === 'Costal'" style="font-size: 0.75rem; color: var(--text-muted);">/Kg</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Controles de paginación -->
            <div class="pagination-controls" style="margin-top: 15px; display: flex; justify-content: center; align-items: center; gap: 15px; flex-shrink: 0; padding-top: 10px; border-top: 1px solid var(--border-color);">
              <button @click="currentPage--" :disabled="currentPage === 1" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem;">
                ⬅️ Anterior
              </button>
              <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-main);">
                Página {{ currentPage }} de {{ totalPages }}
              </span>
              <button @click="currentPage++" :disabled="currentPage >= totalPages" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.85rem;">
                Siguiente ➡️
              </button>
            </div>
          </div>

          <!-- Panel de sugerencias de venta cruzada (Cross-Selling) -->
          <div v-if="crossSellSuggestions.length > 0" class="cross-sell-panel">
            <p class="cross-sell-title">💡 También se llevan frecuentemente con los productos del carrito:</p>
            <div class="cross-sell-items">
              <div
                v-for="sug in crossSellSuggestions"
                :key="sug.id"
                class="cross-sell-chip"
                @click="addToCart(sug)"
                :title="`S/. ${sug.precio.toFixed(2)}`"
              >
                <img :src="sug.imagenUrl || defaultImage" class="cross-sell-img" alt="" />
                <span>{{ sug.nombre }}</span>
                <span class="cross-sell-price">S/. {{ sug.precio.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Panel del Carrito de Compra — columna fija a la derecha, altura completa desde arriba -->
    <!-- Panel del Carrito de Compra — columna fija a la derecha, altura completa desde arriba -->
    <aside class="cart-panel">
      <!-- Encabezado Moderno del Carrito -->
      <div class="cart-header">
        <div class="cart-top-bar">
          <div class="cart-title-wrap">
            <svg class="cart-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <h2 class="cart-title">Carrito de Venta</h2>
            <span v-if="cart.length > 0" class="cart-count-chip">{{ cart.length }}</span>
          </div>
          <button v-if="cart.length > 0" type="button" @click="clearCart" class="cart-clear-btn" title="Vaciar carrito">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Vaciar</span>
          </button>
        </div>

        <!-- Selector Segmentado de Tipo de Comprobante -->
        <div class="voucher-segmented-control">
          <button
            type="button"
            @click="setTipoComprobante('Boleta')"
            :class="['voucher-tab', { active: tipoComprobante === 'Boleta', 'tab-boleta': tipoComprobante === 'Boleta' }]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <span>Boleta</span>
          </button>
          <button
            type="button"
            @click="setTipoComprobante('Factura')"
            :class="['voucher-tab', { active: tipoComprobante === 'Factura', 'tab-factura': tipoComprobante === 'Factura' }]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <line x1="9" y1="22" x2="9" y2="22.01"></line>
              <line x1="15" y1="22" x2="15" y2="22.01"></line>
              <line x1="9" y1="6" x2="9" y2="6.01"></line>
              <line x1="15" y1="6" x2="15" y2="6.01"></line>
              <line x1="9" y1="11" x2="15" y2="11"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            <span>Factura</span>
          </button>
          <button
            type="button"
            @click="setTipoComprobante('Nota de Venta')"
            :class="['voucher-tab', { active: tipoComprobante === 'Nota de Venta', 'tab-notavta': tipoComprobante === 'Nota de Venta' }]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Nota Venta</span>
          </button>
        </div>

        <!-- Barra de Serie y Correlativo Oficial -->
        <div class="voucher-info-bar" :class="`type-${tipoComprobante.toLowerCase().replace(/\s+/g, '-')}`">
          <div class="voucher-info-meta">
            <span class="correlativo-dot"></span>
            <span class="correlativo-label">Serie <strong>{{ serieActual }}</strong></span>
          </div>
          <span class="correlativo-code" :title="`Serie y correlativo oficial ${serieActual}`">
            {{ loadingCorrelativo ? 'Consultando...' : (proximoCorrelativo || codigoVenta) }}
          </span>
        </div>
      </div>

      <div v-if="cart.length === 0" class="empty-cart">
        <p>El carrito está vacío.</p>
        <p class="text-subtitle">Haz clic en los productos para agregarlos.</p>
      </div>

      <div v-else class="cart-items">
        <div v-for="item in cart" :key="item.productoId" class="cart-item">
          <div class="item-details">
            <p class="item-name">{{ item.nombreProducto }}</p>
            <p class="item-sub">
              <!-- Ocultar subtotal de línea si es producto de tipo Costal (ya que se edita el precio/monto directamente abajo) -->
              <span v-if="item.tipoProducto !== 'Costal'">
                S/. {{ (item.precioUnitario * item.cantidad).toFixed(2) }}
              </span>
              <!-- Para productos de tipo Costal (tanto en Kg suelto como Costal completo), el precio es editable inline -->
              <small v-if="item.tipoProducto === 'Costal'" style="display: flex; align-items: center; gap: 3px; font-weight: 500; margin-top: 2px;">
                <span style="color: var(--text-muted);">S/.</span>
                <input
                  type="number"
                  v-model.number="item.precioUnitario"
                  @change="validatePrecio(item)"
                  step="0.10"
                  min="0.01"
                  style="width: 48px; border: none; border-bottom: 1.5px dashed #a3c4f3; background: transparent; font-size: 0.82rem; font-weight: 500; color: var(--text-main); outline: none; padding: 0 2px; text-align: left;"
                />
                <span style="color: var(--text-muted); font-size: 0.78rem;">/ {{ item.presentacion === 'Costal' ? 'Costal' : 'Kg' }} ✏️</span>
              </small>
              <!-- Para otros productos (Unidad, Servicio): precio de referencia solo lectura -->
              <small v-else style="color: var(--text-muted); display: block; font-weight: 500;">
                Pre. Ref: S/. {{ item.precioUnitario.toFixed(2) }} / {{ item.unidadMedida }}
              </small>
            </p>
          </div>
          <div class="item-controls-wrapper" style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
            <!-- Selector de presentacion (Solo para tipo Costal) -->
            <div v-if="item.tipoProducto === 'Costal'" class="pres-selector" style="display: flex; gap: 4px;">
              <button type="button" @click="changePresentacion(item, 'Kg')" :class="['pres-btn', item.presentacion === 'Kg' ? 'active' : '']">
                ⚖️ Kilo suelto
              </button>
              <button type="button" @click="changePresentacion(item, 'Costal')" :class="['pres-btn', item.presentacion === 'Costal' ? 'active' : '']">
                🎒 Costal completo
              </button>
            </div>

            <!-- Modo de ingreso: Por Cantidad o Por Monto (solo Kg suelto) - Toggle Switch Mini -->
            <div v-if="item.tipoProducto === 'Costal' && item.presentacion === 'Kg'" style="display: flex; align-items: center; gap: 8px; width: 100%; justify-content: flex-end; margin-top: 2px; margin-bottom: 2px;">
              <div @click="toggleModoIngreso(item)" style="display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none;">
                <span style="font-size: 0.72rem; font-weight: 500; color: var(--text-muted);">
                  {{ item.modoIngreso === 'monto' ? '💰 Por Monto' : '⚖️ Por Kg' }}
                </span>
                <!-- Switch Track -->
                <div :style="{
                  width: '30px',
                  height: '16px',
                  backgroundColor: item.modoIngreso === 'monto' ? '#f59e0b' : '#cbd5e1',
                  borderRadius: '99px',
                  position: 'relative',
                  transition: 'background-color 0.2s'
                }">
                  <!-- Switch Thumb -->
                  <div :style="{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '2px',
                    left: item.modoIngreso === 'monto' ? '16px' : '2px',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                  }"></div>
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <!-- Modo: Por Cantidad (Kg) -->
              <div v-if="item.modoIngreso !== 'monto'" class="item-controls">
                <button @click="updateQty(item, -1)" class="btn-qty">-</button>
                <input
                  type="number"
                  v-model.number="item.cantidad"
                  @change="validateItemQty(item)"
                  :step="item.presentacion === 'Kg' && item.tipoProducto === 'Costal' ? '0.05' : '1'"
                  min="0.01"
                  style="width: 60px; text-align: center; border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 4px; font-weight: 500; font-size: 0.88rem;"
                />
                <button @click="updateQty(item, 1)" class="btn-qty">+</button>
              </div>
              <!-- Modo: Por Monto (S/.) — calcula Kg automaticamente -->
              <div v-if="item.modoIngreso === 'monto'" style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 0.78rem; font-weight: 500; color: #b45309;">S/.</span>
                <input
                  type="number"
                  v-model.number="item.montoIngresado"
                  @input="updatePorMonto(item)"
                  step="0.5"
                  min="0.01"
                  placeholder="Monto"
                  style="width: 65px; text-align: center; border: 1px solid #f59e0b; border-radius: 4px; padding: 2px 4px; font-weight: 500; font-size: 0.88rem; color: #b45309; background: #fffbeb;"
                />
                <span style="font-size: 0.73rem; color: var(--text-muted); font-weight: 500;">= {{ item.cantidad.toFixed(2) }} Kg</span>
              </div>
              <button @click="removeFromCart(item.productoId)" class="btn-remove" title="Quitar producto">×</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección Inferior de Checkout y Totales -->
      <div class="cart-checkout-section">
        <!-- 1. Configuración de Cliente / Datos Fiscales -->
        <div class="cart-client-fiscal-box" :class="{ 'is-factura': tipoComprobante === 'Factura' }">
          
          <!-- Caso FACTURA: Card compacto para RUC y Razón Social -->
          <div v-if="tipoComprobante === 'Factura'" class="factura-fiscal-wrapper">
            <div class="fiscal-card-header">
              <div class="fiscal-title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                  <line x1="9" y1="22" x2="9" y2="22.01"/>
                  <line x1="15" y1="22" x2="15" y2="22.01"/>
                </svg>
                <span>Datos Fiscales (Empresa)</span>
              </div>
              <span class="fiscal-badge-pill">RUC Obligatorio</span>
            </div>

            <!-- Selector opcional de empresa ya registrada -->
            <div class="fiscal-quick-select" v-if="clients.length > 0">
              <select v-model="selectedClientId" class="fiscal-select">
                <option value="">🏢 Seleccionar empresa registrada (Opcional)</option>
                <option v-for="cli in clients" :key="cli.id" :value="cli.id">
                  🏢 {{ cli.nombre }} {{ cli.numeroDocumento ? `(${cli.numeroDocumento})` : '' }}
                </option>
              </select>
            </div>

            <!-- Inputs en cuadrícula compacta de 2 columnas -->
            <div class="fiscal-grid">
              <div class="fiscal-col">
                <label class="fiscal-label">RUC (11 dígitos) *</label>
                <div class="fiscal-input-wrapper">
                  <input
                    type="text"
                    v-model="facturaRuc"
                    maxlength="11"
                    placeholder="Ej: 20601234567"
                    class="fiscal-input font-mono"
                    @input="facturaRuc = facturaRuc.replace(/[^0-9]/g, '')"
                  />
                  <span v-if="facturaRuc.length === 11" class="ruc-status-check" title="11 dígitos ingresados">✓</span>
                </div>
              </div>

              <div class="fiscal-col">
                <label class="fiscal-label">Razón Social *</label>
                <input
                  type="text"
                  v-model="facturaRazonSocial"
                  placeholder="Ej: COMERCIAL L'GANT S.A.C."
                  class="fiscal-input"
                />
              </div>
            </div>

            <!-- Dirección fiscal opcional -->
            <div class="fiscal-full-row">
              <input
                type="text"
                v-model="facturaDireccion"
                placeholder="Dirección Fiscal (Opcional)"
                class="fiscal-input fiscal-input-subtle"
              />
            </div>
          </div>

          <!-- Caso BOLETA o NOTA DE VENTA: Selector de Cliente estándar -->
          <div v-else class="standard-client-wrapper">
            <div class="client-header-line">
              <label class="client-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Cliente</span>
              </label>
              <span class="client-badge-hint" v-if="tipoComprobante === 'Boleta'">Venta Mostrador</span>
            </div>
            <select v-model="selectedClientId" class="client-select">
              <option value="">👤 Cliente General (Sin documento)</option>
              <option v-for="cli in clients" :key="cli.id" :value="cli.id">
                👤 {{ cli.nombre }} {{ cli.numeroDocumento ? `(${cli.tipoDocumento || 'DOC'}: ${cli.numeroDocumento})` : '' }}
              </option>
            </select>

            <!-- Alerta SUNAT para Boleta >= S/ 700 -->
            <div v-if="tipoComprobante === 'Boleta' && cartTotal >= 700 && !selectedClientHasDoc" class="sunat-alert-card">
              <span class="sunat-alert-icon">⚠️</span>
              <span><strong>Norma SUNAT:</strong> Boletas ≥ S/ 700 requieren identificar al cliente (DNI/RUC).</span>
            </div>
          </div>
        </div>

        <!-- 2. Método de Pago & Venta al Fiado -->
        <div class="payment-method-row">
          <div class="payment-col" v-if="!isFiado">
            <label class="payment-col-label">Método de Pago</label>
            <select v-model="paymentMethod" class="payment-select">
              <option value="" disabled>Seleccione método...</option>
              <option v-for="pm in activePaymentMethods" :key="pm.id" :value="pm.nombre">▪ {{ pm.nombre }}</option>
            </select>
          </div>

          <div class="fiado-col" :class="{ 'full-col': isFiado }">
            <label class="fiado-toggle-pill" :class="{ active: isFiado }">
              <input type="checkbox" v-model="isFiado" id="fiadoCheck" class="fiado-check-input" />
              <span class="fiado-label-text">
                <span class="fiado-icon">{{ isFiado ? '✓' : '▫' }}</span>
                Venta al Fiado (Crédito)
              </span>
            </label>
          </div>
        </div>

        <!-- 3. Totales y Desglose Financiero -->
        <div class="cart-totals-box">
          <div class="totals-row">
            <span class="totals-title">Op. Gravada (Subtotal)</span>
            <span class="totals-num">S/. {{ cartSubtotal.toFixed(2) }}</span>
          </div>
          <div class="totals-row">
            <span class="totals-title">IGV (18%)</span>
            <span class="totals-num">S/. {{ cartTax.toFixed(2) }}</span>
          </div>
          <div class="totals-row total-highlight">
            <span class="grand-total-label">Total a Pagar</span>
            <span class="grand-total-num">S/. {{ cartTotal.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 4. Botón de Acción Principal (Emitir Comprobante) -->
        <button
          @click="checkout"
          class="btn-checkout-action"
          :class="`btn-${tipoComprobante.toLowerCase().replace(/\s+/g, '-')}`"
          :disabled="cart.length === 0 || loading"
        >
          <span v-if="loading" class="action-spinner"></span>
          <span v-else class="action-content">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Emitir {{ tipoComprobante }} • S/. {{ cartTotal.toFixed(2) }}</span>
          </span>
        </button>
      </div>
    </aside>
  </div>

  <!-- Modal de venta exitosa con opción de WhatsApp y Comprobante Térmico -->
  <div v-if="showSuccessModal" class="modal-overlay" style="z-index: 2000;">
    <div class="modal-card card success-modal">
      <div class="success-icon">🎉</div>
      <h2 class="modal-title" style="text-align:center;">¡Venta Exitosa!</h2>
      <div class="success-code" style="display: flex; flex-direction: column; align-items: center; gap: 4px; margin-bottom: 12px;">
        <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">{{ lastSaleVoucherType }}</span>
        <strong style="font-size: 1.3rem; color: var(--text-main); letter-spacing: 0.05em;">{{ lastSaleCode }}</strong>
        <span v-if="lastSaleVoucherType !== 'Nota de Venta'" style="font-size: 0.72rem; background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 99px; font-weight: 600;">
          🏛️ Estructura lista para SUNAT
        </span>
        <span v-else style="font-size: 0.72rem; background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 99px; font-weight: 600;">
          📝 Control Interno
        </span>
      </div>

      <div class="success-summary">
        <div v-for="item in lastSaleCart" :key="item.productoId" class="success-item">
          <span>{{ item.nombreProducto }}</span>
          <span>
            x{{ item.presentacion === 'Costal' ? `${item.cantidad} costal(es)` : `${item.cantidad} ${item.unidadMedida}` }} 
            — S/. {{ (item.precioUnitario * item.cantidad).toFixed(2) }}
          </span>
        </div>
        <div class="success-total-row">
          <span>Total Cobrado</span>
          <span>S/. {{ lastSaleTotal.toFixed(2) }}</span>
        </div>
      </div>

      <div class="success-actions" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%;">
          <button @click="printTicket" class="btn btn-primary" style="background: #2563eb; border: none; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
            🖨️ Imprimir Ticket
          </button>
          <a
            v-if="lastClientPhone"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-whatsapp"
            style="display: flex; align-items: center; justify-content: center; gap: 6px;"
          >
            📱 WhatsApp
          </a>
          <button v-else disabled class="btn btn-secondary" style="opacity: 0.6; font-size: 0.8rem;" title="El cliente no tiene teléfono registrado">
            📱 Sin WhatsApp
          </button>
        </div>
        <button @click="showSuccessModal = false" class="btn btn-secondary w-full" style="margin-top: 4px;">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const products = ref([])
const cart = ref([])
const searchQuery = ref('')
const paymentMethodsList = ref([])
const activePaymentMethods = computed(() => paymentMethodsList.value.filter(m => m.activo))
const paymentMethod = ref('')
const isFiado = ref(false)
const loading = ref(false)

const defaultImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'><rect width='100%25' height='100%25' fill='%23f1f5f9'/><path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='M11 11.5L5 17h14l-4.5-6-3.5 4.5z'/></svg>"

const selectedCategory = ref('')
const categories = ref([])
const selectedClientId = ref('')
const clients = ref([])
const codigoVenta = ref('')

// ── Comprobantes y Correlativos (Facturación Electrónica SUNAT) ──
const tipoComprobante = ref('Boleta') // 'Boleta', 'Factura', 'Nota de Venta'
const serieActual = computed(() => {
  if (tipoComprobante.value === 'Factura') return 'F001'
  if (tipoComprobante.value === 'Nota de Venta') return 'NV01'
  return 'B001'
})
const proximoCorrelativo = ref('')
const loadingCorrelativo = ref(false)

// Campos para Factura Electrónica
const facturaRuc = ref('')
const facturaRazonSocial = ref('')
const facturaDireccion = ref('')

// Cliente seleccionado y validación de documento para SUNAT
const selectedClient = computed(() => clients.value.find(c => c.id === selectedClientId.value))
const selectedClientHasDoc = computed(() => {
  if (!selectedClient.value) return false
  const doc = selectedClient.value.numeroDocumento
  return Boolean(doc && doc.trim().length >= 8)
})

const isSidebarHovered = ref(false)
const currentPage = ref(1)

// ── Cross-selling ──
const crossSellSuggestions = ref([])
const allSalesHistory = ref([])

// ── Barcode scanner ──
const barcodeBuffer = ref('')
let barcodeTimer = null

// ── Sale success modal ──
const showSuccessModal = ref(false)
const lastSaleCode = ref('')
const lastSaleVoucherType = ref('Boleta')
const lastSaleClientName = ref('')
const lastSaleClientDoc = ref('')
const lastSaleCart = ref([])
const lastSaleTotal = ref(0)
const lastClientPhone = ref('')

watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

watch(cart, () => {
  computeCrossSell()
}, { deep: true })

const itemsPerPage = computed(() => {
  return isSidebarHovered.value ? 12 : 15
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredProducts.value.length / itemsPerPage.value))
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredProducts.value.slice(start, start + itemsPerPage.value)
})

const fetchProximoCorrelativo = async () => {
  try {
    loadingCorrelativo.value = true
    const res = await fetch(`${API_URL}/api/sales/next-correlative?tipoComprobante=${encodeURIComponent(tipoComprobante.value)}&serie=${encodeURIComponent(serieActual.value)}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (res.ok) {
      const data = await res.json()
      proximoCorrelativo.value = data.numeroComprobante
      codigoVenta.value = data.numeroComprobante
    }
  } catch (e) {
    console.warn('Error al obtener próximo correlativo:', e)
  } finally {
    loadingCorrelativo.value = false
  }
}

const setTipoComprobante = (tipo) => {
  tipoComprobante.value = tipo
  fetchProximoCorrelativo()
}

const clearCart = () => {
  if (cart.value.length === 0) return
  if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
    cart.value = []
  }
}

watch(selectedClientId, (newId) => {
  if (!newId) return
  const client = clients.value.find(c => c.id === newId)
  if (!client) return

  if (client.tipoDocumento === 'RUC' || (client.numeroDocumento && client.numeroDocumento.length === 11)) {
    facturaRuc.value = client.numeroDocumento
    facturaRazonSocial.value = client.nombre
    facturaDireccion.value = client.direccion || ''
  }
})

watch(facturaRuc, (newRuc) => {
  if (newRuc && newRuc.length === 11) {
    const existing = clients.value.find(c => c.numeroDocumento === newRuc)
    if (existing) {
      if (!facturaRazonSocial.value) facturaRazonSocial.value = existing.nombre
      if (!facturaDireccion.value) facturaDireccion.value = existing.direccion || ''
    }
  }
})

const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    const fetched = await res.json()

    // Fetch popularity stats to sort products by best-sellers first
    try {
      const statsRes = await fetch(`${API_URL}/api/dashboard`, {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      })
      if (statsRes.ok) {
        const statsData = await statsRes.ok ? await statsRes.json() : null
        if (statsData) {
          const topList = statsData.productosMasVendidos || []
          fetched.sort((a, b) => {
            const topA = topList.find(item => item.producto === a.nombre)
            const topB = topList.find(item => item.producto === b.nombre)
            const qtyA = topA ? topA.cantidad : 0
            const qtyB = topB ? topB.cantidad : 0
            return qtyB - qtyA // Best-sellers first
          })
        }
      }
    } catch (e) {
      console.warn('Could not sort products by popularity', e)
    }

    products.value = fetched
  } catch (err) {
    console.error('Error fetching products for POS', err)
  }
}

const fetchPaymentMethods = async () => {
  try {
    const res = await fetch(`${API_URL}/api/paymentmethods`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    paymentMethodsList.value = await res.json()
    if (activePaymentMethods.value.length > 0) {
      paymentMethod.value = activePaymentMethods.value[0].nombre
    }
  } catch (err) {}
}

const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    categories.value = await res.json()
  } catch (err) {
    console.error('Error fetching categories for POS', err)
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
    console.error('Error fetching clients for POS', err)
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
  if (product.stock <= 0 && !product.esServicio) {
    alert('¡Este producto no tiene stock disponible!')
    return
  }

  const existing = cart.value.find(item => item.productoId === product.id)
  if (existing) {
    const isCostal = existing.tipoProducto === 'Costal'
    const neededStock = isCostal && existing.presentacion === 'Costal'
      ? (existing.cantidad + 1) * existing.kilosPorCostal
      : (existing.cantidad + 1)

    if (!existing.esServicio && neededStock > existing.maxStock) {
      alert(`No puedes vender más de ${existing.maxStock} ${existing.unidadMedida} de este producto.`)
      return
    }
    existing.cantidad++
  } else {
    cart.value.push({
      productoId: product.id,
      nombreProducto: product.nombre,
      tipoProducto: product.tipoProducto || 'Unidad',
      kilosPorCostal: product.kilosPorCostal || 0,
      precioKg: product.precio,
      precioCostal: product.precioCostal || 0,
      precioCostoKg: product.precioCosto || 0,  // precio de costo para validacion del piso
      esServicio: product.esServicio || false,

      // Modo de ingreso: 'cantidad' o 'monto'
      modoIngreso: 'cantidad',
      montoIngresado: 0,

      // Valores activos en el POS
      presentacion: product.tipoProducto === 'Costal' ? 'Kg' : (product.esServicio ? 'Servicio' : 'Unidad'),
      unidadMedida: product.unidadMedida || 'Unidad',
      precioUnitario: product.precio, // por defecto precio suelto/unitario
      cantidad: 1,
      maxStock: product.stock
    })
  }
  computeCrossSell()
}

// Permite cambiar la presentacion en el carrito y actualizar el precio
const changePresentacion = (item, newPres) => {
  item.presentacion = newPres
  item.modoIngreso = 'cantidad'
  item.montoIngresado = 0
  if (newPres === 'Costal') {
    item.precioUnitario = item.precioCostal
  } else {
    item.precioUnitario = item.precioKg
  }
  validateItemQty(item)
}

// Valida que el precio de venta no sea menor al precio de costo
const validatePrecio = (item) => {
  const minPrice = item.tipoProducto === 'Costal' && item.presentacion === 'Costal'
    ? (item.precioCostoKg * item.kilosPorCostal)
    : item.precioCostoKg
  if (isNaN(item.precioUnitario) || item.precioUnitario <= 0) {
    item.precioUnitario = minPrice
    return
  }
  if (item.precioUnitario < minPrice) {
    alert(`El precio de venta no puede ser menor al precio de costo (S/. ${minPrice.toFixed(2)})`)
    item.precioUnitario = minPrice
  }
  // Recalcular cantidad si estamos en modo monto
  if (item.modoIngreso === 'monto') {
    updatePorMonto(item)
  }
}

// Calcula los Kg a partir del monto ingresado
const updatePorMonto = (item) => {
  if (!item.montoIngresado || item.montoIngresado <= 0 || item.precioUnitario <= 0) {
    item.cantidad = 0.01
    return
  }
  const kgs = Number((item.montoIngresado / item.precioUnitario).toFixed(3))
  item.cantidad = kgs > 0 ? kgs : 0.01
  validateItemQty(item)
}

// Alterna el modo de ingreso entre 'cantidad' y 'monto'
const toggleModoIngreso = (item) => {
  if (item.modoIngreso === 'cantidad') {
    item.modoIngreso = 'monto'
    item.montoIngresado = Number((item.cantidad * item.precioUnitario).toFixed(2))
  } else {
    item.modoIngreso = 'cantidad'
    item.montoIngresado = 0
  }
}

// ── Cross-Selling: calcula productos frecuentemente comprados juntos ──
const computeCrossSell = () => {
  if (cart.value.length === 0 || allSalesHistory.value.length === 0) {
    crossSellSuggestions.value = []
    return
  }

  const cartIds = new Set(cart.value.map(i => i.productoId))
  const coOccurrence = {}

  for (const sale of allSalesHistory.value) {
    const saleIds = (sale.detalles || []).map(d => d.productoId)
    const hasCartItem = saleIds.some(id => cartIds.has(id))
    if (!hasCartItem) continue

    for (const id of saleIds) {
      if (cartIds.has(id)) continue
      coOccurrence[id] = (coOccurrence[id] || 0) + 1
    }
  }

  const sorted = Object.entries(coOccurrence)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => products.value.find(p => p.id === id))
    .filter(Boolean)

  crossSellSuggestions.value = sorted
}

// ── Barcode scanner: captura entrada rápida de pistola lectora ──
const handleBarcodeKeypress = (e) => {
  // Ignorar si el foco está en un input/select/textarea del usuario
  const tag = e.target?.tagName?.toLowerCase()
  if (tag === 'input' || tag === 'select' || tag === 'textarea') return

  if (e.key === 'Enter') {
    const code = barcodeBuffer.value.trim()
    barcodeBuffer.value = ''
    clearTimeout(barcodeTimer)
    if (!code) return
    const product = products.value.find(p => p.codigoBarras === code)
    if (product) {
      addToCart(product)
    } else {
      // Si no coincide exactamente, buscar por nombre parcial
      searchQuery.value = code
    }
    return
  }

  // Solo caracteres imprimibles
  if (e.key.length === 1) {
    barcodeBuffer.value += e.key
    clearTimeout(barcodeTimer)
    // Limpiar buffer si no llega el Enter en 800ms (escribió manualmente)
    barcodeTimer = setTimeout(() => { barcodeBuffer.value = '' }, 800)
  }
}

const updateQty = (item, amount) => {
  let newQty = Number((item.cantidad + amount).toFixed(2))
  if (newQty <= 0) {
    cart.value = cart.value.filter(i => i.productoId !== item.productoId)
    return
  }

  item.cantidad = newQty
  validateItemQty(item)
}

const validateItemQty = (item) => {
  if (isNaN(item.cantidad) || item.cantidad <= 0) {
    item.cantidad = 1
  }

  if (item.esServicio) return

  // Validacion de stock limite
  if (item.tipoProducto === 'Costal') {
    const totalNeededKg = item.presentacion === 'Costal' 
      ? item.cantidad * item.kilosPorCostal 
      : item.cantidad

    if (totalNeededKg > item.maxStock) {
      alert(`Stock insuficiente. Solo quedan ${item.maxStock.toFixed(2)} Kg en inventario.`)
      
      // Ajustar al maximo disponible posible
      if (item.presentacion === 'Costal') {
        const costalesPosibles = Math.floor(item.maxStock / item.kilosPorCostal)
        item.cantidad = costalesPosibles > 0 ? costalesPosibles : 1
      } else {
        item.cantidad = item.maxStock
      }
    }
  } else {
    if (item.cantidad > item.maxStock) {
      alert(`Stock insuficiente. Solo quedan ${item.maxStock} unidades en inventario.`)
      item.cantidad = item.maxStock
    }
  }
}

const removeFromCart = (productoId) => {
  cart.value = cart.value.filter(item => item.productoId !== productoId)
}

const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.precioUnitario * item.cantidad), 0))
const cartSubtotal = computed(() => Number((cartTotal.value / 1.18).toFixed(2)))
const cartTax = computed(() => Number((cartTotal.value - cartSubtotal.value).toFixed(2)))

const whatsappUrl = computed(() => {
  if (!lastClientPhone.value) return '#'
  const store = authStore.user?.nombreEmpresa || 'Nuestra Tienda'
  const items = lastSaleCart.value.map(i => {
    const qtyText = i.presentacion === 'Costal' ? `${i.cantidad} costal(es)` : `${i.cantidad} ${i.unidadMedida}`
    return `  • ${i.nombreProducto} x${qtyText} = S/. ${(i.precioUnitario * i.cantidad).toFixed(2)}`
  }).join('%0A')
  const msg = `¡Hola! Gracias por tu compra en *${store}* ❖%0A%0AComprobante: *${lastSaleVoucherType.value} ${lastSaleCode.value}*%0A%0A${items}%0A%0A*Total: S/. ${lastSaleTotal.value.toFixed(2)}*%0A%0A¡Vuelve pronto! 😊`
  const phone = lastClientPhone.value.replace(/[^0-9]/g, '')
  return `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`
})

const printTicket = () => {
  const printWindow = window.open('', '_blank', 'width=450,height=600')
  const store = authStore.user?.nombreEmpresa || 'VentasSaaS'
  const fecha = new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'medium' })
  const subtotal = (lastSaleTotal.value / 1.18).toFixed(2)
  const igv = (lastSaleTotal.value - Number(subtotal)).toFixed(2)

  const voucherTitle = lastSaleVoucherType.value === 'Factura' 
    ? 'FACTURA ELECTRÓNICA' 
    : (lastSaleVoucherType.value === 'Boleta' ? 'BOLETA DE VENTA ELECTRÓNICA' : 'NOTA DE VENTA')

  const docLabel = lastSaleVoucherType.value === 'Factura' ? 'RUC' : 'DNI/Doc'

  const html = `
    <html>
      <head>
        <title>${voucherTitle}_${lastSaleCode.value}</title>
        <style>
          @page { margin: 0; }
          body { font-family: 'Courier New', Courier, monospace; padding: 15px; color: #000; font-size: 12px; width: 280px; margin: auto; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .bold { font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 8px 0; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { padding: 3px 0; }
        </style>
      </head>
      <body>
        <div class="text-center">
          <h2 style="margin: 0; font-size: 16px;">${store}</h2>
          <p style="margin: 2px 0; font-size: 11px;">R.U.C. 20609876543</p>
          <div class="divider"></div>
          <p class="bold" style="margin: 4px 0; font-size: 13px;">${voucherTitle}</p>
          <p class="bold" style="margin: 2px 0; font-size: 13px;">${lastSaleCode.value}</p>
        </div>
        <div class="divider"></div>
        <p style="margin: 2px 0;"><strong>Fecha:</strong> ${fecha}</p>
        <p style="margin: 2px 0;"><strong>Cliente:</strong> ${lastSaleClientName.value || 'Cliente General'}</p>
        ${lastSaleClientDoc.value ? `<p style="margin: 2px 0;"><strong>${docLabel}:</strong> ${lastSaleClientDoc.value}</p>` : ''}
        <p style="margin: 2px 0;"><strong>Vendedor:</strong> ${authStore.user?.nombre || 'Caja'}</p>
        <div class="divider"></div>
        <table>
          <thead>
            <tr>
              <th align="left">Cant.</th>
              <th align="left">Descripción</th>
              <th align="right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${lastSaleCart.value.map(i => `
              <tr>
                <td valign="top">${i.cantidad}</td>
                <td valign="top">${i.nombreProducto}</td>
                <td align="right" valign="top">S/. ${(i.precioUnitario * i.cantidad).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="divider"></div>
        <table>
          <tr>
            <td>Op. Gravada:</td>
            <td align="right">S/. ${subtotal}</td>
          </tr>
          <tr>
            <td>I.G.V. (18%):</td>
            <td align="right">S/. ${igv}</td>
          </tr>
          <tr class="bold">
            <td style="font-size: 13px;">TOTAL A PAGAR:</td>
            <td align="right" style="font-size: 13px;">S/. ${lastSaleTotal.value.toFixed(2)}</td>
          </tr>
        </table>
        <div class="divider"></div>
        <div class="text-center" style="margin-top: 10px; font-size: 10px;">
          ${lastSaleVoucherType.value !== 'Nota de Venta' ? '<p>Representación impresa del Comprobante Electrónico</p>' : '<p>Comprobante de Control Interno</p>'}
          <p>¡Gracias por su preferencia!</p>
        </div>
        <script>
          window.onload = function() { window.print(); }
        <\/script>
      </body>
    </html>
  `
  printWindow.document.write(html)
  printWindow.document.close()
}

const checkout = async () => {
  loading.value = true
  try {
    const client = clients.value.find(c => c.id === selectedClientId.value)
    const clienteId = client ? client.id : null
    let nombreCliente = client ? client.nombre : 'Cliente General'

    // Validaciones tributarias previas
    if (tipoComprobante.value === 'Factura') {
      const ruc = facturaRuc.value.trim()
      const razon = facturaRazonSocial.value.trim()
      if (!ruc || ruc.length !== 11 || !/^\d+$/.test(ruc)) {
        alert('Para emitir una Factura Electrónica es obligatorio ingresar un RUC válido de 11 dígitos numéricos.')
        loading.value = false
        return
      }
      if (!razon) {
        alert('Para emitir una Factura Electrónica es obligatoria la Razón Social del cliente o empresa.')
        loading.value = false
        return
      }
      nombreCliente = razon
    } else if (tipoComprobante.value === 'Boleta') {
      if (cartTotal.value >= 700 && !selectedClientHasDoc.value) {
        alert('Por normativa SUNAT, para ventas en Boleta de Venta iguales o mayores a S/. 700.00 es obligatorio identificar al cliente con su DNI o RUC.')
        loading.value = false
        return
      }
    }

    // Adaptamos el mapeo de los productos al formato requerido por el backend
    const detallesVenta = cart.value.map(item => {
      const isCostal = item.tipoProducto === 'Costal'
      const isSack = isCostal && item.presentacion === 'Costal'

      // Cantidad y Precio en unidades base (kilogramos) para el backend
      const cantidadBase = isSack ? (item.cantidad * item.kilosPorCostal) : item.cantidad
      const precioUnitarioBase = isSack ? (item.precioUnitario / item.kilosPorCostal) : item.precioUnitario

      // Formatear el nombre en el ticket de forma entendible
      let nombreLabel = item.nombreProducto
      if (isCostal) {
        nombreLabel = isSack 
          ? `${item.nombreProducto} (Costal ${item.kilosPorCostal}Kg)` 
          : `${item.nombreProducto} (Kg suelto)`
      }

      return {
        productoId: item.productoId,
        nombreProducto: nombreLabel,
        cantidad: cantidadBase,
        precioUnitario: Number(precioUnitarioBase.toFixed(4)),
        unidadMedida: item.unidadMedida,
        presentacion: item.presentacion,
        cantidadPresentacion: item.cantidad,
        precioPresentacion: item.precioUnitario
      }
    })

    const payload = {
      detalles: detallesVenta,
      metodoPago: isFiado.value ? "Fiado" : paymentMethod.value,
      estadoPago: isFiado.value ? "Fiado" : "Pagado",
      clienteId: clienteId,
      nombreCliente: nombreCliente,
      tipoComprobante: tipoComprobante.value,
      serie: serieActual.value,
      clienteTipoDocumento: tipoComprobante.value === 'Factura' ? '6' : (client?.tipoDocumento === 'RUC' ? '6' : (client?.numeroDocumento ? '1' : '-')),
      clienteNumeroDocumento: tipoComprobante.value === 'Factura' ? facturaRuc.value.trim() : (client?.numeroDocumento || ''),
      clienteRazonSocial: tipoComprobante.value === 'Factura' ? facturaRazonSocial.value.trim() : (client?.nombre || ''),
      clienteDireccion: tipoComprobante.value === 'Factura' ? facturaDireccion.value.trim() : (client?.direccion || ''),
      rucFactura: tipoComprobante.value === 'Factura' ? facturaRuc.value.trim() : null,
      razonSocialFactura: tipoComprobante.value === 'Factura' ? facturaRazonSocial.value.trim() : null,
      direccionFiscalFactura: tipoComprobante.value === 'Factura' ? facturaDireccion.value.trim() : null
    }

    const res = await fetch(`${API_URL}/api/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Error al procesar la venta.')
    }

    const createdSale = await res.json()

    // Mostrar modal de éxito
    lastSaleCode.value = createdSale.numeroComprobante || proximoCorrelativo.value
    lastSaleVoucherType.value = tipoComprobante.value
    lastSaleClientName.value = createdSale.nombreCliente || nombreCliente
    lastSaleClientDoc.value = createdSale.clienteNumeroDocumento || ''
    lastSaleCart.value = [...cart.value]
    lastSaleTotal.value = cartTotal.value
    lastClientPhone.value = client?.telefono || ''
    showSuccessModal.value = true

    cart.value = []
    crossSellSuggestions.value = []
    selectedClientId.value = ''
    facturaRuc.value = ''
    facturaRazonSocial.value = ''
    facturaDireccion.value = ''
    isFiado.value = false
    fetchProximoCorrelativo()
    fetchProducts()
    fetchSalesHistory()
  } catch (err) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

const fetchSalesHistory = async () => {
  try {
    const res = await fetch(`${API_URL}/api/sales`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) return
    allSalesHistory.value = await res.json()
  } catch (e) {
    console.warn('No se pudo cargar historial para cross-selling', e)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchProducts()
  fetchProximoCorrelativo()
  fetchCategories()
  fetchClients()
  fetchPaymentMethods()
  fetchSalesHistory()
  document.addEventListener('keypress', handleBarcodeKeypress)
})

onUnmounted(() => {
  document.removeEventListener('keypress', handleBarcodeKeypress)
  clearTimeout(barcodeTimer)
})
</script>

<style scoped>
.pos-workspace {
  display: flex;
  flex-grow: 1;
}

.search-header {
  margin-bottom: 20px;
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
  padding: 10px 16px;
  outline: none;
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
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 12px;
}

.products-grid.sidebar-hovered {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.product-card {
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  transition: transform 0.2s, box-shadow 0.2s;
  background: #ffffff;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.product-image-container {
  width: 100%;
  height: 13vh;         /* ~120px en 900px de altura — escala con pantalla */
  min-height: 80px;
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
  font-weight: 500;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  color: #ffffff;
}

.product-card-stock.ok { background-color: #48bb78; }
.product-card-stock.low { background-color: #f56565; }

.product-info {
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 2px;
  min-height: 38px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-barcode {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.product-price {
  font-weight: 500;
  color: var(--primary);
  font-size: 1rem;
  margin-top: auto;
}

/* Cart Panel styling — columna lateral de altura completa */
.cart-panel {
  width: 29vw;          /* ~480px en 1700px — escala con pantalla */
  min-width: 330px;
  max-width: 500px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-left: 1px solid #e2e8f0;
  overflow: hidden;
  height: 100vh;
  text-align: left;
  padding: 20px 16px;
  box-sizing: border-box;
}

/* ── Encabezado Moderno del Carrito ── */
.cart-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.cart-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-title-icon {
  color: #2563eb;
}

.cart-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.01em;
}

.cart-count-chip {
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid #bfdbfe;
}

.cart-clear-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.cart-clear-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* ── Selector Segmentado de Comprobante ── */
.voucher-segmented-control {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px;
  background: #f1f5f9;
  padding: 3px;
  border-radius: 9px;
  border: 1px solid #e2e8f0;
}

.voucher-tab {
  border: none;
  background: transparent;
  padding: 7px 4px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.voucher-tab:hover:not(.active) {
  background: rgba(255, 255, 255, 0.6);
  color: #334155;
}

.voucher-tab.active.tab-boleta {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 2px 5px rgba(37, 99, 235, 0.15);
  border: 1px solid #dbeafe;
}

.voucher-tab.active.tab-factura {
  background: #ffffff;
  color: #7c3aed;
  box-shadow: 0 2px 5px rgba(124, 58, 237, 0.15);
  border: 1px solid #ede9fe;
}

.voucher-tab.active.tab-notavta {
  background: #ffffff;
  color: #059669;
  box-shadow: 0 2px 5px rgba(5, 150, 105, 0.15);
  border: 1px solid #d1fae5;
}

/* ── Barra Informativa de Serie y Correlativo ── */
.voucher-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.76rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.voucher-info-bar.type-boleta {
  background: #f0f7ff;
  border-color: #dbeafe;
  color: #1e40af;
}

.voucher-info-bar.type-factura {
  background: #faf5ff;
  border-color: #ede9fe;
  color: #6b21a8;
}

.voucher-info-bar.type-nota-de-venta {
  background: #f0fdf4;
  border-color: #dcfce7;
  color: #166534;
}

.voucher-info-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.correlativo-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  display: inline-block;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.25);
}

.correlativo-label {
  font-weight: 500;
  font-size: 0.74rem;
}

.correlativo-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
}

/* ── Lista de Items en Carrito ── */
.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 10px;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

/* ── Checkout y Datos Fiscales ── */
.cart-checkout-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
}

.cart-client-fiscal-box {
  border-radius: 9px;
  transition: all 0.2s;
}

.cart-client-fiscal-box.is-factura {
  background: #faf5ff;
  border: 1px solid #ede9fe;
  padding: 9px;
}

.factura-fiscal-wrapper {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.fiscal-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fiscal-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6d28d9;
}

.fiscal-badge-pill {
  font-size: 0.68rem;
  font-weight: 700;
  color: #7c3aed;
  background: #ede9fe;
  padding: 2px 6px;
  border-radius: 4px;
}

.fiscal-quick-select select {
  width: 100%;
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid #ddd6fe;
  font-size: 0.76rem;
  background: #ffffff;
  color: #4b5563;
  height: 30px;
  outline: none;
}

.fiscal-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 7px;
}

.fiscal-col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.fiscal-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #475569;
}

.fiscal-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.fiscal-input {
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 0.8rem;
  background: #ffffff;
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.fiscal-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
}

.fiscal-input.font-mono {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-weight: 600;
}

.ruc-status-check {
  position: absolute;
  right: 8px;
  color: #16a34a;
  font-weight: 700;
  font-size: 0.82rem;
}

.fiscal-full-row {
  width: 100%;
}

.fiscal-input-subtle {
  font-size: 0.75rem;
  padding: 5px 8px;
  background: #fdfcff;
}

.standard-client-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.client-header-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.client-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.76rem;
  font-weight: 600;
  color: #475569;
}

.client-badge-hint {
  font-size: 0.68rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 4px;
}

.client-select {
  width: 100%;
  padding: 7px 10px;
  border-radius: 7px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.8rem;
  color: #1e293b;
  height: 36px;
  outline: none;
  box-sizing: border-box;
}

.sunat-alert-card {
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 7px;
  padding: 6px 8px;
  margin-top: 4px;
  font-size: 0.73rem;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── Método de Pago y Fiado ── */
.payment-method-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 8px;
  align-items: flex-end;
}

.payment-col-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: #475569;
  display: block;
  margin-bottom: 3px;
}

.payment-select {
  width: 100%;
  padding: 6px 8px;
  border-radius: 7px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-size: 0.8rem;
  color: #1e293b;
  height: 36px;
  outline: none;
  box-sizing: border-box;
}

.fiado-col {
  width: 100%;
}

.fiado-col.full-col {
  grid-column: span 2;
}

.fiado-toggle-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 7px;
  height: 36px;
  padding: 0 10px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.fiado-toggle-pill.active {
  background: #fef08a;
  border-color: #eab308;
}

.fiado-check-input {
  width: 15px;
  height: 15px;
  cursor: pointer;
  accent-color: #d97706;
}

.fiado-label-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #92400e;
}

/* ── Totales y Desglose ── */
.cart-totals-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #64748b;
}

.totals-title {
  font-weight: 500;
}

.totals-num {
  font-weight: 600;
  color: #334155;
}

.totals-row.total-highlight {
  border-top: 1px dashed #cbd5e1;
  margin-top: 3px;
  padding-top: 5px;
}

.grand-total-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.grand-total-num {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}

/* ── Botón Emitir Comprobante ── */
.btn-checkout-action {
  width: 100%;
  padding: 12px;
  border-radius: 9px;
  border: none;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-sizing: border-box;
}

.action-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-checkout-action.btn-boleta {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.btn-checkout-action.btn-boleta:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
}

.btn-checkout-action.btn-factura {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}

.btn-checkout-action.btn-factura:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(124, 58, 237, 0.35);
}

.btn-checkout-action.btn-nota-de-venta {
  background: linear-gradient(135deg, #059669, #047857);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
}

.btn-checkout-action.btn-nota-de-venta:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(5, 150, 105, 0.35);
}

.btn-checkout-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.empty-cart {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 60px;
  color: var(--text-muted);
  text-align: center;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.item-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.item-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.item-controls-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-remove {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  transition: transform 0.2s, color 0.2s;
}

.btn-remove:hover {
  color: #b91c1c;
  transform: scale(1.15);
}

/* ── Botones selectores de presentacion en el POS ── */
.pres-selector {
  display: flex;
  gap: 4px;
}

.pres-btn {
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background-color: #f8fafc;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.pres-btn:hover {
  border-color: var(--primary);
  background-color: #eff6ff;
  color: var(--primary);
}

.pres-btn.active {
  background-color: #dbeafe;
  color: var(--primary);
  border-color: var(--primary);
}

.btn-qty {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background-color: var(--bg-app);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-qty {
  font-weight: 500;
  font-size: 0.9rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text-main);
}

/* ── Barcode scanner indicator ── */
.barcode-indicator {
  margin-top: 10px;
  padding: 8px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  color: #1e40af;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  animation: pulse-barcode 0.8s ease-in-out infinite alternate;
}

@keyframes pulse-barcode {
  from { opacity: 0.7; }
  to { opacity: 1; }
}

/* ── Cross-selling panel ── */
.cross-sell-panel {
  flex-shrink: 0;
  margin-top: 14px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #fefce8, #fef9c3);
  border: 1px solid #fde68a;
  border-radius: var(--radius-md);
}

.cross-sell-title {
  font-size: 0.85rem;
  font-weight: 500;
  color: #92400e;
  margin: 0 0 10px 0;
}

.cross-sell-items {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.cross-sell-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  background: #ffffff;
  border: 1px solid #fde68a;
  border-radius: 99px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-main);
  transition: var(--transition);
  box-shadow: var(--shadow-sm);
}

.cross-sell-chip:hover {
  background: #fef08a;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(234, 179, 8, 0.25);
}

.cross-sell-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.cross-sell-price {
  font-weight: 500;
  color: #d97706;
}

/* ── Success modal ── */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.success-modal {
  max-width: 480px;
  width: 90%;
  padding: 30px;
  background: #ffffff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.success-icon {
  font-size: 3.5rem;
  margin-bottom: 12px;
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop-in {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.success-code {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.success-summary {
  background: var(--bg-app);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.success-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: var(--text-muted);
}

.success-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-main);
  border-top: 1px dashed var(--border-color);
  padding-top: 10px;
  margin-top: 6px;
}

.success-actions {
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
}

.btn-whatsapp:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 211, 102, 0.4);
}
</style>
