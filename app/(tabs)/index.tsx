import React from "react";
import { NativeRouter, Route, Routes } from "react-router-native";
import LoginScreen from "@/app/(tabs)/Login";
import RegisterScreen from "@/app/(tabs)/Register";
import HomePage from "@/app/(tabs)/Home";

const App = () => {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </NativeRouter>
  );
};

export default App;
