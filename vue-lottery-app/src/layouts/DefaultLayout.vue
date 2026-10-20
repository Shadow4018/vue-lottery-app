<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="container app-container app-main">
      <slot />
    </main>
  </div>
</template>
