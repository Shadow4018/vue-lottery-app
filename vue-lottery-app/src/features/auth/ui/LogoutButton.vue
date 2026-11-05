<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppButton } from '@/shared/ui'

const session = useSessionStore()
const router = useRouter()

async function handleLogout(): Promise<void> {
  session.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <AppButton label="Logout" variant="text" @click="handleLogout" />
</template>
