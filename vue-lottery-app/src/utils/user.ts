import type { CreateUserDto, Gender, UpdateUserDto, User, UserFormValues } from '../types/user'

export function fullName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`.trim()
}

/** User -> значення полів форми (для редагування). */
export function toFormValues(user: User): UserFormValues {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    password: user.password ?? '',
    age: String(user.age),
    gender: user.gender,
    phone: user.phone,
  }
}

export function toCreateUserDto(values: UserFormValues): CreateUserDto {
  const gender: Gender = values.gender === 'female' ? 'female' : 'male'
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    username: values.username.trim(),
    password: values.password,
    age: Number(values.age),
    gender,
    phone: values.phone.trim(),
  }
}

/** При редагуванні порожній пароль означає «залишити без змін», тому в DTO його не передаємо. */
export function toUpdateUserDto(values: UserFormValues): UpdateUserDto {
  const { password, ...rest } = toCreateUserDto(values)
  return password ? { ...rest, password } : rest
}
