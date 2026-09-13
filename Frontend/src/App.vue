<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const route = useRoute()
let pollTimer = null

const updatePendingCount = () => {
  if (authStore.isAuthenticated && authStore.hasPermission('pedidos_web')) {
    authStore.fetchPendingOrdersCount()
  }
}

watch(() => route.path, () => {
  updatePendingCount()
})

onMounted(() => {
  updatePendingCount()
  // Sincronización periódica cada 20 segundos
  pollTimer = setInterval(updatePendingCount, 20000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<style>
/* Global settings */
</style>
