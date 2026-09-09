<template>
  <div class="dashboard-layout">
    <!-- Barra de navegacion lateral -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
        <span class="sidebar-brand-name">{{ authStore.user?.nombreEmpresa || 'VentasSaaS' }}</span>
      </div>
      <div class="user-info">
        <p class="user-name">Hola, {{ authStore.user?.nombre }}</p>
        <span class="user-badge">{{ authStore.rolEnEspanol }}</span>
      </div>
      <nav class="nav-links">
        <!-- SECCIÓN: ANÁLISIS -->
        <div class="nav-section-title">Análisis</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('dashboard')" to="/dashboard" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </svg>
          <span class="sidebar-text">Dashboard</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_negocio')" to="/business-history" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <span class="sidebar-text">Historial de Negocio</span>
        </router-link>

        <!-- SECCIÓN: VENTAS -->
        <div class="nav-section-title">Ventas</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('ventas')" to="/pos" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span class="sidebar-text">POS Ventas</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/sales-history" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span class="sidebar-text">Historial Ventas</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('cuentas_cobrar')" to="/credit-sales" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
          <span class="sidebar-text">Cuentas por Cobrar</span>
        </router-link>
        <router-link v-if="authStore.isSuperadmin || authStore.isEmpresaOwner || authStore.hasPermission('formas_pago')" to="/payment-methods" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
          <span class="sidebar-text">Formas de Pago</span>
        </router-link>

        <!-- SECCIÓN: LOGÍSTICA -->
        <div class="nav-section-title">Logística</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('productos')" to="/products" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <span class="sidebar-text">Inventario</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('categorias')" to="/categories" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="sidebar-text">Categorías</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('movimientos')" to="/stock-movements" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
          <span class="sidebar-text">Movimientos</span>
        </router-link>

        <!-- SECCIÓN: COMPRAS -->
        <div class="nav-section-title">Compras</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('proveedores')" to="/suppliers" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span class="sidebar-text">Proveedores</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('compras')" to="/purchases" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="sidebar-text">Compras</span>
        </router-link>

        <!-- SECCIÓN: GESTIÓN -->
        <div class="nav-section-title">Gestión</div>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('clientes')" to="/clients" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span class="sidebar-text">Clientes</span>
        </router-link>
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('reminders')" to="/reminders" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="sidebar-text">Recordatorios</span>
        </router-link>
        <router-link v-if="authStore.isSuperadmin || authStore.isEmpresaOwner || authStore.hasPermission('colaboradores')" to="/users" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <polyline points="16 11 18 13 22 9"></polyline>
          </svg>
          <span class="sidebar-text">Colaboradores</span>
        </router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span class="sidebar-text">Cerrar Sesión</span>
      </button>
    </aside>

    <!-- Area de contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div class="header-title-container">
            <div class="header-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div>
              <h1 class="text-title">Inventario de Productos</h1>
              <p class="text-subtitle">Gestión de catálogo, variantes agrupadas y control de existencias</p>
            </div>
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

          <button v-if="authStore.hasPermission('modificar_productos')" @click="openAddModal" class="btn-primary-action">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Nuevo Producto</span>
          </button>
        </div>
      </header>

      <!-- Seccion de filtros de busqueda -->
      <div class="table-filters card">
        <div class="filter-input-wrap">
          <svg class="search-icon-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, código, modelo o color..." class="filter-input" />
        </div>

        <select v-model="selectedCategory" class="filter-select">
          <option value="">Todas las Categorías</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
        </select>

        <!-- Selector de Vista: Agrupado por Modelo vs Lista Completa -->
        <div class="view-mode-pill-group">
          <button 
            type="button" 
            :class="['btn-view-pill', viewMode === 'grouped' ? 'active' : '']"
            @click="viewMode = 'grouped'"
            title="Agrupar variantes por modelo">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Por Modelo
          </button>
          <button 
            type="button" 
            :class="['btn-view-pill', viewMode === 'flat' ? 'active' : '']"
            @click="viewMode = 'flat'"
            title="Ver lista plana individual">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Lista Plana
          </button>
        </div>

        <button 
          v-if="viewMode === 'grouped'" 
          type="button" 
          class="btn-expand-all-pill"
          @click="toggleAllExpand"
          title="Expandir o colapsar todos los modelos">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline :points="areAllExpanded ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"></polyline>
          </svg>
          {{ areAllExpanded ? 'Colapsar Todo' : 'Expandir Todo' }}
        </button>
      </div>

      <!-- Tabla de inventario de productos -->
      <div class="card font-card">
        <div v-if="filteredProducts.length === 0" class="empty-state">
          No hay productos que coincidan con la búsqueda.
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th style="width: 65px;">N°</th>
              <th style="width: 135px;">Código</th>
              <th>Producto</th>
              <th style="width: 110px;">Costo</th>
              <th style="width: 125px;">Precio Venta</th>
              <th style="width: 125px;">Stock</th>
              <th style="width: 120px;">Estado</th>
              <th v-if="authStore.hasPermission('modificar_productos')" style="width: 95px;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- VISTA AGRUPADA POR MODELO (ACORDEÓN) -->
            <template v-if="viewMode === 'grouped'">
              <template v-for="(group, groupIndex) in groupedProductsList" :key="group.key">
                <!-- CASO 1: MODELO CON MÚLTIPLES VARIANTES -->
                <template v-if="group.isGroup && group.items.length > 1">
                  <!-- Fila Maestra / Cabecera del Modelo -->
                  <tr class="model-group-row" @click="toggleModelExpand(group.key)">
                    <td>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <button 
                          type="button" 
                          class="btn-expand-arrow" 
                          :class="{ 'expanded': isModelExpanded(group.key) }"
                          title="Abrir o cerrar variantes"
                          @click.stop="toggleModelExpand(group.key)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                        <strong>{{ groupIndex + 1 }}</strong>
                      </div>
                    </td>
                    <td>
                      <span class="model-code-badge" :title="`Modelo: ${group.codigoModelo}`">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                          <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        {{ group.codigoModelo }}
                      </span>
                    </td>
                    <td>
                      <div class="product-info-cell">
                        <img :src="group.imagenUrl || defaultImage" class="product-thumbnail" alt="thumbnail" @click.stop="openImageGallery(group.items[0])" />
                        <div>
                          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <strong style="font-size: 0.95rem;">{{ group.nombre }}</strong>
                            <span class="variants-count-pill">{{ group.items.length }} variantes</span>
                          </div>
                          <!-- Miniaturas con preview de colores disponibles -->
                          <div class="model-variants-preview" @click.stop>
                            <div 
                              v-for="v in group.previewImages" 
                              :key="v.id" 
                              class="mini-variant-dot"
                              :title="v.color ? `${v.color} (Stock: ${v.stock})` : `Stock: ${v.stock}`">
                              <img :src="v.img" alt="variante" />
                              <span v-if="v.color" class="mini-variant-color-label">
                                <span class="color-swatch-dot" :style="{ backgroundColor: getSwatchHex(v.color) }"></span>
                                {{ v.color }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span v-if="group.precioCostoMin === group.precioCostoMax">
                        S/. {{ group.precioCostoMin.toFixed(2) }}
                      </span>
                      <span v-else>
                        S/. {{ group.precioCostoMin.toFixed(2) }} - {{ group.precioCostoMax.toFixed(2) }}
                      </span>
                    </td>
                    <td>
                      <span v-if="group.precioMin === group.precioMax" style="font-weight: 600;">
                        S/. {{ group.precioMin.toFixed(2) }}
                      </span>
                      <span v-else style="font-weight: 600;">
                        S/. {{ group.precioMin.toFixed(2) }} - {{ group.precioMax.toFixed(2) }}
                      </span>
                    </td>
                    <td>
                      <span :class="['stock-badge', group.anyLowStock ? 'low' : 'ok']" style="font-weight: 600;">
                        {{ group.totalStock }} {{ group.unidadMedida }} (Total)
                      </span>
                    </td>
                    <td>
                      <span v-if="group.anyLowStock" class="status-pill warning">
                        <span class="status-dot"></span>Stock Bajo
                      </span>
                      <span v-else class="status-pill success">
                        <span class="status-dot"></span>Activo
                      </span>
                    </td>
                    <td v-if="authStore.hasPermission('modificar_productos')">
                      <button 
                        type="button" 
                        class="btn-toggle-subtable" 
                        @click.stop="toggleModelExpand(group.key)">
                        <span>{{ isModelExpanded(group.key) ? 'Ocultar' : 'Ver (' + group.items.length + ')' }}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="subtable-chevron" :class="{ 'open': isModelExpanded(group.key) }">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                    </td>
                  </tr>

                  <!-- Subfilas Desplegadas con Sangría de cada Variante -->
                  <template v-if="isModelExpanded(group.key)">
                    <tr v-for="(item, vIdx) in group.items" :key="item.id" class="variant-sub-row">
                      <td class="sub-index-cell">
                        <span class="tree-connector">↳</span> {{ groupIndex + 1 }}.{{ vIdx + 1 }}
                      </td>
                      <td>
                        <code>{{ item.codigoBarras }}</code>
                      </td>
                      <td>
                        <div class="product-info-cell pl-variant">
                          <img :src="item.imagenUrl || defaultImage" class="product-thumbnail sm" alt="thumbnail" @click="openImageGallery(item)" />
                          <div>
                            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                              <span v-if="getProductColor(item)" class="color-attribute-tag">
                                <span class="color-swatch-dot" :style="{ backgroundColor: getSwatchHex(getProductColor(item)) }"></span>
                                {{ getProductColor(item) }}
                              </span>
                              <span style="font-size: 0.9rem; color: var(--text-primary);">{{ item.nombre }}</span>
                            </div>
                            <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px;">
                              Código SKU: {{ item.codigoBarras }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>S/. {{ item.precioCosto.toFixed(2) }}</td>
                      <td>
                        <span v-if="item.precioOferta > 0" style="text-decoration: line-through; color: #a0aec0; font-size: 0.8em; display: block;">
                          S/. {{ item.precio.toFixed(2) }}
                        </span>
                        <span :style="{ color: item.precioOferta > 0 ? '#10b981' : 'inherit', fontWeight: item.precioOferta > 0 ? '600' : 'normal' }">
                          S/. {{ item.precioOferta > 0 ? item.precioOferta.toFixed(2) : item.precio.toFixed(2) }}
                        </span>
                      </td>
                      <td>
                        <span :class="['stock-badge', item.stock <= item.stockMinimo ? 'low' : 'ok']">
                          {{ Number(item.stock).toFixed(0) }} {{ item.unidadMedida }}
                        </span>
                      </td>
                      <td>
                        <span v-if="item.stock <= item.stockMinimo" class="status-pill warning">
                          <span class="status-dot"></span>Stock Bajo
                        </span>
                        <span v-else class="status-pill success">
                          <span class="status-dot"></span>Activo
                        </span>
                      </td>
                      <td v-if="authStore.hasPermission('modificar_productos')">
                        <div class="actions-cell">
                          <button @click="openEditModal(item)" class="btn-action-icon edit" title="Editar Variante">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button @click="confirmDelete(item.id)" class="btn-action-icon delete" title="Eliminar Variante">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </template>
                </template>

                <!-- CASO 2: PRODUCTO INDIVIDUAL DIRECTO (SIN MÚLTIPLES VARIANTES) -->
                <template v-else>
                  <tr v-for="prod in group.items" :key="prod.id" class="standalone-row">
                    <td><strong>{{ groupIndex + 1 }}</strong></td>
                    <td>
                      <code>{{ prod.codigoBarras }}</code>
                      <span v-if="prod.codigoModelo" class="single-model-tag" :title="`Modelo: ${prod.codigoModelo}`">
                        {{ prod.codigoModelo }}
                      </span>
                    </td>
                    <td>
                      <div class="product-info-cell" style="cursor: pointer;" @click="openImageGallery(prod)">
                        <img :src="prod.imagenUrl || defaultImage" class="product-thumbnail" alt="thumbnail" />
                        <div>
                          <strong>{{ prod.nombre }}</strong>
                          <div v-if="getProductColor(prod)" style="margin-top: 2px;">
                            <span class="color-attribute-tag">
                              <span class="color-swatch-dot" :style="{ backgroundColor: getSwatchHex(getProductColor(prod)) }"></span>
                              {{ getProductColor(prod) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>S/. {{ prod.precioCosto.toFixed(2) }}</td>
                    <td>
                      <span v-if="prod.precioOferta > 0" style="text-decoration: line-through; color: #a0aec0; font-size: 0.85em; display: block; margin-bottom: 2px;">
                        S/. {{ prod.precio.toFixed(2) }}
                      </span>
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
                      <span v-if="prod.stock <= prod.stockMinimo" class="status-pill warning">
                        <span class="status-dot"></span>Stock Bajo
                      </span>
                      <span v-else class="status-pill success">
                        <span class="status-dot"></span>Activo
                      </span>
                    </td>
                    <td v-if="authStore.hasPermission('modificar_productos')">
                      <div class="actions-cell">
                        <button @click="openEditModal(prod)" class="btn-action-icon edit" title="Editar">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button @click="confirmDelete(prod.id)" class="btn-action-icon delete" title="Eliminar">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </template>
              </template>
            </template>

            <!-- VISTA PLANA TRADICIONAL -->
            <template v-else>
              <tr v-for="(prod, index) in filteredProducts" :key="prod.id">
                <td><strong>{{ index + 1 }}</strong></td>
                <td><code>{{ prod.codigoBarras }}</code></td>
                <td>
                  <div class="product-info-cell" style="cursor: pointer;" @click="openImageGallery(prod)">
                    <img :src="prod.imagenUrl || defaultImage" class="product-thumbnail" alt="thumbnail" />
                    <div>
                      <strong>{{ prod.nombre }}</strong>
                      <div v-if="getProductColor(prod)" style="margin-top: 2px;">
                        <span class="color-attribute-tag">
                          <span class="color-swatch-dot" :style="{ backgroundColor: getSwatchHex(getProductColor(prod)) }"></span>
                          {{ getProductColor(prod) }}
                        </span>
                      </div>
                    </div>
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
                  <span v-if="prod.stock <= prod.stockMinimo" class="status-pill warning">
                    <span class="status-dot"></span>Stock Bajo
                  </span>
                  <span v-else class="status-pill success">
                    <span class="status-dot"></span>Activo
                  </span>
                </td>
                <td v-if="authStore.hasPermission('modificar_productos')">
                  <div class="actions-cell">
                    <button @click="openEditModal(prod)" class="btn-action-icon edit" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button @click="confirmDelete(prod.id)" class="btn-action-icon delete" title="Eliminar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Modal para el registro/edicion de productos -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title" style="margin-bottom: 16px; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
            <svg v-if="isEdit" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #2563eb;">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #2563eb;">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>{{ isEdit ? 'Editar Producto' : 'Registrar Nuevo Producto' }}</span>
          </h2>
          <form @submit.prevent="saveProduct" class="compact-form">
            <div style="display: grid; grid-template-columns: 1.55fr 1.45fr; gap: 20px; margin-bottom: 16px;">
              <!-- COLUMNA IZQUIERDA: Datos Básicos -->
              <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px;">
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
              <div class="field">
                <label>Marca (Opcional)</label>
                <select v-model="form.marcaId">
                  <option value="">Ninguna</option>
                  <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.nombre }}</option>
                </select>
              </div>
            </div>

            <!-- FILA 2: Código/SKU, Modelo y Tipo de Producto -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 12px; align-items: end;">
              <div class="field">
                <label>Código de Barra / SKU</label>
                <input v-model="form.codigoBarras" type="text" placeholder="7501234567" required />
              </div>
              <div class="field">
                <label>Agrupador (Modelo)</label>
                <input v-model="form.codigoModelo" @blur="handleCodigoModeloBlur" type="text" placeholder="Ej. CASIO-VINT" />
              </div>
              <div class="field">
                <label>Tipo de Producto</label>
                <div class="tipo-selector-horizontal">
                  <button type="button"
                    v-for="tipo in tiposProducto" :key="tipo.valor"
                    :class="['tipo-btn-pill', form.tipoProducto === tipo.valor ? 'active' : '']"
                    :title="tipo.descripcion"
                    @click="selectTipo(tipo.valor)">
                    <svg v-if="tipo.valor === 'Unidad'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <svg v-else-if="tipo.valor === 'Costal'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
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
                  <input v-model.number="form.stock" type="number" step="0.1" min="0" required />
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
                  <input v-model.number="form.stock" type="number" step="1" min="0" required />
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

            </div>

            <!-- COLUMNA DERECHA: Especificaciones -->
            <div>
              <div class="specifications-panel">
                <div class="specifications-header">
                  <div class="specifications-header-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #2563eb; flex-shrink: 0;"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    <span>Especificaciones</span>
                  </div>
                  <span v-if="form.atributos.length > 0" class="spec-counter-badge" :title="`${form.atributos.filter(a => a.valor).length} de ${form.atributos.length} especificadas`">
                    {{ form.atributos.filter(a => a.valor).length }}/{{ form.atributos.length }}
                  </span>
                </div>
                
                <div v-if="form.atributos.length === 0" class="specifications-empty">
                  Cargando especificaciones...
                </div>
                
                <div v-else class="specifications-list">
                  <div v-for="(attr, idx) in form.atributos" :key="idx" class="spec-inline-row">
                    <label class="spec-inline-label" :title="attr.nombre">{{ attr.nombre }}</label>
                    <select v-model="attr.valor" :class="['spec-inline-select', attr.valor ? 'has-value' : '']">
                      <option value="">No aplica / En blanco</option>
                      <template v-for="type in attributeTypes" :key="'opt-'+type.id">
                        <template v-if="type.nombre === attr.nombre">
                          <option v-for="opt in type.opciones" :key="opt" :value="opt">{{ opt }}</option>
                        </template>
                      </template>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FILA INFERIOR: Subida de imágenes múltiples -->
          <div style="background-color: #f8fafc; border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 500; color: #475569; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; color: #64748b;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                Imágenes del Producto (máx. 5 imágenes, 1MB c/u - Optimizado para SEO)
              </div>
              
              <!-- Botón de subida -->
              <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 12px;">
                <label class="btn btn-secondary-compact" style="cursor: pointer; margin: 0; display: inline-flex; align-items: center; gap: 6px;">
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple @change="handleImageUpload" style="display: none;" :disabled="uploadingImage || form.imagenes.length >= 5" />
                  <svg v-if="uploadingImage" class="spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  <span>{{ uploadingImage ? 'Subiendo...' : 'Seleccionar imágenes' }}</span>
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

    <!-- Modal Studio Lightbox & Inspector de Producto Premium -->
    <div v-if="showGalleryModal" class="studio-modal-overlay" @click.self="closeGalleryModal">
      <div class="studio-modal-card" role="dialog" aria-modal="true">
        <!-- COLUMNA IZQUIERDA: Escenario Studio & Galería Interactiva -->
        <div class="studio-viewport-column">
          <!-- Top Floating Bar: Badges y Contador -->
          <div class="studio-floating-topbar">
            <span class="studio-image-counter">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Foto {{ activeImageIndex + 1 }} de {{ galleryImages.length || 1 }}
            </span>
            <span v-if="selectedGalleryProduct?.codigoModelo" class="studio-model-chip">
              Modelo {{ selectedGalleryProduct.codigoModelo }}
            </span>
          </div>

          <!-- Escenario Principal con Vitrina Studio -->
          <div class="studio-stage-frame">
            <div v-if="galleryImages.length === 0" class="studio-empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p>Sin fotografía registrada</p>
            </div>
            <template v-else>
              <!-- Flecha Anterior -->
              <button 
                v-if="galleryImages.length > 1" 
                @click="prevGalleryImage" 
                class="studio-arrow-btn prev" 
                title="Foto anterior (←)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <!-- Tarjeta Vitrina de la Imagen -->
              <div 
                class="studio-vitrine-card"
                @mousemove="handleGalleryMouseMove"
                @mouseleave="handleGalleryMouseLeave">
                <img 
                  :src="galleryImages[activeImageIndex]" 
                  :alt="selectedGalleryProduct?.nombre"
                  class="studio-product-img" 
                  :style="galleryZoomStyle"
                />
              </div>

              <!-- Flecha Siguiente -->
              <button 
                v-if="galleryImages.length > 1" 
                @click="nextGalleryImage" 
                class="studio-arrow-btn next" 
                title="Siguiente foto (→)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </template>
          </div>

          <!-- Zoom Hint flotante inferior -->
          <div class="studio-zoom-hint" v-if="galleryImages.length > 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            Desplaza el cursor para explorar con zoom
          </div>

          <!-- Tira de Miniaturas (Thumbnails) -->
          <div v-if="galleryImages.length > 1" class="studio-thumbnails-carousel">
            <button
              v-for="(img, idx) in galleryImages"
              :key="idx"
              :class="['studio-thumb-item', activeImageIndex === idx ? 'active' : '']"
              @click="activeImageIndex = idx">
              <img :src="img" :alt="'Miniatura ' + (idx + 1)" />
            </button>
          </div>
        </div>

        <!-- COLUMNA DERECHA: Ficha de Inspección Rápida de Producto -->
        <div class="studio-details-column">
          <!-- Header de Ficha -->
          <div class="studio-details-header">
            <div class="studio-badge-row">
              <span v-if="selectedProductCategory" class="studio-category-pill">
                {{ selectedProductCategory }}
              </span>
              <span v-if="selectedGalleryProduct?.codigoModelo" class="studio-model-tag">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                {{ selectedGalleryProduct.codigoModelo }}
              </span>
            </div>
            <button @click="closeGalleryModal" class="studio-close-btn" title="Cerrar visor (Esc)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Título y SKU -->
          <h2 class="studio-product-title">{{ selectedGalleryProduct?.nombre || 'Producto' }}</h2>

          <div class="studio-sku-box" @click="copyGallerySku(selectedGalleryProduct?.codigoBarras)" :title="'Copiar ' + (selectedGalleryProduct?.codigoBarras || '')">
            <div class="studio-sku-info">
              <span class="studio-sku-label">SKU / CÓDIGO BARRAS</span>
              <span class="studio-sku-value">{{ selectedGalleryProduct?.codigoBarras || 'N/A' }}</span>
            </div>
            <button type="button" class="studio-copy-btn">
              <template v-if="copiedSku">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span style="color: #10b981;">¡Copiado!</span>
              </template>
              <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copiar</span>
              </template>
            </button>
          </div>

          <!-- Bloque de Precio y Stock -->
          <div class="studio-metrics-card">
            <div class="studio-price-block">
              <span class="studio-metric-label">Precio de Venta</span>
              <div class="studio-price-row">
                <span class="studio-main-price">
                  S/. {{ (selectedGalleryProduct?.precioOferta > 0 ? selectedGalleryProduct.precioOferta : selectedGalleryProduct?.precio || 0).toFixed(2) }}
                </span>
                <span v-if="selectedGalleryProduct?.precioOferta > 0" class="studio-old-price">
                  S/. {{ Number(selectedGalleryProduct.precio).toFixed(2) }}
                </span>
              </div>
              <div v-if="selectedGalleryProduct?.precioCosto > 0" class="studio-cost-subtext">
                Costo: S/. {{ Number(selectedGalleryProduct.precioCosto).toFixed(2) }} 
                <span class="studio-margin-badge">
                  +{{ Math.max(0, Math.round(((selectedGalleryProduct.precio - selectedGalleryProduct.precioCosto) / (selectedGalleryProduct.precio || 1)) * 100)) }}% margen
                </span>
              </div>
            </div>

            <div class="studio-stock-block">
              <span class="studio-metric-label">Disponibilidad en Almacén</span>
              <div :class="['studio-stock-pill', (selectedGalleryProduct?.stock <= selectedGalleryProduct?.stockMinimo) ? 'low' : 'ok']">
                <span class="studio-stock-dot"></span>
                <span class="studio-stock-text">
                  {{ Number(selectedGalleryProduct?.stock || 0).toFixed(0) }} {{ selectedGalleryProduct?.unidadMedida || 'unidades' }}
                </span>
              </div>
              <span class="studio-stock-min-hint">Mínimo sugerido: {{ selectedGalleryProduct?.stockMinimo || 5 }}</span>
            </div>
          </div>

          <!-- Selector Rápido de Variantes del Mismo Modelo (Si existen) -->
          <div v-if="galleryModelVariants.length > 1" class="studio-variants-section">
            <div class="studio-section-subtitle">
              <span>Variantes de este modelo</span>
              <span class="studio-variants-count">({{ galleryModelVariants.length }})</span>
            </div>
            <div class="studio-variants-grid">
              <button
                v-for="v in galleryModelVariants"
                :key="v.id"
                type="button"
                :class="['studio-variant-chip', v.id === selectedGalleryProduct?.id ? 'selected' : '']"
                @click="selectGalleryVariant(v)">
                <img :src="v.imagenUrl || (v.imagenes && v.imagenes[0]) || defaultImage" class="studio-variant-thumb" alt="" />
                <div class="studio-variant-info">
                  <span class="studio-variant-color">
                    <span class="color-swatch-dot" :style="{ backgroundColor: getSwatchHex(getProductColor(v)) }"></span>
                    {{ getProductColor(v) || v.codigoBarras }}
                  </span>
                  <span class="studio-variant-stock">{{ v.stock }} un.</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Ficha Técnica / Especificaciones (Atributos) -->
          <div v-if="formattedGalleryAttributes.length > 0" class="studio-specs-section">
            <div class="studio-section-subtitle">Especificaciones</div>
            <div class="studio-specs-grid">
              <div v-for="(attr, aIdx) in formattedGalleryAttributes" :key="aIdx" class="studio-spec-item">
                <span class="spec-key">{{ attr.nombre }}</span>
                <span class="spec-val">{{ attr.valor }}</span>
              </div>
            </div>
          </div>

          <!-- Acciones en el pie del inspector -->
          <div class="studio-actions-footer">
            <button 
              v-if="authStore.hasPermission('modificar_productos')"
              type="button" 
              class="studio-btn-edit" 
              @click="editFromGallery">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>Editar Producto</span>
            </button>
            <button type="button" class="studio-btn-close-secondary" @click="closeGalleryModal">
              Cerrar visor
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
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
const copiedSku = ref(false);

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
  copiedSku.value = false;
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

const selectedProductCategory = computed(() => {
  if (!selectedGalleryProduct.value) return '';
  if (selectedGalleryProduct.value.categoriaNombre) return selectedGalleryProduct.value.categoriaNombre;
  const cat = categories.value.find(c => c.id === selectedGalleryProduct.value.categoriaId);
  return cat ? cat.nombre : '';
});

const galleryModelVariants = computed(() => {
  if (!selectedGalleryProduct.value?.codigoModelo) return [];
  const modelKey = selectedGalleryProduct.value.codigoModelo.trim().toUpperCase();
  return products.value.filter(p => (p.codigoModelo || '').trim().toUpperCase() === modelKey);
});

const formattedGalleryAttributes = computed(() => {
  if (!selectedGalleryProduct.value?.atributos) return [];
  const attrs = selectedGalleryProduct.value.atributos;
  if (!Array.isArray(attrs)) return [];
  return attrs
    .map(a => ({
      nombre: a.nombre || a.Nombre || '',
      valor: a.valor || a.Valor || ''
    }))
    .filter(a => a.nombre && a.valor && a.valor !== 'No aplica' && a.valor !== '-');
});

const copyGallerySku = (sku) => {
  if (!sku) return;
  navigator.clipboard.writeText(sku).then(() => {
    copiedSku.value = true;
    setTimeout(() => { copiedSku.value = false; }, 2000);
  }).catch(() => {});
};

const selectGalleryVariant = (variant) => {
  selectedGalleryProduct.value = variant;
  galleryImages.value = variant.imagenes && variant.imagenes.length > 0 ? variant.imagenes : (variant.imagenUrl ? [variant.imagenUrl] : []);
  activeImageIndex.value = 0;
};

const editFromGallery = () => {
  if (!selectedGalleryProduct.value) return;
  const prod = selectedGalleryProduct.value;
  closeGalleryModal();
  openEditModal(prod);
};

const handleGalleryKeydown = (e) => {
  if (!showGalleryModal.value) return;
  if (e.key === 'Escape') closeGalleryModal();
  if (e.key === 'ArrowRight') nextGalleryImage();
  if (e.key === 'ArrowLeft') prevGalleryImage();
};

const getSwatchHex = (colorName) => {
  if (!colorName) return '#94a3b8';
  const c = colorName.toLowerCase().trim();
  if (c.includes('azul') || c.includes('blue') || c.includes('navy')) return '#2563eb';
  if (c.includes('negro') || c.includes('black')) return '#1e293b';
  if (c.includes('plata') || c.includes('silver') || c.includes('acero') || c.includes('gris')) return '#94a3b8';
  if (c.includes('blanco') || c.includes('white')) return '#e2e8f0';
  if (c.includes('oro') || c.includes('dorado') || c.includes('gold') || c.includes('champagne')) return '#d97706';
  if (c.includes('rojo') || c.includes('red') || c.includes('granate') || c.includes('vino')) return '#dc2626';
  if (c.includes('verde') || c.includes('green') || c.includes('esmeralda')) return '#16a34a';
  if (c.includes('marron') || c.includes('marrón') || c.includes('cuero') || c.includes('cafe') || c.includes('café')) return '#854d0e';
  if (c.includes('rosa') || c.includes('rose') || c.includes('rosado')) return '#f43f5e';
  return '#64748b';
};
const isEdit = ref(false)
const currentProductId = ref(null)

const searchQuery = ref('')
const selectedCategory = ref('')
const productAnalysis = ref({})

const defaultImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'><rect width='100%25' height='100%25' fill='%23f1f5f9'/><path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='M11 11.5L5 17h14l-4.5-6-3.5 4.5z'/></svg>"

const viewMode = ref('grouped') // 'grouped' (acordeón) o 'flat' (lista plana)
const expandedModels = ref(new Set())

const isModelExpanded = (key) => {
  return expandedModels.value.has(key)
}

const toggleModelExpand = (key) => {
  const next = new Set(expandedModels.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  expandedModels.value = next
}

const areAllExpanded = computed(() => {
  const multiGroups = groupedProductsList.value.filter(g => g.isGroup && g.items.length > 1)
  if (multiGroups.length === 0) return false
  return multiGroups.every(g => expandedModels.value.has(g.key))
})

const toggleAllExpand = () => {
  const multiGroups = groupedProductsList.value.filter(g => g.isGroup && g.items.length > 1)
  if (areAllExpanded.value) {
    expandedModels.value = new Set()
  } else {
    expandedModels.value = new Set(multiGroups.map(g => g.key))
  }
}

const getProductColor = (prod) => {
  if (!prod.atributos || prod.atributos.length === 0) return ''
  const attr = prod.atributos.find(a => (a.nombre || a.Nombre)?.toLowerCase() === 'color')
  return attr ? (attr.valor || attr.Valor || '') : ''
}

const filteredProducts = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => {
    const matchesSearch = (p.nombre && p.nombre.toLowerCase().includes(q)) || 
                          (p.codigoBarras && p.codigoBarras.toLowerCase().includes(q)) ||
                          (p.codigoModelo && p.codigoModelo.toLowerCase().includes(q)) ||
                          (p.descripcion && p.descripcion.toLowerCase().includes(q)) ||
                          (p.atributos && p.atributos.some(a => a.valor && a.valor.toLowerCase().includes(q)))
    const matchesCategory = !selectedCategory.value || p.categoriaId === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const groupedProductsList = computed(() => {
  const groupsMap = new Map()
  const result = []

  filteredProducts.value.forEach(prod => {
    const rawModel = (prod.codigoModelo || '').trim()
    if (rawModel) {
      const key = rawModel.toUpperCase()
      if (!groupsMap.has(key)) {
        const groupObj = {
          isGroup: true,
          key,
          codigoModelo: prod.codigoModelo,
          nombre: prod.nombre,
          tipoProducto: prod.tipoProducto,
          unidadMedida: prod.unidadMedida,
          kilosPorCostal: prod.kilosPorCostal,
          esServicio: prod.esServicio,
          items: []
        }
        groupsMap.set(key, groupObj)
        result.push(groupObj)
      }
      groupsMap.get(key).items.push(prod)
    } else {
      result.push({
        isGroup: false,
        key: prod.id,
        items: [prod]
      })
    }
  })

  // Calcular métricas consolidadas por modelo
  result.forEach(group => {
    if (group.isGroup) {
      let totalStock = 0
      let minStockMinimo = Infinity
      let minCost = Infinity
      let maxCost = -Infinity
      let minPrice = Infinity
      let maxPrice = -Infinity
      let hasDiscount = false
      let anyLowStock = false

      group.items.forEach(item => {
        const s = Number(item.stock) || 0
        const sm = Number(item.stockMinimo) || 0
        const c = Number(item.precioCosto) || 0
        const p = Number(item.precio) || 0

        totalStock += s
        if (sm < minStockMinimo) minStockMinimo = sm
        if (c < minCost) minCost = c
        if (c > maxCost) maxCost = c
        if (p < minPrice) minPrice = p
        if (p > maxPrice) maxPrice = p
        if (item.precioOferta > 0) hasDiscount = true
        if (s <= sm) anyLowStock = true
      })

      group.totalStock = totalStock
      group.stockMinimo = minStockMinimo === Infinity ? 5 : minStockMinimo
      group.precioCostoMin = minCost === Infinity ? 0 : minCost
      group.precioCostoMax = maxCost === -Infinity ? 0 : maxCost
      group.precioMin = minPrice === Infinity ? 0 : minPrice
      group.precioMax = maxPrice === -Infinity ? 0 : maxPrice
      group.hasDiscount = hasDiscount
      group.anyLowStock = anyLowStock

      const itemWithImg = group.items.find(i => (i.imagenes && i.imagenes.length > 0) || i.imagenUrl)
      group.imagenUrl = itemWithImg
        ? (itemWithImg.imagenes?.[0] || itemWithImg.imagenUrl)
        : defaultImage

      group.previewImages = group.items
        .map(i => ({
          id: i.id,
          img: i.imagenes?.[0] || i.imagenUrl || defaultImage,
          color: getProductColor(i),
          stock: i.stock
        }))
        .filter(p => p.img)
        .slice(0, 6)
    }
  })

  return result
})

const uploadingImage = ref(false)

const form = reactive({
  nombre: '',
  codigoBarras: '',
  codigoModelo: '',
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
  { valor: 'Unidad',   label: 'Unidad',   descripcion: 'Se vende por unidades o piezas' },
  { valor: 'Costal',   label: 'Costal',   descripcion: 'Precio por kg suelto Y precio especial por costal completo' },
  { valor: 'Servicio', label: 'Servicio', descripcion: 'No descuenta inventario (ej: servicios, reparaciones)' },
]

// Autocompletar cuando se teclea un codigo de modelo que ya existe
const handleCodigoModeloBlur = () => {
  if (isEdit.value || !form.codigoModelo) return;
  const existing = products.value.find(p => p.codigoModelo === form.codigoModelo);
  if (existing) {
    form.nombre = existing.nombre;
    form.categoriaId = existing.categoriaId;
    form.marcaId = existing.marcaId;
    form.precioCosto = existing.precioCosto;
    form.precio = existing.precio;
    form.precioOferta = existing.precioOferta;
    form.stockMinimo = existing.stockMinimo;
    form.descripcion = existing.descripcion;
    form.tipoProducto = existing.tipoProducto;
    form.unidadMedida = existing.unidadMedida;
    form.esServicio = existing.esServicio;
    
    // Si tiene atributos, copiar todos excepto el color
    if (existing.atributos && existing.atributos.length > 0) {
      form.atributos = existing.atributos
        .filter(a => a.nombre.toLowerCase() !== 'color')
        .map(a => ({ ...a }));
    }
  }
};

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

// Inicializar atributos con valores en blanco por defecto
const initializeAttributes = (existingAttributes = []) => {
  if (!attributeTypes.value || attributeTypes.value.length === 0) return [];
  return attributeTypes.value.map(type => {
    const existing = existingAttributes.find(a => a.nombre === type.nombre);
    return {
      nombre: type.nombre,
      valor: existing ? existing.valor : ''
    };
  });
};

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
  form.codigoModelo = ''
  form.precioCosto = 0
  form.precio = 0
  form.stock = 0
  form.stockMinimo = 5
  form.descripcion = ''
  form.categoriaId = ''
  form.marcaId = ''
  form.imagenUrl = ''
  form.atributos = initializeAttributes([])
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
  form.codigoModelo = product.codigoModelo || ''
  form.precioCosto = product.precioCosto
  form.precio = product.precio
  form.descripcion = product.descripcion
  form.categoriaId = product.categoriaId
  form.marcaId = product.marcaId || ''
  form.imagenUrl = product.imagenUrl || ''
  form.atributos = initializeAttributes(product.atributos || [])
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

    // Fix empty marcaId parsing error in backend
    if (!payload.marcaId) {
      payload.marcaId = null
    }

    // Filtrar atributos vacíos antes de enviarlos al backend para mantener limpia la DB
    payload.atributos = payload.atributos.filter(a => a.valor && a.valor.trim() !== '')

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
    
    if (!res.ok) {
      let errorMsg = 'Error al guardar el producto.';
      try {
        const errData = await res.json();
        if (errData.errors) {
          const firstErrorKey = Object.keys(errData.errors)[0];
          errorMsg = errData.errors[firstErrorKey][0];
        } else if (errData.message) {
          errorMsg = errData.message;
        } else if (errData.title) {
          errorMsg = errData.title;
        }
      } catch (e) {
        // ignore
      }
      throw new Error(errorMsg);
    }
    
    showModal.value = false
    alert(isEdit.value ? '¡Producto actualizado con éxito!' : '¡Producto agregado al inventario con éxito!')
    fetchProducts()
  } catch (err) {
    alert(err.message || 'Error de conexión con el servidor.')
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

const brands = ref([])
const fetchBrands = async () => {
  try {
    const res = await fetch(`${API_URL}/api/brands`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    brands.value = await res.json()
  } catch (err) {
    console.error('Error fetching brands')
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
  fetchBrands()
  fetchAttributeTypes()
  fetchInventoryStats()
  window.addEventListener('keydown', handleGalleryKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGalleryKeydown)
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
  margin-bottom: 24px;
  text-align: left;
}

.header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.header-title-container {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon-box {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #2563eb;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.12);
  flex-shrink: 0;
}

.btn-primary-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary-action:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
}

.inventory-stats-card {
  display: flex;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 10px 22px;
  gap: 24px;
  box-shadow: var(--shadow-sm);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.stat-divider {
  width: 1px;
  background-color: var(--border-color);
}

.filter-input-wrap {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.search-icon-svg {
  position: absolute;
  left: 14px;
  color: #94a3b8;
  pointer-events: none;
  z-index: 2;
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
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

/* Status Pills Modernos */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.status-pill.success {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.status-pill.warning {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fde68a;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.color-swatch-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.btn-action-icon {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
  min-height: 32px !important;
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1;
}

.btn-action-icon svg {
  width: 15px !important;
  height: 15px !important;
  min-width: 15px !important;
  min-height: 15px !important;
  stroke: currentColor !important;
  stroke-width: 2 !important;
  fill: none !important;
  display: block !important;
  flex-shrink: 0 !important;
  pointer-events: none;
}

.btn-action-icon.edit {
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.btn-action-icon.edit:hover {
  background: #2563eb;
  color: #ffffff;
  border-color: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35);
}

.btn-action-icon.delete {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.btn-action-icon.delete:hover {
  background: #dc2626;
  color: #ffffff;
  border-color: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.35);
}

.subtable-chevron {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-block;
}

.subtable-chevron.open {
  transform: rotate(180deg);
}

/* Estilos para las ventanas modales y tarjetas de dialogo */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2vh 2vw;
}

.modal-card {
  width: 92%;
  max-width: 75%;
  max-height: 95vh;
  overflow-y: auto;
  background-color: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

/* ── Panel de Especificaciones Horizontal Compacto ── */
.specifications-panel {
  background-color: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 14px 14px 10px 14px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.specifications-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
}

.specifications-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-counter-badge {
  font-size: 0.7rem;
  font-weight: 600;
  background: #eff6ff;
  color: #2563eb;
  padding: 2px 8px;
  border-radius: 99px;
  border: 1px solid #bfdbfe;
}

.specifications-empty {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  padding: 20px 10px;
}

.specifications-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
}

.specifications-list::-webkit-scrollbar {
  width: 4px;
}

.specifications-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.specifications-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.spec-inline-row {
  display: grid;
  grid-template-columns: 130px 1fr;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.spec-inline-row:hover {
  border-color: #cbd5e1;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.spec-inline-label {
  font-size: 0.78rem !important;
  font-weight: 600 !important;
  color: #475569 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  margin: 0 !important;
  line-height: 1.2 !important;
  cursor: default;
}

.compact-form select.spec-inline-select,
.spec-inline-select {
  width: 100% !important;
  height: 31px !important;
  min-height: 31px !important;
  padding: 4px 8px !important;
  font-size: 0.82rem !important;
  border-radius: 5px !important;
  border: 1px solid #cbd5e1 !important;
  outline: none !important;
  background-color: #ffffff !important;
  color: #334155 !important;
  cursor: pointer !important;
  box-shadow: none !important;
  transition: border-color 0.15s, background-color 0.15s !important;
}

.compact-form select.spec-inline-select:focus,
.spec-inline-select:focus {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12) !important;
}

.compact-form select.spec-inline-select.has-value,
.spec-inline-select.has-value {
  border-color: #93c5fd !important;
  background-color: #eff6ff !important;
  color: #1d4ed8 !important;
  font-weight: 500 !important;
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

/* ── Modal Studio Lightbox & Inspector de Producto Premium ── */
.studio-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 15, 29, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 24px;
  animation: studioFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes studioFadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.studio-modal-card {
  width: 100%;
  max-width: 1020px;
  max-height: 90vh;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
}

@media (max-width: 860px) {
  .studio-modal-card {
    grid-template-columns: 1fr;
    max-height: 94vh;
    overflow-y: auto;
  }
}

/* Columna Izquierda: Escenario Studio */
.studio-viewport-column {
  background: radial-gradient(circle at 50% 40%, #1e293b 0%, #0f172a 75%, #090d16 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  position: relative;
  user-select: none;
}

.studio-floating-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 5;
}

.studio-image-counter {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}

.studio-model-chip {
  background: rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
  font-size: 0.76rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}

/* Vitrina de exhibición del producto */
.studio-stage-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
  padding: 10px 0;
}

.studio-vitrine-card {
  width: 100%;
  max-width: 320px;
  height: 350px;
  background: #ffffff;
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: zoom-in;
  transition: box-shadow 0.25s ease;
}

.studio-vitrine-card:hover {
  box-shadow: 0 20px 45px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(59, 130, 246, 0.4);
}

.studio-product-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.15s ease-out, transform-origin 0.1s ease-out;
}

.studio-arrow-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
}

.studio-arrow-btn.prev { left: 4px; }
.studio-arrow-btn.next { right: 4px; }

.studio-arrow-btn:hover {
  background: #2563eb;
  border-color: #60a5fa;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 0 16px rgba(37, 99, 235, 0.5);
}

.studio-zoom-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 500;
  margin-top: 6px;
}

.studio-thumbnails-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.studio-thumb-item {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: #ffffff;
  padding: 3px;
  cursor: pointer;
  overflow: hidden;
  opacity: 0.55;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.studio-thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.studio-thumb-item:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.studio-thumb-item.active {
  opacity: 1;
  border-color: #3b82f6;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
  transform: scale(1.06);
}

.studio-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  gap: 12px;
  min-height: 280px;
}

/* Columna Derecha: Ficha de Inspección */
.studio-details-column {
  background: #0f172a;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: #f8fafc;
}

.studio-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.studio-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.studio-category-pill {
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.studio-model-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(37, 99, 235, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 6px;
}

.studio-close-btn {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #94a3b8;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.studio-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  transform: rotate(90deg);
}

.studio-product-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
  line-height: 1.35;
  margin: 0 0 12px 0;
}

/* SKU Copy Box */
.studio-sku-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.studio-sku-box:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.15);
}

.studio-sku-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.studio-sku-label {
  font-size: 0.65rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.studio-sku-value {
  font-family: monospace;
  font-size: 0.88rem;
  color: #e2e8f0;
  font-weight: 600;
}

.studio-copy-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

/* Métricas de Precio y Stock */
.studio-metrics-card {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 18px;
}

.studio-metric-label {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.studio-price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.studio-main-price {
  font-size: 1.45rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.studio-old-price {
  font-size: 0.85rem;
  color: #64748b;
  text-decoration: line-through;
}

.studio-cost-subtext {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.studio-margin-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.studio-stock-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  margin-top: 2px;
}

.studio-stock-pill.ok {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.studio-stock-pill.low {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.studio-stock-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
  animation: studioPulse 2s infinite ease-in-out;
}

@keyframes studioPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.studio-stock-min-hint {
  display: block;
  font-size: 0.68rem;
  color: #64748b;
  margin-top: 4px;
}

/* Selector de Variantes del Modelo */
.studio-variants-section {
  margin-bottom: 18px;
}

.studio-section-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.studio-variants-count {
  color: #60a5fa;
}

.studio-variants-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.studio-variant-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 5px 10px 5px 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #e2e8f0;
}

.studio-variant-chip:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.studio-variant-chip.selected {
  background: rgba(37, 99, 235, 0.2);
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.studio-variant-thumb {
  width: 24px;
  height: 28px;
  object-fit: contain;
  background: #ffffff;
  border-radius: 4px;
  padding: 1px;
}

.studio-variant-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.studio-variant-color {
  font-size: 0.78rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}

.studio-variant-stock {
  font-size: 0.65rem;
  color: #64748b;
}

/* Ficha Técnica / Especificaciones */
.studio-specs-section {
  margin-bottom: 20px;
}

.studio-specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.studio-spec-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 7px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.studio-spec-item .spec-key {
  font-size: 0.65rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}

.studio-spec-item .spec-val {
  font-size: 0.8rem;
  color: #e2e8f0;
  font-weight: 500;
}

/* Acciones Footer */
.studio-actions-footer {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  gap: 10px;
  align-items: center;
}

.studio-btn-edit {
  flex-grow: 1;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  transition: all 0.2s ease;
}

.studio-btn-edit:hover {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
}

.studio-btn-close-secondary {
  background: rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.studio-btn-close-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

/* ========================================================
   ESTILOS DE AGRUPACIÓN POR MODELO (ACORDEÓN DE INVENTARIO)
   ======================================================== */
.view-mode-pill-group {
  display: flex;
  background-color: var(--bg-app, #f1f5f9);
  padding: 3px;
  border-radius: 8px;
  border: 1px solid var(--border-color, #e2e8f0);
}

.btn-view-pill {
  padding: 6px 12px;
  border: none;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-muted, #64748b);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-view-pill.active {
  background: #ffffff;
  color: #2563eb;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-expand-all-pill {
  padding: 6px 12px;
  border: 1px solid var(--border-color, #cbd5e1);
  background: #ffffff;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-expand-all-pill:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

/* Fila de Cabecera del Modelo (Padre) */
.model-group-row {
  background-color: #f8fafc !important;
  border-top: 2px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.model-group-row:hover {
  background-color: #f1f5f9 !important;
}

.btn-expand-arrow {
  background: transparent;
  border: none;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  border-radius: 4px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s;
}

.btn-expand-arrow.expanded {
  transform: rotate(90deg);
  color: #2563eb;
}

.model-code-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.single-model-tag {
  display: inline-block;
  background: #f1f5f9;
  color: #475569;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  margin-left: 6px;
}

.variants-count-pill {
  background: #e0e7ff;
  color: #4338ca;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 12px;
}

.model-variants-preview {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.mini-variant-dot {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 2px 6px 2px 2px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  font-size: 0.7rem;
}

.mini-variant-dot img {
  width: 18px;
  height: 24px;
  object-fit: cover;
  border-radius: 4px;
}

.mini-variant-color-label {
  color: #334155;
  font-weight: 500;
}

.btn-toggle-subtable {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-toggle-subtable:hover {
  background: #eff6ff;
  border-color: #93c5fd;
}

/* Sub-filas de Variantes Indentadas */
.variant-sub-row {
  background-color: #ffffff;
  border-left: 3px solid #3b82f6;
  transition: background-color 0.15s ease;
}

.variant-sub-row:hover {
  background-color: #f8fafc;
}

.sub-index-cell {
  color: #64748b;
  font-size: 0.8rem;
  padding-left: 18px !important;
}

.tree-connector {
  color: #94a3b8;
  font-weight: bold;
  margin-right: 4px;
}

.product-thumbnail.sm {
  width: 38px;
  height: 50px;
}

.pl-variant {
  padding-left: 6px;
}

.color-attribute-tag {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.standalone-row:hover {
  background-color: #f8fafc;
}
</style>
