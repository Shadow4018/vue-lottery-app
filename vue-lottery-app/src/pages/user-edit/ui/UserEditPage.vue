<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser, useUsersStore } from '@/entities/user'
import { UserForm, toFormValues, toUpdateUserDto } from '@/features/user-form'
import type { UserFormValues } from '@/features/user-form'
import { fullName, getErrorMessage } from '@/shared/lib'
import { useNotify } from '@/shared/ui'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const notify = useNotify()
const { updateUser } = useUsersStore()

const userId = computed(() => Number(props.id))
const { user } = useUser(userId)

const isSubmitting = ref(false)
const serverError = ref('')

async function handleSubmit(values: UserFormValues): Promise<void> {
  isSubmitting.value = true
  serverError.value = ''
  try {
    const updated = await updateUser(userId.value, toUpdateUserDto(values))
    notify.success('User updated', fullName(updated))
    await router.push({ name: 'user-detail', params: { id: props.id } })
  } catch (e) {
    serverError.value = getErrorMessage(e)
    notify.error('Failed to update user', serverError.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section v-if="user" class="card app-card">
    <h2 class="section-title">Edit user</h2>
    <UserForm
      :key="user.id"
      submit-label="Update"
      :initial-values="toFormValues(user)"
      :password-required="false"
      :is-submitting="isSubmitting"
      :server-error="serverError"
      @submit="handleSubmit"
    />
  </section>
</template>
