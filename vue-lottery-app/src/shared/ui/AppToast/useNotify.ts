import { useToast } from 'primevue/usetoast'

type Severity = 'success' | 'info' | 'warn' | 'error'

const LIFE_MS: Record<Severity, number> = { success: 3000, info: 4000, warn: 5000, error: 6000 }

/** Сповіщення (toast) для результату операцій. Потребує <AppToast /> у App.vue та ToastService (app/providers/ui.ts). */
export function useNotify() {
  const toast = useToast()

  function show(severity: Severity, summary: string, detail?: string): void {
    toast.add({ severity, summary, detail, life: LIFE_MS[severity] })
  }

  return {
    success: (summary: string, detail?: string) => show('success', summary, detail),
    info: (summary: string, detail?: string) => show('info', summary, detail),
    warn: (summary: string, detail?: string) => show('warn', summary, detail),
    error: (summary: string, detail?: string) => show('error', summary, detail),
  }
}
