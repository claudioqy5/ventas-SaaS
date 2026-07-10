<template>
  <div class="login-container">
    <div class="login-card card">
      <div class="header">
        <h1 class="brand-title">🍦 VentasSaaS</h1>
        <p class="text-subtitle">{{ isRegister ? 'Solicita tu cuenta de negocio' : 'Inicia sesión en tu punto de venta' }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="grid">
        <!-- Campos adicionales para el registro de negocio -->
        <template v-if="isRegister">
          <div class="field">
            <label>Nombre del Negocio</label>
            <input v-model="form.nombreEmpresa" type="text" placeholder="Mi Tienda Pastel" required />
          </div>
          <div class="field">
            <label>Tu Nombre Completo</label>
            <input v-model="form.nombrePropietario" type="text" placeholder="Juan Pérez" required />
          </div>
          <div class="field">
            <label>Teléfono de Contacto</label>
            <input v-model="form.telefono" type="text" placeholder="987654321" required />
          </div>
        </template>

        <!-- Campos generales de acceso -->
        <div class="field">
          <label>Correo Electrónico</label>
          <input v-model="form.correo" type="email" placeholder="ejemplo@correo.com" required />
        </div>

        <div v-if="!isRegister" class="field">
          <label>Contraseña</label>
          <input v-model="form.clave" type="password" placeholder="••••••••" required />
        </div>

        <div v-if="isRegister" class="field">
          <label>Cuéntanos sobre tu negocio (Opcional)</label>
          <textarea v-model="form.mensaje" placeholder="Mensaje para el administrador..." rows="3" style="width: 100%; border-radius: var(--radius-sm); border: 1px solid var(--border-color); padding: 8px 12px; font-family: var(--font-family);"></textarea>
        </div>

        <div class="actions">
          <button type="submit" class="btn btn-primary w-full" :disabled="loading">
            {{ loading ? 'Procesando...' : (isRegister ? 'Enviar Solicitud de Registro' : 'Iniciar Sesión') }}
          </button>
        </div>
      </form>

      <div class="footer">
        <a href="#" @click.prevent="isRegister = !isRegister">
          {{ isRegister ? '¿Ya tienes cuenta? Inicia Sesión' : '¿Quieres usarlo en tu tienda? Regístrate aquí' }}
        </a>
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
  telefono: '',
  correo: '',
  clave: '',
  mensaje: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isRegister.value) {
      const res = await fetch(`${API_URL}/api/registerrequests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreEmpresa: form.nombreEmpresa,
          nombrePropietario: form.nombrePropietario,
          correoPropietario: form.correo,
          telefono: form.telefono,
          mensaje: form.mensaje
        })
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Error al enviar la solicitud.')
      }
      alert('¡Tu solicitud de registro ha sido enviada con éxito! Nos pondremos en contacto contigo pronto.')
      isRegister.value = false
      form.nombreEmpresa = ''
      form.nombrePropietario = ''
      form.telefono = ''
      form.mensaje = ''
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
