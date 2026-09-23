<template>
  <HamsterLoader :label="label" />
</template>

<script setup>
import HamsterLoader from './HamsterLoader.vue'

defineProps({
  label: {
    type: String,
    default: 'Cargando datos...'
  }
})
</script>
