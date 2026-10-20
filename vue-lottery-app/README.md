# vue-lottery-app

Лабораторні №4-5: застосунок на Vue 3 (Composition API + TypeScript).
Лабораторна №5 виконана в гілці `feature/routing`.

## Запуск

```bash
npm install
cp .env.example .env     # на Windows PowerShell: copy .env.example .env
npm run dev              # http://localhost:5173
npm run build            # перевірка типів (vue-tsc) + збірка
npm run lint             # ESLint (Vue style guide)
npm run deploy           # збірка і публікація dist/ у гілку gh-pages
```

Адреса API береться зі змінної `VITE_API_URL` у `.env` (файл `.env` не комітиться, у репозиторії лише `.env.example`).
Тестовий акаунт для входу: `emilys` / `emilyspass` ([DummyJSON](https://dummyjson.com/docs/auth)).

## Що реалізовано (лабораторна №5)

- **vue-router**: ліниві маршрути, динамічний `/users/:id` (`props: true`), вкладений `/users/:id/edit`, catch-all 404, `meta.title` + `afterEach`, layouts через `meta.layout` (`DefaultLayout`, `AuthLayout`).
- **Навігація**: `AppHeader`, `AppNavigation` (активний пункт виділяється), `AppLogo`.
- **Repository**: інтерфейси `Readable`, `Creatable`, `Editable`, `Deletable`; `UserService`, `AuthService`; фабрика `ServiceProvider`; HTTP-клієнт з базовою адресою з `VITE_API_URL`.
- **Користувачі (DummyJSON)**: таблиця з пагінацією `limit/skip` і пошуком; сторінка та запит зберігаються в URL (`/users?page=2&q=john`); створення, редагування, видалення з оновленням локального стану (DummyJSON лише імітує POST/PUT/DELETE).
- **Авторизація (JWT)**: `/login`, токени та користувач у Pinia і `localStorage`, `Authorization: Bearer` для `/auth/me`, автоматичний `POST /auth/refresh` при 401 (interceptor), кнопка Logout.
- **Guard**: `meta.requiresAuth` для `/users` та вкладених маршрутів, редірект на `/login?redirect=...` і повернення після входу; авторизований користувач на `/login` потрапляє на `/users`.
- **Форми**: VeeValidate + Yup (обов'язкові поля, формат email, мінімальна довжина пароля).
- **Стани loading / error** для всіх запитів до API.

## Структура

```
src/
  api/          http-client (fetch, Bearer, refresh при 401)
  services/     interfaces, UserService, AuthService, ServiceProvider
  stores/       Pinia: auth, users, winners
  router/       маршрути, guard, meta
  views/        сторінки (завантажуються лінивo)
  layouts/      DefaultLayout, AuthLayout
  components/   AppHeader, AppNavigation, AppLogo, UserForm, LoginForm, UsersTable, ...
  validation/   yup-схеми
  types/, utils/, composables/, data/
```

## Деплой на GitHub Pages

```bash
git switch feature/routing
npm run deploy
```

Потім у GitHub: Settings -> Pages -> Source: `gh-pages` / `/ (root)`.
