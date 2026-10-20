<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink :to="{ name: 'home' }" class="app-logo" aria-label="Vue Lottery - home">
    <span class="app-logo__mark" aria-hidden="true">VL</span>
    <span class="app-logo__text">Vue Lottery</span>
  </RouterLink>
</template>
