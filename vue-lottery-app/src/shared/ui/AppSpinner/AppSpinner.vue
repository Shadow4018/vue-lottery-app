<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'
</script>

<template>
  <div class="app-spinner">
    <ProgressSpinner stroke-width="4" aria-label="Loading" />
  </div>
</template>

<style scoped lang="scss">
.app-spinner {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;

  :deep(.p-progressspinner) {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
