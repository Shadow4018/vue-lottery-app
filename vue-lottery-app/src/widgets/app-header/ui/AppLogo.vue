<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink :to="{ name: 'home' }" class="app-logo" aria-label="Vue Lottery - home">
    <span class="app-logo__mark" aria-hidden="true">VL</span>
    <span class="app-logo__text">Vue Lottery</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--bs-body-color);
  font-weight: 700;
  text-decoration: none;

  &:hover {
    color: var(--bs-primary);
  }
}

.app-logo__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--bs-primary);
  color: #fff;
  font-size: 0.8rem;
}
</style>
