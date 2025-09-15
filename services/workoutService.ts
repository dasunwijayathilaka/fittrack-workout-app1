import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Workout, WorkoutStats } from "@/types/workout";

export const workoutsRef = collection(db, "workouts");

export const createWorkout = async (workout: Workout) => {
  const workoutData = {
    ...workout,
    date: Timestamp.fromDate(new Date(workout.date)),
    completed: false,
  };
  const docRef = await addDoc(workoutsRef, workoutData);
  return docRef.id;
};

export const getAllWorkoutsByUserId = async (userId: string) => {
  const q = query(
    workoutsRef,
    where("userId", "==", userId),
    orderBy("date", "desc")
  );

  const querySnapshot = await getDocs(q);
  const workoutList = querySnapshot.docs.map((workoutRef) => ({
    id: workoutRef.id,
    ...workoutRef.data(),
    date: workoutRef.data().date?.toDate?.() || workoutRef.data().date,
  })) as Workout[];
  return workoutList;
};

export const getWorkoutById = async (id: string) => {
  const workoutDocRef = doc(db, "workouts", id);
  const snapshot = await getDoc(workoutDocRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      ...data,
      date: data.date?.toDate?.() || data.date,
    } as Workout;
  }
  return null;
};

export const updateWorkout = async (id: string, workout: Partial<Workout>) => {
  const workoutDocRef = doc(db, "workouts", id);
  const { id: _id, ...workoutData } = workout as any;

  if (workoutData.date) {
    workoutData.date = Timestamp.fromDate(new Date(workoutData.date));
  }

  return updateDoc(workoutDocRef, workoutData);
};

export const deleteWorkout = async (id: string) => {
  const workoutDocRef = doc(db, "workouts", id);
  return deleteDoc(workoutDocRef);
};

export const markWorkoutCompleted = async (id: string) => {
  const workoutDocRef = doc(db, "workouts", id);
  return updateDoc(workoutDocRef, { completed: true });
};

export const getWorkoutStats = async (
  userId: string
): Promise<WorkoutStats> => {
  const workouts = await getAllWorkoutsByUserId(userId);

  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const completedThisWeek = workouts.filter(
    (w) => w.completed && new Date(w.date) >= weekStart
  ).length;

  const categoryCount = workouts.reduce(
    (acc, workout) => {
      acc[workout.category] = (acc[workout.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const favoriteCategory = Object.keys(categoryCount).reduce(
    (a, b) => (categoryCount[a] > categoryCount[b] ? a : b),
    "Strength"
  );

  return {
    totalWorkouts: workouts.length,
    totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
    favoriteCategory,
    weeklyGoal: 5,
    completedThisWeek,
  };
};
