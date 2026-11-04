<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { onBeforeUnmount, ref, watch } from 'vue'
import { SEARCH_DEBOUNCE_MS } from '@/shared/config'

const props = withDefaults(
  defineProps<{
    /** Поточне значення пошуку ззовні (наприклад, з query-параметра ?q=). */
    value?: string
    placeholder?: string
  }>(),
  { value: '', placeholder: 'Search' },
)

const emit = defineEmits<{
  search: [query: string]
}>()

const query = ref(props.value)
let timerId: ReturnType<typeof setTimeout> | undefined

// якщо значення змінилось ззовні (кнопка "Назад" у браузері), оновлюємо поле
watch(
  () => props.value,
  (value) => {
    if (value !== query.value) {
      query.value = value
    }
  },
)

// debounce: подія відправляється, лише коли користувач не змінював запит SEARCH_DEBOUNCE_MS
watch(query, (value) => {
  clearTimeout(timerId)
  timerId = setTimeout(() => emit('search', value), SEARCH_DEBOUNCE_MS)
})

onBeforeUnmount(() => clearTimeout(timerId))
</script>

<template>
  <InputText v-model="query" type="search" :placeholder="placeholder" :aria-label="placeholder" fluid />
</template>
