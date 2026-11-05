import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MAX_WINNERS } from '../config/constants'
import type { Winner, WinnerCandidate } from './types'
import { fullName } from '@/shared/lib'

export const useWinnersStore = defineStore('winners', () => {
  const winners = ref<Winner[]>([])

  /** Кандидати - лише ті, хто ще не став переможцем. */
  function candidatesFrom(users: readonly WinnerCandidate[]): WinnerCandidate[] {
    return users.filter((user) => !winners.value.some((winner) => winner.id === user.id))
  }

  function canPickFrom(users: readonly WinnerCandidate[]): boolean {
    return winners.value.length < MAX_WINNERS && candidatesFrom(users).length > 0
  }

  function pickFrom(users: readonly WinnerCandidate[]): void {
    if (!canPickFrom(users)) {
      return
    }
    const candidates = candidatesFrom(users)
    const chosen = candidates[Math.floor(Math.random() * candidates.length)]
    winners.value.push({ id: chosen.id, name: fullName(chosen) })
  }

  function remove(id: number): void {
    winners.value = winners.value.filter((winner) => winner.id !== id)
  }

  return { winners, canPickFrom, pickFrom, remove }
})
