import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useUsersStore } from '../stores/users'
import { getErrorMessage } from '../utils/error'

/** Завантажує користувача за id (з кешу стору або з API) зі станами loading / error. */
export function useUser(id: Ref<number>) {
  const store = useUsersStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // computed читає кеш стору, тому після редагування дані оновлюються автоматично
  const user = computed(() => store.cachedUser(id.value) ?? null)

  async function load(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await store.getUser(id.value)
    } catch (e) {
      error.value = getErrorMessage(e)
    } finally {
      isLoading.value = false
    }
  }

  watch(id, load, { immediate: true })

  return { user, isLoading, error, reload: load }
}
