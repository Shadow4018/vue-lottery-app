<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

// атрибути (class, onClick, aria-*) передаються на кнопку PrimeVue, а не на кореневий елемент обгортки
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label: string
    type?: 'button' | 'submit' | 'reset'
    variant?:
      | 'primary'
      | 'secondary'
      | 'danger'
      | 'outlined'
      | 'outlined-secondary'
      | 'outlined-danger'
      | 'text'
    size?: 'sm'
    loading?: boolean
    disabled?: boolean
    /** Якщо задано - кнопка рендериться як посилання vue-router. */
    to?: RouteLocationRaw
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: undefined,
    loading: false,
    disabled: false,
    to: undefined,
  },
)

const appearance = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return { severity: 'secondary' as const }
    case 'danger':
      return { severity: 'danger' as const }
    case 'outlined':
      return { outlined: true }
    case 'outlined-secondary':
      return { severity: 'secondary' as const, outlined: true }
    case 'outlined-danger':
      return { severity: 'danger' as const, outlined: true }
    case 'text':
      return { text: true }
    default:
      return {}
  }
})

const primeSize = computed(() => (props.size === 'sm' ? ('small' as const) : undefined))
</script>

<template>
  <RouterLink v-if="to" v-slot="{ href, navigate }" :to="to" custom>
    <Button
      as="a"
      :href="href"
      :label="label"
      :size="primeSize"
      v-bind="{ ...appearance, ...$attrs }"
      @click="navigate"
    />
  </RouterLink>
  <Button
    v-else
    :type="type"
    :label="label"
    :size="primeSize"
    :loading="loading"
    :disabled="disabled"
    v-bind="{ ...appearance, ...$attrs }"
  />
</template>
