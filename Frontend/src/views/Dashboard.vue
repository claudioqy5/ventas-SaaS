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

    <!-- Main Content -->
    <main class="main-content">
      <header class="content-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 class="text-title">◫ Resumen del Negocio</h1>
          <p class="text-subtitle">Monitorea tus ventas, inventario y alertas</p>
        </div>
        <div style="display: flex; gap: 20px; align-items: center;">
          
          <!-- Bot Toggle Control -->
          <div class="bot-control" style="display: flex; align-items: center; gap: 10px; background: #fff; padding: 6px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
            <div style="display: flex; flex-direction: column;">
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-main); display: flex; align-items: center; gap: 5px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Bot Inteligente
              </span>
              <span :style="{ color: isBotToggling ? 'var(--text-muted)' : (stats.botWhatsAppActivo ? '#16a34a' : '#dc2626'), fontSize: '0.75rem', fontWeight: '500' }">
                {{ isBotToggling ? 'Cambiando...' : (stats.botWhatsAppActivo ? 'Encendido' : 'Apagado') }}
              </span>
            </div>
            <label class="switch-toggle" style="position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer;">
              <input type="checkbox" v-model="stats.botWhatsAppActivo" @change="toggleBot" :disabled="isBotToggling" style="opacity: 0; width: 0; height: 0;">
              <span class="slider" :class="{ 'slider-active': stats.botWhatsAppActivo }" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .3s; border-radius: 24px;"></span>
              <span class="slider-dot" :class="{ 'dot-active': stats.botWhatsAppActivo }" style="position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></span>
            </label>
          </div>

          <div class="date-filter-container">
            <label for="dashboard-date" class="text-subtitle" style="margin-right: 10px; font-weight: 500;">Filtrar por Fecha:</label>
            <input type="date" id="dashboard-date" v-model="selectedDate" @change="fetchStats" class="form-input" style="padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" />
          </div>
        </div>
      </header>

      <!-- Metric Grid -->
      <div class="grid grid-4 metrics-container">
        <div class="kpi-total-card bruto" style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 20px 24px; border-radius: var(--radius-md); text-align: left; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 500; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.5px;">Venta Total (Con IGV)</div>
          <div style="font-size: 1.8rem; font-weight: 500; color: #1e1b4b; margin-top: 4px;">S/. {{ (stats.totalIngresos || 0).toFixed(2) }}</div>
        </div>

        <div class="kpi-total-card neto" style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px 24px; border-radius: var(--radius-md); text-align: left; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 500; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px;">Ganancia Bruta (Pre-Impuesto)</div>
          <div style="font-size: 1.8rem; font-weight: 500; color: #14532d; margin-top: 4px;">S/. {{ (stats.gananciaBruta || 0).toFixed(2) }}</div>
        </div>

        <div class="kpi-total-card realizadas" style="background: #fff0f6; border: 1px solid #ffd8e8; padding: 20px 24px; border-radius: var(--radius-md); text-align: left; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 500; color: #d01c68; text-transform: uppercase; letter-spacing: 0.5px;">Ventas Realizadas</div>
          <div style="font-size: 1.8rem; font-weight: 500; color: #500e2e; margin-top: 4px;">{{ stats.totalVentas || 0 }}</div>
        </div>

        <div class="kpi-total-card activas" style="background: #fffbeb; border: 1px solid #fef3c7; padding: 20px 24px; border-radius: var(--radius-md); text-align: left; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center; cursor: pointer;">
          <div style="font-size: 0.75rem; font-weight: 500; color: #d97706; text-transform: uppercase; letter-spacing: 0.5px;">Productos Activos</div>
          <div style="font-size: 1.8rem; font-weight: 500; color: #451a03; margin-top: 4px;">{{ stats.totalProductos || 0 }}</div>
        </div>
      </div>

  justify-content: center;
  padding: 10px 0;
}

.pie-wrapper {
  position: relative;
  width: 32vh;
  height: 32vh;
  min-width: 220px;
  min-height: 220px;
}

.pie-chart-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.pie-slice-group {
  transform-origin: 60px 60px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.pie-slice-group:hover {
  transform: translate(var(--dx), var(--dy)) scale(1.05);
}

.pie-segment {
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.pie-slice-group:hover .pie-segment {
  filter: drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.2));
  opacity: 0.95;
}

.pie-label {
  font-size: 7.5px;
  font-weight: 500;
  fill: #ffffff;
  pointer-events: none;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.4);
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  padding: 24px;
  position: relative;
  background: #ffffff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--text-muted);
}

.date-badge {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

.date-badge.date-ok {
  background-color: #e0f2fe;
  color: #0369a1;
}

.date-badge.date-urgent {
  background-color: #fffbeb;
  color: #d97706;
  border: 1px solid #fef3c7;
}

.date-badge.date-expired {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fee2e2;
}

/* Bot Toggle Switch */
.slider-active {
  background-color: #25D366 !important;
}
.dot-active {
  transform: translateX(20px);
}
</style>
