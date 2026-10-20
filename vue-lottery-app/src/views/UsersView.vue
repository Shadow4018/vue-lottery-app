<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { LocationQueryRaw } from 'vue-router'
import AppPagination from '../components/AppPagination.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseModal from '../components/BaseModal.vue'
import SearchBar from '../components/SearchBar.vue'
import TheWinnersBlock from '../components/TheWinnersBlock.vue'
import UsersTable from '../components/UsersTable.vue'
import { PAGE_SIZE } from '../constants'
import { useUsersStore } from '../stores/users'
import { useWinnersStore } from '../stores/winners'
import type { User } from '../types/user'
import { getErrorMessage } from '../utils/error'
import { fullName } from '../utils/user'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const winnersStore = useWinnersStore()

// Сторінка та пошуковий запит живуть в query-параметрах URL (/users?page=2&q=john),
// тому посилання на конкретний стан списку можна скопіювати, а кнопка "Назад" працює.
const page = computed(() => {
  const value = Number(route.query.page)
  return Number.isInteger(value) && value > 0 ? value : 1
})
const searchQuery = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed(() => Math.max(1, Math.ceil(usersStore.total / PAGE_SIZE)))

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
    await usersStore.fetchPage({ page: page.value, q: searchQuery.value })
    if (!usersStore.error && page.value > totalPages.value) {
      await router.replace({ query: buildQuery(totalPages.value, searchQuery.value) })
    }
  },
  { immediate: true },
)

function reload(): void {
  void usersStore.fetchPage({ page: page.value, q: searchQuery.value, force: true })
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
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)

function openDeleteModal(user: User): void {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

async function confirmDelete(): Promise<void> {
  const user = userToDelete.value
  if (!user) {
    return
  }
  isDeleting.value = true
  deleteError.value = null
  try {
    await usersStore.removeUser(user.id)
    winnersStore.remove(user.id)
  } catch (e) {
    deleteError.value = getErrorMessage(e)
  } finally {
    isDeleting.value = false
    isDeleteModalOpen.value = false
  }
}
</script>

<template>
  <section>
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h1 class="page-title mb-0">Users</h1>
      <RouterLink :to="{ name: 'user-create' }" class="btn btn-primary">Add user</RouterLink>
    </div>

    <TheWinnersBlock
      :winners="winnersStore.winners"
      :can-pick-winner="winnersStore.canPickFrom(usersStore.items)"
      @pick-winner="winnersStore.pickFrom(usersStore.items)"
      @remove-winner="winnersStore.remove"
    />

    <div v-if="deleteError" class="alert alert-danger" role="alert">{{ deleteError }}</div>

    <div class="card app-card">
      <SearchBar class="mb-3" :value="searchQuery" @filter-by-name="handleSearch" />

      <div
        v-if="usersStore.error"
        class="alert alert-danger d-flex align-items-center justify-content-between mb-0"
        role="alert"
      >
        <span>{{ usersStore.error }}</span>
        <BaseButton size="sm" variant="outline-danger" @click="reload">Retry</BaseButton>
      </div>
      <div v-else-if="usersStore.isLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <template v-else>
        <UsersTable :users="usersStore.items" @remove="openDeleteModal" />
        <AppPagination :page="page" :total-pages="totalPages" @change="goToPage" />
      </template>
    </div>

    <BaseModal v-model="isDeleteModalOpen" title="Видалити користувача">
      <p v-if="userToDelete" class="mb-0">
        Ви дійсно бажаєте видалити користувача "{{ fullName(userToDelete) }}", "{{
          userToDelete.email
        }}"?
      </p>
      <template #footer>
        <BaseButton variant="danger" :disabled="isDeleting" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>
