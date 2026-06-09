import { defineStore } from 'pinia'

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
  },
  actions: {
    async login(correo, clave) {
      try {
        const response = await fetch('http://localhost:5246/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, clave }),
        })
        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || 'Error al iniciar sesión.')
        }
        const data = await response.json()
        this.token = data.token
        this.user = data.user
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        return true
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async registerEmpresa(nombreEmpresa, planSuscripcion, nombrePropietario, correoPropietario, clavePropietario) {
      try {
        const response = await fetch('http://localhost:5246/api/auth/registrar-empresa', {
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
      if (this.isSuperadmin || this.isEmpresaOwner) return true
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
