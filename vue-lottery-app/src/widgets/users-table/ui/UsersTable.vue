<script setup lang="ts">
import type { User } from '@/entities/user'
import { fullName } from '@/shared/lib'
import { AppButton, AppTable } from '@/shared/ui'
import type { AppTableColumn } from '@/shared/ui'

defineProps<{
  users: User[]
}>()

const emit = defineEmits<{
  remove: [user: User]
}>()

const columns: AppTableColumn[] = [
  { key: 'id', header: '#' },
  { key: 'name', header: 'Name' },
  { key: 'username', header: 'Username' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone number' },
  { key: 'age', header: 'Age' },
  { key: 'actions', header: 'Actions', hideHeader: true, nowrap: true },
]
</script>

<template>
  <AppTable :rows="users" :columns="columns" row-key="id" empty-text="No users found.">
    <template #cell-name="{ row }">{{ fullName(row) }}</template>
    <template #cell-actions="{ row }">
      <div class="users-table__actions">
        <AppButton
          :to="{ name: 'user-detail', params: { id: row.id } }"
          label="View"
          variant="outlined-secondary"
          size="sm"
        />
        <AppButton
          :to="{ name: 'user-edit', params: { id: row.id } }"
          label="Edit"
          variant="outlined"
          size="sm"
        />
        <AppButton
          label="Delete"
          variant="outlined-danger"
          size="sm"
          @click="emit('remove', row)"
        />
      </div>
    </template>
  </AppTable>
</template>

<style scoped lang="scss">
.users-table__actions {
  display: flex;
  gap: 0.25rem;
}
</style>
