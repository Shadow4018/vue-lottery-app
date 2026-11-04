<script setup lang="ts">
import AppHeader from '@/widgets/app-header/ui/AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="container app-container app-main">
      <slot />
    </main>
  </div>
</template>
