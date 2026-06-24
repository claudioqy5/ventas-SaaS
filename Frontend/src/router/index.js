import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import POS from '../views/POS.vue'
import SalesHistory from '../views/SalesHistory.vue'
import Products from '../views/Products.vue'
import Categories from '../views/Categories.vue'
import Clients from '../views/Clients.vue'
import Suppliers from '../views/Suppliers.vue'
import Purchases from '../views/Purchases.vue'
import Users from '../views/Users.vue'

const routes = [
  { path: '/login', component: Login, name: 'Login' },  
  { 
    path: '/dashboard', 
    component: Dashboard, 
    name: 'Dashboard',
    meta: { requiresAuth: true, permission: 'dashboard' } 
  },
  { 
    path: '/pos', 
    component: POS, 
    name: 'POS',
    meta: { requiresAuth: true, permission: 'ventas' } 
  },
  { 
    path: '/sales-history', 
    component: SalesHistory, 
    name: 'SalesHistory',
    meta: { requiresAuth: true, permission: 'historial_ventas' } 
  },
  { 
    path: '/products', 
    component: Products, 
    name: 'Products',
    meta: { requiresAuth: true, permission: 'productos' } 
  },
  { 
    path: '/categories', 
    component: Categories, 
    name: 'Categories',
    meta: { requiresAuth: true, permission: 'productos' } 
  },
  { 
    path: '/clients', 
    component: Clients, 
    name: 'Clients',
    meta: { requiresAuth: true, permission: 'clientes' } 
  },
  { 
    path: '/suppliers', 
    component: Suppliers, 
    name: 'Suppliers',
    meta: { requiresAuth: true, permission: 'proveedores' } 
  },
  { 
    path: '/purchases', 
    component: Purchases, 
    name: 'Purchases',
    meta: { requiresAuth: true, permission: 'compras' } 
  },
  { 
    path: '/users', 
    component: Users, 
    name: 'Users',
    meta: { requiresAuth: true } // Solo accesible para Propietarios y Superadmin
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (authStore.isAuthenticated && authStore.isSuperadmin && to.path !== '/users') {
    next('/users')
  } else if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
    if (authStore.hasPermission('dashboard')) {
      next('/dashboard')
    } else if (authStore.hasPermission('ventas')) {
      next('/pos')
    } else {
      authStore.logout()
      next('/login')
    }
  } else if (to.path === '/users' && !authStore.isEmpresaOwner && !authStore.isSuperadmin) {
    next('/dashboard')
  } else {
    next()
  }
})
export default router
