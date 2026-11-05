<script setup lang="ts">
import AppLogo from './AppLogo.vue'
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <div class="container app-container d-flex align-items-center justify-content-between">
      <AppLogo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--bs-border-color);
  background-color: var(--app-surface);
}
</style>
