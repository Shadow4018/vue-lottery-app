/**
 * Єдине місце, де відомо про fetch, базову адресу та обробку помилок.
 * Сервіси (репозиторії) не містять URL і не викликають fetch напряму.
 */

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

export interface HttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** Об'єкт, який буде серіалізовано в JSON. */
  body?: unknown
  /** Додати заголовок Authorization: Bearer <accessToken> (захищені ендпоїнти). */
  auth?: boolean
}

/** Зв'язок із сховищем авторизації. Реєструється в main.ts, щоб http-клієнт не залежав від Pinia. */
export interface AuthHandlers {
  getAccessToken: () => string | null
  /** Оновлює accessToken через refreshToken; повертає новий токен або null, якщо не вдалося. */
  refreshAccessToken: () => Promise<string | null>
  onAuthFailure: () => void
}

let authHandlers: AuthHandlers | null = null

export function setAuthHandlers(handlers: AuthHandlers): void {
  authHandlers = handlers
}

function getBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (!url) {
    throw new Error(
      'VITE_API_URL is not set. Copy .env.example to .env and restart the dev server.',
    )
  }
  return url.replace(/\/$/, '')
}

async function send(path: string, options: HttpOptions): Promise<Response> {
  const headers: Record<string, string> = {}
  // Content-Type лише для запитів із тілом - так GET-запити обходяться без CORS preflight
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (options.auth) {
    const token = authHandlers?.getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }
  return fetch(`${getBaseUrl()}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
}

async function toHttpError(response: Response): Promise<HttpError> {
  let message = `HTTP ${response.status}: ${response.statusText}`
  try {
    const data: unknown = await response.json()
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const apiMessage = (data as { message: unknown }).message
      if (typeof apiMessage === 'string' && apiMessage) {
        message = apiMessage
      }
    }
  } catch {
    // тіло відповіді не JSON - залишаємо стандартне повідомлення
  }
  return new HttpError(response.status, message)
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  let response = await send(path, options)

  // interceptor: 401 на захищеному запиті -> пробуємо оновити accessToken і повторити запит один раз
  if (response.status === 401 && options.auth && authHandlers) {
    const newToken = await authHandlers.refreshAccessToken()
    if (newToken) {
      response = await send(path, options)
    } else {
      authHandlers.onAuthFailure()
    }
  }

  if (!response.ok) {
    throw await toHttpError(response)
  }
  return (await response.json()) as T
}
