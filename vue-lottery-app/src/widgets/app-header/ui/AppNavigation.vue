<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { LogoutButton } from '@/features/auth'
import { ThemeSwitcher } from '@/features/theme-switcher'

const { isAuthenticated } = storeToRefs(useSessionStore())
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
    <ThemeSwitcher />
    <LogoutButton v-if="isAuthenticated" />
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

<style scoped lang="scss">
.app-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.app-nav__link {
  padding: 0.4rem 0.75rem;
  border-bottom: 2px solid transparent;
  color: var(--bs-body-color);
  text-decoration: none;

  &:hover {
    color: var(--bs-primary);
  }

  // активний пункт меню
  &.is-active {
    border-bottom-color: var(--bs-primary);
    color: var(--bs-primary);
    font-weight: 700;
  }
}
</style>
