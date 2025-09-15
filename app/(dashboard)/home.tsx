import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getAllWorkoutsByUserId,
  getWorkoutStats,
} from "@/services/workoutService";
import { Workout, WorkoutStats } from "@/types/workout";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalDuration: 0,
    favoriteCategory: "Strength",
    weeklyGoal: 5,
    completedThisWeek: 0,
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.uid) return;

    try {
      const workouts = await getAllWorkoutsByUserId(user.uid);
      setRecentWorkouts(workouts.slice(0, 3));

      const workoutStats = await getWorkoutStats(user.uid);
      setStats(workoutStats);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-blue-500 pt-12 pb-6 px-6 rounded-b-3xl">
        <Text className="text-white text-2xl font-bold">
          Welcome back, {user?.displayName || "Fitness Enthusiast"}!
        </Text>
        <Text className="text-blue-100 text-lg mt-1">
          Ready for your next workout?
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 mt-6">
        {/* Quick Stats */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            This Week
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-500">
                {stats.completedThisWeek}
              </Text>
              <Text className="text-gray-600">Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-500">
                {stats.weeklyGoal}
              </Text>
              <Text className="text-gray-600">Goal</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-500">
                {Math.round((stats.completedThisWeek / stats.weeklyGoal) * 100)}
                %
              </Text>
              <Text className="text-gray-600">Progress</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-blue-500 rounded-xl p-4 flex-1 mr-3"
              onPress={() => router.push("/(dashboard)/workouts/new")}
            >
              <MaterialIcons name="add" size={24} color="#fff" />
              <Text className="text-white font-semibold mt-2">New Workout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-green-500 rounded-xl p-4 flex-1"
              onPress={() => router.push("/(dashboard)/workouts")}
            >
              <MaterialIcons name="list" size={24} color="#fff" />
              <Text className="text-white font-semibold mt-2">View All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Workouts */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Recent Workouts
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(dashboard)/workouts")}
            >
              <Text className="text-blue-500 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                className="border-b border-gray-100 py-3 last:border-b-0"
                onPress={() =>
                  router.push(`/(dashboard)/workouts/${workout.id}`)
                }
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="font-semibold text-gray-800">
                      {workout.name}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {workout.category} • {workout.duration} min
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#9CA3AF"
                  />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-gray-500 text-center py-4">
              No workouts yet. Create your first workout!
            </Text>
          )}
        </View>

        {/* Overall Stats */}
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Overall Stats
          </Text>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total Workouts</Text>
              <Text className="font-semibold">{stats.totalWorkouts}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total Duration</Text>
              <Text className="font-semibold">
                {Math.round(stats.totalDuration / 60)} hours
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Favorite Category</Text>
              <Text className="font-semibold">{stats.favoriteCategory}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
