import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/authService";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      title: "Personal Information",
      subtitle: "Update your details",
      icon: "person",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon"),
    },
    {
      title: "Workout Preferences",
      subtitle: "Set your fitness goals",
      icon: "settings",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon"),
    },
    {
      title: "Notifications",
      subtitle: "Manage your reminders",
      icon: "notifications",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon"),
    },
    {
      title: "Privacy & Security",
      subtitle: "Account security settings",
      icon: "security",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon"),
    },
    {
      title: "Help & Support",
      subtitle: "Get help and contact us",
      icon: "help",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon"),
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-blue-500 pt-12 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">Profile</Text>
        <Text className="text-blue-100 text-lg mt-1">Manage your account</Text>
      </View>

      <ScrollView className="flex-1">
        {/* User Info Card */}
        <View className="bg-white mx-6 mt-6 rounded-2xl p-6 shadow-sm">
          <View className="items-center">
            <View className="bg-blue-100 rounded-full w-20 h-20 items-center justify-center mb-4">
              <MaterialIcons name="person" size={40} color="#3B82F6" />
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {user?.displayName || "Fitness Enthusiast"}
            </Text>
            <Text className="text-gray-600 mt-1">{user?.email}</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Member since{" "}
              {new Date(
                user?.metadata?.creationTime || ""
              ).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white mx-6 mt-6 rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              className={`flex-row items-center p-6 ${
                index !== menuItems.length - 1 ? "border-b border-gray-100" : ""
              }`}
              onPress={item.onPress}
            >
              <MaterialIcons
                name={item.icon as any}
                size={24}
                color="#3B82F6"
              />
              <View className="flex-1 ml-4">
                <Text className="font-semibold text-gray-800">
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  {item.subtitle}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View className="bg-white mx-6 mt-6 rounded-2xl p-6 shadow-sm">
          <Text className="font-semibold text-gray-800 mb-2">
            About FitTrack
          </Text>
          <Text className="text-sm text-gray-600 mb-2">Version 1.0.0</Text>
          <Text className="text-sm text-gray-600">
            Your personal workout companion for achieving fitness goals.
          </Text>
        </View>

        {/* Logout Button */}
        <View className="mx-6 mt-6 mb-8">
          <TouchableOpacity
            className="bg-red-500 p-4 rounded-2xl"
            onPress={handleLogout}
          >
            <Text className="text-center text-white font-semibold text-lg">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
