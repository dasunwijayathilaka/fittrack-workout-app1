import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { useEffect, useState } from "react";
import {
  deleteWorkout,
  getAllWorkoutsByUserId,
  markWorkoutCompleted,
} from "@/services/workoutService";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Workout } from "@/types/workout";
import { useLoader } from "@/context/LoaderContext";
import { useAuth } from "@/context/AuthContext";
import WorkoutCard from "@/components/WorkoutCard";

const WorkoutScreen = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const { user } = useAuth();

  const handleFetchData = async () => {
    if (!user?.uid) return;

    try {
      showLoader();
      const data = await getAllWorkoutsByUserId(user.uid);
      setWorkouts(data);
    } catch (error) {
      console.log("Error fetching workouts:", error);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await handleFetchData();
    setRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              showLoader();
              await deleteWorkout(id);
              await handleFetchData();
            } catch (err) {
              console.log("Error deleting workout:", err);
              Alert.alert("Error", "Failed to delete workout");
            } finally {
              hideLoader();
            }
          },
        },
      ]
    );
  };

  const handleComplete = async (id: string) => {
    try {
      showLoader();
      await markWorkoutCompleted(id);
      await handleFetchData();
    } catch (err) {
      console.log("Error completing workout:", err);
      Alert.alert("Error", "Failed to mark workout as completed");
    } finally {
      hideLoader();
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-blue-500 pt-12 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">My Workouts</Text>
        <Text className="text-blue-100 text-lg mt-1">
          {workouts.length} workout{workouts.length !== 1 ? "s" : ""} planned
        </Text>
      </View>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6 z-10">
        <Pressable
          className="bg-blue-500 rounded-full p-4 shadow-lg"
          onPress={() => router.push("/(dashboard)/workouts/new")}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 mt-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onEdit={() => router.push(`/(dashboard)/workouts/${workout.id}`)}
              onDelete={() => {
                if (workout.id) handleDelete(workout.id);
              }}
              onComplete={() => {
                if (workout.id) handleComplete(workout.id);
              }}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center p-8">
            <MaterialIcons name="fitness-center" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-600 mt-4 text-center">
              No workouts yet
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Create your first workout to get started!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default WorkoutScreen;
