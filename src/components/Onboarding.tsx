import { FormEvent, useState } from 'react'
import { useAppState } from '../state/AppStateContext'
import { ActivityLevel, Equipment, ExperienceLevel, Goal, Sex } from '../types'
import { Button, Field, inputClass } from './ui'

const GOALS: { value: Goal; label: string }[] = [
  { value: 'fat_loss', label: 'Lose fat' },
  { value: 'hypertrophy', label: 'Build muscle' },
  { value: 'strength', label: 'Get stronger' },
  { value: 'endurance', label: 'Build endurance' },
  { value: 'general_fitness', label: 'General fitness' },
]

const EXPERIENCE: { value: ExperienceLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner (0-1 yr)' },
  { value: 'intermediate', label: 'Intermediate (1-3 yr)' },
  { value: 'advanced', label: 'Advanced (3+ yr)' },
]

const ACTIVITY: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary (desk job, little exercise)' },
  { value: 'light', label: 'Light (1-3 workouts/week)' },
  { value: 'moderate', label: 'Moderate (3-5 workouts/week)' },
  { value: 'active', label: 'Active (6-7 workouts/week)' },
  { value: 'very_active', label: 'Very active (physical job + training)' },
]

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'dumbbell', label: 'Dumbbells' },
  { value: 'barbell', label: 'Barbell' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'machine', label: 'Gym machines / cables' },
  { value: 'bands', label: 'Resistance bands' },
]

export default function Onboarding() {
  const { setProfile } = useAppState()
  const [name, setName] = useState('')
  const [sex, setSex] = useState<Sex>('male')
  const [age, setAge] = useState(25)
  const [heightCm, setHeightCm] = useState(175)
  const [weightKg, setWeightKg] = useState(75)
  const [goal, setGoal] = useState<Goal>('general_fitness')
  const [experience, setExperience] = useState<ExperienceLevel>('beginner')
  const [daysPerWeek, setDaysPerWeek] = useState(3)
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate')
  const [equipment, setEquipment] = useState<Equipment[]>(['dumbbell'])

  function toggleEquipment(eq: Equipment) {
    setEquipment((prev) => (prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setProfile({ name: name || 'Athlete', sex, age, heightCm, weightKg, goal, experience, daysPerWeek, equipment, activityLevel })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-1">
          <div className="text-3xl">💪</div>
          <h1 className="text-2xl font-bold text-accent-400">Welcome to FitForge</h1>
          <p className="text-slate-400 text-sm">Answer a few questions and we'll build your first training plan.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </Field>
          <Field label="Sex">
            <select className={inputClass} value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Age">
            <input type="number" min={13} max={100} className={inputClass} value={age} onChange={(e) => setAge(Number(e.target.value))} />
          </Field>
          <Field label="Height (cm)">
            <input type="number" min={100} max={250} className={inputClass} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} />
          </Field>
          <Field label="Weight (kg)">
            <input type="number" min={30} max={300} className={inputClass} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} />
          </Field>
          <Field label="Days per week">
            <select className={inputClass} value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6].map((d) => (
                <option key={d} value={d}>
                  {d} day{d > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Primary goal">
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((g) => (
              <button
                type="button"
                key={g.value}
                onClick={() => setGoal(g.value)}
                className={`px-3 py-2 rounded-xl text-sm font-medium border ${
                  goal === g.value ? 'border-accent-500 bg-accent-500/10 text-accent-300' : 'border-slate-700 text-slate-300'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Training experience">
          <select className={inputClass} value={experience} onChange={(e) => setExperience(e.target.value as ExperienceLevel)}>
            {EXPERIENCE.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Weekly activity level (outside training)">
          <select className={inputClass} value={activityLevel} onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}>
            {ACTIVITY.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Available equipment (bodyweight is always included)">
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((o) => (
              <button
                type="button"
                key={o.value}
                onClick={() => toggleEquipment(o.value)}
                className={`px-3 py-2 rounded-xl text-sm font-medium border ${
                  equipment.includes(o.value) ? 'border-accent-500 bg-accent-500/10 text-accent-300' : 'border-slate-700 text-slate-300'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </Field>

        <Button type="submit" className="w-full">
          Build my plan
        </Button>
      </form>
    </div>
  )
}
