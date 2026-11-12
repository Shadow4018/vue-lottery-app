<script setup lang="ts">
import Message from 'primevue/message'

withDefaults(
  defineProps<{
    severity?: 'success' | 'info' | 'warn' | 'error'
  }>(),
  { severity: 'info' },
)
</script>

<template>
  <Message :severity="severity" class="app-message">
    <div class="app-message__body">
      <span><slot /></span>
      <!-- місце для дії (наприклад, кнопка Retry) -->
      <slot name="action" />
    </div>
  </Message>
</template>

<style scoped lang="scss">
.app-message {
  margin-bottom: 1rem;
}

.app-message__body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}
</style>
