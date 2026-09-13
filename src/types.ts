export type Equipment =
  | 'bodyweight'
  | 'dumbbell'
  | 'barbell'
  | 'kettlebell'
  | 'machine'
  | 'bands'
  | 'cardio'

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio'

export type Goal = 'strength' | 'hypertrophy' | 'fat_loss' | 'endurance' | 'general_fitness'

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'

export type Sex = 'male' | 'female' | 'other'

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'

export interface Profile {
  name: string
  sex: Sex
  age: number
  heightCm: number
  weightKg: number
  goal: Goal
  experience: ExperienceLevel
  daysPerWeek: number
  equipment: Equipment[]
  activityLevel: ActivityLevel
  createdAt: string
}

export type ExerciseType = 'compound' | 'isolation' | 'cardio'

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: Equipment
  type: ExerciseType
}

export interface PlanExercise {
  exerciseId: string
  sets: number
  repMin: number
  repMax: number
  restSeconds: number
}

export interface WorkoutDayPlan {
  id: string
  name: string
  exercises: PlanExercise[]
}

export interface WeeklyPlan {
  id: string
  generatedAt: string
  goal: Goal
  days: WorkoutDayPlan[]
}

export interface SetLog {
  setNumber: number
  reps: number
  weightKg: number
  completed: boolean
}

export interface ExerciseLog {
  exerciseId: string
  sets: SetLog[]
}

export interface WorkoutLog {
  id: string
  date: string
  dayPlanId: string
  dayName: string
  exercises: ExerciseLog[]
  durationMin?: number
}

export interface BodyweightEntry {
  id: string
  date: string
  weightKg: number
}

export interface MealEntry {
  id: string
  date: string
  name: string
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface AppState {
  profile: Profile | null
  plan: WeeklyPlan | null
  nextDayIndex: number
  logs: WorkoutLog[]
  bodyweightLog: BodyweightEntry[]
  nutritionLog: MealEntry[]
}

export const emptyState: AppState = {
  profile: null,
  plan: null,
  nextDayIndex: 0,
  logs: [],
  bodyweightLog: [],
  nutritionLog: [],
}
