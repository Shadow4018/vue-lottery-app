/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Базова адреса REST API (див. .env.example). */
  readonly VITE_API_URL: string
  /** Назва застосунку (заголовок вкладки). */
  readonly VITE_APP_TITLE?: string
  /** Час життя accessToken у хвилинах. */
  readonly VITE_ACCESS_TOKEN_TTL_MINUTES?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
