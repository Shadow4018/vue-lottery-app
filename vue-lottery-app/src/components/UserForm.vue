<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { useId } from 'vue'
import type { SelectOption } from '../types/ui'
import type { UserFormValues } from '../types/user'
import { buildUserSchema } from '../validation/schemas'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'

const props = withDefaults(
  defineProps<{
    submitLabel: string
    initialValues?: UserFormValues
    /** Створення: пароль обов'язковий. Редагування: порожній пароль = не змінювати. */
    passwordRequired?: boolean
    isSubmitting?: boolean
    serverError?: string
  }>(),
  { initialValues: undefined, passwordRequired: true, isSubmitting: false, serverError: '' },
)

const emit = defineEmits<{
  submit: [values: UserFormValues]
}>()

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

const uid = useId()

// VeeValidate + yup: правила описані в validation/schemas.ts, а не в шаблоні
const { errors, handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(buildUserSchema(props.passwordRequired)),
  initialValues: props.initialValues ?? {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    age: '',
    gender: '',
    phone: '',
  },
})

const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')
const [username] = defineField('username')
const [email] = defineField('email')
const [password] = defineField('password')
const [age] = defineField('age')
const [gender] = defineField('gender')
const [phone] = defineField('phone')

// handleSubmit спершу валідує всі поля і викликає колбек, лише якщо помилок немає
const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <BaseInput
      :id="`${uid}-first-name`"
      v-model="firstName"
      label="First name"
      placeholder="Enter first name"
      :error="errors.firstName"
    />
    <BaseInput
      :id="`${uid}-last-name`"
      v-model="lastName"
      label="Last name"
      placeholder="Enter last name"
      :error="errors.lastName"
    />
    <BaseInput
      :id="`${uid}-username`"
      v-model="username"
      label="Username"
      placeholder="Enter username"
      autocomplete="off"
      :error="errors.username"
    />
    <BaseInput
      :id="`${uid}-email`"
      v-model="email"
      type="email"
      label="Email"
      placeholder="Enter email"
      :error="errors.email"
    />
    <BaseInput
      :id="`${uid}-password`"
      v-model="password"
      type="password"
      label="Password"
      :placeholder="passwordRequired ? 'Enter password' : 'Leave empty to keep the current one'"
      autocomplete="new-password"
      :error="errors.password"
    />
    <BaseInput
      :id="`${uid}-age`"
      v-model="age"
      type="number"
      label="Age"
      placeholder="Enter age"
      :error="errors.age"
    />
    <BaseSelect
      :id="`${uid}-gender`"
      v-model="gender"
      label="Gender"
      placeholder="Select gender"
      :options="GENDER_OPTIONS"
      :error="errors.gender"
    />
    <BaseInput
      :id="`${uid}-phone`"
      v-model="phone"
      type="tel"
      label="Phone number"
      placeholder="+1 234 567 8900"
      :error="errors.phone"
    />

    <div v-if="serverError" class="alert alert-danger" role="alert">{{ serverError }}</div>

    <div class="d-flex justify-content-end mt-4">
      <BaseButton type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>
