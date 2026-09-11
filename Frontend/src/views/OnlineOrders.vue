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
        <router-link v-if="!authStore.isSuperadmin && authStore.hasPermission('pedidos_web')" to="/online-orders" class="nav-item" active-class="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sidebar-icon"><circle cx="12" cy="12" r="10"/><path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span class="sidebar-text">Pedidos Web</span>
          <span v-if="pendingCount > 0" class="badge-count">{{ pendingCount }}</span>
        </router-link>
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
          <h1 class="text-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><circle cx="12" cy="12" r="10"/><path d="M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Pedidos Web
          </h1>
          <p class="text-subtitle">Gestiona los pedidos recibidos desde la tienda online. Confirma pagos, actualiza estados y realiza seguimiento de envíos.</p>
        </div>
      </header>

      <!-- Tarjetas de resumen -->
      <div class="summary-cards">
        <div class="summary-card pending">
          <div class="summary-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
          </div>
          <div>
            <div class="summary-label">Pendiente de Pago</div>
            <div class="summary-count">{{ countByStatus('PENDIENTE_PAGO') }}</div>
          </div>
        </div>
        <div class="summary-card preparing">
          <div class="summary-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </div>
          <div>
            <div class="summary-label">En Preparación</div>
            <div class="summary-count">{{ countByStatus('EN_PREPARACION') }}</div>
          </div>
        </div>
        <div class="summary-card shipped">
          <div class="summary-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div>
            <div class="summary-label">Enviados</div>
            <div class="summary-count">{{ countByStatus('ENVIADO') }}</div>
          </div>
        </div>
        <div class="summary-card delivered">
          <div class="summary-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <div class="summary-label">Entregados</div>
            <div class="summary-count">{{ countByStatus('ENTREGADO') }}</div>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card font-card">
        <div class="filters-container">
          <input v-model="searchQuery" type="text" placeholder="Buscar por cliente o ID..." class="filter-input" />
          <select v-model="filterEstado" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="PENDIENTE_PAGO">Pendiente de Pago</option>
            <option value="EN_PREPARACION">En Preparación</option>
            <option value="ENVIADO">Enviado</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        <HamsterLoader v-if="loading" label="Cargando pedidos web..." />

        <div v-else-if="filteredOrders.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.3;"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>
          <p>No hay pedidos web que coincidan con los filtros.</p>
        </div>

        <table v-else class="data-table">
          <thead>
            <tr>
              <th>ID / Fecha</th>
              <th>Cliente</th>
              <th>Dirección de Entrega</th>
              <th>Método de Pago</th>
              <th>Total</th>
              <th>Estado</th>
              <th style="text-align:center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>
                <code style="font-size: 0.82rem; color: #6b7280;">#{{ order.id?.slice(-8).toUpperCase() }}</code>
                <br>
                <span style="font-size: 0.8rem; color: var(--text-muted);">{{ formatDateTime(order.fechaCreacion) }}</span>
              </td>
              <td>
                <strong>{{ order.nombreCliente }}</strong>
                <br>
                <span v-if="order.esEntregaATercero" style="font-size: 0.78rem; color: #f59e0b;">Receptor: {{ order.nombreReceptor }}</span>
              </td>
              <td style="font-size: 0.85rem; max-width: 220px;">
                <span v-if="order.direccionEntrega">
                  {{ order.direccionEntrega }}<br>
                  <span style="color: var(--text-muted);">{{ order.distritoEntrega }}, {{ order.provinciaEntrega }}</span>
                </span>
                <span v-else style="color: var(--text-muted);">—</span>
              </td>
              <td>
                <span class="payment-badge">{{ order.metodoPago }}</span>
                <br>
                <span v-if="order.codigoOperacionPago" style="font-size: 0.78rem; color: var(--text-muted);">Cód: {{ order.codigoOperacionPago }}</span>
              </td>
              <td><strong style="color: var(--text-main);">S/. {{ Number(order.total || 0).toFixed(2) }}</strong></td>
              <td>
                <span :class="['estado-badge', estadoClass(order.estadoOrden)]">
                  {{ estadoLabel(order.estadoOrden) }}
                </span>
                <br>
                <span v-if="order.numeroSeguimiento" style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; display: block;">
                  Seguimiento: {{ order.numeroSeguimiento }}
                </span>
              </td>
              <td style="text-align: center; display: flex; flex-direction: column; gap: 6px; align-items: center; padding: 12px 8px;">
                <button @click="openDetail(order)" class="btn btn-primary btn-sm" style="width: 130px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Ver Detalles
                </button>
                <button
                  v-if="order.estadoOrden !== 'CANCELADO' && order.estadoOrden !== 'ENTREGADO'"
                  @click="openStatusModal(order)"
                  class="btn btn-sm"
                  style="width: 130px; background: #f0fdf4; color: #15803d; border: 1px solid #86efac;"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 4px;"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  Actualizar Estado
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal: Detalle del pedido -->
      <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
        <div class="modal-content card" style="max-width: 680px;">
          <header class="modal-header">
            <h3>Detalle del Pedido Web #{{ selectedOrder.id?.slice(-8).toUpperCase() }}</h3>
            <button @click="selectedOrder = null" class="close-btn">×</button>
          </header>

          <div class="detail-grid">
            <div class="detail-section">
              <h4 class="detail-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Cliente
              </h4>
              <div class="detail-row"><span>Nombre:</span> <strong>{{ selectedOrder.nombreCliente }}</strong></div>
              <div v-if="selectedOrder.esEntregaATercero" class="detail-row"><span>Receptor:</span> <strong>{{ selectedOrder.nombreReceptor }} (DNI: {{ selectedOrder.dniReceptor }})</strong></div>
            </div>

            <div class="detail-section">
              <h4 class="detail-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Dirección de Entrega
              </h4>
              <div class="detail-row"><span>Dirección:</span> <strong>{{ selectedOrder.direccionEntrega || '—' }}</strong></div>
              <div class="detail-row"><span>Distrito:</span> <strong>{{ selectedOrder.distritoEntrega || '—' }}</strong></div>
              <div class="detail-row"><span>Provincia:</span> <strong>{{ selectedOrder.provinciaEntrega || '—' }}</strong></div>
              <div class="detail-row"><span>Departamento:</span> <strong>{{ selectedOrder.departamentoEntrega || '—' }}</strong></div>
              <div v-if="selectedOrder.referenciaEntrega" class="detail-row"><span>Referencia:</span> <strong>{{ selectedOrder.referenciaEntrega }}</strong></div>
              <div v-if="selectedOrder.notasEntrega" class="detail-row"><span>Notas:</span> <strong>{{ selectedOrder.notasEntrega }}</strong></div>
            </div>

            <div class="detail-section">
              <h4 class="detail-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Pago
              </h4>
              <div class="detail-row"><span>Método:</span> <strong>{{ selectedOrder.metodoPago }}</strong></div>
              <div class="detail-row"><span>Estado:</span> <span :class="['estado-badge', estadoClass(selectedOrder.estadoOrden)]">{{ estadoLabel(selectedOrder.estadoOrden) }}</span></div>
              <div v-if="selectedOrder.codigoOperacionPago" class="detail-row"><span>Cód. Operación:</span> <strong>{{ selectedOrder.codigoOperacionPago }}</strong></div>
              <div v-if="selectedOrder.fechaConfirmacionPago" class="detail-row"><span>Confirmado el:</span> <strong>{{ formatDateTime(selectedOrder.fechaConfirmacionPago) }}</strong></div>
              <div v-if="selectedOrder.numeroSeguimiento" class="detail-row"><span>N° Seguimiento:</span> <strong>{{ selectedOrder.numeroSeguimiento }}</strong></div>
            </div>

            <div class="detail-section">
              <h4 class="detail-section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Comprobante
              </h4>
              <div class="detail-row"><span>Tipo:</span> <strong>{{ selectedOrder.tipoComprobante }}</strong></div>
              <div v-if="selectedOrder.rucFactura" class="detail-row"><span>RUC:</span> <strong>{{ selectedOrder.rucFactura }}</strong></div>
              <div v-if="selectedOrder.razonSocialFactura" class="detail-row"><span>Razón Social:</span> <strong>{{ selectedOrder.razonSocialFactura }}</strong></div>
            </div>
          </div>

          <!-- Productos del pedido -->
          <div style="margin-top: 16px;">
            <h4 class="detail-section-title" style="margin-bottom: 12px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              Productos
            </h4>
            <table class="modal-details-table">
              <thead><tr><th>Producto</th><th style="text-align:center;">Cant.</th><th style="text-align:right;">Precio Unit.</th><th style="text-align:right;">Subtotal</th></tr></thead>
              <tbody>
                <tr v-for="item in selectedOrder.detalles" :key="item.productoId">
                  <td>{{ item.nombreProducto }}</td>
                  <td style="text-align:center;">{{ item.cantidad }}</td>
                  <td style="text-align:right;">S/. {{ Number(item.precioUnitario || 0).toFixed(2) }}</td>
                  <td style="text-align:right;"><strong>S/. {{ Number((item.cantidad || 0) * (item.precioUnitario || 0)).toFixed(2) }}</strong></td>
                </tr>
              </tbody>
            </table>
            <div style="text-align: right; margin-top: 12px; font-size: 1.1rem; font-weight: 600;">
              Total: S/. {{ Number(selectedOrder.total || 0).toFixed(2) }}
            </div>
          </div>

          <footer style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
            <button
              v-if="selectedOrder.estadoOrden !== 'CANCELADO' && selectedOrder.estadoOrden !== 'ENTREGADO'"
              @click="openStatusModal(selectedOrder); selectedOrder = null"
              class="btn btn-primary"
            >
              Actualizar Estado
            </button>
            <button @click="selectedOrder = null" class="btn btn-secondary">Cerrar</button>
          </footer>
        </div>
      </div>

      <!-- Modal: Cambiar Estado -->
      <div v-if="statusModal.visible" class="modal-overlay" @click.self="statusModal.visible = false">
        <div class="modal-content card" style="max-width: 460px;">
          <header class="modal-header">
            <h3>Actualizar Estado del Pedido</h3>
            <button @click="statusModal.visible = false" class="close-btn">×</button>
          </header>

          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">
            Pedido: <strong>#{{ statusModal.order?.id?.slice(-8).toUpperCase() }}</strong> — 
            Cliente: <strong>{{ statusModal.order?.nombreCliente }}</strong>
          </p>

          <div class="estado-options">
            <button
              v-for="opt in getValidNextStatuses(statusModal.order?.estadoOrden)"
              :key="opt.value"
              @click="statusModal.selected = opt.value"
              :class="['estado-option', { active: statusModal.selected === opt.value }]"
            >
              <span :class="['estado-badge', opt.class]">{{ opt.label }}</span>
              <span style="font-size: 0.82rem; color: var(--text-muted); display: block; margin-top: 4px;">{{ opt.description }}</span>
            </button>
          </div>

          <div v-if="statusModal.selected === 'ENVIADO'" style="margin-top: 16px;">
            <label style="font-size: 0.88rem; font-weight: 500; display: block; margin-bottom: 6px;">Número de Seguimiento (opcional)</label>
            <input
              v-model="statusModal.numeroSeguimiento"
              type="text"
              placeholder="Ej: PE123456789"
              class="filter-input"
              style="width: 100%;"
            />
          </div>

          <div v-if="statusModal.selected === 'EN_PREPARACION'" style="margin-top: 16px; background: #f0fdf4; border: 1px solid #86efac; padding: 12px; border-radius: 8px; font-size: 0.88rem; color: #15803d;">
            <strong>Confirmación de pago:</strong> Al pasar a "En Preparación", el pedido se registrará como venta confirmada y sumará en el Dashboard e Historial de Ventas.
          </div>
          <div v-if="statusModal.selected === 'CANCELADO'" style="margin-top: 16px; background: #fef2f2; border: 1px solid #fca5a5; padding: 12px; border-radius: 8px; font-size: 0.88rem; color: #b91c1c;">
            <strong>Advertencia:</strong> Al cancelar, el stock de los productos será restaurado automáticamente al inventario.
          </div>

          <footer style="margin-top: 24px; display: flex; gap: 10px; justify-content: flex-end;">
            <button @click="statusModal.visible = false" class="btn btn-secondary" :disabled="updatingStatus">Cancelar</button>
            <button
              @click="confirmStatusUpdate"
              class="btn btn-primary"
              :disabled="!statusModal.selected || updatingStatus"
            >
              {{ updatingStatus ? 'Guardando...' : 'Confirmar Cambio' }}
            </button>
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

const orders = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterEstado = ref('')
const selectedOrder = ref(null)
const updatingStatus = ref(false)

const statusModal = ref({
  visible: false,
  order: null,
  selected: '',
  numeroSeguimiento: ''
})

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/sales/online-orders`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    orders.value = await res.json()
  } catch (err) {
    console.error('Error fetching online orders:', err)
  } finally {
    loading.value = false
  }
}

const pendingCount = computed(() => orders.value.filter(o => o.estadoOrden === 'PENDIENTE_PAGO').length)

const countByStatus = (status) => orders.value.filter(o => o.estadoOrden === status).length

const filteredOrders = computed(() => {
  return orders.value.filter(o => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q ||
      (o.nombreCliente && o.nombreCliente.toLowerCase().includes(q)) ||
      (o.id && o.id.toLowerCase().includes(q)) ||
      (o.codigoOperacionPago && o.codigoOperacionPago.toLowerCase().includes(q))
    const matchesEstado = !filterEstado.value || o.estadoOrden === filterEstado.value
    return matchesSearch && matchesEstado
  })
})

const estadoLabel = (estado) => {
  const labels = {
    'PENDIENTE_PAGO': 'Pendiente de Pago',
    'EN_PREPARACION': 'En Preparación',
    'ENVIADO': 'Enviado',
    'ENTREGADO': 'Entregado',
    'CANCELADO': 'Cancelado'
  }
  return labels[estado] || estado
}

const estadoClass = (estado) => {
  const classes = {
    'PENDIENTE_PAGO': 'estado-pending',
    'EN_PREPARACION': 'estado-preparing',
    'ENVIADO': 'estado-shipped',
    'ENTREGADO': 'estado-delivered',
    'CANCELADO': 'estado-cancelled'
  }
  return classes[estado] || ''
}

const ALL_STATUS_OPTIONS = [
  { value: 'EN_PREPARACION', label: 'En Preparación', class: 'estado-preparing', description: 'Pago confirmado. Empezar embalaje del reloj.' },
  { value: 'ENVIADO', label: 'Enviado', class: 'estado-shipped', description: 'Entregado al courier o servicio de envío.' },
  { value: 'ENTREGADO', label: 'Entregado', class: 'estado-delivered', description: 'El cliente recibió su pedido conforme.' },
  { value: 'CANCELADO', label: 'Cancelado', class: 'estado-cancelled', description: 'Cancelar pedido y restaurar stock al inventario.' }
]

const getValidNextStatuses = (currentStatus) => {
  const order = { 'PENDIENTE_PAGO': 0, 'EN_PREPARACION': 1, 'ENVIADO': 2, 'ENTREGADO': 3, 'CANCELADO': 4 }
  const currentOrder = order[currentStatus] ?? 0
  return ALL_STATUS_OPTIONS.filter(opt => {
    if (opt.value === 'CANCELADO') return true
    const optOrder = order[opt.value] ?? 0
    return optOrder > currentOrder && opt.value !== currentStatus
  })
}

const openDetail = (order) => {
  selectedOrder.value = order
}

const openStatusModal = (order) => {
  statusModal.value = { visible: true, order, selected: '', numeroSeguimiento: '' }
}

const confirmStatusUpdate = async () => {
  if (!statusModal.value.selected || !statusModal.value.order) return
  updatingStatus.value = true
  try {
    const res = await fetch(`${API_URL}/api/sales/${statusModal.value.order.id}/order-status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nuevoEstado: statusModal.value.selected,
        numeroSeguimiento: statusModal.value.numeroSeguimiento || null
      })
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || 'Error al actualizar el estado.')
      return
    }
    statusModal.value.visible = false
    await fetchOrders()
  } catch (err) {
    alert('Error de conexión al actualizar el estado.')
  } finally {
    updatingStatus.value = false
  }
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('es-PE', {
    timeZone: 'America/Lima', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => fetchOrders())
</script>

<style scoped>
.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.summary-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}
.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.summary-card.pending .summary-icon { background: #fef3c7; color: #d97706; }
.summary-card.preparing .summary-icon { background: #dbeafe; color: #2563eb; }
.summary-card.shipped .summary-icon { background: #ede9fe; color: #7c3aed; }
.summary-card.delivered .summary-icon { background: #dcfce7; color: #16a34a; }
.summary-label { font-size: 0.82rem; color: var(--text-muted); font-weight: 500; }
.summary-count { font-size: 1.8rem; font-weight: 700; color: var(--text-main); line-height: 1.1; }

.badge-count {
  margin-left: auto;
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

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
  background: #fff;
  color: var(--text-main);
  outline: none;
  font-size: 0.95rem;
}

/* Estado badges */
.estado-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}
.estado-pending { background: #fef3c7; color: #92400e; }
.estado-preparing { background: #dbeafe; color: #1e40af; }
.estado-shipped { background: #ede9fe; color: #5b21b6; }
.estado-delivered { background: #dcfce7; color: #15803d; }
.estado-cancelled { background: #fee2e2; color: #b91c1c; }

.payment-badge {
  background: #f1f5f9;
  color: var(--text-main);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 500;
}

.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th, .data-table td { padding: 14px 12px; border-bottom: 1px solid var(--border-color); }
.data-table th { font-weight: 500; color: var(--text-muted); font-size: 0.85rem; }

.empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.btn-sm { padding: 7px 12px; font-size: 0.85rem; }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { width: 100%; max-width: 680px; background: #fff; padding: 28px; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px; }
.modal-header h3 { font-size: 1.2rem; font-weight: 600; margin: 0; }
.close-btn { background: none; border: none; font-size: 1.8rem; cursor: pointer; color: var(--text-muted); line-height: 1; }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-section { background: var(--bg-app); border-radius: 10px; padding: 16px; border: 1px solid var(--border-color); }
.detail-section-title { font-size: 0.88rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; margin-bottom: 12px; margin-top: 0; }
.detail-row { display: flex; justify-content: space-between; font-size: 0.88rem; padding: 4px 0; gap: 8px; }
.detail-row span:first-child { color: var(--text-muted); flex-shrink: 0; }

.modal-details-table { width: 100%; border-collapse: collapse; }
.modal-details-table th, .modal-details-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-color); text-align: left; font-size: 0.88rem; }
.modal-details-table th { background: var(--bg-app); font-weight: 500; color: var(--text-muted); }

/* Status modal */
.estado-options { display: flex; flex-direction: column; gap: 10px; }
.estado-option {
  background: var(--bg-app);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}
.estado-option:hover { border-color: #93c5fd; background: #f0f9ff; }
.estado-option.active { border-color: #3b82f6; background: #eff6ff; }

@media (max-width: 768px) {
  .summary-cards { grid-template-columns: 1fr 1fr; }
  .detail-grid { grid-template-columns: 1fr; }
}
</style>
