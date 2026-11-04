<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const VISIBLE_PAGES = 5

// вікно з номерами сторінок навколо поточної
const pages = computed(() => {
  const start = Math.max(1, Math.min(props.page - 2, props.totalPages - VISIBLE_PAGES + 1))
  const end = Math.min(props.totalPages, start + VISIBLE_PAGES - 1)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination">
    <ul class="pagination pagination-sm justify-content-center mb-0 mt-3">
      <li class="page-item" :class="{ disabled: page === 1 }">
        <button
          type="button"
          class="page-link"
          :disabled="page === 1"
          @click="emit('change', page - 1)"
        >
          Previous
        </button>
      </li>
      <li
        v-for="number in pages"
        :key="number"
        class="page-item"
        :class="{ active: number === page }"
      >
        <button type="button" class="page-link" @click="emit('change', number)">
          {{ number }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: page === totalPages }">
        <button
          type="button"
          class="page-link"
          :disabled="page === totalPages"
          @click="emit('change', page + 1)"
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
</template>
