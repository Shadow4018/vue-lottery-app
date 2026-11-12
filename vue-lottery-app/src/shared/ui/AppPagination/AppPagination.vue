<script setup lang="ts">
import Paginator from 'primevue/paginator'
import type { PageState } from 'primevue/paginator'
import { computed } from 'vue'

const props = defineProps<{
  /** Поточна сторінка (нумерація з 1). */
  page: number
  totalRecords: number
  /** Кількість записів на сторінці. */
  rows: number
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const first = computed(() => (props.page - 1) * props.rows)

// Paginator нумерує сторінки з 0
function onPage(event: PageState): void {
  emit('change', event.page + 1)
}
</script>

<template>
  <Paginator
    v-if="totalRecords > rows"
    :first="first"
    :rows="rows"
    :total-records="totalRecords"
    :page-link-size="5"
    template="PrevPageLink PageLinks NextPageLink"
    @page="onPage"
  />
</template>
