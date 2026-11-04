<script setup lang="ts" generic="T extends object">
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import type { AppTableColumn } from '../types'

withDefaults(
  defineProps<{
    rows: T[]
    columns: AppTableColumn[]
    /** Поле з унікальним значенням рядка. */
    rowKey: string
    emptyText?: string
  }>(),
  { emptyText: 'No data.' },
)
</script>

<template>
  <DataTable :value="rows" :data-key="rowKey" size="small" class="app-table">
    <Column
      v-for="column in columns"
      :key="column.key"
      :field="column.field ?? column.key"
      :header="column.header"
      :header-class="column.hideHeader ? 'app-table__header--hidden' : undefined"
      :body-class="column.nowrap ? 'app-table__cell--nowrap' : undefined"
    >
      <!-- вміст комірки можна замінити слотом cell-<key> -->
      <template v-if="$slots[`cell-${column.key}`]" #body="{ data }">
        <slot :name="`cell-${column.key}`" :row="data as T" />
      </template>
    </Column>
    <template #empty>{{ emptyText }}</template>
  </DataTable>
</template>

<style scoped lang="scss">
.app-table :deep(.app-table__cell--nowrap) {
  white-space: nowrap;
}

// заголовок колонки з діями залишається доступним для screen reader, але не видно візуально
.app-table :deep(.app-table__header--hidden .p-datatable-column-title) {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
