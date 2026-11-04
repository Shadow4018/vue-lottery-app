import type { User } from '@/entities/user/model/types'

/** Повне ім'я користувача: "Ім'я Прізвище". */
export function fullName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`.trim()
}
