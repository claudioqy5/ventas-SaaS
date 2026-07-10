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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('historial_ventas')" to="/credit-sales" class="nav-item" active-class="active">📒 <span class="sidebar-text">Cuentas por Cobrar</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/payment-methods" class="nav-item" active-class="active">💳 <span class="sidebar-text">Formas de Pago</span></router-link>

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
        <router-link v-if="!authStore.isSuperadmin" to="/reminders" class="nav-item" active-class="active">📅 <span class="sidebar-text">Recordatorios</span></router-link>
        <router-link v-if="authStore.isEmpresaOwner || authStore.isSuperadmin" to="/users" class="nav-item" active-class="active">👥 <span class="sidebar-text">Colaboradores</span></router-link>
      </nav>
      <button @click="handleLogout" class="btn btn-danger w-full logout-btn">🚪 <span class="sidebar-text">Cerrar Sesión</span></button>
    </aside>

    <!-- Area de contenido principal -->
    <main class="main-content">
      <header class="content-header">
        <div class="header-flex">
          <div>
            <h1 class="text-title">👥 Gestión de Clientes</h1>
            <p class="text-subtitle">Registra, edita y analiza el comportamiento de tus clientes</p>
          </div>
          <button v-if="activeTab === 'directorio'" @click="openCreateModal" class="btn btn-primary">➕ Agregar Cliente</button>
        </div>
      </header>

      <!-- Sistema de Tabs -->
      <div class="tabs-nav">
        <button :class="['tab-btn', activeTab === 'directorio' ? 'active' : '']" @click="activeTab = 'directorio'">📝 Directorio</button>
        <button :class="['tab-btn', activeTab === 'top' ? 'active' : '']" @click="switchToTop">🏆 Top Clientes</button>
      </div>

      <!-- ══════════ TAB: DIRECTORIO ══════════ -->
      <template v-if="activeTab === 'directorio'">
        <!-- Seccion de filtros de busqueda -->
        <div class="table-filters card">
          <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, documento, correo o teléfono..." class="filter-input" />
        </div>

        <!-- Tabla de datos principal -->
        <div class="card font-card">
          <div v-if="filteredClients.length === 0" class="empty-state">
            No se encontraron clientes que coincidan con la búsqueda.
          </div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th style="width: 50px;">N°</th>
                <th>Nombre</th>
                <th>Documento (DNI/RUC)</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(client, index) in filteredClients" :key="client.id">
                <td><strong>{{ index + 1 }}</strong></td>
                <td><strong>{{ client.nombre }}</strong></td>
                <td><code>{{ client.numeroDocumento || 'N/A' }}</code></td>
                <td>{{ client.telefono || 'N/A' }}</td>
                <td>{{ client.correo || 'N/A' }}</td>
                <td>{{ client.direccion || 'N/A' }}</td>
                <td>
                  <div class="actions-cell">
                    <button @click="openEditModal(client)" class="btn-action edit" title="Editar">✏️</button>
                    <button @click="confirmDelete(client.id)" class="btn-action delete" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ══════════ TAB: TOP CLIENTES ══════════ -->
      <template v-else-if="activeTab === 'top'">

        <!-- Alerta de clientes inactivos -->
        <div v-if="clientesInactivos.length > 0" class="inactivos-alert card">
          <div class="inactivos-header">
            <span class="inactivos-icon">🔔</span>
            <div>
              <h3 class="inactivos-title">¡Clientes Inactivos Detectados!</h3>
              <p class="inactivos-sub">{{ clientesInactivos.length }} cliente(s) no han comprado en más de 30 días. Envíales un mensaje de reactivación.</p>
            </div>
          </div>
          <div class="inactivos-list">
            <div v-for="cli in clientesInactivos" :key="cli.clienteId" class="inactivo-chip">
              <div class="inactivo-avatar">{{ cli.nombre?.charAt(0).toUpperCase() }}</div>
              <div class="inactivo-info">
                <span class="inactivo-name">{{ cli.nombre }}</span>
                <span class="inactivo-days">🕒 Hace {{ cli.diasDesdeUltimaCompra }} días</span>
              </div>
              <a v-if="cli.telefono" :href="buildWhatsappReactivacion(cli)" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-sm">📱 Reactivar</a>
            </div>
          </div>
        </div>

        <!-- Estado cargando o sin datos -->
        <div v-if="loadingTop" class="empty-state card">Calculando estadísticas…</div>
        <div v-else-if="topClientes.length === 0" class="empty-state card">
          📊 Aún no hay suficientes datos de compras vinculadas a clientes. Selecciona un cliente en el POS al registrar ventas.
        </div>

        <!-- Buscador de Top Clientes -->
        <div v-if="!loadingTop && topClientes.length > 0" class="filters-container card" style="text-align: left; padding: 15px; margin-bottom: 20px;">
          <input v-model="topSearchQuery" type="text" placeholder="Buscar cliente en el ranking..." class="filter-input" />
        </div>

        <!-- Tabla Resumen de Top Clientes -->
        <div v-if="!loadingTop && topClientes.length > 0" class="card font-card">
          <div v-if="filteredTopClientes.length === 0" class="empty-state" style="padding: 24px;">
            No se encontraron clientes que coincidan con la búsqueda.
          </div>
          <table v-else class="data-table">
            <thead>
              <tr>
                <th style="width: 80px;">Posición</th>
                <th>Cliente</th>
                <th>Total Gastado</th>
                <th>Compras</th>
                <th>Última Compra</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cli in filteredTopClientes" :key="cli.clienteId" class="clickable-row" @click="openDetailModal(cli)" style="cursor: pointer;">
                <td>
                  <span :class="['rank-badge', 'rank-' + cli.originalRank]" style="font-weight: bold; font-size: 0.9rem;">
                    {{ cli.originalRank === 1 ? '🥇 1' : cli.originalRank === 2 ? '🥈 2' : cli.originalRank === 3 ? '🥉 3' : '#' + cli.originalRank }}
                  </span>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="top-avatar-sm">{{ cli.nombre?.charAt(0).toUpperCase() }}</div>
                    <div>
                      <strong>{{ cli.nombre }}</strong>
                      <div class="text-muted" style="font-size: 0.8rem; margin-top: 2px;">{{ cli.numeroDocumento || cli.correo || 'Sin documento' }}</div>
                    </div>
                  </div>
                </td>
                <td style="font-weight: 800; color: var(--text-main);">S/. {{ cli.totalGastado?.toFixed(2) }}</td>
                <td><strong>{{ cli.numCompras }}</strong> compras</td>
                <td>
                  <span :class="['status-badge', cli.inactivo ? 'disabled' : 'ok']">
                    Hace {{ cli.diasDesdeUltimaCompra }} días
                  </span>
                </td>
                <td>
                  <div class="actions-cell" @click.stop>
                    <button @click="openDetailModal(cli)" class="btn btn-primary btn-sm">🔍 Ver Análisis</button>
                    <a v-if="cli.telefono" :href="buildWhatsappPromo(cli)" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-sm">📱 WhatsApp</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal de Análisis Detallado de Cliente -->
        <div v-if="showDetailModal && selectedClient" class="modal-overlay">
          <div class="modal-card card detail-modal-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
              <h2 class="modal-title" style="margin-bottom: 0;">📊 Análisis de Cliente</h2>
              <button @click="showDetailModal = false" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); font-weight: bold;">&times;</button>
            </div>
            
            <div class="top-card-header" style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
              <div class="top-avatar">{{ selectedClient.nombre?.charAt(0).toUpperCase() }}</div>
              <div class="top-info" style="flex-grow: 1;">
                <h3 class="top-name" style="font-size: 1.2rem; font-weight: 700; color: var(--text-main);">{{ selectedClient.nombre }}</h3>
                <span class="top-doc" style="font-size: 0.85rem; color: var(--text-muted);">{{ selectedClient.numeroDocumento || selectedClient.correo || 'Sin documento' }}</span>
              </div>
              <div style="display: flex; gap: 8px; align-items: center;">
                <button @click="printCompleteClientReport" class="btn btn-primary" style="background-color: #6366f1; border: none; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 99px;">📥 Exportar Reporte</button>
                <a v-if="selectedClient.telefono" :href="buildWhatsappPromo(selectedClient)" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp-sm" style="margin-top: 0;">📱 Enviar Oferta</a>
              </div>
            </div>

            <!-- Métricas clave -->
            <div class="top-metrics" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; text-align: center; background: var(--bg-app); padding: 16px; border-radius: var(--radius-md);">
              <div class="metric" style="display: flex; flex-direction: column; gap: 4px;">
                <span class="metric-val" style="font-size: 1.2rem; font-weight: 800; color: var(--text-main);">S/. {{ selectedClient.totalGastado?.toFixed(2) }}</span>
                <span class="metric-lbl" style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Total Gastado</span>
              </div>
              <div class="metric" style="display: flex; flex-direction: column; gap: 4px; border-left: 1px solid var(--border-color); border-right: 1px solid var(--border-color);">
                <span class="metric-val" style="font-size: 1.2rem; font-weight: 800; color: var(--text-main);">{{ selectedClient.numCompras }}</span>
                <span class="metric-lbl" style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Compras</span>
              </div>
              <div class="metric" style="display: flex; flex-direction: column; gap: 4px;">
                <span class="metric-val" :class="selectedClient.inactivo ? 'val-danger' : 'val-ok'" style="font-size: 1.2rem; font-weight: 800;">Hace {{ selectedClient.diasDesdeUltimaCompra }}d</span>
                <span class="metric-lbl" style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Última compra</span>
              </div>
            </div>

            <!-- Panel de Análisis en 2 Columnas (Gráfico a la izquierda, Historial y Productos a la derecha) -->
            <div class="analysis-columns-grid" style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 20px; margin-bottom: 24px; align-items: start;">
              <!-- Columna Izquierda: Tendencia de Compras -->
              <div class="sparkline-wrapper" style="border: 1px solid var(--border-color); padding: 16px; border-radius: var(--radius-md);">
                <span class="sparkline-label" style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 12px;">📈 Tendencia de Compras (Últimos 6 meses)</span>
                <svg class="line-chart-svg" viewBox="0 0 500 150" style="width: 100%; height: 230px; background: transparent; overflow: visible;">
                  <defs>
                    <linearGradient :id="'sparkGrad-' + selectedClient.clienteId" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3" />
                      <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>
                  <!-- Grid Lines (Horizontal) -->
                  <line x1="60" y1="20" x2="480" y2="20" stroke="#f1f2f5" stroke-dasharray="4" />
                  <line x1="60" y1="70" x2="480" y2="70" stroke="#f1f2f5" stroke-dasharray="4" />
                  <line x1="60" y1="120" x2="480" y2="120" stroke="#e2e8f0" stroke-width="1.5" />

                  <!-- Y Axis Labels -->
                  <text x="50" y="24" text-anchor="end" style="font-size: 0.65rem; font-weight: 700; fill: var(--text-muted);">S/.{{ clientMaxVal(selectedClient.tendenciaMensual).toFixed(0) }}</text>
                  <text x="50" y="74" text-anchor="end" style="font-size: 0.65rem; font-weight: 700; fill: var(--text-muted);">S/.{{ (clientMaxVal(selectedClient.tendenciaMensual) / 2).toFixed(0) }}</text>
                  <text x="50" y="124" text-anchor="end" style="font-size: 0.65rem; font-weight: 700; fill: var(--text-muted);">S/.0</text>

                  <!-- Gradient Area Fill -->
                  <path
                    :d="buildClientChartPath(selectedClient.tendenciaMensual)"
                    :fill="'url(#sparkGrad-' + selectedClient.clienteId + ')'"
                  />
                  <!-- Trend Stroke Line -->
                  <path
                    :d="buildClientChartLine(selectedClient.tendenciaMensual)"
                    fill="none"
                    stroke="var(--primary-hover)"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <!-- Data Points (Circles with hover tooltips and selection highlight) -->
                  <circle
                    v-for="(pt, idx) in clientChartPoints(selectedClient.tendenciaMensual)"
                    :key="idx"
                    :cx="pt.x"
                    :cy="pt.y"
                    :r="selectedMonth?.mesNum === selectedClient.tendenciaMensual[idx].mesNum && selectedMonth?.anio === selectedClient.tendenciaMensual[idx].anio ? 6 : 4.5"
                    :fill="selectedMonth?.mesNum === selectedClient.tendenciaMensual[idx].mesNum && selectedMonth?.anio === selectedClient.tendenciaMensual[idx].anio ? '#4f46e5' : 'var(--primary-hover)'"
                    stroke="#ffffff"
                    :stroke-width="selectedMonth?.mesNum === selectedClient.tendenciaMensual[idx].mesNum && selectedMonth?.anio === selectedClient.tendenciaMensual[idx].anio ? 2.5 : 1.5"
                    style="cursor: pointer; transition: all 0.2s;"
                    @click="selectMonth(selectedClient.tendenciaMensual[idx])"
                  >
                    <title>{{ pt.mes }}: S/. {{ pt.val.toFixed(2) }} (Haz clic para ver compras)</title>
                  </circle>

                  <!-- X Axis Month Labels -->
                  <text
                    v-for="(pt, i) in clientChartPoints(selectedClient.tendenciaMensual)"
                    :key="'lbl-' + i"
                    :x="pt.x"
                    y="142"
                    text-anchor="middle"
                    :style="{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      fill: selectedMonth?.mesNum === selectedClient.tendenciaMensual[i].mesNum && selectedMonth?.anio === selectedClient.tendenciaMensual[i].anio ? '#4f46e5' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }"
                    @click="selectMonth(selectedClient.tendenciaMensual[i])"
                  >
                    {{ pt.mes }}
                  </text>
                </svg>
              </div>

              <!-- Columna Derecha: Historial Mensual y Top Productos -->
              <div style="display: flex; flex-direction: column; gap: 16px;">
                <!-- Listado de compras del mes seleccionado -->
                <div class="selected-month-sales" style="border: 1px solid var(--border-color); padding: 16px; border-radius: var(--radius-md); background: #fafafa; margin-bottom: 0;">
                  <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-main); margin-top: 0; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span>🛒 Compras de: <strong style="color: #4f46e5;">{{ selectedMonth?.mes }} {{ selectedMonth?.anio }}</strong></span>
                    <span class="badge badge-info" style="font-size: 0.72rem; background-color: #e0f2fe; color: #0369a1;">S/. {{ selectedMonth?.total.toFixed(2) }}</span>
                  </h4>

                  <div v-if="filteredSalesByMonth.length === 0" class="text-muted" style="text-align: center; padding: 24px; font-size: 0.85rem;">
                    No hay compras registradas en este mes.
                  </div>
                  <div v-else style="max-height: 260px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: #ffffff;">
                    <table class="data-table" style="font-size: 0.82rem; width: 100%;">
                      <thead>
                        <tr style="background: var(--bg-app);">
                          <th style="padding: 8px; text-align: left;">Fecha y Hora</th>
                          <th style="padding: 8px; text-align: right;">Total</th>
                          <th style="padding: 8px; text-align: center;">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="sale in filteredSalesByMonth" :key="sale.id" style="border-bottom: 1px solid var(--border-color);">
                          <td style="padding: 8px; text-align: left; font-size: 0.75rem;">{{ formatDate(sale.fechaCreacion) }}</td>
                          <td style="padding: 8px; text-align: right; font-weight: 700; color: var(--text-main);">S/. {{ sale.total.toFixed(2) }}</td>
                          <td style="padding: 8px; text-align: center;">
                            <button @click="openSaleDetail(sale)" class="btn btn-primary btn-sm" style="padding: 2px 6px; font-size: 0.7rem;">📄 Boleta</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Top productos de este cliente -->
                <div v-if="selectedClient.topProductos?.length > 0" class="top-products" style="margin-bottom: 0; padding-top: 12px; border-top: 1px dashed var(--border-color);">
                  <p class="top-products-title" style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); margin-bottom: 10px;">🛒 Productos más comprados históricamente:</p>
                  <div class="top-products-list" style="display: flex; flex-wrap: wrap; gap: 6px;">
                    <span v-for="(p, pi) in selectedClient.topProductos" :key="pi" class="product-chip" style="background: #e2e8f0; color: #1e293b; padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 600;">
                      {{ p.producto }} <strong style="color: #6366f1;">x{{ p.cantidad }}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-actions" style="display: flex; justify-content: flex-end; margin-top: 12px;">
              <button @click="showDetailModal = false" class="btn btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>

        <!-- Modal Anidado: Detalle de Boleta / Compra Completa -->
        <div v-if="showSaleDetailModal && selectedSale" class="modal-overlay" style="z-index: 1100; background-color: rgba(0, 0, 0, 0.45);">
          <div class="modal-card card" style="max-width: 500px; border-top: 4px solid var(--primary); text-align: left; padding: 24px; color: var(--text-main);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">
              <h3 style="font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--text-main);">📄 Detalles de Compra</h3>
              <button @click="showSaleDetailModal = false" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: var(--text-muted); font-weight: bold;">&times;</button>
            </div>

            <div style="font-size: 0.85rem; line-height: 1.6; color: var(--text-main); margin-bottom: 20px;">
              <p style="margin: 4px 0;"><strong>ID Venta:</strong> <code>{{ selectedSale.id }}</code></p>
              <p style="margin: 4px 0;"><strong>Fecha y Hora:</strong> {{ formatDate(selectedSale.fechaCreacion) }}</p>
              <p style="margin: 4px 0;"><strong>Atendido por:</strong> {{ selectedSale.creadoPorNombre }}</p>
              <p style="margin: 4px 0;"><strong>Método de Pago:</strong> <span class="badge badge-info">{{ selectedSale.metodoPago }}</span></p>
              <p style="margin: 4px 0;"><strong>Estado de Venta:</strong> <span class="badge badge-info" style="background-color: #e0f2fe; color: #0369a1;">{{ selectedSale.estadoPago }}</span></p>
            </div>

            <!-- Tabla de items comprados -->
            <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                <thead style="background: var(--bg-app); border-bottom: 1px solid var(--border-color);">
                  <tr>
                    <th style="padding: 8px; text-align: left; font-weight: 600; color: var(--text-muted);">Producto</th>
                    <th style="padding: 8px; text-align: center; width: 60px; font-weight: 600; color: var(--text-muted);">Cant.</th>
                    <th style="padding: 8px; text-align: right; width: 80px; font-weight: 600; color: var(--text-muted);">P. Unit.</th>
                    <th style="padding: 8px; text-align: right; width: 80px; font-weight: 600; color: var(--text-muted);">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in selectedSale.detalles" :key="idx" style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px; color: var(--text-main);">{{ item.nombreProducto }}</td>
                    <td style="padding: 8px; text-align: center; color: var(--text-main);">{{ item.cantidad }}</td>
                    <td style="padding: 8px; text-align: right; color: var(--text-main);">S/. {{ item.precioUnitario.toFixed(2) }}</td>
                    <td style="padding: 8px; text-align: right; font-weight: 700; color: var(--text-main);">S/. {{ (item.cantidad * item.precioUnitario).toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Cuentas finales -->
            <div style="display: flex; flex-direction: column; align-items: flex-end; font-size: 0.9rem; gap: 6px; margin-bottom: 24px; border-top: 1px dashed var(--border-color); padding-top: 12px;">
              <div style="display: flex; justify-content: space-between; width: 200px;">
                <span style="color: var(--text-muted);">Subtotal:</span>
                <span style="color: var(--text-main);">S/. {{ selectedSale.subtotal?.toFixed(2) || '0.00' }}</span>
              </div>
              <div style="display: flex; justify-content: space-between; width: 200px;">
                <span style="color: var(--text-muted);">IGV (19%):</span>
                <span style="color: var(--text-main);">S/. {{ selectedSale.impuesto?.toFixed(2) || '0.00' }}</span>
              </div>
              <div style="display: flex; justify-content: space-between; width: 200px; font-weight: bold; font-size: 1.05rem; color: var(--text-main);">
                <span>Total Compra:</span>
                <span>S/. {{ selectedSale.total?.toFixed(2) || '0.00' }}</span>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button @click="printSaleTicket(selectedSale)" class="btn btn-primary" style="background-color: #10b981; border: none; font-size: 0.8rem; font-weight: 700; padding: 8px 16px;">🖨️ Imprimir Ticket</button>
              <button @click="showSaleDetailModal = false" class="btn btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      </template>

      <!-- Formulario modal de creacion/edicion -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-card card">
          <h2 class="modal-title">{{ isEdit ? '✏️ Editar Cliente' : '👥 Registrar Cliente' }}</h2>
          <form @submit.prevent="saveClient" class="grid">
            <div class="grid grid-2">
              <div class="field">
                <label>Nombre Completo</label>
                <input v-model="form.nombre" type="text" placeholder="Ej. Juan Pérez" required />
              </div>
              <div class="field">
                <label>Documento de Identidad</label>
                <input v-model="form.numeroDocumento" type="text" placeholder="DNI, RUC, RUT, etc." />
              </div>
            </div>

            <div class="grid grid-2">
              <div class="field">
                <label>Teléfono de Contacto</label>
                <input v-model="form.telefono" type="text" placeholder="987654321" />
              </div>
              <div class="field">
                <label>Correo Electrónico</label>
                <input v-model="form.correo" type="email" placeholder="juan@correo.com" />
              </div>
            </div>

            <div class="field">
              <label>Dirección</label>
              <input v-model="form.direccion" type="text" placeholder="Calle Las Flores 123" />
            </div>

            <div class="modal-actions">
              <button type="button" @click="showModal = false" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? 'Guardar Cambios' : 'Registrar Cliente' }}</button>
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

const clients = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const currentId = ref(null)

const searchQuery = ref('')

const filteredClients = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return clients.value.filter(c => 
    (c.nombre && c.nombre.toLowerCase().includes(q)) ||
    (c.numeroDocumento && c.numeroDocumento.toLowerCase().includes(q)) ||
    (c.telefono && c.telefono.toLowerCase().includes(q)) ||
    (c.correo && c.correo.toLowerCase().includes(q))
  )
})

const form = reactive({
  nombre: '',
  numeroDocumento: '',
  telefono: '',
  correo: '',
  direccion: ''
})

const fetchClients = async () => {
  try {
    const res = await fetch(`${API_URL}/api/clients`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    clients.value = await res.json()
  } catch (err) {
    console.error('Error fetching clients')
  }
}

const openCreateModal = () => {
  isEdit.value = false
  currentId.value = null
  form.nombre = ''
  form.numeroDocumento = ''
  form.telefono = ''
  form.correo = ''
  form.direccion = ''
  showModal.value = true
}

const openEditModal = (client) => {
  isEdit.value = true
  currentId.value = client.id
  form.nombre = client.nombre
  form.numeroDocumento = client.numeroDocumento
  form.telefono = client.telefono
  form.correo = client.correo
  form.direccion = client.direccion
  showModal.value = true
}

const saveClient = async () => {
  try {
    const url = isEdit.value 
      ? `${API_URL}/api/clients/${currentId.value}`
      : `${API_URL}/api/clients`
    
    const method = isEdit.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(form)
    })

    if (!res.ok) throw new Error('Error al guardar el cliente.')

    showModal.value = false
    alert(isEdit.value ? '¡Cliente actualizado!' : '¡Cliente registrado!')
    fetchClients()
  } catch (err) {
    alert(err.message)
  }
}

const confirmDelete = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return

  try {
    const res = await fetch(`${API_URL}/api/clients/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (!res.ok) throw new Error('Error al eliminar el cliente.')

    alert('¡Cliente eliminado!')
    fetchClients()
  } catch (err) {
    alert(err.message)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const activeTab = ref('directorio')
const topClientes = ref([])
const loadingTop = ref(false)

const selectedClient = ref(null)
const showDetailModal = ref(false)
const selectedMonth = ref(null)
const clientSales = ref([])
const showSaleDetailModal = ref(false)
const selectedSale = ref(null)

const selectMonth = (monthObj) => {
  selectedMonth.value = monthObj
}

const openSaleDetail = (sale) => {
  selectedSale.value = sale
  showSaleDetailModal.value = true
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
          .total-row { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="text-center header">
          <h2>🍦 ${authStore.user?.nombreEmpresa || 'VentasSaaS'}</h2>
          <p>Punto de Venta - Boleta de Compra</p>
        </div>
        <div class="divider"></div>
        <p><strong>ID Venta:</strong> ${sale.id}</p>
        <p><strong>Fecha:</strong> ${formatDate(sale.fechaCreacion)}</p>
        <p><strong>Cliente:</strong> ${selectedClient.value?.nombre}</p>
        <p><strong>Vendedor:</strong> ${sale.creadoPorNombre}</p>
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

const printCompleteClientReport = () => {
  const client = selectedClient.value
  if (!client) return

  const printWindow = window.open('', '_blank', 'width=800,height=800')
  const html = `
    <html>
      <head>
        <title>Reporte_Cliente_${client.nombre.replace(/\s+/g, '_')}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 30px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6366f1; padding-bottom: 15px; margin-bottom: 30px; }
          .brand { font-size: 24px; font-weight: bold; color: #4f46e5; }
          .title { font-size: 20px; font-weight: bold; color: #1f2937; }
          .subtitle { font-size: 14px; color: #6b7280; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
          .card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; text-align: center; background: #f9fafb; }
          .card-val { font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 5px; }
          .card-lbl { font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; }
          h3 { color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #f3f4f6; color: #374151; font-weight: 600; text-align: left; padding: 10px; font-size: 14px; border-bottom: 2px solid #e5e7eb; }
          td { padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
          .product-chip { display: inline-block; background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 3px 10px; border-radius: 99px; font-size: 12px; margin: 4px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">🍦 ${authStore.user?.nombreEmpresa || 'VentasSaaS'}</div>
            <div class="subtitle">Reporte Consolidado de Cliente</div>
          </div>
          <div style="text-align: right;">
            <div class="title">${client.nombre}</div>
            <div class="subtitle">Doc: ${client.numeroDocumento || 'Sin doc'} | Tel: ${client.telefono || 'Sin tel'}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <div class="card-val">S/. ${client.totalGastado.toFixed(2)}</div>
            <div class="card-lbl">Total Gastado</div>
          </div>
          <div class="card">
            <div class="card-val">${client.numCompras}</div>
            <div class="card-lbl">Total Compras</div>
          </div>
          <div class="card">
            <div class="card-val">Hace ${client.diasDesdeUltimaCompra} días</div>
            <div class="card-lbl">Última Compra</div>
          </div>
        </div>

        <h3>📦 Productos Más Comprados</h3>
        <div style="margin-top: 10px;">
          ${(client.topProductos || []).map(p => `
            <span class="product-chip">${p.producto} (x${p.cantidad})</span>
          `).join('') || '<p>No hay productos registrados.</p>'}
        </div>

        <h3>📈 Historial Mensual (Últimos 6 Meses)</h3>
        <table>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Total Comprado</th>
            </tr>
          </thead>
          <tbody>
            ${(client.tendenciaMensual || []).map(t => `
              <tr>
                <td><strong>${t.mes} ${t.anio}</strong></td>
                <td>S/. ${t.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3>📋 Detalle Completo de Transacciones</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>ID Venta</th>
              <th>Vendedor</th>
              <th>Método Pago</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${clientSales.value.map(sale => `
              <tr>
                <td>${formatDate(sale.fechaCreacion)}</td>
                <td><code>${sale.id}</code></td>
                <td>${sale.creadoPorNombre}</td>
                <td>${sale.metodoPago}</td>
                <td><strong>S/. ${sale.total.toFixed(2)}</strong></td>
              </tr>
            `).join('') || '<tr><td colspan="5" align="center">No hay transacciones registradas.</td></tr>'}
          </tbody>
        </table>

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

const fetchClientSales = async (clientId) => {
  try {
    const res = await fetch(`${API_URL}/api/clientanalytics/client/${clientId}/sales`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (res.ok) {
      clientSales.value = await res.json()
    }
  } catch (err) {
    console.error('Error fetching client sales', err)
  }
}

const openDetailModal = async (client) => {
  selectedClient.value = client
  selectedMonth.value = null
  clientSales.value = []
  showDetailModal.value = true
  await fetchClientSales(client.clienteId)
  if (client.tendenciaMensual && client.tendenciaMensual.length > 0) {
    selectedMonth.value = client.tendenciaMensual[client.tendenciaMensual.length - 1]
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  // Ajuste de zona horaria para Perú (UTC-5)
  const local = new Date(d.getTime() - (5 * 60 * 60 * 1000))
  return local.toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const filteredSalesByMonth = computed(() => {
  if (!selectedMonth.value || !clientSales.value) return []
  return clientSales.value.filter(sale => {
    const saleDate = new Date(sale.fechaCreacion)
    const localDate = new Date(saleDate.getTime() - (5 * 60 * 60 * 1000))
    const monthNum = localDate.getMonth() + 1
    const year = localDate.getFullYear()
    return monthNum === selectedMonth.value.mesNum && year === selectedMonth.value.anio
  })
})

const clientesInactivos = computed(() => topClientes.value.filter(c => c.inactivo))

// Ordenar por recencia: los que tienen menor diasDesdeUltimaCompra primero
const sortedTopClientes = computed(() => {
  return [...topClientes.value].sort((a, b) => a.diasDesdeUltimaCompra - b.diasDesdeUltimaCompra)
})

const topSearchQuery = ref('')

const filteredTopClientes = computed(() => {
  const listWithRank = sortedTopClientes.value.map((c, i) => ({
    ...c,
    originalRank: i + 1
  }))
  if (!topSearchQuery.value) return listWithRank
  const query = topSearchQuery.value.toLowerCase().trim()
  return listWithRank.filter(c => {
    return (c.nombre || '').toLowerCase().includes(query) ||
           (c.numeroDocumento || '').toLowerCase().includes(query) ||
           (c.telefono || '').toLowerCase().includes(query)
  })
})

const switchToTop = () => {
  activeTab.value = 'top'
  if (topClientes.value.length === 0) fetchTopClients()
}

const fetchTopClients = async () => {
  loadingTop.value = true
  try {
    const res = await fetch(`${API_URL}/api/clientanalytics/top`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    topClientes.value = await res.json()
  } catch (err) {
    console.error('Error fetching top clients analytics')
  } finally {
    loadingTop.value = false
  }
}

// Helper to get max value of trend
const clientMaxVal = (tendencia) => {
  if (!tendencia || tendencia.length === 0) return 1
  return Math.max(...tendencia.map(t => t.total), 1)
}

// Construye los puntos de la línea de tendencia del cliente (500x150)
const clientChartPoints = (tendencia) => {
  if (!tendencia || tendencia.length === 0) return []
  const maxVal = clientMaxVal(tendencia)
  const width = 500
  const height = 150
  const padLeft = 60
  const padRight = 20
  const padTop = 20
  const padBottom = 30
  
  const chartW = width - padLeft - padRight
  const chartH = height - padTop - padBottom
  
  return tendencia.map((t, i) => {
    const x = padLeft + (i / (tendencia.length - 1 || 1)) * chartW
    const y = padTop + chartH - ((t.total / maxVal) * chartH)
    return {
      x,
      y,
      val: t.total,
      mes: t.mes
    }
  })
}

const buildClientChartLine = (tendencia) => {
  const pts = clientChartPoints(tendencia)
  if (pts.length === 0) return 'M 60,120'
  return 'M ' + pts.map(p => `${p.x},${p.y}`).join(' L ')
}

const buildClientChartPath = (tendencia) => {
  const pts = clientChartPoints(tendencia)
  if (pts.length === 0) return 'M 60,120 Z'
  const linePoints = pts.map(p => `${p.x},${p.y}`).join(' L ')
  return `M ${pts[0].x},120 L ${linePoints} L ${pts[pts.length - 1].x},120 Z`
}

// Mensaje de WhatsApp para clientes inactivos (reactivación con oferta)
const buildWhatsappReactivacion = (cli) => {
  const store = authStore.user?.nombreEmpresa || 'Nuestra Tienda'
  const productos = (cli.topProductos || []).slice(0, 2).map(p => p.producto).join(' y ')
  const msg = `¡Hola ${cli.nombre}! 👋 Somos *${store}* y te echamos de menos. Tus productos favoritos (${productos || 'nuestros mejores productos'}) te esperan ✨ ¡Ven a visitarnos! 🛒`
  const phone = (cli.telefono || '').replace(/[^0-9]/g, '')
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`
}

// Mensaje de WhatsApp promocional para un cliente top
const buildWhatsappPromo = (cli) => {
  const store = authStore.user?.nombreEmpresa || 'Nuestra Tienda'
  const productos = (cli.topProductos || []).slice(0, 2).map(p => p.producto).join(', ')
  const msg = `¡Hola ${cli.nombre}! 🔶 Tenemos novedades y ofertas especiales en *${store}*. ${productos ? `Recordamos que acostumbras llevar: ${productos}.` : ''} ¡Te esperamos! 🛒`
  const phone = (cli.telefono || '').replace(/[^0-9]/g, '')
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`
}

onMounted(() => {
  fetchClients()
})
</script>

<style scoped>

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

/* ── Tabs ── */
.tabs-nav {
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0;
}

.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
}

.tab-btn:hover {
  color: var(--primary);
  background: var(--bg-app);
}

.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

/* ── Alerta de inactivos ── */
.inactivos-alert {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
  border: 1px solid #fed7aa;
}

.inactivos-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
}

.inactivos-icon {
  font-size: 2rem;
}

.inactivos-title {
  font-size: 1rem;
  font-weight: 700;
  color: #c2410c;
  margin: 0 0 4px 0;
}

.inactivos-sub {
  font-size: 0.85rem;
  color: #92400e;
  margin: 0;
}

.inactivos-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.inactivo-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid #fed7aa;
  box-shadow: var(--shadow-sm);
}

.inactivo-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.inactivo-info {
  display: flex;
  flex-direction: column;
}

.inactivo-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}

.inactivo-days {
  font-size: 0.78rem;
  color: #c2410c;
  font-weight: 600;
}

/* ── Grid de top clientes ── */
.top-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.top-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: var(--transition);
}

.top-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.10);
}

.top-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.top-rank {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.top-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #818cf8);
  color: #fff;
  font-weight: 800;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.top-info {
  flex-grow: 1;
  overflow: hidden;
}

.top-name {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-doc {
  font-size: 0.78rem;
  color: var(--text-muted);
}

/* ── Métricas ── */
.top-metrics {
  display: flex;
  gap: 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.metric {
  flex: 1;
  text-align: center;
  padding: 10px 6px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric:last-child {
  border-right: none;
}

.metric-val {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
}

.metric-lbl {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 600;
}

.val-ok { color: #16a34a; }
.val-danger { color: #dc2626; }

/* ── Sparkline ── */
.sparkline-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sparkline-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
}

.sparkline {
  width: 100%;
  height: 50px;
}

.sparkline-months {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
  padding: 0 2px;
}

/* ── Productos top del cliente ── */
.top-products {
  border-top: 1px dashed var(--border-color);
  padding-top: 12px;
}

.top-products-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
  margin: 0 0 8px 0;
}

.top-products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.product-chip {
  font-size: 0.78rem;
  padding: 3px 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 99px;
  color: #1e40af;
}

/* ── Botón WhatsApp pequeño ── */
.btn-whatsapp-sm {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #25d366, #128c7e);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.78rem;
  border-radius: 99px;
  text-decoration: none;
  white-space: nowrap;
  transition: var(--transition);
  flex-shrink: 0;
}

.btn-whatsapp-sm:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(37, 211, 102, 0.35);
}

/* ── Estilos de la tabla resumen de Top Clientes y Modal ── */
.clickable-row:hover {
  background-color: var(--bg-app);
}

.top-avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a3c4f3, #90b3e2);
  color: #1e3a8a;
  font-weight: 800;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rank-badge {
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: bold;
  display: inline-block;
}

.rank-1 { background-color: #fef3c7; color: #d97706; }
.rank-2 { background-color: #f1f5f9; color: #475569; }
.rank-3 { background-color: #ffedd5; color: #ea580c; }

.detail-modal-card {
  max-width: 950px !important;
}
</style>
