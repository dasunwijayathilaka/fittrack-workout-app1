import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { login } from "@/services/authService";
import { MaterialIcons } from "@expo/vector-icons";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/home");
    } catch (err) {
      console.error(err);
      Alert.alert("Login Failed", "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-blue-50 justify-center p-6">
      <View className="items-center mb-8">
        <MaterialIcons name="fitness-center" size={64} color="#3B82F6" />
        <Text className="text-3xl font-bold mt-4 text-blue-600">FitTrack</Text>
        <Text className="text-lg text-gray-600 mt-2">
          Your Workout Companion
        </Text>
      </View>

      <View className="bg-white p-6 rounded-2xl shadow-lg">
        <Text className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Welcome Back
        </Text>

        <TextInput
          placeholder="Email"
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mb-4"
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-center text-lg font-semibold text-white">
              Login
            </Text>
          )}
        </TouchableOpacity>

        <Pressable onPress={() => router.push("/register")}>
          <Text className="text-center text-blue-500 text-lg">
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
