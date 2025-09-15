import React from "react";
import "./../global.css";
import { Slot } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { WorkoutProvider } from "@/context/WorkoutContext";

const RootLayout = () => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <WorkoutProvider>
          <Slot />
        </WorkoutProvider>
      </AuthProvider>
    </LoaderProvider>
  );
};

export default RootLayout;
