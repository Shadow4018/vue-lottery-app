import { http } from '../api/http-client'
import { ACCESS_TOKEN_TTL_MINUTES } from '../constants'
import type { AuthTokens, LoginCredentials, LoginResponse } from '../types/auth'
import type { User } from '../types/user'
import type { Authenticatable } from './interfaces'

export class AuthService implements Authenticatable<User, LoginResponse, AuthTokens> {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { ...credentials, expiresInMins: ACCESS_TOKEN_TTL_MINUTES },
    })
  }

  /** Захищений ендпоїнт: http-клієнт додає Authorization: Bearer і за потреби оновлює токен. */
  getCurrentUser(): Promise<User> {
    return http<User>('/auth/me', { auth: true })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken, expiresInMins: ACCESS_TOKEN_TTL_MINUTES },
    })
  }
}
