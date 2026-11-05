import { createApp } from 'vue'
import './styles/main.scss'
import { setAuthHandlers } from '@/shared/api'
import App from './App.vue'
import router from './providers/router'
import { useSessionStore } from '@/entities/session'
import { useThemeStore } from '@/features/theme-switcher'
import { createAppPinia } from './providers/store'
import { registerServices } from './providers/services'
import { setupUi } from './providers/ui'

// сервіси (Repository) реєструються до першого звернення стору до ServiceProvider
registerServices()

const app = createApp(App)
const pinia = createAppPinia()
// Pinia має бути підключена до роутера: navigation guard читає стор авторизації
app.use(pinia)
setupUi(app)

// застосовуємо збережену тему до першого рендеру (store відновлюється з localStorage)
useThemeStore(pinia)

// зв'язуємо http-клієнт зі сховищем авторизації (Bearer-токен, refresh при 401)
const auth = useSessionStore(pinia)
setAuthHandlers({
  getAccessToken: () => auth.accessToken,
  refreshAccessToken: () => auth.refreshAccessToken(),
  onAuthFailure: () => auth.expireSession(),
})

// якщо в localStorage збережена сесія - перевіряємо її запитом до /auth/me
if (auth.isAuthenticated) {
  void auth.loadProfile()
}

app.use(router)
app.mount('#app')
