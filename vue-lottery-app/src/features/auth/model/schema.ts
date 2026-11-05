import * as yup from 'yup'
import { requiredPassword } from '@/shared/lib'

export const loginSchema = yup.object({
  username: yup.string().trim().required('Username is required'),
  password: requiredPassword,
})
