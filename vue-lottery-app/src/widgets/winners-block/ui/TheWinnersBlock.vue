<script setup lang="ts">
import type { Winner } from '@/entities/winner'
import { AppButton } from '@/shared/ui'
import TheWinnersBlockItem from './TheWinnersBlockItem.vue'

defineProps<{
  winners: Winner[]
  canPickWinner: boolean
}>()

const emit = defineEmits<{
  'pick-winner': []
  'remove-winner': [id: number]
}>()
</script>

<template>
  <section class="card app-card">
    <div class="d-flex align-items-center gap-3">
      <div class="winners-field d-flex flex-wrap align-items-center gap-2">
        <TheWinnersBlockItem
          v-for="winner in winners"
          :key="winner.id"
          :name="winner.name"
          @remove="emit('remove-winner', winner.id)"
        />
        <span class="text-body-secondary">Winners</span>
      </div>
      <AppButton label="New winner" :disabled="!canPickWinner" @click="emit('pick-winner')" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.winners-field {
  flex: 1;
  min-height: 2.5rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--p-inputtext-border-color, var(--bs-border-color));
  border-radius: var(--p-inputtext-border-radius, 0.375rem);
  background-color: var(--p-inputtext-background, var(--app-surface));
}
</style>
