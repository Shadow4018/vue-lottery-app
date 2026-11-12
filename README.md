# vue-lottery-app

# Vue Lottery

Вебзастосунок-лотерея на Vue 3 + TypeScript: список користувачів із REST API (DummyJSON) із пошуком і пагінацією, CRUD користувачів, JWT-авторизація та вибір випадкових переможців. Архітектура — Feature-Sliced Design. Навчальні лабораторні роботи №4–6.

🔗 **Демо проєкту:** [https://shadow4018.github.io/vue-lottery-app/](https://shadow4018.github.io/vue-lottery-app/)

## Скріншот
![Головний екран проєкту](./screenshot.png)

## Використані технології
* **Frontend:** Vue 3 (Composition API, `<script setup>`), TypeScript, Vue Router 4
* **Стан:** Pinia (setup stores), `pinia-plugin-persistedstate`
* **UI та стилізація:** PrimeVue 4 (тема Aura), Bootstrap 5, SCSS
* **Валідація форм:** VeeValidate + Yup
* **Робота з даними:** REST API ([DummyJSON](https://dummyjson.com)), JWT (accessToken + refresh при 401)
* **Збірка:** Vite
* **Якість коду:** ESLint (Vue style guide), `eslint-plugin-boundaries` (правила FSD), Prettier, `vue-tsc`
* **Деплой:** GitHub Pages (`gh-pages`)

## Основний функціонал
* Авторизація через DummyJSON (JWT), автоматичне оновлення токена при 401, захист сторінок користувачів (`requiresAuth`).
* Список користувачів із пагінацією та пошуком; сторінка й запит зберігаються в URL (`/users?page=2&q=john`).
* Перегляд, створення, редагування та видалення користувача (з підтвердженням) і toast-сповіщення про результат операцій.
* Блок переможців: випадковий вибір до 3 переможців серед користувачів, які ще не виграли; переможця можна прибрати, а при видаленні користувача він зникає з переможців.
* Валідація форм (VeeValidate + Yup).
* Світла й темна теми з збереженням вибору.
* Ліниве завантаження сторінок, окремі layouts, сторінка 404.

## Структура проєкту
Проєкт організований за методологією Feature-Sliced Design:
```
vue-lottery-app/
├── README.md
└── vue-lottery-app/
    ├── scripts/copy-404.mjs     # копіювання 404.html для GitHub Pages
    ├── src/
    │   ├── app/                 # точка входу, layouts, стилі, providers (router, store, services, ui)
    │   ├── pages/               # home, about, login, users, user-details, user-create, user-edit, not-found
    │   ├── widgets/             # app-header, users-table, winners-block
    │   ├── features/            # auth, user-form, theme-switcher
    │   ├── entities/            # user, session, winner
    │   └── shared/              # api, ui (обгортки PrimeVue), lib, config
    ├── .env.example
    ├── eslint.config.js
    ├── eslint.fsd.config.js     # правила FSD
    ├── vite.config.ts
    └── package.json
```

## Як запустити локально
1. Клонуйте репозиторій:
   ```bash
   git clone https://github.com/Shadow4018/vue-lottery-app.git
   ```
2. Перейдіть у папку проєкту та встановіть залежності:
   ```bash
   cd vue-lottery-app/vue-lottery-app
   npm install
   ```
3. Створіть файл середовища (PowerShell: `copy .env.example .env`):
   ```bash
   cp .env.example .env
   ```
4. Запустіть сервер для розробки (http://localhost:5173):
   ```bash
   npm run dev
   ```

Тестовий акаунт для входу: `emilys` / `emilyspass`.

## Змінні середовища
| Змінна | Призначення |
| --- | --- |
| `VITE_API_URL` | базова адреса REST API (DummyJSON) |
| `VITE_APP_TITLE` | назва застосунку (заголовок вкладки) |
| `VITE_ACCESS_TOKEN_TTL_MINUTES` | час життя accessToken у хвилинах |

## Корисні команди
| Команда | Призначення |
| --- | --- |
| `npm run dev` | сервер розробки |
| `npm run build` | перевірка типів (`vue-tsc`) і production-збірка |
| `npm run preview` | локальний перегляд збірки |
| `npm run lint` | ESLint (Vue style guide + правила FSD) |
| `npm run lint:fsd` | лише правила Feature-Sliced Design |
| `npm run format` | форматування Prettier |
| `npm run deploy` | збірка і публікація `dist/` у гілку `gh-pages` |

## Деплой
Застосунок публікується на GitHub Pages у гілку `gh-pages`:
```bash
npm run deploy
```
Потім у налаштуваннях репозиторію: Settings → Pages → Source: `gh-pages` / `/ (root)`.

## Гілки
* `main` — початковий стан;
* `feature/routing` — лабораторна №5 (маршрутизація, Repository, JWT);
* `feature/fsd` — лабораторна №6 (FSD, Pinia, PrimeVue).

## Додаткова документація
Діаграма залежностей шарів FSD, опис розподілу Repository по шарах і порівняння способів збереження стану (вручну чи плагіном) — у [`vue-lottery-app/README.md`](./vue-lottery-app/README.md).
