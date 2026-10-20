import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    /** Сторінка доступна лише авторизованим користувачам. */
    requiresAuth?: boolean
    /** Заголовок вкладки браузера. */
    title?: string
    /** Layout, у який обгортається сторінка (за замовчуванням default). */
    layout?: 'default' | 'auth'
  }
}

const APP_TITLE = 'Vue Lottery'

// усі сторінки завантажуються лінивo: () => import(...)
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: 'About author' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Login', layout: 'auth' },
  },
  {
    // батьківський маршрут без компонента: лише групує вкладені маршрути та задає їм спільний meta
    path: '/users',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('../views/UsersView.vue'),
        meta: { title: 'Users' },
      },
      {
        path: 'new',
        name: 'user-create',
        component: () => import('../views/UserCreateView.vue'),
        meta: { title: 'New user' },
      },
      {
        // (\\d+) - у цей маршрут потрапляють лише числові id, тож /users/new не конфліктує з /users/:id
        path: ':id(\\d+)',
        name: 'user-detail',
        component: () => import('../views/UserDetailView.vue'),
        props: true,
        meta: { title: 'User' },
        children: [
          {
            // вкладений маршрут: форма рендериться в <RouterView> усередині UserDetailView
            path: 'edit',
            name: 'user-edit',
            component: () => import('../views/UserEditView.vue'),
            props: true,
            meta: { title: 'Edit user' },
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

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

export default router
