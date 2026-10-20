import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './assets/styles/main.scss'
import { setAuthHandlers } from './api/http-client'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()
// Pinia має бути підключена до роутера: navigation guard читає стор авторизації
app.use(pinia)

// зв'язуємо http-клієнт зі сховищем авторизації (Bearer-токен, refresh при 401)
const auth = useAuthStore(pinia)
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
