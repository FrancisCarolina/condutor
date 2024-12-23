import React from "react";
import { NativeRouter, Route, Routes } from "react-router-native";
import LoginScreen from "@/app/(tabs)/Login";
import RegisterScreen from "@/app/(tabs)/Register";
import HomePage from "@/app/(tabs)/Home";
import SplashScreen from "@/app/(tabs)/Splash";

const App = () => {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </NativeRouter>
  );
};

export default App;
