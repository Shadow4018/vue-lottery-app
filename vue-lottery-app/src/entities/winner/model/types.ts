export interface Winner {
  id: number
  name: string
}

/**
 * Кандидат у переможці. Описаний структурно (а не імпортом User з entities/user), бо слайси одного
 * шару не залежать один від одного: користувач із entities/user підходить за формою.
 */
export interface WinnerCandidate {
  id: number
  firstName: string
  lastName: string
}
