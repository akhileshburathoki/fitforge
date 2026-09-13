import { FormEvent, useMemo, useState } from 'react'
import { todayIso } from '../lib/date'
import { calculateTargets } from '../lib/nutrition'
import { useAppState } from '../state/AppStateContext'
import { Button, Card, Field, ProgressBar, inputClass } from './ui'

export default function Nutrition() {
  const { state, addMeal, deleteMeal } = useAppState()
  const { profile, nutritionLog } = state
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')

  const targets = useMemo(() => (profile ? calculateTargets(profile) : null), [profile])

  const today = todayIso()
  const todaysMeals = nutritionLog.filter((m) => m.date.slice(0, 10) === today)

  const totals = todaysMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      proteinG: acc.proteinG + m.proteinG,
      carbsG: acc.carbsG + m.carbsG,
      fatG: acc.fatG + m.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  )

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!name || !calories) return
    addMeal({
      date: new Date().toISOString(),
      name,
      calories: Number(calories) || 0,
      proteinG: Number(protein) || 0,
      carbsG: Number(carbs) || 0,
      fatG: Number(fat) || 0,
    })
    setName('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Nutrition</h2>

      {targets && (
        <Card className="space-y-3">
          <h3 className="font-semibold">Today's targets</h3>
          <div className="space-y-2">
            <Row label="Calories" value={totals.calories} target={targets.calories} unit="kcal" colorClass="bg-accent-500" />
            <Row label="Protein" value={totals.proteinG} target={targets.proteinG} unit="g" colorClass="bg-sky-500" />
            <Row label="Carbs" value={totals.carbsG} target={targets.carbsG} unit="g" colorClass="bg-amber-500" />
            <Row label="Fat" value={totals.fatG} target={targets.fatG} unit="g" colorClass="bg-fuchsia-500" />
          </div>
        </Card>
      )}

      <Card>
        <h3 className="font-semibold mb-3">Log a meal</h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <Field label="Meal name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chicken & rice" />
          </Field>
          <div className="grid grid-cols-4 gap-2">
            <Field label="kcal">
              <input type="number" className={inputClass} value={calories} onChange={(e) => setCalories(e.target.value)} />
            </Field>
            <Field label="Protein">
              <input type="number" className={inputClass} value={protein} onChange={(e) => setProtein(e.target.value)} />
            </Field>
            <Field label="Carbs">
              <input type="number" className={inputClass} value={carbs} onChange={(e) => setCarbs(e.target.value)} />
            </Field>
            <Field label="Fat">
              <input type="number" className={inputClass} value={fat} onChange={(e) => setFat(e.target.value)} />
            </Field>
          </div>
          <Button type="submit" className="w-full">
            Add meal
          </Button>
        </form>
      </Card>

      <Card>
        <h3 className="font-semibold mb-3">Today's meals</h3>
        {todaysMeals.length === 0 ? (
          <p className="text-sm text-slate-500">No meals logged yet today.</p>
        ) : (
          <ul className="space-y-2">
            {todaysMeals.map((m) => (
              <li key={m.id} className="flex items-center justify-between text-sm border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-slate-500">
                    {m.calories} kcal · P{m.proteinG} C{m.carbsG} F{m.fatG}
                  </div>
                </div>
                <button className="text-slate-500 hover:text-red-400 text-xs" onClick={() => deleteMeal(m.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

function Row({ label, value, target, unit, colorClass }: { label: string; value: number; target: number; unit: string; colorClass: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span>
        <span>
          {Math.round(value)} / {target} {unit}
        </span>
      </div>
      <ProgressBar value={value} max={target} colorClass={colorClass} />
    </div>
  )
}
