import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import type { App } from 'vue'

/** Тема: Aura з основним кольором застосунку (#3bafda, як $primary у Bootstrap-стилях). */
const AppPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eff9fc',
      100: '#dcf1f8',
      200: '#b8e2f2',
      300: '#91d2ea',
      400: '#66c1e2',
      500: '#3bafda',
      600: '#3397bb',
      700: '#297b99',
      800: '#205f76',
      900: '#164353',
      950: '#0d2730',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
      },
      dark: {
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.900}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
      },
    },
  },
})

/** Підключення UI-бібліотеки: єдине місце (разом із shared/ui), де використовується PrimeVue. */
export function setupUi(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: AppPreset,
      // темна тема вмикається класом app-dark на <html> (див. перемикач теми)
      options: { darkModeSelector: '.app-dark', cssLayer: false },
    },
  })
  app.use(ToastService)
}
