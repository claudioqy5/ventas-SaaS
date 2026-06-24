<template>
  <div class="login-container">
    <div class="login-card card">
      <div class="header">
        <h1 class="brand-title">🍦 VentasSaaS</h1>
        <p class="text-subtitle">{{ isRegister ? 'Registra tu negocio e inventario' : 'Inicia sesión en tu punto de venta' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="grid">
        <!-- Register Mode Fields -->
        <template v-if="isRegister">
          <div class="field">
            <label>Nombre del Negocio</label>
            <input v-model="form.nombreEmpresa" type="text" placeholder="Mi Tienda Pastel" required />
          </div>
          <div class="field">
            <label>Tu Nombre Completo</label>
            <input v-model="form.nombrePropietario" type="text" placeholder="Juan Pérez" required />
          </div>
        </template>

        <!-- General Fields -->
        <div class="field">
          <label>Correo Electrónico</label>
          <input v-model="form.correo" type="email" placeholder="ejemplo@correo.com" required />
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input v-model="form.clave" type="password" placeholder="••••••••" required />
        </div>

        <div class="actions">
          <button type="submit" class="btn btn-primary w-full" :disabled="loading">
            {{ loading ? 'Procesando...' : (isRegister ? 'Crear Cuenta SaaS' : 'Iniciar Sesión') }}
          </button>
        </div>
      </form>

      <div class="footer">
        <a href="#" @click.prevent="isRegister = !isRegister">
          {{ isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿Quieres usarlo en tu tienda? Regístrate aquí' }}
        </a>
      </div>
      
      <!-- Seed Admin Trigger Helper for Developers -->
      <div v-if="!isRegister" class="seed-helper">
        <button @click="seedSuperadmin" class="btn btn-secondary w-full" style="font-size: 0.8rem; margin-top: 10px; padding: 6px;">
          Seed Superadmin Inicial (Dev)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { API_URL } from '../config'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isRegister = ref(false)
const loading = ref(false)
const form = reactive({
  nombreEmpresa: '',
  nombrePropietario: '',
  correo: '',
  clave: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isRegister.value) {
      await authStore.registerEmpresa(
        form.nombreEmpresa,
        'Premium',
        form.nombrePropietario,
        form.correo,
        form.clave
      )
      alert('¡Negocio registrado con éxito! Ahora inicia sesión.')
      isRegister.value = false
    } else {
      await authStore.login(form.correo, form.clave)
      router.push('/dashboard')
    }
  } catch (err) {
    alert(err.message || 'Ocurrió un error.')
  } finally {
    loading.value = false
  }
}

const seedSuperadmin = async () => {
  try {
    const res = await fetch(`${API_URL}/api/auth/seed-superadmin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: 'admin@ventassaas.com', clave: 'Password123!' })
    })
    const data = await res.json()
    alert(data.message)
  } catch (err) {
    alert('Error al realizar el seed.')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('../assets/saasfondo.jpg');
  background-size: cover;
  background-repeat: repeat-x;
  animation: scrollBackground 60s linear infinite;
  padding: 20px;
}

@keyframes scrollBackground {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 2000px 0;
  }
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.69);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.brand-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 5px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
}

.w-full {
  width: 100%;
}

.footer {
  text-align: center;
  margin-top: 20px;
}

.footer a {
  color: var(--text-muted);
  font-size: 0.9rem;
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.footer a:hover {
  color: var(--primary-hover);
}

.seed-helper {
  margin-top: 15px;
  border-top: 1px dashed var(--border-color);
  padding-top: 15px;
}
</style>
