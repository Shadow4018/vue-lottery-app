import { AuthService } from '@/entities/session'
import { UserService } from '@/entities/user'
import { ServiceProvider } from '@/shared/api'

/** Реєстрація сервісів у ServiceProvider: шар app може залежати від усіх шарів. */
export function registerServices(): void {
  ServiceProvider.register('users', () => new UserService())
  ServiceProvider.register('auth', () => new AuthService())
}
