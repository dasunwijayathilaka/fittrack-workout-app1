import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const WorkoutLayout = () => {
  return (
    <Stack screenOptions={{ animation: "slide_from_right" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: "Workout Form" }} />
    </Stack>
  );
};

export default WorkoutLayout;
