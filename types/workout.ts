export interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // for cardio exercises in minutes
  notes?: string;
}

export interface Workout {
  id?: string;
  name: string;
  category: "Cardio" | "Strength" | "Abs" | "Yoga" | "Other";
  exercises: Exercise[];
  duration: number; // total workout duration in minutes
  date: Date | string;
  userId?: string;
  completed?: boolean;
  notes?: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  favoriteCategory: string;
  weeklyGoal: number;
  completedThisWeek: number;
}
