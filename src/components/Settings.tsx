import { ChangeEvent, useRef, useState } from 'react'
import { exportStateJson } from '../lib/storage'
import { useAppState } from '../state/AppStateContext'
import { ActivityLevel, Equipment, ExperienceLevel, Goal } from '../types'
import { Button, Card, Field, inputClass } from './ui'

const GOAL_OPTIONS: Goal[] = ['fat_loss', 'hypertrophy', 'strength', 'endurance', 'general_fitness']
const EXPERIENCE_OPTIONS: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced']
const ACTIVITY_OPTIONS: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'very_active']
const EQUIPMENT_OPTIONS: Equipment[] = ['dumbbell', 'barbell', 'kettlebell', 'machine', 'bands']

export default function Settings() {
  const { state, setProfile, regeneratePlan, resetAll, importState } = useAppState()
  const profile = state.profile!
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState('')

  function saveProfileField<K extends keyof typeof profile>(key: K, value: (typeof profile)[K]) {
    setProfile({ ...profile, [key]: value })
  }

  function toggleEquipment(eq: Equipment) {
    const next = profile.equipment.includes(eq) ? profile.equipment.filter((e) => e !== eq) : [...profile.equipment, eq]
    setProfile({ ...profile, equipment: next })
  }

  function handleExport() {
    const json = exportStateJson(state)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fitforge-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        importState(parsed)
        setImportError('')
      } catch {
        setImportError('That file could not be read as a FitForge backup.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleReset() {
    if (window.confirm('This will erase your profile, plan, and all logged data. Continue?')) {
      resetAll()
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Settings</h2>

      <Card className="space-y-3">
        <h3 className="font-semibold">Profile</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name">
            <input className={inputClass} value={profile.name} onChange={(e) => saveProfileField('name', e.target.value)} />
          </Field>
          <Field label="Weight (kg)">
            <input
              type="number"
              className={inputClass}
              value={profile.weightKg}
              onChange={(e) => saveProfileField('weightKg', Number(e.target.value))}
            />
          </Field>
          <Field label="Days per week">
            <select className={inputClass} value={profile.daysPerWeek} onChange={(e) => saveProfileField('daysPerWeek', Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Experience">
            <select className={inputClass} value={profile.experience} onChange={(e) => saveProfileField('experience', e.target.value as ExperienceLevel)}>
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Goal">
            <select className={inputClass} value={profile.goal} onChange={(e) => saveProfileField('goal', e.target.value as Goal)}>
              {GOAL_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o.replace('_', ' ')}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Activity level">
            <select className={inputClass} value={profile.activityLevel} onChange={(e) => saveProfileField('activityLevel', e.target.value as ActivityLevel)}>
              {ACTIVITY_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o.replace('_', ' ')}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Equipment">
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((eq) => (
              <button
                key={eq}
                onClick={() => toggleEquipment(eq)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  profile.equipment.includes(eq) ? 'border-accent-500 bg-accent-500/10 text-accent-300' : 'border-slate-700 text-slate-400'
                }`}
              >
                {eq}
              </button>
            ))}
          </div>
        </Field>
        <p className="text-xs text-slate-500">Changing profile settings regenerates your weekly plan.</p>
      </Card>

      <Card>
        <h3 className="font-semibold mb-2">Plan</h3>
        <p className="text-sm text-slate-400 mb-3">Not feeling the current split or exercise picks? Generate a fresh one.</p>
        <Button variant="secondary" onClick={regeneratePlan}>
          Regenerate plan
        </Button>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-semibold">Backup</h3>
        <p className="text-sm text-slate-400">All data lives only in this browser. Export a backup to keep it safe or move devices.</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            Export data
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Import data
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        </div>
        {importError && <p className="text-xs text-red-400">{importError}</p>}
      </Card>

      <Card>
        <h3 className="font-semibold mb-2 text-red-400">Danger zone</h3>
        <Button variant="danger" onClick={handleReset}>
          Erase all data
        </Button>
      </Card>
    </div>
  )
}
