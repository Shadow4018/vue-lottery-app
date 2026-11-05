<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import { UserForm, toCreateUserDto } from '@/features/user-form'
import type { UserFormValues } from '@/features/user-form'
import { fullName, getErrorMessage } from '@/shared/lib'
import { AppButton, useNotify } from '@/shared/ui'

const router = useRouter()
const notify = useNotify()
const { createUser } = useUsersStore()

const isSubmitting = ref(false)
const serverError = ref('')

async function handleSubmit(values: UserFormValues): Promise<void> {
  isSubmitting.value = true
  serverError.value = ''
  try {
    const user = await createUser(toCreateUserDto(values))
    notify.success('User created', fullName(user))
    await router.push({ name: 'users' })
  } catch (e) {
    serverError.value = getErrorMessage(e)
    notify.error('Failed to create user', serverError.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="card app-card">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="page-title mb-0">New user</h1>
      <AppButton
        :to="{ name: 'users' }"
        label="Back to users"
        size="sm"
        variant="outlined-secondary"
      />
    </div>
    <UserForm
      submit-label="Save"
      :is-submitting="isSubmitting"
      :server-error="serverError"
      @submit="handleSubmit"
    />
  </section>
</template>
