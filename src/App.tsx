import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Nutrition from './components/Nutrition'
import Onboarding from './components/Onboarding'
import Progress from './components/Progress'
import Settings from './components/Settings'
import WorkoutSession from './components/WorkoutSession'
import { useAppState } from './state/AppStateContext'
import { WorkoutDayPlan } from './types'

type Tab = 'dashboard' | 'progress' | 'nutrition' | 'settings'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Today', icon: '🏠' },
  { key: 'progress', label: 'Progress', icon: '📈' },
  { key: 'nutrition', label: 'Nutrition', icon: '🍎' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function App() {
  const { state } = useAppState()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [activeDay, setActiveDay] = useState<WorkoutDayPlan | null>(null)

  if (!state.profile) {
    return <Onboarding />
  }

  if (activeDay) {
    return <WorkoutSession day={activeDay} onDone={() => setActiveDay(null)} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 py-4 border-b border-slate-800 flex items-center gap-2">
        <span className="text-2xl">💪</span>
        <h1 className="text-lg font-bold tracking-tight text-accent-400">FitForge</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 max-w-2xl w-full mx-auto px-4 pt-4">
        {tab === 'dashboard' && <Dashboard onStartWorkout={(day) => setActiveDay(day)} />}
        {tab === 'progress' && <Progress />}
        {tab === 'nutrition' && <Nutrition />}
        {tab === 'settings' && <Settings />}
      </main>

      <nav className="fixed bottom-0 inset-x-0 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-2xl mx-auto grid grid-cols-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                tab === t.key ? 'text-accent-400' : 'text-slate-500'
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
