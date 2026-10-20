<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { User } from '../types/user'
import { fullName } from '../utils/user'

defineProps<{
  users: User[]
}>()

const emit = defineEmits<{
  remove: [user: User]
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0">
      <thead>
        <tr>
          <th scope="col" class="text-body-tertiary">#</th>
          <th scope="col">Name</th>
          <th scope="col">Username</th>
          <th scope="col">Email</th>
          <th scope="col">Phone number</th>
          <th scope="col">Age</th>
          <th scope="col"><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <th scope="row" class="fw-normal text-primary">{{ user.id }}</th>
          <td>{{ fullName(user) }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.age }}</td>
          <td class="text-nowrap">
            <RouterLink
              :to="{ name: 'user-detail', params: { id: user.id } }"
              class="btn btn-sm btn-outline-secondary me-1"
            >
              View
            </RouterLink>
            <RouterLink
              :to="{ name: 'user-edit', params: { id: user.id } }"
              class="btn btn-sm btn-outline-primary me-1"
            >
              Edit
            </RouterLink>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="emit('remove', user)"
            >
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="users.length === 0">
          <td colspan="7" class="text-center text-body-secondary">No users found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
