<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '../components/UserForm.vue'
import { useUser } from '../composables/useUser'
import { useUsersStore } from '../stores/users'
import type { UserFormValues } from '../types/user'
import { getErrorMessage } from '../utils/error'
import { toFormValues, toUpdateUserDto } from '../utils/user'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const usersStore = useUsersStore()

const userId = computed(() => Number(props.id))
const { user } = useUser(userId)

const isSubmitting = ref(false)
const serverError = ref('')

async function handleSubmit(values: UserFormValues): Promise<void> {
  isSubmitting.value = true
  serverError.value = ''
  try {
    await usersStore.updateUser(userId.value, toUpdateUserDto(values))
    await router.push({ name: 'user-detail', params: { id: props.id } })
  } catch (e) {
    serverError.value = getErrorMessage(e)
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
