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
import { register } from "@/services/authService";
import { MaterialIcons } from "@expo/vector-icons";

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      await register(email, password, name);
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Registration Failed", err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-blue-50 justify-center p-6">
      <View className="items-center mb-8">
        <MaterialIcons name="fitness-center" size={64} color="#3B82F6" />
        <Text className="text-3xl font-bold mt-4 text-blue-600">FitTrack</Text>
      </View>

      <View className="bg-white p-6 rounded-2xl shadow-lg">
        <Text className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Create Account
        </Text>

        <TextInput
          placeholder="Full Name"
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

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
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mb-4 text-gray-900"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          placeholder="Confirm Password"
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          className="bg-green-600 p-4 rounded-lg mb-4"
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-center text-lg font-semibold text-white">
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        <Pressable onPress={() => router.back()}>
          <Text className="text-center text-blue-500 text-lg">
            Already have an account? Sign In
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Register;
