import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MAX_WINNERS } from '../constants'
import type { User } from '../types/user'
import type { Winner } from '../types/winner'
import { fullName } from '../utils/user'

export const useWinnersStore = defineStore('winners', () => {
  const winners = ref<Winner[]>([])

  /** Кандидати - лише ті, хто ще не став переможцем. */
  function candidatesFrom(users: readonly User[]): User[] {
    return users.filter((user) => !winners.value.some((winner) => winner.id === user.id))
  }

  function canPickFrom(users: readonly User[]): boolean {
    return winners.value.length < MAX_WINNERS && candidatesFrom(users).length > 0
  }

  function pickFrom(users: readonly User[]): void {
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
