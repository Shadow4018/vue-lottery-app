import { http } from './http-client'
import { ACCESS_TOKEN_TTL_MINUTES } from '@/shared/config/constants'
import type { AuthTokens, LoginCredentials, LoginResponse } from '@/entities/session/model/types'
import type { User } from '@/entities/user/model/types'
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
