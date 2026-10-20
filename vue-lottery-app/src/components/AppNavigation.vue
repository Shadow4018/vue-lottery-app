<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout(): Promise<void> {
  auth.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <nav class="app-nav" aria-label="Main navigation">
    <!-- активний пункт отримує клас is-active (active-class / exact-active-class) -->
    <RouterLink
      :to="{ name: 'home' }"
      class="app-nav__link"
      active-class="is-active"
      exact-active-class="is-active"
    >
      Home
    </RouterLink>
    <RouterLink
      :to="{ name: 'about' }"
      class="app-nav__link"
      active-class="is-active"
      exact-active-class="is-active"
    >
      About author
    </RouterLink>
    <RouterLink
      :to="{ name: 'users' }"
      class="app-nav__link"
      active-class="is-active"
      exact-active-class="is-active"
    >
      Users
    </RouterLink>
    <button v-if="auth.isAuthenticated" type="button" class="app-nav__link" @click="handleLogout">
      Logout
    </button>
    <RouterLink
      v-else
      :to="{ name: 'login' }"
      class="app-nav__link"
      active-class="is-active"
      exact-active-class="is-active"
    >
      Login
    </RouterLink>
  </nav>
</template>
