<script setup lang="ts">
import Dialog from 'primevue/dialog'
import AppButton from '../AppButton/AppButton.vue'

withDefaults(
  defineProps<{
    visible: boolean
    title: string
    confirmLabel?: string
    cancelLabel?: string
    /** Триває дія підтвердження (кнопки блокуються). */
    loading?: boolean
  }>(),
  { confirmLabel: 'Yes', cancelLabel: 'No', loading: false },
)

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
}>()

function cancel(): void {
  emit('update:visible', false)
  emit('cancel')
}

function onVisibleChange(value: boolean): void {
  if (!value) {
    cancel()
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    :header="title"
    :draggable="false"
    modal
    class="app-confirm-dialog"
    @update:visible="onVisibleChange"
  >
    <slot />
    <template #footer>
      <AppButton
        variant="danger"
        :label="confirmLabel"
        :loading="loading"
        @click="emit('confirm')"
      />
      <AppButton variant="secondary" :label="cancelLabel" :disabled="loading" @click="cancel" />
    </template>
  </Dialog>
</template>

<style lang="scss">
.app-confirm-dialog {
  width: min(28rem, calc(100vw - 2rem));
}
</style>
