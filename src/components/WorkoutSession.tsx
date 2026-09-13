import { useEffect, useMemo, useState } from 'react'
import { getExercise } from '../data/exercises'
import { suggestNextLoad } from '../lib/adaptive'
import { useAppState } from '../state/AppStateContext'
import { PlanExercise, SetLog, WorkoutDayPlan } from '../types'
import { Button, Card } from './ui'

interface ExerciseState {
  planExercise: PlanExercise
  reason: string
  sets: SetLog[]
}

function initExerciseState(pe: PlanExercise): ExerciseState {
  return {
    planExercise: pe,
    reason: '',
    sets: Array.from({ length: pe.sets }, (_, i) => ({ setNumber: i + 1, reps: pe.repMin, weightKg: 0, completed: false })),
  }
}

export default function WorkoutSession({ day, onDone }: { day: WorkoutDayPlan; onDone: () => void }) {
  const { state, logWorkout } = useAppState()
  const startTime = useMemo(() => Date.now(), [])
  const [restSeconds, setRestSeconds] = useState(0)

  const [exercises, setExercises] = useState<ExerciseState[]>(() =>
    day.exercises.map((pe) => {
      const suggestion = suggestNextLoad(pe, state.logs)
      const base = initExerciseState(pe)
      base.reason = suggestion.reason
      base.sets = base.sets.map((s) => ({ ...s, weightKg: suggestion.weightKg }))
      return base
    }),
  )

  useEffect(() => {
    if (restSeconds <= 0) return
    const t = setInterval(() => setRestSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [restSeconds])

  function updateSet(exIdx: number, setIdx: number, patch: Partial<SetLog>) {
    setExercises((prev) => {
      const next = [...prev]
      const ex = { ...next[exIdx] }
      const sets = [...ex.sets]
      sets[setIdx] = { ...sets[setIdx], ...patch }
      ex.sets = sets
      next[exIdx] = ex
      return next
    })
  }

  function toggleComplete(exIdx: number, setIdx: number) {
    const ex = exercises[exIdx]
    const set = ex.sets[setIdx]
    const nowCompleted = !set.completed
    updateSet(exIdx, setIdx, { completed: nowCompleted })
    if (nowCompleted) setRestSeconds(ex.planExercise.restSeconds)
  }

  function finish() {
    const durationMin = Math.round((Date.now() - startTime) / 60000)
    logWorkout({
      date: new Date().toISOString(),
      dayPlanId: day.id,
      dayName: day.name,
      exercises: exercises.map((e) => ({ exerciseId: e.planExercise.exerciseId, sets: e.sets })),
      durationMin,
    })
    onDone()
  }

  const totalSets = exercises.reduce((s, e) => s + e.sets.length, 0)
  const completedSets = exercises.reduce((s, e) => s + e.sets.filter((set) => set.completed).length, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-lg">{day.name}</h1>
          <p className="text-xs text-slate-400">
            {completedSets}/{totalSets} sets done
          </p>
        </div>
        <Button variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </header>

      {restSeconds > 0 && (
        <div className="bg-accent-500 text-slate-950 text-center py-2 font-bold flex items-center justify-center gap-3">
          Rest: {Math.floor(restSeconds / 60)}:{String(restSeconds % 60).padStart(2, '0')}
          <button className="underline text-sm font-semibold" onClick={() => setRestSeconds(0)}>
            Skip
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl w-full mx-auto space-y-4 pb-28">
        {exercises.map((ex, exIdx) => {
          const exercise = getExercise(ex.planExercise.exerciseId)
          return (
            <Card key={ex.planExercise.exerciseId}>
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-semibold">{exercise?.name ?? ex.planExercise.exerciseId}</h3>
                <span className="text-xs text-slate-500">
                  Target: {ex.planExercise.repMin}-{ex.planExercise.repMax} reps
                </span>
              </div>
              {ex.reason && <p className="text-xs text-accent-400 mb-3">{ex.reason}</p>}
              <div className="space-y-2">
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 text-xs text-slate-500 px-1">
                  <span>Set</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                  <span></span>
                </div>
                {ex.sets.map((set, setIdx) => (
                  <div key={set.setNumber} className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
                    <span className="w-6 text-center text-slate-400">{set.setNumber}</span>
                    <input
                      type="number"
                      step="0.5"
                      value={set.weightKg}
                      onChange={(e) => updateSet(exIdx, setIdx, { weightKg: Number(e.target.value) })}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(exIdx, setIdx, { reps: Number(e.target.value) })}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                    <button
                      onClick={() => toggleComplete(exIdx, setIdx)}
                      className={`w-9 h-9 rounded-lg font-bold text-sm ${
                        set.completed ? 'bg-accent-500 text-slate-950' : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      ✓
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </main>

      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur border-t border-slate-800 p-4">
        <div className="max-w-2xl mx-auto">
          <Button className="w-full" onClick={finish}>
            Finish Workout
          </Button>
        </div>
      </div>
    </div>
  )
}
