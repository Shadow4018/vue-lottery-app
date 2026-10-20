<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import UserForm from '../components/UserForm.vue'
import { useUsersStore } from '../stores/users'
import type { UserFormValues } from '../types/user'
import { getErrorMessage } from '../utils/error'
import { toCreateUserDto } from '../utils/user'

const router = useRouter()
const usersStore = useUsersStore()

const isSubmitting = ref(false)
const serverError = ref('')

async function handleSubmit(values: UserFormValues): Promise<void> {
  isSubmitting.value = true
  serverError.value = ''
  try {
    await usersStore.createUser(toCreateUserDto(values))
    await router.push({ name: 'users' })
  } catch (e) {
    serverError.value = getErrorMessage(e)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="card app-card">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="page-title mb-0">New user</h1>
      <RouterLink :to="{ name: 'users' }" class="btn btn-sm btn-outline-secondary">
        Back to users
      </RouterLink>
    </div>
    <UserForm
      submit-label="Save"
      :is-submitting="isSubmitting"
      :server-error="serverError"
      @submit="handleSubmit"
    />
  </section>
</template>
