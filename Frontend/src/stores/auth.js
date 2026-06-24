import { defineStore } from 'pinia'
import { API_URL } from '../config'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state) => state.user?.rol || null,
    permissions: (state) => state.user?.permisos || [],
    isSuperadmin: (state) => state.user?.rol === 'Superadmin',
    isEmpresaOwner: (state) => state.user?.rol === 'EmpresaOwner',
    // Traduce el rol tecnico del backend a un nombre legible en español
    rolEnEspanol: (state) => {
      const roles = {
        'Superadmin': 'Superadministrador',
        'EmpresaOwner': 'Administrador',
        'Employee': 'Empleado',
      }
      return roles[state.user?.rol] || state.user?.rol || 'Usuario'
    },
  },
  actions: {
    async login(correo, clave) {
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, clave }),
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || 'Error al iniciar sesión.')
        }
        const data = await response.json()
        const normalizedUser = {
          id: data.user.id || data.user.Id,
          empresaId: data.user.empresaId || data.user.EmpresaId,
          nombre: data.user.nombre || data.user.Nombre,
          correo: data.user.correo || data.user.Correo,
          rol: data.user.rol || data.user.Rol,
          permisos: data.user.permisos || data.user.Permisos,
          nombreEmpresa: data.user.nombreEmpresa || data.user.NombreEmpresa
        }
        this.token = data.token
        this.user = normalizedUser
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(normalizedUser))
        return true
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async registerEmpresa(nombreEmpresa, planSuscripcion, nombrePropietario, correoPropietario, clavePropietario) {
      try {
        const response = await fetch(`${API_URL}/api/auth/registrar-empresa`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombreEmpresa, planSuscripcion, nombrePropietario, correoPropietario, clavePropietario }),
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || 'Error al registrar la empresa.')
        }
        return true
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    hasPermission(permission) {
      if (this.isEmpresaOwner) return true
      return this.permissions.includes(permission)
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
