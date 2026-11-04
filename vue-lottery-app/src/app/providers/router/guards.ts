import type { Router } from 'vue-router'
import { env } from '@/shared/config'
import { useAuthStore } from '@/entities/session/model/auth.store'

const APP_TITLE = env.appTitle

export function setupGuards(router: Router): void {
  router.beforeEach((to) => {
    const auth = useAuthStore()

    // to.matched містить і батьківські записи, тому requiresAuth з /users діє на всі вкладені маршрути
    if (to.matched.some((record) => record.meta.requiresAuth) && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    // авторизованому користувачу сторінка логіну не потрібна
    if (to.name === 'login' && auth.isAuthenticated) {
      return { name: 'users' }
    }
    return true
  })

  router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} | ${APP_TITLE}` : APP_TITLE
  })
}
