import { HttpError } from '../api/http-client'

/** Перетворює будь-яку помилку на текст, який можна показати користувачу. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message
  }
  if (error instanceof TypeError) {
    // fetch кидає TypeError, коли немає мережі або запит заблоковано
    return 'Network error. Check your internet connection and try again.'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Something went wrong. Please try again.'
}
