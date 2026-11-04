// Правила Feature-Sliced Design (eslint-plugin-boundaries).
// Запуск лише цих правил: npm run lint:fsd. Ті самі правила підключені й до загального npm run lint.
import boundaries from 'eslint-plugin-boundaries'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

export const fsdRules = {
  files: ['src/**/*.{ts,vue}'],
  plugins: { boundaries },
  settings: {
    'import/resolver': { typescript: { alwaysTryTypes: true, project: './tsconfig.json' } },
    'boundaries/include': ['src/**/*'],
    // app: один "елемент"; pages/widgets/features/entities - кожен слайс окремий елемент;
    // shared складається із сегментів (api, ui, lib, config), кожен сегмент - окремий елемент
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app' },
      { type: 'pages', pattern: 'src/pages/*' },
      { type: 'widgets', pattern: 'src/widgets/*' },
      { type: 'features', pattern: 'src/features/*' },
      { type: 'entities', pattern: 'src/entities/*' },
      { type: 'shared', pattern: 'src/shared/*' },
    ],
  },
  rules: {
    // 1) модуль імпортує лише з шарів, розташованих нижче; слайси одного шару не залежать один від одного
    //    (тип елемента не входить у власний allow, тож features/auth -> features/user-form заборонено)
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        message: '${file.type} не може імпортувати з ${dependency.type} (порушення напрямку залежностей FSD)',
        rules: [
          { from: 'app', allow: ['pages', 'widgets', 'features', 'entities', 'shared'] },
          { from: 'pages', allow: ['widgets', 'features', 'entities', 'shared'] },
          { from: 'widgets', allow: ['features', 'entities', 'shared'] },
          { from: 'features', allow: ['entities', 'shared'] },
          { from: 'entities', allow: ['shared'] },
          // сегменти shared (api, ui, lib, config) можуть залежати один від одного
          { from: 'shared', allow: ['shared'] },
        ],
      },
    ],
    // 2) назовні слайс відкриває лише Public API - index.ts (глибокі імпорти заборонені)
    'boundaries/entry-point': [
      'error',
      {
        default: 'disallow',
        message: 'Імпорт "углиб" слайса заборонений: використовуйте Public API (index.ts)',
        rules: [{ target: LAYERS, allow: 'index.ts' }],
      },
    ],
  },
}

export default [
  ...pluginVue.configs['flat/base'],
  { files: ['**/*.ts'], languageOptions: { parser: tseslint.parser } },
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  fsdRules,
]
