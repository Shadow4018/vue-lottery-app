<script setup lang="ts">
import AppLogo from '@/widgets/app-header/ui/AppLogo.vue'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__box">
      <AppLogo class="auth-layout__logo" />
      <slot />
    </div>
  </div>
</template>
