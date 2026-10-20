<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { SEARCH_DEBOUNCE_MS } from '../constants'

const props = withDefaults(
  defineProps<{
    /** Поточне значення пошуку ззовні (наприклад, з query-параметра ?q=). */
    value?: string
  }>(),
  { value: '' },
)

const emit = defineEmits<{
  'filter-by-name': [name: string]
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

// debounce: подія відправляється, лише коли користувач 300 мс не змінював запит
watch(query, (value) => {
  clearTimeout(timerId)
  timerId = setTimeout(() => emit('filter-by-name', value), SEARCH_DEBOUNCE_MS)
})

onBeforeUnmount(() => clearTimeout(timerId))
</script>

<template>
  <input
    v-model="query"
    type="search"
    class="form-control"
    placeholder="Search users"
    aria-label="Search users"
  />
</template>
