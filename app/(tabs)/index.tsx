import React from "react";
import { NativeRouter, Route, Routes } from "react-router-native";
import LoginScreen from "@/app/(tabs)/Login";
import RegisterScreen from "@/app/(tabs)/Register";

const App = () => {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </NativeRouter>
  );
};

export default App;
