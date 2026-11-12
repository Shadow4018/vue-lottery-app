export interface SelectOption {
  value: string
  label: string
}

export interface AppTableColumn {
  /** Унікальний ключ колонки; також ім'я слота cell-<key> і поле рядка, якщо field не задано. */
  key: string
  header: string
  field?: string
  /** Заголовок видно лише screen reader (колонка з діями). */
  hideHeader?: boolean
  nowrap?: boolean
}
