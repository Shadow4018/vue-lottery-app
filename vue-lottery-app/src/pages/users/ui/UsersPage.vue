<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { useWinnersStore } from '@/entities/winner'
import { PAGE_SIZE } from '@/shared/config'
import { fullName, getErrorMessage } from '@/shared/lib'
import {
  AppButton,
  AppConfirmDialog,
  AppMessage,
  AppPagination,
  AppSearchInput,
  AppSpinner,
  useNotify,
} from '@/shared/ui'
import { UsersTable } from '@/widgets/users-table'
import { TheWinnersBlock } from '@/widgets/winners-block'

const route = useRoute()
const router = useRouter()
const notify = useNotify()

const usersStore = useUsersStore()
const winnersStore = useWinnersStore()
// state та getters - через storeToRefs (зберігає реактивність), actions - напряму зі стору
const { users, total, isLoading, error } = storeToRefs(usersStore)
const { winners } = storeToRefs(winnersStore)
const { fetchUsers, removeUser } = usersStore

// Сторінка та пошуковий запит живуть в query-параметрах URL (/users?page=2&q=john),
// тому посилання на конкретний стан списку можна скопіювати, а кнопка "Назад" працює.
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const searchQuery = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

function buildQuery(pageNumber: number, q: string): LocationQueryRaw {
  const query: LocationQueryRaw = {}
  if (pageNumber > 1) {
    query.page = String(pageNumber)
  }
  if (q) {
    query.q = q
  }
  return query
}

// дані завантажуються при відкритті сторінки та щоразу, коли змінюється page або q
watch(
  [page, searchQuery],
  async () => {
    await fetchUsers({ page: page.value, q: searchQuery.value })
    if (!error.value && page.value > totalPages.value) {
      await router.replace({ query: buildQuery(totalPages.value, searchQuery.value) })
    }
  },
  { immediate: true },
)

function reload(): void {
  void fetchUsers({ page: page.value, q: searchQuery.value, force: true })
}

function goToPage(pageNumber: number): void {
  void router.push({ query: buildQuery(pageNumber, searchQuery.value) })
}

function handleSearch(q: string): void {
  const query = q.trim()
  if (query === searchQuery.value) {
    return
  }
  // новий пошук завжди починається з першої сторінки; replace, щоб не засмічувати історію
  void router.replace({ query: buildQuery(1, query) })
}

// --- видалення користувача ---
const userToDelete = ref<User | null>(null)
const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)

function openDeleteDialog(user: User): void {
  userToDelete.value = user
  isDeleteDialogOpen.value = true
}

async function confirmDelete(): Promise<void> {
  const user = userToDelete.value
  if (!user) {
    return
  }
  isDeleting.value = true
  try {
    await removeUser(user.id)
    winnersStore.remove(user.id)
    notify.success('User deleted', fullName(user))
  } catch (e) {
    notify.error('Failed to delete user', getErrorMessage(e))
  } finally {
    isDeleting.value = false
    isDeleteDialogOpen.value = false
  }
}
</script>

<template>
  <section>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="page-title mb-0">Users</h1>
      <AppButton :to="{ name: 'user-create' }" label="Add user" />
    </div>

    <TheWinnersBlock
      :winners="winners"
      :can-pick-winner="winnersStore.canPickFrom(users)"
      @pick-winner="winnersStore.pickFrom(users)"
      @remove-winner="winnersStore.remove"
    />

    <div class="card app-card">
      <AppSearchInput
        class="mb-3"
        placeholder="Search users"
        :value="searchQuery"
        @search="handleSearch"
      />

      <AppMessage v-if="error" severity="error">
        {{ error }}
        <template #action>
          <AppButton label="Retry" size="sm" variant="outlined-danger" @click="reload" />
        </template>
      </AppMessage>
      <AppSpinner v-else-if="isLoading" />
      <template v-else>
        <UsersTable :users="users" @remove="openDeleteDialog" />
        <AppPagination
          :page="page"
          :total-records="total"
          :rows="PAGE_SIZE"
          @change="goToPage"
        />
      </template>
    </div>

    <AppConfirmDialog
      v-model:visible="isDeleteDialogOpen"
      title="Видалити користувача"
      confirm-label="Так"
      cancel-label="Ні"
      :loading="isDeleting"
      @confirm="confirmDelete"
    >
      <p v-if="userToDelete" class="mb-0">
        Ви дійсно бажаєте видалити користувача "{{ fullName(userToDelete) }}", "{{
          userToDelete.email
        }}"?
      </p>
    </AppConfirmDialog>
  </section>
</template>
