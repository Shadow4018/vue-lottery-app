<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { useId } from 'vue'
import type { LoginCredentials } from '../types/auth'
import { loginSchema } from '../validation/schemas'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'

withDefaults(
  defineProps<{
    isSubmitting?: boolean
    /** Помилка авторизації від сервера - показується прямо у формі. */
    serverError?: string
  }>(),
  { isSubmitting: false, serverError: '' },
)

const emit = defineEmits<{
  submit: [credentials: LoginCredentials]
}>()

const uid = useId()

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: { username: '', password: '' },
})

const [username] = defineField('username')
const [password] = defineField('password')

const onSubmit = handleSubmit((values) => {
  emit('submit', { username: values.username, password: values.password })
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <BaseInput
      :id="`${uid}-username`"
      v-model="username"
      label="Username"
      placeholder="Enter username"
      autocomplete="username"
      :error="errors.username"
    />
    <BaseInput
      :id="`${uid}-password`"
      v-model="password"
      type="password"
      label="Password"
      placeholder="Enter password"
      autocomplete="current-password"
      :error="errors.password"
    />

    <div v-if="serverError" class="alert alert-danger" role="alert">{{ serverError }}</div>

    <BaseButton type="submit" class="w-100 mt-2" :disabled="isSubmitting">
      {{ isSubmitting ? 'Signing in...' : 'Login' }}
    </BaseButton>
  </form>
</template>
