<script setup lang="ts">
defineProps<{
  name: string
}>()

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <span class="winner-badge">
    {{ name }}
    <button
      type="button"
      class="winner-badge__remove"
      :aria-label="`Remove winner ${name}`"
      @click="emit('remove')"
    >
      x
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.45rem;
  border-radius: 3px;
  background-color: var(--bs-primary);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.2;
}

.winner-badge__remove {
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}
</style>
