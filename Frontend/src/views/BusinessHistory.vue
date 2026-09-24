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
      <header class="content-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; margin-bottom: 25px;">
        <!-- Left Side: Title and KPI Cards side by side -->
        <div style="display: flex; align-items: center; gap: 30px; flex-wrap: wrap;">
          <div>
            <h1 class="text-title">▸ Historial del Negocio</h1>
            <p class="text-subtitle">Resumen y análisis de ventas por periodo</p>
          </div>
          
          <!-- KPI Totals Row -->
          <div class="kpi-totals-row" style="display: flex; gap: 12px; flex-wrap: wrap;">
            <div class="kpi-total-card bruto" style="background: #eef2ff; border: 1px solid #c7d2fe; padding: 10px 18px; border-radius: var(--radius-md); text-align: left; min-width: 150px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center;">
              <div style="font-size: 0.75rem; font-weight: 500; color: #4f46e5; text-transform: uppercase; letter-spacing: 0.5px;">Venta Total (Con IGV)</div>
              <div style="font-size: 1.35rem; font-weight: 500; color: #1e1b4b; margin-top: 2px;">S/. {{ (stats.totalBruto || 0).toFixed(2) }}</div>
            </div>
            <div class="kpi-total-card neto" style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px 18px; border-radius: var(--radius-md); text-align: left; min-width: 150px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: center;">
              <div style="font-size: 0.75rem; font-weight: 500; color: #16a34a; text-transform: uppercase; letter-spacing: 0.5px;">Ganancia Bruta (Pre-Impuesto)</div>
              <div style="font-size: 1.35rem; font-weight: 500; color: #14532d; margin-top: 2px;">S/. {{ (stats.gananciaBruta || 0).toFixed(2) }}</div>
            </div>
          </div>
        </div>
        
        <!-- Filters & Period Tabs -->
        <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
          <div v-if="selectedPeriod === 'semanal'" class="date-picker-wrapper" style="display: flex; align-items: center; gap: 8px;">
            <label for="history-date" style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">Filtrar por Semana:</label>
            <input 
              type="date" 
              id="history-date" 
              v-model="selectedDate" 
              @change="fetchStats"
              class="form-input" 
              style="padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); max-width: 160px;" 
            />
          </div>
          <div v-if="selectedPeriod === 'mensual'" class="date-picker-wrapper" style="display: flex; align-items: center; gap: 8px;">
            <label for="history-month" style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">Filtrar por Mes:</label>
            <input 
              type="month" 
              id="history-month" 
              v-model="selectedMonth" 
              @change="onMonthChange"
              class="form-input" 
              style="padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); max-width: 160px;" 
            />
          </div>
          <div v-if="selectedPeriod === 'anual'" class="date-picker-wrapper" style="display: flex; align-items: center; gap: 8px;">
            <label for="history-year" style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">Filtrar por Año:</label>
            <select 
              id="history-year" 
              v-model="selectedYear" 
              @change="onYearChange"
              class="form-input" 
              style="padding: 8px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); max-width: 120px;"
            >
              <option v-for="yr in availableYears" :key="yr" :value="yr">{{ yr }}</option>
            </select>
          </div>

          <div class="period-tabs">
            <button 
              :class="['tab-btn', { active: selectedPeriod === 'semanal' }]" 
              @click="setPeriod('semanal')"
            >
              ◦ Semanal
            </button>
            <button 
              :class="['tab-btn', { active: selectedPeriod === 'mensual' }]" 
              @click="setPeriod('mensual')"
            >
              ◫ Mensual
            </button>
            <button 
              :class="['tab-btn', { active: selectedPeriod === 'anual' }]" 
              @click="setPeriod('anual')"
            >
              ▸ Anual
            </button>
          </div>
        </div>
      </header>

      <div v-if="loading" style="display: flex; justify-content: center; padding: 60px;">
        <HamsterLoader v-if="loading" label="Analizando datos del historial..." />
      </div>


      <!-- Loading state -->
<template v-else>
        <!-- Charts Section (Aligned layout like daily dashboard) -->
        <div class="charts-layout charts-container">
          <!-- Periodic Sales Trend (Bar Chart - Enlarged) -->
          <div class="card chart-card">
            <h2 class="section-title">
              ◫ Tendencia de Ventas ({{ selectedPeriodText }})
            </h2>
            <div v-if="!stats.ventasPeriodo || stats.ventasPeriodo.length === 0" class="empty-state">
              No hay datos de ventas registrados para este periodo.
            </div>
            <div v-else class="chart-wrapper">
            <svg class="line-chart-svg" viewBox="0 0 800 240">
              <defs>
                <linearGradient id="area-grad-hourly-pro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.22" />
                  <stop offset="60%" stop-color="#6366f1" stop-opacity="0.06" />
                  <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0" />
                </linearGradient>

                <linearGradient id="line-grad-hourly-pro" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#4338ca" />
                  <stop offset="50%" stop-color="#6366f1" />
                  <stop offset="100%" stop-color="#818cf8" />
                </linearGradient>

                <filter id="curve-glow" x="-10%" y="-20%" width="120%" height="150%">
                  <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#4f46e5" flood-opacity="0.28" />
                </filter>

                <filter id="tooltip-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.25" />
                </filter>
                
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
              <text x="56" y="39" class="chart-axis-label" text-anchor="end">S/.{{ (maxVenta).toFixed(0) }}</text>
              <text x="56" y="90" class="chart-axis-label" text-anchor="end">S/.{{ (maxVenta * 0.66).toFixed(0) }}</text>
              <text x="56" y="142" class="chart-axis-label" text-anchor="end">S/.{{ (maxVenta * 0.33).toFixed(0) }}</text>
              <text x="56" y="194" class="chart-axis-label zero" text-anchor="end">0</text>

              <!-- Smooth Area Gradient Fill -->
              <path :d="periodAreaPath" fill="url(#area-grad-hourly-pro)" />

              <!-- Smooth Main Curve Line with Glow -->
              <path :d="periodLinePath" fill="none" stroke="url(#line-grad-hourly-pro)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#curve-glow)" />

              <!-- Peak Callouts (Visible when not actively hovering another point) -->
              <g v-if="hoveredPeriodIndex === null">
                <g v-for="(p, idx) in activePointsWithSales" :key="'active-point-' + idx">
                  <circle :cx="p.x" :cy="p.y" r="8" fill="#4f46e5" fill-opacity="0.18" />
                  <circle :cx="p.x" :cy="p.y" r="4.5" fill="#4f46e5" stroke="#ffffff" stroke-width="2.5" />
                  <g :transform="`translate(${p.x - 38}, ${p.y - 32})`">
                    <rect width="76" height="22" rx="11" fill="#1e1b4b" filter="url(#badge-shadow)" />
                    <text x="38" y="15" fill="#ffffff" font-size="10.5" font-weight="700" text-anchor="middle">
                      S/. {{ p.val.toFixed(0) }}
                    </text>
                  </g>
                </g>
              </g>

              <!-- X-Axis Labels -->
              <g v-for="(point, idx) in chartPoints" :key="'axis-x-' + idx">
                <line :x1="point.x" y1="190" :x2="point.x" :y2="194" stroke="#cbd5e1" stroke-width="1" />
                <g v-if="selectedPeriod === 'semanal'">
                  <text :x="point.x" y="210" :class="['chart-axis-label-x', { 'label-active': hoveredPeriodIndex === idx }]" text-anchor="middle">{{ formatEtiqueta(point.etiqueta) }}</text>
                  <text :x="point.x" y="222" :class="['chart-axis-label-x font-bold', { 'label-active': hoveredPeriodIndex === idx }]" text-anchor="middle">{{ formatDayName(point.diaSemana) }}</text>
                </g>
                <g v-else-if="selectedPeriod === 'mensual'">
                  <text :x="point.x" y="210" :class="['chart-axis-label-x font-bold', { 'label-active': hoveredPeriodIndex === idx }]" text-anchor="middle">{{ point.etiqueta }}</text>
                  <text :x="point.x" y="222" class="chart-axis-label-x" text-anchor="middle" style="font-size: 9px;">{{ point.rango }}</text>
                </g>
                <g v-else>
                  <text v-if="chartPoints.length <= 12 || idx % 5 === 0" :x="point.x" y="210" :class="['chart-axis-label-x', { 'label-active': hoveredPeriodIndex === idx }]" text-anchor="middle">{{ formatEtiqueta(point.etiqueta) }}</text>
                </g>
              </g>

              <!-- Interactive Hover Guideline & Cursor Pin -->
              <g v-if="hoveredPeriodPoint" pointer-events="none">
                <!-- Vertical Guideline -->
                <line :x1="hoveredPeriodPoint.x" y1="30" :x2="hoveredPeriodPoint.x" y2="190" stroke="#6366f1" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.8" />
                
                <!-- Pulsing Cursor Circle -->
                <circle :cx="hoveredPeriodPoint.x" :cy="hoveredPeriodPoint.y" r="9" fill="#6366f1" fill-opacity="0.22" />
                <circle :cx="hoveredPeriodPoint.x" :cy="hoveredPeriodPoint.y" r="4.5" fill="#ffffff" stroke="#4f46e5" stroke-width="3" />

                <!-- Rich SaaS Floating Tooltip Card -->
                <g :transform="`translate(${getTooltipX(hoveredPeriodPoint)}, ${getTooltipY(hoveredPeriodPoint)})`">
                  <rect width="140" height="58" rx="8" fill="#0f172a" fill-opacity="0.96" stroke="#334155" stroke-width="1" filter="url(#tooltip-shadow)" />
                  <text x="12" y="18" fill="#94a3b8" font-size="10" font-weight="600" letter-spacing="0.5">PERIODO: {{ hoveredPeriodPoint.etiqueta }}</text>
                  <text x="12" y="36" fill="#38bdf8" font-size="13" font-weight="800">S/. {{ hoveredPeriodPoint.val.toFixed(2) }}</text>
                  <circle :cx="16" :cy="48" r="3" :fill="hoveredPeriodPoint.val > 0 ? '#10b981' : '#64748b'" />
                  <text x="24" y="51" :fill="hoveredPeriodPoint.val > 0 ? '#34d399' : '#94a3b8'" font-size="9" font-weight="500">
                    {{ hoveredPeriodPoint.val > 0 ? `${hoveredPeriodPoint.cantidad} ventas registradas` : 'Sin movimientos' }}
                  </text>
                </g>
              </g>

              <!-- Invisible full-height hover targets for silky smooth mouse tracking -->
              <g class="hover-detector-group">
                <rect v-for="(point, idx) in chartPoints"
                      :key="'hover-rect-' + idx"
                      :x="point.x - 15.5"
                      y="20"
                      width="31"
                      height="180"
                      fill="transparent"
                      style="cursor: crosshair;"
                      @mouseenter="hoveredPeriodIndex = idx"
                      @mouseleave="hoveredPeriodIndex = null" />
              </g>
            </svg>
          </div>
        </div>

        <!-- Payment Methods Pie Chart -->
        <div class="card chart-card">
          <h2 class="section-title">▪ Métodos de Pago (Filtrado)</h2>
          <div v-if="!stats.metodosPago || stats.metodosPago.length === 0" class="empty-state">
            Sin ventas en este periodo.
          </div>
          <div v-else class="donut-chart-layout">
            <div class="pie-wrapper">
              <svg class="pie-chart-svg" viewBox="-10 -10 140 140">
                <defs>
                  <filter id="pie-center-shadow-period" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.12"/>
                  </filter>
                </defs>
                <g v-for="(seg, idx) in pieSegments" :key="idx" 
                   class="pie-slice-group"
                   :style="{ '--dx': seg.dx + 'px', '--dy': seg.dy + 'px' }"
                   @mouseenter="hoveredSegment = seg"
                   @mouseleave="hoveredSegment = null">
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
                <circle cx="60" cy="60" r="24" fill="#ffffff" filter="url(#pie-center-shadow-period)" />
                
                <!-- Central Text (Hover & Total Info) -->
                <g v-if="hoveredSegment">
                  <text x="60" y="49" font-size="7" font-weight="800" fill="#1e1b4b" text-anchor="middle">
                    {{ hoveredSegment.metodo }}
                  </text>
                  <text x="60" y="60" font-size="6.5" font-weight="700" fill="#4f46e5" text-anchor="middle">
                    S/.{{ hoveredSegment.total.toFixed(2) }}
                  </text>
                  <text x="60" y="71" font-size="7" font-weight="800" :fill="hoveredSegment.color" text-anchor="middle">
                    {{ hoveredSegment.percent }}%
                  </text>
                </g>
                <g v-else>
                  <text x="60" y="52" font-size="6.5" font-weight="700" fill="#4f46e5" text-anchor="middle" style="letter-spacing: 0.2px;">
                    MÉTODOS
                  </text>
                  <text x="60" y="63" font-size="7" font-weight="800" fill="#1e1b4b" text-anchor="middle">
                    S/.{{ totalPagoPeriodo.toFixed(2) }}
                  </text>
                  <text x="60" y="72" font-size="5" font-weight="600" fill="#94a3b8" text-anchor="middle">
                    FILTRADO
                  </text>
                </g>
              </svg>
            </div>

            <!-- Sleek Bottom Legend -->
            <div class="donut-legend">
              <div v-for="(seg, idx) in pieSegments" :key="'leg-' + idx" class="legend-item" @mouseenter="hoveredSegment = seg" @mouseleave="hoveredSegment = null">
                <span class="legend-bullet" :style="{ backgroundColor: seg.color }"></span>
                <span class="legend-label">{{ seg.metodo }}:</span>
                <span class="legend-value">S/. {{ seg.total.toFixed(2) }}</span>
                <span class="legend-percent">({{ seg.percent }}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail & Top Selling Products Grid -->
      <div class="grid grid-1 detail-container" style="margin-top: 24px;">
        <!-- Top Selling Products -->
        <div class="card font-card">
          <h2 class="section-title">🔥 Productos Más Vendidos en el Periodo</h2>
          <div v-if="!stats.productosMasVendidos || stats.productosMasVendidos.length === 0" class="empty-state">
            No hay registros de ventas para procesar en este periodo.
          </div>
          <div v-else class="top-products-list">
            <div v-for="(p, idx) in stats.productosMasVendidos" :key="idx" class="top-product-item">
              <div class="top-product-info">
                <div class="top-product-name-container">
                  <span class="product-rank">#{{ idx + 1 }}</span>
                  <span class="product-name font-bold">{{ p.producto }}</span>
                </div>
                <span class="product-quantity font-bold">{{ p.cantidad }} unidades</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" :style="{ width: getProductWidthPercent(p.cantidad) + '%', backgroundColor: getRankColor(idx) }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </template>
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

const selectedPeriod = ref('semanal')
const loading = ref(false)

const getTodayFormatted = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const selectedDate = ref(getTodayFormatted())
const selectedMonth = ref(new Date().toISOString().substring(0, 7)) // "YYYY-MM"
const selectedYear = ref(new Date().getFullYear())

const availableYears = computed(() => {
  const current = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, i) => current - i)
})

const stats = ref({
  totalBruto: 0,
  totalNeto: 0,
  gananciaBruta: 0,
  rangoTexto: '',
  ventasPeriodo: [],
  metodosPago: [],
  productosMasVendidos: []
})

const hoveredSegment = ref(null)

const totalPagoPeriodo = computed(() => {
  if (!stats.value.metodosPago || stats.value.metodosPago.length === 0) return 0
  return stats.value.metodosPago.reduce((acc, m) => acc + m.total, 0)
})

const selectedPeriodText = computed(() => {
  if (selectedPeriod.value === 'semanal') return 'Lunes a Domingo'
  if (selectedPeriod.value === 'anual') return 'Meses del Año'
  return 'Semanas del Mes'
})

const setPeriod = (period) => {
  selectedPeriod.value = period
  // Sincronizar fecha según periodo
  if (period === 'semanal') {
    selectedDate.value = getTodayFormatted()
  } else if (period === 'mensual') {
    const d = new Date()
    selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    selectedDate.value = `${selectedMonth.value}-01`
  } else if (period === 'anual') {
    selectedYear.value = new Date().getFullYear()
    selectedDate.value = `${selectedYear.value}-01-01`
  }
  fetchStats()
}

const onMonthChange = () => {
  if (selectedMonth.value) {
    selectedDate.value = `${selectedMonth.value}-01`
    fetchStats()
  }
}

const onYearChange = () => {
  if (selectedYear.value) {
    selectedDate.value = `${selectedYear.value}-01-01`
    fetchStats()
  }
}

const fetchStats = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API_URL}/api/dashboard/history?period=${selectedPeriod.value}&fecha=${selectedDate.value}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    stats.value = {
      totalBruto: data.totalBruto || 0,
      totalNeto: data.totalNeto || 0,
      gananciaBruta: data.gananciaBruta || 0,
      rangoTexto: data.rangoTexto || '',
      ventasPeriodo: data.ventasPeriodo || [],
      metodosPago: data.metodosPago || [],
      productosMasVendidos: data.productosMasVendidos || []
    }
  } catch (err) {
    console.error('Error fetching business history stats', err)
  } finally {
    loading.value = false
  }
}

const processedVentasPeriodo = computed(() => {
  if (!stats.value.ventasPeriodo || stats.value.ventasPeriodo.length === 0) return []
  if (selectedPeriod.value !== 'mensual') return stats.value.ventasPeriodo

  const weeks = [
    { etiqueta: 'Semana 1', total: 0, cantidad: 0, rango: '01 al 07' },
    { etiqueta: 'Semana 2', total: 0, cantidad: 0, rango: '08 al 14' },
    { etiqueta: 'Semana 3', total: 0, cantidad: 0, rango: '15 al 21' },
    { etiqueta: 'Semana 4', total: 0, cantidad: 0, rango: '22 al 28' },
    { etiqueta: 'Semana 5', total: 0, cantidad: 0, rango: '29 en adelante' }
  ]

  stats.value.ventasPeriodo.forEach((v) => {
    const parts = v.etiqueta.split('-')
    const day = parseInt(parts[0], 10)
    if (!isNaN(day)) {
      if (day <= 7) {
        weeks[0].total += v.total
        weeks[0].cantidad += v.cantidad
      } else if (day <= 14) {
        weeks[1].total += v.total
        weeks[1].cantidad += v.cantidad
      } else if (day <= 21) {
        weeks[2].total += v.total
        weeks[2].cantidad += v.cantidad
      } else if (day <= 28) {
        weeks[3].total += v.total
        weeks[3].cantidad += v.cantidad
      } else {
        weeks[4].total += v.total
        weeks[4].cantidad += v.cantidad
      }
    }
  })

  // Si el mes tiene menos de 29 días, quitamos la Semana 5
  if (stats.value.ventasPeriodo.length < 29) {
    return weeks.slice(0, 4)
  }
  return weeks
})

// Bar Chart Computed Helpers
const maxVenta = computed(() => {
  const list = processedVentasPeriodo.value
  if (!list || list.length === 0) return 1000
  const max = Math.max(...list.map(v => v.total))
  return max === 0 ? 1000 : max * 1.15 // 15% headroom
})

const barWidth = computed(() => {
  const count = processedVentasPeriodo.value.length
  if (count <= 5) return 40
  if (count <= 7) return 32
  if (count <= 12) return 20
  return 6
})

const chartPoints = computed(() => {
  const list = processedVentasPeriodo.value
  if (!list || list.length === 0) return []
  const count = list.length
  
  const chartWidth = 715 // modern width
  const startX = 65
  const baselineY = 190
  const plotHeight = 155
  const maxVal = maxVenta.value || 100
  const spacing = count > 1 ? chartWidth / (count - 1) : chartWidth
  
  return list.map((v, index) => {
    const x = startX + index * spacing
    const y = baselineY - (v.total / maxVal) * plotHeight
    return { 
      x, 
      y, 
      val: v.total, 
      cantidad: v.cantidad, 
      etiqueta: v.etiqueta, 
      rango: v.rango || '',
      diaSemana: v.diaSemana || '' 
    }
  })
})

const hoveredPeriodIndex = ref(null)

const hoveredPeriodPoint = computed(() => {
  if (hoveredPeriodIndex.value === null || !chartPoints.value) return null
  return chartPoints.value[hoveredPeriodIndex.value] || null
})

const activePointsWithSales = computed(() => {
  return chartPoints.value.filter(p => p.val > 0)
})

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

const periodLinePath = computed(() => {
  return generateSmoothSpline(chartPoints.value)
})

const periodAreaPath = computed(() => {
  const points = chartPoints.value
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

// Formatting functions
const formatDayName = (dayStr) => {
  if (!dayStr) return ''
  const lower = dayStr.toLowerCase().trim()
  const mapping = {
    'monday': 'Lun.',
    'tuesday': 'Mar.',
    'wednesday': 'Mié.',
    'thursday': 'Jue.',
    'friday': 'Vie.',
    'saturday': 'Sáb.',
    'sunday': 'Dom.',
    'lunes': 'Lun.',
    'martes': 'Mar.',
    'miércoles': 'Mié.',
    'miercoles': 'Mié.',
    'jueves': 'Jue.',
    'viernes': 'Vie.',
    'sábado': 'Sáb.',
    'sabado': 'Sáb.',
    'domingo': 'Dom.'
  }
  return mapping[lower] || dayStr.substring(0, 3) + '.'
}

const formatEtiqueta = (etiquetaStr) => {
  if (!etiquetaStr) return ''
  const months = {
    'jan': 'Ene',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Abr',
    'may': 'May',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Ago',
    'sep': 'Sep',
    'oct': 'Oct',
    'nov': 'Nov',
    'dec': 'Dic'
  }
  let res = etiquetaStr.toLowerCase()
  Object.keys(months).forEach(eng => {
    res = res.replace(eng, months[eng])
  })
  return res.split('-').map(part => {
    if (isNaN(part)) {
      return part.charAt(0).toUpperCase() + part.slice(1)
    }
    return part
  }).join('-')
}

// Pie Chart Computed Helpers
const pieSegments = computed(() => {
  if (!stats.value.metodosPago || stats.value.metodosPago.length === 0) return []
  const totalAmount = stats.value.metodosPago.reduce((acc, m) => acc + m.total, 0)
  if (totalAmount === 0) return []
  
  let cumulativePercent = 0
  const colors = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4']
  
  return stats.value.metodosPago.map((m, index) => {
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

const getProductWidthPercent = (qty) => {
  if (!stats.value.productosMasVendidos || stats.value.productosMasVendidos.length === 0) return 0
  const maxQty = Math.max(...stats.value.productosMasVendidos.map(p => p.cantidad))
  return maxQty === 0 ? 0 : (qty / maxQty) * 100
}

const getRankColor = (idx) => {
  const colors = ['var(--primary-hover)', 'var(--secondary)', 'var(--success)', 'var(--warning)', 'var(--danger)']
  return colors[idx % colors.length]
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.content-header {
  margin-bottom: 25px;
  text-align: left;
}

.charts-container {
  margin-bottom: 24px;
}

.charts-layout {
  display: grid;
  grid-template-columns: 2.3fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .charts-layout {
    grid-template-columns: 1fr;
  }
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

.chart-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 22vh;      /* ~200px en 900px de altura */
}

.line-chart-svg {
  width: 100%;
  max-height: 32vh;      /* ~280px en 900px de altura */
}

.chart-axis-label {
  font-size: 10px;
  fill: var(--text-muted);
  font-weight: 500;
}

.chart-tooltip-text {
  font-size: 9px;
  fill: var(--text-main);
  font-weight: 500;
}

.chart-bar {
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  fill: var(--primary-hover);
  filter: drop-shadow(0px 4px 6px rgba(99, 102, 241, 0.4));
  opacity: 0.95;
}

/* Pie Chart Styling */
.donut-chart-layout {
  display: flex;
  align-items: center;
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

/* Top Selling Products styling */
.top-products-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.top-product-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.top-product-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top-product-name-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-rank {
  background: var(--bg-app);
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.product-name {
  font-size: 0.95rem;
  color: var(--text-main);
}

.product-quantity {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.progress-bar-container {
  width: 100%;
  height: 10px;
  background: var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: var(--radius-sm);
  transition: width 1s ease-in-out;
}

.empty-state {
  color: var(--text-muted);
  padding: 30px;
  text-align: center;
}

/* Period Tabs */
.period-tabs {
  display: flex;
  background: #f1f2f5;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 4px;
}

.tab-btn {
  background: transparent;
  border: none;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tab-btn:hover {
  color: var(--text-main);
}

.tab-btn.active {
  background: #ffffff;
  color: var(--primary-hover);
  box-shadow: var(--shadow-sm);
}
</style>
