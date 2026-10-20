export type Gender = 'male' | 'female'

/** Користувач за схемою DummyJSON (описано поля, які використовує застосунок). */
export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password?: string
  birthDate?: string
  image?: string
  role?: string
  address?: {
    address?: string
    city?: string
    state?: string
    country?: string
  }
  company?: {
    name?: string
    title?: string
    department?: string
  }
}

/** Дані для створення користувача (id генерує сервер). */
export type CreateUserDto = Omit<User, 'id' | 'gender' | 'age' | 'password'> & {
  age: number
  gender: Gender
  password: string
}

export type UpdateUserDto = Partial<CreateUserDto>

/** Значення полів форми користувача - у формі все рядки, перетворення робить utils/user.ts. */
export interface UserFormValues {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: string
  gender: string
  phone: string
}
