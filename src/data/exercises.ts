import { Exercise } from '../types'

export const EXERCISES: Exercise[] = [
  // Chest
  { id: 'barbell-bench-press', name: 'Barbell Bench Press', muscleGroup: 'chest', equipment: 'barbell', type: 'compound' },
  { id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', muscleGroup: 'chest', equipment: 'dumbbell', type: 'compound' },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', muscleGroup: 'chest', equipment: 'dumbbell', type: 'compound' },
  { id: 'pushup', name: 'Push-Up', muscleGroup: 'chest', equipment: 'bodyweight', type: 'compound' },
  { id: 'dumbbell-fly', name: 'Dumbbell Fly', muscleGroup: 'chest', equipment: 'dumbbell', type: 'isolation' },
  { id: 'machine-chest-press', name: 'Machine Chest Press', muscleGroup: 'chest', equipment: 'machine', type: 'compound' },
  { id: 'cable-crossover', name: 'Cable Crossover', muscleGroup: 'chest', equipment: 'machine', type: 'isolation' },

  // Back
  { id: 'pullup', name: 'Pull-Up', muscleGroup: 'back', equipment: 'bodyweight', type: 'compound' },
  { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'back', equipment: 'barbell', type: 'compound' },
  { id: 'dumbbell-row', name: 'One-Arm Dumbbell Row', muscleGroup: 'back', equipment: 'dumbbell', type: 'compound' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'back', equipment: 'machine', type: 'compound' },
  { id: 'seated-cable-row', name: 'Seated Cable Row', muscleGroup: 'back', equipment: 'machine', type: 'compound' },
  { id: 'band-pull-apart', name: 'Band Pull-Apart', muscleGroup: 'back', equipment: 'bands', type: 'isolation' },
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'back', equipment: 'barbell', type: 'compound' },
  { id: 'kettlebell-swing', name: 'Kettlebell Swing', muscleGroup: 'back', equipment: 'kettlebell', type: 'compound' },

  // Legs
  { id: 'barbell-squat', name: 'Barbell Back Squat', muscleGroup: 'legs', equipment: 'barbell', type: 'compound' },
  { id: 'goblet-squat', name: 'Goblet Squat', muscleGroup: 'legs', equipment: 'dumbbell', type: 'compound' },
  { id: 'bodyweight-squat', name: 'Bodyweight Squat', muscleGroup: 'legs', equipment: 'bodyweight', type: 'compound' },
  { id: 'lunge', name: 'Dumbbell Lunge', muscleGroup: 'legs', equipment: 'dumbbell', type: 'compound' },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'legs', equipment: 'machine', type: 'compound' },
  { id: 'leg-curl', name: 'Leg Curl', muscleGroup: 'legs', equipment: 'machine', type: 'isolation' },
  { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'legs', equipment: 'machine', type: 'isolation' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'legs', equipment: 'barbell', type: 'compound' },
  { id: 'kettlebell-goblet-squat', name: 'Kettlebell Goblet Squat', muscleGroup: 'legs', equipment: 'kettlebell', type: 'compound' },
  { id: 'calf-raise', name: 'Standing Calf Raise', muscleGroup: 'legs', equipment: 'bodyweight', type: 'isolation' },

  // Shoulders
  { id: 'overhead-press', name: 'Barbell Overhead Press', muscleGroup: 'shoulders', equipment: 'barbell', type: 'compound' },
  { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', equipment: 'dumbbell', type: 'compound' },
  { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'shoulders', equipment: 'dumbbell', type: 'isolation' },
  { id: 'front-raise', name: 'Front Raise', muscleGroup: 'shoulders', equipment: 'dumbbell', type: 'isolation' },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'shoulders', equipment: 'machine', type: 'isolation' },
  { id: 'pike-pushup', name: 'Pike Push-Up', muscleGroup: 'shoulders', equipment: 'bodyweight', type: 'compound' },
  { id: 'band-lateral-raise', name: 'Band Lateral Raise', muscleGroup: 'shoulders', equipment: 'bands', type: 'isolation' },

  // Arms
  { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'arms', equipment: 'barbell', type: 'isolation' },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', muscleGroup: 'arms', equipment: 'dumbbell', type: 'isolation' },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'arms', equipment: 'dumbbell', type: 'isolation' },
  { id: 'triceps-pushdown', name: 'Triceps Pushdown', muscleGroup: 'arms', equipment: 'machine', type: 'isolation' },
  { id: 'skull-crusher', name: 'Skull Crusher', muscleGroup: 'arms', equipment: 'barbell', type: 'isolation' },
  { id: 'dip', name: 'Triceps Dip', muscleGroup: 'arms', equipment: 'bodyweight', type: 'compound' },
  { id: 'band-curl', name: 'Band Curl', muscleGroup: 'arms', equipment: 'bands', type: 'isolation' },
  { id: 'close-grip-bench', name: 'Close-Grip Bench Press', muscleGroup: 'arms', equipment: 'barbell', type: 'compound' },

  // Core
  { id: 'plank', name: 'Plank', muscleGroup: 'core', equipment: 'bodyweight', type: 'isolation' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscleGroup: 'core', equipment: 'bodyweight', type: 'isolation' },
  { id: 'cable-crunch', name: 'Cable Crunch', muscleGroup: 'core', equipment: 'machine', type: 'isolation' },
  { id: 'russian-twist', name: 'Russian Twist', muscleGroup: 'core', equipment: 'dumbbell', type: 'isolation' },
  { id: 'situp', name: 'Sit-Up', muscleGroup: 'core', equipment: 'bodyweight', type: 'isolation' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', muscleGroup: 'core', equipment: 'bodyweight', type: 'isolation' },

  // Cardio / conditioning
  { id: 'jump-rope', name: 'Jump Rope', muscleGroup: 'cardio', equipment: 'cardio', type: 'cardio' },
  { id: 'burpee', name: 'Burpee', muscleGroup: 'cardio', equipment: 'bodyweight', type: 'cardio' },
  { id: 'mountain-climber', name: 'Mountain Climber', muscleGroup: 'cardio', equipment: 'bodyweight', type: 'cardio' },
  { id: 'rowing-machine', name: 'Rowing Machine', muscleGroup: 'cardio', equipment: 'cardio', type: 'cardio' },
  { id: 'kettlebell-swing-cardio', name: 'Kettlebell Swing (Conditioning)', muscleGroup: 'cardio', equipment: 'kettlebell', type: 'cardio' },
]

export function getExercise(exerciseId: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === exerciseId)
}
