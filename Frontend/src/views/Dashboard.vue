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

      <!-- Charts Section (New, beautiful SVG charts) -->
      <!-- Charts Section (Sleek SaaS Analytics) -->
      <div class="charts-layout">
        <!-- Daily Sales Trend (Hourly Modern Curve Chart) -->
        <div class="card chart-card modern-sales-card">
          <div class="chart-header-row">
            <div class="chart-title-wrap">
              <div class="chart-title-icon sales-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div>
                <h2 class="chart-main-title">Flujo de Ventas del Día</h2>
                <span class="chart-sub-date">{{ stats.fechaDiaActual || 'Hoy' }} • Vista 24 horas (00:00 - 23:00)</span>
              </div>
            </div>
            
            <div class="chart-header-badges">
              <div v-if="peakHourlyVenta && peakHourlyVenta.total > 0" class="metric-pill peak">
                <span class="pill-dot"></span>
                <span class="pill-label">Pico:</span>
                <strong class="pill-val">S/. {{ peakHourlyVenta.total.toFixed(2) }} ({{ peakHourlyVenta.hora.substring(0, 5) }})</strong>
              </div>
              <div class="metric-pill total">
                <span class="pill-label">Total Día:</span>
                <strong class="pill-val">S/. {{ (stats.totalIngresos || 0).toFixed(2) }}</strong>
              </div>
            </div>
          </div>

          <div v-if="!stats.ventasHorarias || stats.ventasHorarias.length === 0" class="empty-state">
            Cargando flujo de ventas...
          </div>
          <div v-else class="chart-wrapper" style="padding-top: 10px;">
            <svg class="line-chart-svg" viewBox="0 0 800 240">
              <defs>
                <!-- Area Gradient: Deep Indigo fading to crystal transparent -->
                <linearGradient id="area-grad-hourly-pro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.22" />
                  <stop offset="60%" stop-color="#6366f1" stop-opacity="0.06" />
                  <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0" />
                </linearGradient>

                <!-- Line Stroke Gradient: Indigo to Electric Violet -->
                <linearGradient id="line-grad-hourly-pro" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#4338ca" />
                  <stop offset="50%" stop-color="#6366f1" />
                  <stop offset="100%" stop-color="#818cf8" />
                </linearGradient>

                <!-- Soft Glow Shadow for the curve -->
                <filter id="curve-glow" x="-10%" y="-20%" width="120%" height="150%">
                  <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#4f46e5" flood-opacity="0.28" />
                </filter>

                <!-- Dark Tooltip Shadow -->
                <filter id="tooltip-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.25" />
                </filter>

                <!-- Peak Badge Shadow -->
                <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#1e1b4b" flood-opacity="0.25" />
                </filter>
              </defs>

              <!-- Subtle Background Grid Lines -->
              <line x1="65" y1="35" x2="780" y2="35" stroke="#f1f5f9" stroke-dasharray="3 3" stroke-width="1.2" />
              <line x1="65" y1="86" x2="780" y2="86" stroke="#f1f5f9" stroke-dasharray="3 3" stroke-width="1.2" />
              <line x1="65" y1="138" x2="780" y2="138" stroke="#f1f5f9" stroke-dasharray="3 3" stroke-width="1.2" />
              <line x1="65" y1="190" x2="780" y2="190" stroke="#e2e8f0" stroke-width="1.5" />

              <!-- Y-Axis Labels -->
              <text x="56" y="39" class="chart-axis-label" text-anchor="end">S/.{{ maxHourlyVenta.toFixed(0) }}</text>
              <text x="56" y="90" class="chart-axis-label" text-anchor="end">S/.{{ (maxHourlyVenta * 0.66).toFixed(0) }}</text>
              <text x="56" y="142" class="chart-axis-label" text-anchor="end">S/.{{ (maxHourlyVenta * 0.33).toFixed(0) }}</text>
              <text x="56" y="194" class="chart-axis-label zero" text-anchor="end">0</text>

              <!-- Smooth Area Gradient Fill -->
              <path :d="hourlyAreaPath" fill="url(#area-grad-hourly-pro)" />

              <!-- Smooth Main Curve Line with Glow -->
              <path :d="hourlyLinePath" fill="none" stroke="url(#line-grad-hourly-pro)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#curve-glow)" />

              <!-- Peak Callouts (Visible when not actively hovering another point) -->
              <g v-if="hoveredHourlyIndex === null">
                <g v-for="(p, idx) in activePointsWithSales" :key="'active-point-' + idx">
                  <!-- Outer glowing pulse ring -->
                  <circle :cx="p.x" :cy="p.y" r="8" fill="#4f46e5" fill-opacity="0.18" />
                  <circle :cx="p.x" :cy="p.y" r="4.5" fill="#4f46e5" stroke="#ffffff" stroke-width="2.5" />
                  <!-- Elegant pill above the peak -->
                  <g :transform="`translate(${p.x - 38}, ${p.y - 32})`">
                    <rect width="76" height="22" rx="11" fill="#1e1b4b" filter="url(#badge-shadow)" />
                    <text x="38" y="15" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">
                      S/. {{ p.val.toFixed(0) }}
                    </text>
                  </g>
                </g>
              </g>

              <!-- X-Axis Labels (2-hour intervals + hour ticks) -->
              <g v-for="(point, idx) in hourlyChartPoints" :key="'axis-x-' + idx">
                <line :x1="point.x" y1="190" :x2="point.x" :y2="idx % 2 === 0 ? 195 : 193" :stroke="idx % 2 === 0 ? '#94a3b8' : '#cbd5e1'" stroke-width="1" />
                <text v-if="idx % 2 === 0 || hoveredHourlyIndex === idx" :x="point.x" y="210" :class="['chart-axis-label-x', { 'label-active': hoveredHourlyIndex === idx }]" text-anchor="middle">
                  {{ point.label }}
                </text>
              </g>

              <!-- Interactive Hover Guideline & Cursor Pin -->
              <g v-if="hoveredHourlyPoint" pointer-events="none">
                <!-- Vertical Guideline -->
                <line :x1="hoveredHourlyPoint.x" y1="30" :x2="hoveredHourlyPoint.x" y2="190" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.8" />
                
                <!-- Pulsing Cursor Circle -->
                <circle :cx="hoveredHourlyPoint.x" :cy="hoveredHourlyPoint.y" r="9" fill="#6366f1" fill-opacity="0.22" />
                <circle :cx="hoveredHourlyPoint.x" :cy="hoveredHourlyPoint.y" r="4.5" fill="#ffffff" stroke="#4f46e5" stroke-width="3" />

                <!-- Rich SaaS Floating Tooltip Card -->
                <g :transform="`translate(${getTooltipX(hoveredHourlyPoint)}, ${getTooltipY(hoveredHourlyPoint)})`">
                  <rect width="136" height="54" rx="8" fill="#0f172a" fill-opacity="0.96" stroke="#334155" stroke-width="1" filter="url(#tooltip-shadow)" />
                  <text x="12" y="18" fill="#94a3b8" font-size="10" font-weight="600" letter-spacing="0.5">HORARIO: {{ hoveredHourlyPoint.label }}</text>
                  <text x="12" y="34" fill="#38bdf8" font-size="13" font-weight="800">S/. {{ hoveredHourlyPoint.val.toFixed(2) }}</text>
                  <circle :cx="16" :cy="44" r="3" :fill="hoveredHourlyPoint.val > 0 ? '#10b981' : '#64748b'" />
                  <text x="24" y="47" :fill="hoveredHourlyPoint.val > 0 ? '#34d399' : '#94a3b8'" font-size="9" font-weight="500">
                    {{ hoveredHourlyPoint.val > 0 ? 'Venta registrada' : 'Sin movimientos' }}
                  </text>
                </g>
              </g>

              <!-- Invisible full-height hover targets for silky smooth mouse tracking across all 24 hours -->
              <g class="hover-detector-group">
                <rect v-for="(point, idx) in hourlyChartPoints"
                      :key="'hover-rect-' + idx"
                      :x="point.x - 15.5"
                      y="20"
                      width="31"
                      height="180"
                      fill="transparent"
                      style="cursor: crosshair;"
                      @mouseenter="hoveredHourlyIndex = idx"
                      @mouseleave="hoveredHourlyIndex = null" />
              </g>
            </svg>
          </div>
        </div>

        <!-- Payment Methods Donut Chart -->
        <div class="card chart-card modern-donut-card">
          <div class="chart-header-row">
            <div class="chart-title-wrap">
              <div class="chart-title-icon donut-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
              </div>
              <div>
                <h2 class="chart-main-title">Formas de Pago</h2>
                <span class="chart-sub-date">Distribución del día</span>
              </div>
            </div>
          </div>

          <div v-if="!stats.metodosPagoDia || stats.metodosPagoDia.length === 0" class="empty-state">
            Sin cobros registrados hoy...
          </div>
          <div v-else class="donut-chart-layout">
            <div class="pie-wrapper">
              <svg class="pie-chart-svg" viewBox="-10 -10 140 140">
                <defs>
                  <filter id="pie-center-shadow-dia" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.12"/>
                  </filter>
                </defs>
                <g v-for="(seg, idx) in pieSegmentsDia" :key="idx" 
                   class="pie-slice-group"
                   :style="{ '--dx': seg.dx + 'px', '--dy': seg.dy + 'px' }"
                   @mouseenter="hoveredSegmentDia = seg"
                   @mouseleave="hoveredSegmentDia = null">
                  <path :d="seg.d"
                        :fill="seg.color"
                        stroke="#ffffff"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                        class="pie-segment" />
                  <text v-if="parseFloat(seg.percent) > 6"
                        :x="seg.tx"
                        :y="seg.ty"
                        class="pie-label"
                        text-anchor="middle">
                    {{ seg.percent }}%
                  </text>
                </g>
                
                <!-- Central White Circle (Donut) -->
                <circle cx="60" cy="60" r="24" fill="#ffffff" filter="url(#pie-center-shadow-dia)" />
                
                <!-- Central Text (Hover & Total Info) -->
                <g v-if="hoveredSegmentDia">
                  <text x="60" y="49" font-size="7" font-weight="800" fill="#1e1b4b" text-anchor="middle">
                    {{ hoveredSegmentDia.metodo }}
                  </text>
                  <text x="60" y="60" font-size="6.5" font-weight="700" fill="#4f46e5" text-anchor="middle">
                    S/.{{ hoveredSegmentDia.total.toFixed(2) }}
                  </text>
                  <text x="60" y="71" font-size="7" font-weight="800" :fill="hoveredSegmentDia.color" text-anchor="middle">
                    {{ hoveredSegmentDia.percent }}%
                  </text>
                </g>
                <g v-else>
                  <text x="60" y="52" font-size="6.5" font-weight="700" fill="#4f46e5" text-anchor="middle" style="letter-spacing: 0.2px;">
                    TOTAL
                  </text>
                  <text x="60" y="63" font-size="7" font-weight="800" fill="#1e1b4b" text-anchor="middle">
                    S/.{{ totalPagoDia.toFixed(2) }}
                  </text>
                  <text x="60" y="72" font-size="5" font-weight="600" fill="#94a3b8" text-anchor="middle">
                    100%
                  </text>
                </g>
              </svg>
            </div>

            <!-- Sleek Bottom Legend -->
            <div class="donut-legend">
              <div v-for="(seg, idx) in pieSegmentsDia" :key="'leg-' + idx" class="legend-item" @mouseenter="hoveredSegmentDia = seg" @mouseleave="hoveredSegmentDia = null">
                <span class="legend-bullet" :style="{ backgroundColor: seg.color }"></span>
                <span class="legend-label">{{ seg.metodo }}:</span>
                <span class="legend-value">S/. {{ seg.total.toFixed(2) }}</span>
                <span class="legend-percent">({{ seg.percent }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products Row -->
      <div class="card font-card" style="margin-top: 24px;">
        <h2 class="section-title">🏆 Top 5 Productos del Día</h2>
        <div v-if="!stats.productosMasVendidosDia || stats.productosMasVendidosDia.length === 0" class="empty-state">
          No se han registrado ventas de productos hoy.
        </div>
        <div v-else class="movements-grid">
          <div v-for="prod in stats.productosMasVendidosDia" :key="prod.producto" class="movement-card-item">
            <div class="movement-header-row">
              <span class="movement-badge venta">TOP</span>
              <span class="movement-date">{{ prod.cantidad }} unds vendidas</span>
            </div>
            <p class="movement-title" style="margin-top: 8px;"><strong>{{ prod.producto }}</strong></p>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Alerta de Recordatorios Vencidos / Por Vencer -->
    <div v-if="showReminderAlert" class="modal-overlay">
      <div class="modal-content card" style="max-width: 550px; border-left: 5px solid var(--warning);">
        <div class="modal-header">
          <h2 style="display: flex; align-items: center; gap: 10px;">◦ Alertas de Cuentas por Pagar</h2>
          <button @click="showReminderAlert = false" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body" style="text-align: left; padding: 15px 0;">
          <p style="margin-bottom: 15px; color: var(--text-muted); font-size: 0.95rem;">
            Tienes las siguientes cuentas pendientes que requieren atención hoy, mañana o en el transcurso de la semana:
          </p>

          <div style="max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 6px;">
            <div v-for="rem in urgentReminders" :key="rem.id" 
                 style="background: var(--bg-app); border: 1px solid var(--border-color); padding: 14px; border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <strong style="font-size: 1rem; color: var(--text-main);">{{ rem.titulo }}</strong>
                <span :class="['date-badge', getDaysRemainingClass(rem)]" style="font-size: 0.75rem; padding: 3px 8px; border-radius: 99px; font-weight: 500;">
                  {{ getDaysRemainingText(rem) }}
                </span>
              </div>
              <p v-if="rem.descripcion" style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">{{ rem.descripcion }}</p>
              <div style="font-size: 0.9rem; font-weight: 500; color: var(--text-main); margin-top: 4px;">
                Monto: <span style="color: var(--danger-hover);">S/. {{ rem.monto ? rem.monto.toFixed(2) : '0.00' }}</span>
              </div>
            </div>
          </div>
        </div>

        <footer class="modal-actions" style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
          <router-link to="/reminders" @click="showReminderAlert = false" class="btn btn-primary" style="text-decoration: none; display: flex; align-items: center; justify-content: center;">
            ⚙️ Ir a Recordatorios
          </router-link>
          <button @click="showReminderAlert = false" class="btn btn-secondary">Entendido</button>
        </footer>
      </div>
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

const stats = ref({
  totalProductos: 0,
  totalVentas: 0,
  totalIngresos: 0,
  totalNetoDia: 0,
  gananciaBruta: 0,
  totalGastosCompras: 0,
  productosBajoStockCount: 0,
  productosBajoStock: [],
  movimientosRecientes: [],
  ventasHorarias: [],
  metodosPagoDia: [],
  productosMasVendidosDia: [],
  fechaDiaActual: '',
  botWhatsAppActivo: false
})

const isBotToggling = ref(false)

const toggleBot = async () => {
  if (isBotToggling.value) return
  isBotToggling.value = true
  try {
    const res = await fetch(`${API_URL}/api/dashboard/bot-toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        botWhatsAppActivo: stats.value.botWhatsAppActivo,
        n8nWebhookUrl: 'https://n8n-web.helifyferdigital.cloud/webhook/bot-admin' // Endpoint dedicado para eventos del sistema
      })
    })
    
    if (!res.ok) throw new Error('Error al cambiar estado del bot')
    
    const data = await res.json()
    // Si se apagó y había clientes pendientes, se notifica
    if (!stats.value.botWhatsAppActivo && data.clientesNotificados > 0) {
      alert(`Bot apagado. Se enviaron mensajes a ${data.clientesNotificados} cliente(s) para que completen su compra en WhatsApp humano.`)
    }
  } catch (err) {
    console.error('Error toggling bot', err)
    // Revertir estado si falló
    stats.value.botWhatsAppActivo = !stats.value.botWhatsAppActivo
  } finally {
    isBotToggling.value = false
  }
}

const hoveredSegmentDia = ref(null)

const totalPagoDia = computed(() => {
  if (!stats.value.metodosPagoDia || stats.value.metodosPagoDia.length === 0) return 0
  return stats.value.metodosPagoDia.reduce((acc, m) => acc + m.total, 0)
})

// Variables para el sistema de alertas de Recordatorios
const showReminderAlert = ref(false)
const urgentReminders = ref([])

const getDaysRemainingClass = (rem) => {
  const diffTime = new Date(rem.fechaVencimiento) - new Date()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'date-expired'
  if (diffDays <= 3) return 'date-urgent'
  return 'date-ok'
}

const getDaysRemainingText = (rem) => {
  const diffTime = new Date(rem.fechaVencimiento) - new Date()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return `Vencido`
  if (diffDays === 0) return 'Vence hoy'
  if (diffDays === 1) return 'Vence mañana'
  return `Vence en ${diffDays} días`
}

const checkUrgentReminders = async () => {
  try {
    const todayStr = new Date().toDateString()
    const lastCheck = localStorage.getItem('last_reminder_check_date')
    
    // Si ya se hizo el chequeo diario hoy, no volvemos a molestar
    if (lastCheck === todayStr) return

    const res = await fetch(`${API_URL}/api/reminders`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (!res.ok) throw new Error()
    const allReminders = await res.json()

    // Filtrar los que estén Pendientes y expiren en: hoy (0), mañana (1) o 1 semana (7) o ya estén vencidos
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const urgent = allReminders.filter(rem => {
      if (rem.estado !== 'Pendiente') return false
      
      const targetDate = new Date(rem.fechaVencimiento)
      targetDate.setHours(0, 0, 0, 0)
      
      const diffTime = targetDate - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      // Coincide si está vencido, vence hoy (0), mañana (1), o exactamente en 7 días (o en el rango de la semana)
      return diffDays <= 7
    })

    if (urgent.length > 0) {
      urgentReminders.value = urgent
      showReminderAlert.value = true
    }

    // Marcar como chequeado para el día de hoy
    localStorage.setItem('last_reminder_check_date', todayStr)
  } catch (err) {
    console.error('Error checking urgent reminders:', err)
  }
}

const getTodayFormatted = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const selectedDate = ref(getTodayFormatted())

const fetchStats = async () => {
  try {
    const res = await fetch(`${API_URL}/api/dashboard?fecha=${selectedDate.value}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    stats.value = {
      totalProductos: data.totalProductos || 0,
      totalVentas: data.totalVentas || 0,
      totalIngresos: data.totalIngresos || 0,
      totalNetoDia: data.totalNetoDia || 0,
      gananciaBruta: data.gananciaBruta || 0,
      totalGastosCompras: data.totalGastosCompras || 0,
      productosBajoStockCount: data.productosBajoStockCount || 0,
      productosBajoStock: data.productosBajoStock || [],
      movimientosRecientes: data.movimientosRecientes || [],
      ventasHorarias: data.ventasHorarias || [],
      metodosPagoDia: data.metodosPagoDia || [],
      productosMasVendidosDia: data.productosMasVendidosDia || [],
      fechaDiaActual: data.fechaDiaActual || '',
      botWhatsAppActivo: data.botWhatsAppActivo || false
    }
    // Sync the date in case the backend overrides it
    if (data.fechaDiaActual) {
      selectedDate.value = data.fechaDiaActual
    }
  } catch (err) {
    console.error('Error fetching dashboard stats', err)
  }
}

// Hourly Chart Helpers (Modern SaaS Curve & Hover State - 24 Hours)
const hoveredHourlyIndex = ref(null)

// Asegura que siempre se muestren las 24 horas completas del día (00:00 a 23:00)
const full24HoursData = computed(() => {
  const backendHours = stats.value.ventasHorarias || []
  const map = {}
  backendHours.forEach(item => {
    const hStr = item.hora ? item.hora.substring(0, 2) : ''
    if (hStr) map[hStr] = item
  })

  const full = []
  for (let h = 0; h < 24; h++) {
    const hStr = String(h).padStart(2, '0')
    if (map[hStr]) {
      full.push(map[hStr])
    } else {
      full.push({
        hora: `${hStr}:00`,
        total: 0,
        cantidad: 0
      })
    }
  }
  return full
})

const maxHourlyVenta = computed(() => {
  const hours = full24HoursData.value
  if (!hours || hours.length === 0) return 100
  const rawMax = Math.max(...hours.map(h => h.total), 0)
  if (rawMax === 0) return 100
  // Redondear a un hito estético limpio para el eje Y
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)))
  const step = magnitude >= 100 ? 200 : 50
  return Math.ceil((rawMax * 1.15) / step) * step
})

const peakHourlyVenta = computed(() => {
  const hours = full24HoursData.value
  if (!hours || hours.length === 0) return null
  let peak = null
  for (const h of hours) {
    if (!peak || h.total > peak.total) {
      peak = h
    }
  }
  return peak && peak.total > 0 ? peak : null
})

const hourlyChartPoints = computed(() => {
  const hours = full24HoursData.value
  if (!hours || hours.length === 0) return []
  const count = hours.length
  const startX = 65
  const chartWidth = 715
  const baselineY = 190
  const plotHeight = 155
  const maxVal = maxHourlyVenta.value || 100

  return hours.map((v, index) => {
    const x = startX + index * (chartWidth / Math.max(1, count - 1))
    const y = baselineY - (v.total / maxVal) * plotHeight
    return {
      x,
      y,
      val: v.total,
      label: v.hora ? v.hora.substring(0, 5) : `${String(index).padStart(2, '0')}:00`
    }
  })
})

const hoveredHourlyPoint = computed(() => {
  if (hoveredHourlyIndex.value === null || !hourlyChartPoints.value) return null
  return hourlyChartPoints.value[hoveredHourlyIndex.value] || null
})

const activePointsWithSales = computed(() => {
  return hourlyChartPoints.value.filter(p => p.val > 0)
})

// Spline generator for ultra-smooth financial curve
const generateSmoothSpline = (points) => {
  if (!points || points.length === 0) return ""
  if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  const tension = 0.22

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = i + 2 < points.length ? points[i + 2] : p2

    // Flat line if both points are zero sales on baseline
    if (p1.val === 0 && p2.val === 0) {
      d += ` L ${p2.x.toFixed(1)} 190`
      continue
    }

    const cp1x = p1.x + (p2.x - p0.x) * tension
    let cp1y = p1.y + (p2.y - p0.y) * tension
    if (cp1y > 190) cp1y = 190

    const cp2x = p2.x - (p3.x - p1.x) * tension
    let cp2y = p2.y - (p3.y - p1.y) * tension
    if (cp2y > 190) cp2y = 190

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

const hourlyLinePath = computed(() => {
  return generateSmoothSpline(hourlyChartPoints.value)
})

const hourlyAreaPath = computed(() => {
  const points = hourlyChartPoints.value
  if (points.length === 0) return ""
  const spline = generateSmoothSpline(points)
  const startX = points[0].x.toFixed(1)
  const endX = points[points.length - 1].x.toFixed(1)
  return `${spline} L ${endX} 190 L ${startX} 190 Z`
})

const getTooltipX = (point) => {
  if (!point) return 0
  if (point.x > 670) return point.x - 142
  if (point.x < 140) return point.x + 12
  return point.x - 68
}

const getTooltipY = (point) => {
  if (!point) return 0
  const targetY = point.y - 60
  return targetY < 25 ? 28 : targetY
}

// Pie Chart Helpers
const pieSegmentsDia = computed(() => {
  if (!stats.value.metodosPagoDia || stats.value.metodosPagoDia.length === 0) return []
  const totalAmount = stats.value.metodosPagoDia.reduce((acc, m) => acc + m.total, 0)
  if (totalAmount === 0) return []
  
  let cumulativePercent = 0
  const colors = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4']
  
  return stats.value.metodosPagoDia.map((m, index) => {
    const percent = m.total / totalAmount
    const startAngle = cumulativePercent * 360
    const endAngle = (cumulativePercent + percent) * 360
    const midAngle = startAngle + (percent * 360) / 2
    
    cumulativePercent += percent
    
    const startRad = (startAngle - 90) * Math.PI / 180
    const endRad = (endAngle - 90) * Math.PI / 180
    const midRad = (midAngle - 90) * Math.PI / 180
    
    const x1 = 60 + 50 * Math.cos(startRad)
    const y1 = 60 + 50 * Math.sin(startRad)
    const x2 = 60 + 50 * Math.cos(endRad)
    const y2 = 60 + 50 * Math.sin(endRad)
    
    const largeArcFlag = percent > 0.5 ? 1 : 0
    
    let d = ""
    if (percent === 1) {
      d = `M 60 10 A 50 50 0 1 1 59.9 10 Z`
    } else {
      d = `M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
    }
    
    const explodeDist = 6
    const dx = Math.cos(midRad) * explodeDist
    const dy = Math.sin(midRad) * explodeDist

    // Coordenadas para el texto del porcentaje (centroide del segmento)
    const tx = 60 + 35 * Math.cos(midRad)
    const ty = 60 + 35 * Math.sin(midRad) + 2 // Pequeño ajuste vertical

    return {
      metodo: m.metodo,
      total: m.total,
      percent: (percent * 100).toFixed(1),
      d,
      dx,
      dy,
      tx,
      ty,
      color: colors[index % colors.length]
    }
  })
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchStats()
  checkUrgentReminders()
})
</script>

<style scoped>
.content-header {
  margin-bottom: 25px;
  text-align: left;
}

.metrics-container {
  margin-bottom: 30px;
}

.kpi-total-card {
  transition: var(--transition);
}

.kpi-total-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.metric-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.metric-icon {
  font-size: 2.2rem;
  background: var(--bg-app);
  padding: 10px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-value {
  font-size: 2.1rem;
  font-weight: 500;
  color: var(--text-main);
  line-height: 1.2;
}

.col-span-2 {
  grid-column: span 2 / span 2;
}

/* Charts Containers */
.charts-container {
  margin-bottom: 24px;
}

.chart-card {
  padding: 24px;
  background: #ffffff;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 20px;
  text-align: left;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Stock Alerts Styling */
.stock-alerts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.stock-alert-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #fff8f8;
  border: 1px solid var(--danger);
  border-radius: var(--radius-sm);
}

.alert-product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.alert-dot.red {
  background-color: #c53030;
}

.alert-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-main);
}

.alert-badge {
  font-size: 0.8rem;
  font-weight: 500;
  color: #c53030;
}

/* Movements Grid styling */
.movements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  text-align: left;
}

.movement-card-item {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.movement-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.movement-badge {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 99px;
  text-transform: uppercase;
}

.movement-badge.venta { background: var(--success); color: #1b4d3e; }
.movement-badge.ajuste { background: var(--warning); color: #744210; }
.movement-badge.compra { background: var(--primary); color: #1e3a8a; }

.movement-date {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.movement-title {
  font-size: 0.95rem;
  color: var(--text-main);
}

.movement-desc-txt {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.empty-state {
  color: var(--text-muted);
  padding: 30px;
  text-align: center;
}

/* Custom Charts Layout (Modern SaaS Architecture) */
.charts-layout {
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .charts-layout {
    grid-template-columns: 1fr;
  }
}

.chart-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 6px;
}

.chart-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-title-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef2ff;
  color: #4f46e5;
  box-shadow: 0 1px 3px rgba(79, 70, 229, 0.12);
  flex-shrink: 0;
}

.chart-title-icon.donut-icon {
  background: #fdf2f8;
  color: #db2777;
}

.chart-main-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.chart-sub-date {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
}

.chart-header-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.metric-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
}

.metric-pill.peak {
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #3730a3;
}

.metric-pill.total {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4f46e5;
  box-shadow: 0 0 6px rgba(79, 70, 229, 0.6);
}

.pill-label {
  color: #64748b;
  font-weight: 500;
}

.pill-val {
  font-weight: 700;
}

/* Hourly SVG styling */
.line-chart-svg {
  width: 100%;
  max-height: 33vh;
  overflow: visible;
}

.chart-axis-label {
  font-size: 10.5px;
  fill: #94a3b8;
  font-weight: 600;
  font-family: inherit;
}

.chart-axis-label-x {
  font-size: 9.5px;
  fill: #94a3b8;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s ease;
}

.chart-axis-label-x.label-active {
  fill: #4f46e5;
  font-weight: 700;
  font-size: 10.5px;
}

/* Pie Chart Layout & Styling */
.donut-chart-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.pie-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
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
  filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.25));
  opacity: 0.95;
}

.pie-label {
  font-size: 7.5px;
  font-weight: 700;
  fill: #ffffff;
  pointer-events: none;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  padding: 0 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.legend-item:hover {
  background: #f1f5f9;
}

.legend-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-weight: 600;
  color: #334155;
}

.legend-value {
  margin-left: auto;
  font-weight: 700;
  color: #0f172a;
}

.legend-percent {
  font-size: 0.75rem;
  color: #64748b;
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
