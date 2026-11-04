/** Налаштування середовища: єдине місце, де читається import.meta.env (значення беруться з .env). */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '',
  appTitle: import.meta.env.VITE_APP_TITLE || 'Vue Lottery',
  accessTokenTtlMinutes: Number(import.meta.env.VITE_ACCESS_TOKEN_TTL_MINUTES) || 30,
} as const
