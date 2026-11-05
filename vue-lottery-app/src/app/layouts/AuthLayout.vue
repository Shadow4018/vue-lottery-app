<script setup lang="ts">
import { AppLogo } from '@/widgets/app-header'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__box">
      <AppLogo class="auth-layout__logo" />
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}

.auth-layout__box {
  width: 100%;
  max-width: 420px;
}

.auth-layout__logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
</style>
