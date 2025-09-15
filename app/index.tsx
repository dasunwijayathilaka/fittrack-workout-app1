import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) router.replace("/home");
      else router.replace("/login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 w-full justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return null;
};

export default Index;
