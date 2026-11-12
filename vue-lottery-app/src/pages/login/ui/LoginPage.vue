<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import type { LoginCredentials } from '@/entities/session'
import { LoginForm } from '@/features/auth'
import { AppMessage, useNotify } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const notify = useNotify()
const session = useSessionStore()
const { isLoading, sessionExpired } = storeToRefs(session)

// після входу повертаємо користувача на сторінку, яку він запитував (?redirect=...)
const redirectTarget = computed(() => {
  const redirect = route.query.redirect
  // приймаємо лише внутрішні шляхи, щоб не створити open redirect
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/users'
})

onMounted(() => session.clearError())

async function handleSubmit(credentials: LoginCredentials): Promise<void> {
  if (await session.login(credentials)) {
    notify.success('Signed in', `Welcome, ${session.user?.firstName ?? credentials.username}!`)
    await router.push(redirectTarget.value)
  } else {
    notify.error('Login failed', session.error ?? undefined)
  }
}
</script>

<template>
  <section class="card app-card">
    <h1 class="page-title">Login</h1>
    <AppMessage v-if="sessionExpired" severity="warn">
      Your session has expired. Please log in again.
    </AppMessage>
    <p class="text-body-secondary small">
      Test account: <code>emilys</code> / <code>emilyspass</code>
    </p>
    <LoginForm :is-submitting="isLoading" @submit="handleSubmit" />
  </section>
</template>
