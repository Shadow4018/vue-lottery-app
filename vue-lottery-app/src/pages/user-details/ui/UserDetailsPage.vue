<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useUser } from '@/entities/user'
import { fullName } from '@/shared/lib'
import { AppButton, AppMessage, AppSpinner } from '@/shared/ui'

// id приходить як prop завдяки props: true у конфігурації маршруту
const props = defineProps<{
  id: string
}>()

const route = useRoute()
const userId = computed(() => Number(props.id))
const { user, isLoading, error, reload } = useUser(userId)

const isEditing = computed(() => route.name === 'user-edit')
</script>

<template>
  <section>
    <div class="card app-card">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h1 class="page-title mb-0">User #{{ id }}</h1>
        <div class="d-flex gap-2">
          <AppButton
            :to="{ name: 'users' }"
            label="Back to users"
            size="sm"
            variant="outlined-secondary"
          />
          <AppButton
            v-if="user && !isEditing"
            :to="{ name: 'user-edit', params: { id } }"
            label="Edit"
            size="sm"
          />
        </div>
      </div>

      <AppMessage v-if="error" severity="error">
        {{ error }}
        <template #action>
          <AppButton label="Retry" size="sm" variant="outlined-danger" @click="reload" />
        </template>
      </AppMessage>
      <AppSpinner v-else-if="isLoading && !user" />
      <div v-else-if="user" class="d-flex gap-4 flex-wrap">
        <img
          v-if="user.image"
          :src="user.image"
          :alt="fullName(user)"
          class="user-avatar"
          width="120"
          height="120"
        />
        <dl class="user-info mb-0">
          <dt>Name</dt>
          <dd>{{ fullName(user) }}</dd>
          <dt>Username</dt>
          <dd>{{ user.username }}</dd>
          <dt>Email</dt>
          <dd>{{ user.email }}</dd>
          <dt>Phone</dt>
          <dd>{{ user.phone }}</dd>
          <dt>Age / gender</dt>
          <dd>{{ user.age }} / {{ user.gender }}</dd>
          <template v-if="user.address?.city">
            <dt>Location</dt>
            <dd>{{ [user.address.city, user.address.country].filter(Boolean).join(', ') }}</dd>
          </template>
          <template v-if="user.company?.name">
            <dt>Company</dt>
            <dd>{{ user.company.name }}</dd>
          </template>
        </dl>
      </div>
    </div>

    <!-- вкладений маршрут /users/:id/edit рендериться тут -->
    <RouterView />
  </section>
</template>

<style scoped lang="scss">
.user-avatar {
  border-radius: 50%;
  background-color: var(--bs-tertiary-bg);
  object-fit: cover;
}

.user-info {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.35rem 1.5rem;

  dt {
    color: var(--bs-secondary-color);
    font-weight: 600;
  }

  dd {
    margin: 0;
  }
}
</style>
