import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const tabs = [
  { label: "Home", name: "home", icon: "home" },
  { label: "Workouts", name: "workouts", icon: "fitness-center" },
  { label: "Progress", name: "progress", icon: "trending-up" },
  { label: "Profile", name: "profile", icon: "person" },
] as const;

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#E5E7EB",
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      {tabs.map(({ name, icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default DashboardLayout;
