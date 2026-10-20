<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Component } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AuthLayout from './layouts/AuthLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import { useAuthStore } from './stores/auth'

const LAYOUTS: Record<'default' | 'auth', Component> = {
  default: DefaultLayout,
  auth: AuthLayout,
}

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// layout вибирається за meta.layout поточного маршруту
const layout = computed(() => LAYOUTS[route.meta.layout ?? 'default'])

// сесію завершив сервер (не вдалося оновити токен) - відправляємо на логін із поверненням назад
watch(
  () => auth.sessionExpired,
  (expired) => {
    if (expired && route.meta.requiresAuth) {
      void router.push({ name: 'login', query: { redirect: route.fullPath } })
    }
  },
)
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
