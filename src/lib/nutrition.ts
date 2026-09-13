import { ActivityLevel, Goal, Profile } from '../types'

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export interface NutritionTargets {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

function bmr(profile: Profile): number {
  const { sex, weightKg, heightCm, age } = profile
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  if (sex === 'male') return base + 5
  if (sex === 'female') return base - 161
  return base - 78
}

function calorieAdjustment(goal: Goal): number {
  switch (goal) {
    case 'fat_loss':
      return -500
    case 'strength':
    case 'hypertrophy':
      return 250
    default:
      return 0
  }
}

function proteinPerKg(goal: Goal): number {
  switch (goal) {
    case 'strength':
    case 'hypertrophy':
      return 2.2
    case 'fat_loss':
      return 2.0
    default:
      return 1.6
  }
}

export function calculateTargets(profile: Profile): NutritionTargets {
  const tdee = bmr(profile) * ACTIVITY_MULTIPLIER[profile.activityLevel]
  const calories = Math.round(tdee + calorieAdjustment(profile.goal))
  const proteinG = Math.round(profile.weightKg * proteinPerKg(profile.goal))
  const fatCalories = calories * 0.25
  const fatG = Math.round(fatCalories / 9)
  const remainingCalories = calories - proteinG * 4 - fatCalories
  const carbsG = Math.max(0, Math.round(remainingCalories / 4))
  return { calories, proteinG, carbsG, fatG }
}
