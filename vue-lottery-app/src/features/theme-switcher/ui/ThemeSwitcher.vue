<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AppButton } from '@/shared/ui'
import { useThemeStore } from '../model/theme.store'

const store = useThemeStore()
const { isDark } = storeToRefs(store)
const { toggle } = store
</script>

<template>
  <AppButton
    :label="isDark ? 'Light theme' : 'Dark theme'"
    variant="text"
    size="sm"
    :aria-pressed="isDark"
    @click="toggle"
  />
</template>
