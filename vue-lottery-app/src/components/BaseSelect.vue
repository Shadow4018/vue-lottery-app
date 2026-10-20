<script setup lang="ts">
import type { SelectOption } from '../types/ui'

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

function onChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-semibold">{{ label }}</label>
    <select
      :id="id"
      :value="modelValue"
      class="form-select"
      :class="{ 'is-invalid': error }"
      @change="onChange"
      @blur="emit('blur')"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>
