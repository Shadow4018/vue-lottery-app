export interface ListParams {
  limit?: number
  skip?: number
  /** Пошуковий запит. */
  q?: string
}

export interface PageResult<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

// Кожен інтерфейс описує одну можливість - сервіс реалізує лише ті, які йому потрібні.
export interface Readable<T> {
  getAll(params?: ListParams): Promise<PageResult<T>>
  getById(id: number): Promise<T>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable<TResult = void> {
  delete(id: number): Promise<TResult>
}

export interface Authenticatable<TUser, TSession, TTokens> {
  login(credentials: { username: string; password: string }): Promise<TSession>
  getCurrentUser(): Promise<TUser>
  refresh(refreshToken: string): Promise<TTokens>
}
