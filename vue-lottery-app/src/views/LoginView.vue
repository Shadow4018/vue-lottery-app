<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import { useAuthStore } from '../stores/auth'
import type { LoginCredentials } from '../types/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

// після входу повертаємо користувача на сторінку, яку він запитував (?redirect=...)
const redirectTarget = computed(() => {
  const redirect = route.query.redirect
  // приймаємо лише внутрішні шляхи, щоб не створити open redirect
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/users'
})

onMounted(() => auth.clearError())

async function handleSubmit(credentials: LoginCredentials): Promise<void> {
  if (await auth.login(credentials)) {
    await router.push(redirectTarget.value)
  }
}
</script>

<template>
  <section class="card app-card">
    <h1 class="page-title">Login</h1>
    <div v-if="auth.sessionExpired" class="alert alert-warning" role="alert">
      Your session has expired. Please log in again.
    </div>
    <p class="text-body-secondary small">
      Test account: <code>emilys</code> / <code>emilyspass</code>
    </p>
    <LoginForm
      :is-submitting="auth.isLoading"
      :server-error="auth.error ?? ''"
      @submit="handleSubmit"
    />
  </section>
</template>
