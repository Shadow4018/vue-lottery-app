import { defineStore } from 'pinia'
import { ref, shallowReactive } from 'vue'
import { HttpError } from '../api/http-client'
import { LOCAL_USER_ID_START, PAGE_SIZE } from '../constants'
import { ServiceProvider } from '../services/service-provider'
import type { CreateUserDto, UpdateUserDto, User } from '../types/user'
import { getErrorMessage } from '../utils/error'

interface FetchPageParams {
  page: number
  q: string
  /** Завантажити знову, навіть якщо ця сторінка вже відображається. */
  force?: boolean
}

function pageKey(page: number, q: string): string {
  return `${page}|${q}`
}

function isLocalUser(id: number): boolean {
  return id >= LOCAL_USER_ID_START
}

/**
 * Стан списку користувачів.
 *
 * DummyJSON лише імітує POST/PUT/DELETE (на сервері нічого не змінюється), тому після успішної відповіді
 * сервера ми самі оновлюємо локальний стан: додаємо створеного, підміняємо оновленого, прибираємо видаленого.
 */
export const useUsersStore = defineStore('users', () => {
  const items = ref<User[]>([])
  const total = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadedKey = ref<string | null>(null)
  let lastRequestId = 0

  // Актуальні версії користувачів, які ми бачили (враховують локальні зміни)
  const cache = shallowReactive(new Map<number, User>())
  const deletedIds = new Set<number>()
  const createdUsers = ref<User[]>([])
  let localIdCounter = 0

  function remember(user: User): User {
    const known = cache.get(user.id)
    if (known) {
      return known
    }
    cache.set(user.id, user)
    return user
  }

  /** Накладає локальні зміни на сторінку, отриману з сервера. */
  function applyLocalState(list: User[], page: number, q: string): User[] {
    const base = list.filter((user) => !deletedIds.has(user.id)).map(remember)
    return page === 1 && q === '' ? [...createdUsers.value, ...base] : base
  }

  async function fetchPage({ page, q, force = false }: FetchPageParams): Promise<void> {
    const key = pageKey(page, q)
    if (!force && key === loadedKey.value) {
      return
    }
    loadedKey.value = null
    const requestId = ++lastRequestId
    isLoading.value = true
    error.value = null
    try {
      const result = await ServiceProvider.users.getAll({
        limit: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        q,
      })
      if (requestId !== lastRequestId) {
        return
      }
      items.value = applyLocalState(result.items, page, q)
      const delta = q === '' ? createdUsers.value.length - deletedIds.size : 0
      total.value = Math.max(0, result.total + delta)
      loadedKey.value = key
    } catch (e) {
      if (requestId === lastRequestId) {
        error.value = getErrorMessage(e)
      }
    } finally {
      if (requestId === lastRequestId) {
        isLoading.value = false
      }
    }
  }

  /** Версія користувача, яку ми вже знаємо (реактивно оновлюється після редагування). */
  function cachedUser(id: number): User | undefined {
    return cache.get(id)
  }

  async function getUser(id: number): Promise<User> {
    if (deletedIds.has(id)) {
      throw new HttpError(404, `User with id '${id}' was deleted`)
    }
    const cached = cache.get(id)
    if (cached) {
      return cached
    }
    const user = await ServiceProvider.users.getById(id)
    cache.set(id, user)
    return user
  }

  async function createUser(dto: CreateUserDto): Promise<User> {
    const created = await ServiceProvider.users.create(dto)
    // DummyJSON щоразу повертає той самий id, тому призначаємо унікальний локальний
    const user: User = { ...created, id: LOCAL_USER_ID_START + localIdCounter++ }
    createdUsers.value.unshift(user)
    cache.set(user.id, user)
    if (loadedKey.value === pageKey(1, '')) {
      items.value = [user, ...items.value]
      total.value += 1
    }
    return user
  }

  async function updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const current = await getUser(id)
    // користувачів, створених на клієнті, на сервері немає - оновлюємо лише локально
    const fromServer = isLocalUser(id) ? {} : await ServiceProvider.users.update(id, dto)
    const updated: User = { ...current, ...fromServer, ...dto, id }

    cache.set(id, updated)
    items.value = items.value.map((user) => (user.id === id ? updated : user))
    createdUsers.value = createdUsers.value.map((user) => (user.id === id ? updated : user))
    return updated
  }

  async function removeUser(id: number): Promise<void> {
    if (!isLocalUser(id)) {
      await ServiceProvider.users.delete(id)
      deletedIds.add(id)
    }
    cache.delete(id)
    createdUsers.value = createdUsers.value.filter((user) => user.id !== id)
    const before = items.value.length
    items.value = items.value.filter((user) => user.id !== id)
    if (items.value.length < before) {
      total.value = Math.max(0, total.value - 1)
    }
  }

  return {
    items,
    total,
    isLoading,
    error,
    fetchPage,
    cachedUser,
    getUser,
    createUser,
    updateUser,
    removeUser,
  }
})
