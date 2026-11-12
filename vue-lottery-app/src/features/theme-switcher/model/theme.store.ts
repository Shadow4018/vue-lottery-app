import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

/** Клас на <html>, за яким PrimeVue вмикає темну тему (darkModeSelector у app/providers/ui.ts). */
const DARK_CLASS = 'app-dark'

function systemMode(): ThemeMode {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Налаштування теми оформлення. Значення зберігається в localStorage плагіном
 * pinia-plugin-persistedstate (опція persist нижче), без ручного коду синхронізації.
 */
export const useThemeStore = defineStore(
  'theme',
  () => {
    const mode = ref<ThemeMode>(systemMode())
    const isDark = computed(() => mode.value === 'dark')

    function setMode(value: ThemeMode): void {
      mode.value = value
    }

    function toggle(): void {
      mode.value = isDark.value ? 'light' : 'dark'
    }

    // Bootstrap (data-bs-theme) і PrimeVue (клас app-dark) перемикаються разом
    function apply(): void {
      const root = document.documentElement
      root.classList.toggle(DARK_CLASS, isDark.value)
      root.setAttribute('data-bs-theme', mode.value)
    }

    watch(mode, apply, { immediate: true })

    return { mode, isDark, setMode, toggle }
  },
  { persist: { key: 'vue-lottery-theme', pick: ['mode'] } },
)
