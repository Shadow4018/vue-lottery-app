<script setup lang="ts">
import { AppButton } from '@/shared/ui'
</script>

<template>
  <section class="card app-card text-center py-5">
    <h1 class="display-4">404</h1>
    <p class="text-body-secondary">The page you are looking for does not exist.</p>
    <div>
      <AppButton :to="{ name: 'home' }" label="Back to home" />
    </div>
  </section>
</template>
