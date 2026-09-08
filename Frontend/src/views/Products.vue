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
        <div class="header-flex">
          <div>
            <h1 class="text-title">⬦ Inventario</h1>
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
          <option value="">Todas las Categorías</option>
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
              <th v-if="authStore.hasPermission('modificar_productos')">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(prod, index) in filteredProducts" :key="prod.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td><code>{{ prod.codigoBarras }}</code></td>
              <td>
                <div class="product-info-cell" style="cursor: pointer;" @click="openImageGallery(prod)">
                  <img :src="prod.imagenUrl || defaultImage" class="product-thumbnail" alt="thumbnail" />
                  <strong>{{ prod.nombre }}</strong>
                </div>
              </td>
              <td>S/. {{ prod.precioCosto.toFixed(2) }}</td>
              <td>
                <span v-if="prod.precioOferta > 0" style="text-decoration: line-through; color: #a0aec0; font-size: 0.85em; display: block; margin-bottom: 2px;">S/. {{ prod.precio.toFixed(2) }}</span>
                <span :style="{ color: prod.precioOferta > 0 ? '#10b981' : 'inherit', fontWeight: prod.precioOferta > 0 ? '600' : 'normal' }">
                  S/. {{ prod.precioOferta > 0 ? prod.precioOferta.toFixed(2) : prod.precio.toFixed(2) }}
                </span>
              </td>
              <td>
                <span :class="['stock-badge', prod.stock <= prod.stockMinimo ? 'low' : 'ok']">
                  <template v-if="prod.esServicio">— Servicio —</template>
                  <template v-else-if="prod.tipoProducto === 'Costal'">
                    {{ (Number(prod.stock) / Number(prod.kilosPorCostal || 1)).toFixed(1) }} Costal(es)
                  </template>
                  <template v-else>{{ Number(prod.stock).toFixed(0) }} {{ prod.unidadMedida }}</template>
                </span>
              </td>
              <td>
                <span v-if="prod.stock <= prod.stockMinimo" class="status-indicator low">⚠ Reabastecer</span>
                <span v-else class="status-indicator ok">✓ Activo</span>
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
          <h2 class="modal-title" style="margin-bottom: 12px; font-size: 1.3rem;">{{ isEdit ? '✏️ Editar Producto' : '⬦ Registrar Producto' }}</h2>
          <form @submit.prevent="saveProduct" class="compact-form">

            <!-- FILA 1: Nombre (span 2) y Categoría (span 1) -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
              <div class="field">
                <label>Nombre del Producto</label>
                <input v-model="form.nombre" type="text" placeholder="Ej. Alimento Royal Canin" required />
              </div>
              <div class="field">
                <label>Categoría</label>
                <select v-model="form.categoriaId" required>
                  <option value="" disabled>Seleccione...</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
                </select>
              </div>
            </div>

            <!-- FILA 2: Código/SKU y Tipo de Producto (Horizontal pills) -->
            <div style="display: grid; grid-template-columns: 1fr 2.2fr; gap: 12px; align-items: end;">
              <div class="field">
                <label>Código de Barra / SKU</label>
                <input v-model="form.codigoBarras" type="text" placeholder="7501234567" required />
              </div>
              <div class="field">
                <label>Tipo de Producto</label>
                <div class="tipo-selector-horizontal">
                  <button type="button"
                    v-for="tipo in tiposProducto" :key="tipo.valor"
                    :class="['tipo-btn-pill', form.tipoProducto === tipo.valor ? 'active' : '']"
                    :title="tipo.descripcion"
                    @click="selectTipo(tipo.valor)">
                    <span>{{ tipo.icono }}</span>
                    <span>{{ tipo.label }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- FILA 3: Precios y stock (Si es Costal: 3 Bloques visuales compactos ordenados: Inventario -> Compra -> Venta) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 4px;" v-if="form.tipoProducto === 'Costal'">
              <!-- BLOQUE INVENTARIO -->
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="grid-column: span 2; display: flex; align-items: center; font-size: 0.75rem; font-weight: 500; color: #92400e; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; color: #d97706;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  Inventario
                </div>
                <div class="field" style="margin-bottom: 0 !important;">
                  <label>Kg x Costal</label>
                  <input v-model.number="form.kilosPorCostal" type="number" step="0.01" min="0" required />
                </div>
                <div class="field" style="margin-bottom: 0 !important;">
                  <label>{{ isEdit ? 'Stock' : 'Inicial (Costales)' }}</label>
                  <input v-model.number="form.stock" type="number" step="0.1" min="0" :disabled="isEdit" required />
                </div>
              </div>

              <!-- BLOQUE COMPRA -->
              <div style="background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="grid-column: span 2; display: flex; align-items: center; font-size: 0.75rem; font-weight: 500; color: #475569; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; color: #64748b;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Compra (Costos)
                </div>
                <div class="field" style="margin-bottom: 0 !important;">
                  <label>Costo Costal</label>
                  <input v-model.number="form.precioCostoCostal" type="number" step="0.01" min="0" required />
                </div>
                <div class="field" style="margin-bottom: 0 !important;">
                  <label>Costo Kg (calc)</label>
                  <input :value="costoKgCalculado" type="text" disabled style="background-color: #e2e8f0; cursor: not-allowed;" />
                </div>
              </div>

              <!-- BLOQUE VENTA -->
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="grid-column: span 2; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                  <div style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 500; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; color: #4ade80;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    Venta & Oferta
                  </div>
                  <div v-if="form.precioOferta > 0 && form.precio > 0" style="background-color: #15803d; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: bold;">
                    -{{ Math.round((1 - form.precioOferta / form.precio) * 100) }}% OFF
                  </div>
                </div>
                <div class="field" style="margin-bottom: 0 !important;">
                  <label>Venta Costal Entero</label>
                  <input v-model.number="form.precioCostal" type="number" step="0.01" min="0" required />
                </div>
                <div class="field" style="margin-bottom: 0 !important;">
                  <label>Precio Venta x Kg</label>
                  <input v-model.number="form.precio" type="number" step="0.01" min="0" required />
                </div>
                <div class="field" style="grid-column: span 2; margin-bottom: 0 !important;">
                  <label>Precio Oferta x Kg (S/.) — 0 = Sin oferta</label>
                  <input v-model.number="form.precioOferta" type="number" step="0.01" min="0" placeholder="0.00" />
                </div>
              </div>
            </div>

            <!-- FILA 3 (Alternativa): Precios y stock para Unidad (3 Bloques ordenados: Inventario -> Compra -> Venta) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 2.2fr; gap: 12px; margin-top: 4px;" v-if="form.tipoProducto === 'Unidad'">
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 10px;">
                <div style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 500; color: #92400e; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; color: #d97706;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  Inventario
                </div>
                <div class="field" style="margin-bottom: 0 !important;">
                  <label>{{ isEdit ? 'Stock' : 'Inicial (Und)' }}</label>
                  <input v-model.number="form.stock" type="number" step="1" min="0" :disabled="isEdit" required />
                </div>
              </div>
              <div style="background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px;">
                <div style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 500; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; color: #64748b;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Compra
                </div>
                <div class="field" style="margin-bottom: 0 !important;">
                  <label>Precio Costo (S/.)</label>
                  <input v-model.number="form.precioCosto" type="number" step="0.01" min="0" required />
                </div>
              </div>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 500; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; color: #4ade80;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    Venta & Oferta
                  </div>
                  <div v-if="form.precioOferta > 0 && form.precio > 0" style="background-color: #15803d; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: bold;">
                    -{{ Math.round((1 - form.precioOferta / form.precio) * 100) }}% OFF
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <div class="field" style="margin-bottom: 0 !important;">
                    <label>Precio Venta Base</label>
                    <input v-model.number="form.precio" type="number" step="0.01" min="0" required />
                  </div>
                  <div class="field" style="margin-bottom: 0 !important;">
                    <label>Precio Oferta (S/.)</label>
                    <input v-model.number="form.precioOferta" type="number" step="0.01" min="0" placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>

            <!-- FILA 3 (Alternativa): Precios para Servicio (2 Bloques visuales) -->
            <div style="display: grid; grid-template-columns: 1fr 2.2fr; gap: 12px; margin-top: 4px;" v-if="form.tipoProducto === 'Servicio'">
              <div style="background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px;">
                <div style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 500; color: #475569; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; color: #64748b;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Costo
                </div>
                <div class="field" style="margin-bottom: 0 !important;">
                  <label>Costo Insumos (S/.)</label>
                  <input v-model.number="form.precioCosto" type="number" step="0.01" min="0" />
                </div>
              </div>
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 500; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; color: #4ade80;"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    Venta & Oferta
                  </div>
                  <div v-if="form.precioOferta > 0 && form.precio > 0" style="background-color: #15803d; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: bold;">
                    -{{ Math.round((1 - form.precioOferta / form.precio) * 100) }}% OFF
                  </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <div class="field" style="margin-bottom: 0 !important;">
                    <label>Precio Servicio (S/.)</label>
                    <input v-model.number="form.precio" type="number" step="0.01" min="0" required />
                  </div>
                  <div class="field" style="margin-bottom: 0 !important;">
                    <label>Precio Oferta (S/.)</label>
                    <input v-model.number="form.precioOferta" type="number" step="0.01" min="0" placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>

            <!-- FILA 4: Stock Mínimo y Descripción (Alineados en 1fr y 2.2fr) -->
            <div style="display: grid; grid-template-columns: 1fr 2.2fr; gap: 12px; margin-top: 4px;">
              <div class="field">
                <label>Stock Mínimo ({{ form.tipoProducto === 'Costal' ? 'Costales' : form.unidadMedida }})</label>
                <input v-model.number="form.stockMinimo"
                  type="number"
                  :step="form.tipoProducto === 'Costal' ? '0.1' : '1'"
                  :disabled="form.tipoProducto === 'Servicio'"
                  placeholder="Ej. 2"
                  min="0" required />
              </div>
              <div class="field">
                <label>Descripción del Producto</label>
                <textarea v-model="form.descripcion" placeholder="Ej. Alimento premium sabor cordero y arroz" rows="4" style="width: 100%; border: 1px solid var(--border-color); border-radius: 6px; padding: 10px; font-size: 0.9rem; font-family: inherit; resize: vertical;"></textarea>
              </div>
            </div>

            <!-- ATRIBUTOS DINÁMICOS -->
            <div style="background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; margin-top: 12px; margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="font-size: 0.75rem; font-weight: 500; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
                  📋 Especificaciones (Opcional)
                </div>
                <button type="button" @click="form.atributos.push({nombre: '', valor: ''})" class="btn btn-secondary-compact" style="font-size: 0.75rem; padding: 4px 8px;">➕ Añadir Atributo</button>
              </div>
              <div v-if="form.atributos.length === 0" style="font-size: 0.8rem; color: var(--text-muted);">Sin atributos. Puedes agregar color, material, talla, etc.</div>
              <div v-for="(attr, idx) in form.atributos" :key="idx" style="display: grid; grid-template-columns: 1fr 1fr 30px; gap: 8px; margin-bottom: 8px; align-items: center;">
                <input v-model="attr.nombre" type="text" placeholder="Ej: Color" style="padding: 6px; font-size: 0.85rem; border-radius: 4px; border: 1px solid #cbd5e1;" required />
                <input v-model="attr.valor" type="text" placeholder="Ej: Negro" style="padding: 6px; font-size: 0.85rem; border-radius: 4px; border: 1px solid #cbd5e1;" required />
                <button type="button" @click="form.atributos.splice(idx, 1)" style="background: #ef4444; color: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer;">✕</button>
              </div>
            </div>

            <!-- FILA 6: Subida de imágenes múltiples -->
            <div style="background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; margin-top: 4px;">
              <div style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 500; color: #475569; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; color: #64748b;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                Imágenes del Producto (máx. 5 imágenes, 5MB c/u)
              </div>
              
              <!-- Botón de subida -->
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px;">
                <label class="btn btn-secondary-compact" style="cursor: pointer; margin: 0; display: inline-flex; align-items: center; gap: 6px;">
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple @change="handleImageUpload" style="display: none;" :disabled="uploadingImage || form.imagenes.length >= 5" />
                  {{ uploadingImage ? '⏳ Subiendo...' : '📁 Seleccionar imágenes' }}
                </label>
                <span style="font-size: 0.78rem; color: var(--text-muted);">{{ form.imagenes.length }}/5 imágenes</span>
              </div>

              <!-- Vista previa de imágenes subidas -->
              <div v-if="form.imagenes.length > 0" style="display: flex; flex-wrap: wrap; gap: 8px;">
                <div v-for="(img, idx) in form.imagenes" :key="idx" style="position: relative; width: 80px; height: 80px;">
                  <img :src="img" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-color);" alt="Imagen producto" />
                  <button type="button" @click="removeImage(idx)" style="position: absolute; top: -6px; right: -6px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 22px; height: 22px; padding: 0; box-sizing: border-box; flex-shrink: 0; font-size: 0.8rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; z-index: 5;">✕</button>
                  <div v-if="idx === 0" style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.55); color: white; font-size: 0.6rem; text-align: center; border-radius: 0 0 6px 6px; padding: 2px;">Principal</div>
                </div>
              </div>
              <div v-else style="font-size: 0.8rem; color: var(--text-muted);">Sin imágenes cargadas aún.</div>
            </div>

            <!-- BOTONES DE ACCIÓN -->
            <div class="modal-actions-compact">
              <button type="button" @click="showModal = false" class="btn btn-secondary-compact">Cancelar</button>
              <button type="submit" class="btn btn-primary-compact">{{ isEdit ? 'Guardar Cambios' : 'Guardar Producto' }}</button>
            </div>
          </form>
        </div>
      </div>
    </main>

    <!-- Modal de Galería de Imágenes Premium (Lightbox) -->
    <div v-if="showGalleryModal" class="gallery-modal-overlay" @click.self="closeGalleryModal">
      <div class="gallery-modal-card">
        <!-- Header del Modal -->
        <div class="gallery-modal-header">
          <div class="gallery-header-info">
            <span class="gallery-icon-badge">🖼️</span>
            <div>
              <h3 class="gallery-title">{{ selectedGalleryProduct?.nombre || 'Galería de Producto' }}</h3>
              <span class="gallery-subtitle" v-if="galleryImages.length > 0">
                Imagen {{ activeImageIndex + 1 }} de {{ galleryImages.length }}
              </span>
            </div>
          </div>
          <button @click="closeGalleryModal" class="gallery-close-btn" title="Cerrar (Esc)">✕</button>
        </div>

        <!-- Visor Principal de Imagen -->
        <div class="gallery-main-viewport">
          <div v-if="galleryImages.length === 0" class="gallery-empty-state">
            <span>📷</span>
            <p>Este producto no tiene imágenes adicionales.</p>
          </div>
          <template v-else>
            <!-- Botón Anterior -->
            <button 
              v-if="galleryImages.length > 1" 
              @click="prevGalleryImage" 
              class="gallery-nav-btn prev" 
              title="Anterior">
              ‹
            </button>

            <!-- Imagen Principal con Zoom al hacer Hover -->
            <div 
              class="gallery-image-wrapper"
              @mousemove="handleGalleryMouseMove"
              @mouseleave="handleGalleryMouseLeave">
              <img 
                :src="galleryImages[activeImageIndex]" 
                :alt="selectedGalleryProduct?.nombre"
                class="gallery-main-image" 
                :style="galleryZoomStyle"
              />
            </div>

            <!-- Botón Siguiente -->
            <button 
              v-if="galleryImages.length > 1" 
              @click="nextGalleryImage" 
              class="gallery-nav-btn next" 
              title="Siguiente">
              ›
            </button>
          </template>
        </div>

        <!-- Tira de Miniaturas (Thumbnails) -->
        <div v-if="galleryImages.length > 1" class="gallery-thumbnails-strip">
          <button
            v-for="(img, idx) in galleryImages"
            :key="idx"
            :class="['gallery-thumb-btn', activeImageIndex === idx ? 'active' : '']"
            @click="activeImageIndex = idx">
            <img :src="img" alt="Thumbnail" />
          </button>
        </div>
      </div>
    </div>
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
const showModal = ref(false);
const showGalleryModal = ref(false);
const selectedGalleryProduct = ref(null);
const galleryImages = ref([]);
const activeImageIndex = ref(0);

const galleryZoomStyle = reactive({
  transform: 'scale(1)',
  transformOrigin: 'center center',
  cursor: 'zoom-in'
});

const handleGalleryMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  galleryZoomStyle.transform = 'scale(2.2)';
  galleryZoomStyle.transformOrigin = `${x}% ${y}%`;
};

const handleGalleryMouseLeave = () => {
  galleryZoomStyle.transform = 'scale(1)';
  galleryZoomStyle.transformOrigin = 'center center';
};

const openImageGallery = (prod) => {
  selectedGalleryProduct.value = prod;
  galleryImages.value = prod.imagenes && prod.imagenes.length > 0 ? prod.imagenes : (prod.imagenUrl ? [prod.imagenUrl] : []);
  activeImageIndex.value = 0;
  showGalleryModal.value = true;
};
const closeGalleryModal = () => {
  showGalleryModal.value = false;
  selectedGalleryProduct.value = null;
  galleryImages.value = [];
  activeImageIndex.value = 0;
};
const nextGalleryImage = () => {
  if (galleryImages.value.length > 0) {
    activeImageIndex.value = (activeImageIndex.value + 1) % galleryImages.value.length;
  }
};
const prevGalleryImage = () => {
  if (galleryImages.value.length > 0) {
    activeImageIndex.value = (activeImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
  }
};
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

const uploadingImage = ref(false)

const form = reactive({
  nombre: '',
  codigoBarras: '',
  precioCosto: 0,
  precio: 0,
  precioOferta: 0,
  stock: 0,
  stockMinimo: 5,
  descripcion: '',
  categoriaId: '',
  marcaId: '',
  imagenUrl: '',
  atributos: [],
  imagenes: [],
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
  { valor: 'Unidad',   label: 'Unidad',   icono: '⬦', descripcion: 'Se vende por unidades (ej: cama, ropa, pollo vivo)' },
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

const attributeTypes = ref([])
const fetchAttributeTypes = async () => {
  try {
    const res = await fetch(`${API_URL}/api/attributes`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    attributeTypes.value = await res.json()
  } catch (err) {
    console.error('Error fetching attributes')
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
  form.marcaId = ''
  form.imagenUrl = ''
  form.atributos = []
  form.imagenes = []
  form.precioOferta = 0
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
  form.descripcion = product.descripcion
  form.categoriaId = product.categoriaId
  form.marcaId = product.marcaId || ''
  form.imagenUrl = product.imagenUrl || ''
  form.atributos = product.atributos ? JSON.parse(JSON.stringify(product.atributos)) : []
  form.imagenes = product.imagenes || []
  form.precioOferta = product.precioOferta || 0
  form.tipoProducto = product.tipoProducto || 'Unidad'
  form.unidadMedida = product.unidadMedida || 'Unidad'
  form.esServicio = product.esServicio || false
  form.precioCostoCostal = product.precioCostoCostal || 0
  form.precioCostal = product.precioCostal || 0
  form.kilosPorCostal = product.kilosPorCostal || 0

  if (product.tipoProducto === 'Costal' && product.kilosPorCostal > 0) {
    form.stock = Number((product.stock / product.kilosPorCostal).toFixed(2))
    form.stockMinimo = Number((product.stockMinimo / product.kilosPorCostal).toFixed(2))
  } else {
    form.stock = product.stock
    form.stockMinimo = product.stockMinimo
  }

  showModal.value = true
}

const saveProduct = async () => {
  if (!form.categoriaId) {
    alert('Por favor seleccione una categoría.')
    return
  }

  try {
    const payload = { ...form }

    // Si es Costal, hacemos las conversiones de costo y stock a Kilogramos para la base de datos
    if (payload.tipoProducto === 'Costal' && payload.kilosPorCostal > 0) {
      payload.precioCosto = Number((payload.precioCostoCostal / payload.kilosPorCostal).toFixed(4))
      payload.stockMinimo = Number((payload.stockMinimo * payload.kilosPorCostal).toFixed(2))
      if (!isEdit.value) {
        payload.stock = Number((payload.stock * payload.kilosPorCostal).toFixed(2))
      }
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
      body: JSON.stringify(payload)
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

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return

  const remaining = 5 - form.imagenes.length
  const toUpload = files.slice(0, remaining)

  uploadingImage.value = true
  try {
    for (const file of toUpload) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(API_URL + '/api/uploads/image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authStore.token}` },
        body: formData
      })
      if (!res.ok) { alert('Error al subir imagen: ' + file.name); continue }
      const data = await res.json()
      form.imagenes.push(data.url)
      // La primera imagen también queda como imagenUrl principal (compatibilidad)\r
      if (form.imagenes.length === 1) form.imagenUrl = data.url
    }
  } finally {
    uploadingImage.value = false
    event.target.value = '' // reset input for re-upload\r
  }
}

const removeImage = (index) => {
  form.imagenes.splice(index, 1)
  form.imagenUrl = form.imagenes.length > 0 ? form.imagenes[0] : ''
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
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 500;
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
  font-weight: 500;
  color: var(--text-muted);
}

.stock-badge {
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 500;
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
  font-weight: 500;
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
  max-width: 820px;
  background-color: var(--bg-card);
  padding: 20px;
  border-radius: var(--radius-md);
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
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  background-color: var(--bg-app);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  cursor: pointer;
  position: relative;
}

.product-thumbnail:hover {
  transform: scale(2.2);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.3);
  z-index: 50;
  border-color: #3b82f6;
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
  font-weight: 500;
  margin-bottom: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.field label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--text-muted);
}

/* Modificadores especificos de inputs compactos del modal */
.compact-form input:not([type="checkbox"]):not([type="radio"]), 
.compact-form select {
  padding: 8px 12px !important;
  font-size: 0.88rem !important;
  height: 38px !important;
  border-radius: 6px !important;
}

.compact-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Fila especial para los 6 campos de costal */
.costal-grid-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

/* Vista previa de imagen compacta y horizontal */
.image-preview-box-compact {
  width: 100%;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--bg-app);
}

.preview-img-compact {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder-compact {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.modal-actions-compact {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
}

.btn-secondary-compact {
  background-color: var(--secondary);
  color: #5c2053;
  padding: 8px 16px;
  font-size: 0.88rem;
  border-radius: 6px;
}

.btn-secondary-compact:hover {
  background-color: var(--secondary-hover);
}

.btn-primary-compact {
  background-color: var(--primary);
  color: #1e3a8a;
  padding: 8px 18px;
  font-size: 0.88rem;
  border-radius: 6px;
}

.btn-primary-compact:hover {
  background-color: var(--primary-hover);
}

/* ── Análisis de stock por IA ── */
.analysis-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.analysis-rate {
  font-size: 0.78rem;
  font-weight: 500;
  color: #6366f1;
}

.analysis-days {
  font-size: 0.78rem;
  font-weight: 500;
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
  font-weight: 500;
  color: #0369a1;
}

.analysis-no-data {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-style: italic;
}

/* Selector de tipo horizontal (Compacto tipo pills) */
.tipo-selector-horizontal {
  display: flex;
  gap: 8px;
  width: 100%;
}

.tipo-btn-pill {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-main);
  transition: all 0.2s;
}

.tipo-btn-pill:hover {
  border-color: var(--primary);
  background-color: #eff6ff;
  color: var(--primary);
}

.tipo-btn-pill.active {
  border-color: var(--primary);
  background-color: #dbeafe;
  color: var(--primary);
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.08);
}

/* ── Modal Galería de Imágenes Premium (Lightbox) ── */
.gallery-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: galleryFadeIn 0.25s ease-out;
}

@keyframes galleryFadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.gallery-modal-card {
  width: 100%;
  max-width: 780px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.gallery-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background: rgba(30, 41, 59, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.gallery-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gallery-icon-badge {
  font-size: 1.4rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 8px;
  border-radius: 12px;
}

.gallery-title {
  color: #f8fafc;
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
}

.gallery-subtitle {
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 500;
}

.gallery-close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #94a3b8;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.gallery-close-btn:hover {
  background: #ef4444;
  color: #ffffff;
  transform: rotate(90deg);
}

.gallery-main-viewport {
  position: relative;
  width: 100%;
  height: 440px;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gallery-image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.gallery-main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  transition: transform 0.15s ease-out, transform-origin 0.1s ease-out;
  user-select: none;
}

.gallery-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(30, 41, 59, 0.75);
  backdrop-filter: blur(6px);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.8rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
}

.gallery-nav-btn.prev {
  left: 16px;
}

.gallery-nav-btn.next {
  right: 16px;
}

.gallery-nav-btn:hover {
  background: #3b82f6;
  border-color: #60a5fa;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
  transform: translateY(-50%) scale(1.1);
}

.gallery-thumbnails-strip {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: #0e1726;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  overflow-x: auto;
}

.gallery-thumb-btn {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 10px;
  border: 2px solid transparent;
  padding: 0;
  background: #1e293b;
  cursor: pointer;
  overflow: hidden;
  opacity: 0.6;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.gallery-thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-thumb-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.gallery-thumb-btn.active {
  opacity: 1;
  border-color: #3b82f6;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
  transform: scale(1.06);
}

.gallery-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1rem;
  gap: 12px;
}

.gallery-empty-state span {
  font-size: 3rem;
  opacity: 0.5;
}
</style>
