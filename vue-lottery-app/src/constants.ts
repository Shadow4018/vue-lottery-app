/** Максимальна кількість переможців у блоці. */
export const MAX_WINNERS = 3

/** Затримка (мс) перед відправкою події filter-by-name з SearchBar. */
export const SEARCH_DEBOUNCE_MS = 300

/** Кількість користувачів на сторінці (limit у запиті до API). */
export const PAGE_SIZE = 10

export const MIN_PASSWORD_LENGTH = 6

/** Користувачі, створені на клієнті (DummyJSON лише імітує POST), отримують id, починаючи з цього числа. */
export const LOCAL_USER_ID_START = 10_000

/** Ключ localStorage з токенами та даними авторизованого користувача. */
export const AUTH_STORAGE_KEY = 'vue-lottery-auth'

/** Час життя accessToken у хвилинах (передається в /auth/login та /auth/refresh). */
export const ACCESS_TOKEN_TTL_MINUTES = 30
