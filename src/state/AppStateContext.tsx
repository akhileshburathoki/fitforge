import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { generatePlan } from '../lib/planGenerator'
import { id, loadState, saveState } from '../lib/storage'
import { AppState, BodyweightEntry, MealEntry, Profile, WorkoutLog } from '../types'

interface AppStateApi {
  state: AppState
  setProfile: (profile: Omit<Profile, 'createdAt'>) => void
  regeneratePlan: () => void
  logWorkout: (log: Omit<WorkoutLog, 'id'>) => void
  addBodyweightEntry: (weightKg: number, date?: string) => void
  addMeal: (meal: Omit<MealEntry, 'id'>) => void
  deleteMeal: (mealId: string) => void
  resetAll: () => void
  importState: (next: AppState) => void
}

const AppStateContext = createContext<AppStateApi | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const api = useMemo<AppStateApi>(
    () => ({
      state,
      setProfile: (profile) => {
        const full: Profile = { ...profile, createdAt: new Date().toISOString() }
        const plan = generatePlan(full)
        setState((s) => ({ ...s, profile: full, plan, nextDayIndex: 0 }))
      },
      regeneratePlan: () => {
        setState((s) => {
          if (!s.profile) return s
          return { ...s, plan: generatePlan(s.profile), nextDayIndex: 0 }
        })
      },
      logWorkout: (log) => {
        setState((s) => {
          const newLog: WorkoutLog = { ...log, id: id() }
          const dayCount = s.plan?.days.length ?? 1
          return {
            ...s,
            logs: [...s.logs, newLog],
            nextDayIndex: (s.nextDayIndex + 1) % dayCount,
          }
        })
      },
      addBodyweightEntry: (weightKg, date) => {
        setState((s) => {
          const entry: BodyweightEntry = { id: id(), date: date ?? new Date().toISOString(), weightKg }
          return { ...s, bodyweightLog: [...s.bodyweightLog, entry] }
        })
      },
      addMeal: (meal) => {
        setState((s) => ({ ...s, nutritionLog: [...s.nutritionLog, { ...meal, id: id() }] }))
      },
      deleteMeal: (mealId) => {
        setState((s) => ({ ...s, nutritionLog: s.nutritionLog.filter((m) => m.id !== mealId) }))
      },
      resetAll: () => {
        setState({ profile: null, plan: null, nextDayIndex: 0, logs: [], bodyweightLog: [], nutritionLog: [] })
      },
      importState: (next) => {
        setState(next)
      },
    }),
    [state],
  )

  return <AppStateContext.Provider value={api}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateApi {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
