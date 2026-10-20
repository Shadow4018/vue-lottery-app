import * as yup from 'yup'
import { MIN_PASSWORD_LENGTH } from '../constants'

const PHONE_REGEXP = /^\+?[\d\s\-()]{7,20}$/
const MIN_AGE = 1
const MAX_AGE = 120

const passwordTooShort = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`

const requiredPassword = yup
  .string()
  .ensure()
  .required('Password is required')
  .min(MIN_PASSWORD_LENGTH, passwordTooShort)

// при редагуванні пароль необов'язковий, але якщо заповнений - має бути достатньо довгим
const optionalPassword = yup
  .string()
  .ensure()
  .test(
    'min-length',
    passwordTooShort,
    (value) => value.length === 0 || value.length >= MIN_PASSWORD_LENGTH,
  )

export const loginSchema = yup.object({
  username: yup.string().trim().required('Username is required'),
  password: requiredPassword,
})

export function buildUserSchema(passwordRequired: boolean) {
  return yup.object({
    firstName: yup.string().trim().required('First name is required'),
    lastName: yup.string().trim().required('Last name is required'),
    email: yup.string().trim().required('Email is required').email('Enter a valid email address'),
    username: yup
      .string()
      .trim()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    password: passwordRequired ? requiredPassword : optionalPassword,
    age: yup
      .string()
      .trim()
      .required('Age is required')
      .matches(/^\d+$/, 'Age must be a whole number')
      .test(
        'age-range',
        `Age must be between ${MIN_AGE} and ${MAX_AGE}`,
        (value) => Number(value) >= MIN_AGE && Number(value) <= MAX_AGE,
      ),
    gender: yup
      .string()
      .required('Select gender')
      .test('gender', 'Select gender', (value) => value === 'male' || value === 'female'),
    phone: yup
      .string()
      .trim()
      .required('Phone is required')
      .matches(PHONE_REGEXP, 'Enter a valid phone number'),
  })
}
