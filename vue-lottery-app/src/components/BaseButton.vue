<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?:
      | 'primary'
      | 'secondary'
      | 'danger'
      | 'outline-primary'
      | 'outline-secondary'
      | 'outline-danger'
    size?: 'sm'
    disabled?: boolean
  }>(),
  { type: 'button', variant: 'primary', size: undefined, disabled: false },
)
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn-${variant}`, size ? `btn-${size}` : '']"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
