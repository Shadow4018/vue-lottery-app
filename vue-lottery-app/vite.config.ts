import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [vue()],
  // на GitHub Pages застосунок живе за адресою https://<user>.github.io/vue-lottery-app/
  base: command === 'build' ? '/vue-lottery-app/' : '/',
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 ще використовує @import та глобальні sass-функції - приглушуємо попередження в консолі
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
}))
