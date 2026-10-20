<script setup lang="ts">
import type { Winner } from '../types/winner'
import BaseButton from './BaseButton.vue'
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
      <div class="form-control winners-field d-flex flex-wrap align-items-center gap-2">
        <TheWinnersBlockItem
          v-for="winner in winners"
          :key="winner.id"
          :name="winner.name"
          @remove="emit('remove-winner', winner.id)"
        />
        <span class="text-body-secondary">Winners</span>
      </div>
      <BaseButton :disabled="!canPickWinner" @click="emit('pick-winner')">New winner</BaseButton>
    </div>
  </section>
</template>
