import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  // flat/recommended = essential + strongly-recommended + recommended з офіційного Vue style guide
  ...pluginVue.configs['flat/recommended'],

  {
    // у .vue-файлах <script lang="ts"> розбирає typescript-eslint
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },

  {
    rules: {
      // style guide, пріоритет A
      'vue/multi-word-component-names': ['error', { ignores: ['App'] }],
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      // style guide, пріоритет B
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/prop-name-casing': ['error', 'camelCase'],
      // TypeScript-типізація props / emits
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/define-emits-declaration': ['error', 'type-based'],
      // заборона alert для показу помилок
      'no-alert': 'error',
      // у TypeScript/Vue невизначені змінні (і браузерні глобали) перевіряє компілятор;
      // це рекомендація typescript-eslint, інакше no-undef лається на document, setTimeout, HTMLElement
      'no-undef': 'off',
    },
  },

  // вимикає правила форматування, які конфліктують із Prettier (має бути останнім)
  prettier,
]
