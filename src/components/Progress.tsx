import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from 'recharts'
import { EXERCISES } from '../data/exercises'
import { formatDate, startOfWeekIso } from '../lib/date'
import { useAppState } from '../state/AppStateContext'
import { Card } from './ui'

const AXIS_COLOR = '#64748b'
const GRID_COLOR = '#1e293b'

export default function Progress() {
  const { state } = useAppState()
  const { bodyweightLog, logs } = state

  const loggedExerciseIds = useMemo(() => {
    const ids = new Set<string>()
    logs.forEach((l) => l.exercises.forEach((e) => ids.add(e.exerciseId)))
    return Array.from(ids)
  }, [logs])

  const [selectedExercise, setSelectedExercise] = useState<string>(loggedExerciseIds[0] ?? '')

  const bodyweightData = bodyweightLog
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({ date: formatDate(e.date), weight: e.weightKg }))

  const volumeByWeek = useMemo(() => {
    const map = new Map<string, number>()
    logs.forEach((l) => {
      const week = startOfWeekIso(l.date)
      const vol = l.exercises.reduce((s, e) => s + e.sets.reduce((ss, set) => ss + (set.completed ? set.reps * set.weightKg : 0), 0), 0)
      map.set(week, (map.get(week) ?? 0) + vol)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, volume]) => ({ week: formatDate(week), volume: Math.round(volume) }))
  }, [logs])

  const exerciseProgression = useMemo(() => {
    if (!selectedExercise) return []
    return logs
      .filter((l) => l.exercises.some((e) => e.exerciseId === selectedExercise))
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((l) => {
        const ex = l.exercises.find((e) => e.exerciseId === selectedExercise)!
        const completed = ex.sets.filter((s) => s.completed)
        const topWeight = completed.length > 0 ? Math.max(...completed.map((s) => s.weightKg)) : 0
        return { date: formatDate(l.date), weight: topWeight }
      })
  }, [logs, selectedExercise])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Progress</h2>

      <Card>
        <h3 className="font-semibold mb-3">Body weight</h3>
        {bodyweightData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bodyweightData}>
              <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke={AXIS_COLOR} fontSize={12} />
              <YAxis stroke={AXIS_COLOR} fontSize={12} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} />
              <Line type="monotone" dataKey="weight" stroke="#22a563" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-500">Log your body weight from the Today tab to see a trend.</p>
        )}
      </Card>

      <Card>
        <h3 className="font-semibold mb-3">Weekly training volume (kg × reps)</h3>
        {volumeByWeek.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={volumeByWeek}>
              <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke={AXIS_COLOR} fontSize={12} />
              <YAxis stroke={AXIS_COLOR} fontSize={12} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} />
              <Bar dataKey="volume" fill="#22a563" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-500">Complete a workout to start tracking volume.</p>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Exercise progression</h3>
          {loggedExerciseIds.length > 0 && (
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm"
            >
              {loggedExerciseIds.map((id) => (
                <option key={id} value={id}>
                  {EXERCISES.find((e) => e.id === id)?.name ?? id}
                </option>
              ))}
            </select>
          )}
        </div>
        {exerciseProgression.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={exerciseProgression}>
              <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke={AXIS_COLOR} fontSize={12} />
              <YAxis stroke={AXIS_COLOR} fontSize={12} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }} />
              <Line type="monotone" dataKey="weight" stroke="#45c07e" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-500">No logged exercises yet.</p>
        )}
      </Card>
    </div>
  )
}
