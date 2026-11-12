import { http } from '@/shared/api'
import type { Authenticatable } from '@/shared/api'
import { env } from '@/shared/config'
import type { AuthTokens, AuthUser, LoginCredentials, LoginResponse } from '../model/types'

export class AuthService implements Authenticatable<AuthUser, LoginResponse, AuthTokens> {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { ...credentials, expiresInMins: env.accessTokenTtlMinutes },
    })
  }

  /** Захищений ендпоїнт: http-клієнт додає Authorization: Bearer і за потреби оновлює токен. */
  getCurrentUser(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me', { auth: true })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken, expiresInMins: env.accessTokenTtlMinutes },
    })
  }
}
