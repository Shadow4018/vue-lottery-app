import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { AUTH_STORAGE_KEY } from '../constants'
import { ServiceProvider } from '../services/service-provider'
import type { AuthTokens, AuthUser, LoginCredentials } from '../types/auth'
import type { User } from '../types/user'
import { getErrorMessage } from '../utils/error'

interface StoredAuth extends AuthTokens {
  user: AuthUser | null
}

function loadStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return null
    }
    const data = JSON.parse(raw) as Partial<StoredAuth>
    if (typeof data.accessToken === 'string' && typeof data.refreshToken === 'string') {
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user ?? null,
      }
    }
  } catch {
    // пошкоджені дані - вважаємо, що користувач не авторизований
  }
  return null
}

/** У localStorage потрапляє лише мінімум даних, а не весь профіль із /auth/me. */
function pickAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    ...(user.image ? { image: user.image } : {}),
  }
}

export const useAuthStore = defineStore('auth', () => {
  const stored = loadStoredAuth()

  const accessToken = ref<string | null>(stored?.accessToken ?? null)
  const refreshToken = ref<string | null>(stored?.refreshToken ?? null)
  const user = ref<AuthUser | null>(stored?.user ?? null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  /** true, якщо сесію завершив сервер (refresh не вдався), а не сам користувач. */
  const sessionExpired = ref(false)

  const isAuthenticated = computed(() => accessToken.value !== null)

  // стан у сторі та в localStorage завжди збігається
  watch(
    [accessToken, refreshToken, user],
    () => {
      if (accessToken.value && refreshToken.value) {
        const data: StoredAuth = {
          accessToken: accessToken.value,
          refreshToken: refreshToken.value,
          user: user.value,
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    },
    { deep: true },
  )

  function clearSession(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }

  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const {
        accessToken: access,
        refreshToken: refresh,
        ...profile
      } = await ServiceProvider.auth.login(credentials)
      accessToken.value = access
      refreshToken.value = refresh
      user.value = profile
      sessionExpired.value = false
      return true
    } catch (e) {
      error.value = getErrorMessage(e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout(): void {
    clearSession()
    error.value = null
    sessionExpired.value = false
  }

  /** Викликається http-клієнтом, коли не вдалося оновити токен. */
  function expireSession(): void {
    clearSession()
    sessionExpired.value = true
  }

  function clearError(): void {
    error.value = null
  }

  // Один refresh-запит на всіх: паралельні 401 чекають на той самий promise
  let refreshPromise: Promise<string | null> | null = null

  function refreshAccessToken(): Promise<string | null> {
    if (!refreshToken.value) {
      return Promise.resolve(null)
    }
    refreshPromise ??= ServiceProvider.auth
      .refresh(refreshToken.value)
      .then((tokens) => {
        accessToken.value = tokens.accessToken
        refreshToken.value = tokens.refreshToken
        return tokens.accessToken
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
    return refreshPromise
  }

  /** Перевіряє збережену сесію запитом до /auth/me (Bearer + автоматичний refresh при 401). */
  async function loadProfile(): Promise<void> {
    try {
      user.value = pickAuthUser(await ServiceProvider.auth.getCurrentUser())
    } catch {
      // 401 обробляє interceptor (вихід із сесії); при проблемах з мережею лишаємо збережену сесію
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isLoading,
    error,
    sessionExpired,
    isAuthenticated,
    login,
    logout,
    expireSession,
    clearError,
    refreshAccessToken,
    loadProfile,
  }
})
