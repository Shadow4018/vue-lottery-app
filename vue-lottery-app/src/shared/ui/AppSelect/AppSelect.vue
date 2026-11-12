<script setup lang="ts">
import Select from 'primevue/select'
import type { SelectOption } from '../types'

withDefaults(
  defineProps<{
    modelValue?: string
    id: string
    label: string
    options: SelectOption[]
    placeholder?: string
    error?: string
  }>(),
  { modelValue: '', placeholder: 'Select...', error: '' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

function onUpdate(value: string | null | undefined): void {
  emit('update:modelValue', value ?? '')
}
</script>

<template>
  <div class="app-select">
    <label :for="id" class="app-select__label">{{ label }}</label>
    <Select
      :input-id="id"
      :model-value="modelValue || null"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      :invalid="Boolean(error)"
      fluid
      @update:model-value="onUpdate"
      @blur="emit('blur')"
    />
    <small v-if="error" class="app-select__error" role="alert">{{ error }}</small>
  </div>
</template>

<style scoped lang="scss">
.app-select {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.app-select__label {
  font-weight: 600;
}

.app-select__error {
  color: var(--p-red-500);
}
</style>
