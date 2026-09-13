import { useMemo, useState } from 'react'
import { getExercise } from '../data/exercises'
import { formatDate, startOfWeekIso, todayIso } from '../lib/date'
import { useAppState } from '../state/AppStateContext'
import { WorkoutDayPlan } from '../types'
import { Button, Card } from './ui'

function computeStreak(logDates: string[]): number {
  const days = new Set(logDates.map((d) => d.slice(0, 10)))
  let streak = 0
  const cursor = new Date()
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export default function Dashboard({ onStartWorkout }: { onStartWorkout: (day: WorkoutDayPlan) => void }) {
  const { state, addBodyweightEntry } = useAppState()
  const { profile, plan, logs, bodyweightLog } = state
  const [weightInput, setWeightInput] = useState('')

  const today = todayIso()
  const weekStart = startOfWeekIso(today)
  const currentDay = plan?.days[state.nextDayIndex]

  const streak = useMemo(() => computeStreak(logs.map((l) => l.date)), [logs])

  const weekVolume = useMemo(() => {
    return logs
      .filter((l) => l.date.slice(0, 10) >= weekStart)
      .reduce((sum, l) => sum + l.exercises.reduce((s, e) => s + e.sets.reduce((ss, set) => ss + (set.completed ? set.reps * set.weightKg : 0), 0), 0), 0)
  }, [logs, weekStart])

  const weekWorkouts = logs.filter((l) => l.date.slice(0, 10) >= weekStart).length

  const latestWeight = bodyweightLog.length > 0 ? bodyweightLog[bodyweightLog.length - 1] : null

  function submitWeight() {
    const val = parseFloat(weightInput)
    if (!Number.isNaN(val) && val > 0) {
      addBodyweightEntry(val)
      setWeightInput('')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Hey {profile?.name} 👋</h2>
        <p className="text-slate-400 text-sm">{formatDate(today)} · {profile?.goal.replace('_', ' ')}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <div className="text-2xl font-bold text-accent-400">{streak}</div>
          <div className="text-xs text-slate-400">day streak</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-accent-400">{weekWorkouts}</div>
          <div className="text-xs text-slate-400">workouts this week</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-accent-400">{Math.round(weekVolume).toLocaleString()}</div>
          <div className="text-xs text-slate-400">kg volume (wk)</div>
        </Card>
      </div>

      {currentDay && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">{currentDay.name}</h3>
            <span className="text-xs text-slate-400">{currentDay.exercises.length} exercises</span>
          </div>
          <ul className="text-sm text-slate-300 space-y-1 mb-4">
            {currentDay.exercises.map((pe) => {
              const ex = getExercise(pe.exerciseId)
              return (
                <li key={pe.exerciseId} className="flex justify-between">
                  <span>{ex?.name ?? pe.exerciseId}</span>
                  <span className="text-slate-500">
                    {pe.sets} × {pe.repMin}-{pe.repMax}
                  </span>
                </li>
              )
            })}
          </ul>
          <Button className="w-full" onClick={() => onStartWorkout(currentDay)}>
            Start Workout
          </Button>
        </Card>
      )}

      <Card>
        <h3 className="font-semibold mb-2">Body weight</h3>
        <p className="text-sm text-slate-400 mb-3">
          {latestWeight ? `Last logged: ${latestWeight.weightKg} kg on ${formatDate(latestWeight.date)}` : 'No entries yet.'}
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            placeholder="kg"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
          <Button variant="secondary" onClick={submitWeight}>
            Log
          </Button>
        </div>
      </Card>
    </div>
  )
}
