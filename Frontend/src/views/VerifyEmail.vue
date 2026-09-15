<template>
  <div class="verify-container">
    <div class="card verify-card">
      <h2 class="title">Verificación de Correo</h2>
      
      <div v-if="loading" class="state loading">
        <p>Verificando tu cuenta, por favor espera...</p>
      </div>

      <div v-else-if="success" class="state success">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <p>{{ message }}</p>
        <router-link to="/login" class="btn btn-primary mt-4">Ir a Iniciar Sesión</router-link>
      </div>

      <div v-else class="state error">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p>{{ message }}</p>
        <router-link to="/login" class="btn btn-secondary mt-4">Volver</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { API_URL } from '../config'

const route = useRoute()
const loading = ref(true)
const success = ref(false)
const message = ref('')

onMounted(async () => {
  const token = route.query.token
  if (!token) {
    loading.value = false
    success.value = false
    message.value = 'No se proporcionó ningún token de verificación.'
    return
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`)
    const data = await res.json()
    
    if (res.ok) {
      success.value = true
      message.value = '¡Tu correo ha sido verificado con éxito! Ya puedes iniciar sesión.'
    } else {
      success.value = false
      message.value = data.message || 'El enlace es inválido o ya ha expirado.'
    }
  } catch (error) {
    success.value = false
    message.value = 'Error de conexión al verificar el correo.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.verify-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-app);
  padding: 20px;
}
.verify-card {
  max-width: 400px;
  width: 100%;
  text-align: center;
  padding: 40px 20px;
}
.title {
  margin-bottom: 24px;
  color: var(--text-main);
}
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.state p {
  color: var(--text-muted);
  font-size: 1.1rem;
}
.mt-4 {
  margin-top: 16px;
}
</style>
