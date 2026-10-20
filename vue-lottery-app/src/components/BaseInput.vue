<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    id: string
    label: string
    type?: 'text' | 'email' | 'date' | 'tel' | 'password' | 'number'
    placeholder?: string
    error?: string
    isValid?: boolean
    max?: string
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    error: '',
    isValid: false,
    max: undefined,
    autocomplete: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-semibold">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :max="max"
      :autocomplete="autocomplete"
      class="form-control"
      :class="{ 'is-invalid': error, 'is-valid': isValid }"
      @input="onInput"
      @blur="emit('blur')"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>
