/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Базова адреса REST API (див. .env.example). */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
