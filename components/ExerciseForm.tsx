import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Exercise } from "@/types/workout";
import { MaterialIcons } from "@expo/vector-icons";

interface ExerciseFormProps {
  exercise?: Exercise;
  onSave: (exercise: Exercise) => void;
  onCancel: () => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  exercise,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(exercise?.name || "");
  const [sets, setSets] = useState(exercise?.sets?.toString() || "");
  const [reps, setReps] = useState(exercise?.reps?.toString() || "");
  const [weight, setWeight] = useState(exercise?.weight?.toString() || "");
  const [duration, setDuration] = useState(
    exercise?.duration?.toString() || ""
  );
  const [notes, setNotes] = useState(exercise?.notes || "");

  const handleSave = () => {
    if (!name.trim()) return;

    const exerciseData: Exercise = {
      id: exercise?.id,
      name: name.trim(),
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: weight ? parseFloat(weight) : undefined,
      duration: duration ? parseFloat(duration) : undefined,
      notes: notes.trim() || undefined,
    };

    onSave(exerciseData);
  };

  return (
    <View className="bg-white p-4 rounded-lg border border-gray-300 mb-3">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold">
          {exercise ? "Edit Exercise" : "Add Exercise"}
        </Text>
        <TouchableOpacity onPress={onCancel}>
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Exercise name"
        className="border border-gray-300 rounded px-3 py-2 mb-3"
        value={name}
        onChangeText={setName}
      />

      <View className="flex-row justify-between mb-3">
        <TextInput
          placeholder="Sets"
          className="border border-gray-300 rounded px-3 py-2 flex-1 mr-2"
          value={sets}
          onChangeText={setSets}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Reps"
          className="border border-gray-300 rounded px-3 py-2 flex-1"
          value={reps}
          onChangeText={setReps}
          keyboardType="numeric"
        />
      </View>

      <View className="flex-row justify-between mb-3">
        <TextInput
          placeholder="Weight (kg)"
          className="border border-gray-300 rounded px-3 py-2 flex-1 mr-2"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Duration (min)"
          className="border border-gray-300 rounded px-3 py-2 flex-1"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
      </View>

      <TextInput
        placeholder="Notes (optional)"
        className="border border-gray-300 rounded px-3 py-2 mb-3"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={2}
      />

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded"
        onPress={handleSave}
      >
        <Text className="text-center text-white font-semibold">
          Save Exercise
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExerciseForm;
