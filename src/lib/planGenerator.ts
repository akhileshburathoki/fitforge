import { EXERCISES } from '../data/exercises'
import { Equipment, Exercise, ExperienceLevel, Goal, MuscleGroup, PlanExercise, Profile, WeeklyPlan, WorkoutDayPlan } from '../types'
import { id } from './storage'

interface GoalScheme {
  sets: number
  repMin: number
  repMax: number
  restSeconds: number
}

const GOAL_SCHEMES: Record<Goal, GoalScheme> = {
  strength: { sets: 5, repMin: 3, repMax: 6, restSeconds: 150 },
  hypertrophy: { sets: 4, repMin: 8, repMax: 12, restSeconds: 75 },
  fat_loss: { sets: 3, repMin: 12, repMax: 15, restSeconds: 45 },
  endurance: { sets: 3, repMin: 15, repMax: 20, restSeconds: 30 },
  general_fitness: { sets: 3, repMin: 10, repMax: 12, restSeconds: 60 },
}

const EXERCISES_PER_DAY: Record<ExperienceLevel, number> = {
  beginner: 5,
  intermediate: 6,
  advanced: 7,
}

// Muscle groups trained on each day, keyed by split name.
const SPLITS: Record<string, MuscleGroup[][]> = {
  full_body_1: [['chest', 'back', 'legs', 'shoulders', 'core']],
  full_body_2: [
    ['chest', 'back', 'legs', 'core'],
    ['shoulders', 'arms', 'legs', 'core'],
  ],
  full_body_3: [
    ['chest', 'back', 'legs', 'core'],
    ['shoulders', 'arms', 'legs', 'core'],
    ['chest', 'back', 'legs', 'shoulders'],
  ],
  upper_lower_4: [
    ['chest', 'back', 'shoulders', 'arms'],
    ['legs', 'core'],
    ['chest', 'back', 'shoulders', 'arms'],
    ['legs', 'core'],
  ],
  ppl_5: [
    ['chest', 'shoulders', 'arms'],
    ['back', 'arms'],
    ['legs', 'core'],
    ['chest', 'shoulders'],
    ['back', 'legs', 'core'],
  ],
  ppl_6: [
    ['chest', 'shoulders', 'arms'],
    ['back', 'arms'],
    ['legs', 'core'],
    ['chest', 'shoulders', 'arms'],
    ['back', 'arms'],
    ['legs', 'core'],
  ],
}

const DAY_NAMES: Record<string, string[]> = {
  full_body_1: ['Full Body'],
  full_body_2: ['Full Body A', 'Full Body B'],
  full_body_3: ['Full Body A', 'Full Body B', 'Full Body C'],
  upper_lower_4: ['Upper A', 'Lower A', 'Upper B', 'Lower B'],
  ppl_5: ['Push', 'Pull', 'Legs', 'Push', 'Pull & Legs'],
  ppl_6: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'],
}

function pickSplitKey(daysPerWeek: number): string {
  if (daysPerWeek <= 1) return 'full_body_1'
  if (daysPerWeek === 2) return 'full_body_2'
  if (daysPerWeek === 3) return 'full_body_3'
  if (daysPerWeek === 4) return 'upper_lower_4'
  if (daysPerWeek === 5) return 'ppl_5'
  return 'ppl_6'
}

function availableEquipment(profile: Profile): Equipment[] {
  const eq = new Set<Equipment>(profile.equipment)
  eq.add('bodyweight')
  return Array.from(eq)
}

function exercisesFor(muscleGroup: MuscleGroup, equipment: Equipment[]): Exercise[] {
  return EXERCISES.filter((e) => e.muscleGroup === muscleGroup && equipment.includes(e.equipment))
}

function buildDay(muscleGroups: MuscleGroup[], name: string, profile: Profile, scheme: GoalScheme): WorkoutDayPlan {
  const equipment = availableEquipment(profile)
  const targetCount = EXERCISES_PER_DAY[profile.experience]
  const used = new Set<string>()
  const picked: Exercise[] = []

  // First pass: one compound movement per muscle group in the day.
  for (const mg of muscleGroups) {
    const pool = exercisesFor(mg, equipment).filter((e) => e.type === 'compound' && !used.has(e.id))
    if (pool.length > 0) {
      const choice = pool[Math.floor(Math.random() * pool.length)]
      picked.push(choice)
      used.add(choice.id)
    }
  }

  // Second pass: fill remaining slots with isolation work across the day's muscle groups.
  let mgIndex = 0
  let guard = 0
  while (picked.length < targetCount && guard < 100) {
    guard++
    const mg = muscleGroups[mgIndex % muscleGroups.length]
    mgIndex++
    const pool = exercisesFor(mg, equipment).filter((e) => !used.has(e.id))
    if (pool.length > 0) {
      const choice = pool[Math.floor(Math.random() * pool.length)]
      picked.push(choice)
      used.add(choice.id)
    }
    if (mgIndex > muscleGroups.length * 6) break
  }

  const exercises: PlanExercise[] = picked.map((ex) => ({
    exerciseId: ex.id,
    sets: ex.type === 'isolation' ? Math.max(2, scheme.sets - 1) : scheme.sets,
    repMin: scheme.repMin,
    repMax: scheme.repMax,
    restSeconds: scheme.restSeconds,
  }))

  return { id: id(), name, exercises }
}

export function generatePlan(profile: Profile): WeeklyPlan {
  const scheme = GOAL_SCHEMES[profile.goal]
  const splitKey = pickSplitKey(profile.daysPerWeek)
  const groupsPerDay = SPLITS[splitKey]
  const names = DAY_NAMES[splitKey]

  const days = groupsPerDay.map((groups, i) => buildDay(groups, names[i], profile, scheme))

  return {
    id: id(),
    generatedAt: new Date().toISOString(),
    goal: profile.goal,
    days,
  }
}
