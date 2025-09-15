import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createWorkout,
  getWorkoutById,
  updateWorkout,
} from "@/services/workoutService";
import { useLoader } from "@/context/LoaderContext";
import { useAuth } from "@/context/AuthContext";
import { Workout, Exercise } from "@/types/workout";
import { MaterialIcons } from "@expo/vector-icons";
import ExerciseForm from "@/components/ExerciseForm";

const categories = ["Cardio", "Strength", "Abs", "Yoga", "Other"] as const;

const WorkoutFormScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNew = !id || id === "new";
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const { user } = useAuth();

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<Workout["category"]>("Strength");
  const [duration, setDuration] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<
    Exercise | undefined
  >();

  useEffect(() => {
    const load = async () => {
      if (!isNew && id) {
        try {
          showLoader();
          const workout = await getWorkoutById(id);
          if (workout) {
            setName(workout.name);
            setCategory(workout.category);
            setDuration(workout.duration.toString());
            setExercises(workout.exercises || []);
            setNotes(workout.notes || "");
          }
        } catch (error) {
          console.error("Error loading workout:", error);
        } finally {
          hideLoader();
        }
      }
    };
    load();
  }, [id]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Workout name is required");
      return;
    }

    if (!duration.trim() || isNaN(Number(duration))) {
      Alert.alert("Validation Error", "Please enter a valid duration");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Validation Error", "Please add at least one exercise");
      return;
    }

    try {
      showLoader();
      const workoutData: Workout = {
        name: name.trim(),
        category,
        duration: Number(duration),
        exercises,
        notes: notes.trim(),
        date: new Date(),
        userId: user?.uid,
      };

      if (isNew) {
        await createWorkout(workoutData);
      } else {
        await updateWorkout(id, workoutData);
      }

      router.back();
    } catch (err) {
      console.error(`Error ${isNew ? "saving" : "updating"} workout:`, err);
      Alert.alert("Error", `Failed to ${isNew ? "save" : "update"} workout`);
    } finally {
      hideLoader();
    }
  };

  const handleAddExercise = (exercise: Exercise) => {
    if (editingExercise) {
      setExercises((prev) =>
        prev.map((ex) => (ex.id === editingExercise.id ? exercise : ex))
      );
      setEditingExercise(undefined);
    } else {
      setExercises((prev) => [
        ...prev,
        { ...exercise, id: Date.now().toString() },
      ]);
    }
    setShowExerciseForm(false);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowExerciseForm(true);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    Alert.alert("Delete Exercise", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId)),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-blue-500 pt-12 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">
          {isNew ? "New Workout" : "Edit Workout"}
        </Text>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-semibold mb-4">Workout Details</Text>

          <TextInput
            placeholder="Workout name"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            value={name}
            onChangeText={setName}
          />

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Category
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    className={`px-4 py-2 rounded-full mr-2 ${
                      category === cat ? "bg-blue-500" : "bg-gray-200"
                    }`}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      className={`${
                        category === cat ? "text-white" : "text-gray-700"
                      }`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <TextInput
            placeholder="Duration (minutes)"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Notes (optional)"
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">
              Exercises ({exercises.length})
            </Text>
            <TouchableOpacity
              className="bg-blue-500 rounded-lg px-4 py-2"
              onPress={() => setShowExerciseForm(true)}
            >
              <Text className="text-white font-medium">Add Exercise</Text>
            </TouchableOpacity>
          </View>

          {exercises.map((exercise) => (
            <View
              key={exercise.id}
              className="border border-gray-200 rounded-lg p-4 mb-3"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="font-semibold text-lg flex-1">
                  {exercise.name}
                </Text>
                <View className="flex-row">
                  <TouchableOpacity
                    className="p-1 mr-2"
                    onPress={() => handleEditExercise(exercise)}
                  >
                    <MaterialIcons name="edit" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-1"
                    onPress={() => handleDeleteExercise(exercise.id!)}
                  >
                    <MaterialIcons name="delete" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row flex-wrap">
                <Text className="text-gray-600 mr-4">
                  {exercise.sets} sets × {exercise.reps} reps
                </Text>
                {exercise.weight && (
                  <Text className="text-gray-600 mr-4">
                    {exercise.weight} kg
                  </Text>
                )}
                {exercise.duration && (
                  <Text className="text-gray-600">{exercise.duration} min</Text>
                )}
              </View>

              {exercise.notes && (
                <Text className="text-gray-500 text-sm mt-2">
                  {exercise.notes}
                </Text>
              )}
            </View>
          ))}

          {exercises.length === 0 && (
            <Text className="text-gray-500 text-center py-8">
              No exercises added yet. Tap "Add Exercise" to get started.
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mb-6"
          onPress={handleSubmit}
        >
          <Text className="text-center text-lg font-semibold text-white">
            {isNew ? "Create Workout" : "Update Workout"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showExerciseForm}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
            <ExerciseForm
              exercise={editingExercise}
              onSave={handleAddExercise}
              onCancel={() => {
                setShowExerciseForm(false);
                setEditingExercise(undefined);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WorkoutFormScreen;
