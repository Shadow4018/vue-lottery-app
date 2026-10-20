<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import BaseButton from '../components/BaseButton.vue'
import { useUser } from '../composables/useUser'
import { fullName } from '../utils/user'

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
          <RouterLink :to="{ name: 'users' }" class="btn btn-sm btn-outline-secondary">
            Back to users
          </RouterLink>
          <RouterLink
            v-if="user && !isEditing"
            :to="{ name: 'user-edit', params: { id } }"
            class="btn btn-sm btn-primary"
          >
            Edit
          </RouterLink>
        </div>
      </div>

      <div
        v-if="error"
        class="alert alert-danger d-flex align-items-center justify-content-between mb-0"
        role="alert"
      >
        <span>{{ error }}</span>
        <BaseButton size="sm" variant="outline-danger" @click="reload">Retry</BaseButton>
      </div>
      <div v-else-if="isLoading && !user" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
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
