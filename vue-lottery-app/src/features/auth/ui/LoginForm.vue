<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { useId } from 'vue'
import type { LoginCredentials } from '@/entities/session'
import { AppButton, AppInput } from '@/shared/ui'
import { loginSchema } from '../model/schema'

withDefaults(
  defineProps<{
    isSubmitting?: boolean
  }>(),
  { isSubmitting: false },
)

const emit = defineEmits<{
  submit: [credentials: LoginCredentials]
}>()

const uid = useId()

// VeeValidate + yup: правила описані в model/schema.ts
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
    <AppInput
      :id="`${uid}-username`"
      v-model="username"
      label="Username"
      placeholder="Enter username"
      autocomplete="username"
      :error="errors.username"
    />
    <AppInput
      :id="`${uid}-password`"
      v-model="password"
      type="password"
      label="Password"
      placeholder="Enter password"
      autocomplete="current-password"
      :error="errors.password"
    />

    <AppButton
      type="submit"
      class="w-100 mt-2"
      :label="isSubmitting ? 'Signing in...' : 'Login'"
      :loading="isSubmitting"
    />
  </form>
</template>
