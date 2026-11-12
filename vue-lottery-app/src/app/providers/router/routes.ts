import type { RouteRecordRaw } from 'vue-router'

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

// усі сторінки завантажуються лінивo: () => import(...)
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home').then((m) => m.HomePage),
    meta: { title: 'Home' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/about').then((m) => m.AboutPage),
    meta: { title: 'About author' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login').then((m) => m.LoginPage),
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
        component: () => import('@/pages/users').then((m) => m.UsersPage),
        meta: { title: 'Users' },
      },
      {
        path: 'new',
        name: 'user-create',
        component: () => import('@/pages/user-create').then((m) => m.UserCreatePage),
        meta: { title: 'New user' },
      },
      {
        // (\\d+) - у цей маршрут потрапляють лише числові id, тож /users/new не конфліктує з /users/:id
        path: ':id(\\d+)',
        name: 'user-detail',
        component: () => import('@/pages/user-details').then((m) => m.UserDetailsPage),
        props: true,
        meta: { title: 'User' },
        children: [
          {
            // вкладений маршрут: форма рендериться в <RouterView> усередині UserDetailsPage
            path: 'edit',
            name: 'user-edit',
            component: () => import('@/pages/user-edit').then((m) => m.UserEditPage),
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
    component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
    meta: { title: 'Page not found' },
  },
]
