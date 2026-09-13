import { AppState, emptyState } from '../types'

const STORAGE_KEY = 'fitforge_state_v1'

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState
    const parsed = JSON.parse(raw)
    return { ...emptyState, ...parsed }
  } catch {
    return emptyState
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function exportStateJson(state: AppState): string {
  return JSON.stringify(state, null, 2)
}

export function id(): string {
  return crypto.randomUUID()
}
