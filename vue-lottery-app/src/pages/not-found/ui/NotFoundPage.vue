<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="card app-card text-center py-5">
    <h1 class="display-4">404</h1>
    <p class="text-body-secondary">The page you are looking for does not exist.</p>
    <div>
      <RouterLink :to="{ name: 'home' }" class="btn btn-primary">Back to home</RouterLink>
    </div>
  </section>
</template>
