import React, { createContext, useContext, useState, ReactNode } from "react";
import { Workout, WorkoutStats } from "@/types/workout";

interface WorkoutContextType {
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
  stats: WorkoutStats;
  setStats: (stats: WorkoutStats) => void;
  refreshWorkouts: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalDuration: 0,
    favoriteCategory: "Strength",
    weeklyGoal: 5,
    completedThisWeek: 0,
  });

  const refreshWorkouts = () => {
    // This will be called to refresh workout data
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        setWorkouts,
        stats,
        setStats,
        refreshWorkouts,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context)
    throw new Error("useWorkout must be used within WorkoutProvider");
  return context;
};
