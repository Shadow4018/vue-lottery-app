import * as yup from 'yup'
import { MIN_PASSWORD_LENGTH } from '@/shared/config/constants'

/** Спільні правила валідації пароля (форми входу та користувача). */
export const passwordTooShort = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`

export const requiredPassword = yup
  .string()
  .ensure()
  .required('Password is required')
  .min(MIN_PASSWORD_LENGTH, passwordTooShort)

// при редагуванні пароль необов'язковий, але якщо заповнений - має бути достатньо довгим
export const optionalPassword = yup
  .string()
  .ensure()
  .test(
    'min-length',
    passwordTooShort,
    (value) => value.length === 0 || value.length >= MIN_PASSWORD_LENGTH,
  )
