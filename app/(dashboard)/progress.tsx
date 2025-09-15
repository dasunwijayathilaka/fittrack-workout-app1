import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getAllWorkoutsByUserId,
  getWorkoutStats,
} from "@/services/workoutService";
import { Workout, WorkoutStats } from "@/types/workout";
import { MaterialIcons } from "@expo/vector-icons";

const ProgressScreen = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalDuration: 0,
    favoriteCategory: "Strength",
    weeklyGoal: 5,
    completedThisWeek: 0,
  });
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.uid) return;

    try {
      const workoutStats = await getWorkoutStats(user.uid);
      setStats(workoutStats);

      const workouts = await getAllWorkoutsByUserId(user.uid);
      setRecentWorkouts(workouts.filter((w) => w.completed).slice(0, 10));
    } catch (error) {
      console.error("Error loading progress data:", error);
    }
  };

  const getProgressPercentage = () => {
    return Math.min(
      Math.round((stats.completedThisWeek / stats.weeklyGoal) * 100),
      100
    );
  };

  const getCategoryStats = () => {
    const categoryCount = recentWorkouts.reduce(
      (acc, workout) => {
        acc[workout.category] = (acc[workout.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-blue-500 pt-12 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">Progress</Text>
        <Text className="text-blue-100 text-lg mt-1">
          Track your fitness journey
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 mt-6">
        {/* Weekly Progress */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Weekly Goal
          </Text>
          <View className="items-center mb-4">
            <View className="relative w-32 h-32 items-center justify-center">
              <View className="absolute w-32 h-32 rounded-full border-8 border-gray-200" />
              <View
                className="absolute w-32 h-32 rounded-full border-8 border-blue-500"
                style={{
                  transform: [
                    { rotate: `${(getProgressPercentage() / 100) * 360}deg` },
                  ],
                  borderTopColor: "transparent",
                  borderRightColor:
                    getProgressPercentage() > 25 ? "#3B82F6" : "transparent",
                  borderBottomColor:
                    getProgressPercentage() > 50 ? "#3B82F6" : "transparent",
                  borderLeftColor:
                    getProgressPercentage() > 75 ? "#3B82F6" : "transparent",
                }}
              />
              <Text className="text-2xl font-bold text-gray-800">
                {getProgressPercentage()}%
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-lg font-bold text-blue-500">
                {stats.completedThisWeek}
              </Text>
              <Text className="text-gray-600">Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-gray-800">
                {stats.weeklyGoal}
              </Text>
              <Text className="text-gray-600">Goal</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-green-500">
                {Math.max(0, stats.weeklyGoal - stats.completedThisWeek)}
              </Text>
              <Text className="text-gray-600">Remaining</Text>
            </View>
          </View>
        </View>

        {/* Overall Statistics */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Overall Stats
          </Text>
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialIcons
                  name="fitness-center"
                  size={24}
                  color="#3B82F6"
                />
                <Text className="text-gray-700 ml-3">Total Workouts</Text>
              </View>
              <Text className="text-lg font-bold">{stats.totalWorkouts}</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialIcons name="schedule" size={24} color="#10B981" />
                <Text className="text-gray-700 ml-3">Total Time</Text>
              </View>
              <Text className="text-lg font-bold">
                {Math.round(stats.totalDuration / 60)} hours
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialIcons name="star" size={24} color="#F59E0B" />
                <Text className="text-gray-700 ml-3">Favorite Category</Text>
              </View>
              <Text className="text-lg font-bold">
                {stats.favoriteCategory}
              </Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Category Breakdown
          </Text>
          {getCategoryStats().map(([category, count]) => (
            <View
              key={category}
              className="flex-row items-center justify-between mb-3"
            >
              <Text className="text-gray-700">{category}</Text>
              <View className="flex-row items-center">
                <View className="bg-blue-500 rounded-full w-2 h-2 mr-2" />
                <Text className="font-semibold">{count} workouts</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Completed Workouts */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Recent Completed
          </Text>
          {recentWorkouts.length > 0 ? (
            recentWorkouts.slice(0, 5).map((workout) => (
              <View
                key={workout.id}
                className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <View>
                  <Text className="font-semibold text-gray-800">
                    {workout.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {workout.category} • {workout.duration} min
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">
                  {new Date(workout.date).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center py-4">
              No completed workouts yet
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProgressScreen;
