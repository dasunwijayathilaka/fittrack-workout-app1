import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Workout } from "@/types/workout";
import { MaterialIcons } from "@expo/vector-icons";

interface WorkoutCardProps {
  workout: Workout;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Cardio":
        return "bg-red-100 border-red-300";
      case "Strength":
        return "bg-blue-100 border-blue-300";
      case "Abs":
        return "bg-green-100 border-green-300";
      case "Yoga":
        return "bg-purple-100 border-purple-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Cardio":
        return "favorite";
      case "Strength":
        return "fitness-center";
      case "Abs":
        return "sports-gymnastics";
      case "Yoga":
        return "self-improvement";
      default:
        return "sports";
    }
  };

  return (
    <View
      className={`p-4 mb-3 rounded-lg mx-4 border ${getCategoryColor(workout.category)} ${workout.completed ? "opacity-75" : ""}`}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {workout.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <MaterialIcons
              name={getCategoryIcon(workout.category)}
              size={16}
              color="#666"
            />
            <Text className="text-sm text-gray-600 ml-1">
              {workout.category}
            </Text>
          </View>
        </View>
        {workout.completed && (
          <MaterialIcons name="check-circle" size={24} color="#10B981" />
        )}
      </View>

      <Text className="text-sm text-gray-700 mb-2">
        {workout.exercises.length} exercises • {workout.duration} minutes
      </Text>

      <Text className="text-xs text-gray-500 mb-3">
        {new Date(workout.date).toLocaleDateString()}
      </Text>

      <View className="flex-row justify-between">
        <View className="flex-row">
          <TouchableOpacity
            className="bg-blue-500 px-3 py-1 rounded mr-2"
            onPress={onEdit}
          >
            <Text className="text-white text-sm">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 px-3 py-1 rounded"
            onPress={onDelete}
          >
            <Text className="text-white text-sm">Delete</Text>
          </TouchableOpacity>
        </View>

        {!workout.completed && (
          <TouchableOpacity
            className="bg-green-500 px-3 py-1 rounded"
            onPress={onComplete}
          >
            <Text className="text-white text-sm">Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default WorkoutCard;
