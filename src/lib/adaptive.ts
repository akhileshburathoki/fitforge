import { getExercise } from '../data/exercises'
import { PlanExercise, WorkoutLog } from '../types'

export interface Suggestion {
  weightKg: number
  reason: string
}

const COMPOUND_STEP_KG = 2.5
const ISOLATION_STEP_KG = 1.25
const BODYWEIGHT_STEP_REPS = 1

function lastLogFor(exerciseId: string, logs: WorkoutLog[]) {
  for (let i = logs.length - 1; i >= 0; i--) {
    const found = logs[i].exercises.find((e) => e.exerciseId === exerciseId)
    if (found && found.sets.length > 0) return found
  }
  return undefined
}

/**
 * Suggests the next working weight for an exercise using simple progressive
 * overload: if every set last time hit the top of the rep range, add weight;
 * if sets were missed below the bottom of the range, hold or step back down.
 */
export function suggestNextLoad(planExercise: PlanExercise, logs: WorkoutLog[]): Suggestion {
  const exercise = getExercise(planExercise.exerciseId)
  const last = lastLogFor(planExercise.exerciseId, logs)

  if (!last) {
    return { weightKg: 0, reason: 'No history yet — start light and find a challenging weight.' }
  }

  const completedSets = last.sets.filter((s) => s.completed)
  if (completedSets.length === 0) {
    return { weightKg: last.sets[0]?.weightKg ?? 0, reason: 'Repeat last weight — no completed sets last time.' }
  }

  const lastWeight = Math.max(...completedSets.map((s) => s.weightKg))
  const hitTop = completedSets.every((s) => s.reps >= planExercise.repMax)
  const missedBottom = completedSets.some((s) => s.reps < planExercise.repMin)
  const step = exercise?.equipment === 'bodyweight' ? 0 : exercise?.type === 'isolation' ? ISOLATION_STEP_KG : COMPOUND_STEP_KG

  if (exercise?.equipment === 'bodyweight') {
    if (hitTop) return { weightKg: 0, reason: `Add ${BODYWEIGHT_STEP_REPS} rep(s) per set — you hit the top of the range.` }
    return { weightKg: 0, reason: 'Match last session — keep building reps toward the top of the range.' }
  }

  if (hitTop) {
    return { weightKg: lastWeight + step, reason: `Increase weight — you hit ${planExercise.repMax}+ reps on every set last time.` }
  }
  if (missedBottom) {
    return { weightKg: Math.max(0, lastWeight - step), reason: `Ease back slightly — reps fell below ${planExercise.repMin} last time.` }
  }
  return { weightKg: lastWeight, reason: 'Repeat this weight and aim for more reps.' }
}
