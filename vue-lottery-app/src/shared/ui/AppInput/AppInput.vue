<script setup lang="ts">
import InputText from 'primevue/inputtext'

withDefaults(
  defineProps<{
    modelValue?: string
    id: string
    label?: string
    type?: 'text' | 'email' | 'date' | 'tel' | 'password' | 'number' | 'search'
    placeholder?: string
    /** Текст помилки валідації (VeeValidate); якщо заданий - поле підсвічується. */
    error?: string
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    label: undefined,
    type: 'text',
    placeholder: '',
    error: '',
    autocomplete: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

function onUpdate(value: string | undefined): void {
  emit('update:modelValue', value ?? '')
}
</script>

<template>
  <div class="app-input">
    <label v-if="label" :for="id" class="app-input__label">{{ label }}</label>
    <InputText
      :id="id"
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : undefined"
      fluid
      @update:model-value="onUpdate"
      @blur="emit('blur')"
    />
    <small v-if="error" :id="`${id}-error`" class="app-input__error" role="alert">{{ error }}</small>
  </div>
</template>

<style scoped lang="scss">
.app-input {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.app-input__label {
  font-weight: 600;
}

.app-input__error {
  color: var(--p-red-500);
}
</style>
