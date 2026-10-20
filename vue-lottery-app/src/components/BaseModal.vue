<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogRef = ref<HTMLElement | null>(null)

function close(): void {
  emit('update:modelValue', false)
}

// після відкриття переносимо фокус у модальне вікно, щоб працювало закриття по Esc
watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      dialogRef.value?.focus()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="app-modal">
        <div class="modal-backdrop show" />
        <div
          ref="dialogRef"
          class="modal d-block"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          @keydown.esc="close"
          @click.self="close"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <slot name="header">
                  <h5 class="modal-title">{{ title }}</h5>
                </slot>
                <button type="button" class="btn-close" aria-label="Close" @click="close" />
              </div>
              <div class="modal-body">
                <slot />
              </div>
              <div v-if="$slots.footer" class="modal-footer">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;

  .modal-dialog {
    transition: transform 0.2s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-dialog {
    transform: translateY(-1.5rem) scale(0.97);
  }
}
</style>
