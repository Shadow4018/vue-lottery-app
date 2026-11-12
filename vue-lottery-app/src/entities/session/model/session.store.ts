import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ServiceProvider } from '@/shared/api'
import { getErrorMessage } from '@/shared/lib'
import type { AuthService } from '../api/auth.service'
import { AUTH_STORAGE_KEY } from '../config/constants'
import type { AuthTokens, AuthUser, LoginCredentials } from './types'

interface StoredSession extends AuthTokens {
  user: AuthUser | null
}

function loadStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) {
      return null
    }
    const data = JSON.parse(raw) as Partial<StoredSession>
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
function pickAuthUser(user: AuthUser): AuthUser {
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

/**
 * Сесія користувача: токени, поточний користувач, ознака авторизації.
 * Стан синхронізується з localStorage вручну (функція persist); порівняння з
 * pinia-plugin-persistedstate - у README.
 */
export const useSessionStore = defineStore('session', () => {
  const service = () => ServiceProvider.get<AuthService>('auth')
  const stored = loadStoredSession()

  const accessToken = ref<string | null>(stored?.accessToken ?? null)
  const refreshToken = ref<string | null>(stored?.refreshToken ?? null)
  const user = ref<AuthUser | null>(stored?.user ?? null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  /** true, якщо сесію завершив сервер (refresh не вдався), а не сам користувач. */
  const sessionExpired = ref(false)

  const isAuthenticated = computed(() => accessToken.value !== null)

  /** Стан у сторі та в localStorage завжди збігається: викликається після кожної зміни сесії. */
  function persist(): void {
    if (accessToken.value && refreshToken.value) {
      const data: StoredSession = {
        accessToken: accessToken.value,
        refreshToken: refreshToken.value,
        user: user.value,
      }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  function setSession(tokens: AuthTokens, profile: AuthUser | null = user.value): void {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    user.value = profile
    sessionExpired.value = false
    persist()
  }

  function clearSession(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    persist()
  }

  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      const {
        accessToken: access,
        refreshToken: refresh,
        ...profile
      } = await service().login(credentials)
      setSession({ accessToken: access, refreshToken: refresh }, profile)
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
    refreshPromise ??= service()
      .refresh(refreshToken.value)
      .then((tokens) => {
        // користувач (user) лишається тим самим - оновлюються лише токени
        setSession(tokens)
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
      user.value = pickAuthUser(await service().getCurrentUser())
      persist()
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
    setSession,
    clearSession,
    login,
    logout,
    expireSession,
    clearError,
    refreshAccessToken,
    loadProfile,
  }
})
