import * as yup from 'yup'
import { optionalPassword, requiredPassword } from '@/shared/lib'

const PHONE_REGEXP = /^\+?[\d\s\-()]{7,20}$/
const MIN_AGE = 1
const MAX_AGE = 120

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
