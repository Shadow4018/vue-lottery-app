export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/** Мінімальні дані користувача, які зберігаються разом із токенами. */
export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image?: string
}

export type LoginResponse = AuthUser & AuthTokens
